const app = getApp();
var util = require('../../utils/util.js')
var WxParse = require('../../wxParse/wxParse.js')
import storages from '../../utils/storages.js'
Page({
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    classID: 0,
    CurrSubClass: [],
    detailData:[],
    comments:[],
    commentinput: false,
    tj:[],
    currID:'',
    detailClick:false,
    picexists:false,
    imgpath: app.globalData.imgpath,
    favstatus:false,
    comment_input:'',
    calltel_button:true,
    calltel_num:'',
    wxparse:true,
    videodisp:true,
    islook:true
  },
  showModal(e) {
    this.setData({
      modalName: e.currentTarget.dataset.target
    })
  },
  hideModal(e) {
    this.setData({
      modalName: null
    })
  },
  onLoad(opt){      
    
    let id = opt.id     
    this.setData({
      currID: id
    })
    let _that = this
    // 详情
    wx.request({
      url: app.globalData.BaseUrl +'infos/id/'+ _that.data.currID,
      success(res){ 
        if(res.data.typeid==1){
          _that.setData({
            calltel_button:false
          })
          //只有资讯才解析html
          
        }    
        var article = res.data.content
        WxParse.wxParse('article', 'html', article, _that, 5);  
        let username='圈友'
        if(res.data.name){
          username = res.data.name
        }
        _that.setData({
          detailData:res.data,
          calltel_num:res.data.mobile,
          username: username
        })
      }
    })

    // 当前文章是否已经点赞 detailClick
    var livearr = storages.get('live_article')
    if(livearr && livearr.indexOf(_that.data.currID)>-1){
      this.setData({
        detailClick:true
      })
    }

    // 当前的文章是否已收藏 
    var fav_article = storages.get('fav_article')
    if(fav_article){
      console.log(fav_article.indexOf(_that.data.currID,0))
      if(fav_article.indexOf(this.data.currID,0)>-1){
        this.setData({
        favstatus:true
      })
      }      
    }


    wx.showShareMenu({
      withShareTicket: true
    })
    if (opt.scene == 1044) {
      wx.getShareInfo({
        shareTicket: opt.shareTicket,
        success: function (res) {
          var encryptedData = res.encryptedData;
          var iv = res.iv;
        }
      })
    }
  },
  getcomments:function(data){  
    
    // 处理评论列表
    // 判断是否已经点赞了
    var commarr = data
    if(commarr!=null){
      var live_comments_arr = storages.get('live_comments')
      for(var i=0;i<commarr.length;i++){          
          if(live_comments_arr.indexOf(commarr[i].revid)>-1){
            
            commarr[i].isdigg=true
          }        
      }
    }

    this.setData({
      comments: commarr    
    })
  },
  tj: function (data) {
    this.setData({
      tj: data
    })
  },
  zanComments(e){
    util.checkLogin()
    let diggid = e.currentTarget.dataset.id
    
    var live_comments = []
    if(storages.get('live_comments')){
      var live_comment_arr = storages.get('live_comments')
      if(live_comment_arr.indexOf(diggid)>-1){

        live_comment_arr.splice(this.contains(live_comment_arr,this.data.diggid),1)
         storages.put('live_comments',live_comment_arr)
        //request
       util.http(app.globalData.BaseUrl + 'revdigg/revid/' + diggid+'/sessionid/'+storages.get('access_token')+'/remove/1', function(){})

          var commarr = this.data.comments
      for(var i=0;i<commarr.length;i++){          
          if(commarr[i].revid == diggid){
            commarr[i].diggnum -= 1
            commarr[i].isdigg=false
          }        
      }
      this.setData({
        comments: commarr
      })
        // wx.showToast({
        //   title: '取消点赞',
        // })
        // return false;
      }else{
        storages.put('live_comments',live_comment_arr.concat(diggid))
        util.http(app.globalData.BaseUrl + 'revdigg/revid/' + diggid+'/sessionid/'+storages.get('access_token')+'/remove/0', this.process_zanComments)

        var commarr = this.data.comments
        for(var i=0;i<commarr.length;i++){          
          if(commarr[i].revid == diggid){
            commarr[i].diggnum += 1
            commarr[i].isdigg=true
          }        
      }
      this.setData({
        comments: commarr
      })
      }
      
    }else{
      live_comments = live_comments.concat(diggid)       
      storages.put('live_comments',live_comments)

      util.http(app.globalData.BaseUrl + '/revdigg/revid/' + diggid+'/sessionid/'+storages.get('access_token'), this.process_zanComments)
      var commarr = this.data.comments
      for(var i=0;i<commarr.length;i++){          
          if(commarr[i].revid == diggid){
            commarr[i].diggnum += 1
            commarr[i].isdigg=true
          }        
      }
      this.setData({
        comments: commarr
      })
    }    

  },
  process_zanComments:function(){
     // wx.showToast({
     //    title: '成功点赞',
     //  })
  },

  callphone(e){
    
    var phone = this.data.calltel_num
    if (phone==''){
      phone = storages.get('phonenum')
    }
    wx.makePhoneCall({
        phoneNumber: phone,
        fail:function(){
        wx.showToast({
          title:'拨打失败'
        })
      }
      }
      
      )
  },
  onShareAppMessage(e){
    if(e.from=='button'){
      console.log('点击分享按钮:'+e.target)
    }
    var ShareTitle = this.data.detailData.content.replace(/<[^>]+>/g, "")
    ShareTitle = ShareTitle.slice(0, 30)
    return {
      title: ShareTitle,
      path: '/pages/showdetail/showdetail?id=' + this.data.currID,      
      success: function (res) {
        var shareTickets = res.shareTickets;
        if (shareTickets.length == 0) {
          return false;
        }
        wx.getShareInfo({
          shareTicket: shareTickets[0],
          success: function (res) {
            var encryptedData = res.encryptedData;
            var iv = res.iv;
          }
        })
    }
  }
  },
  formSubmit: function (e) {
    util.checkLogin()
    const params = e.detail.value    
    params.infoid = this.data.currID  
    params.sessionid = storages.get('access_token')  
    if (params.msg==''){
      wx.showToast({
        title: '内容不能为空',
        icon: 'none'
      })
      return false;
    }

    var obj1 = {};
    let _that = this
     wx.request({
      url: app.globalData.BaseUrl+'reviews/',
      data: params ,
      header: {},
      method: 'post',
      dataType: 'json',
      responseType: 'text',
      success: function (res) {

            wx.showToast({
              title: '请等待审核(+1积分)',
              icon: 'none'
            })
             //清空评论表单的值
            _that.setData({
                comment_input:'',
              modalName: null
            })
      },
      fail: function (res) {
        wx.showToast({
          title:'留言失败',
          icon: 'none'

        })
      },
      complete: function (res) { 
      },
    })
   
  },
  contains(a, obj) {
     var i = a.length;
     while (i--) {
      if (a[i] === obj) {
       return i;
      }
     }
     return false;
},
  detailClick(e){
    util.checkLogin()
    
    var that = this;
    that.setData({
      animation: 'scale-down'
    })
    setTimeout(function() {
      that.setData({
        animation: ''
      })
    }, 300)
    //写缓存，key: live_article
    var live_article = []
    var diggnum_incr = this.data.detailData
    if(storages.get('live_article')){
      var live_arr = storages.get('live_article')
      if(live_arr.indexOf(this.data.currID)>-1){
        //取消点赞，删除缓存中的id
        // console.log(this.contains(live_arr,this.data.currID))
        live_arr.splice(this.contains(live_arr,this.data.currID),1)
        storages.put('live_article',live_arr)
        diggnum_incr.diggnum = this.data.detailData.diggnum-1
         this.setData({
          detailData:diggnum_incr,
          detailClick: false
        })
        
        util.http(app.globalData.BaseUrl + 'infodigg/id/' + this.data.currID+'/remove/1'+'/sessionid/'+storages.get('access_token'), function(){})

        // wx.showToast({
        //   title: '取消点赞',
        // })
        return false;
      }
      storages.put('live_article',live_arr.concat(this.data.currID))
      diggnum_incr.diggnum = this.data.detailData.diggnum+1
    }else{
      live_article = live_article.concat(this.data.currID) 
      storages.put('live_article',live_article)
      diggnum_incr.diggnum = this.data.detailData.diggnum+1
    }    
    
    util.http(app.globalData.BaseUrl + 'infodigg/id/' + this.data.currID+'/remove/0'+'/sessionid/'+storages.get('access_token'), this.diggsuccess)
      
      this.setData({
        detailData:diggnum_incr
      })
      // wx.showToast({
      //   title: '点赞成功',
      // })
   
  },
  diggsuccess(e){
    this.setData({
      detailClick: true
    })
  },
  todetail(e){
    let id = e.currentTarget.dataset.id
    let pages = getCurrentPages(); 
    let pathurl = '/pages/showdetail/showdetail?id='+id
    // console.log(pages)
    if(pages.length==9){
       wx.redirectTo({
        url: pathurl,
      })
    }else{
      wx.navigateTo({
      url: '/pages/showdetail/showdetail?id='+id,
    })
    }


    
    

   
  },
    tohome(e){ // 销毁其它页面，跳转到首页
    wx.reLaunch({
      url: '/pages/index/index',
    })
  },
  commentInputFocus(e){
    this.setData({
      commentinput:true
    })
  },
  favor(e){
    util.checkLogin()
    var favid = e.currentTarget.dataset.id
   
    //写缓存，key: live_article
    var live_article = []
    
    if(storages.get('fav_article')){
      var live_arr = storages.get('fav_article')
      if(live_arr.indexOf(this.data.currID)>-1){
        //取消点赞，删除缓存中的id
        console.log(this.contains(live_arr,this.data.currID))
        live_arr.splice(this.contains(live_arr,this.data.currID),1)
        storages.put('fav_article',live_arr)
         this.setData({
          favstatus: false
        })
        
        util.http(app.globalData.BaseUrl + 'collect/id/' + favid+'/remove/1'+'/sessionid/'+storages.get('access_token'), function(){})

        // wx.showToast({
        //   title: '取消收藏',
        // })
        return false;
      }
      storages.put('fav_article',live_arr.concat(this.data.currID))
    }else{
      live_article = live_article.concat(this.data.currID) 
      storages.put('fav_article',live_article)
    }    
    
    util.http(app.globalData.BaseUrl + 'collect/id/' + favid+'/remove/0'+'/sessionid/'+storages.get('access_token'), function(){})
      
      
      
      this.setData({
        favstatus: true
      })
      // wx.showToast({
      //   title: '收藏成功',
      // })
  },
  onPageScroll(e){

  },
  onReady(e){
    // var query = wx.createSelectorQuery()
    // query.select('#comments').boundingClientRect(function(res){
    //   console.log(res)
    // }).exec()
    util.http(app.globalData.BaseUrl + 'infotj?id=' + this.data.currID, this.tj)
    //获取评论
    util.http(app.globalData.BaseUrl +'reviews/id/'+ this.data.currID,this.getcomments)
    
   var _that = this
    setTimeout(function(){
      _that.setData({
        islook: false
      })

    },3000)

  }









})