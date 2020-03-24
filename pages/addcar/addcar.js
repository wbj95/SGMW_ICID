// pages/addcar/addcar.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
  projectName:null,//项目名
    carvin:null,//vin号
  borrower:null,//借用人
    configuration: null,
    state: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   var that=this;
   
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

  //提交表单
  formSubmit:function(e){
    console.log('form发生了submit事件，携带数据为：', e.detail.value);
    let { projectName, carvin, borrower, configuration, state } = e.detail.value;
    console.log(projectName + carvin + borrower, configuration, state);
    wx.request({
      url: 'http://localhost:8080/carmanage/CarInfo/AddCar?projectName=' + projectName + "&vin=" + carvin + "&borrower=" + borrower + "&configuration=" + configuration +"&state="+state,
      method: 'GET',
      data: {},
      header: { 'Accept': 'application/json' },
       success:function(res){
         console.log("返回结果" + res.data);
         if(res.data==true){
           wx.showToast({
             title: '添加成功',
             icon: 'success',
             duration: 2000
           })
         }else{
           wx.showToast({
             title: '添加失败',
             icon: 'success',
             duration: 2000
           })
         }
         wx.navigateTo({
           url: '../index/index',
         })
       }
    
    })
  }
})