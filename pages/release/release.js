const app = getApp();
import storages from '../../utils/storages.js'
var util = require('../../utils/util.js')
Page({
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar, 
    Category: []
  },
  showModal(e) {
    let classid = e.currentTarget.dataset.id
    let index = e.currentTarget.dataset.index
    let isSubClass = this.data.Category[index].subclass;
    if(isSubClass==undefined){
      util.ToPage('releaseform?classid=' + classid + '&subclassid=')
    }else{
      //子类的Name
      var itemListText = [];
      for (var i in isSubClass) {
        itemListText.push(isSubClass[i]['name']);
      }
      wx.showActionSheet({
        itemList: itemListText,
        success:function(res){
          //子类id
          let secondClassID = itemListText[res.tapIndex].typeid
          util.ToPage('releaseform?classid=' + classid + '&subclassid=' + secondClassID)
        }
      })

    }
  
  },
  onLoad(e){     
     var that = this
    //栏目
    if(storages.get('cache_category')){      
        that.setData({
        Category: storages.get('cache_category')
      })
    }else{
      util.http(app.globalData.BaseUrl+'types', function (data) {
      that.setData({
        Category: data
      })
      storages.put('cache_category',data)
    })
   }
  
  }
})