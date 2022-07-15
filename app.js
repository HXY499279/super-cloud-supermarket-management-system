const express = require('express')
const { adminRoute, userRoute, adRoute, categoryRoute, commodityRoute, orderRoute, dashboardRoute } = require('./routes/index')
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const config = require('./config');
const mongoose = require("mongoose")
const mongodbUrl = config.MONGODB_URL;
mongoose
    .connect(mongodbUrl)
    .catch((error) => console.log(error.reason));
mongoose.connection.once("open", function () {
    console.log("连接打开");
})

const app = express();
// 使用中间件
app.use(fileUpload());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
//全局错误处理中间件
app.use(function (err, req, res, next) {
    res.status(500).send({ message: "服务器错误" })
});
// 配置跨域请求中间件(服务端允许跨域请求)
var allowCors = function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // 设置允许来自哪里的跨域请求访问（req.headers.origin为当前访问来源的域名与端口）
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS"); // 设置允许接收的请求类型
    res.header("Access-Control-Allow-Headers", "Content-Type,request-origin"); // 设置请求头中允许携带的参数
    res.header("Access-Control-Allow-Credentials", "true"); // 允许客户端携带证书式访问。保持跨域请求中的Cookie。注意：此处设true时，Access-Control-Allow-Origin的值不能为 '*'
    res.header("Access-control-max-age", 1000); // 设置请求通过预检后多少时间内不再检验，减少预请求发送次数
    next();
};
app.use(allowCors); // 使用跨域中间件

app.use('/public/', express.static('./public/'))
app.use('/api/admins', adminRoute);
app.use('/api/users', userRoute);
app.use('/api/ads', adRoute);
app.use('/api/categories', categoryRoute);
app.use('/api/commodities', commodityRoute);
app.use('/api/orders', orderRoute);
app.use('/api/dashboard', dashboardRoute);

app.listen(config.PORT, function () {
    console.log(`running in ${config.PORT}~`)
})
