// server/config.js

console.log(process.env);
module.exports = {
  AUTH0_DOMAIN: 'katyev.eu.auth0.com',
  AUTH0_API_AUDIENCE: 'http://localhost:8083/api',
  //MONGO_URI: process.env.MONGO_URI || 'mongodb://katyev:katyev@ds163119.mlab.com:63119/katyev',
  MONGO_URI: process.env.MONGO_URI ,
  NAMESPACE: 'https://www.sidhe.net/roles'
};
