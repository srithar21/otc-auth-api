var subscriptionDetails = require('./subscription-details');
var express = require('express');
var router = express.Router();

router.get('/details', subscriptionDetails.details)
module.exports = router