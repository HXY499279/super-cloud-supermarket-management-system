const express = require('express')
const { adminRoute,usersRoute } = require('./routes/index')
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const mongoose = require("mongoose")
const config = require('./config');
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
app.engine('html', require('express-art-template'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use('/public/', express.static('./public/'))
app.use('/api/admins', adminRoute);
app.use('/api/users', usersRoute);



const port = 5000
app.listen(port, function () {
    console.log(`running in ${port}~`)
})
