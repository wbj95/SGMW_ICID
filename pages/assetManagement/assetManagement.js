// pages/assetManagement/assetManagement.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    assetList:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //加载中
    wx.showLoading({ title: '加载中', icon: 'loading', duration: 20000 });
    var that = this;
    wx.request({
      url: app.globalData.serverUrl+'/assetManage/getAllAsset',
      data: {
      },
      method: 'GET',
      header: {
        'Content-type': 'application/json'
      },
      success:function(res){
        wx.hideLoading()//加载中隐藏
        console.log(res.data.data);
        that.setData({
          assetList: res.data.data
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})