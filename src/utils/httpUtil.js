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
        const status = err?.response?.status
        const errInfo = err?.response?.data?.message
        // 根据状态码做提示处理
        switch (status) {
          case 401:
            message.error(`认证失败: ${errInfo}`)
            break
          case 403:
            message.error(`未授权: ${errInfo}`)
            setTimeout(() => {
              window.location.href = '/login'
            }, 1500)
            break
          case 404:
            message.error(`未找到资源: ${errInfo}`)
            break
          case 500:
            if (errInfo) {
              message.warning(`服务器未能处理: ${errInfo}`)
            } else {
              message.error(`服务器未能处理: 服务器异常 `)
            }
            break
          default:
            break
        }
      }
    )
  })
}

class HttpUtil {
  // 管理员账户登陆模块
  login = (params) => httpReq('post', '/admins/login', params)
  register = (params) => httpReq('post', '/admins/register', params)

  // 用户模块
  getUsers = (params) =>
    httpReq('get', `/users/all-users/${params.current}/${params.pageSize}`)
  getUser = (params) => httpReq('get', `/users/user/${params._id}`)
  updatePwd = (params) => httpReq('put', `/users/user`, params)
  deleteUser = (params) => httpReq('delete', `/users/user/${params._id}`)

  // 广告投放模块
  getAds = () => httpReq('get', `/ads/all-ads`)
  addAd = (params) => httpReq('post', '/ads/ad', params)
  updateAd = (params) => httpReq('put', `/ads/ad`, params)
  deleteAd = (params) => httpReq('delete', `/ads/ad/${params._id}`)

  // 商品类别模块
  getCategories = (params) =>
    httpReq(
      'get',
      `/categories/all-categories/${params.count}/${params.pageSize}`
    )
  addCategory = (params) => httpReq('post', `/categories/category`, params)
  deleteCategory = (params) =>
    httpReq('delete', `/categories/category/${params._id}/${params.curTotal}`)

  // 商品模块
  getCommodities = (params) =>
    httpReq(
      'get',
      `/commodities/all-commodities/?count=${params.count}&pageSize=${params.pageSize}&category_id=${params.category_id}&commodityName=${params.commodityName}&inventoryStatus=${params.inventoryStatus}&popularity=${params.popularity}`
    )
  addCommodity = (params) => httpReq('post', '/commodities/commodity', params)
  updateCommodity = (params) => httpReq('put', `/commodities/commodity`, params)
  deleteCommodity = (params) =>
    httpReq(
      'delete',
      `/commodities/commodity/${params._id}/${params.curTotal}/${params.category_id}`
    )

  // 订单模块
  getOrders = (params) =>
    httpReq(
      'get',
      `/orders/all-orders/?current=${params.current}&pageSize=${params.pageSize}&status=${params.status}&_id=${params._id}&phone=${params.phone}&dateSta=${params.dateSta}&dateEnd=${params.dateEnd}`
    )
  updateOrder = (params) => httpReq('put', '/orders/order', params)
  getRandomOrder = () => httpReq('get', '/orders/randomOrder')

  // dashboard模块
  getDashboard = () => httpReq('get', `/dashboard`)
}

export default new HttpUtil()
