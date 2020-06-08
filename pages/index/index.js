//index.js
//获取应用实例
const app = getApp()
const plugin = requirePlugin("WechatSI")

// 获取**全局唯一**的语音识别管理器**recordRecoManager**
const manager = plugin.getRecordRecognitionManager()
Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    projectName:{},//项目名称
    carVIN:{},//车辆VIN号
    carInfo:{},//车辆信息，包括项目，VIN号
    carInfoList:null,
    carInfoList2:null,//缓存
    // 搜索框状态
    inputShowed: false,
    //显示结果view的状态
    viewShowed: false,
    // 搜索框值
    inputVal: "",
    //搜索渲染推荐数据
    catList: [],

    btnWidth: 300, //删除按钮的宽度单
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  // 隐藏搜索框样式
  hideInput: function () {
    var that = this;
    that.setData({
      inputVal: "",
    //  inputShowed: false,
      carInfoList: wx.getStorageSync('carInfoList2')
    });
  },
  // 清除搜索框值
  clearInput: function () {
    this.setData({
      inputVal: "",
      carInfoList: wx.getStorageSync('carInfoList2')
    });
  },
  // 键盘抬起事件2
  inputTyping: function (e) {
    console.log(e.detail.value)
    var that = this;
    if (e.detail.value == '') {
      return;
    }
    that.setData({
      viewShowed: false,
      inputVal: e.detail.value
    });
   //模糊查询
    wx.request({
      url: "https://www.sgmwzhilian.club/carmanage/CarInfo/fuzzyQuery?vin=" + e.detail.value,
      data: {
      },
      method: 'GET',
      header: {
        'Content-type': 'application/json'
      },
      success: function (res) {
        console.log(res.data)
        that.setData({
          carInfoList: res.data.fuzzyQuery//模糊查询结果
        })
      }
    });
  },
  onLoad: function () {
    var that = this;
   //加载中
    wx.showLoading({ title: '加载中', icon: 'loading', duration: 20000 });
        //成功获取
        wx.request({
           //URL
          url: 'https://www.sgmwzhilian.club/carmanage/CarInfo/getAllCarInfo',
          method:'GET',
          data:{},
          header: { 'Accept': 'application/json'},
          //成功获取
          success:function(res){
       
            wx.hideLoading()//加载中隐藏
            console.log(res.data.data);
            console.log(res.data);
            that.setData({ carInfoList: res.data.data
            });
            wx.setStorage({//存储到本地
              key: "carInfoList2",
              data: res.data.data
            })
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
  },
  //下拉刷新
  onPullDownRefresh() {
    wx.showNavigationBarLoading()  //在标题栏中显示加载
    this.updateBlogs()  //重新加载数据
    　　　　//模拟加载  1秒
    　　　　setTimeout(function () {
      　　　　// complete
      　　　　wx.hideNavigationBarLoading() //完成停止加载
      　　　　wx.stopPullDownRefresh() //停止下拉刷新
    　　　　}, 1000);
  },
  //重新加载数据
  updateBlogs: function () {
    var that = this
    wx.request({
      url: 'https://www.sgmwzhilian.club/carmanage/CarInfo/getAllCarInfo',
      data: {
      },
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        wx.hideLoading()
        console.log(res.data.data);
        console.log(res.data);
        that.setData({ carInfoList: res.data.data });
      }
    })
  }
  //
})
