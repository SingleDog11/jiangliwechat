// pages/detail/detail.js
// 引入配置
var config = require('../../config');

// 引入腾讯云的sdk
var qcloud = require('../../vendor/qcloud-weapp-client-sdk/index');

const app = getApp();

Page({
  data:{
    // 申诉内容的人
    speaker : "",
    // 申诉的时间
    time : "",
    // 申诉的第几轮
    turn : "",

    // 内容
    content : "",  
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    // 取出缓存中的详细信息
    var detail = qcloud.getDetailCache();
    if(detail)
    {
      this.setData({
        speaker : detail.speaker ,
        time : detail.time,
        turn : detail.turn ,
        content : detail.content ,
      })
    }
  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
    qcloud.clearDetailCache();
  }
})