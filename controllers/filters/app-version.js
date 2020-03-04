const compare = (target, rowVersion) => {
  const splitTarget = target.split('.');
  const splitRowVersion = rowVersion.split('.');
  const k = Math.min(splitTarget.length, splitRowVersion.length);
  let t;
  let r;
  for (let i = 0; i < k; i++) {
    t = parseInt(splitTarget[i], 10)
    r = parseInt(splitRowVersion[i], 10)
    if (t > r) return 1;
    if (t < r) return -1;
  }
  if (splitTarget.length === splitRowVersion.length)
    return 0;
  return splitTarget.length > splitRowVersion.length ? 1 : -1;
};

/**
   * Check if appversion match
   *
   * @param {object} data - RowKey's device object.
   * @param {object} value
   * @param {string} value.appversion - device appversion
   */
const matchAppVersion = ({ data, value }) => {
  if (!data || !data.appversion)
    return false;
  const { appversion } = value;
  if (data.appversion.length && data.appversion[0].value)
    return data.appversion[0].value.toLowerCase() === appversion.toLowerCase();
  return false;
};

const notMatchAppVersion = ({ data, value }) => !matchAppVersion({ data, value });

const aboveAppVersion = ({ data, value }) => {
  if (!data || !data.appversion)
    return false;
  const targetVersion = value;
  const rowVersion = data.appversion;
  const result = compare(targetVersion, rowVersion);
  return result === 0 || result === -1;
};

const underAppVersion = ({ data, value }) => {
  if (!data || !data.appversion)
    return false;
  const targetVersion = value;
  const rowVersion = data.appversion;
  const result = compare(targetVersion, rowVersion);
  return result === 0 || result === 1;
};

module.exports = {
  matchAppVersion,
  notMatchAppVersion,
  aboveAppVersion,
  underAppVersion
};

