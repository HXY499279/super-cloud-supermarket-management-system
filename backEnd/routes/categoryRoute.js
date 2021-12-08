const express = require("express")
const router = express.Router();
const { isAuth } = require("../middleware/index")
const { CategoryModel } = require("../models/index")

router.get("/all-categories/:count/:pageSize", isAuth, async (req, res) => {
  const { count, pageSize } = req.params
  const categories = await CategoryModel.find({}, null, {
    skip: (+count - 1) * (+pageSize),
    limit: +pageSize,
    sort: { total: 1 }
  })
  if (categories) {
    res.send({ data: categories, total: categories.length })
  } else {
    res.status(500).send({ message: "商品分类获取失败" })
  }
})

router.post("/category", isAuth, async (req, res) => {
  const { categoryName, curTotal } = req.body
  const category = await CategoryModel.create({
    categoryName
  })
  const categories = await CategoryModel.find({}, null, {
    sort: { total: 1 },
    limit: curTotal
  })
  if (category) {
    res.send({ data: categories, message: "商品分类新增成功" })
  } else {
    res.status(500).send({ message: "商品分类新增失败" })
  }
})

router.delete("/category/:_id/:curTotal", isAuth, async (req, res) => {
  const { _id, curTotal } = req.params
  const category = await CategoryModel.findById(_id)
  if (category.total <= 0) {
    const category1 = await CategoryModel.findByIdAndDelete(_id)
    const categories = await CategoryModel.find({}, null, {
      sort: { total: 1 },
      limit: curTotal
    })
    if (category1) {
      res.status(200).send({ data: categories, message: "商品分类删除成功" })
    } else {
      res.status(404).send({ message: "商品分类不存在" })
    }
  }
  res.status(500).send({ message: "该分类下还有商品" })
})

module.exports = router