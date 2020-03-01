const { PubSub } = require('@google-cloud/pubsub');
const pubsub = new PubSub();
const exec = require('./utils/execBash');
const RANGES = require('./utils/getRanges');
const { createFinalCSV } = require('./utils/csv-merger');

const NB_RANGES = 570;

const testBody = {
  appId: 161,
  getters: ['idfa'],
  filters: [{ type: 'has', name: 'hasFrom', opt: { columnFamily: 'op', date: { number: 180, type: 'days' }, value: { event: 'open', days: [] } } }, { type: 'or', filtersToCompare: [{ type: 'gender', name: 'notMatchGender', opt: { columnFamily: 'ev', value: { gender: { name: 'Female', value: 'f' } } } }, { type: 'gender', name: 'notMatchGender', opt: { columnFamily: 'ev', value: { gender: { name: 'Female', value: 'f' } } } }] }],
  extractType: 'auto',
  extractId: 127,
  bucketName: 'csv_split',
  queueId: '4',
};

const checkBody = (body) => {
  const { error, value } = require('./utils/validateBody')(body);
  if (error) throw new Error(error);
  return value;
};

const getBufData = ({ appId, getters, filters }, uniqueKey) => RANGES(NB_RANGES)
  .map(({ end, start }, index) => Buffer.from(JSON.stringify({
    appId, name: `file_${index}_${uniqueKey}`, start, end, getters, filters,
  })));

const publishRanges = async (topic, jobId, bufData) => {
  await topic.create();
  await topic.createSubscription(jobId, { ackDeadlineSeconds: 600 });
  await Promise.all(bufData.map((msg) => topic.publish(msg)));
};

const launchJob = (jobId) => [
  `export JOB_ID="${jobId}"`,
  '&&',
  'envsubst < ./job.yaml',
  '|',
  'kubectl apply -f -',
].join(' ');

const waitEndOfJob = async (jobId) => exec(
  `kubectl wait --for=condition=complete --timeout=-1s job/${jobId}`,
);

const deleteTopic = async (topic, jobId) => {
  await topic.delete();
  await topic.subscription(jobId).delete();
};

const makeFinalCSV = async ({
  bucketName, uniqueKey, appId, extractId, extractType, jwt,
}) => {
  const mergerOpt = {
    bucketName,
    aFilename: RANGES.map((v, i) => `file_${i}_${uniqueKey}`),
    appId,
    extractId,
  };
  await createFinalCSV(mergerOpt);
  // .then(finalFilename =>
  //   notifier({ jwt, extractId, filename: finalFilename, type: extractType })
  //   .catch(console.error))
  // .catch(err => {
  //   console.error(err);
  //   return notifier({jwt, extractId, filename: '', type: extractType,}).catch(console.error);
  // });
};

const manageJob = async (body) => {
  const uniqueKey = `${Math.random().toString(36).substr(2, 9)}`;
  const jobId = `segmenter-master-${uniqueKey}`;
  const topic = pubsub.topic(jobId);
  const payload = checkBody(body);
  const bufData = getBufData(payload, uniqueKey);

  await publishRanges(topic, jobId, bufData);
  await launchJob(jobId);
  await waitEndOfJob(jobId);
  await deleteTopic(topic, jobId);
  await makeFinalCSV(payload);
};

manageJob(process.env.BODY_FILTER || testBody)
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    return process.exit(1);
  });
