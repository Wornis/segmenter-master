const doesFilterExist = (filterToCheck) => {
  try {
    if (!filterToCheck.type) return false;
    if (filterToCheck.type === 'or') {
      if (!filterToCheck.filtersToCompare) return false;
      const erroredFilters = filterToCheck.filtersToCompare.filter(
        (orFilter) => !doesFilterExist(orFilter),
      );
      return !erroredFilters.length;
    }
    if (!filterToCheck.name) return false;
    const filter = require(`../controllers/filters/${filterToCheck.type}`)[`${filterToCheck.name}`];
    return !!filter;
  } catch (e) {
    console.error(e);
    return false;
  }
};

module.exports = {
  doesFilterExist,
};
