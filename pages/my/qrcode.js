var app = getApp()
Page({
  data: {    
    url: app.globalData.imgpath +'/qrcode.png'
  },
  // 长按保存图片
  saveImage(e) {
    let url = e.currentTarget.dataset.url;
    //用户需要授权
    wx.getSetting({
      success: (res) => {
        if (!res.authSetting['scope.writePhotosAlbum']) {
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success: () => {
              // 同意授权
              this.saveImg1(url);
            },
            fail: (res) => {
              console.log(res);
            }
          })
        } else {
          // 已经授权了
          this.saveImg1(url);
        }
      },
      fail: (res) => {
        console.log(res);
      }
    })
  },
  saveImg1(url) {
    wx.getImageInfo({
      src: url,
      success: (res) => {
        let path = res.path;
        wx.saveImageToPhotosAlbum({
          filePath: path,
          success: (res) => {
            console.log(res);
          },
          fail: (res) => {
            console.log(res);
          }
        })
      },
      fail: (res) => {
        console.log(res);
      }
    })
  },
})