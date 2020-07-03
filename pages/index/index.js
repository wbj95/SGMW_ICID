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
    tab: [true, true, true],//隐藏下拉选项框
    btnWidth: 300, //删除按钮的宽度单
    prjectNameList: [],//项目数组
    selectProject:"全部",
    uhide: 0,//确认箭头方向
    carouselList: [{
        "id": "101",
        "img": "https://zhilianjiaohu.oss-cn-beijing.aliyuncs.com/%E8%BD%AE%E6%92%AD%E5%9B%BE/activity1.jpg",
        "title": "年会",
        "url": ""
      },
      {
        "id": "102",
        "img": "https://zhilianjiaohu.oss-cn-beijing.aliyuncs.com/%E8%BD%AE%E6%92%AD%E5%9B%BE/activity2.jpg",
        "title": "E300",
        "url": ""
      },
      {
        "id": "103",
        "img": "https://zhilianjiaohu.oss-cn-beijing.aliyuncs.com/%E8%BD%AE%E6%92%AD%E5%9B%BE/activity3.jpg",
        "title": "柳州",
        "url": ""
      }
      ]//轮播图集合
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
      url: app.globalData.serverUrl+"/CarInfo/fuzzyQuery?vin=" + e.detail.value,
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
          url: app.globalData.serverUrl+'/CarInfo/getAllCarInfo',
          method:'GET',
          data:{},
          header: { 'Accept': 'application/json'},
          //成功获取
          success:function(res){
       
            wx.hideLoading()//加载中隐藏
            console.log(res.data.data);
            console.log(res.data.data.length)
            var templistProjectName=[]
            var conunt=-1
            //遍历数组,取项目名
            for(var i=0;i<res.data.data.length;i++){
              
              //判断数组是否在
              if (that.isInArry(res.data.data[i].projectName, templistProjectName)){//存在了
      
              }else{//不存在
                templistProjectName[conunt++] = res.data.data[i].projectName
              }
            }
            that.setData({
              prjectNameList: templistProjectName,
              carInfoList: res.data.data
            })
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
      url: app.globalData.serverUrl+'/CarInfo/getAllCarInfo',
      data: {
      },
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        wx.hideLoading()
 
        that.setData({ carInfoList: res.data.data });
      }
    })
  },
  //判断字符串是否在数组中
  isInArry:function(string,arry){

    for(var i=0;i<arry.length;i++){
      if(arry[i]==string){
        return true
      }
    }
    return false
  },
  //点击项目
  filterTab:function(){
    var uhide1=0
    var data=[true,true,true]
    var data2 = [false, true, true]
    if(this.data.tab[0]==true){
      if (uhide1==this.data.uhide){
        this.setData({
          uhide: 1
        })
      }else{
        this.setData({
          uhide: 0
        })
      }
    this.setData({
      tab:data2
    })
    }else{
      if (uhide1 == this.data.uhide) {
        this.setData({
          uhide: 1
        })
      } else {
        this.setData({
          uhide: 0
        })
      }
      this.setData({
        tab: data
      })
    }
  },
  //选择车型
  filter:function(e){
    var that=this
    var projectName = e.currentTarget.dataset.txt
    console.log(projectName)
    //根据车型从数组
    var allcarList = wx.getStorageSync('carInfoList2')
    var templistcar = []
    var conunt = 0
    if (projectName=="全部"){
      that.setData({
        carInfoList: allcarList,
        selectProject:"全部"
      })
    }else{
      for (var i = 0; i < allcarList.length; i++) {
        //取出该车型所有数据
        if (projectName == allcarList[i].projectName) {
          templistcar[conunt++] = allcarList[i]
        }
      }
      console.log(templistcar)
      that.setData({
        carInfoList: templistcar,
        selectProject:projectName
      })
    }
  }
})
