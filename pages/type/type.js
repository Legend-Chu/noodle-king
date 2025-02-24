// pages/type/type.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentType:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getDishesVerity();
    this.getDishesList();
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
    .get().then(res=>{
      this.setData({
        goodList:res.data
      })
    })
  },
  // 点击跳转商品详情
  toGoodDetail(event){
    let id = event.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/goodDetail/goodDetail?id='+id,
    })
  }
})
