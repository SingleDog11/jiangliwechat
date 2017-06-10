// pages/participatecase/participatecase.js
// 参与裁决页面
// 传递参数为，参与裁决的用户，参与裁决要生成一个表单，并提交给服务器
// 传递参数，相应的案件
var qcloud = require('../../vendor/qcloud-weapp-client-sdk/index');

// 引入配置
var config = require('../../config');

//获取应用实例
var app = getApp();


Page({
  data: {
    // 图片宽度
    imageWidth: 0,

    // 显示第2个问题。
    isShowTwo: true,
    // 显示错误
    showTopTips: false,
    // 错误原因
    errormsg: "数据不规范",
    // 理由字数
    wordnum: 0,

    originalpay: 0,
    // 案件的详细信息
    caseinfo: {},

    // 赋值类型
    dotType: 2,
    // 赔偿类型
    payType: 1,

    // 合理赔偿
    rationalpay: 0,
    // 满意度
    satisfication: 0,
    // 双倍满意度
    doublesatisfication: 0,
    //案件原告要求赔偿
    originalpay: 0,
    // 理由
    reason: "",
    // 请求的url
    url: config.requestCreateInvolve,
    radioItems: [
      { name: '单点赋值', value: '1' },
      { name: '三点赋值', value: '2', checked: true }
    ],
    radioPayItems: [
      { name: '必须赔偿', value: '1', checked: true, type: "赔偿" },
      { name: '互不赔偿', value: '2' },
    ],

  },
  onLoad: function (options) {
    const that = this;
    var isnew = options.isnew;
    // console.log(isnew);
    if (isnew == 'false') {
      // 这是修改界面，提示用户.
      app.showModel('warn', '您已经裁决过，通过此界面您可以更新您的裁决。');
      wx.setNavigationBarTitle({ title: '更新裁决', })
      this.setData({ url: config.requestModifiedInvolve })
    }
    else {
    }
    // 页面初始化 options 带来本案件的id 
    qcloud.request({
      login: app.globalData.hasLogin,
      url: config.requestCaseById,
      data: { "caseid": options.caseinfoid },
      success: function (res) {
        // 得到了案件的发起者,修改标题栏。
        var casetemp = res.data;
        console.log(casetemp);
        wx.setNavigationBarTitle({
          title: "针对" + casetemp.user.nickname + "的案件进行裁决",
        });
        that.setData({
          caseinfo: casetemp,
          originalpay: casetemp.originalpay,
        })
      }
    })
  },

  // 输入满意金额结束后触发事件
  // 修改双倍金额。
  bindnumberinput: function (e) {
    // console.log("赔偿金额："+e.detail.value);
    if (e.detail.value == 0) {
      //如果输入的金额为0，
      this.radioPayChange({
        detail: {
          value: 2,
        }
      })
    }
    else {
      this.setData({
        payType: 1,
        isShowTwo: true,
        rationalpay: Number(e.detail.value),
      })
    }
  },

  // 单点赋值 or 三点赋值
  radioChange: function (e) {
    // console.log('radio发生change事件，携带value值为：', e.detail.value);
    var radioItems = this.data.radioItems;
    for (var i = 0, len = radioItems.length; i < len; ++i) {
      radioItems[i].checked = radioItems[i].value == e.detail.value;
    }
    this.setData({
      radioItems: radioItems,
      dotType: e.detail.value,
    });
  },

  // 必须赔偿 or 不必赔偿 or 可以奖励
  radioPayChange: function (e) {
    // console.log('radioPay发生change事件，携带value值为：', e.detail.value);
    var payType = e.detail.value;
    var radioPayItems = this.data.radioPayItems;
    for (var i = 0, len = radioPayItems.length; i < len; ++i) {
      radioPayItems[i].checked = radioPayItems[i].value == e.detail.value;
    }
    this.setData({
      radioPayItems: radioPayItems,
      payType: payType,
      satisfication: 0,
    });
  },
  // 第一个满意度
  slider2change(e) {
    var realvalue = (e.detail.value / 10 - 10).toFixed(1);
    this.setData({
      satisfication: realvalue
    });
    // console.log('slider发生change事件，携带值为', (e.detail.value / 10 - 10).toFixed(1))
  },
  // 第二个满意度
  slider3change(e) {
    var realvalue = (e.detail.value / 10 - 10).toFixed(1);
    this.setData({
      doublesatisfication: realvalue
    });
    // console.log('slider发生change事件，携带值为', (e.detail.value / 10 - 10).toFixed(1))
  },

  // 字符变化
  justInTimeCount: function (e) {
    // console.log(e);
    var count = e.detail.value.length;
    this.setData({
      wordnum: count,
      reason: e.detail.value,
    })
  },
  // 点击提交
  postinfo: function () {
    if (this.data.showTopTips) {
      app.showModel("ERROR", "请遵照规范");
    }
    console.log(this.data.reason);
    const that = this;
    app.showBusy("正在提交...");
    qcloud.request({
      login: app.globalData.hasLogin,
      url: that.data.url,
      method:"post",
      data: {
        userid: app.globalData.userid,
        caseid: that.data.caseinfo.basic.id,
        modedot: that.data.dotType,// 赋值方式 2，代表三点赋值
        modepay: that.data.payType, // 惩罚方式
        mostSatisfied: that.data.rationalpay,
        nonSatisfied: that.data.satisfication,
        doublePay: that.data.doublesatisfication,
        assignmentExplain: that.data.reason,
      },
      success: function (res) {
        // console.log(res); 
        app.showSuccess("提交成功");
        wx.navigateBack();
      },
      fail: function (e) {
        app.showModel("提交失败", e);
      }
    })
  },
  /**
   * 图片加载的时候获取屏幕宽度
   */
  imageLoad: function () {
    this.setData({
      imageWidth: wx.getSystemInfoSync().windowWidth,
    })
    console.log(this.data.imageWidth);
  },
})