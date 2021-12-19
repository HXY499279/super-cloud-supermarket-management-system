import React, { Component } from 'react'
import {
  Form,
  Input,
  InputNumber,
  Button,
  message,
  PageHeader,
  Select,
  Upload,
} from 'antd'
import { nanoid } from 'nanoid'
import httpUtil from '../../../../../utils/httpUtil'
import getStandardStr from '../../../../../utils/getStandardStr'
import { withRouter } from 'react-router-dom'
import './index.css'

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 6 },
}
const tailLayout = {
  wrapperCol: { offset: 10, span: 16 },
}

const { Option } = Select

class CimAddCommodity extends Component {
  constructor(props) {
    super(props)
    this.state = {
      subCategory: [],
    }
  }

  property = {
    name: 'file',
    headers: {
      authorization: 'authorization-text',
    },
    beforeUpload: () => {
      return false
    },
    maxCount: 1,
  }

  onFinish = (data) => {
    // 处理空格
    data.commodityName = getStandardStr(data.commodityName)
    data.sellingUnit = getStandardStr(data.sellingUnit)
    data.file = data.file.file
    let formData = new FormData()
    for (let [key, value] of Object.entries(data)) {
      formData.append(key, value)
    }
    httpUtil.addCommodity(formData).then((res) => {
      console.log(res)
      message.success('商品添加成功！')
      window.location.href = '/home/cim'
    })
  }

  // 渲染分类下拉框的选项
  showCategoryList = () => {
    return this.state.subCategory.map((item, index) => {
      return (
        <Option value={item._id} key={nanoid()}>
          {item.categoryName}
        </Option>
      )
    })
  }

  // 获取下拉框的值
  categorySelectChange = (e) => {
    this.categorySelect.value = e
  }

  handleFileChange = (e) => {
    console.log(e.target.files[0])
  }

  componentDidMount = () => {
    // 请求分类列表
    httpUtil.getCategories({ count: 0, pageSize: 0 }).then((res) => {
      console.log(res)
      this.setState({
        subCategory: res.data,
      })
    })
  }

  render() {
    return (
      <div className="contentWraper" style={{ minHeight: 0 }}>
        <PageHeader
          className="site-page-header"
          onBack={() => {
            this.props.history.goBack()
          }}
          subTitle="商品信息管理/新增商品"
          style={{ paddingLeft: 10, backgroundColor: 'white' }}
        />
        <Form
          {...layout}
          id="addCommodityForm"
          name="basic"
          size="large"
          initialValues={{ remember: true }}
          onFinish={this.onFinish}
        >
          <Form.Item
            label="商品名称"
            name="commodityName"
            required={false}
            rules={[{ required: true, message: '请输入商品名称！' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="商品分类"
            name="category_id"
            required={false}
            rules={[{ required: true, message: '请选择商品分类！' }]}
          >
            <Select
              name="category_id"
              style={{ width: '100%' }}
              // defaultValue='onsale'
              ref={(elev) => {
                this.categorySelect = elev
              }}
              onChange={this.categorySelectChange}
            >
              {this.showCategoryList()}
            </Select>
          </Form.Item>

          <Form.Item
            label="商品成本"
            name="cost"
            required={false}
            rules={[{ required: true, message: '请输入商品成本！' }]}
          >
            <InputNumber className="input-number" min={0} />
          </Form.Item>

          <Form.Item
            label="商品现价"
            name="currentPrice"
            required={false}
            rules={[{ required: true, message: '请输入商品现价！' }]}
          >
            <InputNumber className="input-number" min={0} />
          </Form.Item>

          <Form.Item
            label="商品库存"
            name="inventory"
            required={false}
            rules={[{ required: true, message: '请输入商品库存量！' }]}
          >
            <InputNumber className="input-number" min={0} />
          </Form.Item>

          <Form.Item
            label="商品警戒库存"
            name="danger_inventory"
            required={false}
            rules={[{ required: true, message: '请输入商品警戒库存量！' }]}
          >
            <InputNumber className="input-number" min={0} />
          </Form.Item>

          <Form.Item
            label="售卖单位"
            name="sellingUnit"
            required={false}
            rules={[{ required: true, message: '请输入商品产地！' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="商品图片"
            name="file"
            required={false}
            rules={[{ required: true, message: '请上传商品图片！' }]}
          >
            <Upload {...this.property}>
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

export default withRouter(CimAddCommodity)
