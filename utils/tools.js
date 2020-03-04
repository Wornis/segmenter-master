const { EOL } = require('os');

const formatFilterInput = ({ filter, row, params }) => {
  if (filter.type === 'all-users') return null;
  const {
    opt,
    opt: { columnFamily },
  } = filter;
  const data = row.data[`${columnFamily}`]
    ? row.data[`${columnFamily}`]
    : false;
  const filterValue = {
    data,
    columnFamily,
    params,
  };
  if (opt.date && Object.keys(opt.date).length) Object.assign(filterValue, { date: opt.date });
  if (opt.value && Object.keys(opt.value).length) Object.assign(filterValue, { value: opt.value });
  return filterValue;
};

const writePayload = (payload, stream) => new Promise((resolve) => {
  let toWrite = '';
  if (/Array/.test(Object.prototype.toString.call(payload))) {
    for (let i = 0; i < payload.length; i++) {
      if (i === (payload.length - 1)) {
        toWrite += `${payload[i]}${EOL}`;
      } else {
        toWrite += `${payload[i]},`;
      }
    }
  } else {
    const keys = Object.keys(payload);
    for (let i = 0; i < keys.length; i += 1) {
      if (i === (keys.length - 1)) {
        toWrite += `${payload[keys[i]]}${EOL}`;
      } else {
        toWrite += `${payload[keys[i]]},`;
      }
    }
  }
  stream.write(toWrite, 'utf-8', resolve);
});

const formatRange = (start, end) => {
  const range = {};
  const regexp = /^[\d-abcdef]*$/;
  regexp.test(start) ? range.start = start : null;
  regexp.test(end) ? range.end = end : null;
  return range;
};

module.exports = {
  formatFilterInput,
  writePayload,
  formatRange,
};
