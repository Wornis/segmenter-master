const { formatFilterInput } = require('../../utils/tools');

module.exports = (parent, row, params) => {
  const falsyFilterIndex = parent.filtersToCompare.map((filter, i) => {
    return (
      require(`./${filter.type}`)[`${filter.name}`]
    )(formatFilterInput({ filter, row, params: params[i][`${filter.type}`] }));
  }).findIndex((f) => !!f);
  return falsyFilterIndex > -1;
};
