const { range } = require("./range");

const getProductsFilters = (query) => {
  const filters = {};
  if (query.userId) {
    filters.userId = query.userId;
  }
  if (query.name) {
    const nameRegex = new RegExp(query.name, "i");
    filters.name = nameRegex;
  }
  if (query.category) {
    filters.category = query.category;
  }
  if (query.rating) {
    filters.rating = query.rating;
  }
  if (query.min_amount) {
    const overAmount = query.min_amount + 5;
    const underAmount = query.min_amount - 5;
    const amountArray = range(underAmount, overAmount);
    filters.min_amount = amountArray;
  }
  if (query.max_amount) {
    const overAmount = query.max_amount + 5;
    const underAmount = query.max_amount - 5;
    const amountArray = range(underAmount, overAmount);
    filters.max_amount = amountArray;
  }
  if (query.unit) {
    filters.unit = query.unit;
  }
  if (query.price_per_unit_min_max && query.price_per_unit_min) {
    const priceArray = range(
      query.price_per_unit_min,
      query.price_per_unit_min_max
    );
    filters.price_per_unit = priceArray;
  }
  return filters;
};

exports.getProductsFilters = getProductsFilters;
