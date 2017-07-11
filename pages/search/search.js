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
    status: 5,
    currentPage: 1,// 当前的页码
    searchLoading: false,
    searchLoadingComplete: false,
    limit: 5,

    hasContent: false,
    // 案件信息
    cases: [],

    windowWidth: app.systemInfo.windowWidth,
    windowHeight: app.systemInfo.windowHeight,
    pixelRatio: app.systemInfo.pixelRatio,
  },
  /**
    * 请求获取案件
    */
  onShow: function () {
    this.getCasesfromnet();
  },
  /**
   * 
   * @param {*事件} e  
   */
  loadMore(e) {
    let that = this;

    if (that.data.searchLoading && !that.data.searchLoadingComplete) {
      // console.log(that.data.currentPage);
      that.setData({
        searchLoading: false,
      })
      that.getCasesfromnet();
    }
  },

  /**
   * 搜索关键词的案件
   */
  getCasesfromnet: function () {
    const that = this;

    wx.showNavigationBarLoading();
    qcloud.request({
      login: true,
      url: config.requestCaseByKeyWord,
      data: {
        limit: that.data.limit, // 请求的数据
        q: that.data.q,            // 关键词
        page: that.data.currentPage, // 请求的页码
        state: that.data.status,// 1 请求正在裁决的案件
      },
      success: function (res) {
        wx.hideNavigationBarLoading();
        console.log(res);
        // console.log(res.data.length);
        if (res.data.length == 0) {
          // 如果返回的是0，则
          that.setData({
            searchLoadingComplete: true,
            searchLoading: false,
          })
          return;
        }
        else {
          var searchList = [];
          that.data.hasContent == false ? searchList = res.data : searchList = that.data.cases.concat(res.data);
          var isend = res.data.length < 20;
          that.setData({
            cases: searchList,
            searchLoading: !isend,
            searchLoadingComplete: isend,
            hasContent: searchList.length != 0,
            currentPage: that.data.currentPage + 1, 
          })
        }
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
        url: config.requestCaseOfSuggest,
        data: {
          q: self.data.q,            // 关键词
          state: self.data.status,
        },
        success: function (res) {
          // console.log(res);
          let cases = res.data;
          self.setData({ cases });
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
   * 切换tab
   * @param {*} e 
   */
  onChangeTab(e) {
    const self = this;
    const status = e.currentTarget.dataset.status;
    self.setData({ status, suggest: false });
    self.loadData(true);
  },
  /**
   * 加载数据
   * @param {*是否刷新} refresh 
   */
  loadData(refresh) {
    if (refresh) {
      this.setData({
        currentPage: 1, cases: [], searchLoading: true, searchLoadingComplete: false
      });
    }
    this.loadMore(null);
  },
  onViewTap(e) {
    console.log(e);
    const ds = e.currentTarget.dataset;
    const t = ds['type'] === 'case' ? 'caseInfo/caseInfo' : 'personinfo/user'
    wx.navigateTo({
      url: `../${t}?id=${ds.id}`,
    });
  },
});