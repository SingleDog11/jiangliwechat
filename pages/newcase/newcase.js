// pages/personinfo/person.js
// 获取腾讯云的sdk，使用sdk的接口进行沟通服务器
var qcloud = require('../../vendor/qcloud-weapp-client-sdk/index');

// 引入配置
var config = require('../../config');

//获取应用实例
var app = getApp();

Page({
  data: {
    // 判断是否为已发布案件
    isfabu: false,
    // 判断是否为草稿
    isDraft: false,
    showTopTips: false,
    errormsg: "数据不规范",
    wordnum: 0,

    files: [],
    hasCache: false,
    // 案件数据

    id: "",
    title: "",
    respondentid: '',
    respondent: "",
    orginalpay: "",
    description: "",
    accuser: "",
    imageSrc: null,
  },
  onLoad: function (options) {
    // 判断是否为草稿
    // console.log(options)
    this.setData({
      isfabu: options.hasfabu,
      isDraft: options.draft,
    });
    /**
     * 这里是将缓存打印出来，也可以当作参数来使用
     */
    var casecache = qcloud.getCaseCache();
    const that = this;
    if (options.draft == "true" && casecache) {
      this.setData({
        id: casecache.id,
      });
      /**
       * 请求草稿信息-- 从网络请求
       */
      qcloud.request({
        login: app.globalData.hasLogin,
        url: config.requestCaseById,
        data: { "caseId": that.data.id },
        success: function (res) {
          // console.log(res);
          var caseinfo = res.data;
          that.setData({
            title: caseinfo.basic.title,
            respondentid: caseinfo.respondent.id,
            respondent: caseinfo.respondent.nickname,
            orginalpay: caseinfo.orginalpay,
            description: caseinfo.basic.description,
            accuser: caseinfo.user.nickname,
            accuserid: caseinfo.user.id,
            imageSrc: caseinfo.imageSrc,
          });
        }
      })

    }
    else {
      // console.log(app.globalData.userInfo);
      this.setData({
        accuser: app.globalData.userInfo.nickName,
      })
    }
  },

  /**
   * 重新设置描述
   */
  onReady: function (e) {
    this.setData({
      description: this.data.description,
    })
  },
  /**
   * 当从用户选择页面返回本页面
   */
  onShow: function (e) {
    var usercache = qcloud.getUserCache();
    // console.log(usercache);
    if (usercache) {
      this.setData({
        respondentid: usercache.id,
        respondent: usercache.nickname,
      });
      qcloud.clearUserCache();
    }
  },
  /**
   * 发布案件信息
   */
  formSubmit: function (e) {
    const that = this;
    var value = that.data;
    var result = value.title.trim() != "" &&
      value.respondent.trim() != "" &&
      value.description.trim() != "" &&
      value.accuser.trim() != "" &&
      parseFloat(value.orginalpay) != 0;

    if (this.data.showTopTips || !result) {
      app.showModel("数据有误", "请检查数据是否未填或金额输入不能为0");
    }
    else {
      var transdata = {
        issuer: app.globalData.userInfo.nickname,
        title: value.title,
        respondent: value.respondent,
        respondentid: value.respondentid,
        originalpay: value.orginalpay,
        description: value.description,
        accuser: value.accuser,
        state: 0,
        accuserid: app.globalData.userid,
      }
      // console.log(that.data.imageSrc)
      app.showBusy("正在提交...");
      if (!that.data.imageSrc) {
        that.uploadCase(transdata, e.url);
      }
      else {
        that.uploadtest(transdata, e.url);
      }
    }
  },
  uploadCase(formdata, url) {
    let that = this;
    qcloud.request({
      login: true,
      url: url,
      method: "post",
      data: formdata,
      success: function (res) {
        // console.log(res);
        if (res.statusCode == 200) {
          app.showSuccess("数据已经提交");
          qcloud.clearCaseCache();
          wx.navigateBack();
        }
        else {
          app.showModel('提交失败！', "服务器出问题了");
        }
      },
      fail: function (error) {
        app.showModel("提交失败！", error);
      }
    })
  },
  /**
   * 测试函数-上传文件
   * @param {*表单数据} formdata 
   */
  uploadtest(formdata, url) {
    let that = this;
    console.log(that.data.imageSrc);
    wx.uploadFile({
      url: url,
      filePath: that.data.imageSrc,
      name: "file",
      header: {
        'content-type': 'multipart/form-data'
      },
      formData: formdata,
      success: function (res) {
        // console.log(res);
        if (res.statusCode == 200) {
          app.showSuccess("数据已经提交");
          qcloud.clearCaseCache();
          wx.navigateBack();
        }
        else {
          app.showModel('提交失败！', "服务器出问题了");
        }
      },
      fail: function (error) {
        app.showModel("提交失败！", error);
      }
    })
  },
  // 检查金额数据部位空切不能是字符串。
  justInTimeCheckDataAndNum: function (e) {

    var value = e.detail.value;
    var result = isNaN(parseFloat(value));
    // console.log(parseFloat(value));
    this.setData({
      orginalpay: parseFloat(value),
    })

    if (result) {
      return {
        value: 0,
      }
    }
    else {
      return {
        value: parseFloat(value),
      }
    }
  },
  justInTimeCount: function (e) {
    var count = e.detail.value.length;
    this.setData({
      wordnum: count,
    })
  },
  /**
  * 改变字数变化，赋值理由到变量
  */
  justInTimeCountAndInput: function (e) {
    var value = e.detail.value;
    this.setData({
      wordnum: value.length,
      description: value
    })
  },

  /**
  * 应诉人选择
  */
  searchrespondent: function (e) {
    console.log("选择应诉人……");
    wx.navigateTo({
      url: '../personinfo/users',
    });
  },
  /**
   * 投诉人--赋值到js变量中
   */
  justInTimeSyaccuser: function (e) {
    this.setData({
      accuser: e.detail.value,
    })
  },

  /**
   * 标题--赋值到js变量中
   */
  justInTimeSyTitle: function (e) {
    this.setData({
      title: e.detail.value,
    })
  },
  /**
   * 新案件提交 or 草稿修改提交 or 案件修改提交
   */
  submit: function () {
    var url = "";
    if (this.data.isDraft == "true" && this.data.isfabu == "true") {
      /**
       * 已经发布的案件进行修改
       *    -- 待审核状态
       *    -- 修改案件接口
       */
      url = config.requestChangeCase
    }
    else if (this.data.isDraft == "true" && this.data.isfabu == "false") {
      /**
       * 已经发布的草稿进行修改
       *    -- 待审核状态
       *    -- 修改案件接口
       */
      url = config.requestChangeCase;
    }
    else {
      /**
       * 新发布的案件
       *    -- 待审核状态
       *    -- 新发布案件状态
       */
      
      if (this.data.imageSrc == null)
        url = config.requestPutNewCaseByPost;
      else {
        url = config.requestCreateNewCaseByPost;
      }
    }
    this.formSubmit({
      url: url,
    })
  },
  /**
  * 提交未草稿的话……。
  */
  onCache: function () {
    var values = {
      id: this.data.id,
      title: this.data.title,
      accuser: this.data.accuser,
      respondent: this.data.respondent,
      respondentid: this.data.respondentid,
      accuserid: this.data.accuserid,
      orginalpay: this.data.orginalpay,
      description: this.data.description,
      state: -1,// 草稿
      issuer: app.globalData.userInfo.nickName,
    }
    this.uploadtest(values, config.requestCreateNewCaseByPost);
  },
  /**
   * 预览图片
   */
  previewImage: function (e) {
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: [this.data.files] // 需要预览的图片http链接列表
    })
  },
  /**
   * 上传图片
   */
  chooseWxImage: function (type) {
    var that = this;
    wx.chooseImage({
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: [type], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // console.log(res)
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        that.setData({
          imageSrc: res.tempFilePaths[0]
        });
        // console.log(that.data.imageSrc)
      }
    })
  },
  /**
   * 选择图片方式
   */
  chooseImageTap: function () {
    let that = this;
    wx.showActionSheet({
      itemList: ['从相册中选择', '拍照'],
      itemColor: "#f7982a",
      success: function (res) {
        if (!res.cancel) {
          if (res.tapIndex == 0) {
            that.chooseWxImage('album')
          } else if (res.tapIndex == 1) {
            that.chooseWxImage('camera')
          }
        }
      }
    })
  },
  /**
   * 删除图片
   */
  deleteImage: function (e) {
    let that = this;
    wx.showActionSheet({
      itemList: ['删除', '替换'],
      success: function (res) {
        if (!res.cancel) {
          console.log(res.tapIndex)
          if (res.tapIndex == 0) {
            // 删除
            that.setData({ imageSrc: null })
          }
          else {
            // 替换
            that.chooseImageTap();
          }
        }
      }
    });
  }

})