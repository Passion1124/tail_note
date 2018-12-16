const app = getApp();

var WxParse = require('../../wxParse/wxParse.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    indicatorDots: true,
    autoplay: false,
    interval: 5000,
    duration: 1000,
    checkedArray: [],
    num: 1,
    telephone: '',
    checkedDate: '',
    price: '',
    maxNum: 1,
    minusStatus: 'disabled',
    maxusStatus: 'normal',
    nextDisabled: true,
    mask: false,
    popup: false,
    gid: '',
    goods: {},
    goodsItems: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      gid: options.gid
    });
    this.getGoodDetail();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  },
  getGoodDetail: function () {
    let query = app.query('com.zenith.api.apis.GoodsDetailApiService');
    let body = Object.assign(app.commonBody(), { gid: this.data.gid });
    app.request(query, body, (res) => {
      console.log(res);
      WxParse.wxParse('article', 'html', res.goods.info, this, 5);
      wx.setNavigationBarTitle({
        title: res.goods.name,
      });
      let goodsItems = res.goodsItems.map(item => {
        item.checked = false;
        return item;
      })
      this.setData({
        price: res.goods.priceDesc,
        goods: res.goods,
        goodsItems: goodsItems
      });
      this.getFavorCheck();
    }, function (res) {
      console.log(res);
    })
  },
  getFavorCheck: function () {
    let query = app.query('com.zenith.api.apis.FavorCheckApiService');
    let body = Object.assign(app.commonBody(), { ids: [this.data.goods.uuid] });
    app.request(query, body, (res) => {
      console.log(res);
      let goods = this.data.goods;
      goods.collect = res.favorIds.indexOf(goods.uuid) !== -1 ? 'yes' : 'no';
      this.setData({
        goods: goods
      });
    }, function (res) {
      console.log(res);
    })
  },
  handleGoodFavor: function () {
    let query = app.query('com.zenith.api.apis.FavorApiService');
    let body = Object.assign(app.commonBody(), { gid: this.data.goods.uuid });
    app.request(query, body, (res) => {
      console.log(res);
      let goods = this.data.goods;
      goods.collect = 'yes';
      this.setData({
        goods: goods
      });
      wx.showToast({
        title: '收藏成功',
      })
    }, function (res) {
      console.log(res);
    })
  },
  handleGoodUnFavor: function () {
    let query = app.query('com.zenith.api.apis.UnFavorApiService');
    let body = Object.assign(app.commonBody(), { gid: this.data.goods.uuid });
    app.request(query, body, (res) => {
      console.log(res);
      let goods = this.data.goods;
      goods.collect = 'no';
      this.setData({
        goods: goods
      })
      wx.showToast({
        title: '已取消收藏',
      })
    }, function (res) {
      console.log(res);
    })
  },
  radioChange: function (e) {
    let checkDate = e.detail.value;
    let goodsItems = this.data.goodsItems.map(item => {
      item.uuid === checkDate ? item.checked = true : item.checked = false;
      return item;
    });
    let good = this.data.goodsItems.find(item => item.uuid === checkDate);
    let amount = good.amount;
    let maxNum = good.num;
    this.setData({
      price: '￥' + (amount / 100),
      maxNum: maxNum,
      checkDate: checkDate,
      goodsItems: goodsItems
    });
    this.changeNextButtonStatus();
  },
  // 点击减号
  bindMinus: function () {
    var num = this.data.num;
    // 如果大于1时，才可以减  
    if (num > 1) {
      num--;
    }
    // 只有大于一件的时候，才能normal状态，否则disable状态  
    var minusStatus = num <= 1 ? 'disabled' : 'normal';
    // 只有小于库存的时候，才能normal状态，否则disable状态  
    var maxusStatus = num < this.data.maxNum ? 'normal' : 'disabled';
    // 将数值与状态写回  
    this.setData({
      num: num,
      minusStatus: minusStatus,
      maxusStatus: maxusStatus
    });
    this.changeNextButtonStatus();
  },
  // 点击加号
  bindPlus: function () {
    var num = this.data.num;
    if (num < this.data.maxNum) {
      num++;
    }
    // 只有大于一件的时候，才能normal状态，否则disable状态  
    var minusStatus = num < 1 ? 'disabled' : 'normal';
    // 只有小于库存的时候，才能normal状态，否则disable状态  
    var maxusStatus = num < this.data.maxNum ? 'normal' : 'disabled';
    // 将数值与状态写回  
    this.setData({
      num: num,
      minusStatus: minusStatus,
      maxusStatus: maxusStatus
    });  
    this.changeNextButtonStatus();
  },
  // 输入框事件
  bindManual: function (e) {
    var num = e.detail.value;
    var minusStatus = num < 1 ? 'disabled' : 'normal';
    this.setData({
      num: num,
      minusStatus: minusStatus
    }); 
    this.changeNextButtonStatus();
  },
  // 关闭弹窗事件
  closeMaskAndPopup: function () {
    this.setData({
      mask: false,
      popup: false
    })
  },
  // 打开弹窗事件
  openMaskAndPopup: function () {
    this.setData({
      mask: true,
      popup: true
    })
  },
  // 修改按钮是否禁用状态
  changeNextButtonStatus: function () {
    let data = this.data;
    let disabled = true;
    if (data.checkDate && data.num && data.telephone) {
      disabled = false;
    };
    this.setData({
      nextDisabled: disabled
    })
  },
  goToThePayMent: function () {
    wx.navigateTo({
      url: '../payment/payment',
    })
  },
  bindTelePhone: function (e) {
    this.setData({
      telephone: e.detail.value
    });
    this.changeNextButtonStatus();
  }
})