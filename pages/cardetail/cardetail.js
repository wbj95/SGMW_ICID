// pages/cardetail/cardetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
  carInfo:{},//车辆信息
  carData:{},//车辆数据
  vin:[],
  projectName:[],//项目名
  remainMileage:[],
  borrower:null,
  id:null,
  configuration:null, //配置
    state:null, //状态
    dataMileage:null //周期里程
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   var that=this;
   //获取车辆信息
      //返回成功值
      this.setData({
      vin:options.vin,
      projectName:options.projectName,
      borrower:options.borrower, 
      id:options.id,
      configuration:options.configuration,
      state:options.state
      })
   // console.log("车辆ID"+this.data.id);

   //获取车辆数据
  wx.request({
    url: 'http://192.168.43.128:8080/carmanage/CarInfo/getCarInfoByVin?vin='+options.vin,
    method:'GET',
    data:{},
    header: { 'Accept': 'application/json' },
    success: function (res) {
      console.log("查询结果",res.data);
      
      that.setData({ batSoc: res.data.batteryDate.data.batSoc,
        dataMileage: res.data.mileageData.data.Trip
        
       });
    
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
//编辑车辆
  editcar:function(e){
    console.log(this.data.id);
  wx.navigateTo({
    url: '../editcar/editcar?projectName=' + this.data.projectName + "&vin=" + this.data.vin + "&borrower=" + this.data.borrower + "&id=" + this.data.id + "&configuration=" + this.data.configuration + "&state=" + this.data.state,
  })
  },
  //确认和取消
  deletecar:function(e){
   wx.showModal({
     title: '',
     content: '确认删除吗？',
     success(res) {
       if (res.confirm) {
         console.log('用户点击确定' + e.target.dataset.carid)
        //  向后端发送请求删除车辆信息
        wx.request({
          url: 'http://localhost:8080/carmanage/CarInfo/DeleteCar?id='+e.target.dataset.carid,
          method:'GET',
          data:{},
          header: { 'Accept': 'application/json' },
          success:function(res){
          console.log("返回结果"+res.data);
          //成功删除，跳转到主页
          if(res.data==1){
           wx.showToast({
             title: '删除成功',
              icon: 'success',
             duration: 2000
           })
          }else{
            wx.showToast({
              title: '删除失败',
              icon: 'success',
              duration: 2000
            })
          }
          wx.navigateTo({
            url: '../index/index',
          })
          }
        })
       } else if (res.cancel) {
         console.log('用户点击取消')
       }
     }
   })
  }
})