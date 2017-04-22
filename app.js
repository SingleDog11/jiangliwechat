
// 引入配置
var config = require('./config');

// 引入腾讯云的sdk
var qcloud = require('./vendor/qcloud-weapp-client-sdk/index');

App({
  onLaunch: function () {
    //调用API从本地缓存中获取数据
    const that = this;
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs);
    wx.getSystemInfo({
      success: function (res) {
        that.systemInfo = res;
      }
    })

    // 设置 登陆 路径
    console.log(config.loginUrl);
    qcloud.setLoginUrl(config.loginUrl);
  },
  onShow: function () {
    console.log("App Show");
  },
  onHide: function () {
    console.log("APP Hide");
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


  globalData: {
    hasLogin: false,
    openid: null,
    cc: null,
    userInfo: null,
    caseslist: {
      list: [],
      getState1: function () {
        return this.list.filter(function (item) {
          // console.log(item);
          return (item.State == '1');
        })
      },
      getState2: function () {
        return this.list.filter(function (item) {
          return (item.State == '2');
        })
      },
      getCaseById: function (id) {
        return this.list.filter(function (item) {
          return (item.Ver_id == id)
        })
      },
    },

  },

  getUserInfo: function (cb) {
    var that = this
    if (this.globalData.openid) {
      typeof cb == "function" && cb(this.globalData.openid)
    }
    else if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    }
    else {
      //调用登录接口
      wx.login({
        success: function (res) {
          wx.getUserInfo({
            success: function (res) {
              that.globalData.userInfo = res.userInfo
              // 输出个人信息

              /*         console.log('nickname:' + res.userInfo.nickName)
                       console.log('avatarUrl:' + res.userInfo.avatarUrl)
                       console.log('gender:' + res.userInfo.gender)
                       console.log('province:' + res.userInfo.province)
                       console.log('city:' + res.userInfo.city)
                       console.log('country:' + res.userInfo.country)
         */
              typeof cb == "function" && cb(that.globalData.userInfo)
            }
          })
        }
      })
    }
  },

})