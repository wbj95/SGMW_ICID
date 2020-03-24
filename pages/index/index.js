//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    projectName:{},//项目名称
    carVIN:{},//车辆VIN号
    carInfo:{}//车辆信息，包括项目，VIN号
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    var that = this;
    //传输项目名和VIN号
  
        //成功获取
        wx.request({
           //URL
          url: 'http://127.0.0.1:8080/carmanage/CarInfo/getAllCarInfo',
          method:'GET',
          data:{},
          header: { 'Accept': 'application/json'},
          
          success:function(res){
            //获取数据成功并赋值给projectName和carVIN
            console.log(res.data.data);
            console.log(res.data);
            that.setData({ carInfoList: res.data.data});
          }
        
        })
    
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
  //
})
