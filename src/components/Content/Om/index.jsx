import React, { Component } from 'react'
import {
  Descriptions,
  Divider,
  Breadcrumb,
  Button,
  Input,
  message,
  InputNumber,
  DatePicker,
  Table,
  ConfigProvider,
  Popconfirm,
  Space,
  Empty,
} from 'antd'
import { nanoid } from 'nanoid'
import { connect } from 'react-redux'
import { changeAsync } from '../../../redux/actions/count'
import { SearchOutlined } from '@ant-design/icons'
import './index.css'
// 配置中文环境
import zh_CN from 'antd/lib/locale-provider/zh_CN'
import 'moment/locale/zh-cn'
// 引用工具
import ofStatusToChinese from '../../../utils/ofStatusToChinese'
import httpUtil from '../../../utils/httpUtil'

const { RangePicker } = DatePicker

class OmChildren extends Component {
  constructor(props) {
    super(props)
    this.state = {
      date: [],
      data: [],
      searchData: {},
      pagination: {
        current: 1,
        pageSize: 6,
        total: '',
      },
      loading: false,
      status: 'willDelivery',
      ofDetails: [],
    }
  }

  // 根据状态来切换订单信息中订单状态的className来切换其颜色
  confirmStatus = () => {
    switch (this.state.status) {
      case 'willDelivery':
        return 'willDelivery'
      case 'delivery':
        return 'delivery'
      case 'success':
        return 'success'
      case 'refund':
        return 'refund'
      case 'refunded':
        return 'refunded'
      default:
        return 'sendgoods'
    }
  }

  getColumns = () => {
    let columns = [
      {
        title: '订单号',
        dataIndex: '_id',
        key: '_id',
      },
      {
        title: '用户姓名',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '用户电话',
        dataIndex: 'phone',
        key: 'phone',
      },
      {
        title: '下单时间',
        dataIndex: 'time',
        key: 'time',
      },
      {
        title: '备注',
        dataIndex: 'remarks',
        key: 'remarks',
      },
      {
        title: '订单状态',
        dataIndex: 'status',
        key: 'status',
        className: this.confirmStatus(),
      },
      this.state.status !== 'success' && this.state.status !== 'refunded'
        ? {
            title: '操作',
            dataIndex: '_id',
            key: '_id',
            render: (_id) => {
              return (
                <>
                  <Button
                    type="primary"
                    style={{ borderRadius: 5, marginLeft: 20 }}
                  >
                    <Popconfirm
                      title={`确定${this.changeOprationButtonWord(
                        this.state.status
                      )}吗?`}
                      onConfirm={this.confirmChangeStatus.bind(this, _id)}
                      okText="确认"
                      cancelText="取消"
                    >
                      {this.changeOprationButtonWord(this.state.status)}
                    </Popconfirm>
                  </Button>
                </>
              )
            },
          }
        : {
            className: 'of-last-item-hidden',
          },
    ]
    return columns
  }

  // 更改操作按钮中的文字
  changeOprationButtonWord = (status) => {
    switch (status) {
      case 'willDelivery':
        return '发货'
      case 'delivery':
        return '完成订单'
      case 'refund':
        return '退款'
      default:
        return '发货'
    }
  }

  // 确认更改订单状态操作
  confirmChangeStatus = (_id) => {
    let { current, pageSize } = this.state.pagination
    const data = {
      _id: _id,
      status: this.state.status,
      current,
      pageSize,
      endStatus: this.confirmEndStatus(),
    }
    httpUtil.updateOrder(data).then((res) => {
      let data = res.data
      console.log(data)
      // 数据处理
      data.forEach((item, i) => {
        item.key = nanoid()
        item.time = new Date(item.time).toLocaleString().replace(/\//gi, '-')
        data[i] = { ...item, ...item.user }
        delete data[i].user
      })
      ofStatusToChinese(data)
      console.log(data)
      this.setState({
        data: data,
      })
      message.success(res.message)
      this.props.changeAsync()
    })
  }
  // 根据startStatus来判断endStatus
  confirmEndStatus = () => {
    switch (this.state.status) {
      case 'willDelivery':
        return 'delivery'
      case 'delivery':
        return 'success'
      case 'refund':
        return 'refunded'
      default:
        return
    }
  }

  // 更改日期的提交格式
  dateOnChange = (value, dateString) => {
    let startDate = dateString[0].replace(/\//g, '-')
    let endDate = dateString[1].replace(/\//g, '-')
    let date = [startDate, endDate]
    this.setState({
      date: date,
    })
  }

  // 搜索操作
  OmSearch = () => {
    let [_id, phone, dateSta, dateEnd] = [
      this._idInput.state.value,
      this.phoneInput.state.value,
      this.state.date[0],
      this.state.date[1],
    ]
    const searchData = { _id, phone, dateSta, dateEnd }
    this.setState({
      searchData,
    })
    this.fetch(searchData, 'search')
  }

  getPaginationParams = (params) => ({
    current: this.state.pagination.current,
    pageSize: this.state.pagination.pageSize,
    status: this.state.status,
    ...params,
  })

  fetch = (params = {}, from) => {
    this.setState({
      loading: true,
    })
    httpUtil.getOrders(this.getPaginationParams(params)).then((res) => {
      const data = res.data
      // 数据处理
      data.forEach((item, i) => {
        item.key = nanoid()
        item.time = new Date(item.time).toLocaleString().replace(/\//gi, '-')
        data[i] = { ...item, ...item.user }
        delete data[i].user
      })
      // 数据处理-将status从英文变成中文在页面显示
      ofStatusToChinese(data)
      const pagination = this.state.pagination
      pagination.total = res.total
      this.setState({
        loading: false,
        // 根据接口返回的数据源
        data: data,
        pagination,
      })
      if (from === 'search') {
        message.success(res.message)
      }
    })
  }

  // 点击Table按钮 渲染组件
  handleTableChange = (pagination) => {
    let { current, pageSize } = pagination
    this.setState(
      {
        pagination: {
          current,
          pageSize,
        },
      },
      () => {
        this.fetch(this.state.searchData)
      }
    )
  }

  // 点击状态按钮切换渲染
  changeStatusAndPost = (status) => {
    const pagination = this.state.pagination
    pagination.current = 1
    this.setState(
      {
        pagination,
        status: status,
        searchData: {},
      },
      () => {
        this.fetch()
      }
    )
  }

  willDeliveryClick = () => {
    this.changeStatusAndPost('willDelivery')
  }
  deliveryClick = () => {
    this.changeStatusAndPost('delivery')
  }
  successClick = () => {
    this.changeStatusAndPost('success')
  }
  refundClick = () => {
    this.changeStatusAndPost('refund')
  }
  refundedClick = () => {
    this.changeStatusAndPost('refunded')
  }

  componentDidMount() {
    // 生成随机订单接口
    // httpUtil.getRandomOrder()
    this.fetch(this.state.searchData)
  }

  render() {
    const { data, pagination, loading } = this.state
    return (
      <div>
        <Divider style={{ margin: 0 }} />
        <div className="Om-head">
          <div className="Om-desc-wraper">
            <Descriptions title="订单管理" className="desc">
              <Descriptions.Item>
                展示订单信息，查询订单，查看订单状态，处理订单的发货，确认送达和同意退款
              </Descriptions.Item>
            </Descriptions>
          </div>
          <div className="status-switch">
            <Space>
              <Button
                className="status-button"
                onClick={this.willDeliveryClick}
              >
                待发货
              </Button>
              <Button className="status-button" onClick={this.deliveryClick}>
                配送中
              </Button>
              <Button className="status-button" onClick={this.successClick}>
                已成交
              </Button>
              <Button className="status-button" onClick={this.refundClick}>
                待退款
              </Button>
              <Button className="status-button" onClick={this.refundedClick}>
                已退款
              </Button>
            </Space>
          </div>
        </div>
        <div className="search">
          <Divider style={{ margin: 0 }} />
          <Space style={{ marginTop: 20 }} size={20}>
            <div>
              订单号:
              <Input
                name="_id"
                className="Om-input"
                ref={(elev) => {
                  this._idInput = elev
                }}
              />
            </div>
            <div>
              用户电话:
              <Input
                name="commodity"
                className="Om-input"
                ref={(elev) => {
                  this.phoneInput = elev
                }}
              />
            </div>
            <div>
              时间:
              <ConfigProvider locale={zh_CN}>
                <RangePicker
                  showTime
                  format="YYYY-MM-DD HH:mm"
                  onChange={this.dateOnChange}
                  ref={(elev) => {
                    this.dateElev = elev
                  }}
                />
              </ConfigProvider>
            </div>
            <div style={{ marginLeft: 20 }}>
              <Button
                type="primary"
                shape="circle"
                icon={<SearchOutlined />}
                onClick={this.OmSearch}
              />
            </div>
          </Space>
        </div>
        <div className="tableWraper contentWraper">
          <Table
            columns={this.getColumns()}
            dataSource={data}
            pagination={pagination}
            loading={loading}
            onChange={this.handleTableChange}
            bordered={true}
            expandable={{
              expandedRowRender: (item) => {
                const { address, name, phone, commodityDetails } = item
                return (
                  <div className="sub-order">
                    <p>
                      用户收货地址: {address} {name} {phone}{' '}
                    </p>
                    <p style={{ fontWeight: 600, fontSize: 14 }}>商品详情:</p>
                    {commodityDetails.map((item) => {
                      return (
                        <div className="commodity-details">
                          <div className="commodity-details-item">
                            名称: {item.commodity.commodityName}
                          </div>
                          <div className="commodity-details-item">
                            单价: {item.commodity.currentPrice}
                          </div>
                          <div className="commodity-details-item">
                            数量: {item.count}
                          </div>
                        </div>
                      )
                    })}
                    共计: <strong>{item.totalPrice}</strong> 元
                  </div>
                )
              },
            }}
          />
        </div>
      </div>
    )
  }
}

export const Om = connect((state) => ({ count: state.count }), {
  changeAsync,
})(OmChildren)
