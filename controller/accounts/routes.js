var accountController = require('./account');
var express = require('express');
var router = express.Router();



 

router.post('/create', accountController.create)

router.get('/get', accountController.getInfo)



module.exports = router