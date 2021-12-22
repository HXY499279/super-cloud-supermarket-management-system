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

router.post("/register", async (req, res) => {
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