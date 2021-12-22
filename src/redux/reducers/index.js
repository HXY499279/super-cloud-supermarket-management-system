/* 
    该文件用于汇总所有的reducer为一个总的reducer
*/
import { combineReducers } from 'redux'
//引入为Count组件服务的reducer
import count from './count'

//汇总reducer
export default combineReducers({
  count,
})
