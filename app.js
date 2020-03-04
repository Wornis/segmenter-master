const { PubSub } = require('@google-cloud/pubsub');
const pubsub = new PubSub();
const exec = require('./utils/execBash');
const RANGES = require('./utils/getRanges');
const { resizeNodePool } = require('./utils/resizeNodePool');
const { createFinalCSV } = require('./utils/csv-merger');
const defaultFilters = require('./utils/default-filters');
const { getParams } = require('./utils/parameters');

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
  value.filters = [...value.filters, ...defaultFilters];
  if (error) throw new Error(error);
  return value;
};

const getBufData = ({ appId, getters, filters }, params, uniqueKey) => RANGES(NB_RANGES)
  .map(({ end, start }, index) => Buffer.from(JSON.stringify({
    appId, name: `file_${index}_${uniqueKey}`, start, end, getters, filters, params
  })));

const createTopicAndPublish = async (topic, jobId, bufData) => {
  await topic.create();
  await topic.createSubscription(jobId, { ackDeadlineSeconds: 15 });
  await Promise.all(bufData.map((msg) => topic.publish(msg)));
};

const launchJob = (jobId) => exec([
  `export JOB_ID="${jobId}"`,
  '&&',
  'envsubst < ./workers.yaml',
  '|',
  'kubectl apply -f -',
].join(' '));

const waitEndOfJob = async (jobId) => exec( // 15 mn max, after that delay will throw an error
  `kubectl wait --for=condition=complete --timeout=15m job/${jobId}`,
);

const deleteTopic = async (topic, jobId) => {
  await topic.delete();
  await topic.subscription(jobId).delete();
};

const handleHighVMS = async () => {
  const segmenterJobs = (await exec('kubectl get jobs -o custom-columns=NAME:.metadata.name'))
    .split(' ')
    .filter((v) => v.includes('segmenter-master'));
  if (segmenterJobs.length === 1) { await resizeNodePool(); }
};

const manageJob = async (body) => {
  //const uniqueKey = `${Math.random().toString(36).substr(2, 9)}`;
  const uniqueKey = 'cmg31zsis'
  // const jobId = `segmenter-worker-${uniqueKey}`;
  // const topic = pubsub.topic(jobId);
  const payload = checkBody(body);
  // const params = await getParams(payload);
  // await createTopicAndPublish(topic, jobId, getBufData(payload, params, uniqueKey));
  // await launchJob(jobId);
  // await waitEndOfJob(jobId);
  // await deleteTopic(topic, jobId);
  await createFinalCSV(payload, uniqueKey, NB_RANGES);
  await handleHighVMS();
};

manageJob(process.env.BODY_FILTER || testBody)
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    return process.exit(1);
  });
