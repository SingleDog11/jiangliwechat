// main.js
// 请求近期的案件信息，请求10条。
// 当拉到最后一条案件信息时，使用上拉加载机制，进入到全部案件信息列表。
// 引入配置文件
var config = require('../../config');
// 获取qcloud SDK
var qcloud = require('../../vendor/qcloud-weapp-client-sdk/index');
// 获取app
const app = getApp()

Page({
    data: {
        hasContent: false,
        width: app.systemInfo.windowWidth,
        height: app.systemInfo.windowHeight,

        // 四个功能列表
        functions: [
            {
                url: '../../images/icon_person.png',
                name: '个人信息',
                id: '01',
                nexturl: '../personinfo/person'
            },
            {
                url: '../../images/icon_participator.png',
                name: '我的案件',
                id: '02',
                nexturl: '../tpcase/tpcase'
            },
            {
                url: '../../images/icon_complete.png',
                name: '完成案件',
                id: '03',
                nexturl: '../tpcase/tpcase'
            },
            {
                url: '../../images/icon_newcase.png',
                name: '发布案件',
                id: '04',
                nexturl: '../tipinformation/tipinformation'
            },
        ],
        // 案件信息
        cases: [],
    },
    onLoad: function () {

    },
    onReady: function () {
        const that = this;
        // 请求案件
        app.showBusy("正在请求数据……");
        qcloud.request({
            login: app.globalData.hasLogin,
            url: config.requestCaseByState,
            data: {
                state: -2,// 1 请求全部案件
            },
            success: function (res) {
                // console.log(res);
                // 这里获取到的案件赋值给 本地的case
                app.showSuccess("请求成功");
                app.globalData.caseslist.list = res.data;
                that.setData({
                    cases: res.data,
                    hasContent: !res.data.length == 0
                });
            },
            fail: function () {
                app.showModel('error','请检查网络');
                // console.log("main::fail")
                that.setData({
                    hasContent: false,
                })
            }
        });
    },
    funClick(event) {
        const id = event.currentTarget.dataset.id;
        var url = event.currentTarget.dataset.nexturl;
        wx.navigateTo({
            url: url + "?funcIdentity=" + id,
        });
    },
    caseDetail(event) {
        // console.log(event);
        wx.navigateTo({
            // 将案件的唯一标识传递过去
            url: '../caseInfo/caseInfo?caseinfoid=' + event.currentTarget.dataset.id,
        })
    }
})