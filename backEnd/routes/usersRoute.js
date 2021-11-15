const express = require("express")
const router = express.Router();
const { isAuth } = require("../util")
const { UserModel } = require("../models/index")

router.post("/allUsers", isAuth, async (req, res) => {
  if (req.admin) {
    const { current, pageSize } = req.body
    const users = await UserModel.find({}, null, {
      skip: (current - 1) * pageSize,
      limit: pageSize
    })
    if (users.length) {
      const total = await UserModel.find({}).count()
      res.send({ users, total })
    } else {
      res.send({ users, total: 0 })
    }
  }
})

module.exports = router