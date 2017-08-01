// main.js 
// 当拉到最后一条案件信息时，使用上拉加载机制，进入到全部案件信息列表。
// 引入配置文件
var config = require('../../config');
// 获取qcloud SDK
var qcloud = require('../../vendor/qcloud-weapp-client-sdk/index');
// 获取app
const app = getApp()
const constants = require('../../utils/constants');

Page({
    data: {
        hasContent: false,
        width: app.systemInfo.windowWidth,
        height: app.systemInfo.windowHeight,

        currentPage: 1,// 当前的页码
        searchLoading: false,
        searchLoadingComplete: false,

        // 案件信息
        cases: [],
    },

    onLoad: function () {
        app.getUserInfo(function (userInfo) {
            app.Login(userInfo);
        });
    },
    /**
     * 请求获取案件
     */
    onShow: function () {
        this.getCasesfromnet();
    },
    /**
     * 从服务器请求案件的全部信息
     */
    getCasesfromnet: function () {
        const that = this;

        wx.showNavigationBarLoading();
        qcloud.request({
            login: true,
            url: config.requestCaseByPageAndState,
            data: {
                page: that.data.currentPage, // 请求的页码
                state: constants.PUBLISH,// 1 请求正在裁决的案件
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
                    that.data.hasContent == false ? searchList = res.data : searchList = that.data.cases.concat(res.data);
                    /**
                     * 判断是否已经达到数据底部
                     */
                    var isend = res.data.length < 20 ;
                    that.setData({
                        cases: searchList,
                        hasContent: searchList.length != 0,
                        searchLoading: !isend,
                        searchLoadingComplete : isend, 
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
     * 单击search栏
     * @param {*传递的变量} event 
     */
    searchclick(event) {
        wx.navigateTo({
            url: "../search/search",
        });
    },
    /**
     * 单击案件的事件
     * @param {*变量} e 
     */
    onViewTap(e) {
        const ds = e.currentTarget.dataset;
        const t = ds['type'] === 'case' ? 'caseInfo/caseInfo' : 'personinfo/user';
        // console.log(`../${t}?id=${ds.id}`);
        wx.navigateTo({
            url: `../${t}?id=${ds.id}`,
        });
    },
    /**
     * 加载更多
     */
    loadmore: function () {
        let that = this;
        var searchLoading = this.data.searchLoading
        var searchLoadingComplete = this.data.searchLoadingComplete
        console.log("searchLoading: " + this.data.searchLoading)
        console.log("searchLoadingComplete: " + this.data.searchLoadingComplete)

        if (searchLoading && !searchLoadingComplete) {
            console.log(that.data.currentPage);
            searchLoading = false;
            that.setData({
                searchLoading: searchLoading,
            })
            that.getCasesfromnet();
        }
    },
})