import axios from 'axios'
import { message } from 'antd'
// 给请求地址前加一个"/api"，在请求头中添加Token
const instance = axios.create({
  baseURL: '/api',
  headers: {
    Authorization: sessionStorage.getItem('Token') || null,
  },
})
// 添加返回拦截器，直接获取返回内容的data
instance.interceptors.response.use((res) => {
  return res.data
})
// 封装axios方法
const httpReq = (method, url, data) => {
  return new Promise((resolve, reject) => {
    instance({
      method: method,
      url: url,
      data: data,
      // headers: config
    }).then(
      (data) => {
        resolve(data)
      },
      (err) => {
        // 错误在这统一处理
        const status = err.response.status
        const errInfo = err.response.data.message
        console.log(err.response)
        // 根据状态码做提示处理
        if (status === 401) {
          message.error(`认证失败：${errInfo}`)
          return
        } else if (status === 403) {
          message.error(`未授权：${errInfo}`)
          setTimeout(() => {
            window.location.href = '/login'
          }, 1500)
          return
        } else if (status === 404) {
          message.error(`未找到资源：${errInfo}`)
        } else if (status === 500) {
          message.error(`服务器未能处理：${errInfo ? errInfo : '服务器异常'}`)
          return
        }
      }
    )
  })
}

class HttpUtil {
  // 管理员账户登陆模块
  login = (params) => httpReq('post', '/admins/login', params)

  // 用户模块
  getAllUsers = (params) =>
    httpReq('get', `/users/all-users/${params.current}/${params.pageSize}`)
  updatePwd = (params) => httpReq('put', `/users/user`, params)
  deleteUser = (params) => httpReq('delete', `/users/user/${params._id}`)

  // 广告投放模块
  getAllAds = () => httpReq('get', `/ads/all-ads`)
  addAd = (params) => httpReq('post', '/ads/ad', params)
  updateAd = (params) => httpReq('put', `/ads/ad`, params)
  deleteAd = (params) => httpReq('delete', `/ads/ad/${params._id}`)

  // 商品类别模块
  getAllCategories = (params) =>
    httpReq(
      'get',
      `/categories/all-categories/${params.count}/${params.pageSize}`
    )
  addCategory = (params) => httpReq('post', `/categories/category`, params)
  deleteCategory = (params) =>
    httpReq('delete', `/categories/category/${params._id}/${params.curTotal}`)

  // 商品模块
  getAllCommodities = (params) =>
    httpReq(
      'get',
      `/commodities/all-commodities/${params.count}/${params.pageSize}`
    )
  addCommodity = (params) => httpReq('post', '/commodities/commodity', params)
  updateCommodity = (params) => httpReq('put', `/commodities/commodity`, params)
  deleteCommodity = (params) =>
    httpReq(
      'delete',
      `/commodities/commodity/${params._id}/${params.curTotal}/${params.category_id}`
    )

  getData = (params) => {
    return httpReq('get', '/getData', params)
  }

  showData = (params) => {
    return httpReq('get', '/showData', params)
  }
}

export default new HttpUtil()
