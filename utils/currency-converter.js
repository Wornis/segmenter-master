/* eslint-disable no-restricted-syntax */
const axios = require('axios');

const ACCESS_KEY = 'b6153d84e99f414255ac3f8340c29890';
const URL = `http://data.fixer.io/api/latest?access_key=${ACCESS_KEY}`;

const supportedCurrencies = ['AED', 'AFN', 'ALL', 'AMD', 'ANG', 'AOA', 'ARS', 'AUD', 'AWG', 'AZN', 'BAM', 'BBD', 'BDT', 'BGN',
  'BHD', 'BIF', 'BMD', 'BND', 'BOB', 'BRL', 'BSD', 'BTC', 'BTN', 'BWP', 'BYN', 'BYR', 'BZD', 'CAD', 'CDF', 'CHF', 'CLF',
  'CLP', 'CNY', 'COP', 'CRC', 'CUC', 'CUP', 'CVE', 'CZK', 'DJF', 'DKK', 'DOP', 'DZD', 'EGP', 'ERN', 'ETB', 'EUR', 'FJD',
  'FKP', 'GBP', 'GEL', 'GGP', 'GHS', 'GIP', 'GMD', 'GNF', 'GTQ', 'GYD', 'HKD', 'HNL', 'HRK', 'HTG', 'HUF', 'IDR', 'ILS',
  'IMP', 'INR', 'IQD', 'IRR', 'ISK', 'JEP', 'JMD', 'JOD', 'JPY', 'KES', 'KGS', 'KHR', 'KMF', 'KPW', 'KRW', 'KWD', 'KYD',
  'KZT', 'LAK', 'LBP', 'LKR', 'LRD', 'LSL', 'LTL', 'LVL', 'LYD', 'MAD', 'MDL', 'MGA', 'MKD', 'MMK', 'MNT', 'MOP', 'MRO',
  'MUR', 'MVR', 'MWK', 'MXN', 'MYR', 'MZN', 'NAD', 'NGN', 'NIO', 'NOK', 'NPR', 'NZD', 'OMR', 'PAB', 'PEN', 'PGK', 'PHP',
  'PKR', 'PLN', 'PYG', 'QAR', 'RON', 'RSD', 'RUB', 'RWF', 'SAR', 'SBD', 'SCR', 'SDG', 'SEK', 'SGD', 'SHP', 'SLL', 'SOS',
  'SRD', 'STD', 'SVC', 'SYP', 'SZL', 'THB', 'TJS', 'TMT', 'TND', 'TOP', 'TRY', 'TTD', 'TWD', 'TZS', 'UAH', 'UGX', 'USD',
  'UYU', 'UZS', 'VEF', 'VND', 'VUV', 'WST', 'XAF', 'XAG', 'XAU', 'XCD', 'XDR', 'XOF', 'XPF', 'YER', 'ZAR', 'ZMK', 'ZMW',
  'ZWL'];

/**
 * @param baseCurrency {string} Currency that we want to convert
 * @param wantedCurrency Currency that we want from convert
 * @param revenue {string|number} sum that we want to convert from baseCurrency to wantedCurrency
 * @param rates {Object} rates of each currencies
 */
const convertCurrency = (baseCurrency, wantedCurrency, revenue, rates) => {
  if (baseCurrency === wantedCurrency) return revenue;
  const wantedRate = rates[wantedCurrency];
  const baseRate = rates[baseCurrency];
  if (wantedRate && baseRate) return (wantedRate / baseRate) * revenue;
  return null;
};

const getCurrencyRates = async () => {
  const memcached = require('../lib/memcached');
  await memcached.init((err) => (err ? console.log(err) : null));

  const isCached = await memcached.pGet('currency:EUR'); // Check if rates already set
  if (!isCached) {
    const datas = await axios({ url: URL, method: 'GET' }).then((data) => data.data.rates);
    const promises = [];
    for (const [key, value] of Object.entries(datas)) {
      promises.push(
        memcached.pSet({ key: `currency:${key}`, value: value.toString(), lifetime: 86400 })
          .catch((e) => e),
      );
    }


    const resolveds = await Promise.all(promises);
    if (resolveds.some((result) => result instanceof Error)) {
      throw resolveds.find((result) => result instanceof Error);
    }
  }
  const rates = {};
  for (const currency of supportedCurrencies) {
    // eslint-disable-next-line no-await-in-loop
    rates[currency] = parseFloat(await memcached.pGet(`currency:${currency}`));
  }
  return rates;
};

module.exports = { supportedCurrencies, getCurrencyRates, convertCurrency };
