// const dotenv = require('dotenv')
// dotenv.config();

module.exports = {
  PORT: process.env.PORT || 8081,
  MONGODB_URL: process.env.MONGODB_URL || 'mongodb://hxy:hxy020414@101.43.146.27/csms?authSource=admin',
  JWT_SECRET: process.env.JWT_SECRET || 'jwtsecret',
  HXY_ADMIN_NAME : "黄显瑜"
};
