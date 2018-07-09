const app = getApp()
const utilFunctions = require('../../../utils/functionData.js');
const URLData = require('../../../utils/data.js');
const calculate = require('../../../utils/calculate.js');
Page({

  data: {
    this_order_id: 0,
    // 商品总价
    sums: "",
    // 商品信息
    orderinfo: [],
    // 收货地址
    address: [],
    submitIsLoading: false,
    buttonIsDisabled: false,
    glo_is_load: true,
    addId: "",
    // 实付价格
    pocket: "",
    // 优惠
    favour: ""
  },

  /**
   *页面监听数据加载事件，获取订单详情 
   */
  onLoad: function (options) {
    // 传过来的收货地址ID
    let addids = options.addressId
    this.setData({
      addId: addids
    })
    if (addids) {
      this.oneadd()
    } else {
      this.moadd()
    }
    var that = this
    // 获取购物车数据
    var carts = wx.getStorageSync('lists')
    var nums = wx.getStorageSync('nums')
    that.setData({
      orderinfo: carts,
      sums: nums
    })
    let sum = 0;
    // 价格判断
    for (let i = 0; i < carts.length; i++) {
      // 每个店铺的价格
      let sus = 0;

      for (let j = 0; j < carts[i].goods.length; j++) {
        let osum = calculate.calcMul(carts[i].goods[j].num, carts[i].goods[j].price);
        sus = calculate.calcAdd(osum, sus)
      }
      // 满减价格
      let di = 0;
      for (let l = 0; l < carts[i].reduction.length; l++) {
        if (carts[i].reduction[l].full <= sus) {
          if (carts[i].reduction[l].reductionPrice > di) {
            di = carts[i].reduction[l].reductionPrice
          }
        }
      }
      this.setData({
        favour: di
      })
      sus = calculate.calcReduce(sus, di);
      sum = calculate.calcAdd(sum, sus);
    }
    sum = calculate.dealMoney(sum)
    this.setData({
      pocket: sum
    })
  },

  /**
   *查看默认地址 
   **/
  moadd: function () {
    // 收货地址
    function maddress(res) {
      console.log(res);
      if(typeof(res) === 'undefined'){
        return;
      }
      this.setData({
        address: res,
        addid: res.id
      })
    }
    utilFunctions.getAddrByDefault(maddress, this)
  },



  /**
   * 查看单个地址
   */
  oneadd: function () {
    let that = this
    function addinfo(res) {
      this.setData({
        address: res,
        addid: res.id
      })
    }
    utilFunctions.getAddrById(addinfo, that.data.addId, this)
  },

  /**
   *修改默认地址 
   */
  aupdata: function () {
    wx: wx.navigateTo({
      url: '/pages/user/address/address'
    })
  },

  /**
   *跳转优惠券 
   */
  favourable: function (e) {
    // console.log(e)
    let uid = e.currentTarget.dataset.uid
    wx.navigateTo({
      url: '/pages/shop/mallquanlist/index?uid=' + uid
    })
  },


  //开始支付
  pay_confirmOrder: function () {
    // console.log(this.data.orderinfo)
    // 添加订单参数
    let total_money = '';
    let real_money = '';
    let addr_id = '';
    let goodsId = '';
    let num = '';
    let price = '';
    let carts_price = '';
    let status = 2;
    let color = '';
    let size = '';
    let typee = '';
    let volume = '';
    let taste = '';
    let psums = '';
    let shopcode = '';
    // let ShopTotalPrice = this.getShopTotalPrice();
    // console.log(ShopTotalPrice);
    // 商品详情
    // let order = this.data.orderinfo;
    var order = wx.getStorageSync('carray')
    console.log(order)
    let orderLen = order.length;
    for (let i = 0; i < orderLen; i++) {
      // for (let k in ShopTotalPrice) {
      //   if (order[i].shop_code == k) {
      //     total_money += String(ShopTotalPrice[k]) + ','
      //   }
      // }
      real_money += this.data.pocket + ',';
      total_money += this.data.sums + ',';
      goodsId += order[i].goods_id + ',';
      num += order[i].num + ','
      price += order[i].price + ','
      console.log(order[i])
      carts_price += String(calculate.calcMul(order[i].num, order[i].price)) + ',';
      console.log(order[i].color)
      if (typeof (order[i].color) == 'undefined' || order[i].color == null || order[i].color == '' || order[i].color == undefined) {
        order[i].color = '@';
      }
      color += order[i].color + ',';
      if (typeof (order[i].size) == 'undefined' || order[i].size == null || order[i].size == '' || order[i].size == undefined) {
        order[i].size = '@';
      }
      size += order[i].size + ',';
      if (typeof (order[i].type) == 'undefined' || order[i].type == null || order[i].type == '' || order[i].type == undefined) {
        order[i].type = '@';
      }
      typee += order[i].type + ',';
      if (typeof (order[i].volume) == 'undefined' || order[i].volume == null || order[i].volume == '' || order[i].volume == undefined) {
        order[i].volume = '@';
      }
      volume += order[i].volume + ',';
      console.log(order[i].taste)
      if (typeof (order[i].taste) == 'undefined' || order[i].taste == null || order[i].taste == '' || order[i].taste == undefined) {
        order[i].taste = '@';
      }
      taste += order[i].taste + ',';
      shopcode += order[i].shop_code + ',';
    }
    let that = this
    //生成订单函数和
    function orders(res) {
      // console.log(res)
      wx.redirectTo({
        url: '/pages/user/pay_success/pay_success?addid=' + that.data.addid + '&totalPrice=' + that.data.sums,
      })
    }
    utilFunctions.insertOrder(goodsId, num, price, carts_price, color, size, typee, volume, taste, total_money, real_money, that.data.addid, status, shopcode, orders, this)
  },

  // // 判断一个订单里有几个商店
  // getShopQuantity: function () {
  //   let orders = this.data.orderinfo;
  //   let shop = [];
  //   let orderLen = orders.length;
  //   for (let i = 0; i < orderLen; i++) {
  //     if (shop.indexOf(orders[i].shop_code) == -1) {
  //       shop.push(orders[i].shop_code);
  //     }
  //   }
  //   return shop;
  // },

  // // 计算每个商店的总价钱
  // getShopTotalPrice: function () {
  //   let shop = this.getShopQuantity();
  //   let shopLen = shop.length;
  //   let orders = this.data.orderinfo;
  //   let orderLen = orders.length;
  //   let shopTotalPrice = {}; // 每个商店里的商品的总价格
  //   for (let i = 0; i < shopLen; i++) {
  //     shopTotalPrice[shop[i]] = '0.00';
  //     for (let j = 0; j < orderLen; j++) {
  //       if (shop[i] == orders[j].shop_code) {
  //         // 计算单个商品的总价钱
  //         console.log(orders[j])
  //         let goodsTotalPrice = calculate.calcMul(orders[j].num, orders[j].price);
  //         // 计算单个商店的总价钱
  //         shopTotalPrice[shop[i]] = calculate.calcAdd(goodsTotalPrice, shopTotalPrice[shop[i]]);
  //       }
  //     }
  //   }
  //   return shopTotalPrice;
  // }
});
