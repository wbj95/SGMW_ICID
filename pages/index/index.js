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
    carInfoList:null,//新能源
    carInfoList3:null,//传统车
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
    prjectNameList2:[],//传统车项目名
    selectProject:"全部",
    uhide: 0,//确认箭头方向
    flag:1,//标识为1，显示新能源，标识为0显示
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
           //URL，新能源
          url: app.globalData.serverUrl +'/CarInfo/getAllElectricCarInfo',
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
            wx.setStorage({//存储到本地,x新能源项目名
              key: "prjectNameList",
              data: templistProjectName
            })
          }
        })
    //获取传统车
    wx.request({
      //URL，传统车
      url: app.globalData.serverUrl + '/CarInfo/getAllFuelCarInfo',
      method: 'GET',
      data: {},
      header: { 'Accept': 'application/json' },
      //成功获取
      success: function (res) {
        wx.hideLoading()//加载中隐藏
        var templistProjectName = []
        var conunt = -1
        //遍历数组,取项目名
        for (var i = 0; i < res.data.data.length; i++) {
          //判断数组是否在
          if (that.isInArry(res.data.data[i].projectName, templistProjectName)) {//存在了
          } else {//不存在
            templistProjectName[conunt++] = res.data.data[i].projectName
          }
        }
        wx.setStorage({//存储到本地
          key: "prjectNameList2",
          data: templistProjectName
        })
        wx.setStorage({//存储到本地
          key: "carInfoList3",
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
    console.log(this.data.flag)
    //根据车型从数组
    //判断现在是传统车还是新能源列表
    var allcarList
    if(this.data.flag==1)//新能源
    {
      allcarList = wx.getStorageSync('carInfoList2')
    }else{
      //传统车
      allcarList = wx.getStorageSync('carInfoList3')
    }
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
  },
  //新能源
  xinnnegyuan:function(){
  this.setData({
    carInfoList: wx.getStorageSync('carInfoList2'),
    flag: 1,
    prjectNameList: wx.getStorageSync('prjectNameList')
  })
  },
  //传统车
  chuantongche:function(){
    this.setData({
      carInfoList: wx.getStorageSync('carInfoList3'),
      prjectNameList: wx.getStorageSync('prjectNameList2'),
      flag:0
    })
  }
})
