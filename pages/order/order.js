// pages/order/order.js
const app = getApp()
const util = require('../../utils/util')
Page({
  data: {

  },
  onLoad(options) {
    let orderList = app.globalData.orderList
    this.setData({
      orderList
    })
    this.total()
  },
  add(event){
    let index = event.currentTarget.dataset.index
    this.data.orderList[index].number ++
    this.setData({
      orderList:this.data.orderList
    })
    wx.setStorageSync('orderList', app.globalData.orderList)
    this.total()
  }
  ,reduce(event){
    let index = event.currentTarget.dataset.index
    if(this.data.orderList[index].number > 0){
      this.data.orderList[index].number --
      this.setData({
        orderList:this.data.orderList
      })
    }else{
      wx.showToast({
        title: '菜品数量已经不能减少',
        icon:'none'
      })
    }
    wx.setStorageSync('orderList', app.globalData.orderList)
    this.total()
  },
  total(){
    let sum = 0
    let totalNumber = 0
    for(let index in this.data.orderList){
      sum += this.data.orderList[index].price*this.data.orderList[index].number
      totalNumber += this.data.orderList[index].number
    }
    this.setData({
      sum:sum.toFixed(2),
      totalNumber
    })
  },
  getNote(event){
    console.log(event.detail.value);
  },
  // 提交订单给数据库
  addOrder(){
    wx.cloud.database().collection('dishes-orders').add({
      data:{
        totalMoney:this.data.sum,
        goods:this.data.orderList,
        name:'测试用户',
        time:util.formatTime(new Date),
        note:this.data.note,
        // status = -1表示待支付  0表示已支付，待制作，1表示待取餐，2表示已完成
        status:-1
      }
    }).then(res=>{
      // 调用微信支付
      let orderId = res._id
      this.setData({
        orderId
      })
      this.xuniPay()
    })
  },
  xuniPay(){
    wx.showModal({
      title:'提示',
      content:'是否支付菜品,合计:'+this.data.sum+'元'
    }).then(res=>{
      if(res.confirm == true){
      // 支付
        wx.cloud.database().collection('dishes-orders').doc(this.data.orderId).update({
          data:{
            status:0
          }
        })
        .then(res=>{
          // 支付成功后从购物车里清除购买的商品
          this.clearCartList()
          wx.navigateBack({
            delta:0,
            success(){
              wx.showToast({
                title: '支付成功',
              })
            }
          })
        })
      }else{
      // 不支付
        wx.navigateBack({
          delta:0,
          success(){
            wx.showToast({
              icon:'error',
              title: '支付失败',
            })
          }
        })
      }
    })
  },
  // 循环对比删除购物车商品
  clearCartList(){
    for(let i in app.globalData.cartsList){
      for(let j in app.globalData.orderList){
        if(app.globalData.orderList[j]._id==app.globalData.cartsList[i]._id){
          app.globalData.cartsList.splice(i,1)
        }
      }
    }
  }
})