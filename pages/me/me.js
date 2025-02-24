// pages/me/me.js
const app = getApp()
Page({
  data: {

  },
  onLoad(options) {

  },
  toMyOrder(){
    wx.navigateTo({
      url: '/pages/me/myOrders/myOrders?status=-1',
    })
  },
  login(){
    // 获取用户信息
    wx.getUserProfile({
      desc: '用于完善信息',
    })
    .then(res=>{
      this.setData({
        userInfo:res.userInfo
      })
      // 添加用户数据到数据库
      wx.cloud.database().collection('shop-users')
      .where({
        _openid:app.globalData._openid
      })
      .get()
      .then(result=>{
        if(result.data.length == 0){
          // 添加用户数据到数据库
          wx.cloud.database().collection('shop-users')
          .add({
            data:{
              avatarUrl:res.userInfo.avatarUrl,
              nickName:res.userInfo.nickName
            }
          })
          .then(addRes=>{
            wx.showToast({
              title: '登录成功',
            })
          })
        }else{
          wx.cloud.database().collection('shop-users')
          .doc(result.data[0]._id)
          .update({
            data:{
              avatarUrl:res.userInfo.avatarUrl,
              nickName:res.userInfo.nickName
            }
          })
          .then(updateRes=>{
            wx.showToast({
              title:'欢迎回来'
            })  
          })
        } 
      })
    })
  },
  logout(){
    app.globalData.userInfo = null
    this.setData({
      userInfo:null
    })
  },
  toFeedback(){
    wx.navigateTo({
      url: '/pages/me/feedback/feedback',
    })
  }
})