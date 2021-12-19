const mongoose = require("mongoose")
const userSchema = new mongoose.Schema({
  useraccount: {
    type: String,
    required: [true, "未输入账号！"],
    min: 10,
    max: 10
  },
  userpwd: {
    type: String,
    required: [true, "未输入密码！"],
    min: 5,
    max: 18
  },
  name: {
    type: String,
    required: [true, "未输入姓名！"],
  },
  gender: {
    type: String,
    required: [true, "未选择性别！"]
  },
  address: {
    type: String,
    required: [true, "未输入地址！"]
  },
  phone: {
    type: String,
    validate: {
      validator: function (v) {
        return /^1[3-9][0-9]{9}$/.test(v);
      },
      message: props => `${props.value} 不是合法的电话号码!`
    },
    required: [true, '未输入手机号码！']
  }
})

const UserModel = mongoose.model("user", userSchema)

module.exports = UserModel