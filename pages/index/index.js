//index.js

// 获取腾讯云的sdk，使用sdk的接口进行沟通服务器
var qcloud = require('../../vendor/qcloud-weapp-client-sdk/index');

// 引入配置
var config = require('../../config');

//获取应用实例
var app = getApp();

Page({
  data: {
    // 初始化登陆地址
    loginUrl: config.loginUrl,

    motto: '登陆 讲理 小程序',
    userInfo: {}
  },
  onLoad: function () {
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function (userInfo) {
      //更新数据
      that.setData({
        userInfo: userInfo
      })
    })
  },
  //确认登陆，要请求业务服务器，获取openid。 
  btnLoginEvent: function () {
    app.showBusy('正在登陆');
    qcloud.login({
      data: this.data.userInfo,
      success(result) {
        //console.log(result)
        if (result != "error") {
          app.showSuccess('登陆成功');
          // 修改全局变量hasLogin
          app.globalData.hasLogin = true;
          app.globalData.openid = result;
          // 请求数据 
          app.globalData.caseslist.updateList();
          // 跳转到主页面
          wx.redirectTo({
            url: '../main/main',
          })
        }
        else {
          app.showModel('登陆失败',"请检查网络");
        }
      },
      fail(error) {
        app.showModel('登陆失败', error);
      }
    });

  }
})
