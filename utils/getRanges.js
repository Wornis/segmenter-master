const formatRangeBound = (str) => {
  if (64 - str.length > 0) return '0'.repeat(64 - str.length) + str;
  if (64 - str.length < 0) return 'f'.repeat(64);
  return str;
};

module.exports = (numberOfRanges) => {
  // rowkeys are encoded on 64 digits in hex so we have 16^64 possible rowkey
  const step = 16 ** 64 / numberOfRanges;
  let start = '0'.repeat(64);
  let end = (parseInt(start, 16) + step).toString(16);
  const ranges = [];
  let rangeIndex = 0;
  while (ranges.length < numberOfRanges) {
    start = formatRangeBound(start);
    end = formatRangeBound(end);
    ranges.push({
      start,
      end,
      rangeIndex,
    });
    start = end;
    end = (parseInt(start, 16) + step).toString(16);
    rangeIndex += 1;
  }
  return ranges;
};
