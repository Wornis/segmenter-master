const { merger } = require('./merger');

const triggerGCF = async ({
  final, files, header = '', bucketName, retry = 0,
}) => {
  await merger({
    final, files, header, bucketName,
  }).catch(async (e) => {
    console.error(e);
    if (retry === 8) throw new Error(`After 5 retries, UltimatorMerger return errors: ${e}`);
    await new Promise((resolve) => setTimeout(resolve, 1 + retry * 2000));
    await triggerGCF({
      final, files, header, bucketName, retry,
    });
  });
};

exports.createFinalCSV = async ({ bucketName, appId, extractId }, uniqueKey, nbRanges) => {
  const aFilename = Array(nbRanges).fill(null).map((v, i) => `file_${i}_${uniqueKey}`);
  const final = `app${appId}_${extractId}.csv`;
  console.log('Start merging files:', final);
  console.time(`End merging ${final}`);
  const files = aFilename.map((filename) => `tmp/${filename}.csv`);
  await triggerGCF({ final, files, bucketName });
  console.timeEnd(`End merging ${final}`);
  return final;
};
