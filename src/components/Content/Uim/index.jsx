import React, { Component } from 'react'
import {
  Descriptions,
  Divider,
  Breadcrumb,
  Table,
  Button,
  message,
  Modal,
  Input,
} from 'antd'
import reqwest from 'reqwest'
import { BrowserRouter, Link, Route, Switch } from 'react-router-dom'
import { nanoid } from 'nanoid'
import UimChangePassword from './components/UimChangePassword'
import httpUtil from '../../../utils/httpUtil'
import 'antd/dist/antd.css'
import './index.css'

export class Uim extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: null,
      pagination: {
        current: 1,
        pageSize: 7,
        total: '',
      },
      loading: false,
      status: 0,
      isModalVisible: false,
      dangerUser: null,
      canDelete: false,
    }
  }

  inputOnChange = (e) => {
    const inputValue = e.target.value
    const dangerName = this.state.dangerUser.name
    if (inputValue === dangerName) {
      this.setState({
        canDelete: true,
      })
    } else {
      this.setState({
        canDelete: false,
      })
    }
  }

  modalShow = (user) => {
    this.setState({
      isModalVisible: true,
      dangerUser: user,
    })
  }

  modalCancel = () => {
    this.setState({
      isModalVisible: false,
    })
  }

  confirm(_id) {
    httpUtil.deleteUser({ _id }).then((res) => {
      // 重新请求，渲染数据
      const { pagination } = this.state
      this.fetch({ pagination })
      this.modalCancel()
      message.success(res.message)
    })
  }

  columns = [
    {
      title: '账号',
      dataIndex: 'useraccount',
      key: 'useraccount',
    },
    {
      title: '密码',
      dataIndex: 'userpwd',
      key: 'userpwd',
    },
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '性别',
      dataIndex: 'gender',
      key: 'gender',
    },
    {
      title: '电话',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: '地址',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: '操作',
      dataIndex: '_id',
      key: '_id',
      render: (_id, user) => {
        return (
          <>
            <Button type="primary" style={{ borderRadius: 5 }}>
              <Link to={`/home/uim/changepassword/${_id}`}>更改密码</Link>
            </Button>
            <Button
              type="primary"
              style={{ borderRadius: 5, marginLeft: 20 }}
              onClick={this.modalShow.bind(this, user)}
              danger
            >
              删除用户
            </Button>
          </>
        )
      },
    },
  ]

  handleTableChange = (pagination) => {
    let { current, pageSize } = pagination
    this.setState({
      pagination: {
        current,
        pageSize,
      },
    })
    this.fetch({
      pagination,
    })
  }

  fetch = (params = {}) => {
    this.setState({ loading: true })
    const tableInfo = {
      current: params.pagination.current,
      pageSize: params.pagination.pageSize,
    }
    httpUtil.getUsers(tableInfo).then((data) => {
      this.setState({
        loading: false,
        // 根据接口返回的数据源
        data: data.users,
        pagination: {
          ...params.pagination,
          total: data.total,
        },
      })
    })
  }

  UimChangePasswordComponent = (props) => {
    const _id = props.match.params._id
    let user = this.state.data?.filter((item) => {
      if (item._id === _id) {
        return item
      } else {
        return 0
      }
    })
    user = user ? user[0] : {}
    return <UimChangePassword user={user} />
  }

  componentDidMount() {
    const { pagination } = this.state
    this.fetch({ pagination })
  }

  render() {
    const { data, pagination, loading } = this.state

    return (
      <div>
        <Divider style={{ margin: 0 }} />
        <div className="descwraper">
          <Descriptions title="用户列表" className="desc">
            <Descriptions.Item>
              用户信息展示，可进行用户密码修改和删除用户操作
            </Descriptions.Item>
          </Descriptions>
        </div>
        <div className="contentWraper">
          <Switch>
            <Route
              path="/home/uim/changepassword/:_id?"
              component={this.UimChangePasswordComponent}
            />
            <Route path="/home/uim">
              <Table
                columns={this.columns}
                rowKey={'_id'}
                dataSource={data}
                pagination={pagination}
                loading={data ? false : true}
                onChange={this.handleTableChange}
              />
            </Route>
          </Switch>
        </div>
        <Modal
          title="确认删除操作"
          visible={this.state.isModalVisible}
          onOk={this.modalHandleOk}
          onCancel={this.modalCancel}
          footer={null}
          destroyOnClose={true}
        >
          <p>
            请输入<strong>{this.state.dangerUser?.name}</strong>以验证
          </p>
          <Input onChange={this.inputOnChange} style={{ borderRadius: 7 }} />
          <Button
            style={{ marginTop: 15, width: '100%', borderRadius: 7 }}
            danger
            disabled={!this.state.canDelete}
            onClick={this.confirm.bind(this, this.state.dangerUser?._id)}
          >
            确认操作，删除用户
          </Button>
        </Modal>
      </div>
    )
  }
}
