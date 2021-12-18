const mongoose = require("mongoose")
const categorySchema = new mongoose.Schema({
  categoryName: {
    type: String,
    required: [true, "未输入分类名称"]
  },
  total: {
    type: Number,
    default: 0
  } 
})

const CategoryModel = mongoose.model("category", categorySchema)

module.exports = CategoryModel