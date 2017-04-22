// 引入配置
var config = require('../../config');

// 引入腾讯云的sdk
var qcloud = require('../../vendor/qcloud-weapp-client-sdk/index');

const app = getApp();

Page({
  data: {
    width: app.systemInfo.windowWidth,
    height: app.systemInfo.windowHeight,

    seeAllInfo: false,
    btnMsg: '查看全部',
    caseInfo: {},
  },
  onLoad: function (options) {
    var caseInfoId = options.caseinfoid;
    // 从全局的案件列表中获取到该案件
    var caseinfo = app.globalData.caseslist.getCaseById(caseInfoId)[0];
    this.setData({
      caseInfo: caseinfo,
    })
  },
  onShow: function () {
    var that = this;
    var comments = [];

    var casetemp = that.data.caseInfo;
    // 请求该案件下的裁决相关数据
    qcloud.request({
      login:app.globalData.hasLogin,
      url: config.requestCommentsByCaseId,
      data: { "id": casetemp.Ver_id },
      // 请求成功后返回的数据
      success: function (res) {
        console.log(res);
        comments = res.data == "null" ? [] : res.data
        casetemp.comments = comments;

        that.setData({
          caseInfo: casetemp,
        })
      },
      fail: function () {
      }
    });
  },
  //查看该案件的全部信息
  caseinfomore(event) {
    const that = this;
    let msg = '查看全部';
    var seeAllInfo = that.data.seeAllInfo;
    if (seeAllInfo) {
      msg = '查看全部';
    } else {
      msg = '收起';
    }
    that.setData({
      btnMsg: msg,
      seeAllInfo: !seeAllInfo,
    })
  },
  /**
   * 判断是新增还是修改
   */
  isNew: function (name) {
    var comments = this.data.caseInfo.comments; 
    for (var i = 0; i < comments.length; i++) { 
      if (comments[i].openid == name) {
        //表示修改
        return false;
      }
    }
    return true;
  },
  /**
   * 进入裁判界面
   * @param event 
   */
  gojudge: function (event) {
    //首先判断是进行修改还是新增。直接再评论去查看有没有跟本账号一样
    var openidformapp = app.globalData.openid;
    var isnew = this.isNew(openidformapp);
    // console.log(isnew);
    var urltemp = "";
    urltemp = '../participatecase/participatecase?caseinfoid=' + this.data.caseInfo.Ver_id+
    '&isnew=' + isnew ;
    wx.navigateTo({
      url: urltemp,
      success: function (res) {
        // success
      },
      fail: function (res) {
        // fail
      },
      complete: function (res) {
        // complete
      }
    })
  },
  // 查看满意度曲线
  seeChart: function (e) {
    // console.log(e);
    var casetemp = e.currentTarget.dataset.case;
    // 传递参数,此时应该传递一个最满意的点。
    wx.navigateTo({
      url: './chart/chart?perid=' + casetemp.Par_id + '&partid=' + casetemp.Participator_id +
      '&amount=' + casetemp.Amountpaid,
      success: function (res) {
        // success
      },
      fail: function () {
        // fail
      },
      complete: function () {
        // complete
      }
    })
  }
})