// mallcart.js
const app = getApp()
const utilFunctions = require('../../../utils/functionData.js');
const URLData = require('../../../utils/data.js');
const calculate = require('../../../utils/calculate.js');
Page({
  data: {
    this_order_id: 0,
    // 商品总价
    sums: "",
    // 直接结算的信息
    firstinfo: "",
    // 商品数量
    gnum: "",
    // 收货地址
    address: [],
    addid:"",
    // 传过来的ID
    addId:"",
    submitIsLoading: false,
    buttonIsDisabled: false,
    glo_is_load: true,
    // 实付价格
    pocket:"",
    // 优惠价格
    favour:""
  },

  /**
   *页面监听数据加载事件，获取订单详情 
   */

  onLoad: function (options) {
    // console.log(options)
    let shopsCode=options.shcode;
    // 传过来的收货地址ID
    let addids = options.addressId;
    this.setData({
      addId: addids
    })
    if (addids) {
      this.oneadd()
    } else {
      this.moadd()
    }
    // console.log(options)
    var gids = wx.getStorageSync('gid')
    var sum = wx.getStorageSync('num')
    var that = this
    // 直接结算
    function goods(res) {
      console.log(res)
      // 满减活动
      let di = 0;
      let nums= calculate.calcMul(res.price,sum)
      for (let l = 0; l < res.reduction.length; l++) {
        if (res.reduction[l].full <= nums) {
          if (res.reduction[l].reductionPrice>di){
            di = res.reduction[l].reductionPrice
          }
        }
      }
      console.log(di)
      picke = calculate.calcReduce(nums, di);
      nums = calculate.dealMoney(nums)
      picke = calculate.dealMoney(picke)
      di = calculate.dealMoney(di)

      that.setData({
        firstinfo: res,
        sums: nums,
        gnum: sum,
        pocket: picke,
        favour:di
      })
    }
    utilFunctions.getGoodsDetails(gids, shopsCode,goods, this)
  },

  /**
   *查看默认地址 
   **/
  moadd: function () {
    // 收货地址
    function maddress(res) {
      console.log(res)
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
      console.log(res)
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

  //开始支付
  pay_confirmOrder: function () {
    console.log(this.data.firstinfo)
    // 添加订单参数
    let total_money = []
    let real_money = []
    let addr_id = []
    let goodsId = []
    let num = []
    let price = []
    let carts_price = []
    let status = 1
    let color = []
    let size = []
    let typee = []
    let volume = []
    let taste = []
    let psums = []
    let shopcode = []
    // 商品详情
    let ishop = this.data.firstinfo
    // 商品价格
    psum = (this.data.gnum) * (ishop.price)

    goodsId.push(ishop.goodsId)
    num=this.data.gnum
    price.push(ishop.price)
    carts_price.push(psum)
    color.push(ishop.color)
    size.push(ishop.size)
    typee.push(ishop.type)
    volume.push(ishop.volume)
    taste.push(ishop.taste)
    shopcode.push(ishop.shopCode)
    console.log(shopcode)
    let that = this
    //生成订单函数和
    function orders(res) {
      console.log(res)
      wx.showModal({
        title: '支付完成',
        content: '',
      })
    }
    utilFunctions.insertOrder(goodsId, num, price, carts_price, color, size, typee, volume, taste, that.data.sums, that.data.pocket, that.data.addid, status, shopcode, orders, this)
  },
  initMakeOrderPayData: function (data) {
    var that = this
    that.setData({
      buttonIsDisabled: false,
      submitIsLoading: false
    })
    if (data.code == 1) {
      wx.requestPayment({
        'timeStamp': data.info.timeStamp,
        'nonceStr': data.info.nonceStr,
        'package': data.info.package,
        'signType': 'MD5',
        'paySign': data.info.paySign,
        'success': function (res) {

        },
        'fail': function (res) {

        },
        'complete': function () {
          that.setData({
            disabled: false
          })
          //支付完成 跳转订单列表
          wx.redirectTo({
            url: '../../user/order/list/index'
          })
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
            _function.getOrderInfo(wx.getStorageSync("utoken"), that.data.this_order_id, that.initgetOrderInfoData, this)
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
  }
})