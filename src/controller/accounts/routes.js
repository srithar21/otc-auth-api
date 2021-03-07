var accountController = require('./account');
var express = require('express');
var router = express.Router();


 
 

router.post('/create', accountController.create)
 
router.get('/', accountController.root)

router.post('/login', accountController.siginWithPassword)

router.get('/detail', accountController.accountInfo)


module.exports = router