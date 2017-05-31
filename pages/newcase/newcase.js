// pages/personinfo/person.js
// 获取腾讯云的sdk，使用sdk的接口进行沟通服务器
var qcloud = require('../../vendor/qcloud-weapp-client-sdk/index');

// 引入配置
var config = require('../../config');

//获取应用实例
var app = getApp();

Page({
  data: {
    // 判断是否为已发布案件
    isfabu: false,
    // 判断是否为草稿
    isDraft: false,
    showTopTips: false,
    errormsg: "数据不规范",
    wordnum: 0,

    hasCache: false,
    // 案件数据

    id: "",
    title: "",
    respondentid: '',
    respondent: "",
    orginalpay: "",
    description: "",
    accuser: "",
  },
  onLoad: function (options) {
    // 判断是否为草稿
    // console.log(options)
    this.setData({
      isfabu: options.hasfabu,
      isDraft: options.draft,
    });
    /**
     * 这里是将缓存打印出来，也可以当作参数来使用
     */
    var casecache = qcloud.getCaseCache();
    if (options.draft == "true" && casecache) {
      this.setData({
        id: casecache.id,
        title: casecache.title,
        respondent: casecache.respondent,
        orginalpay: casecache.orginalpay,
        description: casecache.description,
        accuser: casecache.accuser,
        wordnum: casecache.description.length,
      });
    }
    else {
      // console.log(app.globalData.userInfo);
      this.setData({
        accuser: app.globalData.userInfo.nickName,
      })
    }
  },
  /**
   * 重新设置描述
   */
  onReady: function (e) {
    this.setData({
      description: this.data.description,
    })
  },
  /**
   * 当从用户选择页面返回本页面
   */
  onShow: function (e) {
    var usercache = qcloud.getUserCache();
    // console.log(usercache);
    if (usercache) {
      this.setData({
          respondentid : usercache.id,
          respondent : usercache.nickname,
      });
      qcloud.clearUserCache();
    }
  },
  formSubmit: function (e) {
    const that = this;
    var urltemp = "";
    if (this.data.isDraft == "true") {
      // 如果是草稿，就进行草稿提交
      urltemp = config.requestPutDraftok;
    }
    else {
      urltemp = config.requestPutNewCaseByPost;
    }
    var value = e.detail.value;
    // console.log(value);
    // 数据是否有为空的
    var result = value.title.trim() != "" &&
      value.respondent.trim() != "" &&
      value.orginalpay.trim() != "" &&
      value.description.trim() != "" &&
      value.accuser.trim() != "" &&
      parseFloat(value.orginalpay) != 0;

    if (this.data.showTopTips || !result) {
      app.showModel("数据有误", "请检查数据是否未填或金额输入不能为0");
    }
    else {
      value.issuer = app.globalData.userInfo.nickName;

      value.state = 0;
      // 投诉人和应诉人的id

      value.respondentid = 2,
        value.accuserid = 1,
        value.id = this.data.id;
      app.showBusy("正在提交...");
      qcloud.request({
        url: urltemp,
        login: app.globalData.hasLogin,
        data: value,
        method: "post",
        header: { "content-type": "application/x-www-form-urlencoded" },
        success: function (res) {
          // console.log(res);
          if (res.data) {
            app.showSuccess("数据已经提交");
            qcloud.clearCaseCache();
            // wx.redirectTo({url:"../main/main"});
            wx.navigateBack();
          }
          else {
            app.showModel('提交失败！', "服务器出问题了");
          }
        },
        fail: function (error) {
          app.showModel("提交失败！", error);
        }
      });
    }
  },

  // 检查金额数据部位空切不能是字符串。
  justInTimeCheckDataAndNum: function (e) {

    var value = e.detail.value;
    var result = isNaN(parseFloat(value));
    // console.log(parseFloat(value));
    this.setData({
      orginalpay: parseFloat(value),
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
  },
  /**
  * 改变字数变化，赋值理由到变量
  */
  justInTimeCountAndInput: function (e) {
    var value = e.detail.value;
    this.setData({
      wordnum: value.length,
      description: value
    })
  },
  /**
  * 应诉人选择
  */
  justInTimeSyrespondent: function (e) { 
    wx.navigateTo({
      url: '../personinfo/users',
    });
  },
  /**
   * 投诉人--赋值到js变量中
   */
  justInTimeSyaccuser: function (e) {
    this.setData({
      accuser: e.detail.value,
    })
  },

  /**
   * 标题--赋值到js变量中
   */
  justInTimeSyTitle: function (e) {
    this.setData({
      title: e.detail.value,
    })
  },
  /**
  * 提交未草稿的话……。
  */
  onCache: function () {
    var values = {
      id: this.data.id,
      title: this.data.title,
      accuser: this.data.accuser,
      respondent: this.data.respondent,
      orginalpay: this.data.orginalpay,
      description: this.data.description,
      state: -1,// 草稿
      issuer: app.globalData.userInfo.nickName,
    }
    var urltemp = "";
    if (this.data.isDraft == "true") {
      // 如果是草稿，就进行草稿提交
      urltemp = config.requestPutDraftok;
    }
    else {
      urltemp = config.requestPutNewCaseByPost;
    }
    console.log(urltemp);
    app.showBusy("正在提交...");
    qcloud.request({
      url: urltemp,
      login: app.globalData.hasLogin,
      data: values,
      method: "post",
      header: { "content-type": "application/x-www-form-urlencoded" },
      success: function (res) {
        // console.log(res);
        if (res.data.isok) {
          app.showSuccess("数据已经提交");
          // 导航回到主页面
          qcloud.clearCaseCache();
          wx.navigateBack();
        }
        else {
          app.showModel('提交失败！', "服务器出问题了");
        }
      },
      fail: function (error) {
        app.showModel("提交失败！", error);
      }
    });

  }
})