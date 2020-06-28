// pages/fileList/fileList.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    fileList: "",
    uhide: null
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
        uhide: null,
        //imageurl1:"../../images/up.png"
      })
    } else {
      that.setData({
        uhide: itemId,
        // imageurl1:"../../images/down.png"
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    //加载中
    wx.showLoading({
      title: '加载中',
      icon: 'loading',
      duration: 20000
    });
    //
    wx.request({
      url: app.globalData.serverUrl+'/CarInfo/listFile',
      data: {},
      method: 'GET',
      header: {
        'Content-type': 'application/json'
      },
      success: function(e) {
        wx.hideLoading() //加载中隐藏
        console.log(e.data)
        that.setData({
          fileList: e.data.data
        })
      }

    })
  },
  XmLonlinePreview: function(r) {
    var that = this
    //获取文件名
    console.log(r.currentTarget.dataset.dir + r.currentTarget.dataset.id)
    //将文件名传到后台获取连接，然后在线预览
    wx.request({
      url: app.globalData.serverUrl+'/CarInfo/findFilesURL?fileName=' + r.currentTarget.dataset.dir + r.currentTarget.dataset.id,
      method: 'GET',
      data: {},
      header: {
        'Accept': 'application/json'
      },
      success: function(res) {
        console.log(res.data.url);
        //获取url
        var url = res.data.url
        //在线预览
        that.onlinePreview(url);
      }
    })

  },
  //在线预览文档
  onlinePreview: function(url) {
    console.log("在线预览" + url)
    //加载中
    wx.showLoading({
      title: '正在获取文件',
      icon: 'loading',
      duration: 20000
    });
    //在线预览文档
    wx.downloadFile({
      url: url, //可以是后台传过来的路径
      success: function(res) {
        const filePath = res.tempFilePath
        wx.openDocument({
          filePath: filePath,
          success: function(res) {
            //成功
            console.log("打开文档成功")
            wx.hideLoading() //加载中隐藏
          }
        })
      },
      fail: function(e) {
        console.log("在线预览失败" + e)
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

  }
})