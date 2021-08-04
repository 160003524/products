const relevanceForProduct = (rate, cash_discount, category_importance) => {
  //Normalizar datos para poder cumplir con el objetivo
  if (rate <= 5 && rate >= 1) {
    rate = (rate - 1) / (5 - 1);
    rate = rate * 0.3;
  }
  if (cash_discount <= 10500 && cash_discount >= 1485) {
    cash_discount = (cash_discount - 1485) / (10500 - 1485);
    cash_discount = cash_discount * 0.5;
  }

  if (category_importance <= 10 && category_importance >= 1) {
    category_importance = (category_importance - 1) / (10 - 1);
    category_importance = category_importance * 0.2;
  }

  return rate + cash_discount + category_importance;
};

module.exports = relevanceForProduct;
