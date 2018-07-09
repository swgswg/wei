const urlData = require('data.js');
const util = require('./util.js');
const calculate = require('./calculate.js');
const app = getApp();
var env = require('../libs/weixinFileToaliyun/env.js');
var uploadAliyun = require('../libs/weixinFileToaliyun/uploadAliyun.js');
const amapFile = require('../libs/amap-wx.js');
const config = require('./config.js');

module.exports = {

    requestUrl: function (data, url, callback, pageobj) {
        wx.request({
            url: url,
            data: data,
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            method: 'POST',
            success: function (res) {
                if (res.data.state == 1) {
                    callback.apply(pageobj, [res.data.data])
                    // console.log(res)
                } else {
                    wx.showModal({
                        title: '提示',
                        content: res.data.message,
                        showCancel: false
                    })
                }
            },
            complete: function () {
            }
        })
    },

    httpRequest: function (data, url, callback, pageobj) {
        wx.request({
            url: url,
            data: data,
            header: {
                'Content-Type': 'application/json'
            },
            success: function (res) {
                if (res.statusCode != 200) {
                    wx.showModal({
                        title: '提示',
                        content: "error:接口请求错误",
                        showCancel: false
                    })
                } else {
                    callback.apply(pageobj, [res.data]);
                    if (res.data.status != 2 && res.data.status != 1) {
                        wx.showModal({
                            title: '提示',
                            content: res.data.msg,
                            showCancel: false
                        })
                    }
                }
            },
            fail: function () {
                wx.showModal({
                    title: '提示',
                    content: "error:网络请求失败",
                    showCancel: false
                })
            }
        })
    },
    /**
     * 获取定位二次封装
     */
    amapFilePackage(sucFun, errFun) {
        let myAmapFun = new amapFile.AMapWX({ key: config.wxGaodeMapKey });
        myAmapFun.getRegeo({
            success: function (data) {
                //成功回调
                // console.log(data)
                // that.setData({
                //     locationName: data[0].regeocodeData.pois[0].name
                // });
                sucFun(data)
            },
            fail: function (info) {
                //失败回调
                // console.log(info)
                errFun(info);
            }
        })
    },

    getShareData: function (mmodule, callback, pageobj) {
        let that = this;
        let data = {
            token: urlData.duoguan_user_token,
            mmodule: mmodule,
            _: Date.now()
        };
        let res = this.requestUrl(data, urlData.duoguan_get_share_data_url, callback, pageobj)
    },

    getSwiperList: function (callback, pageobj) {
        var that = this;
        var data = {
            token: urlData.duoguan_user_token,
            _: Date.now()
        };
        var res = this.requestUrl(data, urlData.duoguan_swiper_url, callback, pageobj)
    },

    dishPostOrderComment: function (utoken, oid, fval, fcon, callback, pageobj) {
        var data = {
            token: urlData.duoguan_user_token,
            utoken: utoken,
            oid: oid,
            fval: fval,
            fcon: fcon,
            _: Date.now()
        };
        this.requestUrl(data, urlData.duoguan_dish_post_comment_order, callback, pageobj)
    },


    // 对订单数据的处理
    //   dealOrderData: function (data) {
    //     // console.log(data);
    //     let newData = data;
    //     let order = [];
    //     let k = 0;
    //     let newDataLen = newData.length;
    //     let newOrder = {};
    //     // 把订单号提取出来成为一个新的对象
    //     for (let i = 0; i < newDataLen; i++) {
    //       newOrder[newData[i].order_uuid] = [];
    //     }
    //     // console.log(newOrder)

    //     // 把订单号相同的放到一个数组里
    //     for (let key in newOrder) {
    //       for (let j = 0; j < newDataLen; j++) {
    //         if (newData[j].order_uuid == key) {
    //           newOrder[key].push(newData[j]);

    // // 对订单数据的处理
    dealOrderData: function (data) {
        // console.log(data);
        let newData = data;
        let order = [];
        let k = 0;
        let newDataLen = newData.length;
        let newOrder = {};
        // 把订单号提取出来成为一个新的对象
        for (let i = 0; i < newDataLen; i++) {
            newOrder[newData[i].order_uuid] = [];
        }
        // 将每个对象里的数组转化为对象
        for (let key in newOrder) {
            newOrder[key] = { goods: newOrder[key] }
        }

        let orderArr = [];
        for (let key in newOrder) {
            newOrder[key].order_uuid = newOrder[key].goods[0].order_uuid;
            newOrder[key].createTime = newOrder[key].goods[0].createTime;
            newOrder[key].addr_receiver = newOrder[key].goods[0].addr_receiver;
            newOrder[key].addr_mobile = newOrder[key].goods[0].addr_mobile;
            newOrder[key].area_path = newOrder[key].goods[0].area_path;
            newOrder[key].area_detail = newOrder[key].goods[0].area_detail;
            newOrder[key].addr_id = newOrder[key].goods[0].addr_id;
            newOrder[key].real_money = newOrder[key].goods[0].real_money;
            newOrder[key].status = newOrder[key].goods[0].status;
            newOrder[key].order_mainid = newOrder[key].goods[0].order_mainid;
            newOrder[key].order_addresss = newOrder[key].goods[0].order_addresss;
            // 计算每个订单的总价
            let sum = 0;
            let goods_len = newOrder[key].goods.length;
            for (let j = 0; j < goods_len; j++) {
                newOrder[key].goods[j].sum = calculate.calcMul(newOrder[key].goods[j].num, newOrder[key].goods[j].goodsPrice);
                sum = calculate.calcAdd(sum, newOrder[key].goods[j].sum);
            }
            // 订单小数部分没有,转换成带2位小数的
            sum = String(sum).split('.');
            if (sum[1] == undefined || sum[1] == '' || sum[1] == null) {
                sum.push('00');
            } else if (sum[1].length == 1) {
                sum[1] = sum[1] + '0';
            }
            sum = sum.join('.');
            newOrder[key].sumPrice = sum;
            orderArr.push(newOrder[key]);
        }
        return orderArr;
    },

    //对同一店铺的数据处理 
    dealShop_code: function (data) {
        // console.log(data);
        let newData = data;
        let order = [];
        let k = 0;
        let newDataLen = newData.length;
        let newShop = {};
        // 把订单号提取出来成为一个新的对象
        for (let i = 0; i < newDataLen; i++) {
            newShop[newData[i].shop_code] = [];
        }
        // console.log(newShop)

        // 把订单号相同的放到一个数组里
        for (let key in newOrder) {
            for (let j = 0; j < newDataLen; j++) {
                if (newData[j].order_uuid == key) {
                    newOrder[key].push(newData[j]);
                }
            }

        }

        // 将每个对象里的数组转化为对象
        for (let key in newOrder) {
            newOrder[key] = { goods: newOrder[key] }
        }
        // console.log(newOrder)


        let orderArr = [];
        for (let key in newShop) {
            newShop[key].shop_code = newShop[key].goods[0].shop_code;
            newShop[key].reduction = newShop[key].goods[0].reduction;
            newShop[key].shop_name = newShop[key].goods[0].shop_name;
            newShop[key].user_id = newShop[key].goods[0].user_id;
            orderArr.push(newShop[key]);
        }
        console.log(orderArr)
        return orderArr;
    },




    // 头像上传
    /**
     * 上传图片二次封装
     */
    myUpload: function (sufun) {
        wx.chooseImage({
            count: 1,
            sizeType: ['original', 'compressed'],
            sourceType: ['album', 'camera'],
            // 上传文件
            success: function (res) {
                // console.log(res)
                let tempFilePaths = res.tempFilePaths;
                // 临时文件路径
                let filePath = tempFilePaths[0];
                let ext = filePath.slice(filePath.lastIndexOf('.') + 1);
                let extArr = ['png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp', 'tiff'];
                // console.log(extArr.indexOf(ext));
                if (extArr.indexOf(ext) != -1) {
                    // 上传文件
                    uploadAliyun(filePath, function (fileNmae) {
                        let newsrc = env.aliyunServerURL + fileNmae;
                        // console.log(env.aliyunServerURL);
                        console.log(newsrc);
                        // that.setData({
                        // profile: newsrc
                        // });
                        sufun(newsrc, fileNmae);
                        // 头像上传数据库
                        // util.myWxRequest(app.globalData.updateUserInfoPhotoUrl, { photo: fileNmae }, function (res) {
                        // wx.showToast({
                        // icon: 'success',
                        // title: '修改成功'
                        // });
                        // })
                    }, function () {
                    });
                } else {
                    wx.showToast({
                        title: '图片格式不正确',
                        icon: 'none'
                    })

                }

            }
        })
    },


    // 分类列表获取商家分组
    getGroup: function (group, pageobj) {
        var that = this
        this.requestUrl({}, urlData.getGroupUrl, group, pageobj)
    },

    // 分类列表获取商家分类
    getShopUrl: function (groupids, pages, pasesize, classify, pageobj) {
        let that = this
        let data = {
            groupId: groupids,
            page: pages,
            pageSize: pasesize
        };
        let res = this.requestUrl(data, urlData.getShopUrl, classify, pageobj)
    },

    // 获取商品分类
    getClassUrl: function (gid, Slist, pageobj) {
        // console.log(gid)
        let that = this
        let data = {
            groupId: gid
        };
        this.requestUrl(data, urlData.getClassUrl, Slist, pageobj)
    },

    // 获取商品列表
    getGoodsUrl: function (shop_code, listId, codelist, pageobj) {
        let that = this
        let data = {
            shopCode: shop_code,
            page: urlData.page,
            pageSize: urlData.pageSize,
            isUse: urlData.isuse,
            classId: listId
        }
        this.requestUrl(data, urlData.getGoodsUrl, codelist, pageobj)
    },

    // 获取商品详情
    getGoodsDetails(goods_id, shopsCode, goods, pageobj) {
        let that = this
        let data = {
            goodsId: goods_id,
            shop_code: shopsCode
        }
        this.requestUrl(data, urlData.getGoodsDetailsUrl, goods, pageobj)
    },

    // // 获取商品分类
    // getClassUrl: function (gid, Slist, pageobj) {
    //     // console.log(gid)
    //     let that = this
    //     let data = {
    //         groupId: gid
    //     };
    //     this.requestUrl(data, urlData.getClassUrl, Slist, pageobj)
    // },


    // 获取评论
    getComment(goods_id, comment, pageobj) {
        let that = this
        let data = {
            goodsId: goods_id
        }
        this.requestUrl(data, urlData.getCommentUrl, comment, pageobj)
    },

    // 添加到购物车
    insertGoodsCart(goods_id, shopcode, cart_default_number, color, size, typee, volume, taste, insert, pageobj) {
        let that = this
        let data = {
            user_id: app.globalData.user_id,
            goods_id: goods_id,
            num: cart_default_number,
            shop_code: shopcode,
            color: color,
            size: size,
            type: typee,
            volume: volume,
            taste: taste
        }
        this.requestUrl(data, urlData.insertGoodsCartUrl, insert, pageobj)
    },

    // 查看购物车信息
    getGoodsCart(cart, pageobj) {
        let data = {
            user_id: app.globalData.user_id
        }
        this.requestUrl(data, urlData.getGoodsCartUrl, cart, pageobj)
    },

    // 修改购物车数量
    updateGoodsCart(cart, numss, updata, pageobj) {
        let data = {
            goods_cartsid: cart,
            num: numss
        }
        this.requestUrl(data, urlData.updateGoodsCartUrl, updata, pageobj)
    },

    // 查询所有订单
    getOrderUrl: function (page, pagesize, microplat, pageobj) {
        let data = {
            user_id: app.globalData.user_id,
            status: urlData.status,
            page: page,
            pageSize: pagesize
        }
        this.requestUrl(data, urlData.getOrderUrl, microplat, pageobj)
    },

    // 查询各种转态订单
    getOrderStatusUrl: function (myuserid, mystatus, page, pagesize, callback, pageobj) {
        let data = {
            user_id: myuserid,
            status: mystatus,
            page: page,
            pageSize: pagesize
        }
        this.requestUrl(data, urlData.getOrderUrl, callback, pageobj)
    },

    // 订单详情
    getOrderDetail(orderId, odetail, pageobj) {
        let data = {
            order_uuid: orderId
        }
        this.requestUrl(data, urlData.getOrderDetailUrl, odetail, pageobj)
    },

    // 查询地址
    getAddrUrl(address, pageobj) {
        let data = {
            user_id: app.globalData.user_id
        }
        this.requestUrl(data, urlData.getAddrUrl, address, pageobj)
    },

    // 删除地址
    deleteAddrUrl(deletes, addressId, pageobj) {
        let data = {
            addr_id: addressId
        }
        this.requestUrl(data, urlData.deleteAddrUrl, deletes, pageobj)
    },

    // 添加地址
    addAddrUrl(add, address, pageobj) {
        if (address.is_default == true) {
            address.is_default == 1
        } else {
            address.is_default == 0
        }
        console.log(address.is_default)
        let data = {
            user_id: app.globalData.user_id,
            addr_receiver: address.addr_receiver,
            addr_mobile: address.mobile,
            area_path: address.area_path,
            area_detail: address.area_detail,
            is_default: address.is_default
        }
        this.requestUrl(data, urlData.addAddrUrl, add, pageobj)
    },


    // // 修改个人地址
    // updateAddr(updata, address, addressId, pageobj) {
    //   let data = {
    //     addr_receiver: address.addr_receiver,
    //     addr_mobile: address.addr_mobile,
    //     area_path: address.area_path,
    //     area_detail: address.area_detail,
    //     addr_id: addressId
    //   }
    //   this.requestUrl(data, urlData.updateAddrUrl, updata, pageobj)
    // },

    // 查询单个地址
    getAddrById(addinfo, addId, pageobj) {
        let data = {
            addr_id: addId
        }
        this.requestUrl(data, urlData.getAddrByIdUrl, addinfo, pageobj)
    },
    // 修改个人地址
    updateAddr(updata, address, addressId, pageobj) {
        let data = {
            addr_receiver: address.addr_receiver,
            addr_mobile: address.addr_mobile,
            area_path: address.area_path,
            area_detail: address.area_detail,
            addr_id: addressId
        }
        this.requestUrl(data, urlData.updateAddrUrl, updata, pageobj)
    },

    // 设置默认
    updateAddrDefault(addId, sdefault, pageobj) {
        let data = {
            addr_id: addId
        }
        this.requestUrl(data, urlData.updateAddrDefaultUrl, sdefault, pageobj)
    },

    // 删除购物车
    deleteGoodsCart(deletes, cid, pageobj) {
        let data = {
            goods_cartsid: cid
        }
        this.requestUrl(data, urlData.deleteGoodsCartUrl, deletes, pageobj)
    },

    // 模糊查询商品
    getGoodsByName(arrayVal, shop_code, gets, pageobj) {
        let data = {
            goods_name: arrayVal,
            shop_code: shop_code
        }
        this.requestUrl(data, urlData.getGoodsByNameUrl, gets, pageobj)
    },

    // 查询默认收货地址
    getAddrByDefault(maddress, pageobj) {
        console.log(app.globalData.user_id)
        let data = {
            user_id: app.globalData.user_id
        }
        this.requestUrl(data, urlData.getAddrByDefaultUrl, maddress, pageobj)
    },

    // 添加收藏
    insterCollect(shopcode, collect, pageobj) {
        let data = {
            shopCode: shopcode,
            userId: app.globalData.user_id
        }
        this.requestUrl(data, urlData.insterCollectUrl, collect, pageobj)
    },

    // 查看收藏
    getCollect(pages, pagesize, collects, pageobj) {
        // console.log(pages)
        let data = {
            userId: app.globalData.user_id,
            page: pages,
            pageSize: pagesize
        }
        this.requestUrl(data, urlData.getCollectUrl, collects, pageobj)
    },

    // 查询默认收货地址
    getAddrByDefault(maddress, pageobj) {
        let data = {
            user_id: app.globalData.user_id
        }
        this.requestUrl(data, urlData.getAddrByDefaultUrl, maddress, pageobj)
    },

    // 取消收藏
    delectCollect(shopcode, remov, pageobj) {
        let data = {
            shopCode: shopcode,
            userId: app.globalData.user_id
        }
        this.requestUrl(data, urlData.delectCollectUrl, remov, pageobj)
    },

    // 商家注册
    insertShop(insert, mimg, arrays, pageobj) {
        let data = {
            user_id: app.globalData.user_id,
            level: urlData.level,
            owner: arrays.owner,
            mobile: arrays.mobile,
            shop_name: arrays.shop_name,
            logo: mimg,
            shop_detail: arrays.shop_detail,
            shop_addr: arrays.shop_addr,
            account: arrays.account
        }
        this.requestUrl(data, urlData.insertShopUrl, insert, pageobj)
    },

    // 修改用户呢称
    updateUserInfo(user_name, uname, pageobj) {
        let data = {
            user_name: user_name,
            user_id: app.globalData.user_id,
        }
        this.requestUrl(data, urlData.updateUserInfoUrl, uname, pageobj)
    },
    // 修改用户电话
    updateUserphone(telephone, uphone, pageobj) {
        let data = {
            telephone: telephone,
            user_id: app.globalData.user_id
        }
        this.requestUrl(data, urlData.updateUserInfoUrl, uphone, pageobj)
    },
    // 修改用户头像
    updateUserphoto(mimg, imgs, pageobj) {
        let data = {
            photo: mimg,
            user_id: app.globalData.user_id
        }
        this.requestUrl(data, urlData.updateUserInfoUrl, imgs, pageobj)
    },

    // 查询个人用户信息
    getUserurl(userinfo, pageobj) {
        let data = {
            user_id: app.globalData.user_id
        }
        this.requestUrl(data, urlData.getUserUrl, userinfo, pageobj)
    },

    // 订单退货
    insertGoodBack(oid, gid, price, status, str, ginfo, nums, ti, pageobj) {
        let data = {
            order_uuid: oid,
            goodsId: gid,
            reason: str,
            price: price,
            status: status,
            color: ginfo.color,
            size: ginfo.size,
            type: ginfo.type,
            volume: ginfo.volume,
            taste: ginfo.taste,
            num: nums
        }
        this.requestUrl(data, urlData.insertGoodBackUrl, ti, pageobj)
    },

    // 商品评价
    insertComment(gid, detail, key, photo, mainid, assess, pageobj) {
        let data = {
            goodsId: gid,
            user_id: app.globalData.user_id,
            detail: detail,
            grade: key,
            img: photo,
            status: 5,
            order_mainid: mainid
        }
        this.requestUrl(data, urlData.insertCommentUrl, assess, pageobj)
    },

    // 商品分组
    getGroup(gets, pageobj) {
        this.requestUrl("", urlData.getGroupUrl, gets, pageobj)
    },

    // 店铺的信息
    getShopByCode(shop_code, shops, pageobj) {
        let data = {
            shop_code: shop_code
        }
        this.requestUrl(data, urlData.getShopByCodeUrl, shops, pageobj)
    },

    // 搜索店铺
    getShopByName(arrayVal, pages, pasesize, gets, pageobj) {
        let data = {
            shop_name: arrayVal,
            page: pages,
            pageSize: pasesize
        }
        this.requestUrl(data, urlData.getShopByNameUrl, gets, pageobj)
    },

    // 修改订单状态
    updateOrderStatus: function (myorder_mainid, mystatus, callback, pageobj) {
        let data = {
            order_mainid: myorder_mainid,
            status: mystatus,
        }
        this.requestUrl(data, urlData.updateOrderStatusUrl, callback, pageobj)
    },


    // 添加订单
    insertOrder: function (goodsId, num, price, carts_price, color, size, typee, volume, taste, mytotal_money, myreal_money, addid, status, shopcode, orders, pageobj) {
        let data = {
            user_id: app.globalData.user_id,
            total_money: mytotal_money,
            real_money: myreal_money,
            addr_id: 1,
            goodsId: goodsId,
            num: num,
            price: price,
            carts_price: carts_price,
            status: status,
            color: color,
            size: size,
            type: typee,
            volume: volume,
            taste: taste,
            shop_code: shopcode
        }
        this.requestUrl(data, urlData.insertOrderUrl, orders, pageobj)
    },

    // 查询用户是否有优惠券
    getUserCoupon: function (uid, page, pageSize, able, pageobj) {
        let data = {
            user_id: uid,
            page: page,
            pageSize: pageSize
        }
        this.requestUrl(data, urlData.getUserCouponUrl, able, pageobj)
    },

    // 添加订单
    insertOrder: function (goodsId, num, price, carts_price, color, size, typee, volume, taste, mytotal_money, myreal_money, addid, status, shopcode, orders, pageobj) {
        let data = {
            user_id: app.globalData.user_id,
            total_money: mytotal_money,
            real_money: myreal_money,
            addr_id: addid,
            goodsId: goodsId,
            num: num,
            price: price,
            carts_price: carts_price,
            status: status,
            color: color,
            size: size,
            type: typee,
            volume: volume,
            taste: taste,
            shop_code: shopcode
        }
        this.requestUrl(data, urlData.insertOrderUrl, orders, pageobj)
    },

    // 删除订单
    deleteOrder: function (myorder_mainid, callback, pageobj) {
        this.requestUrl({ order_mainid: myorder_mainid }, urlData.deleteOrderUrl, callback, pageobj);
    },

    dishImgUpload: function (pid, utoken, imgurl, cb) {
        wx.uploadFile({
            url: urlData.duoguan_dish_imgupload_url,
            filePath: imgurl,
            name: 'file',
            formData: {
                token: urlData.duoguan_user_token,
                utoken: utoken,
                pid: pid,
                img: photo
            },
            success: function (res) {
                cb(res.data)
            }
        })
    },

}