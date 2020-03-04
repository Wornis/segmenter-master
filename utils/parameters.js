const { getCurrencyRates } = require('../utils/currency-converter');
const mysql = require('../lib/mysql');

//* ***************** UPLIFT **************************
const getUpliftParams = async ({ appId, extractId, filterVersion }) => ({
  wantedExtractId: filterVersion && filterVersion.extractId ? filterVersion.extractId : extractId,
  window: (await mysql.pQuery({ sql: 'SELECT * FROM application WHERE id = ?', args: appId }))[0].uplift_window,
});
//* ***************************************************

//* ***************** HAS && HAS-NOT ******************

const toString = (val) => ((val || val === 0) ? `${val}` : '');

const isRangeSet = (value) => (value ? !!(toString(value.min) || toString(value.max)) : false);

const isDaySet = (value) => (value ? !!(value.days && value.days.length) : false);

const isSumSet = (value, columnFamily) => (value
  ? !!(value.sum_min && value.sum_max && value.sum_currency && columnFamily === 'pu')
  : false);

const isAvgSet = (value, columnFamily) => (value
  ? !!(value.avg_min && value.avg_max && value.avg_currency && columnFamily === 'pu')
  : false);

const getHasParams = async (value, columnFamily) => {
  const isSum = isSumSet(value, columnFamily);
  const isAvg = isAvgSet(value, columnFamily);
  return {
    rates: columnFamily === 'pu' && (isSum || isAvg) ? await getCurrencyRates() : null,
    isRange: isRangeSet(value),
    isDay: isDaySet(value),
    isSum,
    isAvg,
  };
};

//* ***************************************************

const getFilterParams = async ({ opt: { value, columnFamily }, type }, extractInfo) => ({
  [type]: {
    has: { ...await getHasParams(value, columnFamily) },
    'has-not': { ...await getHasParams(value, columnFamily) },
    uplift: { ...await getUpliftParams(extractInfo) },
    // Add there your next params rules
  }[type],
});

const handleFilter = async (filter, i, extractInfo) => {
  if (filter.type !== 'all-users') {
    if (filter.type === 'or') {
      return {
        [i]: await Promise.all(
          filter.filtersToCompare.map(async (tFilter) => getFilterParams(tFilter, extractInfo)),
        ),
      };
    } return { [i]: await getFilterParams(filter, extractInfo) };
  } return { [i]: {} };
};

const getParams = async (extractInfo) => {
  await mysql.init();
  const params = await Promise.all(
    extractInfo.filters.map(async (filter, i) => handleFilter(filter, i, extractInfo)),
  );
  return params.reduce((obj, param) => ({ ...obj, ...param }), {});
};

module.exports = { getParams };
