var util = require('../../../utils/util.js');
const utilFunctions = require('../../../utils/functionData.js');
const URLData = require('../../../utils/data.js');
var app = getApp();
Page({
  data: {
    address: {
      id:0,
      area_path:"",
      area_detail: '',
      addr_receiver: '',
      addr_mobile: '',
      is_default: 0,
      locationName:'',
    },
    region: ['广东省', '广州市', '海珠区'],
    area_path:"",
    city:"",
    addressId: 0,
    selects:false
  },
  bindinputMobile(event) {
    let address = this.data.address;
    address.mobile = event.detail.value;
    this.setData({
      address: address
    });
  },

  // 收货人
  bindinputName(event) {
    let address = this.data.address;
    address.addr_receiver = event.detail.value;
    this.setData({
      address: address
    });
  },

  // 收货电话
  bindinputAddress (event){
    let address = this.data.address;
    address.addr_mobile = event.detail.value;
    this.setData({
      address: address
    });
  },

  // 省市
  bindinputCity(event) {
    let address = this.data.address;
    address.area_path = event.detail.value;
    this.setData({
      address: address
    });
  },

  // 详细地址
  bindinputInfo(event) {
    // console.log(event)
    let address = this.data.address;
    address.area_detail = event.detail.value;
    this.setData({
      address: address
    });
  },

  // 是否为默认
  bindIsDefault(){
    let address = this.data.address;
    address.is_default = address.is_default ? 0: 1;
    this.setData({
      address: address
    });
  },

  setRegionDoneStatus() {
    let that = this;
    let doneStatus = that.data.selectRegionList.every(item => {
      return item.id != 0;
    });
    that.setData({
      selectRegionDone: doneStatus
    })
  },

  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    // console.log(options)
    // if (options.id) {
    //   this.setData({
    //     addressId: options.id
    //   });
    //   this.getAddressDetail();
    // }

    // this.getRegionList(1);

  },
  onReady: function () {

  },
  cancelSelectRegion() {
    this.setData({
      openSelectRegion: false,
      regionType: this.data.regionDoneStatus ? 3 : 1
    });

  },

  cancelAddress(){
    wx.navigateTo({
      url: '/pages/user/address/address',
    })
  },

  /**
   *保存地址 
   */ 
  saveAddress(){
    // console.log(this.data.address)
    let that=this
    let address = this.data.address;
    // console.log(that.data.address)
    if (!util.checkReg(1, that.data.address.mobile)) {
      wx.showToast({
        icon: 'none',
        title: '手机号不正确'
      });
      return;
    }

    if (that.data.address.addr_receiver == "") {
      wx.showToast({
        icon: 'none',
        title: '用户名不能为空'
      });
      return;
    }

    if (that.data.address.area_detail == "") {
      wx.showToast({
        icon: 'none',
        title: '详细地址不能为空'
      });
      return;
    }

    if (that.data.address.area_path == "") {
      wx.showToast({
        icon: 'none',
        title: '地址不能为空'
      });
      return;
    }


    function add(res){
    }
    utilFunctions.addAddrUrl(add,that.data.address,this)
    wx.navigateTo({
      url: '/pages/user/address/address'
    })
    wx.showToast({
      icon: 'success',
      title: '添加成功'
    });

  },

  formSubmit(e){
      console.log(e)
  },

  /**
   * 省市级事件
   */ 
  bindRegionChange: function (e) {
    // console.log('picker发送选择改变，携带值为', e.detail.value)
    let address = this.data.address;
    address.area_path = e.detail.value;
    this.setData({
      city: e.detail.value,
      address: address
    })
  },

  onShow: function () {
    // 页面显示

  },
  onHide: function () {
    // 页面隐藏

  },
  onUnload: function () {
    // 页面关闭

  }
})