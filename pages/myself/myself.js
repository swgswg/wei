//获取应用实例
var app = getApp();
const urlData = require('../../utils/urlData.js');
const funData = require('../../utils/functionMethodData.js');
const util = require('../../utils/util.js');
const template = require('../../template/template.js');

Page({
    data: {
        shopInfo: null,
        level: '',
        card: null,
        profile: '',
        money: [],
        hasData: false,
        isHidden: true,
        hide: "hide",
        noHid: "noHid",
        aliyunUrl: urlData.uploadFileUrl
    },
    /**
     * 我的钱包
     */
    showMoney: function () {
        wx.navigateTo({
            url: '../myself/myMoney/myMoney'
        })
    },

    setEvent: function () {
        this.setData({
            isHidden: !this.data.isHidden
        })
        // console.log(this.data.isHidden)
    },

    /**
     * 客服
     */
    callKeHu: function () {
        wx.makePhoneCall({
            phoneNumber: '17733689080'
        })
    },

    /**
     * 修改密码
     */
    modifyPassword: function () {
        this.setData({
            isHidden: !this.data.isHidden
        }),
            wx.navigateTo({
                url: '../myself/modifyPassword/modifyPassword'
            })
    },

    /**
     * 使用说明
     */
    directionsForUse: function () {
        this.setData({
            isHidden: !this.data.isHidden
        }),
            wx.navigateTo({
                url: '../myself/directionsForUse/directionsForUse'
            })
    },

    /**
     * 反馈
     */
    feedBack: function () {
        this.setData({
            isHidden: !this.data.isHidden
        }),
        wx.navigateTo({
            url: '../myself/feedBack/feedBack'
        })
    },

    /**
     * 退出登录
     */
    loginOut: function () {
        this.setData({
            isHidden: !this.data.isHidden
        })
        // wx.navigateTo({
        //   url: '../login/login'
        // })
        // wx.navigateBack({
        //   delta: 1
        // })
        wx.redirectTo({
            url: '../login/login'
        })
    },


    // 加载
    onLoad: function () {
        // 加载页面tarBar模块
        template.tabbar("tabBar", 3, this, 2);
        let that = this
        // 查询商家信息
        setTimeout(function(){
            funData.getShopByCode(app.globalData.user_id, that, (data) => {
                console.log(data)
                // console.log(data.card);
                if (JSON.stringify(data) == '{}') {
                    return;
                }
                if (data.card == undefined || data.card == '' || data.card == null || data.card == false) {
                    that.setData({
                        shopInfo: data.shop,
                        hasData: true,
                        level: data.shop.level
                    });
                    return;
                }
                let card = data.card;
                // 银行卡号用*替换
                card.card_no = util.bankCardByStar(card.card_no);
                that.setData({
                    shopInfo: data.shop,
                    card: card,
                    hasData: true,
                    level: app.globalData.level
                });
            });
        },1000);
        
    },

    onShow:function(){
        let that = this;
        setTimeout(function(){
            if (app.globalData.user_id) {
                return;
            }
            funData.getUser(app.globalData.user_id, that, (data) => {
                // console.log(data)
                that.setData({
                    level: data.level
                });
            });   
        },800);
    },

    /**
     * 修改商家logo
     */
    editProfile: function () {
        let that = this;
        funData.myUpload(function (newsrc, fileNmae) {
            console.log(newsrc, fileNmae);
            let shopInfo = that.data.shopInfo;
            shopInfo.logo = fileNmae;
            that.setData({
                shopInfo: shopInfo
            })
            // 同步修改数据库
            funData.updateInfoLogo(app.globalData.shopCode, fileNmae, that, () => { });
        });
    },

    /**
     * 修改商家信息按钮
     */
    editShopInfo: function () {
        this.setData({
            isHidden: !this.data.isHidden
        }),
            wx.navigateTo({
                url: '/pages/myself/editShopInfo/editShopInfo'
            })
    },

    /**
     * 店铺优惠券
     */
    goCoupon:function(){
        let that = this;
        wx.navigateTo({
            url: '/pages/myGoods/CouponList/CouponList?shop_code=' + that.data.shopInfo.shop_code,
        })
    },

    /**
     * 查看绑定的银行卡
     */
    showBankCard: function () {
        wx.navigateTo({
            url: '/pages/bankCard/bankCardList/bankCardList',
        })
    },

    /**
     * 用户收藏
     */
    showUserCollection: function () {
        wx.navigateTo({
            url: '/pages/myself/userCollection/userCollection',
        })
    },

    /**
     * 完善店铺信息
     */
    perfectInformation: function () {
        wx.navigateTo({
            url: '/pages/apply/apply',
        })
    },

    /**
     * 前去购物
     */
    goShopping: function () {
        wx.navigateTo({
            url: '/pages/shop/mall/mall',
        })
    }

})