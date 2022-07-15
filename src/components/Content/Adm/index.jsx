import React, { Component } from 'react'
import { BrowserRouter, Route, Switch, Link } from 'react-router-dom'
import {
  Descriptions,
  Divider,
  Breadcrumb,
  Button,
  message,
  Popconfirm,
  Table,
  Upload,
  Image,
} from 'antd'
import reqwest from 'reqwest'
import axios from 'axios'
import AdmAddAd from './components/AdmAddAd'
import httpUtil from '../../../utils/httpUtil'
import binaryArrToUrl from '../../../utils/binaryArrToUrl'
import AD_NUMBER from './constant.js'
import 'antd/dist/antd.css'
import './index.css'

export class Adm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      ads: null,
      _id: '',
    }
  }

  property = {
    name: 'file',
    showUploadList: false,
    customRequest: (data) => {
      let formData = new FormData()
      formData.append('file', data.file)
      formData.append('_id', this.state._id)
      httpUtil.updateAd(formData).then((res) => {
        console.log(res)
        message.success(res.message)
        this.getAds()
      })
    },
    maxCount: 1,
  }

  getAds = () => {
    httpUtil.getAds().then((res) => {
      this.setState({
        ads: res,
      })
    })
  }

  confirm(_id) {
    const data = { _id: _id }
    httpUtil
      .deleteAd(data)
      //根据返回的状态码status判断是否删除广告成功
      .then((res) => {
        console.log(res)
        this.getAds()
        message.success(res.message)
      })
  }

  get_id = (_id) => {
    this.setState({
      _id,
    })
  }

  columns = [
    {
      title: '广告公司',
      dataIndex: 'adCompany',
      key: 'adCompany',
    },
    {
      title: '广告名称',
      dataIndex: 'adName',
      key: 'adName',
    },
    {
      title: '所属分类',
      dataIndex: 'adCategory',
      key: 'adCategory',
    },
    {
      title: '广告图片',
      key: 'file',
      dataIndex: 'file',
      render: (_, ad) => {
        const { picMimetype, file } = ad
        const url = binaryArrToUrl(file, picMimetype)
        return <Image preview={false} width={150} src={url} />
      },
    },
    {
      title: '操作',
      dataIndex: '_id',
      key: 'operation',
      render: (_id) => {
        return (
          <>
            <Upload {...this.property}>
              <Button
                type="primary"
                style={{ borderRadius: 5 }}
                onClick={this.get_id.bind(this, _id)}
              >
                更改图片
              </Button>
            </Upload>
            <Button
              type="primary"
              style={{ borderRadius: 5, marginLeft: 13 }}
              danger
            >
              <Popconfirm
                title="确定删除该广告吗?"
                onConfirm={this.confirm.bind(this, _id)}
                okText="确认"
                cancelText="取消"
              >
                删除广告
              </Popconfirm>
            </Button>
          </>
        )
      },
    },
  ]

  componentDidMount() {
    this.getAds()
  }

  render() {
    const adNumber = this.state.ads?.length
    return (
      <div>
        <Divider style={{ margin: 0 }} />
        <div className="descwraper">
          <Descriptions title="广告管理" className="desc">
            <Descriptions.Item>
              广告信息展示，可以进行新增广告，更改广告，删除广告操作。注意：最多只允许
              {AD_NUMBER}个广告位
            </Descriptions.Item>
          </Descriptions>
          <Divider style={{ margin: 0 }} />
          {this.state.ads?.length >= AD_NUMBER ? (
            <Button
              type="primary"
              style={{ marginBottom: 10, marginTop: 10, borderRadius: 5 }}
              danger
            >
              广告位已达{AD_NUMBER}位
            </Button>
          ) : (
            <Button
              type="primary"
              style={{ marginBottom: 10, marginTop: 10, borderRadius: 5 }}
            >
              <Link to={`/home/adm/addad/${adNumber}`}>新增广告</Link>
            </Button>
          )}
        </div>
        <div className="contentWraper">
          <Switch>
            <Route
              exact
              path="/home/adm/addad/:adNumber"
              component={AdmAddAd.bind(this)}
            />
            <Route path="/home/adm">
              <Table
                columns={this.columns}
                dataSource={this.state.ads}
                pagination={false}
                rowKey="_id"
                loading={this.state.ads ? false : true}
              />
            </Route>
          </Switch>
        </div>
      </div>
    )
  }
}
