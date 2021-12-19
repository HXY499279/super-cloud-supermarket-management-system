const mongoose = require("mongoose")
const dashboardSchema = new mongoose.Schema({
  totalSales: {
    type: Number,
    default: 0
  },
  todaySale: {
    type: Number,
    default: 0
  },
  willDelivery: {
    type: Number,
    default: 0
  },
  delivery: {
    type: Number,
    default: 0
  },
  refund: {
    type: Number,
    default: 0
  },
  refunded: {
    type: Number,
    default: 0
  },
  success: {
    type: Number,
    default: 0
  }
})

const DashboardModel = mongoose.model("dashboard", dashboardSchema)

module.exports = DashboardModel