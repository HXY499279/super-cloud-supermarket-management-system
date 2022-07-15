const mongoose = require("mongoose")
const adminSchema = new mongoose.Schema({
  adminaccount: {
    type: String,
    required: true,
    min: 3,
    max: 10
  },
  adminpwd: {
    type: String,
    required: true,
    min: 5,
    max: 18
  },
  name: {
    type: String,
    required: true,
  }
})

const AdminModel = mongoose.model("admin", adminSchema)

module.exports = AdminModel