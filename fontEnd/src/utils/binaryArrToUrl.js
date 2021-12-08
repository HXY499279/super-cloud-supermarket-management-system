const binaryArrToUrl = (file, picMimetype) => {
  // 将二进制数组转成base64,然后拼接成url
  if (file) {
    if (typeof file === 'string') {
      return `data:${picMimetype};base64,${file}`
    }
    const binaryArr = file.data
    const buffer = Buffer.from(binaryArr)
    const base64 = buffer.toString('base64')
    const url = `data:${picMimetype};base64,${base64}`
    return url
  }
  return 'http://iph.href.lu/1279x990?text=暂无图片'
}
export default binaryArrToUrl
