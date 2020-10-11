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
    
  },

  /**
   * 组件的初始数据
   */
  data: {
    gotop: false,
  },
  ready: function () { 
    let pages = getCurrentPages(); //当前页面栈
    let prevPage = pages.pop();//当前页面、
    prevPage.onPageScroll = ({ scrollTop }) => {
      if(scrollTop>600){
        console.log('index')
        this.setData({
          gotop: true
        })
      }
    };
  },


  /**
   * 组件的方法列表
   */
  methods: {
    gotop(e) {//返回顶部
      if (wx.pageScrollTo) {
        wx.pageScrollTo({
          scrollTop: 0
        })
      }
    },
    gorelease(e) {//跳转发布页
      wx.navigateTo({
        // '/pages/release/releaseform?classid=' + this.data.typeid + '&subclassid=' + this.data.subclassid
        url: '/pages/release/release'
      })
    }
  }
})
