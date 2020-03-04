/**
   * Check if version match
   *
   * @param {object} data - RowKey's device object.
   * @param {object} value
   * @param {string} value.version - device version
   */
const matchVersion = ({ data, value }) => {
  if (!data || !data.version)
    return false;
  const { version } = value;
  if (data.version.length && data.version[0].value)
    return data.version[0].value.toLowerCase() === version.toLowerCase();
  return false;
};

const notMatchVersion = ({ data, value }) => !matchVersion({ data, value });

module.exports = {
  matchVersion,
  notMatchVersion
};
