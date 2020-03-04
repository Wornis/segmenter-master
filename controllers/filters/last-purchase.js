'use strict';

const moment = require('moment');

module.exports = {
  /**
   * Check if last purchase is older than a specific date
   *
   * @param {object} data - RowKey's purchases object.
   * @param {object} date
   * @param {integer} date.number - Number of <type> (i.e 30 days)
   * @param {integer} date.ts - Timestamp
   * @param {string} date.type - Days, weeks, months or years.
   */
  isLastPurchaseOlderThan: ({data, date}) => {
    if (!data)
      return false;

    const {number, ts, type} = date;

    const TIMESTAMP = ts
      ? moment(ts).unix()
      : moment().subtract(number, type).unix();

    const keys = Object.keys(data).reverse();
    const tmp = keys[0].split('#');

    return parseInt(tmp[tmp.length - 1], 10) < TIMESTAMP;
  },

  /**
   * Check if last purchase is more recent than a specific date
   *
   * @param {object} data - RowKey's purchases object.
   * @param {object} date
   * @param {integer} date.number - Number of <type> (i.e 30 days)
   * @param {integer} date.ts - Timestamp
   * @param {string} date.type - Days, weeks, months or years.
   */
  isLastPurchaseMoreRecentThan: ({data, date}) => {
    if (!data)
      return false;

    const {number, ts, type} = date;

    const TIMESTAMP = ts
      ? moment(ts).unix()
      : moment().subtract(number, type).unix();

    const keys = Object.keys(data).reverse();
    const tmp = keys[0].split('#');

    return parseInt(tmp[tmp.length - 1], 10) > TIMESTAMP;
  },

  /**
   * Check if last purchase is between two dates
   *
   * @param {object} data - RowKey's purchases object.
   * @param {object} date
   * @param {integer} date.from - Number of <type> (i.e 30 days)
   * @param {integer} date.to - Number of <type> (i.e 30 days)
   * @param {integer} date.tsFrom - Timestamp
   * @param {integer} date.tsTo - Timestamp
   * @param {string} date.type - Days, weeks, months or years.
   */
  isLastPurchaseBetween: ({data, date}) => {
    if (!data)
      return false;

    const {from, to, tsFrom, tsTo, type} = date;

    const TIMESTAMP_FROM = tsFrom
      ? moment(tsFrom).unix()
      : moment().subtract(from, type).unix();
    const TIMESTAMP_TO = tsTo
      ? moment(tsTo).unix()
      : moment().subtract(to, type).unix();

    const keys = Object.keys(data).reverse();
    const tmp = keys[0].split('#');
    return (
      parseInt(tmp[tmp.length - 1], 10) > TIMESTAMP_FROM &&
      parseInt(tmp[tmp.length - 1], 10) < TIMESTAMP_TO
    );
  },
};
