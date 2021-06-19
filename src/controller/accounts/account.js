const fetch = require("node-fetch");
const sgMail = require("@sendgrid/mail");

require("dotenv").config();
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const {
  ReasonPhrases,
  StatusCodes,
  getReasonPhrase,
  getStatusCode,
} = require("http-status-codes");
const dbConnection = require("../db/dbconnect.js");
const httpUtils = require("../../util/httputils");
// const redis = require('../../util/redis')

const stripe = require('stripe')('sk_test_51IL9i5FzfcjDT1x8NKOn12BKxKRxttlWBHaAzkDdxjZydQLWglGFQM3NNBkcSCm67NImEn60i1kFaCDp2nNQ8bTE00PFJVtZfp');

exports.create = async (req, reply) => {
  try {
    // console.log("********************" +redis.testCache())

    dbConnection.executeSQL(
      "SELECT  id,firstName,lastName,title,phone,company,email,created_at FROM [dbo].[customer_master] where email='" +
        req.body.email +
        "'",
      async (err, data, rows, jsonArray) => {
        if (err) {
          console.error(err);
          reply.status(500).send(err);
        }

        console.log(data);

        if (data.rows.length > 0) {
          reply
            .status(200)
            .send({ msg: "An account with this email already exists" });
        } else {
          console.log(httpUtils.hostURL);
          const response = await fetch(
            httpUtils.hostURL + "/v1/accounts:signUp?key=" + httpUtils.apiKey,
            {
              method: "POST",
              body: JSON.stringify(req.body),
              headers: {
                "Content-Type": "application/json",
                Origin: "https://otc-web-qa.azurewebsites.net",
                "Access-Control-Request-Method": "*",
                "Access-Control-Allow-Origin": "*",
                withCredentials: "true",
              },
            }
          );
          const responseData = await response.json();
          console.log(responseData.localId);

          if (response.status == StatusCodes.OK) {
            setSession(req, responseData.expiresIn);
            console.log("Inside db insert");

            const createCustomer = await stripe.customers.create({            
              email: req.body.email
            });   

            responseData['stripeCustomerId'] = createCustomer.id;
            insertCustomerData(req.body, responseData);                     
          }
          reply.status(response.status).send(responseData);
        }
      }
    );

    console.log(req.body);
    
  } catch (error) {
    console.log(error);
  }
};

exports.accountDetail = async (req, reply) => {
  try {
    console.log("*********Query ***********" + req.query.email);
    console.log("&&&&&" + req.session.email + "&&&&&&&");
    let allowedOrigins = [
      "http://localhost:3000",
      "https://otc-web-qa.azurewebsites.net",
    ];

    reply.header("Access-Control-Allow-Origin", allowedOrigins);
    reply.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    reply.header("Access-Control-Allow-Credentials", "true");
    reply.header(
      "Access-Control-Allow-Methods",
      "PUT, POST, GET, DELETE, OPTIONS"
    );
    reply.header("withCredentials", "true");
    // if (req.session.email == req.query.email) {

    console.log("*********Session***********" + req.session.email);
    console.log(req.body);
    console.log(httpUtils.hostURL);
    const response = getAccountFromDB(req.query.email, reply);
    console.log("%%%%%%%%%%%%%%%%%%%%%%" + response);
  } catch (error) {
    console.log(error);
  }
};

exports.accountInfo = async (req, reply) => {
  try {
    // console.log("********************" +redis.testCache())
    console.log(req.body);
    console.log(httpUtils.hostURL);
    const response = await fetch(
      httpUtils.hostURL + "/v1/accounts:lookup?key=" + httpUtils.apiKey,
      {
        method: "POST",
        body: JSON.stringify(req.body),
        headers: {
          "Content-Type": "application/json",
          Origin: "https://otc-web-qa.azurewebsites.net",
          "Access-Control-Request-Method": "*",
          "Access-Control-Allow-Origin": "*",
          withCredentials: "true",
        },
      }
    );
    const responseData = await response.json();

    if (response.status == StatusCodes.OK) {
      if (responseData.users[0].email) {
        const response = getAccountFromDB(responseData.users[0].email, reply);
      }
    } else {
      reply.status(response.status).send(responseData);
    }

    // reply.status(response.status).send(responseData)
  } catch (error) {
    console.log("Inside /info api exception");
    console.log(error);
  }
};

exports.siginWithPassword = async (req, reply) => {
  try {
    const response = await fetch(
      httpUtils.hostURL +
        "/v1/accounts:signInWithPassword?key=" +
        httpUtils.apiKey,
      {
        method: "POST",
        body: JSON.stringify(req.body),
        headers: { "Content-Type": "application/json" },
      }
    );
    const responseData = await response.json();
    console.log(responseData.localId);
    if (response.status == StatusCodes.OK) {
      setSession(req, 3600);
      reply.status(response.status).send(responseData);
    } else {
      reply.status(response.status).send(responseData);
    }
  } catch (error) {
    console.log(error);
  }
};

exports.root = async (req, reply) => {
  try {
    let response = {
      auth: "/account/auth",
      newAccount: "/account/create",
    };
    reply.status(StatusCodes.OK).send(response);
  } catch (error) {
    console.log(error);
  }
};

function setSession(req, expireIn) {
  console.log(expireIn);
  req.session.email = req.body.email;
  console.log("&&&&&" + req.session.email);
}

function insertCustomerData(body, response) {
  try {
    dbConnection.executeSQL(
      "Insert into customer_master(localId, firstName, lastName, title, company, email, phone, stripe_customer_id) values(" +
        "'" +
        response.localId +
        "'," +
        "'" +
        body.firstName +
        "'," +
        "'" +
        body.lastName +
        "'," +
        "'" +
        body.title +
        "'," +
        "'" +
        body.company +
        "'," +
        "'" +
        body.email +
        "'," +
        "'" +
        body.phone +
        "','" +
        response['stripeCustomerId'] +
        "')",
      (err, data) => {
        if (err) console.error(err);
      }
    );
  } catch (error) {
    console.log(error);
  }
}

const getAccountFromDB = (email, reply) => {
  try {
    var accountData;
    let uniqueId = dbConnection.executeSQL(
      "SELECT  id,firstName,lastName,title,phone,company,email,created_at,stripe_customer_id FROM [dbo].[customer_master] where email='" +
        email +
        "'",
      (err, data, rows, jsonArray) => {
        if (err) {
          console.error(err);
        }

        data.rows.forEach((column) => {
          if (column.value === null) {
            console.log("NULL");
            // reply.status(StatusCodes.NOT_FOUND).send({"message":"not ***found"})
          } else {
            var accountId = JSON.stringify(column[0].value);

            accountData = {
              firstName: column[1].value,
              lastName: column[2].value,
              title: column[3].value,
              phone: column[4].value,
              company: column[5].value,
              email: column[6].value,
              accountId: "otc" + ("0000" + accountId).slice(),
              created_at: column[7].value,
              stripeCustomerId: column[8].value
            };
            console.log("---------" + JSON.stringify(accountData));
            if (accountData) {
              reply.status(StatusCodes.OK).send(accountData);
            } else {
              reply
                .status(StatusCodes.NOT_FOUND)
                .send({ message: "not found" });
            }
          }
        });
      }
    );
    //  reply.status(StatusCodes.NOT_FOUND).send({"message":"not found"})
    console.log("Outside");
  } catch (error) {
    console.log(error);
  }
  console.log("++++++++++" + accountData);
  // return JSON.stringify(accountData)
};

exports.getInfo = async (req, reply) => {
  reply.send("Welcome to get");
};

exports.forgotPassword = (req, res) => {
  let verificationCode = Math.floor(100000 + Math.random() * 900000);

  sgMail
    .send({
      to: req.body.to,
      from: "srithar@onetimecode.io",
      templateId: "d-0d373f9d88f4491b9ccb7fe89524ea4a",
      dynamicTemplateData: {        
        "twilio_code": verificationCode
      }
    })
    .then(
      (message) => {
        res.status(200).json({ 
          messageId: '', from: process.env.EMAIL_FROM, to: req.body.to, message: 'Code '+verificationCode+' sent to '+req.body.to , 
          code: verificationCode, agentId: req.body.agentId 
        });
      },
      (error) => {
        console.error(error);

        if (error.response) {
            res.status(200).json({ msg: error.response });
        }
      }
    );
}
