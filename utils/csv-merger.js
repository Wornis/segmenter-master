const axios = require('axios');

//TODO handle merger by this job

const triggerGCF = async ({
  final, files, header = '', bucketName, retry = 0,
}) => axios({
  url: 'https://europe-west1-ad4screen-us.cloudfunctions.net/ultimatorMerger',
  method: 'POST',
  headers: { 'Content-type': 'application/json' },
  data: {
    final,
    files,
    header,
    bucketName,
  },
}).catch(async (e) => {
  if (retry === 5) throw new Error(`After 5 retries, UltimatorMerger return errors: ${e}`);
  await new Promise((resolve) => setTimeout(resolve, ++retry * 2000));
  await triggerGCF({
    final, files, header, bucketName, retry,
  });
});


/**
 * Merge all CSV files.
 *
 * @param {string} bucketName - Bucket's name.
 * @param {array} aFilename - Array of CSV filenames
 * @param {integer} appId - Application ID.
 * @param {integer} extractId - Extract ID.
 */
exports.createFinalCSV = async ({
  aFilename,
  appId,
  extractId,
  bucketName,
}) => {
  // TODO: handle Count for each range
  const final = `app${appId}_${extractId}.csv`;
  console.log('Start merging files:', final);
  const files = aFilename.map((filename) => `tmp/${filename}.csv`);
  await triggerGCF({ final, files, bucketName });
  console.log('End merging files', final);
  return final;
};
