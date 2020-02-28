const execBash = require('./utils/execBash');
const RANGES = require('./utils/getRanges');

const NB_RANGES = 570;

const getCmd = (jobId) => [
  `export JOB_ID="${jobId}"`,
  '&&',
  'envsubst < ./job.yaml',
  '|',
  'kubectl apply -f -',
].join(' ');

const checkBody = (body) => {
  const { error, value } = require('./utils/validateBody')(body);
  if (error) {
    console.error(new Error(error));
    return process.exit(0);
  }
  return value;
};

const testBody = {
  appId: 161,
  getters: ['idfa'],
  filters: [{ type: 'has', name: 'hasFrom', opt: { columnFamily: 'op', date: { number: 180, type: 'days' }, value: { event: 'open', days: [] } } }, { type: 'or', filtersToCompare: [{ type: 'gender', name: 'notMatchGender', opt: { columnFamily: 'ev', value: { gender: { name: 'Female', value: 'f' } } } }, { type: 'gender', name: 'notMatchGender', opt: { columnFamily: 'ev', value: { gender: { name: 'Female', value: 'f' } } } }] }],
  extractType: 'auto',
  extractId: 127,
  bucketName: 'csv_split',
  queueId: '4',
};

const getRangeData = ({ appId, getters, filters }, uniqueKey) => RANGES(NB_RANGES)
  .map(({ end, start }, index) => JSON.stringify({
    appId, name: `file_${index}_${uniqueKey}`, start, end, getters, filters, workIndex: index,
  }));

const manageJob = async (body) => {
  const uniqueKey = `${Math.random().toString(36).substr(2, 9)}`;
  const jobId = `segmenter-master-${uniqueKey}`;

  const payload = checkBody(body);
  const {
    appId, getters, filters, extractType, extractId, bucketName, queueId,
  } = payload;
  const data = getRangeData(payload, uniqueKey);
  // await execBash(getCmd(jobId));
};

manageJob(process.env.BODY_FILTER || testBody)
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(new Error(e));
    return process.exit(1);
  });
