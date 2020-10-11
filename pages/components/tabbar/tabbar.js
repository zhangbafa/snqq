// pages/components/tabbar.js
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
    isCurrPage: {
      type: String,
      default: 'index'
    }, 
    testdata:{
      type: Array,
      default:[]
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
   
  },

  /**
   * 组件的方法列表
   */
  methods: {
    tabBarChange(e){    
      let url = e.currentTarget.dataset.url;
      // this.triggerEvent('changeName', {
      //   name: '李四'
      // })
      wx.redirectTo({        
        url: '/pages/'+url+'/'+url,
      })
    },
    
  }
})
