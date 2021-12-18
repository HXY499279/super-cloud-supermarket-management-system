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
    required: [true, "未输入商品成本"],
    default: 0,
    min: 0
  },
  currentPrice: {
    type: Number,
    required: [true, "未输入商品现价"],
    default: 0,
    min: 0
  },
  inventory: {
    type: Number,
    required: [true, "未输入商品库存量"],
    default: 0,
    min: 0
  },
  danger_inventory: {
    type: Number,
    required: [true, "未输入商品警戒库存量"],
    default: 0,
    min: 0
  },
  inventoryStatus: {
    type: Number,
    default: 1,
    max: 1,
    min: 0
  },
  salesVolume: {
    type: Number,
    default: 0,
    min: 0
  },
  file: {
    type: Buffer,
    required: [true, "未选择上传图片！"]
  },
  picMimetype: {
    type: String,
    required: [true, "未选择图片mimetype！"]
  },
  popularity: {
    type: Number,
    default: 1,
    min: 1,
    max: 4,
  }
})

const CommodityModel = mongoose.model("commodity", commoditySchema)

module.exports = CommodityModel