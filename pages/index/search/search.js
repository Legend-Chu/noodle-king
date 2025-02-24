// pages/index/search/search.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },
  // 获取页面输入内容
  getValue(event){
    let inputValue = event.detail.value
    this.setData({
      inputValue
    })
  },
  // 点击搜索按钮进行搜索
  search(){
    wx.cloud.database().collection('shop_dish').where({
      title:wx.cloud.database().RegExp({
        regexp: this.data.inputValue,
        options: 'i'
      })
    }).get()
    .then(res=>{
      this.setData({
        goodList:res.data
      })
    })  
  },
  toGoodDetail(res){
    let id = res.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/goodDetail/goodDetail?id='+id,
    })
  }
})