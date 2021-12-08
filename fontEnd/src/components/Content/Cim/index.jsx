import React, { Component } from 'react'
import {
  Descriptions,
  Divider,
  Empty,
  Button,
  Input,
  message,
  InputNumber,
  Spin,
  Select,
  Col,
  Row,
  Space,
  Affix,
} from 'antd'
import { BrowserRouter, Link, Switch, Route } from 'react-router-dom'
import { SearchOutlined } from '@ant-design/icons'
import InfiniteScroll from 'react-infinite-scroller'
import { nanoid } from 'nanoid'
import httpUtil from '../../../utils/httpUtil'
import getStandardStr from '../../../utils/getStandardStr'
import reqwest from 'reqwest'
import CommodityCard from './components/CimCommodityCard'
import CimAddCommodity from './components/CimAddCommodity'
import './index.css'

const { Option } = Select

export class Cim extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: [],
      subCategory: [],
      loading: false,
      hasMore: true,
      total: '',
      isAddCategory: false,
      count: 0,
      pageSize: 8,
    }
  }

  fetchData = async (callback) => {
    let count = this.state.count
    let pageSize = this.state.pageSize
    count += 1
    this.setState({
      count: count,
    })
    let data = { count, pageSize }
    const res = await httpUtil.getAllCommodities(data)
    console.log(res)
    callback(res)
  }

  handleInfiniteOnLoad = () => {
    let { data, total } = this.state
    this.setState({
      loading: true,
    })
    console.log(this.state)
    if (data.length >= total) {
      message.warning('商品已展示完毕')
      this.setState({
        hasMore: false,
        loading: false,
      })
      return
    }
    this.fetchData((res) => {
      data = data.concat(res.data)
      this.setState({
        data,
        loading: false,
        total: res.total,
      })
    })
  }

  // 删除商品
  deleteCommodity = (item) => {
    const { _id, category_id } = item
    let curTotal = this.state.count * this.state.pageSize
    httpUtil.deleteCommodity({ _id, curTotal, category_id }).then((res) => {
      console.log(res)
      this.setState({
        data: res.data,
      })
      message.success(res.message)
    })
  }
  // 展示商品列表
  showCommodity = (data) => {
    return data.map((item, index) => {
      return (
        // 循环项的key值，不要用index，可以用nanoid来设置
        <Col span={6} style={{ marginBottom: 20 }} key={nanoid()}>
          <CommodityCard data={item} deleteCommodity={this.deleteCommodity} />
        </Col>
      )
    })
  }
  // 搜索商品
  CimSearch = () => {
    let [
      popularity = '',
      commodityName = '',
      category_id = '',
      inventoryStatus = '',
    ] = [
      this.popularitySelect.value,
      this.nameInput.state.value,
      this.categorySelect.value,
      undefined === this.inventoryStatusSelect.value
        ? this.inventoryStatusSelect.props.defaultValue
        : this.inventoryStatusSelect.value,
    ]
    commodityName = getStandardStr(commodityName)
    if (popularity !== '') {
      popularity *= 1
    }
    const searchCondition = {
      popularity,
      commodityName,
      category_id,
      inventoryStatus,
    }
    console.log(searchCondition)
    reqwest({
      url: '/searchcommodity',
      method: 'post',
      type: 'json',
      data: searchCondition,
    }).then((res) => {
      console.log(res)
      this.setState({
        data: res.commodities,
        total: res.total,
      })
      message.success(res.message)
    })
  }
  // 获取下拉框的值
  inventoryStatusSelectChange = (e) => {
    console.log(e)
    this.inventoryStatusSelect.value = e
  }
  popularitySelectChange = (e) => {
    console.log(e)
    this.popularitySelect.value = e
  }
  categorySelectChange = (e) => {
    console.log(e)
    this.categorySelect.value = e
  }
  // 渲染分类下拉框的选项
  showCategoryList = () => {
    return this.state.subCategory.map((item, index) => {
      // console.log(item.category)
      return (
        <Option value={`${item._id}`} key={nanoid()}>
          {item.categoryName}
        </Option>
      )
    })
  }
  // 渲染初始商品操作页面
  showCommodityInit = () => {
    const Demo = () => {
      return (
        <div className="background">
          <Affix target={() => this.commodityListElev}>
            <div className="search">
              <Divider style={{ margin: 0 }} />
              <Space style={{ marginTop: 20 }} size={20}>
                <div>
                  火爆程度:
                  <Select
                    name="popularity"
                    style={{ width: 100 }}
                    ref={(elev) => {
                      this.popularitySelect = elev
                    }}
                    onChange={this.popularitySelectChange}
                  >
                    <Option value="4">😍X4</Option>
                    <Option value="3">😍X3</Option>
                    <Option value="2">😍X2</Option>
                    <Option value="1">😍X1</Option>
                  </Select>
                </div>
                <div>
                  商品名称:
                  <Input
                    name="commodity"
                    className="CimInput"
                    ref={(elev) => {
                      this.nameInput = elev
                    }}
                  />
                </div>
                <div>
                  商品分类:
                  <Select
                    name="category"
                    style={{ width: 100 }}
                    ref={(elev) => {
                      this.categorySelect = elev
                    }}
                    onChange={this.categorySelectChange}
                  >
                    {this.showCategoryList()}
                  </Select>
                </div>
                <div>
                  库存状态:
                  <Select
                    name="inventoryStatus"
                    style={{ width: 100 }}
                    ref={(elev) => {
                      this.inventoryStatusSelect = elev
                    }}
                    onChange={this.inventoryStatusSelectChange}
                  >
                    <Option value="1">充足</Option>
                    <Option value="0">需补货</Option>
                  </Select>
                </div>
                <div style={{ marginLeft: 20 }}>
                  <Button
                    type="primary"
                    shape="circle"
                    icon={<SearchOutlined />}
                    onClick={this.CimSearch}
                  />
                </div>
                <div style={{ marginLeft: 20 }}>
                  <Button type="primary" style={{ borderRadius: 5 }}>
                    <Link to="/home/cim/addcommodity">添加商品</Link>
                  </Button>
                </div>
              </Space>
            </div>
          </Affix>
        </div>
      )
    }
    return (
      <>
        <InfiniteScroll
          initialLoad={false}
          pageStart={0}
          loadMore={this.handleInfiniteOnLoad}
          hasMore={!this.state.loading && this.state.hasMore}
          useWindow={false}
        >
          <Demo />
          <div className="contentWraper">
            <div style={{ padding: 0 }}>
              {/* {console.log(this.state.data)} */}
              {undefined === this.state.data[0] ? (
                <Empty style={{ paddingTop: 80 }}>
                  <Spin size="large" className="spin" />
                </Empty>
              ) : (
                <Row gutter={10} className="">
                  {this.showCommodity(this.state.data)}
                </Row>
              )}
            </div>
          </div>
        </InfiniteScroll>
      </>
    )
  }

  componentDidMount = () => {
    console.log('页面初始渲染')
    this.fetchData((res) => {
      console.log(res)
      this.setState({
        data: res.data,
        total: res.total,
      })
    })
    // 请求分类列表
    httpUtil.getAllCategories({ count: 0, pageSize: 0 }).then((res) => {
      this.setState({
        subCategory: res.data,
      })
    })
  }

  render() {
    return (
      <div
        className="content-scroll"
        ref={(elev) => {
          this.commodityListElev = elev
        }}
      >
        <Divider style={{ margin: 0 }} />
        <div className="descwraper">
          {/* <Breadcrumb className="bdc">
                            <Breadcrumb.Item>
                            <a href="/home">主页</a>
                            </Breadcrumb.Item>
                            <Breadcrumb.Item>商品信息管理</Breadcrumb.Item>
                        </Breadcrumb> */}
          <Descriptions title="商品管理" className="desc">
            <Descriptions.Item>
              仓库商品信息展示，可以进行新增商品，搜索商品，编辑商品，删除商品操作
            </Descriptions.Item>
          </Descriptions>
        </div>
        <BrowserRouter>
          <Switch>
            <Route path="/home/cim/addcommodity" component={CimAddCommodity} />

            <Route path="/home/cim" component={this.showCommodityInit} />
          </Switch>
        </BrowserRouter>
      </div>
    )
  }
}
