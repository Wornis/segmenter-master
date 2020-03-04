'use strict';

const moment = require('moment');

exports.isValidPrintOrClick = ({ data, date, isValueValid, isValid, isBetween = false, FILTER }) => {
  if (!data || !data[FILTER])
    return isValid({ count: 0 });

  let count = 0;
  const { from, to, tsFrom, tsTo, type, number, ts } = date;
  const timestamps = data[FILTER].map(({ value }) => JSON.parse(value)[`${FILTER}Time`]);
  if (isBetween) {
    const TIMESTAMP_FROM = tsFrom
      ? moment(tsFrom).unix()
      : moment().subtract(from, type).unix();
    const TIMESTAMP_TO = tsTo
      ? moment(tsTo).unix()
      : moment().subtract(to, type).unix();
    timestamps.forEach(valueTs => isValueValid({ valueTs, TIMESTAMP_FROM, TIMESTAMP_TO }) ? count++ : null);
    return isValid({ count });
  } else {
    const TIMESTAMP = ts
      ? moment(ts).unix()
      : moment().subtract(number, type).unix();
    timestamps.forEach(valueTs => isValueValid({ valueTs, TIMESTAMP }) ? count++ : null);
    return isValid({ count });
  }
};
