const express = require("express")
const router = express.Router();
const { isAuth, withPicFile } = require("../middleware/index")
const { CommodityModel, CategoryModel } = require("../models/index")

// 获取所有的商品
router.get("/all-commodities/:count/:pageSize", isAuth, async (req, res) => {
  const { count, pageSize } = req.params
  const total = await CommodityModel.find({}).count()
  const commodities = await CommodityModel.aggregate([
    {
      $lookup: {
        from: 'categories',            // 右集合
        localField: 'category_id',    // 左集合 join 字段
        foreignField: '_id',         // 右集合 join 字段
        as: 'category'           // 新生成字段（类型array）
      }
    },
    {
      // 去掉外层的数组
      $unwind: {
        path: '$category',
        preserveNullAndEmptyArrays: true,
      }
    },
    {
      $project: {
        "category._id": 0,
        "category.total": 0,
      }
    },
    {
      $skip: (+count - 1) * (+pageSize)
    },
    {
      $limit: +pageSize
    },
    {
      $sort: { _id: -1 }
    }
  ])
  if (commodities) {
    res.send({ data: commodities, total })
  } else {
    res.status(500).send({ message: "商品获取失败" })
  }
})

// 新增商品
router.post("/commodity", isAuth, withPicFile, async (req, res) => {
  const newCommodity = req.body
  const commodity = await CommodityModel.create(newCommodity)
  if (commodity) {
    const { category_id } = req.body
    const category = await CategoryModel.findByIdAndUpdate(
      {
        _id: category_id
      },
      {
        $inc: { total: 1 }
      }
    )
    return res.status(200).send({ message: "商品新增成功" })
  } else {
    return res.status(500).send({ message: "商品新增失败" })
  }
})

// 修改商品
router.put("/commodity", isAuth, async (req, res) => {
  const { _id } = req.body
  const commodity = await CommodityModel.findByIdAndUpdate(_id, req.body)
  if (commodity) {
    return res.status(200).send({ message: "商品更改成功" })
  } else {
    return res.status(500).send({ message: "商品更改失败" })
  }
})

// 删除商品
router.delete("/commodity/:_id/:curTotal/:category_id", isAuth, async (req, res) => {
  const { _id, curTotal, category_id } = req.params
  const commodity = await CommodityModel.findByIdAndDelete(_id)
  const commodities = await CommodityModel.find({}, null, {
    sort: { _id: -1 },
    limit: curTotal
  })
  if (commodity) {
    const category = await CategoryModel.findByIdAndUpdate(
      {
        _id: category_id
      },
      {
        $inc: { total: -1 }
      }
    )
    res.status(200).send({ data: commodities, message: "商品删除成功" })
  } else {
    res.status(404).send({ message: "商品不存在" })
  }
})


module.exports = router