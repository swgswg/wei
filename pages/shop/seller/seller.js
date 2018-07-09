// pages/shop/seller/seller.js
const app = getApp()
const utilFunctions = require('../../../utils/functionData.js');
const URLData = require('../../../utils/data.js');
const template = require('../../../template/template.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        level: app.globalData.level,
        imgUrls: [
            "../../../images/2.jpg",
            "../../../images/3.jpg"
        ],
        shop: "",
        // 阿里
        upload_file_url: URLData.upload_file_url,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        // 加载页面tarBar模块
        let that = this;
        // setTimeout(function(){
        //     if (app.globalData.level == '1' || !app.globalData.level) {
        //         template.tabbar("tabBar", 1, that, 1);
        //     } else if (app.globalData.level == '2' || app.globalData.level == '3') {
        //         template.tabbar("tabBar", 1, that, 3);
        //     }
        // },1000);

        function gets(res) {
            //   console.log(res)
            that.setData({
                shop: res
            })
        }
        utilFunctions.getGroup(gets, this)
    },

    /**
     *跳转店铺 
     */
    shops: function (e) {
        //   console.log(e)
        let gid = e.currentTarget.dataset.gid;
        if (gid == 1) {
            // 跳转去外卖
            wx.navigateTo({
                url: '/pages/takeout/index/index',
            })
        } else {
            wx.navigateTo({
                url: "/pages/shop/mallcate/mallcate?gid=" + gid,
            })
        }
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
        let that = this;
        if (app.globalData.level == '1' || !app.globalData.level) {
            template.tabbar("tabBar", 1, that, 1);
        } else if (app.globalData.level == '2' || app.globalData.level == '3') {
            template.tabbar("tabBar", 1, that, 3);
        }
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})