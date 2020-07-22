// pages/bookRegister/returnBook/returnBook.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    res: null,
    isScanRes: null,//是否是借书二维码
    bookName: null,
    bookId: null,
    borrowerName:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    var scanRes = options.scanRes
    console.log("123344" + options.scanRes + options.bookId + options.bookName+options.borrowerName)
    if (options.scanRes=="1"){
//正确二维码
      that.setData({
        isScanRes: 1,
        bookId: options.bookId,
        bookName: options.bookName,
        borrowerName: options.borrowerName
      })

    }else{
      that.setData({
        res: "非借书二维码",
        isScanRes: 0
      })
    }
  

  },

  //提交借书申请
  formSubmit: function (e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value);
    let { borrowerName } = e.detail.value;
     var that = this
    //
    wx.request({
      url: app.globalData.serverUrl +'/BookRegist/returnbook?borrowerName=' + borrowerName + "&bookID=%23" + this.data.bookId,
      method: 'GET',
      header: {
        'Content-type': 'application/json'
      },
      success: function (res) {
        console.log(res.data)
        if (res.data.data==1){
            //还书成功
          wx.showToast({
            title: '还书成功',
            icon: 'success',
            duration: 2000
          })

          wx.reLaunch({
            url: '../bookRegister'
          })
        }else{
          //还书失败
          wx.showToast({
            title: '还书失败',
            icon: 'success',
            duration: 2000
          })
        }
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