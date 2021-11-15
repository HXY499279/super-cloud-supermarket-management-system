import axios from 'axios'
import { message } from 'antd'
const instance = axios.create({
  baseURL: '/api'
})

instance.interceptors.response.use((res) => {
  return res.data
})

const httpReq = (method, url, data, config = {
  Authorization: 'hxy ' + sessionStorage.getItem("Token"),
}) => {
  return new Promise((resolve, reject) => {
    instance({
      method: method,
      url: url,
      data: data,
      headers: config
    })
      .then((data) => {
        resolve(data)
      }, (err) => {
        const status = err.response.status
        const errInfo = err.response.data.message
        // 根据状态码做提示处理
        if (status === 401) {
          message.error(errInfo)
        } else if (status === 403) {
          message.error(errInfo)
          window.location.href = "/login"
        }
      })
  })
}

class HttpUtil {
  // 管理员账户登陆模块
  login = (params) => httpReq("post", "/admins/login", params, {})
  // 用户模块
  getAllUsers = (params) => httpReq("post", "/users/allUsers", params)

  logout = (params) => httpReq("get", "/logout", params)

  getData = (params) => {
    return httpReq("get", "/getData", params)
  }

  showData = (params) => {
    return httpReq("get", "/showData", params)
  }
}

export default new HttpUtil()