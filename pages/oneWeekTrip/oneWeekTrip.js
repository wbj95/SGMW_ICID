// pages/oneWeekTrip/oneWeekTrip.js
var QQMapWX = require('../../libs/qqmap-wx-jssdk.js');
var config = require('../../libs/config.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    onecar: [],
    uhide: 0,
    imageurl1: "../../images/down.png",
    imageurl2: "../../images/up.png",
    datastyle: 0x01
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    wx.showLoading({
      title: '加载中',
      icon: 'loading',
      duration: 20000
    });
    var vin = options.vin;
    console.log(vin);
    wx.request({
      url: 'https://www.sgmwzhilian.club/carmanage/CarInfo/QueryTrip?vin=' + vin,
      method: 'GET',
      data: {},
      header: {
        'Accept': 'application/json'
      },
      success: function(res) {
        wx.hideLoading()
        var onecar = res.data.Trip
        console.log(onecar);
        if (onecar == '') {
          //返回无数据
          console.log("空")
          //在前端显示无数据
          that.setData({
            datastyle: 0x00
          });
        } else {
          console.log("有")
          that.setData({
            Trip: onecar,
            datastyle: 0x01
          });
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  //点击切换隐藏和显示
  toggleBtn: function(event) {
    console.log("111");
    console.log(event.currentTarget.id)
    var that = this;
    var toggleBtnVal = that.data.uhide;
    var itemId = event.currentTarget.id;
    if (toggleBtnVal == itemId) {
      that.setData({
        uhide: 0,
        //imageurl1:"../../images/up.png"
      })
    } else {
      that.setData({
        uhide: itemId,
        // imageurl1:"../../images/down.png"
      })
    }
  }
})