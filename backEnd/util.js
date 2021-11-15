const jwt = require("jsonwebtoken")
const config = require("./config")

const getToken = (admin) => {
  return jwt.sign({
    name: admin.name,
    id: admin.id
  },
    config.JWT_SECRET,
    {
      expiresIn: "3h"
    }
  )
}

const isAuth = (req, res, next) => {
  const token = req.headers.authorization;
  if (token) {
    const onlyToken = token.slice(4, token.length);
    // jwt验证
    jwt.verify(onlyToken, config.JWT_SECRET, (err, decode) => {
      if (err) {
        if (err.name === "JsonWebTokenError") {
          return res.status(401).send({ message: "认证失败，无权访问" })
        } else if (err.name === "TokenExpiredError") {
          return res.status(403).send({ message: '权限过期，请重新登陆' });
        }
        return res.status(401).send({message:"Token认证失败"})
      }
      // 没有错误，认证成功，授予访问权限
      req.admin = decode;
      next();
    });
  } else {
    return res.status(401).send({ message: '缺少Tkon，无权访问' });
  }
};

module.exports = { getToken, isAuth }