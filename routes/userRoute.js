const express = require("express")
const router = express.Router();
const { isAuth } = require("../middleware/index")
const { UserModel } = require("../models/index")

// 获取用户
router.get("/all-users/:current/:pageSize", isAuth, async (req, res) => {
  const { current, pageSize } = req.params
  const users = await UserModel.find({}, null, {
    // 因为从URL获取的参数是字符，因此需要隐式转换
    skip: (+current - 1) * (+pageSize),
    limit: +pageSize
  })
  if (users) {
    if (users.length) {
      const total = await UserModel.find({}).count()
      res.status(206).send({ users, total })
    } else {
      res.status(206).send({ users, total: 0 })
    }
  } else {
    res.status(500).send({ message: "用户获取失败" })
  }
})

// 获取单个用户
router.get("/user/:_id", isAuth, async (req, res) => {
  const { _id } = req.params
  const user = await UserModel.find({ _id })
  if (user[0]) {
    res.send({ user: user[0], message: "用户获取成功" })
  } else {
    res.status(500).send({ message: "用户获取失败" })
  }
})

// 修改某个用户的密码
router.put("/user", isAuth, async (req, res) => {
  const { _id, modifiedpassword } = req.body
  const user = await UserModel.findByIdAndUpdate(_id, { userpwd: modifiedpassword })
  if (user) {
    res.status(200).send({ message: "密码修改成功" })
  } else {
    res.status(404).send({ message: "用户不存在" })
  }
})

// 删除某个用户
router.delete("/user/:_id", isAuth, async (req, res) => {
  const { _id } = req.params
  const user = await UserModel.findByIdAndDelete(_id)
  if (user) {
    res.status(200).send({ message: "用户删除成功" })
  } else {
    res.status(404).send({ message: "用户不存在" })
  }
})


module.exports = router