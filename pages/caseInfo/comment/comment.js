// pages/caseInfo/comment/comment.js
var config = require('../../../config');
// 获取qcloud SDK
var qcloud = require('../../../vendor/qcloud-weapp-client-sdk/index');
// 获取app
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    hasContent: false,
    commentList: [],

    /**
     * 当前的案件id
     */
    cid: null,
    currentPage: 1,// 当前的页码
    searchLoading: false,
    searchLoadingComplete: false,
    /**
     * 发送按钮的圈圈
     */
    commentLoading: false,
    isdisabled: false,
    /**
     * 标记是否为回复
     */
    isToResponse: false,

    pid: null,
    plaContent: null,
    resopneName: null,
    /**
     * 评论区内容
     */
    publishContent:"",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({ cid: options.cid });
    this.getcommentListfromnet();
  },
  /**
    * 从服务器请求案件的全部信息
    */
  getcommentListfromnet: function () {
    const that = this;

    wx.showNavigationBarLoading();
    qcloud.request({
      login: true,
      url: config.requestGetCommentsByCaseid,
      data: {
        cid: that.data.cid,
        page: that.data.currentPage, // 请求的页码
      },
      success: function (res) {
        wx.hideNavigationBarLoading();
        console.log(res);
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
          that.data.hasContent == false ? searchList = res.data : searchList = that.data.commentList.concat(res.data);
          that.setData({
            commentList: searchList,
            hasContent: searchList.length != 0,
            searchLoading: true,
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
   * 加载更多
   */
  loadmore: function () {
    let that = this;
    if (that.data.searchLoading && !that.data.searchLoadingComplete) {
      // console.log(that.data.currentPage);
      that.setData({
        searchLoading: false,
        currentPage: that.data.currentPage + 1,
      })
      that.getcommentListfromnet();
    }
  },
  /**
   * 对某人进行回复
   */
  toResponse: function (event) {//去回复
    var that = this;
    var commentId = event.target.dataset.id;
    var userId = event.target.dataset.uid;
    var name = event.target.dataset.name;
    if (!name) {
      name = "";
    }
    if (userId == app.globalData.userid) {
      app.showModel("Error", "不能对自己的评论进行回复");
    }
    else {
      var toggleResponse = that.data.isToResponse == "true" ? false : true;

      that.setData({
        pid: commentId,
        isToResponse: toggleResponse,
        plaContent: "回复" + name + ":",
        resopneName: name
      })
    }
  },
  /**
   * 隐藏对某人回复模式
   */
  hiddenResponse: function () {
    this.setData({
      isToResponse: false
    })
  },
  /**
   * 发布评论
   */
  publishComment: function (e) {
    const that = this;
    if (e.detail.value.commContent.trim() == "") {
      app.showModel("Error", "评论不能为空");
    }
    else {
      that.setData({
        isdisabled: true,
        commentLoading: true
      })
      var comment = {
        caseid: that.data.cid,
        uid: app.globalData.userid,
        username: app.globalData.userInfo.nickName,
        content: e.detail.value.commContent,
        pid: that.data.pid,
        pusername: that.data.resopneName
      };
      /**
       * 发送网络请求
       */
      qcloud.request({
        login: true,
        method: "post",
        url: config.requestCreateComment,
        data: comment,
        success(res) {
          that.setData({ commentLoading: false, isdisabled: false })

          if (res.statusCode == 200) {
            // 创建成功
            console.log(res);
            var searchList = [];
            that.data.hasContent == false ? searchList = res.data : searchList = that.data.commentList.concat(res.data);
            that.setData({
              commentList: searchList,
              hasContent: searchList.length != 0,
              publishContent: "",
            })
          }
        }
      })
    }
  },
  bindKeyInput: function (e) {
    this.setData({
      publishContent: e.detail.value
    })
  },

})