//app.js
var util = require('./utils/util.js')
App({
  globalData: {
    userInfo: null,
    BaseUrl:'https://www.snqqw.com/index/api/',
    imgpath: 'https://www.snqqw.com',
    AppName: '睢宁圈圈'
  },
  onLoad:function(){
    console.log('sss')
  },
  onLaunch:function () {

    //检查是否为最新版本，如果不是则更新到最新到版本
    util.checkUpdateVersion_auto()
    //设备信息
    // wx.getSystemInfo({
    //   success: e => {
    //     this.globalData.StatusBar = e.statusBarHeight;
    //     let custom = wx.getMenuButtonBoundingClientRect();        
    //     this.globalData.Custom = custom;
    //     this.globalData.CustomBar = custom.bottom + custom.top - e.statusBarHeight;
    //     console.log(this.globalData.CustomBar)
    //   }
    // })
    //检查登录，如果登录数据则去登录
    //  util.checkLogin()
  },
  
})
