const jwt = require("jsonwebtoken")
const config = require("../config")

// 验证Token权限
const isAuth = (req, res, next) => {
  const Token = req.headers.authorization;
  if (Token !== null) {
    // 有token，说明是管理员，下面验证管理员权限
    jwt.verify(Token, config.JWT_SECRET, (err, decode) => {
      if (err) {
        if (err.name === "JsonWebTokenError") {
          res.status(403).send({ message: "授权失败，无权访问" })
        } else if (err.name === "TokenExpiredError") {
          res.status(403).send({ message: '权限过期，请重新登陆' });
        } else {
          res.status(403).send({ message: "授权失败，未知错误" })
        }
      }
      // 没有错误，认证成功，授予访问权限
      req.admin = decode;
      next();
    });
  } else {
    res.status(401).send({ message: '非管理员身份，无权访问' });
  }
};

module.exports = isAuth