// pages/detail/descdetail.js 
// 引入sdk
var qcloud = require('../../vendor/qcloud-weapp-client-sdk/index');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    content: "",
    title: "",
    avartar: "",
    dateTime: "",
    author: "",
    imageUrl: "",
    hasimage: false,
 
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var detail = qcloud.getDetailCache();
    const that = this;
    var occupy = "";
    if (detail) {
      this.setData({
        content: detail.content,
        author: detail.author,
        avatar: detail.avatar,
        dateTime: detail.dateTime,
        title: detail.title,
        imageUrl: that.transUrl(detail.imageUrl),
        hasimage: detail.imageUrl != null && detail.imageUrl != undefined && detail.imageUrl != "",
      })
      console.log(detail);
      qcloud.clearDetailCache();
    }
  },
  transUrl: function (preUrl) {
    if (preUrl)
      return preUrl.replace(new RegExp(/(\\)/g), "/");
    return undefined;
  },
  /**
   * 预览图片
   */
  previewImage: function (e) {
    console.log(e);
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: [this.data.imageUrl] // 需要预览的图片http链接列表
    })
  },
})