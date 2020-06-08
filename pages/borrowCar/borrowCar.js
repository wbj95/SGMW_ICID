// pages/borrowCar/borrowCar.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    Name:null, 
    phoneNum:null,
     vin:null,
    version: 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //查询版本
var that =this

    console.log("123344")
    this.setData({
      vin: options.vin
    })
    // wx.request({
    //   url: 'http://localhost:8080/carmanage/CarInfo/findversion',
    //   method: 'GET',
    //   data: {},
    //   header: { 'Accept': 'application/json' },
    //   success:function(res){
    //   console.log(res.data)
    //     that.setData({
    //       version: res.data
    //     })
    //   }
    // })
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

  },
  queren:function(){
    wx.reLaunch({
      url: '../index/index'
    })
  },

  //提交表单
  formSubmit: function (e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value);
    let { Name, phoneNum, vin} = e.detail.value;
    console.log(Name + phoneNum + vin);
    wx.request({
      url: 'https://www.sgmwzhilian.club/carmanage/CarInfo/exchangeNameAndIphone?vin=' + vin + "&Name=" + Name + "&phoneNum=" + phoneNum, 
      method: 'GET',
      data: {},
      header: { 'Accept': 'application/json' },
      success: function (res) {
        console.log("返回结果" + res.data);
        if (res.data == true) {
          wx.showToast({
            title: '借用成功',
            icon: 'success',
            duration: 2000
          })
        } else {
          wx.showToast({
            title: '借用失败',
            icon: 'success',
            duration: 2000
          })
        }
        wx.reLaunch({
          url: '../index/index'
        })
      }

    })
  }
})