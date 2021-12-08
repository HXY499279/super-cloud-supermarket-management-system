const withPicFile = (req, res, next) => {
  const { data: buffer, mimetype, size } = req.files.file
  // 判断数据类型是否符合图片标准
  if (mimetype !== "image/png" && mimetype !== "image/jpeg" && mimetype !== "image/pjpeg") {
    return res.status(500).send({ message: "请上传图片" })
  }
  if (size > 2 * 1024 * 1024) {
    return res.status(500).send({ message: "图片大小超过2mb" })
  }
  req.body.file = buffer
  req.body.picMimetype = mimetype
  next()
}

module.exports = withPicFile