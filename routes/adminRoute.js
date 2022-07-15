const express = require("express")
const router = express.Router();
const { getToken } = require("../middleware/index")
const { AdminModel } = require("../models/index")

router.post("/login", async (req, res) => {
  const admin = await AdminModel.findOne({
    adminaccount: req.body.adminaccount,
    adminpwd: req.body.adminpwd
  })
  if (admin) {
    res.send({
      name: admin.name,
      token: getToken(admin)
    })
  } else {
    res.status(401).send({ message: "无效的账号或者密码" })
  }
})

router.get("/verify", (req, res) => {
  const Token = req.headers.token;
  if (Token !== null) {
    // 有token，说明是管理员，下面验证管理员权限
    jwt.verify(Token, config.JWT_SECRET, (err, decode) => {
      if (err) {
        if (err.name === "JsonWebTokenError") {
          res.status(403).send({ code:0,message: "授权失败，无权访问" })
        } else if (err.name === "TokenExpiredError") {
          res.status(403).send({ code:0,message: '权限过期，请重新登陆' });
        } else {
          res.status(403).send({ code:0,message: "授权失败，未知错误" })
        }
      }
      // 没有错误，认证成功，授予访问权限
      req.admin = decode;
      res.send({
        code:1,
        message:"成功"
      })
    });
  } else {
    res.status(401).send({ code:0,message: '非管理员身份，无权访问' });
  }
})

router.post("/register", async (req, res) => {
  console.log(req.body);
  const findAdmin = await AdminModel.findOne({
    adminaccount: req.body.adminaccount,
  })
  if (findAdmin) {
    res.status(500).send({ message: "账号已存在，请直接登陆" })
  } else {
    const admin = await AdminModel.create({
      adminaccount: req.body.adminaccount,
      adminpwd: req.body.adminpwd,
      name: req.body.name
    })
    if (admin) {
      res.status(200).send({
        message: "注册成功"
      })
    } else {
      res.status(500).send({ message: "注册失败" })
    }
  }
})

module.exports = router