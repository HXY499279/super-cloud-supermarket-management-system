const express = require("express")
const router = express.Router();
const { isAuth } = require("../middleware/index")
const { OrderModel, UserModel, CommodityModel } = require("../models/index")
const urlib = require("url");
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

// 随机获取订单所需要的数据
const STATUS = ["willDelivery", "delivery", "success", "refund", "refunded"]
const MARKS = [
  "送到楼下就行",
  "好喜欢你的店呀",
  "我12点下课",
  "能不能送个小吃呀",
  "麻烦快一点哦",
  "要上课了",
  "给女朋友买的",
  "芬达要冰的哈，上次就给我搞忘了",
  "老板又是我，我又来买东西了",
  "老板能不能满减打折哦",
  "你们家的果酒好好喝呀",
  "下次还来买",
  "送到菜鸟驿站旁边，我下来拿",
  "你们平时周末好久营业哦",
  "能不能进一些千层蛋糕",
  "进点甘蔗，我喜欢吃！",
  "你的店在哪里哦",
  "我看见了！老板好帅呀！",
  "你们服务态度真好",
]

// 随机生成订单
router.get("/randomOrder", isAuth, async (req, res) => {
  // 生成随机用户,返回值为_id
  const userLen = await UserModel.find().count()
  const user = await UserModel.findOne({}, null, {
    skip: Math.floor(Math.random() * userLen),
    limit: 1
  })
  // 生成随机商品和商品总价
  const commodityLen = await CommodityModel.find().count()
  const commodity = await CommodityModel.find({}, "_id currentPrice", {
    skip: Math.floor(Math.random() * commodityLen),
    limit: Math.ceil(Math.random() * 5)
  })
  let commodityDetails = []
  let totalPrice = 0
  commodity.forEach((item, i) => {
    const commodityItem = {}
    commodityItem.commodity = item._id
    commodityItem.count = Math.ceil(Math.random() * 10)
    totalPrice += commodityItem.count * item.currentPrice
    commodityDetails.push(commodityItem)
  })

  // 生成随机订单
  const newOrder = new OrderModel({
    totalPrice,
    time: `2021-${Math.ceil(Math.random() * 12)}-${Math.ceil(Math.random() * 30)} ${Math.ceil(Math.random() * 24)}:${Math.ceil(Math.random() * 60)}`,
    remarks: MARKS[Math.floor(Math.random() * MARKS.length)],
    status: STATUS[Math.floor(Math.random() * STATUS.length)],
    user: user._id,
    commodityDetails
  });
  const newOrderCreated = await newOrder.save();
})

// 获取所有的订单(包含搜索)
router.get("/all-orders", isAuth, async (req, res) => {
  const data = urlib.parse(req.url, true);
  let { current, pageSize, status, _id, phone, dateSta, dateEnd } = data.query
  let user
  // 通过手机号找到对应用户
  try {
    ({ _id: user } = (phone !== "undefined" && phone !== '') ? await UserModel.findOne({ phone: { '$regex': new RegExp(`${phone}`, "ig") } }) : { _id: '' })
  } catch (error) {
    res.status(500).send({ message: "请输入正确的手机号" })
  }

  const queryCondition = {
    status,
    user,
    _id,
    time: { $gt: dateSta, $lt: dateEnd }
  }

  // 去除值为空的属性
  for (let propName in queryCondition) {
    if (queryCondition[propName] === '' || queryCondition[propName] === 'undefined') {
      delete queryCondition[propName]
    }
    if (propName === "time" && (dateSta === 'undefined' || dateEnd === "undefined" || dateSta === '' || dateEnd === "")) {
      delete queryCondition[propName]
    }
  }
  try {
    // 将数据做类型转换
    queryCondition._id ? queryCondition._id = new ObjectId(_id) : 0

    const total = await OrderModel.find(queryCondition).count()
    const orders = await OrderModel.find(queryCondition, null, {
      // 因为从URL获取的参数是字符，因此需要隐式转换
      skip: (+current - 1) * (+pageSize),
      limit: +pageSize,
      sort: { time: -1 }
    }).populate(
      {
        path: "user commodityDetails.commodity",
        select: "address name phone commodityName currentPrice -_id",
      }
    )

    if (orders) {
      res.send({ data: orders, total, message: "订单获取成功" })
    } else {
      res.status(500).send({ message: "订单获取失败" })
    }
  } catch (error) {
    res.status(500).send({ message: "请输入正确完整的订单号" })
  }

})

// 修改订单
router.put("/order", isAuth, async (req, res) => {
  const {
    _id,
    current,
    pageSize,
    endStatus,
    status
  } = req.body
  try {
    const order = await OrderModel.findByIdAndUpdate(_id, { status: endStatus })
    if (order) {
      const { commodityDetails } = order
      if (order.status === "refund") {
        // 如果订单被退款，就把商品数量恢复上去
        commodityDetails.forEach(async (item) => {
          const ret = await CommodityModel.findByIdAndUpdate(item.commodity, { $inc: { inventory: item.count } })
        })
      } else if (order.status === "delivery") {
        // 如果订单成交，就把销量加上去,并且随时监测销量来改变商品欢迎程度
        commodityDetails.forEach(async (item) => {
          const saveSalesVolume = await CommodityModel.findByIdAndUpdate(item.commodity, { $inc: { salesVolume: item.count } })
          const salesVolume = saveSalesVolume.salesVolume + item.count
          let popularity
          if (salesVolume < 20) {
            popularity = 1
          } else if (salesVolume >= 20 && salesVolume < 50) {
            popularity = 2
          } else if (salesVolume >= 50 && salesVolume < 100) {
            popularity = 3
          } else if (salesVolume >= 100) {
            popularity = 4
          }
          const savePopularity = await CommodityModel.findByIdAndUpdate(item.commodity, { popularity })
        })
      }

      const orders = await OrderModel.find({ status }, null, {
        // 因为从URL获取的参数是字符，因此需要隐式转换
        skip: (+current - 1) * (+pageSize),
        limit: +pageSize,
        sort: { time: -1 }
      }).populate(
        {
          path: "user commodityDetails.commodity",
          select: "address name phone commodityName currentPrice -_id",
        }
      )
      return res.status(200).send({ data: orders, message: "订单更改成功" })
    } else {
      return res.status(500).send({ message: "订单更改失败" })
    }
  } catch (error) {
    if (error.valueType !== error.kind) {
      return res.status(500).send({ message: "请输入正确类型的值" })
    }
  }

})

module.exports = router