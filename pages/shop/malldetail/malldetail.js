const app = getApp();
// const requestUtil = require('../../../utils/requestUtil');
const utilFunctions = require('../../../utils/functionData.js');
const utils = require('../../../utils/util.js');
const URLData = require('../../../utils/data.js');
const operating = require('../../../utils/calculate.js')
// var WxParse = require('../../../wxParse/wxParse.js');
Page({

  data: {
    //商品详情 
    goods_info: [],
    goods_specification: [],
    wxParseData: '',
    shop_config: [],
    // 商品ID
    goods_id: 0,
    // 商家编号
    shopcode: "",
    this_g_nav: 1,
    is_add_cart_view: false,
    cart_default_number: 1,
    goods_attr_select: {},
    btn_add_cart_disabled: false,
    glo_is_load: false,
    indicatorDots: false,
    swiperCurrent: 0,
    scrollTop: 0,
    floorstatus: true,
    // 商品图片
    pictures: [],
    // 商品评论
    comments: "",
    // 阿里
    upload_file_url: URLData.upload_file_url,
    // 图片信息
    xpic: "",
    lpic: "",
    dpic: "",
    // 结算总数
    nums: "",
    // 商品颜色
    colors: [],
    // 商品型号
    sizes: [],
    // 品牌
    types: [],
    // 内存
    volumes: [],
    // 味道
    tastes: [],
    // 传的数据
    color: "",
    size: "",
    typee: "",
    volume: "",
    taste: ""
  },
  goTop: function (e) {
    this.setData({
      scrollTop: 0
    })
  },
  swiperChange: function (e) {
    this.setData({
      swiperCurrent: e.detail.current
    })
  },
  goHome: function (e) {
    wx.navigateTo({
      url: '../mall/mall'
    })
  },

  /**
   * 页面数据加载，监听事件，获取商品详细信息
   */
  onLoad: function (options) {
    // console.log(options)
    var that = this
    var post_id = options.goodsid;
    that.setData({
      goods_id: post_id,
    })
    function goods(res) {
      console.log(res)
      that.setData({
        goods_info: res,
        shopcode: res.shopCode,
        pictures: res.picture,
        nums: res.price
      })
      // 商品颜色
      let str = res.color
      let color = [];
      if (str) {
        color = str.split(",")
      } else {
        color = [];
      }
      that.setData({
        colors: color
      })
      // console.log(that.data.colors)
      // 商品型号
      let str2 = res.size
      let size = [];
      if (str2) {
        size = str2.split(",")
      } else {
        size = [];
      }
      that.setData({
        sizes: size
      })
      //商品品牌
      let str3 = res.type
      let stype = []
      if (str3) {
        stype = str3.split(",")
      } else {
        stype = []
      }
      that.setData({
        typee: stype
      })
      //商品内存
      let str4 = res.volume
      let svolume = [];
      if (str4) {
        svolume = str4.split(",")
      } else {
        svolume = [];
      }
      that.setData({
        volumes: svolume
      })
      //味道
      let str5 = res.taste
      let staste = [];
      if (str5 == "" || str5 == undefined) {
        staste = []
      } else {
        staste = str5.split(",")
      }
      that.setData({
        tastes: staste
      })
      // console.log(that.data.tastes)
      let pic = res.picture;
      console.log(pic)
      // 店铺头像
      let dpicture = [];
      // 轮播图
      let lpicture = [];
      let lsort = [];
      let zlpic = []
      // 商品详情
      let xpicture = [];
      let xsort = []
      let zxpic = []
      console.log(pic)
      // for循环遍历商品图片详情
      for (let i = 0; i < pic.length; i++) {
        // 区分状态值
        if (pic[i].status == 1) {
          dpicture = pic[i]
        } else if (pic[i].status == 2) {
          lpicture.push(pic[i])
        } else if (pic[i].status == 3) {
          xpicture.push(pic[i])
        }
      }
      // console.log(xpicture)
      // 获取排序值
      for (let l = 0; l < lpicture.length; l++) {
        let sorts = lpicture[l].sort
        lsort.push(sorts)
      }
      for (let x = 0; x < xpicture.length; x++) {
        let xsorts = xpicture[x].sort
        xsort.push(xsorts)
      }
      // 冒泡排序
      lsort = utils.mySort(lsort, 1)
      xsort = utils.mySort(xsort, 1)
      // console.log(lsort)
      // console.log(xsort)
      // 判断图片信息
      // 轮播图图片
      for (let ll = 0; ll < lsort.length; ll++) {
        for (let pp = 0; pp < lpicture.length; pp++) {
          if (lsort[ll] == lpicture[pp].sort) {
            let zl = lpicture[pp]
            zlpic.push(zl)
          }
        }
      }
      // 详情图片
      for (let xx = 0; xx < xsort.length; xx++) {
        for (let qq = 0; qq < lpicture.length; qq++) {
          if (lsort[xx] == xpicture[qq].sort) {
            let zx = xpicture[qq]
            zxpic.push(zx)
          }
        }
      }
      // console.log(zxpic)
      // console.log(zlpic)
      that.setData({
        dpic: dpicture,
        xpic: zxpic,
        lpic: zlpic
      })
    }
    utilFunctions.getGoodsDetails(that.data.goods_id, that.data.shopcode,goods, this)

  },

  initGoodsInfoData: function (data) {
    var that = this
    that.setData({
      goods_info: data.info,
      goods_specification: data.info.goods_specification
    })
    WxParse.wxParse('article', 'html', data.info.g_content, that, 0)
  },
  initshopConfigData: function (data) {
    this.setData({
      shop_config: data.info,
      glo_is_load: false
    })
  },
  /**
   * 商品详情
   */
  goods_nav_bind: function (e) {
    var that = this
    var this_target = e.target.id;
    that.setData({
      this_g_nav: this_target
    })
  },



  /**
   * 商品评论
   */
  goods_nav_bind2: function (e) {
    var that = this
    var this_target = e.target.id;
    that.setData({
      this_g_nav: this_target
    })
    function comment(res) {
      console.log(res)
      let len = res.length;
      for (let k = 0; k < len; k++) {
        res[k].img = res[k].img.split(',');
      }
      that.setData({
        comments: res
      })
      console.log(that.data.sphoto)
    }
    utilFunctions.getComment(that.data.goods_id, comment, this)
  },

  //显示加入购物车
  bind_goods_add_cart: function () {
    var that = this
    that.setData({
      is_add_cart_view: true
    })
  },

  //隐藏购物车
  add_cart_close_bind: function () {
    var that = this
    that.setData({
      is_add_cart_view: false
    })
  },
  //减少数量
  bind_cart_number_jian: function () {
    var that = this
    var this_default_number = parseInt(that.data.cart_default_number)
    if (this_default_number > 1) {
      that.setData({
        cart_default_number: this_default_number - 1
      })
      let sum = operating.calcMul(that.data.cart_default_number, that.data.goods_info.price)
      that.setData({
        nums: sum
      })
    } else {
      that.setData({
        cart_default_number: 1
      })
      let sum = operating.calcMul(that.data.cart_default_number, that.data.goods_info.price)
      that.setData({
        nums: sum
      })
    }
  },
  //增加数量
  bind_cart_number_jia: function () {
    var that = this
    var this_default_number = parseInt(that.data.cart_default_number)
    that.setData({
      cart_default_number: this_default_number + 1
    })
    let sum = operating.calcMul(that.data.cart_default_number, that.data.goods_info.price)
    that.setData({
      nums: sum
    })
  },
  //加入购物车
  goods_add_cart: function () {
    var that = this;
    function insert(data) {
      // console.log(data)
      that.setData({
        btn_add_cart_disabled: false,
        is_add_cart_view: false
      });
      wx.showToast({
        title: '添加成功',
      });
    }
    utilFunctions.insertGoodsCart(that.data.goods_id, that.data.shopcode, that.data.cart_default_number, that.data.color, that.data.size, that.data.typee, that.data.volume, that.data.taste, insert, this)
  },

  /**
   *去结算 
   */
  goods_add_cart2: function () {
    let nums = this.data.cart_default_number
    let gids = this.data.goods_id
    wx.navigateTo({
      url: '/pages/shop/onepay/onepay?shcode='+this.data.shopcode
    })
    // 存入内存
    wx.setStorage({
      key: "num",
      data: nums
    })
    wx.setStorage({
      key: "gid",
      data: gids
    })
  },
  // 容量
  radioChange4: function (e) {
    // console.log('radio发生change事件，携带value值为：', e.detail.value)
    this.setData({
      volume: e.detail.value
    })
  },
  // 颜色
  radioChange1: function (e) {
    // console.log('radio发生change事件，携带value值为：', e.detail.value)
    this.setData({
      color: e.detail.value
    })
  },
  // 尺寸
  radioChange2: function (e) {
    // console.log('radio发生change事件，携带value值为：', e.detail.value)
    this.setData({
      size: e.detail.value
    })
  },
  // 口味
  radioChange5: function (e) {
    // console.log('radio发生change事件，携带value值为：', e.detail.value)
    this.setData({
      taste: e.detail.value
    })
  },
  // 类型
  selectType: function (e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value)
    this.setData({
      typee: e.detail.value
    })
    // console.log(that.data.typee)
  },



  initAddCartData: function (data) {
    var that = this;
    wx.hideToast();
    that.setData({
      btn_add_cart_disabled: false
    });
    if (data.code == 1) {
      wx.showModal({
        title: '提示',
        content: "添加购物车成功! 点确定进入下单页面,取消留在该页面",
        success: function (res) {
          if (res.confirm == true) {
            wx.redirectTo({
              url: '../mallcart/mallcart'
            })
          } else {
            that.setData({
              is_add_cart_view: false
            })
          }
        }
      })
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
            that.setData({
              this_page: 1,
              buttonIsDisabled: false
            })
            _function.getGoodsInfo(that.data.this_goods_id, that.initGoodsInfoData, this)
          })
        }
      })
    } else if (data.code == 5) {
      wx.showModal({
        title: '提示',
        content: data.info,
        showCancel: false
      })
      that.setData({
        //is_add_cart_view:false
      })
      return false;
    }
  },
  //联系客服
  bind_contant_kefu: function () {
    var that = this
    wx.makePhoneCall({
      phoneNumber: that.data.shop_config.kefu_contant
    })
  },
  //进入购物车
  bind_go_cart: function () {
    wx.navigateTo({
      url: "/pages/shop/bcart/index"
    })
  },
  set_close: function () {
    this.setData({
      is_add_cart_view: false
    })
  },
  //属性选择
  select_attr_bind: function (e) {
    var that = this
    var this_attr_id = e.currentTarget.id
    var this_attr_name = e.currentTarget.dataset.type
    var datas = that.data.goods_specification
    var this_spec_price = 0;
    var a_datas = that.data.goods_attr_select
    var g_datas = that.data.goods_info
    for (var i = 0; i < datas.length; i++) {
      if (datas[i].name == this_attr_name) {
        a_datas[datas[i].name] = null
        for (var j = 0; j < datas[i].values.length; j++) {
          datas[i].values[j].ischeck = false
          if (datas[i].values[j].id == this_attr_id) {
            datas[i].values[j].ischeck = true
            a_datas[datas[i].name] = this_attr_id
            if (datas[i].values[j].format_price > 0) {
              g_datas.shop_price = datas[i].values[j].format_price
            }
          }
        }
      }
    }
    that.setData({
      goods_specification: datas,
      goods_attr_select: a_datas,
      goods_info: g_datas
    })
  },
  //下拉刷新
  onPullDownRefresh: function () {
    var that = this
    that.setData({
      this_page: 1
    })
    //请求商品详情
    _function.getGoodsInfo(that.data.this_goods_id, that.initGoodsInfoData, this)
    setTimeout(() => {
      wx.stopPullDownRefresh()
    }, 1000)
  },
  //滚动加载
  indexscrolltolower: function () {
    var that = this
    that.setData({
      hasMore: true
    })
    var this_target = this.data.this_items
    _function.getReplyList(that.data.this_post_id, that.data.this_page + 1, that.data.pagesize, that.initReplyLoadData, this)
  },
  initReplyLoadData: function (data) {
    var that = this
    if (data.info == null) {
      that.setData({
        is_scroll_y: false,
      })
    } else {
      if (data.info.length >= that.data.pagesize) {
        that.setData({
          is_scroll_y: true,
        })
      } else {
        that.setData({
          is_scroll_y: false,
        })
      }
      that.setData({
        reply_items: that.data.reply_items.concat(data.info),
        this_page: that.data.this_page + 1
      })
    }
  },
  onShareAppMessage: function () {
    var that = this
    return {
      title: that.data.goods_info.g_name,
      desc: '',
      path: '/pages/shop/malldetail/malldetail?sid=' + that.data.this_goods_id
    }
  },
})