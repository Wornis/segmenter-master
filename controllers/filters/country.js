module.exports = {

  /**
   * Check if country match
   *
   * @param {object} data - RowKey's device object.
   * @param {object} value
   * @param {string} value.country - country iso code
   */
  matchCountry: ({data, value}) => {
    if (!data || !data.country)
      return false;
    const { country } = value;
    if (data.country.length && data.country[0].value)
      return data.country[0].value.toLowerCase() === country.toLowerCase();
    return false;
  }
};
