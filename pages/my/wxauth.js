const app = getApp()
import storages from '../../utils/storages.js'
var util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    hasUserInfo: false,
    ss:[],
    authstats:false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        // 这里绑定基本信息和sessionid
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function (e) {
    withCredentials:true
    // 这里绑定基本信息和sessionid
    // 点击了授权登录按钮
    if (e.detail.userInfo==null){ // 用户拒绝授权
       this.setData({
        authstats:true,
        hasUserInfo: true
       })
      wx.openSetting({
        success(res){
          // console.log(res.authSetting)
        }
      })
      return false
    }
    //提交绑定信息
    app.globalData.userInfo = e.detail.userInfo
    const params = {}
    var sessionid = storages.get('access_token')    
    params.sessionid = sessionid
    var userinfo = app.globalData.userInfo
    params.name = userinfo.nickName
    params.facepic = userinfo.avatarUrl
    params.sex = userinfo.gender
    params.appid = 1
    wx.request({
      url: app.globalData.BaseUrl+'applogin',
      data: params,
      header: {},
      method: 'post',
      dataType: 'json',
      responseType: 'text',
      success: function (res) {
        
      },
      fail: function (res) {
      },
      complete: function (res) {
      },
    })
    // app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
    //修改绑定状态
    storages.put('binding',1)
    wx.navigateTo({//判断是否绑定了手机，如果有不做跳转，否则，跳转到绑定手机页面
      url: '/pages/my/my',
    })
  },
  
  openSetting: function (e) {
    var _that = this
    wx.openSetting({
      success(res) {
        //授权设置页面，点击了同意授权
       _that.setData({
          hasUserInfo: false,
          authstats: false
       })
        
      }
    })
    },
  loginPhone(e){
    wx.navigateTo({
      url: 'validatephone?l=login',
    })
  },
  tohome(e){
    wx.navigateTo({
      url: '../index/index',
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

  }

 
})