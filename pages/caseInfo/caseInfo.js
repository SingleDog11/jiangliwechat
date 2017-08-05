var config = require('../../config');
var qcloud = require('../../vendor/qcloud-weapp-client-sdk/index');
const app = getApp();
const constants = require('../../utils/constants');
Page({
  data: {
    caseInfoId: 0,
    isowner: false,
    width: app.systemInfo.windowWidth,
    height: app.systemInfo.windowHeight,

    seeAllInfo: false,
    btnMsg: '查看全部',
    caseInfo: {},
    isrespondent: false,

    iscomplaint: false,
  },
  onLoad: function (options) {
    var caseInfoId = options.id;
    this.setData({
      caseInfoId: caseInfoId,
    })
  },
  /**
   * 在页面显示的时候请求案件详细信息
   */
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
          isowner: res.data.user.id == app.globalData.userid,
          isrespondent: res.data.respondent.id == app.globalData.userid,
          iscomplaint: res.data.basic.state == constants.COMPLAIN,
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
  isNew: function (id) {
    var involves = this.data.caseInfo.involves;
    for (var i = 0; i < involves.length; i++) {
      if (involves[i].user.id == id) {
        //表示修改
        return false;
      }
    }
    return true;
  },
  /**
   * 进入裁判界面 
   */
  gojudge: function (event) {
    //首先判断是进行修改还是新增。直接再评论去查看有没有跟本账号一样
    var userid = app.globalData.userid;
    var isnew = this.isNew(userid);
    // console.log(isnew);
    var urltemp = "";
    urltemp = '../participatecase/participatecase?caseinfoid=' + this.data.caseInfo.basic.id +
      '&isnew=' + isnew;
    wx.navigateTo({
      url: urltemp,
    })
  },
  /**
   * 查看个人满意度曲线
   */
  seeChart: function (e) {
    // console.log(this.data.caseInfo);

    var cid = this.data.caseInfo.basic.id ;
    var pid = e.currentTarget.dataset.id;
    var amount = this.data.caseInfo.orginalpay;
    // 传递参数,此时应该传递一个最满意的点。
    wx.navigateTo({
      url: './chart/chart?cid=' + cid + '&pid=' + pid +
      '&amount=' + amount,
    })
  },
  /**
   * 处理点击案件详细申诉情况
   */
  openDetail: function (e) {
    // console.log(e);
    var title = "";
    var occupy = "";
    var avatar = "";
    var author = "";
    var imageUrl = "";
    if (e.currentTarget.dataset.id == 1) {
      // console.log(this.data.caseInfo)
      //案件详情 
      occupy = this.data.caseInfo.basic.description;
      title = this.data.caseInfo.basic.title;
      author = this.data.caseInfo.user.nickname;
      avatar = this.data.caseInfo.user.avatar_url;
      imageUrl = this.data.caseInfo.imageSrc;
    }
    else if (e.currentTarget.dataset.id == 2) {
      occupy = this.data.caseInfo.respondentturnone;
      title = "申诉阶段：第一轮[应诉人]申诉";
      author = this.data.caseInfo.respondent.nickname;
      avatar = this.data.caseInfo.respondent.avatar_url;

    } else if (e.currentTarget.dataset.id == 3) {
      occupy = this.data.caseInfo.userturnone;
      title = "申诉阶段：第一轮[投诉人]申诉";
      author = this.data.caseInfo.user.nickname;
      avatar = this.data.caseInfo.user.avatar_url;
    } else if (e.currentTarget.dataset.id == 4) {
      occupy = this.data.caseInfo.respondentturntwo;
      title = "申诉阶段：第二轮[应诉人]申诉";
      author = this.data.caseInfo.respondent.nickname;
      avatar = this.data.caseInfo.respondent.avatar_url;

    } else {
      occupy = this.data.caseInfo.userturntwo;
      title = "申诉阶段：第二轮[投诉人]申诉";
      author = this.data.caseInfo.user.nickname;
      avatar = this.data.caseInfo.user.avatar_url;
    }

    // 存缓存
    qcloud.setDetailCache({
      author: author,
      dateTime: this.data.caseInfo.basic.start_at,
      content: occupy,
      avatar: avatar,
      title: title,
      imageUrl: imageUrl
    })
    wx.navigateTo({
      url: "../detail/descdetail",
    })
  },
  /**
   * 修改本案件的信息
   */
  gochange: function (e) {
    qcloud.setCaseCache({
      id: this.data.caseInfo.basic.id,
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
    var cid = this.data.caseInfo.basic.id;
    var amount = this.data.caseInfo.orginalpay;
    // 传递参数,此时应该传递一个最满意的点。
    wx.navigateTo({
      url: './chart/chart?cid=' + cid +
      '&amount=' + amount + '&group=true',
    })
  },
  /**
   * 查看评论列表
   */
  commentView: function (e) {
    // console.log(e)
    wx.navigateTo({
      url: './comment/comment?cid=' + this.data.caseInfoId,
    })
  },
  /**
   * 申诉
   */
  complaint: function (e) {
    wx.navigateTo({
      url: '../detail/detail?id=' + this.data.caseInfoId,
    })
  },
})