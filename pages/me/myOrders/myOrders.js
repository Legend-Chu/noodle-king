// pages/me/myOrders/myOrders.js
const app = getApp()
Page({
  data: {

  },
  onLoad(options) {
    this.setData({
      status:options.status
    })
    this.getOrderList()

  },
  chooseType(event){
    let status = event.currentTarget.dataset.type
    this.setData({
      status
    })
    this.getOrderList()
  },
  getOrderList(){
    wx.cloud.database().collection('dishes-orders').where({
      status:Number(this.data.status),
      _openid:app.globalData.openid
    })
    .get()
    .then(res=>{
      this.setData({
        orderList:res.data
      })
    })
  },
  xuniPay(event){
    let index = event.currentTarget.dataset.index
    wx.showModal({
      title:'提示',
      content:'是否支付菜品,合计:'+this.data.orderList[index].totalMoney+'元',
      confirmText:'支付'
    }).then(res=>{
      if(res.confirm == true){
      // 支付
        wx.cloud.database().collection('dishes-orders').doc(this.data.orderList[index]._id).update({
          data:{
            status:0
          }
        })
        .then(res=>{
          wx.showToast({
            title: '支付成功',
          })
          this.getOrderList()
        })
      }else{
      // 不支付
      wx.showToast({
        icon:'error',
        title: '支付失败',
      })
      }
    })
  }
})