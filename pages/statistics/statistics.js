// pages/statistics/statistics.js
const CHARTS = require('../../utils/wxcharts.js'); // 引入wx-charts.js文件

Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataInfo: [{
        id: 1,
        subNum: "C1609050001",
        percentage: 36,
        grade: "SPCC",
        spec: "2.5*1200*C",
        weight: 500
      },
      {
        id: 2,
        subNum: "A1609050001",
        percentage: 0,
        grade: "SPCC",
        spec: "3.5*1200*C",
        weight: 100
      }
    ],
    listMilege: null,
    listStart: [],
    listData: [],
    imageurl1: "../../images/select_DESC.png",
    imageurl2: "../../images/DESC.png",
    startPre: "本周点火车辆数占比",
  },
  ringShow: function() {
    console.log("qwqw");

    var item = this.data.dataInfo[0];
    let ring = {
      canvasId: "ringGraph", // 与canvas-id一致
      type: "ring",
      series: [{
          name: "点火车辆数",
          data: item.percentage,
          color: '#ff6600'
        },
        {
          name: "未点火车辆数",
          data: 100 - item.percentage,
          color: '#eeeeee'
        }
      ],
      width: 100,
      height: 100,
      dataLabel: false,
      legend: false,
      title: { // 显示百分比
        name: item.percentage + '%',
        color: '#333333',
        fontSize: 14
      },
      extra: {
        pie: {
          offsetAngle: -90
        },
        ringWidth: 6,
      }
    };
    new CHARTS(ring);

  },
  //本周启动次数降序排序
  choosesort1: function(e) {
    var that = this;
    that.setData({
      listData: this.data.listStart,
      imageurl1: "../../images/select_DESC.png",
      imageurl2: "../../images/DESC.png"
    });
  },
  //按照本周里程排序
  choosesort2: function(e) {
    var that = this;
    console.log("mileage");
    that.setData({
      listData: this.data.listMilege,
      imageurl1: "../../images/DESC.png",
      imageurl2: "../../images/select_DESC.png"
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    //初始化image的src
    var that = this;
    wx.showLoading({
      title: '加载中',
      icon: 'loading',
      duration: 10000
    });

    //成功获取
    wx.request({

      //URL
      url: 'https://www.sgmwzhilian.club/carmanage/CarInfo/getCarRanking',
      method: 'GET',
      data: {},
      header: {
        'Accept': 'application/json'
      },

      success: function(res) {

        wx.hideLoading();
        var lenght = 0;
        var startNum = 0;
        //获取车辆数
        for (var i in res.data.CarMilege) {
          lenght++;
          if (res.data.CarMilege[i].dataStart != 0) { //获取点火车辆数
            startNum++;
          }
        }


        console.log("总共多少辆车：" + lenght);
        console.log("点火车辆数：" + startNum)
        var per = startNum / lenght;
        console.log("占比：" + per)
        var percentage = Math.round(per * 100)
        console.log("占比：" + percentage)
        that.setData({
          listData: res.data.CarStart,
          listMilege: res.data.CarMilege,
          listStart: res.data.CarStart,
          'dataInfo[0].percentage': percentage,
          'dataInfo[1].percentage': 1 - per
        });
        that.ringShow();
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