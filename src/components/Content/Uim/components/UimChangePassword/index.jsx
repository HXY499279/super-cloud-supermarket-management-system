import React, { Component } from 'react'
import { Form, Input, Button, message, PageHeader, Skeleton } from 'antd'
import reqwest from 'reqwest'
import { withRouter } from 'react-router-dom'
import './index.css'
import httpUtil from '../../../../../utils/httpUtil'

const layout = {
  labelCol: { span: 9 },
  wrapperCol: { span: 5 },
}
const tailLayout = {
  wrapperCol: { offset: 10, span: 16 },
}

class UimChangePassword extends Component {
  constructor(props) {
    super(props)
    this.state = {
      user: {},
      loading: true,
    }
  }

  onFinish(predata, user) {
    user = { ...user, ...predata }
    if (user.modifiedpassword === predata.userpwd) {
      message.warning('密码未修改！')
    } else {
      const data = { _id: user._id, modifiedpassword: user.modifiedpassword }
      httpUtil.updatePwd(data).then((res) => {
        message.success(res.message)
        this.props.history.goBack()
      })
    }
  }

  componentWillMount() {
    this.setState(
      {
        user_id: this.props.match.params._id,
      },
      () => {
        httpUtil.getUser({ _id: this.state.user_id }).then((res) => {
          this.setState({
            user: res.user,
            loading: false,
          })
        })
      }
    )
  }

  render() {
    const { user, loading } = this.state
    return (
      <div>
        <PageHeader
          className="site-page-header"
          onBack={() => {
            this.props.history.goBack()
          }}
          subTitle="用户信息管理/修改用户密码"
          style={{ paddingLeft: 10, backgroundColor: 'white' }}
        />
        <Form
          {...layout}
          id="changePasswordFrom"
          name="basic"
          initialValues={{ remember: true }}
          size="large"
          onFinish={this.onFinish.bind(this, user)}
        >
          <Form.Item
            label="_id"
            name="_id"
            required={false}
            initialValue={`${user._id}`}
            hidden
          >
            <Input hidden />
          </Form.Item>
          <Form.Item
            label="用户姓名"
            name="name"
            required={false}
            initialValue={`${user.name}`}
          >
            <Input hidden />
            {loading ? (
              <Skeleton.Input
                style={{ width: 200, borderRadius: 3 }}
                active={true}
                size="small"
              />
            ) : (
              user.name
            )}
          </Form.Item>
          <Form.Item
            label="用户账号"
            name="useraccount"
            required={false}
            initialValue={`${user.useraccount}`}
          >
            <Input hidden />
            {loading ? (
              <Skeleton.Input
                style={{ width: 200, borderRadius: 3 }}
                active={true}
                size="small"
              />
            ) : (
              user.useraccount
            )}
          </Form.Item>
          <Form.Item label="原密码" name="userpwd" required={false}>
            <Input hidden />
            {loading ? (
              <Skeleton.Input
                style={{ width: 200, borderRadius: 3 }}
                active={true}
                size="small"
              />
            ) : (
              user.userpwd
            )}
          </Form.Item>
          <Form.Item label="新密码" name="modifiedpassword" required={false}>
            <Input.Password />
          </Form.Item>
          <Form.Item {...tailLayout}>
            <Button
              type="primary"
              htmlType="submit"
              style={{ borderRadius: 5 }}
            >
              提交修改
            </Button>
          </Form.Item>
        </Form>
      </div>
    )
  }
}

export default withRouter(UimChangePassword)
