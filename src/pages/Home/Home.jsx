import React, { Component } from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { Layout, Affix } from 'antd'
import { nanoid } from 'nanoid'
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  LogoutOutlined,
} from '@ant-design/icons'
//导入组件
import Routes from '../../utils/routes'
import SideMenu from '../../components/Menu'
import './index.css'

const { Header, Sider } = Layout

export class Home extends Component {
  constructor(props) {
    super(props)
    this.state = {
      collapsed: false,
    }
  }

  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    })
  }

  logoClick = () => {
    window.location.href = '/'
  }

  logout = () => {
    sessionStorage.removeItem('Token')
    window.location.href = '/login'
  }

  showContent = () => {
    return (
      <Layout className="site-layout">
        <Header
          className="site-layout-background"
          style={{ paddingLeft: 16, height: 35 }}
        >
          {React.createElement(
            this.state.collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
            {
              className: 'trigger',
              onClick: this.toggle,
            }
          )}
          <LogoutOutlined id="logout" title="退出登陆" onClick={this.logout} />
        </Header>
        <div>
          <Switch>
            {Routes.map((route) => {
              return (
                <Route
                  key={nanoid()}
                  path={route.path}
                  component={route.component}
                />
              )
            })}
          </Switch>
        </div>
      </Layout>
    )
  }

  showSider = () => {
    return (
      <Affix>
        <Sider
          id="sider"
          trigger={null}
          collapsible
          collapsed={this.state.collapsed}
          style={{ minHeight: '100vh' }}
        >
          <div
            className="logo"
            style={{ color: 'white', textAlign: 'center', padding: 19 }}
          >
            <div onClick={this.logoClick} id="logo">
              重邮云超市管理系统
            </div>
          </div>
          <SideMenu />
        </Sider>
      </Affix>
    )
  }

  componentDidMount() {
    // 配合退出登陆的删除Token，如果没有Token访问Home页面，就跳转到登陆页面
    if (!sessionStorage.getItem('Token')) {
      window.location.href = '/'
    }
  }

  render() {
    return (
      <Layout>
        {this.showSider()}
        {this.showContent()}
      </Layout>
    )
  }
}
