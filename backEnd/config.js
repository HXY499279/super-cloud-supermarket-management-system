// const dotenv = require('dotenv')
// dotenv.config();

module.exports = {
  PORT: process.env.PORT || 5001,
  MONGODB_URL: process.env.MONGODB_URL || 'mongodb://localhost/csms',
  JWT_SECRET: process.env.JWT_SECRET || 'jwtsecret',
  HXY_ADMIN_NAME : "黄显瑜"
};
