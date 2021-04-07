var paymentSession = require('./payment-session');
var express = require('express');
var router = express.Router();

router.post('/create-checkout-session', paymentSession.createSubscriptionSession)
// router.post('/create-subscription-session', paymentSession.createSubscriptionSession)
module.exports = router
