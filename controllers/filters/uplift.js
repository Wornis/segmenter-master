const moment = require('moment');

const isBlacklisted = ({ data: { blacklist }, params: { wantedExtractId, window } }) => {
  try {
    if (!blacklist) return false;
    const limit = moment().subtract(window, 'days');
    return blacklist.some(({ value }) => {
      const { extractId, upliftDate } = JSON.parse(value);
      const diff = moment.unix(upliftDate).diff(limit, 'days');
      return extractId === wantedExtractId && diff >= 0 && diff <= window;
    });
  } catch (e) {
    return false;
  }
};

const isWhitelisted = ({ data: { whitelist }, params: { wantedExtractId, window } }) => {
  try {
    if (!whitelist) return false;
    const limit = moment().subtract(window, 'days');
    return whitelist.some(({ value }) => {
      const { extractId, upliftDate } = JSON.parse(value);
      const diff = moment.unix(upliftDate).diff(limit, 'days');
      return extractId === wantedExtractId && diff >= 0 && diff <= window;
    });
  } catch (e) {
    return false;
  }
};


module.exports = {
  isBlacklisted,
  isWhitelisted,
  isNotBlacklisted: (data) => !isBlacklisted(data),
  isNotWhitelisted: (data) => !isWhitelisted(data),
};
