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

    verid: "",
    title: "",
    defendant: "",
    claim: "",
    statement: "",
    Accuser: "",
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
    // console.log(options.draft);
    // console.log(casecache);
    if (options.draft == "true" && casecache) {
      this.setData({
        verid: casecache.verid,
        title: casecache.title,
        defendant: casecache.defendant,
        claim: casecache.claim,
        statement: casecache.statement,
        Accuser: casecache.Accuser,
        wordnum: casecache.statement.length,
      });
    }
    else {
      this.setData({
        Accuser: app.globalData.userInfo.nickName,
      })
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
    // 数据是否有为空的
    var result = value.title.trim() != "" &&
      value.defendant.trim() != "" &&
      value.claim.trim() != "" &&
      value.statement.trim() != "" &&
      value.Accuser.trim() != "" &&
      parseFloat(value.claim) != 0;

    if (this.data.showTopTips || !result) {
      app.showModel("数据有误", "请检查数据是否未填或金额输入不能为0");
    }
    else {
      value.issuer = app.globalData.userInfo.nickName;
      // 如果是已经审核的案件进行修改
      /*
      if (this.data.isfabu == 'true') {
        value.state = 1;
      } else {
        value.state = 0;
      }*/
      value.state = 0;
      value.Verid = this.data.verid;
      app.showBusy("正在提交...");
      qcloud.request({
        url: urltemp,
        login: app.globalData.hasLogin,
        data: value,
        method: "post",
        header: { "content-type": "application/x-www-form-urlencoded" },
        success: function (res) {
          // console.log(res);
          if (res.data.isok) {
            app.showSuccess("数据已经提交");
            qcloud.clearCaseCache();
            // 导航回到主页面 
            // console.log(that.data.isfabu == 'true' ? 2: 1);
            // 更新全局变量
            app.globalData.caseslist.updateList();
            // console.log(app.globalData)
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
      showTopTips: e.detail.value.trim() == "" && result,
      claim: parseFloat(value),
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
      statement: value
    })
  },
  /**
  * 应诉人--赋值到js变量中
  */
  justInTimeSyDefendant: function (e) {
    this.setData({
      showTopTips: e.detail.value.trim() == "",
      defendant: e.detail.value,
    })
  },
  /**
   * 投诉人--赋值到js变量中
   */
  justInTimeSyAccuser: function (e) {
    this.setData({
      Accuser: e.detail.value,
      showTopTips: e.detail.value.trim() == "",
    })
  },

  /**
   * 标题--赋值到js变量中
   */
  justInTimeSyTitle: function (e) {
    this.setData({
      title: e.detail.value,
      showTopTips: e.detail.value.trim() == "",
    })
  },
  /**
  * 提交未草稿的话……。
  */
  onCache: function () {
    var values = {
      Verid: this.data.verid,
      title: this.data.title,
      Accuser: this.data.Accuser,
      defendant: this.data.defendant,
      claim: this.data.claim,
      statement: this.data.statement,
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