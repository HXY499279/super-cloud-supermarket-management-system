const express = require("express")
const router = express.Router();
const { isAuth } = require("../middleware/index")
const { OrderModel } = require("../models/index")

router.get("/", isAuth, async (req, res) => {
  const orders = await OrderModel.find({ status: "success" })
  let totalSales = 0
  orders.forEach(item => {
    totalSales += item.totalPrice
  })
  const willDelivery = await OrderModel.find({ status: "willDelivery" }).count()
  const delivery = await OrderModel.find({ status: "delivery" }).count()
  const refund = await OrderModel.find({ status: "refund" }).count()
  const refunded = await OrderModel.find({ status: "refunded" }).count()
  const success = await OrderModel.find({ status: "success" }).count()
  const todaySale_total = await OrderModel.find({ time: { $gt: new Date().toLocaleDateString() }, status: "success" })
  let todaySale = 0
  todaySale_total.forEach(item => {
    todaySale += item.totalPrice
  })

  const data = {
    totalSales,
    todaySale,
    willDelivery,
    delivery,
    refund,
    refunded,
    success
  }
  res.status(200).send({ ...data, message: "数据表盘获取成功" })
})

module.exports = router