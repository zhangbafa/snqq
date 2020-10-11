var app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  options: {
    addGlobalClass: true,
    multipleSlots: true
  },
  properties: {
    display: {
      type: String,
      default: false
    },
    hotdata:{
      type:Array,
      default:[]
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    PicNetUrl: app.globalData.imgpath,//图片网络路径
  },

  /**
   * 组件的方法列表
   */
  methods: {
    todetail(e) {
      let id = e.currentTarget.dataset.id
      let typename = e.currentTarget.dataset.typename
      wx.navigateTo({
        url: '../showdetail/showdetail?id=' + id,
      })
    }

  }
})
