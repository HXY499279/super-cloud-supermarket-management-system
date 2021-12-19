import React, { Component } from 'react'
import { Card, Divider, Input, Popconfirm, Button, message, Image } from 'antd'
import { EditOutlined, CloseOutlined } from '@ant-design/icons'
import binaryArrToUrl from '../../../../../utils/binaryArrToUrl'
import './index.css'
import httpUtil from '../../../../../utils/httpUtil'

export default class CommodityCard extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: {},
      isEdit: false,
    }
  }

  edit = () => {
    this.setState({
      isEdit: true,
    })
  }
  // 删除商品操作
  delete = (item) => {
    this.props.deleteCommodity(item)
  }
  // 确认编辑操作,发送表单请求到后端
  comfimEdit = () => {
    const [_id, currentPrice, cost, inventory, sellingUnit, danger_inventory] =
      [
        this.state.data._id,
        this.currentPriceElev.state.value,
        this.costElev.state.value,
        this.inventoryElev.state.value,
        this.sellingUnitElev.state.value,
        this.danger_inventoryElev.state.value,
      ]
    const newData = {
      _id,
      currentPrice,
      cost,
      inventory,
      sellingUnit,
      danger_inventory,
    }
    httpUtil.updateCommodity(newData).then((res) => {
      message.success(res.message)
      let oldData = this.state.data
      let data = { ...oldData, ...newData }
      this.setState({
        data: data,
        isEdit: false,
      })
    })
  }
  // 属性函数化
  propertyEdit = (keyword) => {
    const item = this.state.data
    const isEdit = this.state.isEdit
    let tag = 0
    if (keyword === 'inventory' && item[keyword] < item['danger_inventory']) {
      tag = 1
    }
    return isEdit ? (
      <Input
        className="editInput"
        defaultValue={item[keyword]}
        onChange={this[`${keyword}Change`]}
        ref={(elev) => {
          this[`${keyword}Elev`] = elev
        }}
      />
    ) : tag ? (
      <span style={{ color: 'red' }}>{item[keyword]}</span>
    ) : (
      item[keyword]
    )
  }

  componentDidMount = () => {
    this.setState({
      data: this.props.data,
    })
  }

  render() {
    const item = this.state.data
    const { file = null, picMimetype = '' } = item
    const url = binaryArrToUrl(file, picMimetype)
    const isEdit = this.state.isEdit
    return (
      <Card
        style={{ width: 307, height: 375, margin: '0 auto' }}
        cover={
          <Image
            alt="图片出错"
            src={url}
            height={186}
            width={227}
            preview={false}
          />
        }
        actions={[
          isEdit ? (
            <Button
              type="primary"
              size="small"
              style={{ borderRadius: 5 }}
              onClick={this.comfimEdit}
            >
              确认
            </Button>
          ) : (
            <EditOutlined key="edit" onClick={this.edit} />
          ),
          <Popconfirm
            title="确定删除该商品吗?"
            onConfirm={this.delete.bind(this, item)}
            okText="确认"
            cancelText="取消"
          >
            <CloseOutlined key="ellipsis" />
          </Popconfirm>,
        ]}
      >
        <p
          style={{
            margin: '10PX 0 0 0 ',
            fontWeight: 900,
            height: 29,
            paddingLeft: 15,
            paddingRight: 15,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            fontSize: 18,
            textAlign: 'center',
          }}
          title={item.commodityName}
        >
          {item.commodityName}
        </p>
        <div className="detailWraper">
          <div className="detail">火爆: {'😍'.repeat(item.popularity)}</div>
          <Divider style={{ margin: 0 }} />
          <div className="detail">
            现价: {this.propertyEdit('currentPrice')}元
          </div>
          <Divider style={{ margin: 0 }} />
          <div className="detail">
            库存: {this.propertyEdit('inventory')}
            {`${item.sellingUnit}`}
          </div>
          <Divider style={{ margin: 0 }} />
          <div className="detail">
            警戒库存: {this.propertyEdit('danger_inventory')}
            {`${item.sellingUnit}`}{' '}
          </div>
        </div>
        <div className="detailWraper">
          <div className="detail">分类: {item.category?.categoryName} </div>
          <Divider style={{ margin: 0 }} />
          <div className="detail">成本: {this.propertyEdit('cost')}元 </div>
          <Divider style={{ margin: 0 }} />
          <div className="detail">
            销量: {item.salesVolume}
            {`${item.sellingUnit}`}{' '}
          </div>
          <Divider style={{ margin: 0 }} />
          <div className="detail">
            售卖单位: {this.propertyEdit('sellingUnit')}{' '}
          </div>
        </div>
      </Card>
    )
  }
}
