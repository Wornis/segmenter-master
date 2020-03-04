
const {isValidPrintOrClick} = require('../../utils/filters/isValidPrintOrClick');

const FILTER = 'click';

module.exports = {

  isMoreRecentThanWithMin: ({data, date, value}) =>
    isValidPrintOrClick({
      data,
      date,
      isValueValid: ({valueTs, TIMESTAMP}) => valueTs > TIMESTAMP,
      isValid: ({count}) => count >= value.min,
      FILTER
    }),

  isMoreRecentThanWithMax: ({data, date, value}) =>
    isValidPrintOrClick({
      data,
      date,
      isValueValid: ({valueTs, TIMESTAMP}) => valueTs > TIMESTAMP,
      isValid: ({count}) => count <= value.max,
      FILTER
    }),

  isMoreRecentThanWithMinMax: ({data, date, value}) =>
    isValidPrintOrClick({
      data,
      date,
      isValueValid: ({valueTs, TIMESTAMP}) => valueTs > TIMESTAMP,
      isValid: ({count}) => (count <= value.max && count >= value.min),
      FILTER
    }),

  isOlderThanWithMin: ({data, date, value}) =>
    isValidPrintOrClick({
      data,
      date,
      isValueValid: ({valueTs, TIMESTAMP}) => valueTs < TIMESTAMP,
      isValid: ({count}) => count >= value.min,
      FILTER
    }),

  isOlderThanWithMax: ({data, date, value}) =>
    isValidPrintOrClick({
      data,
      date,
      isValueValid: ({valueTs, TIMESTAMP}) => valueTs < TIMESTAMP,
      isValid: ({count}) => count <= value.max,
      FILTER
    }),

  isOlderThanWithMinMax: ({data, date, value}) =>
    isValidPrintOrClick({
      data,
      date,
      isValueValid: ({valueTs, TIMESTAMP}) => valueTs < TIMESTAMP,
      isValid: ({count}) => (count <= value.max && count >= value.min),
      FILTER
    }),

  isBetweenWithMin: ({data, date, value}) =>
    isValidPrintOrClick({
      data,
      date,
      isBetween: true,
      isValueValid: ({valueTs, TIMESTAMP_TO, TIMESTAMP_FROM}) => valueTs < TIMESTAMP_TO && valueTs > TIMESTAMP_FROM,
      isValid: ({count}) => count >= value.min,
      FILTER
    }),

  isBetweenWithMax: ({data, date, value}) =>
    isValidPrintOrClick({
      data,
      date,
      isBetween: true,
      isValueValid: ({valueTs, TIMESTAMP_TO, TIMESTAMP_FROM}) => valueTs < TIMESTAMP_TO && valueTs > TIMESTAMP_FROM,
      isValid: ({count}) => count <= value.max,
      FILTER
    }),

  isBetweenWithMinMax: ({data, date, value}) =>
    isValidPrintOrClick({
      data,
      date,
      isBetween: true,
      isValueValid: ({valueTs, TIMESTAMP_TO, TIMESTAMP_FROM}) => valueTs < TIMESTAMP_TO &&  valueTs > TIMESTAMP_FROM,
      isValid: ({count}) => (count <= value.max && count >= value.min),
      FILTER
    })
};
