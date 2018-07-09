const funDta = require('../../../utils/functionMethodData.js');
const urlData = require('../../../utils/urlData.js')
const template = require('../../../template/template.js');
const util = require('../../../utils/util.js');
const calculate = require('../../../utils/calculate.js');
var page = 1;
var pageSize = 20;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        is_load: false,
        nav_type: 'menu', // 菜单类型,默认菜单(菜单-评价-商家) 
        menu_cate: -1, // 菜单类别(默认热销-1)
        num: {}, // 商品的数量
        shop_code: '',
        shop_info: null,
        goods_list: null,  // 商品列表
        shop_class: null,  // 店铺商品类别
        assess: false,
        adds: false,
        pei: '', // 达到多少钱配送
        is_pei: true, // 是否满足配送
        total_price: "0.00",
        cart_hidden: false,
        aliyunUrl: urlData.uploadFileUrl,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        // 获取上级页面传过来的参数
        this.setData({
            shop_code: options.shop_code,
        });
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
        let that = this;
        console.log(that.data.shop_code)

        // 获取店铺信息
        funDta.getOutShopByCode(that.data.shop_code, that, (res) => {
            console.log(res);
            let pei = calculate.calcAdd(res.initialMoney, res.transMoney);
            that.setData({
                shop_info: res,
                pei: pei
            });
        });

        // 获取店铺类别
        funDta.getFoodClass(that.data.shop_code, that, (res) => {
            console.log(res);
            that.setData({
                shop_class: res
            });
        });

        // 获取店铺商品列表(默认热销,分类为空)
        getFoodGoodsList(1, '', that);

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
     *  菜单-评价-商家
     */
    nav: function (e) {
        let nav_type = e.currentTarget.dataset.navtype;
        this.setData({
            nav_type: nav_type
        });
    },

    /**
     * 点击菜单类别
     */
    menuCate: function (e) {
        let that = this;
        let index = e.currentTarget.dataset.index;
        let classId = e.currentTarget.dataset.classid;
        // 获取类别对应的商品列表
        pageSize = 20;
        if (classId == -1) {
            getFoodGoodsList(1, '', that);
        } else {
            getFoodGoodsList('', classId, that);
        }
        that.setData({
            menu_cate: classId,
        });
    },

    /**
     *加数量 
     */
    add: function (e) {
        let that = this;
        let index = e.currentTarget.dataset.index;
        let goods_list = this.data.goods_list;
        let num = goods_list[index].num;
        num += 1;
        goods_list[index].num = num;
        goods_list[index].minus_hidden = true;
        // 计算总价
        calculateTotalPrice('add', goods_list, goods_list[index].discountPrice, that);
     
    },

    /**
     *减数量 
    */
    minus: function (e) {
        let that = this;
        let index = e.currentTarget.dataset.index;
        let goods_list = this.data.goods_list;
        let num = goods_list[index].num;
        num -= 1;
        if (num <= 0) {
            num = 0;
            goods_list[index].minus_hidden = false;
        }
        goods_list[index].num = num;
        // 计算总价
        calculateTotalPrice('minus', goods_list, goods_list[index].discountPrice, that);
     
    },

    /**
     * 去结算
     */
    goToCount: function () { },

    /**
     * 食物 滚动到顶部/左边，会触发 scrolltoupper 事件
     */
    scrollToUpper: function () { },

    /**
     * 食物 滚动到底部/右边，会触发 scrolltolower 事件
     */
    scrollToLower: function () { },
});

// 获取店铺商品列表
function getFoodGoodsList(myhot, myfoodsClassId, that, resFun) {
    let mydata = {
        shopCode: that.data.shop_code,
        isUse: 1,
        hot: myhot, // 热销
        foodsClassId: myfoodsClassId,  // 外卖店铺分类id
        page: page,
        pageSize: pageSize
    };
    funDta.getFoodGoods(mydata, that, (res) => {
        let newData = res.PageInfo.list;
        let len = newData.length;
        for (let i = 0; i < len; i++) {
            newData[i].num = 0; // 我每个商品添加数量
            newData[i].minus_hidden = false;  // 每个是否显示减号
            // 折扣除以10
            if (newData[i].discount > 0 && newData[i].discount <= 10) {
                let discount = calculate.calcSub(newData[i].discount, 10);  // 折扣
                newData[i].discountPrice = calculate.calcMul(newData[i].price, discount); // 折扣价格
            } else if (newData[i].discount <= 0 || newData[i].discount > 10 || newData[i].discount == '') {
                newData[i].discountPrice = newData[i].price; // 折扣价格
            }
        }
        console.log(res);
        that.setData({
            goods_list: newData
        });
    });

}

// 计算总价
function calculateTotalPrice(flag, goods_list, discountPrice, that) {
    // 所有商品的总价格
    let totalPrice = null;
    if (flag == 'add') {
        totalPrice = calculate.calcAdd(that.data.total_price, discountPrice);
        let peis = calculate.calcReduce(that.data.pei, discountPrice);
    } else if (flag == 'minus') {
        totalPrice = calculate.calcReduce(that.data.total_price, discountPrice);
        let peis = calculate.calcAdd(that.data.pei, discountPrice);
    }

    // 满减
    let reductionPrice = 0; // 存放符合满减的价格
    let reduction = that.data.shop_info.reduction;
    let reductionLen = reduction.length;
    for (let i = 0; i < reductionLen; i++) {
        if (totalPrice >= reduction[i].full && reduction[i].reductionPrice >= reductionPrice) {
            reductionPrice = reduction[i].reductionPrice;
        }
    }
    totalPrice = calculate.calcReduce(totalPrice, reductionPrice);
    if(totalPrice <= 0){
        totalPrice = '0.00';
    }
    // 配送需求
    // let peis = calculate.calcReduce(that.data.pei, discountPrice);
    if (peis <= 0) {
        that.setData({ is_pei: false });
    } else {
        that.setData({ is_pei: true });
    }
    console.log(peis);
    that.setData({
        goods_list: goods_list,
        total_price: totalPrice,
        pei: Math.abs(peis)
    });

    // 获取外卖购物车缓存
    let value = wx.getStorageSync('takeoutCart');
    if (util.isEmpty(value)) {
        console.log(111)
        // Do something with return value
    }

    // // 同时将价格缓存在本地
    // wx.setStorage({
    //     key: "takeoutCart",
    //     data: [
    //         { goods_name: , goods_price: , goods_num: }
    //     ]
    // })
}