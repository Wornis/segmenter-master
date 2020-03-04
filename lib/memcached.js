const Memcached = require('memjs');

const MEM_HOST = 'localhost:11211';

const setValue = (value) => {
  const type = Object.prototype.toString.call(value);
  const stringRegexp = /String/g;
  const numberRegexp = /Number/g;
  const arrayRegexp = /Array/g;
  const objectRegexp = /Object/g;
  if (stringRegexp.test(type)) {
    return `string:s:${value}`;
  } if (numberRegexp.test(type)) {
    return `number:s:${value}`;
  } if (objectRegexp.test(type) || arrayRegexp.test(type)) {
    return `toparse:s:${JSON.stringify(value)}`;
  }
  return null;
};

const getValue = (value) => {
  if (!value) return null;
  const stringified = value.toString();
  const splitted = stringified.split(':s:');
  const type = splitted[0];
  if (!splitted[1] && splitted !== 0) return null;
  switch (type) {
    case 'string':
      return splitted[1];
    case 'number':
      return parseInt(splitted[1], 10);
    case 'toparse':
      try {
        return JSON.parse(splitted[1]);
      } catch (e) {
        return null;
      }
    default:
      return null;
  }
};

module.exports = {
  init: (initCbk) => {
    const self = module.exports;
    const memcached = new Memcached.Client.create(MEM_HOST);

    self.get = (key, callback) => memcached.get(key, (err, value) => {
      if (err) return callback(err);
      const final = getValue(value);
      if (!final) return callback(null);
      return callback(null, final);
    });

    self.pGet = (key) => new Promise((resolve, reject) => {
      memcached.get(key, (err, result) => {
        if (err) return reject(err);
        const final = getValue(result);
        if (!final && final !== 0) resolve(null);
        return resolve(final);
      });
    });

    // lifetime in seconds
    self.set = (key, value, lifetime, callback) => {
      const val = setValue(value);
      memcached.set(key, val, { expires: lifetime }, callback);
    };

    self.pSet = ({ key, value, lifetime = 60 }) => new Promise((resolve, reject) => {
      memcached.set(key, setValue(value), { expires: lifetime }, (err) => {
        if (err) return reject(err);
        return resolve();
      });
    });

    self.delete = (key) => new Promise((resolve, reject) => {
      memcached.delete(key, (err) => {
        if (err) return reject(err);
        return resolve();
      });
    });
    self.increment = (key, value = 1) => new Promise((resolve, reject) => {
      memcached.increment(key, value, { initial: 1, expires: 60 * 60 * 24 }, (err) => {
        if (err) return reject(err);
        return resolve();
      });
    });

    self.getIncrement = (key) => new Promise((resolve, reject) => {
      memcached.get(key, (err, result) => {
        if (err) return reject(err);
        return resolve(parseInt(result, 10));
      });
    });
    return initCbk();
  },
};
