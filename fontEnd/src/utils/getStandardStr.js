// 去除搜索内容中的空格，常见标点符号
function getStandardStr(str) {
  let newStr = str
  newStr = newStr.replace(/\s/g, ',')
  newStr = newStr.split(/[,，；;.。]/g)
  let string = ''
  newStr.forEach((item) => {
    if (item !== '') {
      string += item
    }
  })
  return string
}
export default getStandardStr
