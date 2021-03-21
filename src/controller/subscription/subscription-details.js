const fetch = require('node-fetch');
require('dotenv').config()
const { ReasonPhrases,
    StatusCodes,
    getReasonPhrase,
    getStatusCode,} = require("http-status-codes");
const httpUtils = require('../../util/httputils');

exports.details = async (req, res) => { 
    let response = {
        "status":false,
        "card":[],
        "billingAddress":[]
    }
    try {
        res.send(response)
    } catch (error) {
        console.log(error)
    }
}