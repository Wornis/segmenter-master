/**
   * Check if source match
   *
   * @param {object} data - RowKey's purchase object.
   * @param {object} value
   * @param {string} value.gender - Attribution gender.
   */

const matchGender = ({data, value}) => {
  if (!data || !Object.keys(data).length)
    return false;

  const key = Object.keys(data)[0];
  if (!data[key].length)
    return false;

  const { gender } = value;
  if (gender.value === 'u' && !['m', 'f'].includes(data[key][0].value.toLowerCase()))
    return true;
  if (gender.value === data[key][0].value.toLowerCase())
    return true;
  return false;
};

const notMatchGender = ({data, value}) => !matchGender({data, value});

module.exports = {
  matchGender,
  notMatchGender
};
