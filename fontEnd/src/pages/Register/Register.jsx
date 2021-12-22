import React, { Component } from 'react'
import { Form, Input, Button, Checkbox, message, Image } from 'antd'
import 'antd/dist/antd.css'
import './index.css'
import httpUtil from '../../utils/httpUtil'
import pic from '../../assets/2.jpg'
import { Link } from 'react-router-dom'

const layout = {
  labelCol: { span: 10 },
  wrapperCol: { span: 50 },
}
const tailLayout = {
  wrapperCol: { offset: 0, span: 10 },
}

export class Register extends Component {
  constructor(props) {
    super(props)
    this.state = {
      admin: {
        adminaccount: '',
        adminpwd: '',
      },
    }
  }

  registerHandle = () => {
    if (
      this.accountElem.props.value !== undefined &&
      this.passwordElem.props.value !== undefined &&
      this.nameElem.props.value !== undefined
    ) {
      const { admin } = this.state
      admin.name = this.nameElem.props.value
      admin.adminaccount = this.accountElem.props.value
      admin.adminpwd = this.passwordElem.props.value
      this.setState(
        {
          admin,
        },
        () => {
          httpUtil.register(this.state.admin).then((res) => {
            if (res) {
              message.success(res.message)
              setTimeout(() => {
                window.location.href = './login'
              }, 1000)
            }
          })
        }
      )
    }
  }

  render() {
    return (
      <div>
        <Image id="pageLogin" src={pic} preview={false} />
        <div id="formWrap">
          <p className="login-p" style={{ color: 'white', fontSize: 18 }}>
            请新建您的账号注册系统
          </p>
          <Form initialValues={{ remember: true }} {...layout}>
            <Form.Item
              name="name"
              rules={[{ required: true, message: '请输入您的姓名！' }]}
            >
              <Input
                ref={(input) => {
                  this.nameElem = input
                }}
                style={{ borderRadius: 7 }}
                placeholder="请输入您的姓名"
              />
            </Form.Item>

            <Form.Item
              name="account"
              rules={[{ required: true, message: '请输入您的用户名！' }]}
            >
              <Input
                ref={(input) => {
                  this.accountElem = input
                }}
                style={{ borderRadius: 7 }}
                placeholder="请输入您的账号"
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[{ required: true, message: '请输入您的密码！' }]}
              hasFeedback
            >
              <Input.Password
                ref={(input) => {
                  this.passwordElem = input
                }}
                style={{ borderRadius: 7 }}
                placeholder="请输入您的密码"
              />
            </Form.Item>
            <Form.Item
              name="confirm"
              dependencies={['password']}
              hasFeedback
              rules={[
                {
                  required: true,
                  message: 'Please confirm your password!',
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve()
                    }
                    return Promise.reject(new Error('您输入的两次密码不相同！'))
                  },
                }),
              ]}
            >
              <Input.Password
                placeholder="请确认您的密码"
                style={{ borderRadius: 7 }}
              />
            </Form.Item>
            <Form.Item {...tailLayout}>
              <div className="button-wrapper">
                <Button
                  type="primary"
                  htmlType="submit"
                  className="register-button"
                  onClick={this.registerHandle}
                  style={{ borderRadius: 7 }}
                >
                  注册
                </Button>
                <Link to="/login">
                  <Button
                    type="primary"
                    className="register-button"
                    style={{ borderRadius: 7 }}
                  >
                    返回
                  </Button>
                </Link>
              </div>
            </Form.Item>
          </Form>
          <p className="login-p" style={{ color: 'white' }}>
            Super-CQUPT-Supermarket-Management-System
          </p>
          <p className="login-p" style={{ color: 'white' }}>
            Designed By HXY
          </p>
        </div>
      </div>
    )
  }
}
