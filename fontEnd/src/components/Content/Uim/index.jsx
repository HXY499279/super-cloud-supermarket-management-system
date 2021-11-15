import React, { Component, } from 'react'
import { Descriptions, Divider, Breadcrumb, Table, Button, message, Popconfirm } from 'antd';
import reqwest from 'reqwest';
import { BrowserRouter, Link, Route, Switch, } from 'react-router-dom'
import { nanoid } from 'nanoid'
import UimChangePassword from './components/UimChangePassword'
import httpUtil from '../../../utils/httpUtil'
import 'antd/dist/antd.css'
import './index.css'


const getRandomuserParams = params => ({
    current: params.pagination.current,
    pageSize: params.pagination.pageSize,
});

export default class Uim extends Component {
    state = {
        data: [],
        pagination: {
            current: 1,
            pageSize: 6,
            total: ''
        },
        loading: false,
        status: 0
    };

    confirm(uid) {
        let { current, pageSize } = this.state.pagination
        const data = { uid: uid, current, pageSize }
        reqwest({
            // 后端接口
            url: '/deleteuser',
            method: 'post',
            type: 'json',
            // 传递给后端的数据
            data: data,
        })
            //根据返回的状态码status判断是否删除用户成功
            .then(res => {
                console.log(res)
                this.setState({
                    data: res.users
                })
                if (res.status === 'success') {
                    message.success('删除成功');
                } else {
                    message.error('删除失败');
                }
            })
    }

    columns = [
        {
            title: '账号',
            dataIndex: 'useraccount',
            key: 'useraccount'
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
            dataIndex: 'uid',
            key: 'uid',
            render: (uid) => {
                return (
                    <>
                        <Button
                            type="primary"
                            style={{ borderRadius: 5 }}
                        >
                            <Link to={`/home/uim/changepassword/${uid}`}>
                                更改密码
                            </Link>
                        </Button>
                        <Button
                            type="primary"
                            style={{ borderRadius: 5, marginLeft: 20 }}
                            danger
                        >
                            <Popconfirm
                                title="确定删除该用户吗?"
                                onConfirm={this.confirm.bind(this, uid)}
                                okText="确认"
                                cancelText="取消"
                            >
                                删除用户
                            </Popconfirm>
                        </Button>
                    </>
                )
            }
        },
    ];

    componentDidMount() {
        const { pagination } = this.state;
        this.fetch({ pagination });
    }

    handleTableChange = (pagination) => {
        console.log(pagination)
        let { current, pageSize } = pagination
        this.setState({
            pagination: {
                current,
                pageSize
            }
        })
        this.fetch({
            pagination,
        });
    };

    fetch = (params = {}) => {
        this.setState({ loading: true });
        httpUtil.getAllUsers(getRandomuserParams(params))
            .then(data => {
                this.setState({
                    loading: false,
                    // 根据接口返回的数据源
                    data: data.users,
                    pagination: {
                        ...params.pagination,
                        total: data.total
                    },
                });
            })
    };

    UimChangePasswordComponent = (props) => {
        let uid = props.match.params.uid * 1
        let dataitem = this.state.data.filter(item => {
            if (item.uid === uid) {
                return item
            } else {
                return 0
            }
        })
        console.log(dataitem)
        return <UimChangePassword data={dataitem} />
    }

    render() {
        const { data, pagination, loading } = this.state;
        // let encryptedUser = JSON.parse(JSON.stringify(data))
        // encryptedUser.forEach(item => {
        //     item.upassword = "******"
        // })
        // console.log(this.state.data)
        function TableComponent() {
            return <Table
                columns={this.columns}
                rowKey={"_id"}
                dataSource={data}
                pagination={pagination}
                loading={loading}
                onChange={this.handleTableChange}
            />
        }
        return (
            <div>
                <Divider style={{ margin: 0 }} />
                <div className="descwraper">
                    <Breadcrumb className="bdc">
                        <Breadcrumb.Item>
                            <a href="/home">主页</a>
                        </Breadcrumb.Item>
                        <Breadcrumb.Item>用户信息管理</Breadcrumb.Item>
                    </Breadcrumb>
                    <Descriptions title="用户列表" className="desc">
                        <Descriptions.Item>用户信息展示，可进行用户密码修改和删除用户操作</Descriptions.Item>
                    </Descriptions>
                </div>
                <div className="contentWraper">
                    <BrowserRouter>
                        <Switch>
                            <Route path='/home/uim/changepassword/:uid?' component={this.UimChangePasswordComponent} />
                            <Route path='/home/uim' component={TableComponent.bind(this)} />
                        </Switch>
                    </BrowserRouter>
                </div>
            </div>
        )
    }
}
