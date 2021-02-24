
exports. hostURL = (process.env.ENV_TYPE=='development') ? process.env.QA_HOST_IDENTITY_PLATFORM: process.env.QA_HOST_IDENTITY_PLATFORM;
exports. apiKey = (process.env.ENV_TYPE=='development') ? process.env.QA_IDENTITY_PLATFORM_API_KEY:process.env.QA_IDENTITY_PLATFORM_API_KEY;
// exports.create-account-url = hostURL+'/v1/accounts:signUp?key='+apiKey ;

// exports. createAccountUrl() {
//     return hostURL+'/v1/accounts:signUp?key='+apiKey 
//   }