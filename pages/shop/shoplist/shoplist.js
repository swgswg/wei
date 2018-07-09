const app = getApp();
// const requestUtil = require('../../../utils/requestUtil');
const utilFunctions = require('../../../utils/functionData.js');
const URLData = require('../../../utils/data.js');
Page({
    data: {
        // 轮播图图片
        imgUrls: [
            "../../../images/2.jpg",
            "../../../images/3.jpg"
        ],
        cate_one_data: [],
        this_cate_id: "",
        glo_is_load: false,
        // 商品类别
        Sarray: [],
        // 商品列表
        goods: [],
        // 店铺ID
        shop_code: "",
        // 店铺信息
        shopinfo: "",
        // 分类ID
        listId: "",
        // 阿里
        upload_file_url: URLData.upload_file_url,
    },

    /**
     *  商品详情跳转
     */
    mall_list_bind: function (e) {
        // console.log(e)
        // console.log(e.currentTarget.id)
        wx.navigateTo({
            url: '/pages/shop/malldetail/malldetail?goodsid=' + e.currentTarget.id
        })
    },

    /**
     *  初始化页面，获取商品分类
     */
    onLoad: function (options) {
        console.log(options)
        this.setData({ gid: options.groupid });
        this.setData({ this_cate_id: options.groupid, shop_code: options.shop_code });
        var that = this;
        function Slist(data) {
            //   console.log(data)
            that.setData({
                sarray: data,
            });
        }
        utilFunctions.getClassUrl(that.data.gid, Slist, this);

        //店铺信息
        function shops(res) {
            //   console.log(res)
            that.setData({
                shopinfo: res
            })
        }
        utilFunctions.getShopByCode(that.data.shop_code, shops, this)
    },

    /**
     *搜索商品 
     */
    inputBlur: function (e) {
        // console.log(e)
        let that = this
        let arrayVal = [];
        arrayVal.push(e.detail.value);
        function gets(res) {
            // console.log(res)
            that.setData({
                goods: res
            })
        }
        utilFunctions.getGoodsByName(arrayVal, that.data.shop_code, gets, this)

    },

    /**
     * 数据加载
    */
    onReady: function () {
        // 设置默认
        let that = this
        setTimeout(
            function () {
                function codelist(res) {
                    //   console.log(res)
                    that.setData({ goods: res.PageInfo.list })
                }
                utilFunctions.getGoodsUrl(that.data.shop_code, that.data.listId, codelist, this)
            }, 100)
    },

    // 全部列表
    erery: function () {
        let listId = ""
        let that = this
        function codelist(res) {
            //   console.log(res)
            that.setData({
                goods: res.PageInfo.list,
                listId: ""
            })
        }
        utilFunctions.getGoodsUrl(that.data.shop_code, listId, codelist, this)
    },
    /**
     *  商品分类列表，获取商品列表
     */
    cate_item_bind: function (e) {
        let that = this;
        funData.getShopCode(that.globalData.user_id, that, (data) => {
            // console.log(data);
            that.globalData.shopCode = data.shop_code;
            let cids = e.currentTarget.dataset.cid
            // console.log(cids)
            // console.log(that.data.listId)
            function codelist(res) {
                //   console.log(res)
                that.setData({
                    goods: res.PageInfo.list,
                    listId: cids
                })
            }
            utilFunctions.getGoodsUrl(data.shop_code, cids, codelist, this);
        });
    }
})