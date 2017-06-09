// pages/detail/detail.js
// 引入配置
var config = require('../../config');

// 引入腾讯云的sdk
var qcloud = require('../../vendor/qcloud-weapp-client-sdk/index');

const app = getApp();

Page({
  data: {
    cid: 0,
    msg: "",
  },
  onLoad: function (options) {
    console.log(options.id);
    var cid = options.id;
    this.setData({ cid: cid });
  },

  /**
   * 保存提交
   */
  onSubmit: function (e) {
    var msg = e.detail.value.content;
    if (msg.trim() == "") {
      app.showModel("数据有误", "不能提交空数据");
      return;
    }
    this.setData({ msg });
    this.saveData();
  },
  /**
   * 数据上传到数据库
   */
  saveData: function () {
    const that = this;
    qcloud.request({
      login: app.globalData.hasLogin,
      url: config.requestSetAppeal,
      data: { cid: that.data.cid, msg: that.data.msg },
      success: function (res) {
        /**
         * 返回上一个页面
         */
        console.log(res)
        wx.navigateBack();
      }
    })
  },

})