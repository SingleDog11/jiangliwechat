/**
 * 本用户的个人信息页面-- 非修改页面
 */
const app = getApp();
var config = require('../../config');
// 获取qcloud SDK
var qcloud = require('../../vendor/qcloud-weapp-client-sdk/index');

Page({
  data: {
    user: {},
    caselist: [],
    windowWidth: app.systemInfo.windowWidth,
    windowHeight: app.systemInfo.windowHeight,
  },
  onReady() {
    const self = this;
    wx.setNavigationBarTitle({
      title: self.data.user.name,
    });
  },
  onShow() {
    this.requireCaseList();
  },
  onLoad(options) {

  },
  /**
   * 请求该用户所创建的案件列表
   */
  requireCaseList: function () {
    const id = app.globalData.userid;
    const data = { userId: id };
    const self = this;
    qcloud.request({
      login: app.globalData.hasLogin,
      url: config.requestGetUserById,
      data,
      success: (res) => {
        console.log(res);
        let rs = res.data;
        let caselist = [];

        /**
         * 数据规格化处理
         */
        let gender = "Ta";
        if (rs.gender === '0') {
          gender = "她";
        } else if (rs.gedner === '1') {
          gender = "他";
        }
        rs.gender = gender;
        rs.description = res.description == null ? "您实在是太懒了" : res.description;

        rs.caselist.map((item) => {
          item.hiddenUser = true;
          caselist.push({ basic: item });
        });
        // console.log(caselist);
        let user = rs;
        self.setData({ user, caselist })
      },
    });
  },
  /**
   * 点击安吉
   * @param {*} e 
   */
  onViewTap(e) {
    const ds = e.currentTarget.dataset;
    const t = ds['type'] === 'case' ? `caseInfo/caseInfo?id=${ds.id}` : 'personinfo/user'
    wx.navigateTo({
      url: `../${t}`,
    });
  },
  /**
   * 单击全部案件
   * @param {*} e 
   */
  viewCaseList(e) {
    wx.navigateTo({
      url: "../tpcase/tpcase",
    })
  }
});