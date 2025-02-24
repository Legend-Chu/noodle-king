// pages/index/bannerDetail/bannerDetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad:function(options) {
    //获取到图片的id,根据传过来的数据来查询轮播图数据
    wx.cloud.database().collection('shop_banner').doc(options.bannerId).get().then(res=>{
      this.setData({
        banner:res.data
      })
    })
  }
})