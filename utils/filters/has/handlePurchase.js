'use strict';

const {supportedCurrencies} = require('../../currency-converter');

const currencyKeysAllowed = ['currency, loyalty, af_currency'];
const amountKeysAllowed = ['amount', 'price', 'sum', 'af_value', 'af_revenue'];

const currencyKeyRegex = new RegExp(`(?=.*(${currencyKeysAllowed.join('|')}))`, 'i');
const amountKeyRegex = new RegExp(`(?=.*(${amountKeysAllowed.join('|')}))`, 'i');
const amountRegex = new RegExp(/^\d+(?:\.\d+)?$/); // Will match all double numbers

const cleanCurrency = (dirtyString) => dirtyString.replace(/[|&;$%@'"<>()+,{}_\s]/gi, '').toUpperCase();
const cleanAmount = (amount) => amount.replace(/,/g, '.');

const getOldAjustPu = (value) => { // if received as {}_12.56_EUR
  try {
    const [tsum, tcurrency] = value.split('}_')[1].split('_');
    if (tsum && tcurrency)
      if (supportedCurrencies.includes(cleanCurrency(tcurrency)) && amountRegex.test(tsum))
        return {currency: tcurrency, amount: tsum};
    return false;
  } catch (e) {
    return false;
  }
};

const getGeneralPu = ({amount, currency}) => { // if received as {currency: EUR, amount: 13.54}
  if (amount && currency)
    return {currency, amount};
  return false;
};

// {af_currency:EUR,af_revenue:69.68,af_content_id:79638070} example received
// {af_quantity:1,af_revenue:0.003,af_currency:EUR,af_price":0} example received
const getOldPu = eventValue => {
  const currencyKeys = Object.keys(eventValue).filter(key => currencyKeyRegex.test(key));
  const amountKeys = Object.keys(eventValue).filter(key => amountKeyRegex.test(key));
  const currency = eventValue[
    currencyKeys.find(key => supportedCurrencies.includes(cleanCurrency(eventValue[key])))
  ];
  const amount = eventValue[
    amountKeys.find(key => amountRegex.test(cleanAmount(eventValue[key])))
  ];
  if (currency && amount)
    return {currency, amount};
  return null;
};

module.exports = ({value}) => {
  try {
    const oldAdjustPu = getOldAjustPu(value);
    if (oldAdjustPu)
      return oldAdjustPu;

    const eventValue = JSON.parse(value);
    const generalPu = getGeneralPu(eventValue);
    if (generalPu)
      return generalPu;

    const oldPu = getOldPu(eventValue);
    if (oldPu)
      return oldPu;
    return null;
  } catch (e) {
    return null;
  }
};
