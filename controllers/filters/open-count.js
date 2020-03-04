'use strict';

const moment = require('moment');

module.exports = {

  /**
   * Check if open is more recent than a specific date with min value
   *
   * @param {object} data - RowKey's open object.
   * @param {object} date
   * @param {integer} date.number - Number of <type> (i.e 30 days)
   * @param {integer} date.ts - Timestamp
   * @param {string} date.type - Days, weeks, months or years.
   * @param {object} value
   * @param {integer} value.min - Number of entry min
   */
  isOpenMoreRecentThanWithMin: ({data, date, value}) => {
    if (!data)
      return false;

    const { number, ts, type } = date;
    const { min } = value;

    const TIMESTAMP = ts
      ? moment(ts).unix()
      : moment().subtract(number, type).unix();

    const keys = Object.keys(data);
    let count = 0;
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i].split('#');
      if (parseInt(key[key.length - 1], 10) > TIMESTAMP)
        count++;
    }
    return count >= min;
  },

  /**
   * Check if open is more recent than a specific date with max value
   *
   * @param {object} data - RowKey's open object.
   * @param {object} date
   * @param {integer} date.number - Number of <type> (i.e 30 days)
   * @param {integer} date.ts - Timestamp
   * @param {string} date.type - Days, weeks, months or years.
   * @param {object} value
   * @param {integer} value.max - Number of entry max
   */
  isOpenMoreRecentThanWithMax: ({data, date, value}) => {
    if (!data)
      return false;

    const { number, ts, type } = date;
    const { max } = value;
    const TIMESTAMP = ts
      ? moment(ts).unix()
      : moment().subtract(number, type).unix();

    const keys = Object.keys(data);
    let count = 0;
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i].split('#');
      if (parseInt(key[key.length - 1], 10) > TIMESTAMP)
        count++;
    }
    return count <= max;
  },

  /**
   * Check if open is more recent than a specific date with min and max value
   *
   * @param {object} data - RowKey's open object.
   * @param {object} date
   * @param {integer} date.number - Number of <type> (i.e 30 days)
   * @param {integer} date.ts - Timestamp
   * @param {string} date.type - Days, weeks, months or years.
   * @param {object} value
   * @param {integer} value.max - Number of entry max
   * @param {integer} value.min - Number of entry min
   */
  isOpenMoreRecentThanWithMinMax: ({data, date, value}) => {
    if (!data)
      return false;

    const { number, ts, type } = date;
    const { min, max } = value;
    const TIMESTAMP = ts
      ? moment(ts).unix()
      : moment().subtract(number, type).unix();

    const keys = Object.keys(data);
    let count = 0;
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i].split('#');
      if (parseInt(key[key.length - 1], 10) > TIMESTAMP)
        count++;
    }
    return (count <= max && count >= min);
  },

  /**
   * Check if open is older than a specific date with min value
   *
   * @param {object} data - RowKey's open object.
   * @param {object} date
   * @param {integer} date.number - Number of <type> (i.e 30 days)
   * @param {integer} date.ts - Timestamp
   * @param {string} date.type - Days, weeks, months or years.
   * @param {object} value
   * @param {integer} value.min - Number of entry min
   */
  isOpenOlderThanWithMin: ({data, date, value}) => {
    if (!data)
      return false;

    const { number, ts, type } = date;
    const { min } = value;
    const TIMESTAMP = ts
      ? moment(ts).unix()
      : moment().subtract(number, type).unix();

    const keys = Object.keys(data);
    let count = 0;
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i].split('#');
      if (parseInt(key[key.length - 1], 10) < TIMESTAMP)
        count++;
    }
    return count >= min;
  },

  /**
   * Check if open is older than a specific date with max value
   *
   * @param {object} data - RowKey's open object.
   * @param {object} date
   * @param {integer} date.number - Number of <type> (i.e 30 days)
   * @param {integer} date.ts - Timestamp
   * @param {string} date.type - Days, weeks, months or years.
   * @param {object} value
   * @param {integer} value.max - Number of entry max
   */
  isOpenOlderThanWithMax: ({data, date, value}) => {
    if (!data)
      return false;

    const { number, ts, type } = date;
    const { max } = value;
    const TIMESTAMP = ts
      ? moment(ts).unix()
      : moment().subtract(number, type).unix();

    const keys = Object.keys(data);
    let count = 0;
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i].split('#');
      if (parseInt(key[key.length - 1], 10) < TIMESTAMP)
        count++;
    }
    return count <= max;
  },

  /**
   * Check if open is older than a specific date with min and max value
   *
   * @param {object} data - RowKey's open object.
   * @param {object} date
   * @param {integer} date.number - Number of <type> (i.e 30 days)
   * @param {integer} date.ts - Timestamp
   * @param {string} date.type - Days, weeks, months or years.
   * @param {object} value
   * @param {integer} value.max - Number of entry max
   * @param {integer} value.min - Number of entry min
   */
  isOpenOlderThanWithMinMax: ({data, date, value}) => {
    if (!data)
      return false;

    const { number, ts, type } = date;
    const { min, max } = value;
    const TIMESTAMP = ts
      ? moment(ts).unix()
      : moment().subtract(number, type).unix();

    const keys = Object.keys(data);
    let count = 0;
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i].split('#');
      if (parseInt(key[key.length - 1], 10) < TIMESTAMP)
        count++;
    }
    return (count <= max && count >= min);
  },

  /**
   * Check if open is between two dates with min value
   *
   * @param {object} data - RowKey's open object.
   * @param {object} date
   * @param {integer} date.from - Number of <type> (i.e 30 days)
   * @param {integer} date.to - Number of <type> (i.e 30 days)
   * @param {integer} date.tsFrom - Timestamp
   * @param {integer} date.tsTo - Timestamp
   * @param {string} date.type - Days, weeks, months or years.
   * @param {object} value
   * @param {integer} value.min - Number of entry min
   */
  isOpenBetweenWithMin: ({data, date, value}) => {
    if (!data)
      return false;

    const { from, to, tsFrom, tsTo, type } = date;
    const { min } = value;
    const TIMESTAMP_FROM = tsFrom
      ? moment(tsFrom).unix()
      : moment().subtract(from, type).unix();
    const TIMESTAMP_TO = tsTo
      ? moment(tsTo).unix()
      : moment().subtract(to, type).unix();

    const keys = Object.keys(data);
    let count = 0;
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i].split('#');
      if (
        (parseInt(key[key.length - 1], 10) < TIMESTAMP_TO) &&
        (parseInt(key[key.length - 1], 10) > TIMESTAMP_FROM)
      )
        count++;
    }
    return count >= min;
  },

  /**
   * Check if open is between two dates with max value
   *
   * @param {object} data - RowKey's open object.
   * @param {object} date
   * @param {integer} date.from - Number of <type> (i.e 30 days)
   * @param {integer} date.to - Number of <type> (i.e 30 days)
   * @param {integer} date.tsFrom - Timestamp
   * @param {integer} date.tsTo - Timestamp
   * @param {string} date.type - Days, weeks, months or years.
   * @param {object} value
   * @param {integer} value.max - Number of entry max
   */
  isOpenBetweenWithMax: ({data, date, value}) => {
    if (!data)
      return false;

    const { from, to, tsFrom, tsTo, type } = date;
    const { max } = value;
    const TIMESTAMP_FROM = tsFrom
      ? moment(tsFrom).unix()
      : moment().subtract(from, type).unix();
    const TIMESTAMP_TO = tsTo
      ? moment(tsTo).unix()
      : moment().subtract(to, type).unix();

    const keys = Object.keys(data);
    let count = 0;
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i].split('#');
      if (
        (parseInt(key[key.length - 1], 10) < TIMESTAMP_TO) &&
        (parseInt(key[key.length - 1], 10) > TIMESTAMP_FROM)
      )
        count++;
    }
    return count <= max;
  },

  /**
   * Check if open is between two dates with min and max value
   *
   * @param {object} data - RowKey's open object.
   * @param {object} date
   * @param {integer} date.from - Number of <type> (i.e 30 days)
   * @param {integer} date.to - Number of <type> (i.e 30 days)
   * @param {integer} date.tsFrom - Timestamp
   * @param {integer} date.tsTo - Timestamp
   * @param {string} date.type - Days, weeks, months or years.
   * @param {object} value
   * @param {integer} value.max - Number of entry max
   * @param {integer} value.min - Number of entry min
   */
  isOpenBetweenWithMinMax: ({data, date, value}) => {
    if (!data)
      return false;

    const { from, to, tsFrom, tsTo, type } = date;
    const { min, max } = value;
    const TIMESTAMP_FROM = tsFrom
      ? moment(tsFrom).unix()
      : moment().subtract(from, type).unix();
    const TIMESTAMP_TO = tsTo
      ? moment(tsTo).unix()
      : moment().subtract(to, type).unix();

    const keys = Object.keys(data);
    let count = 0;
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i].split('#');
      if (
        (parseInt(key[key.length - 1], 10) < TIMESTAMP_TO) &&
        (parseInt(key[key.length - 1], 10) > TIMESTAMP_FROM)
      )
        count++;
    }
    return (count <= max && count >= min);
  },

  /**
   * Check if open all time with min value
   *
   * @param {object} data - RowKey's open object.
   * @param {object} value
   * @param {integer} value.min - Number of entry min
   */
  isOpenAllTimeWithMin: ({data, value}) => {
    if (!data)
      return false;
    const { min } = value;
    const keys = Object.keys(data);
    let count = 0;
    for (let i = 0; i < keys.length; i++) {
      count++;
    }
    return count >= min;
  },

  /**
   * Check if open all time with max value
   *
   * @param {object} data - RowKey's open object.
   * @param {object} value
   * @param {integer} value.max - Number of entry max
   */
  isOpenAllTimeWithMax: ({data, value}) => {
    if (!data)
      return false;
    const { max } = value;
    const keys = Object.keys(data);
    let count = 0;
    for (let i = 0; i < keys.length; i++) {
      count++;
    }
    return count <= max;
  },

  /**
   * Check if open all time with max value
   *
   * @param {object} data - RowKey's open object.
   * @param {object} value
   * @param {integer} value.max - Number of entry max
   * @param {integer} value.min - Number of entry min
   */
  isOpenAllTimeWithMinMax: ({data, value}) => {
    if (!data)
      return false;
    const { min, max } = value;
    const keys = Object.keys(data);
    let count = 0;
    for (let i = 0; i < keys.length; i++) {
      count++;
    }
    return (count >= min && count <= max);
  },
};
