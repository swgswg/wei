const app = getApp();
const utilFunctions = require('../../../utils/functionData.js');
const URLData = require('../../../utils/data.js');
const template = require('../../../template/template.js');
Page({
    data: {
        cate_one_data: [],
        this_cate_id: 0,
        glo_is_load: false,
        // 分组ID
        groupids: "",
        // 所有店铺
        shops: [],
        pages: 1,
        pasesize: 10,
        // 阿里
        upload_file_url: URLData.upload_file_url,
    },
    // 店铺跳转
    mall_list_bind: function (e) {
        let groupid = e.currentTarget.id;
        // console.log(e)
        if (groupid == 1){
            // 跳转去外卖
            wx.navigateTo({
                url: '/pages/takeout/index/index',
            })
        } else {
            wx.navigateTo({
                url: '../shoplist/shoplist?groupid=' + groupid + '&shop_code=' + e.currentTarget.dataset.shop_code
            })
        }
       
    },
    // 初始化页面
    onLoad: function (options) {

        // console.log(options)
        let gid = options.gid
        this.setData({
            groupids: gid
        })
        var that = this;
        function classify(res) {
            //   console.log(res)
            that.setData({ shops: res.PageInfo.list })
        }
        utilFunctions.getShopUrl(gid, that.data.pages, that.data.pasesize, classify, this)

        // 商品模糊查询
        let arrayVal = options.gname
        if (arrayVal) {
            function gets(res) {
                // console.log(res)
                that.setData({
                    shops: res.PageInfo.list
                })
            }
            utilFunctions.getShopByName(arrayVal, that.data.pages, that.data.pasesize, gets, this)

        }

    },

    /**
     * 数据加载
    */
    onReady: function () {
    },


    /**
     *  店铺分类事件
     */
    // cate_item_bind: function (e) {
    //   var that = this;
    //   var gids = e.currentTarget.id;
    //   // var seid = e.target.dataset.cid;
    //   that.setData({ this_cate_id: gids, groupids: gids });
    //   function classify(res) {
    //     console.log(res)
    //     that.setData({ shops: res.PageInfo.list })
    //   }
    //   utilFunctions.getShopUrl(that.data.groupids, that.data.pages, that.data.pasesize, classify, this)
    // },

    /**
     * 收藏店铺
     */
    show: function (e) {
        // console.log(e)
        shopcode = e.currentTarget.dataset.shop_code
        let that = this
        function collect(res) {
            //   console.log(res)
            wx.showToast({
                title: '收藏成功',
                icon: 'success',
                duration: 1500
            })
        }
        utilFunctions.insterCollect(shopcode, collect, this)
    },

})