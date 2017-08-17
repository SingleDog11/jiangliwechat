
// 引入配置
var config = require('./config');
// 引入常量
var Constants = require('./utils/constants');
// 引入腾讯云的sdk
var qcloud = require('./vendor/qcloud-weapp-client-sdk/index');

App({
  onLaunch: function () {
    //调用API从本地缓存中获取数据
    const that = this;
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs);
    /**
     * 获取系统的信息
     */
    wx.getSystemInfo({
      success: function (res) {
        that.systemInfo = res;
      }
    })
    // 设置 登陆 路径
    // console.log(config.loginUrl);
    qcloud.setLoginUrl(config.loginUrl);
    // 获取userinfo
    // that.getUserInfo(function (userInfo) {
    //   that.Login(userInfo);
    // }); 

  },

  /**
   * 全局变量
   */
  globalData: {
    hasLogin: false,
    openid: null,
    userid: null,
    cc: null,
    userInfo: null,
  },

  /**
   * 获取用户的个人信息
   */
  getUserInfo: function (cb) {
    var that = this
    if (this.globalData.openid) {
      typeof cb == "function" && cb(this.globalData.openid)
    }
    else if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    }
    else {
      that.showBusy("正在请求数据...");
      //调用登录接口
      wx.login({
        success: function (res) {
          wx.getUserInfo({
            success: function (res) {
              that.globalData.userInfo = res.userInfo
              typeof cb == "function" && cb(that.globalData.userInfo)
            }
          })
        }
      })
    }
  },
  /**
   * 拉取openid
   * 拉取用户id
   */
  Login: function (ui,cb) {
    const that = this;

    qcloud.login({
      data: ui,
      method: "post",
      success(result) {
        console.log(result)
        if (result && result.openid != null) {
          wx.hideToast();
          // 修改全局变量hasLogin
          that.globalData.hasLogin = true;
          that.globalData.openid = result.openid;
          that.globalData.userid = result.userid;
          typeof cb == "function" && cb();
        }
        else {
          wx.hideToast();
          console.log("server fail");
        }
      },
      fail(error) {
        wx.hideToast();
        console.log("login fail");
      }
    });
  },

  // 一些提示信息
  // 显示繁忙提示
  showBusy: text => wx.showToast({
    title: text,
    icon: 'loading',
    duration: 10000
  }),

  // 显示成功提示
  showSuccess: text => wx.showToast({
    title: text,
    icon: 'success'
  }),

  // 显示失败提示
  showModel: (title, content) => {
    wx.hideToast();

    wx.showModal({
      title,
      content: JSON.stringify(content),
      showCancel: false
    });
  },


})