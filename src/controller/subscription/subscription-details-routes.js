var subscriptionDetails = require('./subscription-details');
var express = require('express');
var router = express.Router();

router.get('/details', subscriptionDetails.details);
router.get('/list', subscriptionDetails.list);
router.delete('/cancel', subscriptionDetails.cancel);
router.get('/invoice-list', subscriptionDetails.invoiceList);
router.get('/product-list', subscriptionDetails.productList);

module.exports = router