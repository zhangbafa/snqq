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
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    bind:false,
    phonenum:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    if(storages.get('binding')){
        this.setData({
        bind:true
      })
    }
    if(storages.get('phonenum')){
        this.setData({
        phonenum:storages.get('phonenum')
      })
    }

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
          console.log(res)
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
    // 这里绑定基本信息和sessionid

    if (e.detail.userInfo==null){//用户拒绝授权
      this.setData({
        authstats:true
      })
      wx.openSetting({
        success(e){
          // console.log(res.authSetting)
        }
      })
      return false
    }
    //提交绑定信息
    const params={}
    params.encryptedData=e.detail.encryptedData,
    params.iv=e.detail.iv
    params.sessionid = storages.get('sess')
     wx.request({
      url: app.globalData+'applogin',
      data: params,
      header: {},
      method: 'post',
      dataType: 'json',
      responseType: 'text',
      success: function (res) {
      
        wx.showToast({
          title: '绑定成功',
        })

        setTimeout(function(){
          wx.redirectTo({
          url: '/pages/my/my',
        })
        },1000)

        
      },
      fail: function (res) {
        
      },
      complete: function (res) {
        
      },
    })
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })

    wx.navigateTo({//判断是否绑定了手机，如果有不做跳转，否则，跳转到绑定手机页面
      url: 'validatephone',
    })
  },
  
  openSetting: function (e) {
    wx.openSetting({
      success(res) {
        // console.log(res.authSetting)
        // res.authSetting = {
        //   "scope.userInfo": true,
        //   "scope.userLocation": true
        // }
      }
    })
    },
    logout(e){
      // 清空 unserinfo
      // 删除 token
      // 服务端 处理
      app.globalData.userInfo=null
      this.setData({
        userInfo: null,
        hasUserInfo: false,
        bind:false
      })
      storages.remove('binding')
      storages.remove('access_token')
      console.log('Logout')
    },
    bindphone(e){
      util.checkLogin()
      wx.navigateTo({
        url:'/pages/my/validatephone'
      })
    },
    tolist(e){
      util.checkLogin()
      var tabid = e.currentTarget.dataset.tabid
      wx.navigateTo({
        url:'/pages/my/list?tabid='+tabid
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