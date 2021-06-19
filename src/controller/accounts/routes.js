var accountController = require('./account');
var express = require('express');
var router = express.Router();


 
 

router.post('/create', accountController.create)
 
router.get('/', accountController.root)

router.post('/login', accountController.siginWithPassword)

router.get('/detail', accountController.accountDetail)

router.post('/info', accountController.accountInfo)

router.post('/forgot-password', accountController.forgotPassword)

module.exports = router