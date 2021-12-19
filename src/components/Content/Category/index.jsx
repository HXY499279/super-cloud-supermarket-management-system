import React, { Component } from 'react'
import {
  Descriptions,
  Divider,
  Popconfirm,
  Button,
  List,
  message,
  Space,
  Input,
  Spin,
} from 'antd'
import InfiniteScroll from 'react-infinite-scroller'
import { nanoid } from 'nanoid'
import httpUtil from '../../../utils/httpUtil'
import './index.css'

export class Category extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: null,
      loading: false,
      hasMore: true,
      total: '',
      isAddCategory: false,
      count: 0,
      pageSize: 8,
    }
  }

  fetchData = (callback) => {
    let count = this.state.count
    let pageSize = this.state.pageSize
    count += 1
    this.setState({
      count: count,
    })
    let data = { count, pageSize }
    httpUtil.getCategories(data).then((res) => {
      callback(res)
    })
  }

  handleInfiniteOnLoad = () => {
    let { data, total } = this.state
    this.setState({
      loading: true,
    })
    if (data.length >= total) {
      message.warning('分类已展示完毕')
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

  // 判断新加的分类是否已存在
  judgeCategoryNameIsExist = (categoryName) => {
    let tag = 0
    this.state.data.forEach((item) => {
      if (item.categoryName === categoryName) {
        tag = 1
      }
    })
    return tag
  }

  addCategory = () => {
    const count = this.state.count
    const pageSize = this.state.pageSize
    let categoryName = this.categoryInput.state.value
    const curTotal = count * pageSize
    if (
      undefined !== categoryName &&
      categoryName !== '' &&
      categoryName.search(/\s/) === -1 &&
      categoryName.search(/[A-z]|[0-9]/g) === -1 &&
      categoryName.search(
        /[$￥@#*（）【】，、:：‘’“”""{}()_—+~·^%&',;=?$]/g
      ) === -1
    ) {
      // // 去掉非法字符
      // categoryName = categoryName.replace(/[A-z]|[0-9]/g, '')
      // categoryName = categoryName.replace(/[$￥@#*（）【】，:：‘’“”""[\]{}()-_——+~·^%&',;=?$\x22]/g, '')
      if (this.judgeCategoryNameIsExist(categoryName)) {
        message.error('分类已存在！')
      } else {
        httpUtil.addCategory({ categoryName, curTotal }).then((res) => {
          this.setState({
            data: res.data,
          })
          this.categoryInput.input.value = ''
          this.categoryInput.state.value = ''
          message.success(res.message)
        })
      }
    } else {
      message.warning('输入内容不能为空或含有空格及非法字符')
    }
  }

  deleteCategory = (_id) => {
    const count = this.state.count
    const pageSize = this.state.pageSize
    const curTotal = count * pageSize
    httpUtil.deleteCategory({ _id, curTotal }).then((res) => {
      this.setState({
        data: res.data,
      })
      message.success(res.message)
    })
  }

  AddCategoryIsTrue = () => {
    this.setState({
      isAddCategory: true,
    })
  }

  AddCategoryIsFalse = () => {
    this.setState({
      isAddCategory: false,
    })
  }

  componentDidMount() {
    this.fetchData((res) => {
      this.setState({
        data: res.data,
        total: res.total,
      })
    })
  }

  render() {
    return (
      <div>
        <Divider style={{ margin: 0 }} />
        <div className="descwraper">
          {/* <Breadcrumb className="bdc">
                        <Breadcrumb.Item>
                            <a href="/home">主页</a>
                        </Breadcrumb.Item>
                        <Breadcrumb.Item>商品分类管理</Breadcrumb.Item>
                    </Breadcrumb> */}
          <Descriptions title="分类管理" className="desc">
            <Descriptions.Item>
              商品分类展示，新增分类，删除分类
            </Descriptions.Item>
          </Descriptions>
        </div>
        <div className="search">
          <Divider style={{ margin: 0 }} />
          <Space style={{ marginTop: 20 }} size={20}>
            {this.state.isAddCategory ? (
              <>
                <div>
                  分类名称:
                  <Input
                    name="category"
                    className="CimInput"
                    ref={(elev) => {
                      this.categoryInput = elev
                    }}
                  />
                </div>
                <Button
                  type="primary"
                  style={{ borderRadius: 5 }}
                  onClick={this.addCategory}
                >
                  确定
                </Button>
                <Button
                  type="primary"
                  danger
                  style={{ borderRadius: 5 }}
                  onClick={this.AddCategoryIsFalse}
                >
                  取消
                </Button>
              </>
            ) : (
              <Button
                type="primary"
                style={{ borderRadius: 5 }}
                onClick={this.AddCategoryIsTrue}
              >
                新增分类
              </Button>
            )}
          </Space>
        </div>
        <div className="contentWraper">
          <div className="demo-infinite-container">
            <InfiniteScroll
              initialLoad={false}
              pageStart={0}
              loadMore={this.handleInfiniteOnLoad}
              hasMore={!this.state.loading && this.state.hasMore}
              useWindow={false}
            >
              <List
                dataSource={this.state.data || []}
                renderItem={(item) => (
                  <List.Item key={nanoid()}>
                    <List.Item.Meta
                      title={`${item.categoryName}类`}
                      style={{ fontSize: 20 }}
                      description={`共计${item.total}件商品`}
                    />
                    <Button type="primary" danger style={{ borderRadius: 5 }}>
                      <Popconfirm
                        title="确定删除该分类吗?"
                        onConfirm={this.deleteCategory.bind(this, item._id)}
                        okText="确认"
                        cancelText="取消"
                      >
                        删除分类
                      </Popconfirm>
                    </Button>
                  </List.Item>
                )}
                loading={this.state.data ? false : true}
              >
                {this.state.loading && this.state.hasMore && (
                  <div className="demo-loading-container">
                    <Spin />
                  </div>
                )}
              </List>
            </InfiniteScroll>
          </div>
        </div>
      </div>
    )
  }
}
