// server/config.js

module.exports = {
  CLOUD_NAME: 'katyev',
  CLOUD_UPLOAD_PRESET: 'scsdt5tx',
  CLOUD_API_KEY: process.env.CLOUD_API_KEY,
  CLOUD_API_SECRET: process.env.CLOUD_API_SECRET,
  AUTH0_DOMAIN: 'katyev.eu.auth0.com',
  AUTH0_DOMAIN_API_TOKEN:'https://katyev.eu.auth0.com/oauth/token',
  AUTH0_API_AUDIENCE: 'http://localhost:8083/api',
  AUTH0_CLIENT_SECRET:process.env.AUTH0_CLIENT_SECRET,
  AUTH0_CLIENT_ID:process.env.AUTH0_CLIENT_ID,
  MONGO_URI: process.env.MONGO_URI ,
  NAMESPACE: 'https://www.sidhe.net/roles'
};
