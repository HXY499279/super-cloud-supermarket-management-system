const jwt = require("jsonwebtoken")
const config = require("../config")

// 生成Token
const getToken = (admin) => {
  return jwt.sign({
    name: admin.name,
    id: admin.id
  },
    config.JWT_SECRET,
    {
      expiresIn: "10h"
    }
  )
}

module.exports = getToken