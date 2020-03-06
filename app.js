const { PubSub } = require('@google-cloud/pubsub');
const pubsub = new PubSub();
const exec = require('./utils/execBash');
const RANGES = require('./utils/getRanges');
const { handleHighVMS } = require('./utils/resizeNodePool');
const { createFinalCSV } = require('./utils/csv-merger');
const defaultFilters = require('./utils/default-filters');
const { getParams } = require('./utils/parameters');
const mysql = require('./lib/mysql');
const { launchNextJob } = require('./utils/launch-next-job')

const NB_RANGES = 570;

const testBody = {
  appId: 156,
  getters: ['idfa'],
  filters: [{ type: 'all-users', name: 'matchAllUsers' }],
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
    appId, name: `file_${index}_${uniqueKey}`, start, end, getters, filters, params,
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

const manageJob = async (body) => {
  const uniqueKey = `${Math.random().toString(36).substr(2, 9)}`;
  const jobId = `segmenter-worker-${uniqueKey}`;
  const topic = pubsub.topic(jobId);
  const payload = checkBody(body);
  await mysql.init();
  const params = await getParams(payload);
  await createTopicAndPublish(topic, jobId, getBufData(payload, params, uniqueKey));
  await launchJob(jobId);
  await waitEndOfJob(jobId);
  await deleteTopic(topic, jobId);
  await createFinalCSV(payload, uniqueKey, NB_RANGES);
  await launchNextJob();
  await handleHighVMS();
};

manageJob(process.env.BODY_FILTER || testBody)
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    return process.exit(1);
  });
