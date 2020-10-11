const app = getApp();
import WxValidate from '../../utils/WxValidate.js'
import storages from '../../utils/storages.js'
var util = require('../../utils/util.js')

Page({
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    Category: app.globalData.Category,
    classID:'',
    subclassID:'',
    imgList: [],    
    categoryText:'',
    form: {
      title: '',      
      phone: ''      
    },
    pics: [],
    uploadFilePath:[],
    input_phone:false,//输入的手机号
    phonenum:'',
    videodisp:false,
    videopath:'',
    videopost:'',
    location:null
  },
  onLoad:function(options){
    util.checkLogin()
    var that = this
    util.getlocation(function (locationInfo){
      that.setData({
        location: locationInfo
      })
    })
    
    
    this.initValidate();
    let classid = options.classid
    let subclassid = options.subclassid
    this.setData({
      classID:classid,
      subclassID:subclassid,
      phonenum: storages.get('phonenum')
    })
  },
  choosemedia(e) {
    var that = this;
    var pics = this.data.pics;
    wx.chooseImage({
      count: 9, //默认9'original',
      sizeType: ['compressed'], //可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], //从相册选择
      success: (res) => {
        //上传图片
        var tempFilePaths = res.tempFilePaths
        var imgsrc = res.tempFilePaths;
        pics = pics.concat(imgsrc);
        that.setData({
          pics: pics
        });
        if (this.data.imgList.length != 0) {
          this.setData({
            imgList: this.data.imgList.concat(res.tempFilePaths).splice(0,9)
          })
        } else {
          this.setData({
            imgList: res.tempFilePaths
          })
        }
        var picsr = this.data.pics.splice(0,9);
        // this.setData({
        //   pics:picsr
        // })
       
        util.uploadimg({
          url: app.globalData.BaseUrl + 'pic',//这里是你图片上传的接口
          path: picsr,//这里是选取的图片的地址数组
          tt: that
        });
      }
    });
  },
  ChooseImage() {
    var _that = this
    _that.choosemedia()
    // wx.showActionSheet({
    //   itemList: ['图片','视频'],
    //   success: function (res) {
    //    if(res.tapIndex==0){
    //      _that.choosemedia()
    //    }else{
    //      _that.choosevideo()
    //    }
    //   }
    // })
  },
  choosevideo(e) {
    var that = this
    wx.chooseVideo({
      sourceType: ['album', 'camera'],
      maxDuration: 15,//视频时间
      camera: 'back',
      success(res) {
        // console.log(res)
        var filename = res.tempFilePath
        var video_post = res.thumbTempFilePath
        //视频预览
        that.setData({
          video: res.tempFilePath,
          videodisp: true,
          poster: res.thumbTempFilePath
        })
        //上传视频
        wx.showLoading({
          title: '视频上传中'
        })
        util.videopost({
          url: app.globalData.BaseUrl + 'pic',
          path: video_post,
          tt: that
        });
        util.uploadVideo({
          url: app.globalData.BaseUrl + 'vod',
          path: filename,
          tt: that
        });
       
        //
      }
    })

  },
  Delvideo(e){
    this.setData({
      video: '',
      videodisp: false,
      uploadVideo:''
    })
  },
  ViewImage(e) {
    wx.previewImage({
      urls: this.data.imgList,
      current: e.currentTarget.dataset.url
    });
  },
  DelImg(e) {
    wx.showModal({
      title: '',
      content: '确定要删除图片吗',
      cancelText: '取消',
      confirmText: '确定',
      success: res => {
        if (res.confirm) {
          this.data.imgList.splice(e.currentTarget.dataset.index, 1);
          this.data.uploadFilePath.splice(e.currentTarget.dataset.index, 1);
          this.setData({
            imgList: this.data.imgList,
            uploadFilePath:this.data.uploadFilePath
          })
          
        }
      }
    })
  },  
  formReset(e){},//重置表单
  inputmobile(e){
    var mobile = e.detail.value
    this.setData({
      input_phone:true,
      phonenum:mobile
    })
  },
  clearphone(e){
    this.setData({
      input_phone:false,
      phonenum:''
    })
  },
  initValidate: function () {//表单验证
    const rules = {
      // title: {
      //   required: true,
      //   maxlength: 100,
      // },
      phone: {
        required: true,
        tel: true
      },  
    }
    const messages = {
      title: {
        required: '请填写标题',
        maxlength: '标题长度不超过100个字！'
      },     
      phone: {
        required: '请填写联系电话',
        tel: '请填写正确的联系电话'
      },
    } 
    this.WxValidate = new WxValidate(rules, messages)
  },
  formSubmit: function (e) {   
    const params = e.detail.value 
    params.formId = e.detail.formId
    params.typeid=this.data.classID
    params.subclassid = this.data.subclassID     
    var filepathString = ''
    for (var i = 0; i < this.data.uploadFilePath.length; i++) {
      filepathString += this.data.uploadFilePath[i].trim()+','
    }  
   
    params.pic = filepathString   
    params.vod = this.data.videopath
    params.sessionid = storages.get('access_token') 
    if(this.data.classID == 1){
      params.phone = '13817137102'
    }

    if (this.data.classID == 10) {      
      if (e.detail.value.phone==''){
        params.phone = '13817137102'
      }
    }
    
    // 用户的位置坐标、转换后的地址。
    // 2019.10.12 修改：定位可以修改，下面address注释
    // params.address = this.data.location.address
    params.latitude = ''
    params.longitude = ''
    if(location!=null){
      params.latitude = this.data.location.latitude
      params.longitude = this.data.location.longitude
    }
    //视频封面
    params.videopost = this.data.videopost
    if (!this.WxValidate.checkForm(params)) {
      const error = this.WxValidate.errorList[0]
      this.showModal(error)
      return false
    }
    wx.request({
      url: app.globalData.BaseUrl+'publish',
      data: params,
      header: {},
      method: 'post',
      dataType: 'json',
      responseType: 'text',
      success: function (res) {
        wx.showToast({
          title: '请等待审核(+5积分)',
          icon:'none'
        })
        setTimeout(function(){
          wx.reLaunch({
            url: '/pages/index/index',
          })
        },1000)
        
      },
      fail: function (res) {
        console.log('error')
      },
      complete: function (res) {
        console.log(res)
      },
    })
  },
  showModal(error) {
    wx.showModal({
      content: error.msg
    })
  },
  cancelRelease(e){
    wx.navigateBack({
      delta: 1
    })
  },
  clearaddress(e){
    this.setData({
      location:null
    })
  }
})