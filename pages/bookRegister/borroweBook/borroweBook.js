// pages/bookRegister/borroweBook/borroweBook.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
res:null,
isScanRes:null,//是否是借书二维码
bookName:null,
bookId:null,
borrowerName:null,
borroweriphone:null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    var that = this
    var scanRes = options.scanRes
    console.log("123344" + options.scanRes + options.bookId + options.bookName)
    var r="1"
    if (scanRes==r){
       //借书二维码
      that.setData({
        isScanRes: 1,
        bookId:options.bookId.slice(1),
        bookName:options.bookName
      })
   
    }else{
      that.setData({
        res: "非借书二维码",
        isScanRes:0
      })
    }
  },
//提交借书申请
  formSubmit: function (e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value);
    let { borrowerName, borroweriphone} = e.detail.value;
    console.log()
    //向后台传送
    wx.request({
      url: 'https://www.sgmwzhilian.club/carmanage/BookRegist/getOneBook?borrowerName=' + borrowerName + "&borrowerIphone=" + borroweriphone + "&bookID=%23" + this.data.bookId,
      data: {
      },
      method: 'GET',
      header: {
        'Content-type': 'application/json'
      },
      success: function (res) {
        console.log(res.data)
        if (res.data.data == 1) {
          //借书成功
          wx.showToast({
            title: '借用成功',
            icon: 'success',
            duration: 2000
          })

          wx.reLaunch({
            url: '../bookRegister'
          })
        } else {
          wx.showToast({
            title: '失败，姓名不对',
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