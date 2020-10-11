const app = getApp()
import storages from '../../utils/storages.js'
import WxValidate from '../../utils/WxValidate.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    form: {
      mobile: '',      
      vcode: ''      
    },
    codeinput:false,
    sendcode:false,
    codebuttonText:'发送验证码',
    time: 60,
    phonenum:'',
    disabled:true,
    djsdisplay:false,
    respmobilecode:'',
    login:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    util.checkLogin()
    let l = options.l //登录
    if (l = 'login'){
      this.setData({
        login: true
      })
    }
    this.initValidate();
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

  },
  initValidate: function () {//表单验证
    const rules = {
      mobile: {
        required: true,
        tel: true,
      },
      vcode: {
        required: true,
        digits: true,
        maxlength:4
      },  
    }
    const messages = {
      mobile: {
        required: '请填写手机号码',
        tel: '请填写正确的手机号码'
      },
      vcode: {
        required: '请填写验证码',
        digits: '验证码只能是数字',
        maxlength: '验证码错误'
      },  
    } 
     const phone_rules = {
      mobile: {
        required: true,
        tel: true,
      }     
    }
    const phone_messages = {
      mobile: {
        required: '请填写手机号码',
        tel: '请填写正确的手机号码'
      }
    } 
   
    this.WxValidate = new WxValidate(rules, messages)
    this.WxValidate_s = new WxValidate(phone_rules, phone_messages)
  },
  inputmobile(e){
    var mobile = e.detail.value
    this.setData({
      disabled:false,
      phonenum:mobile
    })
  },
  vcode(e){
    const params =  {}
    params.mobile = this.data.phonenum
     if (!this.WxValidate_s.checkForm(params)) {
      const error = this.WxValidate_s.errorList[0]
      this.showModal(error)
      return false
    }
    
    this.setData({
      sendcode:true,
      codebuttonText:'验证码已经发送',
      djsdisplay:true,
      disabled:true
    })
    //
    this.djst()
    // 验证通过，提交到服务端
    // wx.request()
    params.sessionid = storages.get('access_token')
    
    wx.request({
      url: app.globalData.BaseUrl+'sms',
      data: params,
      header: {},
      method: 'post',
      dataType: 'json',
      responseType: 'text',
      success: function (res) {
        that.setData({
          respmobilecode:res.data
        })
      },
      fail: function (res) {
        console.log('error')
      },
      complete: function (res) {
        console.log(res)
      },
    })
    // 验证通过，提交到服务端
   
  },
  djst(){
    if(this.data.time<=0){
        this.setData({
          djsdisplay:false,
          disabled:false,
          codebuttonText:'发送验证码',
          time:60
        })
    }else{
      this.setData({
        time:this.data.time-1
      })
      var that = this
      setTimeout(function() { 
            that.djst() 
        },1000)
    }    
  },
   showModal(error) {
    wx.showModal({
      content: error.msg
    })
  },
  codeInputFocus(e){
     this.setData({
      codeinput:true
    })

  },
  formSubmit: function (e) { 

    const params = e.detail.value 
    var sessionid = storages.get('access_token')    
    params.sessionid = sessionid
    
    
    if (!this.WxValidate.checkForm(params)) {
      const error = this.WxValidate.errorList[0]
      this.showModal(error)
      return false
    }
    if(this.data.respmobilecode != params.vcode){
      wx.showModal({
        content: '验证码错误'
      })
      return false;
    }

  
    if (this.data.login) {
      //手机登录
    } else {
      //微信账号登录之后，绑定手机
    }

     wx.request({
      url: app.globalData.BaseUrl+'useradd',
      data: params,
      header: {},
      method: 'post',
      dataType: 'json',
      responseType: 'text',
      success: function (res) {
        wx.showToast({
          title: '绑定成功',
        })
        storages.put('phonenum',params.mobile)

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
  } 
})