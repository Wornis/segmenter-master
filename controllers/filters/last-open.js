'use strict';

const moment = require('moment');

module.exports = {
  /**
   * Check if last open is more recent than a specific date
   *
   * @param {object} data - RowKey's device object.
   * @param {object} date
   * @param {integer} date.number - Number of <type> (i.e 30 days)
   * @param {integer} date.ts - Timestamp
   * @param {string} date.type - Days, weeks, months or years.
   */
  isLastOpenMoreRecentThan: ({data, date}) => {
    if (!data || !data.lastop)
      return false;

    const {number, ts, type} = date;

    const TIMESTAMP = ts
      ? moment(ts).unix()
      : moment().subtract(number, type).unix();

    const lastOp = data.lastop[0].value;

    return lastOp >= TIMESTAMP;
  },

  /**
   * Check if last open is older than a specific date
   *
   * @param {object} data - RowKey's device object.
   * @param {object} date
   * @param {integer} date.number - Number of <type> (i.e 30 days)
   * @param {integer} date.ts - Timestamp
   * @param {string} date.type - Days, weeks, months or years.
   */
  isLastOpenOlderThan: ({data, date}) => {
    if (!data || !data.lastop)
      return false;

    const {number, ts, type} = date;

    const TIMESTAMP = ts
      ? moment(ts).unix()
      : moment().subtract(number, type).unix();

    const lastOp = data.lastop[0].value;

    return lastOp < TIMESTAMP;
  },

  /**
   * Check if last open is between start date and end date
   *
   * @param {object} data - RowKey's device object.
   * @param {object} date
   * @param {integer} date.from - Number of <type> (i.e 15 days)
   * @param {integer} date.to - Number of <type> (i.e 30 days)
   * @param {integer} date.tsFrom - From timestamp
   * @param {integer} date.tsTo - To timestamp
   * @param {string} date.type - Days, weeks, months or years.
   */
  isLastOpenBetween: ({data, date}) => {
    if (!data || !data.lastop)
      return false;

    const {from, to, tsFrom, tsTo, type} = date;
    const FROM_TIMESTAMP = tsFrom
      ? moment(tsFrom).unix()
      : moment().subtract(from, type).unix();
    const TO_TIMESTAMP = tsTo
      ? moment(tsTo).unix()
      : moment().subtract(to, type).unix();

    const lastOp = data.lastop[0].value;

    return (
      lastOp >= FROM_TIMESTAMP &&
      lastOp <= TO_TIMESTAMP
    );
  }
};
