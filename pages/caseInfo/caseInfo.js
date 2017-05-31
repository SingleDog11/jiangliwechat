// 引入配置
var config = require('../../config');

// 引入sdk
var qcloud = require('../../vendor/qcloud-weapp-client-sdk/index');

const app = getApp();

Page({
  data: {
    caseInfoId: 0,
    isowner: false,
    width: app.systemInfo.windowWidth,
    height: app.systemInfo.windowHeight,

    seeAllInfo: false,
    btnMsg: '查看全部',
    caseInfo: {},
  },
  onLoad: function (options) {
    // 判断是否为主人权限
    var isownertemp = options.isowner;
    var caseInfoId = options.id;
    this.setData({
      isowner: isownertemp,
      caseInfoId: caseInfoId,
    })
  },
  onShow: function () {
    var that = this;

    qcloud.request({
      login: app.globalData.hasLogin,
      url: config.requestCaseById,
      data: { "caseId": that.data.caseInfoId },
      success: function (res) {
        // console.log(res);
        that.setData({
          caseInfo: res.data,
        }) 
      }
    })
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
    urltemp = '../participatecase/participatecase?caseinfoid=' + this.data.caseInfo.Ver_id +
      '&isnew=' + isnew;
    wx.navigateTo({
      url: urltemp,
    })
  },
  /**
   * 查看满意度曲线
   */
  seeChart: function (e) {
    // console.log(e);
    var casetemp = e.currentTarget.dataset.case;
    // 传递参数,此时应该传递一个最满意的点。
    wx.navigateTo({
      url: './chart/chart?perid=' + casetemp.Par_id + '&partid=' + casetemp.Participator_id +
      '&amount=' + casetemp.Amountpaid,
    })
  },
  /**
   * 处理点击案件详细申诉情况
   */
  openDetail: function (e) {
    // console.log(e);
    // 存缓存
    qcloud.setDetailCache({
      speaker: this.data.caseInfo.Accuser_client,
      time: this.data.caseInfo.data,
      content: this.data.caseInfo.Statement,
      turn: 1,
    })
    wx.navigateTo({
      url: "../detail/detail",
    })
  },
  /**
   * 修改本案件的信息
   */
  gochange: function (e) {
    qcloud.setCaseCache({
      verid: this.data.caseInfo.Ver_id,
      title: this.data.caseInfo.Complain_title,
      Accuser: this.data.caseInfo.Accuser_client,
      defendant: this.data.caseInfo.Defendant_client,
      claim: this.data.caseInfo.Claim,
      statement: this.data.caseInfo.Statement
    });
    wx.navigateTo({
      url: '../newcase/newcase?draft=true&hasfabu=true',
    })
  },
  /**
   * 查看群体曲线
   */
  groupchart: function (e) {
    // console.log(e);
    var casetemp = e.currentTarget.dataset.case;
    // 传递参数,此时应该传递一个最满意的点。
    wx.navigateTo({
      url: './chart/chart?perid=' + casetemp.Par_id + '&partid=' + casetemp.Participator_id +
      '&amount=' + casetemp.Amountpaid + '&group=true',
    })
  }
})