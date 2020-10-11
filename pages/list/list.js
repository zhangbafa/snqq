var util = require('../../utils/util.js')
import storages from '../../utils/storages.js'
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    TabCur: 0,
    scrollLeft:0,
    categoryName:'',//分类名称
    typeid:'',//分类ID
    subclassid:'',
    page:1,//分页    
    listData:[],//列表,
    gotop:false,
    Category:null
  },
    tabSelect(e) {
    var that = this
    var tabid = e.currentTarget.dataset.id
    var subclassid = e.currentTarget.dataset.subclassid
    // if(tabid==0){
    //   this.setData({
    //     info:true,
    //     fav:false,
    //     comment:false,
    //     digg:false,
    //   })
    // }
    
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      scrollLeft: (e.currentTarget.dataset.id-1)*60,
      listData:[],
      page:1,
      subclassid:subclassid
    })
    // 加分页
    let postdata={}
    postdata.page=this.data.page
    postdata.typeid=this.data.typeid
    postdata.subclassid=subclassid
    util.httpGet(app.globalData.BaseUrl,'lists',postdata,function(data){
      wx.hideLoading()
      that.setData({
          listData: data
      })
    })

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    let typeid = options.typeid   
    let categoryname = decodeURIComponent(options.categoryname)
    let category_subclass_id = ''//第一个子类的id
    // 分享之后的参数
    var subclassid = options.subclassid
    var tabid = options.tabid
    if (tabid == undefined){
      tabid= 0
    }
    
    //是否有子类，获取默认的子类id,
    //获取子类的命名、id
    let category = storages.get('cache_category')
    let category_subclass = null
    for (var i = 0; i < category.length; i++) {
      if (category[i].typeid == typeid) {
        if (category[i].subclass != undefined)
          category_subclass = category[i].subclass
      }
    }
    if (category_subclass != null) {
      if(subclassid){//分享之后，有subclassid的情况
        category_subclass_id = subclassid
      }else{
        category_subclass_id = category_subclass[0].typeid
      }      

    }
    
   
    
    wx.showLoading({
      title: '加载中',
    })

    let postdata = {}
    postdata.page = this.data.page
    postdata.typeid = typeid
    postdata.subclassid = category_subclass_id //获取到的子类中的第一个子类
    util.httpGet(app.globalData.BaseUrl,'lists',postdata,function(data){
      wx.hideLoading()
      that.setData({
          listData: data
      })
    })
   
    this.setData({
      categoryName: categoryname,
      typeid:typeid,
      Category: category_subclass,
      TabCur:tabid,
      subclassid: category_subclass_id
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
  onReachBottom(e) {
    let that = this;
    this.setData({
      page: this.data.page+1
    })
    wx.showLoading({
      title: '加载中',
    }) 
    let postdata = {}
    postdata.page = this.data.page
    postdata.typeid = this.data.typeid
    postdata.subclassid = this.data.subclassid
    util.httpGet(app.globalData.BaseUrl,'lists',postdata,function(data){
       wx.hideLoading()
       if(data==null){
          return false
        }
      that.setData({
          listData: that.data.listData.concat(data)
      })
    })    
    
  },
  todetail(e){
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/showdetail/showdetail?id='+id,
    })
  },
  onPageScroll(e){
    this.setData({
          gotop:true
    })

    // var h = wx.getSystemInfoSync().windowHeight-100
    // console.log(h)
    // console.log(e.scrollTop)
    // if(e.scrollTop>h){
    //     this.setData({
    //       gotop:true
    //     })
    // }else{
    //   this.setData({
    //     gotop: false
    //   })
    // }
  },
  gotop(e){
    console.log('gotop')
    if(wx.pageScrollTo){
      wx.pageScrollTo({
        scrollTop:0
      })
    }
  },
  gorelease(e){
    wx.navigateTo({
      url:'/pages/release/releaseform?classid='+this.data.typeid+'&subclassid='+this.data.subclassid
    })
  },
  onShareAppMessage() {
    return {
      title: this.data.categoryName+'-睢宁圈圈信息平台',  
      imgurl:'https://www.snqqw.com/images/logo.png',   
      path: '/pages/list/list?typeid=' + this.data.typeid + '&categoryname=' + encodeURIComponent(this.data.categoryName)+'&subclassid='+this.data.subclassid+'&page='+this.data.page+'&tabid='+this.data.TabCur
    }
  }
})