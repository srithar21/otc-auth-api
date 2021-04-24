var subscriptionDetails = require('./subscription-details');
var express = require('express');
var router = express.Router();

router.get('/details', subscriptionDetails.details);
router.get('/list', subscriptionDetails.list);
router.delete('/cancel', subscriptionDetails.cancel);

module.exports = router