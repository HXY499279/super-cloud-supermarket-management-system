const express = require("express")
const router = express.Router();
const { isAuth, withPicFile } = require("../middleware/index")
const { AdModel } = require("../models/index")

// 获取所有的广告，广告最多5个
router.get("/all-ads", isAuth, async (req, res) => {
  const ads = await AdModel.find({}, null, { sort: { _id: -1 } })
  if (ads) {
    res.send(ads)
  } else {
    res.status(500).send({ message: "广告获取失败" })
  }
})

// 新增广告
router.post("/ad", isAuth, withPicFile, async (req, res) => {
  const newAd = req.body
  const ad = await AdModel.create(newAd)
  if (ad) {
    return res.status(201).send({ message: "广告新增成功" })
  } else {
    return res.status(500).send({ message: "广告新增失败" })
  }
})

// 修改广告图片
router.put("/ad", isAuth, withPicFile, async (req, res) => {
  const { _id, file, picMimetype } = req.body
  const ad = await AdModel.findByIdAndUpdate(_id, { file, picMimetype })
  if (ad) {
    return res.status(200).send({ message: "广告图更改成功" })
  } else {
    return res.status(500).send({ message: "广告图更改失败" })
  }
})

// 删除广告
router.delete("/ad/:_id", isAuth, async (req, res) => {
  const { _id } = req.params
  const ad = await AdModel.findByIdAndDelete(_id)
  if (ad) {
    res.status(200).send({ message: "广告删除成功" })
  } else {
    res.status(404).send({ message: "广告不存在" })
  }
})

module.exports = router