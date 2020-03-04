'use strict';

const moment = require('moment');

module.exports = {

  /**
   * Check if install is older than a specific date
   *
   * @param {object} data - RowKey's device object.
   * @param {object} date
   * @param {integer} date.number - Number of <type> (i.e 30 days)
   * @param {integer} date.ts - Timestamp
   * @param {string} date.type - Days, weeks, months or years.
   */
  isInstallOlderThan: ({data, date}) => {
    if (!data || !data.install)
      return false;

    const {number, ts, type} = date;

    const TIMESTAMP = ts
      ? moment(ts).unix()
      : moment().subtract(number, type).unix();

    return data.install[0].value < TIMESTAMP;
  },

  /**
   * Check if install is more recent than a specific date
   *
   * @param {object} data - RowKey's device object.
   * @param {object} date
   * @param {integer} date.number - Number of <type> (i.e 30 days)
   * @param {integer} date.ts - Timestamp
   * @param {string} date.type - Days, weeks, months or years.
   */
  isInstallMoreRecentThan: ({data, date}) => {
    if (!data || !data.install)
      return false;

    const {number, ts, type} = date;

    const TIMESTAMP = ts
      ? moment(ts).unix()
      : moment().subtract(number, type).unix();

    return data.install[0].value > TIMESTAMP;
  },

  /**
   * Check if install is between two dates
   *
   * @param {object} data - RowKey's device object.
   * @param {object} date
   * @param {integer} date.from - Number of <type> (i.e 30 days)
   * @param {integer} date.to - Number of <type> (i.e 30 days)
   * @param {integer} date.tsFrom - Timestamp
   * @param {integer} date.tsTo - Timestamp
   * @param {string} date.type - Days, weeks, months or years.
   */
  isInstallBetween: ({data, date}) => {
    if (!data || !data.install)
      return false;

    const { from, to, tsFrom, tsTo, type } = date;
    const TIMESTAMP_FROM = tsFrom
      ? moment(tsFrom).unix()
      : moment().subtract(from, type).unix();
    const TIMESTAMP_TO = tsTo
      ? moment(tsTo).unix()
      : moment().subtract(to, type).unix();

    return (
      (data.install[0].value > TIMESTAMP_FROM) &&
      (data.install[0].value < TIMESTAMP_TO)
    );
  },

  /**
   * Check if install is more recent than a specific date
   *
   * @param {object} data - RowKey's device object.
   */
  isInstallAllTime: ({data}) => {
    return !(!data || !data.install);
  },
};
