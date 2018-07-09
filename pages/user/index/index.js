var util = require('../../../utils/util.js');
const utilFunctions = require('../../../utils/functionData.js');
const URLData = require('../../../utils/data.js');
const template = require('../../../template/template.js');
var app = getApp();
Page({
    data: {
        userInfo: {},
        hasUserInfo: false,
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
        level: '',
        uinfo: "",
        upload_file_url: URLData.upload_file_url,
        tabbar_index: 3
    },

    onLoad: function (options) {
        let that = this;
        // 加载页面tarBar模块
        setTimeout(function () {
          if (app.globalData.level == '1' || !app.globalData.level) {
                template.tabbar("tabBar", 3, that, 1);
            } else if (app.globalData.level == '2' || app.globalData.level == '3') {
                template.tabbar("tabBar", 3, that, 3);
            }
        }, 1000);

        // 页面初始化 options为页面跳转所带来的参数
        // console.log(app.globalData)
        // 查询个人信息
        this.jinfo();
        if (app.globalData.userInfo) {
            this.setData({
                userInfo: app.globalData.userInfo,
                hasUserInfo: true
            })
        } else if (this.data.canIUse) {
            // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
            // 所以此处加入 callback 以防止这种情况
            app.userInfoReadyCallback = res => {
                this.setData({
                    userInfo: res.userInfo,
                    hasUserInfo: true
                })
            }
        } else {
            // 在没有 open-type=getUserInfo 版本的兼容处理
            wx.getUserInfo({
                success: res => {
                    app.globalData.userInfo = res.userInfo
                    this.setData({
                        userInfo: res.userInfo,
                        hasUserInfo: true
                    })
                }
            })
        }
    },
    getUserInfo: function (e) {
        console.log(e)
        app.globalData.userInfo = e.detail.userInfo
        this.setData({
            userInfo: e.detail.userInfo,
            hasUserInfo: true
        });
        // 同步修改用户信息

    },

    /**
     *加载个人信息 
     */
    jinfo: function () {
        let that = this
        function userinfos(res) {
            // console.log(res)
            that.setData({
                uinfo: res
            })
        }
        utilFunctions.getUserurl(userinfos, this)
    },

    onReady: function () {
        this.jinfo()
    },
    onShow: function () {
        let that = this;
        if (app.globalData.level == '1' || !app.globalData.level) {
            template.tabbar("tabBar", 3, that, 1);
        } else if (app.globalData.level == '2' || app.globalData.level == '3') {
            template.tabbar("tabBar", 3, that, 3);
        }
        this.jinfo();

    },
    onHide: function () {
        // 页面隐藏

    },
    onUnload: function () {
        this.jinfo()
        // 页面关闭
    },
    goLogin() {
        user.loginByWeixin().then(res => {
            this.setData({
                userInfo: res.data.userInfo
            });
            app.globalData.userInfo = res.data.userInfo;
            app.globalData.token = res.data.token;
        }).catch((err) => {
            console.log(err)
        });
    },
    exitLogin: function () {
        wx.showModal({
            title: '',
            confirmColor: '#b4282d',
            content: '退出登录？',
            success: function (res) {
                if (res.confirm) {
                    wx.removeStorageSync('token');
                    wx.removeStorageSync('userInfo');
                    wx.switchTab({
                        url: '/pages/index/index'
                    });
                }
            }
        })

    }
})