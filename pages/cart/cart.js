// pages/cart/cart.js
const app = getApp()
Page({
  onShow(){
    this.setData({
      cartsList:app.globalData.cartsList
    })
    // 计算合计价格
    this.total()
  },
  data: {
    allChoose:false
  },
  add(event){
    let index = event.currentTarget.dataset.index
    this.data.cartsList[index].number ++
    this.setData({
      cartsList:this.data.cartsList
    })
    wx.setStorageSync('cartsList', app.globalData.cartsList)
    this.total()
  }
  ,reduce(event){
    let index = event.currentTarget.dataset.index
    if(this.data.cartsList[index].number > 1){
      this.data.cartsList[index].number --
      this.setData({
        cartsList:this.data.cartsList
      })
    }else{
      app.globalData.cartsList.splice(index,1)
      this.setData({
        cartsList:this.data.cartsList
      })
    }
    wx.setStorageSync('cartsList', app.globalData.cartsList)
    this.total()
  },
  chooseGood(event){
    let index = event.currentTarget.dataset.index
    this.data.cartsList[index].choose = !this.data.cartsList[index].choose
    this.setData({
      cartsList:this.data.cartsList
    })
    // 更新全局中的购物车数据
    app.globalData.cartsList = this.data.cartsList
    wx.setStorageSync('cartsList', this.data.cartsList)
    this.total()
  },
  toGoodDetail(event){
    let id = event.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/goodDetail/goodDetail?id='+id,
    })
  },
  // 全选
  allChoose(){
    this.setData({
      allChoose:!this.data.allChoose
    })
    if(this.data.allChoose == true){
      for(let index in this.data.cartsList){
        this.data.cartsList[index].choose = true
      }
    }else{
      for(let index in this.data.cartsList){
        this.data.cartsList[index].choose = false
      }
    }
    this.setData({
      cartsList:this.data.cartsList
    })
    wx.setStorageSync('cartsList', this.cartsList)
    this.total()
  },
  // 计算购物车中菜品的总价格
  total(){
    let sum = 0
    for(let index in this.data.cartsList){
      if(this.data.cartsList[index].choose==true){
        sum += this.data.cartsList[index].price*this.data.cartsList[index].number
      }
    }
    this.setData({
      sum:sum.toFixed(2)
    })
  },
  toOrder(){
    let orderList = []
    for(let index in this.data.cartsList){
      if(this.data.cartsList[index].choose == true){
        orderList.push(this.data.cartsList[index])
      }
    }
    app.globalData.orderList = orderList
    if(app.globalData.orderList.length==0){
      wx.showToast({
        icon:"error",
        title: '请选择商品',
      })
      return
    }
    wx.navigateTo({
      url: '/pages/order/order',
    })
  }
})