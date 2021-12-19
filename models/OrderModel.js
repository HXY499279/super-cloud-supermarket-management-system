const mongoose = require("mongoose")
const commodityItem = {
  commodity: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'commodity',
  },
  count: {
    type: Number,
    required: [true, "未输入订单单个商品的数量"]
  }
}
const orderSchema = new mongoose.Schema({
  totalPrice: {
    type: Number,
  },
  time: {
    type: Date
  },
  remarks: {
    type: String
  },
  status: {
    type: String
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  commodityDetails: [commodityItem]
})

const OrderModel = mongoose.model("order", orderSchema)

module.exports = OrderModel;
