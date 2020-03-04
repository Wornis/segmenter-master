const moment = require('moment');
const { convertCurrency } = require('../../currency-converter');
const handlePurchase = require('./handlePurchase');

const formatRevenue = (value, wantedCurrency, rates) => {
  try {
    if (value) {
      const { amount, currency } = handlePurchase({ value });
      return convertCurrency(currency, wantedCurrency, amount, rates);
    }
    return null;
  } catch (e) {
    return null;
  }
};

const checkRange = (value, num) => {
  const min = +value.min || 0;
  const max = +value.max || Infinity;
  return num >= min && num <= max;
};

const isValid = ({ ts, event, columnFamily, params, value }) => {
  const dayOfWeek = parseInt(moment(parseInt(ts) * 1000).format('E'));
  if (columnFamily === 'ev') {
    return params.isDay
      ? event === value.event && value.days.includes(dayOfWeek)
      : event === value.event;
  } else {
    return params.isDay
      ? value.days.includes(dayOfWeek)
      : !!event;
  }
};

const isValidAmounts = ({ params, data, value }) => { // We will check if sums and avgs are respected
  if (params.isSum || params.isAvg) {
    const { sums, moy: { avg, count } } = data.reduce(({ sums, moy: { avg, count } }, { amountSum = 0, amountAvg = 0 }) =>
      ({ moy: { avg: avg + amountAvg, count: amountAvg > 0 ? count + 1 : count }, sums: sums + amountSum }), { sums: 0, moy: { avg:0, count:0 } });
    const average = count ? avg / count : null;
    if (params.isSum && !(sums >= value.sum_min && sums <= value.sum_max))
      return false;
    if (params.isAvg && !(average >= value.avg_min && average <= value.avg_max))
      return false;
  }
  return true;
};

const hasResult = ({ columnFamily, data, value, params }) => {
  const isValidSums = isValidAmounts({ params, data, value });
  if (isValidSums) {
    if (params.isRange) {
      const filteredData = data.filter(({ ts, event }) => isValid({ ts, event, columnFamily, params, value }));
      return checkRange(value, filteredData.length);
    } else { //We need there only 1 valid data for filters
      return data.some(({ ts, event }) => isValid({ ts, event, columnFamily, params, value }));
    }
  }
  return false;
};

exports.isValidHas = ({ data, value, columnFamily, params, date, mapDateResult, isBetween = false }) => {
  if (!data)
    return false;
  let FROM_TIMESTAMP;
  let TO_TIMESTAMP;

  if (date) {
    const { from, to, tsFrom, tsTo, type, number, ts } = date;
    if (isBetween) {
      FROM_TIMESTAMP = tsFrom ? moment(tsFrom).unix() : moment().subtract(from, type).unix();
      TO_TIMESTAMP = tsTo ? moment(tsTo).unix() : moment().subtract(to, type).unix();
    } else {
      FROM_TIMESTAMP = ts ? moment(ts).unix() : moment().subtract(number, type).unix();
      TO_TIMESTAMP = ts ? moment(ts).unix() : moment().subtract(number, type).unix();
    }
  }

  const result = Object.entries(data).map(([key, [data]]) => {
    const split = key.split('#');
    const item = { event: split[1], ts: split[split.length - 1] };
    if (params.isSum)
      item.amountSum = formatRevenue(data.value, value.sum_currency, params.rates) || 0;
    if (params.isAvg)
      item.amountAvg = formatRevenue(data.value, value.avg_currency, params.rates) || 0;
    return item;
  });

  return hasResult({
    columnFamily,
    data: date ? mapDateResult({ FROM_TIMESTAMP, TO_TIMESTAMP, result }) : result,
    value,
    params
  });
};

