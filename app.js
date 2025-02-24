App({
  onLaunch: function () {
    wx.cloud.init({
      env:''
    })
    if(wx.getStorageSync('cartsList')){
      this.globalData.cartsList = wx.getStorageSync('cartsList')
    }
    wx.cloud.callFunction({
      name:'getOpenid'
    }).then(res=>{
      this.globalData.openid = res.result.openid
    })
  },
  globalData:{
    userInfo:null,
    // 购物车列表
    cartsList:[],
    // 订单列表
    orderList:null,
    // 用户的openid
    openid:null
  }
})


