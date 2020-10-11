import storages from './storages.js'
function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}


function convertToStarsArray(stars) {
  var num = stars.toString().substring(0, 1);
  var array = [];
  for (var i = 1; i <= 5; i++) {
    if (i <= num) {
      array.push(1);
    }
    else {
      array.push(0);
    }
  }
  return array;
}

function http(url, callBack) {
  wx.request({
    url: url,
    method: 'GET',
    header: {
      "Content-Type": "json"
    },
    success: function (res) {
      callBack(res.data);
    },
    fail: function (error) {
      wx.showLoading({
        title: '加载失败!',
      })
    }
  })
}



/**
 * 网络请求
 * @param {网址} url 
 * @param {接口名称} apipath 
 * @param {传递参数} data 
 * @param {回调函数} callBack 
 */
function httpGet(url,apipath,data, callBack) {
  wx.showLoading({
      title: '加载中',
  })
  //检测网络状态，如果网络异常，则从缓存中读取
  //只缓存前 3 页
  // wx.onNetworkStatusChange(function (res) {
  //   console.log(res)
  // })
  wx.request({
    url: url+apipath,
    method: 'GET',
    header: {
      "Content-Type": "application/json"
    },
    data:data,
    success: function (res) {
      wx.hideLoading()
      callBack(res.data);
    },
    fail: function (error) {
      console.log(error)
      wx.hideLoading()
      wx.showModal({
        title: '加载失败',
        content: '是否重新加载', 
        success:function(res){
          
          if (res.confirm){
            wx.redirectTo({
              url: '/pages/index/index',
            })
          }
        }
      })
    }
  })
}


function convertToCastString(casts) {
  var castsjoin = "";
  for (var idx in casts) {
    castsjoin = castsjoin + casts[idx].name + " / ";
  }
  return castsjoin.substring(0, castsjoin.length - 2);
}


function convertToCastInfos(casts) {
  var castsArray = []
  for (var idx in casts) {
    var cast = {
      img: casts[idx].avatars ? casts[idx].avatars.large : "",
      name: casts[idx].name
    }
    castsArray.push(cast);
  }
  return castsArray;
}


function uploadimg(data) {
  var that = this,
    i = data.i ? data.i : 0,//当前上传的哪张图片
    success = data.success ? data.success : 0,//上传成功的个数
    fail = data.fail ? data.fail : 0;//上传失败的个数
  
  var ss = data.tt
  wx.uploadFile({
    url: data.url,
    filePath: data.path[i],
    header: {
      "Content-Type": "multipart/form-data",
      'accept': 'application/json',
    },

    name: 'file',//这里根据自己的实际情况改
    formData: null,//这里是上传图片时一起上传的数据
    success: (resp) => {
      success++;//图片上传成功，图片上传成功的变量+1
      var img = resp.data
      var detailPics = ss.data.uploadFilePath;
      detailPics.push(img)
      ss.setData({
        uploadFilePath: detailPics
      })
    },
    fail: (res) => {
      fail++;//图片上传失败，图片上传失败的变量+1
    },
    complete: () => {
      i++;//这个图片执行完上传后，开始上传下一张
      if (i == data.path.length) {   //当图片传完时，停止调用          
        // console.log('执行完毕');
        // console.log('成功：' + success + " 失败：" + fail);
      } else {//若图片还没有传完，则继续调用函数
        data.i = i;
        data.success = success;
        data.fail = fail;
        that.uploadimg(data);
      }

    }
  });
}
//上传视频视频
function uploadVideo(data){
  var thats = data.tt
  wx.uploadFile({
          url: data.url,
          filePath: data.path,
          method: 'POST',
          header: {"Content-Type": "multipart/form-data",'accept': 'application/json'},
          name: 'file',
          formData: null,
          success: (resp) => {
            thats.setData({
              videopath:resp.data
            })
            console.log(thats.data.videopath)
            wx.hideLoading()
             wx.showToast({
              title:'视频上传成功'
            })
          },
          fail: (res) => {
            wx.showToast({
              title:'视频上传失败'
            })
          },
          complete: () => {
           
          } 
        })
}
//上传视频视频封面
function videopost(data) {
  var thats = data.tt
  wx.uploadFile({
    url: data.url,
    filePath: data.path,
    method: 'POST',
    header: { "Content-Type": "multipart/form-data", 'accept': 'application/json' },
    name: 'file',
    formData: null,
    success: (resp) => {
      thats.setData({
        videopost: resp.data
      })
    },
    fail: (res) => {},
    complete: () => {}
  })
}
//检查登录状态, 检查session的过期时间
function checkLogin_bak(){
  console.log('检查登录')
   wx.checkSession({
      success() {
        // session_key 未过期，并且在本生命周期一直有效
        // 检查缓存中是否有 token ，如果没有去服务端换取 token
        // 重新写入缓存
       
        // 登录没过有效期，缓存中的 token 被清除了的情况，
        // 重新登录去服务端换取 token
        var token = storages.get('access_token')
        if(token){
        }else{
          doLogin()
        }
      },
      fail() {
        // session_key 已经失效，需要重新执行登录流程
        console.log('检查失败')
        doLogin()
        return false;
      }
    })
}

//检查登录状态，不检查session的过期时间
function checkLogin(){
  var token = storages.get('access_token')
  var binding = storages.get('binding')
 
  if(!token){//跳转到授权登录页面
      doLogin()//去登录
  }
  return false;
}

//登录流程
function doLogin(){
   wx.login({
      success(res) {        
        if (res.code) {
          //发起网络请求var app = getApp()
          wx.request({
            url: 'https://www.snqqw.com/index/api/talk',
            data: {
              code: res.code
            },
            success:function(res){              
              // token 令牌，binding=1 是否绑定头像、呢称等信息
              // 将服务端获取的 token，binding 缓存，不设置有效期   
              // wx.checkSession 检查过期之后。重新登录。//暂不考虑
              // 检查缓存中是否有 token ，如果有则删除旧的
              // 重新写入新的 token       
              if(storages.get('access_token')){storages.remove('access_token')}
              if(storages.get('binding')){storages.remove('binding')}
              storages.put('access_token', res.data.sessionid)
              storages.put('binding',res.data.binding) // 已经绑定头像用户信息
              storages.put('phonenum',res.data.mobile) // 绑定的手机号码
              if(res.data.binding == 0){ //如果没有绑定基本信息，去授权页面获取基本信息并且绑定
                   wx.redirectTo({
                    url: '/pages/my/wxauth',
                  })
              }else{
                // console.log('用户基本信息、sessid已经绑定了')
              }
              // 判断有没有验证手机，如果没有验证跳转去验证手机号码
              // 如果已经验证进行下面流程 

            }
          })
        } else {
          
           wx.showLoading({
            title: '登录异常',
            })
        }
      },
      fail(){
        wx.showLoading({
          title: '登录失败',
        }) 
      }
    })
  var interval = setInterval(function () {
   
  }, 1000);
}
/**
 * 检测当前的小程序
 * 是否是最新版本，是否需要下载、更新
 */
function checkUpdateVersion() {
  //创建 UpdateManager 实例
  const updateManager = wx.getUpdateManager();
  //检测版本更新
  updateManager.onCheckForUpdate(function(res) {
    // 请求完新版本信息的回调
    if (res.hasUpdate) {
      //监听小程序有版本更新事件
      updateManager.onUpdateReady(function() {
        wx.showModal({
          title: '更新提示',
          content: '新版本已经准备好，是否重启应用？',
          success(res) {
            if (res.confirm) {
              // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
              // 清除缓存
              updateManager.applyUpdate();
              console.log('更新完成')
            }
          }
        })
      })

      updateManager.onUpdateFailed(function() {
        // 新版本下载失败
        wx.showModal({
          title: '已经有新版本咯~',
          content: '请您删除当前小程序，到微信 “发现-小程序” 页，重新搜索打开呦~',
        })
      })
    }else{
      // console.log('没有更新')
    }
  })
}


/**
 * 检测当前的小程序
 * 是否是最新版本，是否需要下载、更新
 */
function checkUpdateVersion_auto() {
  //判断微信版本是否 兼容小程序更新机制API的使用
  if (wx.canIUse('getUpdateManager')) {
    //创建 UpdateManager 实例
    const updateManager = wx.getUpdateManager();
    //检测版本更新
    updateManager.onCheckForUpdate(function(res) {
      // 请求完新版本信息的回调
      if (res.hasUpdate) {
        //监听小程序有版本更新事件
        updateManager.onUpdateReady(function() {
          //TODO 新的版本已经下载好，调用 applyUpdate 应用新版本并重启 （ 此处进行了自动更新操作）
          updateManager.applyUpdate();
        })
        updateManager.onUpdateFailed(function() {
          // 新版本下载失败
          wx.showModal({
            title: '已经有新版本喽~',
            content: '请您删除当前小程序，到微信 “发现-小程序” 页，重新搜索打开哦~',
          })
        })
      }
    })
  } else {
    //TODO 此时微信版本太低（一般而言版本都是支持的）
    wx.showModal({
      title: '溫馨提示',
      content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
    })
  }
}
/**
 * 可以返回的跳转
 */
function ToPage(url){
  wx.navigateTo({
    url: url,
  })
}
/**
 * 获取本地位置
 */
function getlocation(callBack){
  var QQMapWX = require('./qqmap-wx-jssdk.min.js');
  var qqmapsdk;
  qqmapsdk = new QQMapWX({
    key: '6DLBZ-XXEC6-UYRSZ-EJ7TH-N5QLT-R6BLS'
  });
  wx.getLocation({
    type: 'wgs84',
    success: function (res) {
      
      qqmapsdk.reverseGeocoder({
        location: {
          latitude: res.latitude,
          longitude: res.longitude
        },
        success: function (addressRes) {
          var address = addressRes.result.formatted_addresses.recommend;
          
          var locationInfo = {
            'address':address,
            'latitude':res.latitude,
            'longitude': res.longitude
          }
          // console.log(locationInfo)
          callBack(locationInfo)
         
        }
      })

    }
  })
}



module.exports = {
  convertToStarsArray: convertToStarsArray,
  http: http,
  convertToCastString: convertToCastString,
  convertToCastInfos: convertToCastInfos,
  formatTime: formatTime,
  uploadimg:uploadimg,
  doLogin:doLogin,
  checkLogin:checkLogin,
  httpGet:httpGet,
  checkUpdateVersion_auto: checkUpdateVersion_auto,
  uploadVideo:uploadVideo,
  ToPage:ToPage,
  getlocation:getlocation,
  videopost: videopost
}