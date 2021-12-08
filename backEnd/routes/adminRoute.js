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

module.exports = router