const fs = require('fs');
const path = require('path');
const express = require('express')
const router = express.Router();

router.get("/hxy", (req, res, next) => {
    req.body = {
		name:'xiaoxiao',
		age:18
	}
    console.log(req.headers);
	next();
}, (req, res, next) => {
    console.log(req.body);
    res.send(req.body)
})
// 登陆
router.post('/login', (req, res) => {
    console.log(req.body)
    let adminObj = req.body
    if (adminObj.asname === 'admin' && adminObj.password === 'admin') {
        let result = JSON.stringify({ "status": "success" })
        res.send(result)
    } else {
        let result = JSON.stringify({ "status": "failed" })
        res.send(result)
    }
})
// 请求用户列表
router.post('/userlist', (req, res) => {
    console.log(req.body)
    fs.readFile('./public/UimResult.json', function (err, data) {
        // console.log(data.toString())
        res.send(data.toString())
    })
})
// 请求修改密码
router.post('/modifypassword', (req, res) => {
    console.log(req.body)
    fs.readFile('./public/UimResult.json', function (err, data) {
        let DATA = JSON.parse(data.toString())
        // console.log(DATA)
        DATA.results.forEach(item => {
            if (item.id == req.body.id) {
                item.password = req.body.modifiedpassword
            }
        })
        // console.log(DATA)
        DATA = JSON.stringify(DATA)
        fs.writeFile('./public/UimResult.json', DATA, function (err) {
            if (err) {
                console.log('写入失败')
            } else {
                console.log('写入成功了')
                fs.readFile('./public/UimResult.json', function (err, data) {
                    if (err) {
                        console.log('失败')
                    } else {
                        res.send(data.toString())
                    }
                })
            }
        })
    })

})
// 请求删除用户
router.post('/deleteuser', (req, res) => {
    // 将对应id对象删除后
    console.log(req.body)
    fs.readFile('./public/UimResult.json', function (err, data) {
        let DATA = JSON.parse(data.toString())
        // console.log(DATA.results)

        DATA.results.forEach((item, index) => {
            if (item.id == req.body.id) {
                DATA.results.splice(index, 1)
            }
        })
        DATA.total = '5'
        DATA = JSON.stringify(DATA)
        fs.writeFile('./public/UimResult.json', DATA, function (err) {
            if (err) {
                console.log('写入失败')
            } else {
                console.log('写入成功了')
                fs.readFile('./public/UimResult.json', function (err, data) {
                    if (err) {
                        console.log('失败')
                    } else {
                        res.send(data.toString())
                    }
                })
            }
        })
    })

})

//请求广告列表
router.get('/adlist', (req, res) => {
    // console.log(req.body)
    fs.readFile('./public/AdmResult.json', function (err, data) {
        console.log(path.resolve('./'))
        res.send(data.toString())
    })
})
// 请求修改图片
router.post('/modifyad', (req, res) => {
    console.log(req.body, '2222222')
    res.send({ status: "success" })
})
//请求删除广告
router.post('/deletead', (req, res) => {
    // 将对应id广告删除
    console.log(req.body)
    fs.readFile('./public/AdmResult.json', function (err, data) {
        let DATA = JSON.parse(data.toString())
        // console.log(DATA.results)

        DATA.forEach((item, index) => {
            if (item.adid == req.body.adid) {
                DATA.splice(index, 1)
            }
        })
        DATA = JSON.stringify(DATA)
        fs.writeFile('./public/AdmResult.json', DATA, function (err) {
            if (err) {
                console.log('写入失败')
            } else {
                console.log('写入成功了')
                fs.readFile('./public/AdmResult.json', function (err, data) {
                    if (err) {
                        console.log('失败')
                    } else {
                        console.log(data.toString())
                        res.send(data.toString())
                    }
                })
            }
        })
    })
})
//请求新增广告
router.post('/addad', (req, res) => {
    console.log(req.body, 11111111111111)
    console.log(req.files.files, 11111111111111)
    fs.readFile('./public/AdmResult.json', (err, data) => {
        let DATA = JSON.parse(data.toString())
        let newData = req.body
        newData.id = Math.floor(Math.random() * 1000)
        DATA.unshift(newData)
        // console.log(DATA)
        DATA = JSON.stringify(DATA)
        fs.writeFile('./public/AdmResult.json', DATA, function (err) {
            if (err) {
                console.log('写入失败')
            } else {
                console.log('写入成功了')
                fs.readFile('./public/AdmResult.json', function (err, data) {
                    if (err) {
                        console.log('失败')
                    } else {
                        res.send(data.toString())
                    }
                })
            }
        })
    })
})

// 请求商品列表
router.post('/commoditylist', (req, res) => {
    console.log(222222, req.body)
    fs.readFile('./public/CimResult.json', (err, data) => {
        res.send(data.toString())
    })
})

// 请求删除商品
router.post('/deletecommodity', (req, res) => {
    console.log(req.body)
    fs.readFile('./public/CimResult.json', function (err, data) {
        let DATA = JSON.parse(data.toString())
        // console.log(DATA.results)

        DATA.results.forEach((item, index) => {
            if (item.cid == req.body.cid) {
                DATA.results.splice(index, 1)
            }
        })
        DATA = JSON.stringify(DATA)
        fs.writeFile('./public/CimResult.json', DATA, function (err) {
            if (err) {
                console.log('写入失败')
            } else {
                console.log('写入成功了')
                fs.readFile('./public/CimResult.json', function (err, data) {
                    if (err) {
                        console.log('失败')
                    } else {
                        // console.log(data.toString())
                        res.send(data.toString())
                    }
                })
            }
        })
    })
})
// 请求搜索商品
router.post('/searchcommodity', (req, res) => {
    fs.readFile('./public/CimResult.json', function (err, data) {
        let DATA = JSON.parse(data.toString())
        let searchedItem = req.body
        console.log(searchedItem)
        let findItems = DATA.results.filter(item => {
            if (item.id == searchedItem.id) {
                return item
            } else if (item.status === searchedItem.status) {
                if (item.commodityName === searchedItem.commodityName) {
                    if (item.category === searchedItem.category) {
                        return item
                    }
                }
            }
        })
        findItems = JSON.stringify(findItems)
        res.send(findItems)
    })
})
// 请求商品编辑
router.post('/editcommodity', (req, res) => {
    let newData = req.body
    console.log(typeof newData)
    console.log("我是新数据", newData)
    fs.readFile('./public/CimResult.json', function (err, data) {
        let DATA = JSON.parse(data.toString())
        // console.log(DATA)
        DATA.results.forEach(item => {
            if (item.cid == newData.cid) {
                [
                    item.currentPrice,
                    item.inventory,
                    item.originalPrice,
                ] = [
                        newData.currentPrice,
                        newData.inventory,
                        newData.originalPrice,
                    ]
            }
        })
        // console.log(DATA)
        DATA = JSON.stringify(DATA)
        fs.writeFile('./public/CimResult.json', DATA, function (err) {
            if (err) {
                console.log('写入失败')
            } else {
                console.log('写入成功了')
                fs.readFile('./public/CimResult.json', function (err, data) {
                    if (err) {
                        console.log('失败')
                    } else {
                        let returnItem = JSON.parse(data.toString()).results.filter(item => {
                            if (item.id == newData.id) {
                                return item
                            }
                        })
                        returnItem = JSON.stringify(returnItem)
                        // console.log(returnItem)
                        res.send({
                            status: "success"
                        })
                    }
                })
            }
        })
    })
})

// 请求新增商品
router.post('/addcommodity', (req, res) => {
    console.log(req.body)
    fs.readFile('./public/CimResult.json', (err, data) => {
        let DATA = JSON.parse(data.toString())
        let newData = req.body
        // 数据整合处理
        newData.cid = Math.floor(Math.random() * 1000)
        DATA.results.unshift(newData)
        // console.log(DATA)
        DATA = JSON.stringify(DATA)
        fs.writeFile('./public/CimResult.json', DATA, function (err) {
            if (err) {
                console.log('写入失败')
            } else {
                console.log('写入成功了')
                fs.readFile('./public/CimResult.json', function (err, data) {
                    if (err) {
                        console.log('失败')
                    } else {
                        res.send({
                            status: "success"
                        })
                    }
                })
            }
        })
    })
})



// 请求商品分类管理
router.post('/category/categorylist', (req, res) => {
    console.log(req.body)
    fs.readFile('./public/CategoryResult.json', function (err, data) {
        // console.log(data.toString())
        res.send(data.toString())
    })
})
// 请求新增商品分类
router.post('/category/addcategory', (req, res) => {
    console.log(req.body)
    fs.readFile('./public/CategoryResult.json', (err, data) => {
        let DATA = JSON.parse(data.toString())
        let newData = req.body
        newData.cateid = Math.floor(Math.random() * 1000)
        DATA.results.unshift(newData)
        DATA.total += 1
        // console.log(DATA)
        DATA = JSON.stringify(DATA)
        fs.writeFile('./public/CategoryResult.json', DATA, function (err) {
            if (err) {
                console.log('写入失败')
            } else {
                console.log('写入成功了')
                fs.readFile('./public/CategoryResult.json', function (err, data) {
                    if (err) {
                        console.log('失败')
                    } else {
                        res.send(data.toString())
                    }
                })
            }
        })
    })
})
// 请求删除商品分类
router.post('/category/deletecategory', (req, res) => {
    console.log(req.body)
    fs.readFile('./public/CategoryResult.json', function (err, data) {
        let DATA = JSON.parse(data.toString())
        // console.log(DATA.results)

        DATA.results.forEach((item, index) => {
            if (item.cateid == req.body.cateid) {
                DATA.results.splice(index, 1)
                DATA.total -= 1
            }
        })
        DATA = JSON.stringify(DATA)
        fs.writeFile('./public/CategoryResult.json', DATA, function (err) {
            if (err) {
                console.log('写入失败')
            } else {
                console.log('写入成功了')
                fs.readFile('./public/CategoryResult.json', function (err, data) {
                    if (err) {
                        console.log('失败')
                    } else {
                        // console.log(data.toString())
                        res.send(data.toString())
                    }
                })
            }
        })
    })
})
// 请求下拉框分类选项
router.get('/category/subcategory', (req, res) => {
    console.log(req.body)
    fs.readFile('./public/CategoryResult.json', function (err, data) {
        let DATA = JSON.parse(data.toString())
        console.log(DATA.results)
        res.send(DATA)
    })
})



// 请求订单信息列表
router.post('/om/oflist', (req, res) => {
    console.log(req.body)
    let status = req.body.status
    fs.readFile('./public/OmResult.json', function (err, data) {
        let obj = JSON.parse(data.toString())
        obj.results = obj.results.filter(item => {
            if (item.status === status) {
                return item
            }
        })
        console.log(JSON.stringify(obj))
        res.send(JSON.stringify(obj))
    })
})
// 请求搜索订单信息
router.post('/om/searchorderform', (req, res) => {
    console.log(req.body)
    let obj = req.body
    console.log(JSON.stringify(obj))
    fs.readFile('./public/OmResult.json', function (err, data) {
        // console.log(data.toString())
        res.send(data.toString())
    })
})
// 请求改变订单状态
router.post('/om/changeofstatus', (req, res) => {
    console.log(req.body)
    let endStatus = req.body.endStatus
    let startStatus = req.body.startStatus
    fs.readFile('./public/OmResult.json', function (err, data) {
        let obj = JSON.parse(data.toString())
        obj.results.forEach(item => {
            if (item.ofid == req.body.ofid) {
                item.status = endStatus
                console.log(item, 222222222222222)
            }
        })
        fs.writeFile('./public/OmResult.json', JSON.stringify(obj), (err) => {
            if (err) {
                console.log('写入失败')
            } else {
                console.log('写入成功了')
                fs.readFile('./public/OmResult.json', function (err, data) {
                    if (err) {
                        console.log('失败')
                    } else {
                        let obj = JSON.parse(data.toString())
                        obj.results = obj.results.filter(item => {
                            if (item.status === startStatus) {
                                return item
                            }
                        })
                        res.send(JSON.stringify(obj))
                    }
                })
            }
        })
    })
})

// 请求渲染数据概况
router.get('/dashboard/showdashboard', (req, res) => {
    fs.readFile('./public/DashboardResult.json', (err, data) => {
        res.send(data.toString())
    })
})

module.exports = router;
