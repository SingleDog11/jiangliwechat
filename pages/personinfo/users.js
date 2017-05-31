// 引入sdk
var qcloud = require('../../vendor/qcloud-weapp-client-sdk/index');
const app = getApp();
var config = require('../../config');
const util = require('../../utils/util.js');

const lengthStr = util.lengthStr;

Page({
  data: {
    q: '',
    suggest: false,
    limit: 5,

    hasContent: false,
    // 案件信息
    users: [],

    windowWidth: app.systemInfo.windowWidth,
    windowHeight: app.systemInfo.windowHeight,
    pixelRatio: app.systemInfo.pixelRatio,
  },

  /**
   * 搜索关键词的用户
   */
  getusersfromnet: function () {
    const that = this;

    if (that.data.q.trim == "") {
      return;
    }
    wx.showNavigationBarLoading();
    qcloud.request({
      login: true,
      url: config.requestGetUsersByNickname,
      data: {
        q: that.data.q,            // 关键词
      },
      success: function (res) {
        console.log(res)
        wx.hideNavigationBarLoading();
        var searchList = [];
        that.data.hasContent == false ? searchList = res.data : searchList = that.data.users.concat(res.data);
        that.setData({
          users: searchList,
          hasContent: searchList.length != 0,
        })
      },
      fail: function () {
        wx.hideNavigationBarLoading();
        app.showModel('error', '请检查网络');
      }
    });
  },
  /**
   * 实时搜索
   * @param {*} e 
   */
  bindKeyInput(e) {
    const self = this;
    const q = e.detail.value.replace(/'/g, '').trim();
    const data = { q };
    this.setData({ q });
    if (lengthStr(q) > 4) {
      this.setData({ suggest: true });
      qcloud.request({
        login: true,
        url: config.requestuserOfSuggest,
        data: {
          q: self.data.q,            // 关键词 
        },
        success: function (res) {
          let users = res.data;
          self.setData({ users });
        },
      })
    }
  },
  /**
   * 搜索按钮，显示搜索结果
   * @param {*} e 
   */
  onSearch(e) {
    const self = this;
    self.setData({ suggest: false });
    self.loadData(true);
  },

  /**
   * 加载数据
   * @param {*是否刷新} refresh 
   */
  loadData(refresh) {
    if (refresh) {
      this.setData({
        users: []
      });
    }
    this.getusersfromnet();
  },
  onViewTap(e) {
    const ds = e.currentTarget.dataset;
    /**
     * 设置用户缓存
     */
    qcloud.setUserCache({
      id: ds.id,
      nickname: ds.name,
    })
    wx.navigateBack();
  },
});