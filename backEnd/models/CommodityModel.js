const mongoose = require("mongoose")
const commoditySchema = new mongoose.Schema({
  commodityName: {
    type: String,
    required: [true, "未输入商品名称"],
    min: 1
  },
  sellingUnit: {
    type: String,
    required: [true, "未输入商品售卖单位"]
  },
  category_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, "未选择商品分类"]
  },
  cost: {
    type: Number,
    required: [true, "未输入商品成本"]
  },
  currentPrice: {
    type: Number,
    required: [true, "未输入商品现价"]
  },
  inventory: {
    type: Number,
    required: [true, "未输入商品库存量"]
  },
  danger_inventory: {
    type: Number,
    required: [true, "未输入商品警戒库存量"]
  },
  inventoryStatus:{
    type: Number,
  },
  salesVolume: {
    type: Number,
  },
  file: { type: Buffer, required: [true, "未选择上传图片！"] },
  picMimetype: { type: String, required: [true, "未选择图片mimetype！"] }
})

const CommodityModel = mongoose.model("commodity", commoditySchema)

module.exports = CommodityModel