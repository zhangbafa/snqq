var util = require('../../utils/util.js')
import storages from '../../utils/storages.js'
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    jifen: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    util.checkLogin()
    var that = this;
    // 获取我的发布
    var sessionid = storages.get('access_token')
    let postdata = {}
    postdata.sessionid = sessionid
    util.httpGet(app.globalData.BaseUrl,'jifen', postdata, function (data) {
      that.setData({
        jifen: data
      })
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

  }
})