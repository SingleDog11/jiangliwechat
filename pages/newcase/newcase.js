// pages/personinfo/person.js
// 获取腾讯云的sdk，使用sdk的接口进行沟通服务器
var qcloud = require('../../vendor/qcloud-weapp-client-sdk/index');

// 引入配置
var config = require('../../config');

//获取应用实例
var app = getApp();

Page({
  data: {
    showTopTips: false,
    errormsg: "数据不规范",
    wordnum: 0,
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
  },
  formSubmit: function (e) {
    var value = e.detail.value;
    // 数据是否有为空的
    var result = value.title.trim() != "" &&
      value.defendant.trim() != "" &&
      value.claim.trim() != "" &&
      value.statement.trim() != ""&&
      value.Accuser.trim() != ""&&
      parseFloat(value.claim) != 0;

    if (this.data.showTopTips || !result) {
      app.showModel("数据有误", "请检查数据是否未填或金额输入不能为0");
    }
    else {
      value.Accuser = app.globalData.userInfo.nickName;
      app.showBusy("正在提交...");
      qcloud.request({
        url: config.requestPutNewCase,
        login: app.globalData.hasLogin,
        data: value,
        success: function (res) {
          console.log(res);
          if (res.data.isok) {
            app.showSuccess("数据已经提交");
            // 导航回到主页面
            wx.navigateBack();
          }
          else{
            app.showModel('提交失败！',"服务器出问题了");
          }
        },
        fail: function (error) {
          app.showModel("提交失败！", error);
        }
      });
    }
  },
  // 检查数据是否为空
  justInTimeCheckData: function (e) {

    this.setData({
      showTopTips: e.detail.value.trim() == "",
    })
  },
  // 检查金额数据部位空切不能是字符串。
  justInTimeCheckDataAndNum: function (e) {

    var value = e.detail.value;
    var result = isNaN(parseFloat(value));
    console.log(parseFloat(value));
    this.setData({
      showTopTips: e.detail.value.trim() == "" && result,
    })

    if (result) {
      return {
        value: 0,
      }
    }
    else {
      return {
        value: parseFloat(value),
      }
    }
  },
  justInTimeCount: function (e) {
    var count = e.detail.value.length;
    this.setData({
      wordnum: count,
    })
  }
})