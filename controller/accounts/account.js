const fetch = require('node-fetch');
require('dotenv').config()

exports.create = async (req, reply) => { 
    try{
        reply.setHeader('Access-Control-Allow-Origin', '*');
        reply.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
        reply.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
        reply.setHeader('Access-Control-Allow-Credentials', true); // If needed
        console.log(req.body)
        console.log(process.env.QA_HOST_IDENTITY_PLATFORM+'/v1/accounts:signUp?key='+process.env.QA_IDENTITY_PLATFORM_API_KEY)
        const response = await fetch(process.env.QA_HOST_IDENTITY_PLATFORM+'/v1/accounts:signUp?key='+process.env.QA_IDENTITY_PLATFORM_API_KEY, {
        method: 'POST',
        body: JSON.stringify(req.body),
        headers: { 'Content-Type': 'application/json' }
    });
        const data = await response.json();
        console.log(response.status)
        reply.status(response.status).send(data)
    }catch(error) {
	    console.log(error);
    }                                                                               
 }
 

 exports.getInfo = async (req, reply) => { 
    reply.send("Welcome to get")                                                                
 }

//  module.exports = {
//     create
    
// }