import React, { Component } from 'react'
import { Form, Input, Button, message, PageHeader, Upload } from 'antd'
import { withRouter } from 'react-router-dom'
import AD_NUMBER from '../../constant'
import httpUtil from '../../../../../utils/httpUtil'
import './index.css'

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 6 },
}
const tailLayout = {
  wrapperCol: { offset: 10, span: 16 },
}

class AdmAddAd extends Component {
  constructor(props) {
    super(props)
    this.state = {
      file: '',
      adid: '',
    }
  }

  uploadTheadid = () => {}

  onFinish = (data) => {
    if (
      data.adCompany.search(/\s/) === -1 &&
      data.adName.search(/\s/) === -1 &&
      data.adCategory.search(/\s/) === -1
    ) {
      let formData = new FormData()
      formData.append('file', data.file.file)
      formData.append('adCompany', data.adCompany)
      formData.append('adName', data.adName)
      formData.append('adCategory', data.adCategory)
      httpUtil.addAd(formData).then((res) => {
        message.success(res.message)
        window.location.href = '/home/adm'
      })
    } else {
      message.warning('输入内容不能含有空格！')
    }
  }

  render() {
    const adNumber = this.props.match.params.adNumber
    return adNumber >= AD_NUMBER ? (
      (window.location.href = '/home/adm')
    ) : (
      <div>
        <PageHeader
          className="site-page-header"
          onBack={() => {
            this.props.history.goBack()
          }}
          subTitle="广告投放管理/新增广告"
          style={{ paddingLeft: 10, backgroundColor: 'white' }}
        />
        <Form
          {...layout}
          id="addAdForm"
          name="basic"
          size="large"
          initialValues={{ remember: true }}
          onFinish={this.onFinish}
          encType="multipart/form-data"
        >
          <Form.Item
            label="广告公司"
            name="adCompany"
            required={false}
            rules={[{ required: true, message: '请输入广告公司名称！' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="广告名称"
            name="adName"
            required={false}
            rules={[{ required: true, message: '请输入广告名称！' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="所属分类"
            name="adCategory"
            required={false}
            rules={[{ required: true, message: '请输入广告分类！' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="图片地址"
            name="file"
            required={false}
            rules={[{ required: true, message: '请上传广告图片！' }]}
          >
            <Upload
              name="file"
              headers={{ authorization: 'authorization-text' }}
              beforeUpload={() => {
                return false
              }}
              maxCount={1}
            >
              <Button type="primary" size="middle" style={{ borderRadius: 5 }}>
                上传图片
              </Button>
            </Upload>
          </Form.Item>

          <Form.Item {...tailLayout}>
            <Button
              type="primary"
              htmlType="submit"
              style={{ borderRadius: 5 }}
            >
              添加
            </Button>
          </Form.Item>
        </Form>
      </div>
    )
  }
}
export default withRouter(AdmAddAd)
