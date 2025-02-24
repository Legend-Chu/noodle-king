// pages/index/normalDishes.js
const app = getApp()
Page({
  /*页面的初始*/
  data:{
    currentType:0,
    navList:[],
  },
  onShow(){
    this.setData({
      cartsList:app.globalData.cartsList
    })
    // 计算合计价格
    this.total()
  },
  /*生命周期函数--监听页面加载*/
  onLoad() {
    this.getDishesVerity();
    this.getDishesList();
    // 设置购物车商品数量
    this.setData({
      cartsList:app.globalData.cartsList
    })
  },
  //获取菜品分类
  getDishesVerity(){
    wx.cloud.database().collection('dishes-vetify').get().then(res=>{
      // console.log(res.data);
      this.setData({
        dishesVerity:res.data
      })
      this.getTypeGoodList_first(res.data[0]._id)
    })
  },
  // 获取菜品列表
  getDishesList(){
    wx.cloud.database().collection('shop_dish').get().then(res=>{
      this.setData({
        goodList:res.data
      })
    })
  },
  //获取点击了哪个分类
  getTypeGoodList(event){
    let index = event.currentTarget.dataset.index
    let id = event.currentTarget.dataset.id
    this.setData({
      currentType:index
    })
    wx.cloud.database().collection('shop_dish')
    .where({
      type:id
    })
    .get()
    .then(res=>{
      this.setData({
        goodList:res.data
      })
    })
  },
  // 获取第一个分类
  getTypeGoodList_first(id){
    wx.cloud.database().collection('shop_dish')
    .where({
      type:id
    })
    .get().then(res1=>{
      this.setData({
        goodList:res1.data
      })
    })
  },
  // 点击跳转商品详情
  toGoodDetail(event){
    let id = event.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/goodDetail/goodDetail?id='+id,
    })
  },
  // 添加当前商品到购物车
  addCart(event){
    wx.cloud.database().collection('shop_dish').doc(event.currentTarget.dataset.id).get().then(res=>{
      this.setData({
        good:res.data
      })
      this.doSomethingElse()
    })
  },
  toOrder(){
    let orderList = []
    for(let index in this.data.cartsList){
      orderList.push(this.data.cartsList[index])
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
  },
  // 计算购物车中菜品的总价格
  total(){
    let sum = 0
    for(let index in this.data.cartsList){
      sum += this.data.cartsList[index].price*this.data.cartsList[index].number
    }
    this.setData({
      sum:sum.toFixed(2)
    })
  },
  // 用于封装异步请求之后执行的步骤，异步执行的是addCart请求哪个商品添加到购物车
  doSomethingElse(){
    let cartsList = app.globalData.cartsList
    let index = -1
    if(cartsList.length==0){
      this.data.good.number = 1
      app.globalData.cartsList.push(this.data.good)   
      wx.setStorageSync('cartsList', app.globalData.cartsList)
    }else{
      for (let idx in cartsList) {
        if(cartsList[idx]._id == this.data.good._id){
          index = idx
        }
      }
      // 商品已在购物车中，直接在购物车+1
      if(index != -1){
        cartsList[index].number ++
        app.globalData.cartsList = cartsList
        wx.setStorageSync('cartsList', app.globalData.cartsList)
      }
      // 否则在购物车中创建这个商品
      else{
        this.data.good.number = 1
        app.globalData.cartsList.push(this.data.good)   
        wx.setStorageSync('cartsList', app.globalData.cartsList)
      }
    }
    this.total()
    wx.showToast({
      title: '添加成功',
    })
    this.setData({
      cartsList:app.globalData.cartsList
    })
  },
  // 显示购物车
  //点击我显示底部弹出框
clickme:function(){
  this.showModal();
},

//显示对话框
 showModal: function () {
   // 显示遮罩层
   var animation = wx.createAnimation({
     duration: 200,
     timingFunction: "linear",
     delay: 0
   })
   this.animation = animation
   animation.translateY(300).step()
   this.setData({
     animationData: animation.export(),
     showModalStatus: true
   })
   setTimeout(function () {
     animation.translateY(0).step()
     this.setData({
       animationData: animation.export()
     })
   }.bind(this), 200)
 },
 //隐藏对话框
 hideModal: function () {
   // 隐藏遮罩层
   var animation = wx.createAnimation({
     duration: 200,
     timingFunction: "linear",
     delay: 0
   })
   this.animation = animation
   animation.translateY(300).step()
   this.setData({
     animationData: animation.export(),
   })
   setTimeout(function () {
     animation.translateY(0).step()
     this.setData({
       animationData: animation.export(),
       showModalStatus: false
     })
   }.bind(this), 200)
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
})


