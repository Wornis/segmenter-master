module.exports = {
  /**
   * Check if city match
   *
   * @param {object} data - RowKey's device object.
   * @param {object} value {city: [string]}
   * @param {string} value.city - formatted city of wanted scenario
   */
  matchCity: ({data, value}) => {
    if (!data || !data.city)
      return false;
    if (data.city.length) {
      const lastCity = data.city.reduce((acc, val) => val.timestamp > acc.timestamp ? val : acc).value;
      return lastCity.toLowerCase() === value.city.toLowerCase();
    }
    return false;
  }
};
