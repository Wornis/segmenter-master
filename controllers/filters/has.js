const { isValidHas } = require('../../utils/filters/has/isValidHas');

module.exports = {
  /**
   * Check if user has at least one item of columnFamily.
   * If columnFamily is event, it checks event name.
   *
   * @param {object} data - RowKey's columnFamily object.
   * @param {object} value
   * @param {string} value.event - Event name to check.
   * @param {string} columnFamily - Column Family value (op/pu/ca/ev).
   * @param {Object} params - Additionnal params
   */
  hasAllTime: ({ data, value, columnFamily, params }) =>
    isValidHas({ data, value, columnFamily, params }),

  /**
   * Check if user has at least one item of columnFamily
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
  hasFrom: ({ data, date, value, columnFamily, params }) =>
    isValidHas({
      data,
      value,
      columnFamily,
      params,
      date,
      mapDateResult: ({ FROM_TIMESTAMP, result }) => result.filter(item => +item.ts >= FROM_TIMESTAMP)
    }),

  /**
   * Check if user has at least one item of columnFamily
   * to a specified date.
   * If columnFamily is event, it checks event name.
   *
   * @param {object} data - RowKey's columnFamily object.
   * @param {object} date
   * @param {integer} date.to - Number of <type> (i.e 15 days)
   * @param {integer} date.ts - From timestamp
   * @param {string} date.type - Days, weeks, months or years.
   * @param {object} value
   * @param {string} value.event - Event name to check.
   * @param {string} columnFamily - Column Family value (op/pu/ca/ev).
   * @param {Object} params - Additionnal params
   */
  hasTo: ({ data, date, value, columnFamily, params }) =>
    isValidHas({
      data,
      value,
      columnFamily,
      params,
      date,
      mapDateResult: ({ TO_TIMESTAMP, result }) => result.filter(item => +item.ts <= TO_TIMESTAMP)
    }),

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
  hasBetween: ({ data, date, value, columnFamily, params }) =>
    isValidHas({
      data,
      value,
      columnFamily,
      params,
      date,
      isBetween: true,
      mapDateResult: ({ FROM_TIMESTAMP, TO_TIMESTAMP, result }) =>
        result.filter(item => {
          const ts = +item.ts;
          return ts >= FROM_TIMESTAMP && ts <= TO_TIMESTAMP;
        })
    })
};
