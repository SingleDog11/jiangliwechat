// 参与人所参与的案件，搜索案件，展示案件。
// page形成的过程中，获取data中的caseslist列表，caselist中应该是与参与人相关的案件。

// 获取腾讯云的sdk，使用sdk的接口进行沟通服务器
var qcloud = require('../../vendor/qcloud-weapp-client-sdk/index');

// 引入配置
var config = require('../../config');

const app = getApp();

Page({
    data: {
        selectedNav: '01',

        hasContent: false,
        funcIdentity: '00',
        btnMsg: '全部分类',
        caseslist: [],
        // 
        backlist: [],

        // 筛选接口
        showspinner: false,
        spinners: [],
        sort: [
            {
                name: '全部',
                id: 'b00'
            },
            {
                name: '我的草稿',
                id: 'b01'
            },
            {
                name: '审核中案件',
                id: 'b02'
            },
            {
                name: '裁决中案件',
                id: 'b03'
            },
            {
                name: '已完成案件',
                id: 'b04'
            },
            {
                name: '参与裁决案件',
                id: 'b05'
            },

        ],
    },
    /**
     * 通过id获取案件
     */
    getCaseById: function (id) {
        return this.data.caseslist.filter(function (item) {
            return (item.Ver_id == id)
        })
    },
    /**
     * 通过状态获取案件列表
     */
    getCaseByState: function (state) {
        return this.data.backlist.filter(function (item) {
            return (item.State == state)
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
            const that = this;
            qcloud.request({
                login: app.globalData.hasLogin,
                url: config.requestCaseByState,
                data: { state: 2 },
                success: function (res) {
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
                verid: casetemp.Ver_id,
                title: casetemp.Complain_title,
                Accuser: casetemp.Accuser_client,
                defendant: casetemp.Defendant_client,
                claim: casetemp.Claim,
                statement: casetemp.Statement
            });
            wx.navigateTo({
                url: '../newcase/newcase?draft=true&hasfabu=false',
            })
        }
        else {
            var isowner = 'true' ;
            if(app.globalData.userInfo.nickName != casetemp.issuer)
            {
                isowner = 'false'
            }
            wx.navigateTo({
                url: '../caseInfo/caseInfo?caseinfoid=' + event.currentTarget.dataset.id + '&isowner='+isowner,
            })
        }
    },
    /**
     * 请求我发布的案件的信息
     */
    getMycases: function () {
        const that = this;
        qcloud.request({
            login: app.globalData.hasLogin,
            url: config.requestGetMyCase,

            success: function (res) {
                that.setData({
                    backlist: res.data,
                    caseslist: res.data,
                    hasContent: res.data.length != 0,
                    btnMsg: "全部分类"
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
    /**
     * 显示案件分类列表
     */
    navitation(event) {
        let id = event.currentTarget.dataset.id;
        const that = this;
        // console.log(id);
        if (id == that.data.selectedNav) {
            id = '00';
            that.setData({
                showspinner: false,
            })
        } else {
            that.setData({
                showspinner: true,
            })
        }
        that.setData({
            selectedNav: id,
        })
        let temps = that.data.spinners;
        if (id == '02') {
            temps = that.data.sort;
        } else if (id == '01') {
            temps = that.data.nearby;
        }
        that.setData({
            spinners: temps,
        })
    },
    /**
     * 单击spinner的事件  
     */
    spinnerclick(event) {

        // console.log(event);
        const that = this;
        var id = event.currentTarget.dataset.id;
        if (id == 'b05') {
            // 我参与的案件。
            this.setData({
                btnMsg: '已参与的案件'
            })
            // 参与的案件
            qcloud.request({
                login: app.globalData.hasLogin,
                url: config.requestgetCaseOfClient,
                success: function (res) {
                    console.log(res);
                    that.setData({
                        caseslist: res.data,
                        showspinner: false,
                        selectedNav: '01',
                    })
                }
            })
        }
        else {
            var templist = this.chooserightcaselist(id);
            // 判断id
            that.setData({
                caseslist: templist,
                showspinner: false,
                selectedNav: '01',
            })
        }

    },
    /**
     * 通过id获取正确状态的list
     */
    chooserightcaselist: function (id) {
        switch (id) {
            case 'b00': {
                // 全部案件
                this.setData({
                    btnMsg: '全部分类'
                })
                return this.data.backlist;
            }
            case 'b01': {
                // 我的草稿
                this.setData({
                    btnMsg: '我的草稿'
                })
                return this.getCaseByState('-1');
            }
            case 'b02': {
                // 审核中的案件
                this.setData({
                    btnMsg: '审核中的案件'
                })
                return this.getCaseByState('0');
            }
            case 'b03': {
                // 裁决中的案件
                this.setData({
                    btnMsg: '裁决中的案件'
                })
                return this.getCaseByState('1');
            }
            case 'b04': {
                // 已完成的案件
                this.setData({
                    btnMsg: '已完成的案件'
                })
                return this.getCaseByState('2');
            }
        }
    }
})