// pages/tipinformation/tipinformation.js
const app = getApp()
Page({
  data: {},

  btnagree: function () {
    console.log(app.globalData.hasLogin)
    if (app.globalData.hasLogin)
      wx.navigateTo({
        url: "../newcase/newcase?draft=false&hasfabu=false",
      });
    else 
      app.showModel("请求出错！","未登陆，请先登陆")
  },
})