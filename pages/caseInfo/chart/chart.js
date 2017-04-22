// sharecomponants/comment/comment.js
// 获取app
var wxCharts = require('../../../vendor/wxcharts-min.js');

// 引入配置
var config = require('../../../config');

// 引入腾讯云的sdk
var qcloud = require('../../../vendor/qcloud-weapp-client-sdk/index');

const app = getApp();
var lineChart = null;
Page({
  data: {
    points: [],
    userAmount: 0,
    pictureAmount: 0,
    averageAmount: 0,
  },
  touchHandler: function (e) {
    console.log(lineChart.getCurrentDataIndex(e));
    lineChart.showToolTip(e, {
      // background: '#7cb5ec'
    });
  },

  // 获取数据！
  createSimulationData: function (points) {
    var categories = [];
    var data = [];

    for (var i = 0; i < points.length; i++) {
      categories.push(points[i][0]);
      data.push(points[i][1]);
    }
    return {
      categories: categories,
      data: data
    }
  },
  getLargePoint: function (points) {
    var rightx = 0;
    var maxy = 0;

    for (var i = 0; i < points.length; i++) {
      if (maxy < points[i][1]) {
        rightx = points[i][0];
        maxy = points[i][1];
      }
      console.log(points[i]);
    }
    return rightx;
  },
  onLoad: function (options) {
    // 获得案件id和参与者id
    var caseid = options.perid;
    var partid = options.partid;
    var userAmount = options.amount;

    this.setData({
      userAmount: userAmount,
    })

    // 获取满意度曲线。
    var points = [];

    const that = this;
    app.showBusy("正在获取……");
    qcloud.request({
      login:app.globalData.hasLogin,
      url: config.requestGetChart,
      data: {
        caseid: caseid,
        clid: partid,
      },
      success: function (res) {
        // console.log(res);
        if (res.data.success == 1) {
          app.showSuccess("获取成功");
          points = res.data.data.curve;

          /**
           * 找到点集中最大的那个……
           */
          var maxx = that.getLargePoint(points);
          var average = (parseFloat(userAmount) + parseFloat(maxx)) / 2;
          that.setData({
            pictureAmount: maxx,
            averageAmount: average,
          })

          that.showChart(points);

        }
        else {
          app.showModel('error', '也许是网络问题');
        }
      },
      fail: function () {
        app.showModel('error', '也许是网络问题');
      }
    });
  },

  showChart: function (points) {
    if (points.length == 0) {
      return;
    }
    // 对数据点进行处理

    var windowWidth = 375;
    try {
      var res = wx.getSystemInfoSync();
      windowWidth = res.windowWidth;
    } catch (e) {
      console.error('getSystemInfoSync failed!');
    }
    var simulationData = this.createSimulationData(points);

    console.log(simulationData);
    lineChart = new wxCharts({
      canvasId: 'lineCanvas',
      type: 'line',
      categories: simulationData.categories,
      animation: true,
      background: '#f5f5f5',
      series: [{
        name: '满意度',
        data: simulationData.data,
        format: function (val, name) {
          return val;
        }
      }],
      xAxis: {
        disableGrid: false
      },
      yAxis: {
        title: '满意度',
        format: function (val) {
          return val.toFixed(2);
        },
        min: -10
      },
      width: windowWidth,
      height: 180,
      dataLabel: false,
      dataPointShape: false,
      extra: {
        lineStyle: 'curve'
      }
    });
  },
})