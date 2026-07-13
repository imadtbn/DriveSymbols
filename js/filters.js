// Filters module - extends search functionality
const Filters = {
  apply(symbols, criteria) {
    return symbols.filter(s => {
      if (criteria.severity && s.severity !== criteria.severity) return false;
      if (criteria.color && s.color !== criteria.color) return false;
      if (criteria.category && s.category !== criteria.category) return false;
      if (criteria.canDrive !== undefined && s.canDrive !== criteria.canDrive) return false;
      if (criteria.brand && !s.brands.includes(criteria.brand)) return false;
      return true;
    });
  }
};