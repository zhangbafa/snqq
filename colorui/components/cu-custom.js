const app = getApp();
Component({
  /**
   * 组件的一些选项
   */
  options: {
    addGlobalClass: true,
    multipleSlots: true
  },
  /**
   * 组件的对外属性
   */
  properties: {
    bgColor: {
      type: String,
      default: ''
    }, 
    isCustom: {
      type: [Boolean, String],
      default: false
    },
    isBack: {
      type: [Boolean, String],
      default: false
    },
    bgImage: {
      type: String,
      default: ''
    },
    isHome:{
      type: [Boolean, String],
      default:true
    },
     isNotBack: {
      type: [Boolean, String],
      default: false
    }

  },
  /**
   * 组件的初始数据
   */
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    Custom: app.globalData.Custom
  },
  /**
   * 组件的方法列表
   */
  methods: {
    BackPage() {
    
      if(this.properties.isNotBack=="true" || this.properties.isNotBack){
        return false;
      }
      //不是首页才持续返回上一页操作
      let pages = getCurrentPages(); //当前页面栈
      // if (pages.length == 1) {
        let prevPage = pages.pop();//当前页面
        if(prevPage.route!='pages/index/index'){
          wx.navigateBack({
            delta: 1
          });
        }
      // }
    },
    toHome(){
      wx.reLaunch({
        url: '/pages/index/index',
      })
    }
  }
})