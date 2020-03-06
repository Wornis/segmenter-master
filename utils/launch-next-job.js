/* eslint-disable camelcase */
const mysql = require('../lib/mysql');
const { sendToJobsManager } = require('./jobs-manager');

const getNextJob = async () => {
  const [{ idQueue, id_extract_auto, id_extract }] = await mysql.pQuery({
    sql: `
     SELECT id as idQueue, id_extract_auto, id_extract from globulus_queue 
     WHERE status = 'waiting' 
     order by id 
     limit 1
    `,
  });
  const tableId = id_extract_auto ? 'extract_auto' : 'extract';
  const extractId = id_extract_auto || id_extract;
  const [result] = await mysql.pQuery({ sql: `SELECT * FROM ${tableId} WHERE id = ${extractId}` });
  if (result) {
    return {
      appId: result.id_application,
      bucketName: 'extract-auto',
      getters: ['idfa'],
      filters: result.filter,
      extractId: result.id,
      queueId: idQueue,
      extractType: 'auto',
      filterVersion: result.version_filter,
    };
  }
  return null;
};


const launchNextJob = async () => {
  const jobOpt = await getNextJob();
  if (jobOpt) {
    await sendToJobsManager(jobOpt, { jobName: 'segmenter-master' });
    return true;
  }
  return false;
};

module.exports = { launchNextJob };
