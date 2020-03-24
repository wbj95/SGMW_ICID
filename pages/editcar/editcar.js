// pages/editcar/editcar.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
  prjectName:null,
  carvin:null,
  borrower:null,
  id:null,
  configuration:null,
    state:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    this.setData({
      vin: options.vin,
      projectName: options.projectName,
      borrower: options.borrower,
      id:options.id,
       configuration: options.configuration,
      state: options.state
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

  },

  formSubmit: function (e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value+"id:"+this.data.id);
    let { projectName, carvin, borrower, configuration, state} = e.detail.value;
    console.log(projectName + carvin + borrower + configuration+state);
    wx.request({
      url: 'http://localhost:8080/carmanage/CarInfo/updateCar?projectName=' + projectName + "&vin=" + carvin + "&borrower=" + borrower + "&id=" + this.data.id + "&configuration=" + configuration + "&state=" + state,
      method: 'GET',
      data: {},
      header: { 'Accept': 'application/json' },
      success: function (res) {
        console.log("返回结果" + res.data);
        if (res.data == 1) {
          wx.showToast({
            title: '修改成功',
            icon: 'success',
            duration: 2000
          })
        } else {
          wx.showToast({
            title: '添加失败',
            icon: 'success',
            duration: 2000
          })
        }
        wx.navigateTo({
          url: '../index/index',
        })
      }

    })
  }
})