// 参与人所参与的案件，搜索案件，展示案件。
// page形成的过程中，获取data中的caseslist列表，caselist中应该是与参与人相关的案件。

// 获取腾讯云的sdk，使用sdk的接口进行沟通服务器
var qcloud = require('../../vendor/qcloud-weapp-client-sdk/index');

// 引入配置
var config = require('../../config');

const app = getApp();

Page({
    data: {
        hasContent: false,
        funcIdentity: '00',
        btnMsg: '查看全部',
        caseslist: [],
    },
    /**
     * 通过id获取案件
     */
    getCaseById: function (id) {
        return this.data.caseslist.filter(function (item) {
            return (item.Ver_id == id)
        })
    },
    onLoad: function (options) {
        this.setData({
            funcIdentity: options.funcIdentity,
        });
    },
    /**
     * 判断到底是点击的是完成案件还是参与案件
     */
    onShow() {
        var filterlist = [];
        if (this.data.funcIdentity == '02') {
            // 设置标题栏文字
            wx.setNavigationBarTitle({
                title: '我发布的案件',
                success: function (res) {
                }
            })
            // 请求本用户的所有案件
            this.getMycases();
        }
        else {
            wx.setNavigationBarTitle({
                title: '已经完成的案件',
                success: function (res) {
                }
            })
            // console.log('已完成的案件');
            filterlist = app.globalData.caseslist.getState2();
            console.log(filterlist);
            this.setData({
                caseslist: filterlist,
                hasContent: filterlist.length != 0,
            })
        }
    },
    /**
     * 点击某一案件，进入案件的详细信息
     * @param {点击事件的参数} event 
     */
    caseDetail(event) {
        // console.log("案件信息：");
        var casetemp = this.getCaseById(event.currentTarget.dataset.id)[0];
        console.log(casetemp);
        if (casetemp.State == -1) {
            // 这是点击草稿案件所进入的页面
            // 设置参数
            qcloud.setCaseCache({
                verid : casetemp.Ver_id ,
                title: casetemp.Complain_title,
                Accuser: casetemp.Accuser_client,
                defendant: casetemp.Defendant_client,
                claim: casetemp.Claim,
                statement: casetemp.Statement
            });
            wx.navigateTo({
                url: '../newcase/newcase?draft=true',
            })
        }
        else {
            wx.navigateTo({
                url: '../caseInfo/caseInfo?caseinfoid=' + event.currentTarget.dataset.id,
            })
        }
    },
    /**
     * 请求我发布的案件的信息
     */
    getMycases: function () {
        const that = this;
        app.showBusy("正在请求...");
        qcloud.request({
            login: app.globalData.hasLogin,
            url: config.requestGetMyCase,

            success: function (res) {
                app.showSuccess("请求成功");
                that.setData({
                    caseslist: res.data,
                    hasContent: res.data.length != 0,
                });
                //  console.log(that.data.caseslist);
            },
            fail: function (e) {
                app.showModel("Error", e);
                that.setData({
                    hasContent: false,
                });
            }
        });
    },
})