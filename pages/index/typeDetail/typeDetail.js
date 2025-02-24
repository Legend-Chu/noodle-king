// pages/index/typeDetail/typeDetail.js
Page({
  data: {

  },
  onLoad:function(options) {
    this.getTypeGoodsList(options.id);
  },
  getTypeGoodsList(id){
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
  toGoodDetail(event){
    let id = event.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/goodDetail/goodDetail?id='+id,
    })
  }
})