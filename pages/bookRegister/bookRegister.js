// pages/bookRegister/bookRegister.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
   bookList:null,
    popup: true,
    name:null,
    iphone:null,
    starttime:null,
    endtime:null,
    ifName:false,
    caozuo:false,
    renewTime:null,
    userName:null,//用户输入的用户名
    userIphone:null,//输入的电话
    bookId:null,//书籍ID
    bookName:null,//书名
    borrowerName:null,
    modalHidden: true,
    imageUrl: '../../images/test.jpg',
    describle:null//书本详细描述
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //加载中
    wx.showLoading({ title: '加载中', icon: 'loading', duration: 20000 });
    var that=this;
    wx.request({
      url: app.globalData.serverUrl+'/BookRegist/getAllBook',
      data: {
      },
      method: 'GET',
      header: {
        'Content-type': 'application/json'
      },
      success:function(res){
        wx.hideLoading()//加载中隐藏
        console.log(res.data);
        that.setData({
          bookList: res.data.bookdata
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

  },
  seedetail:function(e){
    var that = this;
    var borrowerName = e.currentTarget.dataset.borrowername;
    var borrowerIhpone = e.currentTarget.dataset.borrowerihpone;
    var starTime = e.currentTarget.dataset.starttime;
    var endTime = e.currentTarget.dataset.endtime;
    var renewTime = e.currentTarget.dataset.renew;
    console.log(borrowerName + borrowerIhpone + starTime + endTime + "续借次数" + renewTime);
    if(starTime!=''){
      this.showPopup(borrowerName, borrowerIhpone, starTime, endTime, renewTime);
    }
  },
  /* 隐藏弹窗 */
  hidePopup(flag=true) {
    this.setData({
      "popup": flag
    });
  },
  /* 显示弹窗 */
  showPopup(borrowerName, borrowerIhpone, starTime, endTime, renewTime) {
    var renew = renewTime
    if (renew==""){
      renew=0
    }
    this.setData({
      "popup": false,
      "name": borrowerName,
      "iphone": borrowerIhpone,
      "starttime": starTime,
      "endtime": endTime,
      "renew": renew
    });
  },
  //点击借书按钮
  jieshu:function(e){
    var that=this
    var bookId = e.currentTarget.dataset.bookid;//书籍ID
    var bookName = e.currentTarget.dataset.bookname;//书籍ID
    console.log(bookId.slice(1))//把#去掉
    // this.hidePopup(true)
    // that.setData({
    //   ifName:true,
    //   bookId: bookId.slice(1)
    // })
 wx.scanCode({
   success: (res) => {
     wx.navigateTo({
       url: '../bookRegister/borroweBook/borroweBook?bookId=' + bookId + "&scanRes=" + res.result + "&bookName=" + bookName

     })
     var result = res.result;

  
   }
 })

  },
huanshu:function(e){
  var that = this
  var bookId = e.currentTarget.dataset.bookno;//书籍ID
  var bookName = e.currentTarget.dataset.bookname;//书籍ID
  var borrowerName = e.currentTarget.dataset.borrowername;//借书人
  console.log("书名" + borrowerName)//把#去掉
  var bookno = bookId.slice(1)
  this.hidePopup(true)
  that.setData({
    caozuo: true,
    bookId: bookno,
    bookName: bookName,
    borrowerName: borrowerName
  })
},
//取消
  cancel:function(){
    var that = this
    that.setData({
      ifName: false,
      userName:null,
      userIphone: null
    })
  },
  huanshucancel:function(){
    var that = this
    that.setData({
      caozuo: false,
      userName: null,
      userIphone: null
    })
  },
  //确认，获取用户名和电话
  confirm:function(e){
    var that = this
    console.log("用户名：" + this.data.userName + " 电话：" + this.data.userIphone+"书籍ID"+this.data.bookId)
    //向后台传送
    wx.request({
      url: app.globalData.serverUrl+'/BookRegist/getOneBook?borrowerName=' + this.data.userName + "&borrowerIphone=" + this.data.userIphone + "&bookID=%23" + this.data.bookId,
      data: {
      },
      method: 'GET',
      header: {
        'Content-type': 'application/json'
      },
      success: function (res) {
        console.log(res.data)
       if(res.data.data==1){
          //借书成功
         wx.showToast({
           title: '借用成功',
           icon: 'success',
           duration: 2000
         })

         wx.reLaunch({
           url: '../bookRegister/bookRegister'
         })
       }else{
         wx.showToast({
           title: '失败，姓名不对',
           icon: 'success',
           duration: 2000
         })
       }
       
      }
    })
  },
//还书，向后台传输
  huanshu1:function(e){
    wx.scanCode({
      success: (res) => {
        wx.navigateTo({
          url: '../bookRegister/returnBook/returnBook?bookId=' + this.data.bookId + "&scanRes=" + res.result + "&bookName=" + this.data.bookName + "&borrowerName=" + this.data.borrowerName
        })
        var result = res.result;
      }
    })
    // var that = this
    // console.log("用户名：" + this.data.userName + "BOOKID" + this.data.bookId)
    // //
    // wx.request({
    //   url: 'http://dx30403455.zicp.vip/carmanage/BookRegist/returnbook?borrowerName=' + this.data.userName + "&bookID=%23" + this.data.bookId,
    //   method: 'GET',
    //   header: {
    //     'Content-type': 'application/json'
    //   },
    //   success: function (res) {
    //     console.log(res.data)
    //     if (res.data.data==1){
    //         //还书成功
    //       wx.showToast({
    //         title: '还书成功',
    //         icon: 'success',
    //         duration: 2000
    //       })

    //       wx.reLaunch({
    //         url: '../bookRegister/bookRegister'
    //       })
    //     }else{
    //       //还书失败
    //       wx.showToast({
    //         title: '还书失败',
    //         icon: 'success',
    //         duration: 2000
    //       })
    //     }
    //   }
    // })
  },

  //续借，向后台传数据
  xujie:function(){
    var that = this
    console.log("用户名：" + this.data.userName + "BOOKID" + this.data.bookId)
    wx.request({
      url: app.globalData.serverUrl+'/BookRegist/renewBook?borrowerName=' + this.data.userName + "&bookID=%23" + this.data.bookId,
      method: 'GET',
      header: {
        'Content-type': 'application/json'
      },
      success:function(e){
        console.log(e.data)
        if(e.data.data==0){
          //续借失败，人名不对
          wx.showToast({
            title: '续借失败',
            icon: 'success',
            duration: 2000
          })
        } else if (e.data.data == 1){
          wx.showToast({
            title: '续借成功',
            icon: 'success',
            duration: 2000
          })
          wx.reLaunch({
            url: '../bookRegister/bookRegister'
          })
        } else if (e.data.data == 3){
          wx.showToast({
            title: '续借次数超了',
            icon: 'success',
            duration: 2000
          })
        }
      }
    })
  },

  //获取用户输入的用户名
  setName: function (e) {
    this.setData({
      userName: e.detail.value,

    })
  },
  //获取用户输入的电话
  setIhpone: function (e) {
    
    this.setData({
      userIphone: e.detail.value
    })
  },

  //查看书本详情
  bookdetail:function(e){
    var describle = e.currentTarget.dataset.describle;
    var imagesUrl = e.currentTarget.dataset.imagesurl;
    this.setData({
      modalHidden: false,
      describle: describle,
      imageUrl: imagesUrl
    })
  },
  modalCandel: function () {
    // do something
    this.setData({
      modalHidden: true,
    })
  },

  modalConfirm: function () {
    // do something
    this.setData({
      modalHidden: true,
    })
  },
})