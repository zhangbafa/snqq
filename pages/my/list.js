const app = getApp();
var util = require('../../utils/util.js')
var WxParse = require('../../wxParse/wxParse.js');
import storages from '../../utils/storages.js'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    TabCur: 0,
    scrollLeft:0,
    tabarr:['我的发布','我的留言','我的收藏'],
    my:[],
    info:true,
    fav:false,
    comment:false,
    page:1,
    gotop:false

  },
   tabSelect(e) {
    var that = this
    var tabid = e.currentTarget.dataset.id
   
    if(tabid==1){
      this.setData({
        comment:true
      })
    }else{
      this.setData({
        comment:false
      })
    }
    
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      scrollLeft: (e.currentTarget.dataset.id-1)*60,
      my:[],
      page:1
    })
    // 加分页
    var urlarr=['myinfo/','myreview/','mycollect/']
    var sessionid = storages.get('access_token')
    let postdata = {
      'sessionid':sessionid,
      'page':1
    }
    util.httpGet(app.globalData.BaseUrl,urlarr[tabid],postdata,this.tabselect_proess)

  },
  tabselect_proess:function(data){
    this.setData({
      my:data
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    util.checkLogin()
    //获取当前tabid
    var that = this
    var tabid = options.tabid
    this.setData({
      TabCur:tabid,
      my:[]
    })
    if(tabid==1){
      this.setData({
        comment:true
      })
    }
    // 获取我的发布
    var sessionid = storages.get('access_token')
    var urlarr=['myinfo/','myreview/','mycollect/']
    let postdata = {}
    postdata.page = 1
    postdata.sessionid = sessionid
    util.httpGet(app.globalData.BaseUrl,urlarr[tabid],postdata,function(data){
      console.log(data)
      that.setData({
        my:data
      })
    })

  },
  
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
      wx.getSystemInfo({
      success: e => {
        
      }
    })
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
  onPageScroll(e){
    var h = wx.getSystemInfoSync().windowHeight
    if(e.scrollTop>h){
        this.setData({
          gotop:true
        })
    }else{
      this.setData({
        gotop: false
      })
    }
  },
  gotop(e){
    if(wx.pageScrollTo){
      wx.pageScrollTo({
        scrollTop:0
      })
    }
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var urlarr=['myinfo/','myreview/','mycollect','mycollect']
    var tabid = this.data.TabCur
    var sessionid = storages.get('access_token')
    var that = this
    this.setData({
      page: this.data.page+1
    })
    let postdata = {}
    postdata.sessionid = sessionid
    postdata.page = this.data.page
    util.httpGet(app.globalData.BaseUrl,urlarr[tabid],postdata,function(data){ //加分页
      if(data==null){
          return false
        }
      that.setData({
        my:that.data.my.concat(data)
      })
    })
  },
  todetail:function(e){
    let safe = e.currentTarget.dataset.safe
    if(safe==0){
      wx.showToast({
        title: '正在审核中！',
        icon: 'none'
      })
      return false
    }
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../showdetail/showdetail?id='+id,
    })
  },
  
})