const mongoose = require("mongoose")
const adSchema = new mongoose.Schema({
  adName: {
    type: String,
    required: [true, "未输入广告名称！"],
  },
  adCompany: {
    type: String,
    required: [true, "未输入广告公司！"]
  },
  adCategory: {
    type: String,
    required: [true, "未输入广告分类！"]
  },
  file: { type: Buffer, required: [true, "未选择上传图片！"] },
  picMimetype: { type: String, required: [true, "未选择图片mimetype！"] }
})

const AdModel = mongoose.model("ad", adSchema)

module.exports = AdModel