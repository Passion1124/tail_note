const app = getApp();
const util = require('../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    company_name: '',
    taxNumber: '',
    orderId: '',
    orderTime: '',
    payTime: '',
    detail: {},
    orderInvoice: null,
    orderItems: []
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      orderId: options.orderid
    });
    wx.showLoading({
      title: '拼命加载中'
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
    let pages = getCurrentPages();
    if (pages.length > 1) {
      let prePage = pages[pages.length - 2];
      if (prePage.route === 'pages/all_order/all_order') {
        prePage.changeUpdateValue();
      }
    }
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
      this.orderStatusFormat(res.order.orderStatus);
      this.setData({
        detail: res.order,
        // orderInvoice: res.orderInvoice,
        orderTime: util.formatTime(new Date(res.order.orderTime)),
        payTime: util.formatTime(new Date(res.order.payTime)),
        orderItems: res.orderItems
      });
      wx.hideLoading();
    }, (err) => {
      console.error(err);
      wx.hideLoading();
    })
  },
  // 取消订单
  handleOrderCancel: function () {
    let query = app.query('com.zenith.api.apis.OrderCancelApiService');
    let body = Object.assign(app.commonBody(), { orderId: this.data.orderId });
    app.request(query, body, (res) => {
      console.log(res);
      wx.showToast({
        title: '订单取消成功',
      });
      this.handleOrderDetail();
    }, err => {
      console.error(err);
    })
  },
  // 申请退款
  handleOrderRefund: function () {
    let query = app.query('com.zenith.api.apis.OrderRefundApiService');
    let body = Object.assign(app.commonBody(), { orderId: this.data.orderId });
    app.request(query, body, (res) => {
      console.log(res);
      wx.showToast({
        title: '申请退款成功',
      });
      this.handleOrderDetail();
    }, err => {
      console.error(err);
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
      } else {
        wx.navigateTo({
          url: '../pay_result/pay_result?result=fail&orderId=' + this.data.orderId,
        })
      }
      console.error(err);
    })
  },
  // 订单取消二次确认
  handleOrderCancelConfirm: function () {
    wx.showModal({
      title: '提示',
      content: '是否确认取消订单？',
      success: res => {
        if (res.confirm) {
          this.handleOrderCancel();
        }
      }
    })
  },
  // 申请退款二次确认
  handleOrderRefundConfirm: function () {
    wx.showModal({
      title: '提示',
      content: '是否发起退款申请？',
      success: res => {
        if (res.confirm) {
          this.handleOrderRefund();
        }
      }
    })
  },
  orderStatusFormat: function (status) {
    let array = [
      { value: 0, text: '待付款' },
      { value: 1, text: '已付款' },
      { value: 2, text: '退款中' },
      { value: 3, text: '已退款' },
      { value: 4, text: '已取消' },
      { value: 5, text: '已完成' }
    ];
    let item = array.find(item => item.value === status);
    wx.setNavigationBarTitle({
      title: item.text
    })
  },
  goToTheInvoice: function (e) {
    // console.log(e);
    wx.navigateTo({
      url: '../invoice/invoice?oid='+ this.data.orderId +'&body=' + e.currentTarget.dataset.title + '&header=' + e.currentTarget.dataset.taxnumber,
    })
  },
  goToTheOrderDetail (e) {
    wx.navigateTo({
      url: '../detail/detail?gid=' + e.currentTarget.dataset.gid,
    })
  },
  handleCopyFreightBillNo () {
    // this.data.orderInvoice.body
    wx.setClipboardData({
      data: this.data.detail.expressNo,
      success: function () {}
    })
  }
})