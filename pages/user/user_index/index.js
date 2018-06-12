var _function = require('../../../utils/functionData.js');
var app = getApp()
Page({
    data:{
        userInfo:{},
        bbs_show_status:true,
        shop_show_status:true,
        menu_list:'',
        glo_is_load:false
    },
    //用户充值
    bind_user_charge:function(){
        wx.navigateTo({
            url: '../user_account/index'
        })
    },
    //编辑资料
    bind_user_edit:function(){
        wx.navigateTo({
            url: '../user_edit/index'
        })
    },
    bind_user_paylog:function(){
        wx.navigateTo({
            url: '../user_pay/index'
        })
    },
    //收货地址
    bind_user_address:function(){
        wx.navigateTo({
            url: '../shop/address_list/index'
        })
    },
    //我的帖子
    bind_user_bbspost:function(){
        wx.navigateTo({
            url: '../bbs/list/index'
        })
    },
    //我的订单
    bind_user_order:function(){
        wx.navigateTo({
            url: '../order/list/index'
        })
    },
    tapUserInfo:function(){
        wx.navigateTo({
            url: 'user_info/user_info'
        })
    },
    //切换
    bbs_tab_change_bind:function(){
        var that = this;
        that.setData({
            bbs_show_status:that.data.bbs_show_status?false:true
        });
    },
    shop_tab_change_bind:function(){
        var that = this;
        that.setData({
            shop_show_status:that.data.shop_show_status?false:true
        }); 
    },
    //扫码
    scan_code_bind:function(){
        var ccontent = '';
        var carray = [];
        wx.scanCode({
            success: (res) => {
                ccontent = res.result;
                carray = ccontent.split("#");
                if(carray[0] == 'peisong'){
                    wx.navigateTo({
                        url: '/pages/shop/mallpeisong/index?oid='+carray[1]
                    });
                }
            },
            error:(res)=>{
                console.log(res)
            }
        });
    },
    //显示隐藏
    isShow_bind:function(e){
      var that = this
      var datas = that.data.menu_list
      for(var i=0;i<datas.length;i++){
          if(datas[i].name == e.currentTarget.id){
              var isShow = (datas[i].isshow == true)?false:true;
              datas[i].isshow = isShow
          }
      }
      that.setData({
          menu_list:datas,
      })
    },
    menu_link_bind:function(e){
        var link_url = e.currentTarget.id
        wx.navigateTo({
            url: '/' + link_url
        })
    },
    //加载完成后 读取用户信息
    onLoad:function(){
        var that = this
        //读取菜单配置
        // _function.getUserMenu(that.initgetUserMenuData,this)
        //获取用户信息
        // _function.getUserInfo(wx.getStorageSync("utoken"),that.initGetUserInfoData,this)
    },
    initgetUserMenuData:function(data){
        var that = this
        that.setData({
            menu_list:data.info
        })
    },
    initGetUserInfoData:function(data){
        var that = this;
        wx.hideToast();
        if(data.code == 1){
            that.setData({
                userInfo:data.info,
                glo_is_load:false
            })
        }else if(data.code == 2){
            wx.showToast({
                title: '登陆中',
                icon: 'loading',
                duration: 10000,
                success: function () {
                    app.getNewToken(function (token) {
                        // _function.getUserInfo(wx.getStorageSync("utoken"), that.initGetUserInfoData, that)
                    })
                }
            });
        }
    },
    //下拉刷新
    onPullDownRefresh:function(){
        var that = this
        //读取菜单配置
        _function.getUserMenu(that.initgetUserMenuData,this)
        _function.getUserInfo(wx.getStorageSync("utoken"),this.initGetUserInfoData,this)
        setTimeout(()=>{
            wx.stopPullDownRefresh()
        },1000)
    }
})