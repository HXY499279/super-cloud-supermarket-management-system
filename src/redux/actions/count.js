import httpUtil from '../../utils/httpUtil'

import { CHANGE } from '../constant'
export const change = (data) => ({ type: CHANGE, data })

//异步action，就是指action的值为函数,异步action中一般都会调用同步action，异步action不是必须要用的
export const changeAsync = () => {
  return (dispatch) => {
    httpUtil.getDashboard().then((res) => {
      const { willDelivery, delivery, refund } = res
      const badge = willDelivery + delivery + refund
      dispatch(change(badge))
    })
  }
}
