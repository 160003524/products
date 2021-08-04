const { response, request } = require('express');
const axios = require('axios');

const relevanceForProduct = require('../helpers/relevance');

/**
 *
 * @param {*} res Products
 */

const getProducts = async (req = request, res = response) => {
  try {
    //Axios to get the services of the delivered APIs
    const caseOne = await axios.get(
      'https://run.mocky.io/v3/26029c20-0eb4-43b1-b8ba-871384052fc7'
    );
    const caseTwo = await axios.get(
      'https://run.mocky.io/v3/77f7e692-73f3-4676-a4ce-8576dd99ca0c'
    );
    //Variable that will contain the products
    let produ = [];
    //If there is no data, return status 400 there is no information.
    if (
      (JSON.stringify(caseOne.data) || JSON.stringify(caseTwo.data)) === '[]'
    ) {
      return res.status(400).json({ code: -1, msg: 'No hay informacion' });
    }
    /**
     * /**
     *Sort the JSON for case one
     */
    for (const products of caseOne.data.products) {
      for (const categories of caseOne.data.categories) {
        if (products.product_data.categories[0].category_id === categories.id) {
          if (!products.product_data.discount) {
            let relevance = relevanceForProduct(
              products.product_data.rate,
              0,
              categories.importance
            );
            products.product_data.discount = 0;
            produ.push({
              name: products.product_data.name,
              price: products.product_data.price,
              discount: products.product_data.discount,
              rate: products.product_data.rate,
              category: categories.name,
              category_importance: categories.importance,
              relevance,
            });
          } else {
            let relevance = relevanceForProduct(
              products.product_data.rate,
              products.product_data.price *
                (products.product_data.discount / 100),
              categories.importance
            );
            produ.push({
              name: products.product_data.name,
              price: products.product_data.price,
              discount: products.product_data.discount,
              rate: products.product_data.rate,
              category: categories.name,
              cash_discount:
                products.product_data.price *
                (products.product_data.discount / 100),
              category_importance: categories.importance,
              relevance,
            });
          }
        }
      }
    }
    /**
     *Sort the JSON for case two
     */
    for (const products of caseTwo.data) {
      for (let index = 0; index < products.productos.length; index++) {
        let noFormatPrice = Number(
          products.productos[index].precio.replace(/[$.]/g, '')
        );
        if (!products.productos[index].precio_alto) {
          let relevance = relevanceForProduct(
            products.productos[index].calificacion,
            0,
            products.importancia
          );
          produ.push({
            name: products.productos[index].nombre,
            price: noFormatPrice,
            discount: 0,
            rate: products.productos[index].calificacion,
            category: products.categoria,
            category_importance: products.importancia,
            relevance,
          });
        } else {
          let noFormatCashDiscount = Number(
            products.productos[index].precio_alto.replace(/[$.]/g, '')
          );
          let relevance = relevanceForProduct(
            products.productos[index].calificacion,
            noFormatCashDiscount - noFormatPrice,
            products.importancia
          );
          produ.push({
            name: products.productos[index].nombre,
            price: noFormatPrice,
            discount:
              ((noFormatCashDiscount - noFormatPrice) / noFormatCashDiscount) *
              100,
            cash_discount: noFormatCashDiscount - noFormatPrice,
            rate: products.productos[index].calificacion,
            category: products.categoria,
            category_importance: products.importancia,
            relevance,
          });
        }
      }
    }
    /**
     * With this constant, the relevance of each product is ordered
     * from highest to lowest.
     */
    const orderMax = produ.sort((a, b) => {
      if (a.relevance > b.relevance) {
        return -1;
      }
    });
    /**
     *Response of ordered products
     */
    res.status(200).json(orderMax);
  } catch (err) {
    console.log(err);
    throw new Error(`product.controller${err}`);
  }
};

module.exports = {
  getProducts,
};
