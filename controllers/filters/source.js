/**
 * Check if source match
 *
 * @param {object} data - RowKey's device object.
 * @param {object} value
 * @param {string} value.source - Attribution source.
 */
const matchSource = ({data, value}) => {
  if (!data || !data.source)
    return false;
  const { source } = value;
  if (data.source.length && data.source[0].value)
    return source.map(v => v.toLowerCase()).includes(data.source[0].value.toLowerCase());
  return false;
};

const notMatchSource = ({data, value}) => {
  return !matchSource({data, value});
};

module.exports = {
  matchSource,
  notMatchSource
};
