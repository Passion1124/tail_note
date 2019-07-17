const app = getApp();
const util = require('../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    detail: {},
    orderId: '',
    orderTime: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '拼命加载中'
    });
    wx.hideShareMenu();
    this.setData({
      orderId: options.orderId
    });
    this.handleOrderDetail();
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
  // 订单详情
  handleOrderDetail: function () {
    let query = app.query('com.zenith.api.apis.OrderDetailApiService');
    let body = Object.assign(app.commonBody(), { orderId: this.data.orderId });
    app.request(query, body, (res) => {
      console.log(res);
      this.setData({
        detail: res.order,
        orderTime: util.formatTime(new Date(res.order.orderTime)),
      });
      wx.hideLoading();
    }, err => {
      console.error(err);
      wx.hideLoading();
    })
  },
  // 预下单接口
  handlePrePay: function () {
    let query = app.query('com.zenith.api.apis.PrePayApiService');
    let body = Object.assign(app.commonBody(), { orderId: this.data.orderId });
    let _this = this;
    app.request(query, body, res => {
      console.log(res);
      wx.requestPayment({
        timeStamp: res.timeStamp,
        nonceStr: res.nonceStr,
        package: 'prepay_id=' + res.prepayId,
        signType: res.signType,
        paySign: res.paySign,
        success(res) {
          console.log(res);
          _this.handlePaySycnStatus(1);
        },
        fail(res) {
          console.error(res);
        }
      })
    }, err => {
      console.error(err);
    })
  },
  // 查询订单状态
  handlePaySycnStatus: function (num) {
    let query = app.query('com.zenith.api.apis.PaySyncApiService');
    let body = Object.assign(app.commonBody(), { orderId: this.data.orderId });
    app.request(query, body, res => {
      console.log(res);
      wx.navigateTo({
        url: '../pay_result/pay_result?result=success&orderId=' + this.data.orderId,
      })
    }, err => {
      if (num <= app.globalData.pollingNum) {
        this.handlePaySycnStatus(num + 1);
      } else{
        wx.navigateTo({
          url: '../pay_result/pay_result?result=fail&orderId=' + this.data.orderId,
        })
      }
      console.error(err);
    })
  }
})