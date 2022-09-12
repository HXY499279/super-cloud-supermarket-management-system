const express = require('express')
const { adminRoute, userRoute, adRoute, categoryRoute, commodityRoute, orderRoute, dashboardRoute } = require('./routes/index')
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const config = require('./config');
const mongoose = require("mongoose")
const cors = require('cors')

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

app.use("*", cors())
// app.all("*", (req, res, next) => {
//     res.header("Access-Control-Allow-Origin", "https://jwzx.cqupt.edu.cn");
//     res.header("Access-Control-Allow-Private-Network", "true")
//     res.header("Access-Control-Allow-Credentials", "true"); 
//     next();
// });

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
