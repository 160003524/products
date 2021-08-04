const router = require('express').Router();

const { getProducts } = require('../controllers/product.controller');

router.get('/getProducts', getProducts);

module.exports = router;
