//获取应用实例
var app = getApp();
const urlData = require('../../utils/urlData.js');
const funData = require('../../utils/functionMethodData.js');
const util = require('../../utils/util.js');

Page({

    /**
     * 页面的初始数据
     */
    data: {
        // shopCode:app.globalData.shopCode,
        user_id: app.globalData.user_id,
        aliyunUrl: urlData.uploadFileUrl,
        shopInfo: null,
        group: null,
        ID_img: '',
        logo:'',
        change_takeout: false, // 是否是选择外卖,
        locationName:'',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let that = this;
        // 根据用户id获取shopCode
        // setTimeout(function(){
        //     funData.getShopByCode(app.globalData.user_id, that, (data) => {
        //             console.log(data);
        //         that.setData({
        //             shopInfo: data.shop,
        //         });
        //     });
        // },1000);

        // 获取店铺分类
        funData.getGroup(that, (data) => {
            //   console.log(data)
            that.setData({
                group: data
            });
        });
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
        let that = this;
        funData.getShopByCode(app.globalData.user_id, that, (data) => {
            console.log(data);
            that.setData({
                shopInfo: data.shop,
            });
        });
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

    },

    /**
     * 选择分组
     */
    radioChange: function (e) {
        if (e.detail.value == '1' || e.detail.value == 1) {
            this.setData({
                change_takeout: true
            });
        }
    },

    /**
     * 店铺定位
     */
    location: function (e) {
        funDta.amapFilePackage((data) => {
            let locationName = {};
            locationName.desc = data[0].desc;
            locationName.latitude = data[0].latitude;
            locationName.longitude = data[0].longitude;
            that.setData({
                locationName: locationName
            });
        }, null);
    },

    /**
  * 添加照片
  */
    addImgLogo: function () {
        let that = this;
        funData.myUpload(function (newsrc, fileNmae) {
            that.setData({
                logo: fileNmae
            });
        });
    },

    /**
     * 添加照片
     */
    addImg: function () {
        let that = this;
        funData.myUpload(function (newsrc, fileNmae) {
            that.setData({
                ID_img: fileNmae
            });
        });
    },


    /**
     * 提交
     */
    apply: function (e) {
        // console.log(e.detail.value)
        let that = this;
        let shop = e.detail.value;

        // 店铺logo不能为空
        if(that.data.logo == ''){
            wx.showToast({
                title: 'logo不能为空',
                icon: 'none',
                duration: 1000
            });
            return;  
        }

        // 店铺分类不能为空
        if (shop.group_id == '') {
            wx.showToast({
                title: '分类不能为空',
                icon: 'none',
                duration: 1000
            });
            return;
        }

        // 店铺简介
        if (shop_detail == '') {
            wx.showToast({
                title: '简介不能为空',
                icon: 'none',
                duration: 1000
            });
            return;
        }

        // 店铺地址不能为空
        if (shop.shop_addr == '') {
            wx.showToast({
                title: '地址不能为空',
                icon: 'none',
                duration: 1000
            });
            return;
        }

        // 身份证号验证
        if (!util.checkReg(2, shop.ID_card)) {
            wx.showToast({
                title: '身份证不正确',
                icon: 'none',
                duration: 1000
            });
            return;
        }
        // 身份证照片不能为空
        if (that.data.ID_img == '') {
            wx.showToast({
                title: '上传身份证照片',
                icon: 'none',
                duration: 1000
            });
            return;
        }

        // 外卖
        if (change_takeout){
            // 起送价
            if (!util.checkReg(4,shop.initialMoney)){
                wx.showToast({
                    title: '请填写起送价',
                    icon: 'none',
                    duration: 1000
                });
                return;
            }
            // 配送价
            if (!util.checkReg(4, shop.transMoney)){
                wx.showToast({
                    title: '请填写配送价',
                    icon: 'none',
                    duration: 1000
                });
                return;
            }
            // 定位
            if (locationName == ''){
                wx.showToast({
                    title: '请定位店铺',
                    icon: 'none',
                    duration: 1000
                });
                return;
            }
            shop.latitude = that.data.locationName.latitude;
            shop.longitude = that.data.locationName.longitude;
        }

        shop.logo = that.data.logo;
        shop.ID_img = that.data.ID_img;
        shop.shop_code = that.data.shopInfo.shop_code;
        shop.user_id = app.globalData.user_id;
        shop.level = 3;

        // console.log(shop)
        funData.updateShopInfo(shop, that, () => {
            wx.showToast({
                title: '信息已成功提交',
                icon: 'success',
                duration: 1000
            });
            setTimeout(function () {
                wx.reLaunch({
                    url: '/pages/myself/myself'
                })
            }, 2000)
        });
    }

})