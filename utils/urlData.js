// const config.host = "http://39.107.70.80:8080/";
// const config.host = "http://192.168.3.116:8080/";
// const config.host = "http://192.168.3.244:8080/";
// const config.host = 'https://www.wx.tianjingcq.com/'
const config = require('./config.js');

module.exports = {
    host: config.host,
    uploadFileUrl: config.uploadFileUrl,
    wxGaodeMapKey: config.wxGaodeMapKey,
    baseUrl: config.host,
    // 登录
    loginUrl: config.host + 'MicroPlatform/user/userLogin',
    // 查询商品列表
    getGoodsUrl: config.host + 'MicroPlatform/goods/getGoods',
    // 添加商品
    insertGoodsUrl: config.host + 'MicroPlatform/goods/insertGoods',
    // 修改商品状态 // 删除商品 都是对商品状态修改
    // deleteGoodsUrl: config.host +'MicroPlatform/goods/deleteGoods',
    // 查询商品详情
    getGoodsDetailsUrl: config.host + 'MicroPlatform/goods/getGoodsDetails',
    // 上架/下架商品  // 修改商品 // 删除商品 都是对商品状态修改
    deleteGoodsUrl: config.host +'MicroPlatform/goods/deleteGoods',
    // 修改商品信息
    updateGoodsUrl: config.host +'MicroPlatform/goods/updateGoods',
    // 查询分组(给店铺用)
    getGroupUrl: config.host + 'MicroPlatform/group/getGroup',
    // 查询分类(给商品用)
    getClassUrl: config.host +'MicroPlatform/group/getClass', 
    // 商品评价
    getCommentUrl: config.host +'MicroPlatform/comment/getComment',
    // 添加评论
    insertCommentUrl: config.host + 'MicroPlatform/comment/insertComment', 
    // 查询订单
    getOrderUrl: config.host + 'MicroPlatform/order/getOrder',
    // 改变订单状态
    updateOrderStatusUrl: config.host + 'MicroPlatform/order/updateOrderStatus',
    // 查询订单详情
    getOrderDetailUrl: config.host +'MicroPlatform/order/getOrderDetail',
    // 查询退换货
    getGoodBackUrl: config.host +'MicroPlatform/goodsBack/getGoodBack',
    // 查询总售卖金额
    getOrderMoneyUrl: config.host +'MicroPlatform/order/getOrderMoney',
    // 查询每笔订单的金额
    getOneOrderMoneyUrl: config.host + 'MicroPlatform/order/getOneOrderMoney',
    // 按天/月查询订单金额
    getMoneyByDayUrl: config.host + 'MicroPlatform/order/getMoneyByDay',
    // 修改商家信息
    updateInfoUrl: config.host +'MicroPlatform/shop/updateInfo',
    // 查询商家信息
    getShopUrl: config.host +'MicroPlatform/shop/getShop',
    // 查询单个商家信息
    getShopByCodeurl: config.host +'MicroPlatform/shop/getShopByCode',
    // 查所有银行卡
    getCardByCodeUrl: config.host +'MicroPlatform/shop/getCardByCode',
    // 设为默认银行卡
    updateCardDefaultUrl: config.host +'MicroPlatform/shop/updateCardDefault',
    // 添加银行卡
    insertCardUrl: config.host +'MicroPlatform/shop/insertCard',
    // 删除银行卡
    deleteCardUrl: config.host +'MicroPlatform/shop/deleteCard',
    // 添加单个物流信息
    insertTransInfoUrl: config.host +'MicroPlatform/transInfo/insertTransInfo',
    // 获取单个物流信息
    getTransInfoUrl: config.host +'MicroPlatform/transInfo/getTransInfo',
    // 查询收藏商店的用户
    getUserByCodeUrl: config.host +'MicroPlatform/shop/getUserByCode',
    // 商家提现
    withdrawUrl: config.host + 'MicroPlatform/shop/withdraw',
    //  查询提现记录
    getWithdrawalUrl: config.host + 'MicroPlatform/shop/getWithdrawal',
    // 修改退换货状态
    updateBackStatusUrl: config.host + 'MicroPlatform/goodsBack/updateBackStatus',
    // 获取分组
    getGroupUrl: config.host + 'MicroPlatform/group/getGroup',
    // 商店注册
    insertShopUrl: config.host + 'MicroPlatform/shop/insertShop',
    // 发送验证码
    getSmsUrl: config.host + 'MicroPlatform/user/getSms',
    // 根据user_id获取shop_code
    getShopCodeUrl: config.host + 'MicroPlatform/shop/getShopCode',
    // 根据user_id获取用户信息
    getUserUrl: config.host + 'MicroPlatform/user/getUser',
    //  查询用户拥有优惠券
    getUserCouponUrl: config.host + 'MicroPlatform/coupon/getUserCoupon',
    // 添加优惠券
    insertCouponUrl: config.host + 'MicroPlatform/coupon/insertCoupon',
    // 根据店铺查询优惠券
    getCouponUrl: config.host + 'MicroPlatform/coupon/getCoupon',
    // 删除优惠券
    deleteCouponUrl: config.host + 'MicroPlatform/coupon/deleteCoupon',
    // 领取优惠券
    insertUCUrl: config.host + 'MicroPlatform/coupon/insertUC',
    // 根据分组查询外卖商店
    getFoodsShopUrl: config.host + 'MicroPlatform/shop/getFoodsShop',
    // 根据user_id获取用户收货地址
    getAddrUrl: config.host + 'MicroPlatform/address/getAddr',
    // 根据shop_code查单个外卖商家
    getOutShopByCodeUrl: config.host + 'MicroPlatform/shop/getOutShopByCode',
    // 获取外卖店铺类别
    getFoodClassUrl: config.host + 'MicroPlatform/foodgoods/getFoodClass',
    // 获取外卖店铺商品列表
    getFoodGoodsUrl: config.host + 'MicroPlatform/foodgoods/getFoodGoods',
    // 获取商品详情
    getFoodGoodsDetailsUrl: config.host + 'MicroPlatform/foodgoods/getFoodGoodsDetails',

    
}