import React, { Component } from 'react'
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom'
import { message } from 'antd'
import { Home, Login, Register } from './pages/index'

message.config({
  top: 50,
  maxCount: 3,
})

export default class App extends Component {
  render() {
    return (
      <div>
        <BrowserRouter>
          <Switch>
            <Route path="/login" component={Login} />
            <Route path="/register" component={Register} />
            <Route path="/home" component={Home} />
            <Redirect path="/" to="/login" />
          </Switch>
        </BrowserRouter>
      </div>
    )
  }
}
