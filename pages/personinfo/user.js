/**
 * 用户的简单描述页面-- 非修改页面
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
  onLoad(options) {
    const { id } = options;
    const data = { userId: id };
    const self = this;
    app.showBusy("正在加载...");
    qcloud.request({
      login: app.globalData.hasLogin,
      url: config.requestGetUserById,
      data,
      success: (res) => {
        // console.log(res);
        let rs = res.data;
        let caselist = [], user = [];

        let gender = "Ta";
        if (rs.gender === '0') {
          gender = "她";
        } else if (rs.gedner === '1') {
          gender = "他";
        }

        rs.gender = gender;
        rs.headline = res.headline == null ? "这个人太懒了…什么也没留下" : res.headline;
        rs.description = res.description == null ? "这个人太懒了…什么也没留下" : res.description;

        console.log(rs.caselist)
        rs.caselist.map((item) => {
          item.pic_url = item.cover;
          item.hiddenUser = true;
          caselist.push({ basic: item });
        });
        user = rs;
        self.setData({ user, caselist })
        app.showSuccess("请求成功");
      },
    });
  },
  onViewTap(e) {
    const ds = e.currentTarget.dataset;
    const t = ds['type'] === 'case' ? `caseInfo/caseInfo?id=${ds.id}` : 'personinfo/user'
    wx.navigateTo({
      url: `../${t}`,
    });
  },
});