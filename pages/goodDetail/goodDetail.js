// pages/goodDetail/goodDetail.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  onLoad(options) {
    wx.cloud.database().collection('shop_dish').doc(options.id).get().then(res=>{
      this.setData({
        good:res.data
      })
    })
    // 设置购物车商品数量
    this.setData({
      cartsList:app.globalData.cartsList
    })
  },
  // 分享给好友
  onShareAppMessage(){
    return {
      title:this.data.good.title,
      path:'/pages/goodDetail/goodDetail?id='+this.data.good._id,
      imageUrl:this.data.good.cover
    }
  },
  // 分享到朋友圈
  onShareTimeline(){
    return{
      title:this.data.good.title,
      query:{
        id:this.data.good_id
      },
      imageUrl:this.data.good.cover
    }
  },
  // 添加当前商品到购物车
  addCart(){
    let cartsList = app.globalData.cartsList
    let index = -1
    if(cartsList.length==0){
      this.data.good.number = 1
      // 默认选中 choose = true
      this.data.good.choose = true 
      app.globalData.cartsList.push(this.data.good)   
      wx.setStorageSync('cartsList', app.globalData.cartsList)
    }else{
      for (let idx in cartsList) {
        if(cartsList[idx]._id == this.data.good._id){
          index = idx
        }
      }
      if(index != -1){
        cartsList[index].choose = true
        cartsList[index].number ++
        app.globalData.cartsList = cartsList
        wx.setStorageSync('cartsList', app.globalData.cartsList)
      }else{
        this.data.good.number = 1
        // 默认选中状态
        this.data.good.choose = true
        app.globalData.cartsList.push(this.data.good)   
        wx.setStorageSync('cartsList', app.globalData.cartsList)
      }
    }
    wx.showToast({
      title: '添加成功',
    })
    this.setData({
      cartsList:app.globalData.cartsList
    })
  },
  toOrder(){
    this.addCart()
    let orderList = []
    for(let index in this.data.cartsList){
      if(this.data.cartsList[index].choose == true){
        orderList.push(this.data.cartsList[index])
      }
    }
    app.globalData.orderList = orderList
    wx.navigateTo({
      url: '/pages/order/order',
    })
  }
})