/* eslint-disable no-console */
const { Storage } = require('@google-cloud/storage');
const storage = new Storage({ projectId: 'ad4screen-us' });
const { google } = require('googleapis');
const axios = require('axios');
const { EOL } = require('os');
const BATCH_SIZE = 32;
const MAX_FILES_LENGTH = 31 * BATCH_SIZE; // 31 Batches + header file

const TMP_BUCKET = 'tmp_ultimator';
const tmpBucket = storage.bucket(TMP_BUCKET);

const getAccessToken = async () => {
  const auth = new google.auth.GoogleAuth({
    scopes: [
      'https://www.googleapis.com/auth/devstorage.full_control',
      'https://www.googleapis.com/auth/devstorage.read_write',
      'https://www.googleapis.com/auth/cloud-platform',
    ],
  });
  const authClient = await auth.getClient();
  const { token } = await authClient.getAccessToken();
  return token;
};

const getBy32Batches = (files) => {
  const batches = [];
  while (files.length) {
    batches.push(files.splice(0, BATCH_SIZE));
  }
  return batches;
};

const getheaderFileName = async (header, finalName) => {
  const headerFileName = `header/${finalName}`;
  await tmpBucket.file(headerFileName).save(`${header}${EOL}`);
  return headerFileName;
};

const getParts = async (batches, commonOptions, finalName) => Promise.all(
  batches.map((batch, index) => axios
    .post(
      `https://www.googleapis.com/storage/v1/b/${TMP_BUCKET}/o/${encodeURIComponent(`parts/${finalName}/${index}`)}/compose`,
      { sourceObjects: batch.map((file) => ({ name: file })) },
      commonOptions,
    )),
);


const getFinal = async (bucketName, final, headerFileName, parts, commonOptions) => {
  const { data } = await axios.post(
    `https://www.googleapis.com/storage/v1/b/${TMP_BUCKET}/o/${encodeURIComponent(final)}/compose`,
    { sourceObjects: [{ name: headerFileName }, ...parts.map(({ data: name }) => ({ name }))] },
    commonOptions,
  );
  return {
    medialink: `${bucketName}|${data}`,
    error: false,
  };
};

const getCommonOptions = async () => {
  const token = await getAccessToken();
  return {
    headers: { Authorization: `Bearer ${token}` },
    transformResponse: [(data) => JSON.parse(data).name],
  };
};

module.exports.merger = async ({
  final, files, header, bucketName,
}) => {
  if (files.length > MAX_FILES_LENGTH) throw new Error('Files limit exceeded');
  const commonOptions = await getCommonOptions();
  const [finalName] = final.split('.');
  const headerFileName = await getheaderFileName(header, finalName);
  const batches = getBy32Batches(files);
  const parts = await getParts(batches, commonOptions, finalName);
  const response = await getFinal(bucketName, final, headerFileName, parts, commonOptions);
  await tmpBucket.file(final).move(storage.bucket(bucketName));
  return response;
};
