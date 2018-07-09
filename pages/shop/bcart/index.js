// mallcart.js
// var _function = require('../../../utils/functionData');
const utilFunctions = require('../../../utils/functionData.js');
const URLData = require('../../../utils/data.js');
const calculate = require('../../../utils/calculate.js');
const template = require('../../../template/template.js');
var app = getApp()
Page({
    data: {
        level: app.globalData.level,
        cart_list: [],
        all_g_number: 0,
        all_g_price: 0,
        all_g_yunfei: 0,
        totalPrice: '0.00',
        num: "",
        this_check_val: [],
        all_is_checked: false,
        btn_mall_sure_disabled: false,
        is_checked: true,
        // 阿里
        upload_file_url: URLData.upload_file_url
    },


    /**
     * 事件初始化，加载购物车信息
    */
    onLoad: function (options) {
        let that = this;
        // 加载页面tarBar模块
        // setTimeout(function(){
        //   if (app.globalData.level == '1' || !app.globalData.level) {
        //         template.tabbar("tabBar", 2, that, 1);
        //     } else if (app.globalData.level == '2' || app.globalData.level == '3') {
        //         template.tabbar("tabBar", 2, that, 3);
        //     }
        // },1000);
        this.carts()
    },


    /**
     *加载购物车信息 
     */
    carts: function () {
        let that = this
        function cart(res) {
            // console.log(res)
            let leng = res.length
            for (var i = 0; i < leng; i++) {
                res[i].is_checked = false;
            }
            console.log(res)
            that.setData({
                cart_list: res,
            })
            // console.log(that.data.cart_list)
        }
        utilFunctions.getGoodsCart(cart, this);
    },

    onShow: function () {
        // let that = this;
        // if (app.globalData.level == '1' || !app.globalData.level) {
        //     template.tabbar("tabBar", 2, that, 1);
        // } else if (app.globalData.level == '2' || app.globalData.level == '3') {
        //     template.tabbar("tabBar", 2, that, 3);
        // }
    },

    onReady: function () {
        let that = this;
        if (app.globalData.level == '1' || !app.globalData.level) {
            template.tabbar("tabBar", 2, that, 1);
        } else if (app.globalData.level == '2' || app.globalData.level == '3') {
            template.tabbar("tabBar", 2, that, 3);
        }

        function cart(res) {
            // console.log(res)
            let leng = res.length
            for (var i = 0; i < leng; i++) {
                res[i].is_checked = false;
            }
            // console.log(res)
            that.setData({
                cart_list: res,
            })
            // console.log(that.data.cart_list)
        }
        utilFunctions.getGoodsCart(cart, this)
    },

    //全选
    all_checkboxChange: function (e) {
        var that = this
        var isallcheck = false
        if (e.detail.value[0] == 1) {
            isallcheck = true
        } else {
            isallcheck = false
        }
        var datas = that.data.cart_list
        var check_val = []
        for (var i = 0; i < datas.length; i++) {
            datas[i].is_checked = isallcheck
            if (isallcheck == true) {
                check_val[i] = datas[i].id
            }
        }
        that.setData({
            cart_list: datas,
            this_check_val: check_val
        })
        // 重新获取总价
        that.getTotalPrice();
    },



    /**
     * 减少数量
     */
    bind_cart_number_jian: function (e) {
        // console.log(e)
        const index = e.currentTarget.dataset.index
        // 购物车ID
        let cart = e.currentTarget.dataset.goodscart
        // 购物车信息
        let carts = this.data.cart_list
        // 商品数量
        let numss = carts[index].num
        if (numss <= 1) {
            return false
        }
        numss -= 1;
        let that = this
        carts[index].num = numss;
        function updata(res) {
            that.setData({
                cart_list: carts
            });
            that.getTotalPrice();
        }

        utilFunctions.updateGoodsCart(cart, numss, updata, this)
    },

    /**
     * 增加数量
     */
    bind_cart_number_jia: function (e) {
        let datas = e.currentTarget.dataset.stock
        let index = e.currentTarget.dataset.index
        // 购物车ID
        let cartId = e.currentTarget.dataset.goodscart
        // 购物车信息
        let carts = this.data.cart_list
        // 商品数量
        let numss = carts[index].num
        if (numss > datas) {
            return false
        }
        numss += 1;
        carts[index].num = numss;
        let that = this
        function updata(res) {
            that.setData({
                cart_list: carts
            });
            that.getTotalPrice();
        }

        utilFunctions.updateGoodsCart(cartId, numss, updata, this)

    },

    /**
     * 选择商品
     */
    selectList: function (e) {
        // console.log(e)
        // 获取data- 传进来的index
        var index = e.currentTarget.dataset.index;
        // console.log(index);  
        // 获取购物车列表
        var carts = this.data.cart_list;
        // 获取当前商品的选中状态
        var is_checked = carts[index].is_checked;
        // 改变状态       
        carts[index].is_checked = !is_checked;
        this.setData({
            cart_list: carts
        });
        console.log(carts)
        // 重新获取总价
        this.getTotalPrice();
    },

    /**
      * 计算总价
      */
    getTotalPrice: function () {
        // 获取购物车列表
        let carts = this.data.cart_list;
        let total = '0.00';
        let all_g_number = 0;
        // 循环列表得到每个数据
        for (let i = 0; i < carts.length; i++) {
            if (carts[i].is_checked) {
                // 判断选中才会计算价格
                console.log(calculate.calcMul(carts[i].num, carts[i].price))
                total = calculate.calcAdd(total, calculate.calcMul(carts[i].num, carts[i].price));  // 所有价格加起来

                // 计算购物车数量
                all_g_number = calculate.calcAdd(all_g_number, carts[i].num);
            }
        }
        total = String(total).split('.');
        if (total[1] == undefined || total[1] == '' || total[1] == null) {
            total.push('00');
        } else if (total[1].length == 1) {
            total[1] += '0';
        }
        total = total.join('.');
        // 最后赋值到data中渲染到页面
        this.setData({
            carts: carts,
            totalPrice: String(total),
            all_g_number: all_g_number
        });
    },




    initeditCartListData: function (data) {
        var that = this
        if (data.code == 1) {
            _function.getCartList(wx.getStorageSync("utoken"), that.initgetCartListData, this)
        } else if (data.code == 2) {
            wx.showModal({
                title: '提示',
                content: '登陆超时，将重新获取用户信息',
                showCancel: false,
                success: function (res) {
                    app.getNewToken(function (token) {
                        that.setData({
                            local_global_token: token
                        })
                        _function.getCartList(wx.getStorageSync("utoken"), that.initgetCartListData, this)
                    })
                }
            })
        } else if (data.code == 5) {
            wx.showModal({
                title: '提示',
                content: data.info,
                showCancel: false
            })
            return false;
        }
    },
    /**
     * 删除购物车
     */
    bind_delete_cart: function (e) {

        let carts = this.data.cart_list;
        let mycid = [];
        let cid = []
        for (let i = carts.length - 1; i >= 0; i--) {
            if (carts[i].is_checked) {
                cid.push(carts[i].goodsCart_id)
                // 判断选中才会执行删除
                mycid.push(carts[i].is_checked);
                carts.splice(i, 1);
            }
        }
        // 同步删除数据库
        function deletes(res) {
        }
        utilFunctions.deleteGoodsCart(deletes, cid, this)

        this.setData({
            cart_list: carts
        });
    },

    /**
     * 结算跳转
     */
    mallsure: function () {
        if (this.data.cart_list == null) {
            wx.showModal({
                title: '提示',
                content: '对不起,购物车暂无商品',
                showCancel: false
            })
            return
        }
        // 存入数据，
        let cart = this.data.cart_list
        let arrays = []

        for (let i = 0; i < cart.length; i++) {
            if (cart[i].is_checked == true) {
                arrays.push(cart[i]);
                // console.log(arrays)
            }
        }
        let carray = arrays;
        arrays = utilFunctions.dealShop_code(arrays);


        wx.setStorage({
            key: "carray",
            data: carray
        })

        wx.setStorage({
            key: "lists",
            data: arrays
        })

        wx.setStorage({
            key: "nums",
            data: this.data.totalPrice
        })
        // 判断结算跳转
        if (arrays.length) {
            wx.navigateTo({
                url: '/pages/shop/orderpay/index'
            })
        } else {
            wx.showToast({
                title: '请选择要购买的商品',
                icon: 'none'
            })
            return false
        }

        this.carts()
        this.setData({
            totalPrice: "0.00",
            all_g_number: 0
        })
    },

    initdelCartListData: function (data) {
        var that = this
        if (data.code == 2) {
            wx.showModal({
                title: '提示',
                content: '登陆超时，将重新获取用户信息',
                showCancel: false,
                success: function (res) {
                    app.getNewToken(function (token) {
                        that.setData({
                            local_global_token: token
                        })
                        that.setData({
                            this_page: 1,
                            buttonIsDisabled: false
                        })
                        _function.getCartList(wx.getStorageSync("utoken"), that.initgetCartListData, that)
                    })
                }
            })
            return false;
        }
        _function.getCartList(wx.getStorageSync("utoken"), that.initgetCartListData, that)
    },

    //下拉刷新
    onPullDownRefresh: function () {
        var that = this
        _function.getCartList(wx.getStorageSync("utoken"), that.initgetCartListData, this)
        that.setData({
            all_is_checked: false
        })
        setTimeout(() => {
            wx.stopPullDownRefresh()
        }, 1000)
    },

    // 
})