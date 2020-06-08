// pages/cardetail/cardetail.js
var amapFile = require('../../libs/amap-wx.js');
var config = require('../../libs/config.js');
var QQMapWX = require('../../libs/qqmap-wx-jssdk.js');
var util = require('../../utils/util.js');
const CHARTS = require('../../utils/wxcharts.js'); // 引入
Page({

  /**
   * 页面的初始数据
   */
  data: {
    carInfo: {}, //车辆信息
    carData: {}, //车辆数据
    vin: [],
    projectName: [], //项目名
    remainMileage: [],
    borrower: null,
    id: null,
    configuration: null, //配置
    state: null, //状态
    dataMileage: null, //周期里程
    startOnNum: null,
    address: null,
    city: null,
    iphoneNum: null,
    longitude: null,
    latitude: null,
    markers: [],
    latitude: '',
    longitude: '',
    textData: {},
    dataoneWeek:[]//每天点火启动次数数组
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    wx.showLoading({
      title: '加载中',
      icon: 'loading',
      duration: 10000
    });

    var key = config.Config.key;
    var myAmapFun = new amapFile.AMapWX({
      key: key
    });
    //判断用户是否授权小程序获取定位权限
    wx.getSetting({
      success(res) {
        //从来没有授权过定位
        console.log(res.authSetting['scope.userLocation']);

        if (res.authSetting['scope.userLocation'] != undefined && res.authSetting['scope.userLocation'] != true) {
          wx.showModal({
            title: '是否授权当前位置',
            content: '需要获取您的地理位置，请确认授权，否则地图功能将无法使用',
            success: function(tip) {
              if (tip.confirm) {
                wx.openSetting({
                  success: function(data) {
                    if (data.authSetting["scope.userLocation"] === true) {
                      wx.showToast({
                        title: '授权成功',
                        icon: 'success',
                        duration: 1000
                      })
                    } else {
                      wx.showToast({
                        title: '授权失败',
                        icon: 'success',
                        duration: 1000
                      })
                    }
                  }
                })
              }
            }
          })

        }
      }
    })
    //判断用户定位权限是否开启


    //获取单台vin车辆数据
    wx.request({
      url: 'https://www.sgmwzhilian.club/carmanage/CarInfo/getCarInfoByVin?vin=' + options.vin,
      method: 'GET',
      data: {},
      header: {
        'Accept': 'application/json'
      },
      success: function(res) {
        wx.hideLoading()
        console.log("查询结果", res.data);
        var startNum = 0;
        //赋值剩余电量
        if (res.data.batteryDate.code == 0) {
          that.setData({
            batSoc: res.data.batteryDate.data.batSoc
          });

        } else {
          that.setData({
            batSoc: "N/A"
          });

        }
        //对本周里程进行赋值
        if (res.data.mileageData.code == 0) {
          //赋值
          that.setData({
            dataMileage: res.data.mileageData.data.Trip
          });
          
        } else {
          //赋值
          that.setData({
            dataMileage: "0"
          });
        }
        //对本周里程进行赋值
        if (res.data.suningData.code == 0) {
          var weekArray = new Array("日", "一", "二", "三", "四", "五", "六");
          var startTime = [0,0,0,0,0,0,0];
          //对启动次数进行累加
          for (var i = 0; i < res.data.suningData.data.rspArray.length; i++) {
            startNum = res.data.suningData.data.rspArray[i].numberOfStarts + startNum;
            var date = res.data.suningData.data.rspArray[i].date;
            //获得日期是周几
             var week = weekArray[new Date(date).getDay()]; 
      if(week=='一'){
        startTime.splice(0, 1, res.data.suningData.data.rspArray[i].numberOfStarts);
      } else if (week=='二'){
        startTime.splice(1, 1, res.data.suningData.data.rspArray[i].numberOfStarts);
      } else if (week == '三'){
        startTime.splice(2, 1, res.data.suningData.data.rspArray[i].numberOfStarts);
      } else if (week == '四'){
        startTime.splice(3, 1, res.data.suningData.data.rspArray[i].numberOfStarts);
      } else if (week == '五') {
        startTime.splice(4, 1, res.data.suningData.data.rspArray[i].numberOfStarts);
      } else if (week == '六') {
        startTime.splice(5, 1, res.data.suningData.data.rspArray[i].numberOfStarts);
      } else if (week == '日') {
        startTime.splice(6, 1, res.data.suningData.data.rspArray[i].numberOfStarts);
      }
          }
          console.log(startTime);
          // wx.setStorage({ //存储到本地
          //   key: "startTime",
          //   data: startTime
          // })
          that.setData({
            startOnNum: startNum
          });
          that.setData({
            dataoneWeek: startTime
          });
         
         
        } else {
          //赋值
          that.setData({
            startOnNum: "0"
          });
          var sTime=[0,0,0,0,0,0,0]
          that.setData({
            dataoneWeek: sTime
          });
        }
        that.lineShow();
        //对车辆基本信息进行赋值
        //赋值
        that.setData({
          vin: res.data.oneCar.vin,
          projectName: res.data.oneCar.projectName,
          borrower: res.data.oneCar.borrower,
          id: res.data.oneCar.id,
          configuration: res.data.oneCar.configuration,
          state: res.data.oneCar.state,
          address: res.data.oneCar.address,
          city: res.data.oneCar.city,
          iphoneNum: res.data.oneCar.iphoneNum
        });
        wx.setStorage({ //存储到本地
          key: "latitude",
          data: res.data.oneCar.latitude
        })
        wx.setStorage({ //存储到本地
          key: "vin",
          data: res.data.oneCar.vin
        })
        wx.setStorage({ //存储到本地
          key: "longitude",
          data: res.data.oneCar.longitude
        })
        //地图定位
        myAmapFun.getRegeo({
          longitude: res.data.oneCar.longitude,
          latitude: res.data.oneCar.latitude,
          iconPath: "../../images/marker.png",
          iconWidth: 22,
          iconHeight: 32,
          success: function(data) {
            //成功回调
            console.log("高德地图" + data);
            var marker = [{
              id: data[0].id,
              latitude: res.data.oneCar.latitude,
              longitude: res.data.oneCar.longitude,
              iconPath: data[0].iconPath,
              width: data[0].width,
              height: data[0].height
            }]
            that.setData({
              markers: marker
            });
            that.setData({
              latitude: res.data.oneCar.latitude
            });
            that.setData({
              longitude: res.data.oneCar.longitude
            });
            that.setData({
              textData: {
                name: res.data.oneCar.city,
                desc: res.data.oneCar.address
              }
            })
          },
          fail: function(info) {
            //失败回调
            console.log(info)
          }
        })
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

  },
  // GetDateStr: function(AddDayCount) {
  //   var dd = new Date();
  //   dd.setDate(dd.getDate() + AddDayCount); //获取AddDayCount天后的日期
  //   var y = dd.getFullYear();
  //   var m = dd.getMonth() + 1; //获取当前月份的日期
  //   var d = dd.getDate();
  //   return y + "-" + m + "-" + d;
  // },

  //跳转到导航
  navi: function() {
    wx.navigateTo({
      url: '../navigation_walk/navigation_walk?longitude=' + wx.getStorageSync('longitude') + "&latitude=" + wx.getStorageSync('latitude'),
    })
  },

  //一周行程
  oneWeek: function() {
    wx.navigateTo({
      url: '../oneWeekTrip/oneWeekTrip?vin=' + wx.getStorageSync('vin')
    })
  },


  //编辑车辆
  // editcar: function(e) {
  //   console.log(this.data.id);
  //   wx.navigateTo({
  //     url: '../editcar/editcar?projectName=' + this.data.projectName + "&vin=" + this.data.vin + "&borrower=" + this.data.borrower + "&id=" + this.data.id + "&configuration=" + this.data.configuration + "&state=" + this.data.state,
  //   })
  // },
  // //确认和取消
  // deletecar: function(e) {
  //   wx.showModal({
  //     title: '',
  //     content: '确认删除吗？',
  //     success(res) {
  //       if (res.confirm) {
  //         console.log('用户点击确定' + e.target.dataset.carid)
  //         //  向后端发送请求删除车辆信息
  //         wx.request({
  //           url: 'http://120.26.174.202:8080/carmanage/CarInfo/DeleteCar?id=' + e.target.dataset.carid,
  //           method: 'GET',
  //           data: {},
  //           header: {
  //             'Accept': 'application/json'
  //           },
  //           success: function(res) {
  //             console.log("返回结果" + res.data);
  //             //成功删除，跳转到主页
  //             if (res.data == 1) {
  //               wx.showToast({
  //                 title: '删除成功',
  //                 icon: 'success',
  //                 duration: 2000
  //               })
  //             } else {
  //               wx.showToast({
  //                 title: '删除失败',
  //                 icon: 'success',
  //                 duration: 2000
  //               })
  //             }
  //             wx.navigateTo({
  //               url: '../index/index',
  //             })
  //           }
  //         })
  //       } else if (res.cancel) {
  //         console.log('用户点击取消')
  //       }
  //     }
  //   })
  // },
  lineShow: function(type) {
    var that=this
    console.log("1111" + that.data.dataoneWeek);
    var windowWidth = '', windowHeight = '';    //定义宽高
    try {
      var res = wx.getSystemInfoSync();    //试图获取屏幕宽高数据
      windowWidth = res.windowWidth / 750 * 690;   //以设计图750为主进行比例算换
      windowHeight = res.windowWidth / 750 * 550    //以设计图750为主进行比例算换
    } catch (e) {
      console.error('getSystemInfoSync failed!');   //如果获取失败
    }
    let line = {
      canvasId: 'lineGraph', // canvas-id
      type: 'line', // 图表类型，可选值为pie, line, column, area, ring
      categories: ['周一', '周二', '周三', '周四', '周五', '周六', '周天'],
      dataPointShape: "circle",
      series: [{ // 数据列表
        name: ' 启动次数',
        data: that.data.dataoneWeek

      }],
      xAxis: { //是否隐藏x轴分割线
        disableGrid: false,
      },
      yAxis: {
        min: 0, // Y轴起始值
        title: '次数', //标题
        format: function(val) { //返回数值
          return val.toFixed(2);
        },
      },
      width: windowWidth,
      height: windowHeight,
      // dataLabel: true, // 是否在图表中显示数据内容值
      // legend: true, // 是否显示图表下方各类别的标识
      extra: {
        lineStyle: 'curve' // (仅对line, area图表有效) 可选值：curve曲线，straight直线 (默认)
      },
      // dataLabel: true
    }
    new CHARTS(line);
  }
})