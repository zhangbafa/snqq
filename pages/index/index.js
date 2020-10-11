var util = require('../../utils/util.js')
import storages from '../../utils/storages.js'
var app = getApp()
Page({
  data: {
    page:1,//当前分页
    tips: 1,
    gotop:false,
    realTimeData:null,//列表数据,    
    Category: [],//栏目
    imgpath: app.globalData.BaseUrl,
    swiperList: [{
      id: 0,
      type: 'image',
      url: 'https://www.snqqw.com/images/banner.jpg?id=1'
    }
    ],
    showSkeleton: true ,  //骨架屏显示隐藏,
    AppName: app.globalData.AppName,
    CustomBar: app.globalData.CustomBar + 10,
  },
  onLoad(e) {       
    console.log('sss')
    var t = wx.getStorageSync("utoken")
    wx.login({
      success: function (u) {
        console.log(u);
        var a = u.code;
        wx.getUserInfo({
          success: function (u) {
            wx.request({
              url: 'https://397360.ixiaochengxu.cc/index.php/home/weixin/slogin',
              method: "POST",
              data: {
                utoken: t,
                code: a,
                token: 'gh_18af1cc4f83a',
                encryptedData: u.encryptedData,
                iv: u.iv
              },
              fail: function (e) {
                console.dir(e);
              },
              success: function (e) {
                var t = e.data.utoken;
                console.log('tokrn:' + t)
               
              }
            });
          },
          fail: function (e) {
            console.log(e);
          }
        });
      },
      fail: function (e) {
        console.log(e);
      }
    });
    var that = this 
    //获取推荐列表，缓存第一页的信息，过期时间为 1 分钟 
    let postdata = {}
    postdata.type = ''
    postdata.page = this.data.page
    util.httpGet(app.globalData.BaseUrl,'lists',postdata,function(data){    
      storages.put('maxid', data[0]['id'])
      that.setData({
        realTimeData: data,
        showSkeleton: false
      })

      })
     
    //缓存最大ID,下拉刷新的有新数据，则更新这个值
    //获取栏目信息，并缓存 30 天
    if(storages.get('cache_category')){     
        that.setData({
        Category: storages.get('cache_category')
      })
    }else{
      util.http(app.globalData.BaseUrl+'types', function (data) {
      that.setData({
        Category: data
      })
      storages.put('cache_category',data,4320)
    })
  }
  //tips:提示收藏小程序
  if(storages.get('cache_tips')){
    this.setData({
      tips:0
    })
  }
    
  },
  onReady(){},
  NavChange(e) {
    wx.navigateTo({
      url: '/pages/posts/post',
    })
  },
  
  tonav(e){ //去往列表页
    let typeid = e.currentTarget.dataset.typeid;    
    let categoryname = e.currentTarget.dataset.categoryname 
    var url='/pages/list/list?typeid=' + typeid + '&categoryname=' + encodeURIComponent(categoryname)
    console.log(url)
    wx.navigateTo({
      url: '/pages/list/list?typeid=' + typeid + '&categoryname=' +encodeURIComponent(categoryname)
    })
  },
  onPullDownRefresh() { //下拉刷新 
    
    var _that = this     
    console.log('shuaxin')
    let postdata = {}
    postdata.type = ''
    postdata.page = 1
    util.httpGet(app.globalData.BaseUrl, 'lists', postdata, function (data) {
      var maxid = storages.get('maxid')
      if (maxid && maxid < data[0]['id']) {
        _that.setData({
          realTimeData: data
        })
      }
      wx.stopPullDownRefresh()
    })

    
  
    
  },
  // 上拉加载
  onReachBottom(e) {    
    let _that = this
    this.setData({
      page: this.data.page+1
    })
    let postdata = {}
    postdata.type = ''
    postdata.page = this.data.page
    util.httpGet(app.globalData.BaseUrl, 'lists', postdata, function (data) {
      if (data == null) {
        return false
      }
      _that.setData({
        realTimeData: _that.data.realTimeData.concat(data)
      })

    })
  
  },
  todetail(e){
    let id = e.currentTarget.dataset.id
    let typename = e.currentTarget.dataset.typename
    wx.navigateTo({
      url: '/pages/showdetail/showdetail?id='+id,
    })
  },
  changeName(event) {//子组件向父组件传值
    console.log(event.detail)
  },
  closetips(e){
    storages.put('cache_tips',1,24*60*30)
    this.setData({
      tips:0
    })
  },
  onPageScroll(e){
    var h = wx.getSystemInfoSync().windowHeight+300
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
    console.log('gotop')
    if(wx.pageScrollTo){
      wx.pageScrollTo({
        scrollTop:0
      })
    }
  },
hotnews(e){},
onShareAppMessage() {
    return {
      title: '睢宁圈圈信息平台',
      // imageUrl: '/images/share.jpg',
      path: '/pages/index/index'
    }
}
 
})