'use strict';
const hasFilter = require('./has');

module.exports = {
  hasNotAllTime: ({data, value, columnFamily, params}) => !hasFilter.hasAllTime({data, value, columnFamily, params}),

  /**
   * Check if user has not done any specified event
   * from a specified date.
   * If columnFamily is event, it checks event name.
   *
   * @param {object} data - RowKey's columnFamily object.
   * @param {object} date
   * @param {integer} date.from - Number of <type> (i.e 15 days)
   * @param {integer} date.ts - From timestamp
   * @param {string} date.type - Days, weeks, months or years.
   * @param {object} value
   * @param {string} value.event - Event name to check.
   * @param {string} columnFamily - Column Family value (op/pu/ca/ev).
   * @param {Object} params - Additionnal params
   */
  hasNotFrom: ({data, date, value, columnFamily, params}) => !hasFilter.hasFrom({data, date, value, columnFamily, params}),


  /**
   * Check if user has not done any specified event
   * to a specified date.
   * If columnFamily is event, it checks event name.
   *
   * @param {object} data - RowKey's columnFamily object.
   * @param {object} date
   * @param {integer} date.to - Number of <type> (i.e 15 days)
   * @param {integer} date.ts - to timestamp
   * @param {string} date.type - Days, weeks, months or years.
   * @param {object} value
   * @param {string} value.event - Event name to check.
   * @param {string} columnFamily - Column Family value (op/pu/ca/ev).
   * @param {Object} params - Additionnal params
   */
  hasNotTo: ({data, date, value, columnFamily, params}) => !hasFilter.hasTo({data, date, value, columnFamily, params}),

  /**
   * Check if user has at least one item of columnFamily
   * between two specified dates.
   * If columnFamily is event, it checks event name.
   *
   * @param {object} data - RowKey's columnFamily object.
   * @param {object} date
   * @param {integer} date.from - Number of <type> (i.e 15 days)
   * @param {integer} date.to - Number of <type> (i.e 30 days)
   * @param {integer} date.tsFrom - From timestamp
   * @param {integer} date.tsTo - To timestamp
   * @param {string} date.type - Days, weeks, months or years.
   * @param {object} value
   * @param {string} value.event - Event name to check.
   * @param {string} columnFamily - Column Family value (op/pu/ca/ev).
   * @param {Object} params - Additionnal params
   */
  hasNotBetween: ({data, date, value, columnFamily, params}) => !hasFilter.hasBetween({data, date, value, columnFamily, params}),
};
