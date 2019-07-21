const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    winHeight: "", //窗口高度
    currentTab: 0, //预设当前项的值
    scrollLeft: 0, //tab标题的滚动条位置
    all_order: [], // 全部订单
    pending_order: [], //待付款订单
    paid_order: [], // 已付款订单
    completed_order: [], // 已完成订单
    cancelled_order: [], // 已取消订单
    refunded_order: [], // 已退款订单
    all_order_body: {
      page: 1,
      size: 10
    },
    pending_order_body: {
      page: 1,
      size: 10,
      orderStatus: [0]
    },
    paid_order_body: {
      page: 1,
      size: 10,
      orderStatus: [1, 2]
    },
    completed_order_body: {
      page: 1,
      size: 10,
      orderStatus: [5]
    },
    cancelled_order_body: {
      page: 1,
      size: 10,
      orderStatus: [4]
    },
    refunded_order_body: {
      page: 1,
      size: 10,
      orderStatus: [3]
    },
    loading: {
      all_order: false,
      pending_order: false,
      paid_order: false,
      completed_order: false,
      cancelled_order: false,
      refunded_order: false
    },
    max: {
      all_order: false,
      pending_order: false,
      paid_order: false,
      completed_order: false,
      cancelled_order: false,
      refunded_order: false
    },
    update: {
      all_order: false,
      pending_order: false,
      paid_order: false,
      completed_order: false,
      cancelled_order: false,
      refunded_order: false
    },
    navHeight: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.hideShareMenu();
    var that = this;
    this.setData({
      currentTab: Number(options.currentTab),
      navHeight: app.globalData.navHeight
    });
    if (Number(options.currentTab) === 0) {
      this.handleAllOrderList();
    } else if (Number(options.currentTab) === 1) {
      this.handlePendingOrderList();
    } else if (Number(options.currentTab) === 2) {
      this.handlePaidOrderList();
    } else if (Number(options.currentTab) === 3) {
      this.handleCompletedOrderList();
    } else if (Number(options.currentTab) === 4) {
      this.handleCancelledOrderList();
    } else if (Number(options.currentTab) === 5) {
      this.handleRefundedOrderList();
    }
    //  高度自适应
    wx.getSystemInfo({
      success: function(res) {
        var clientHeight = res.windowHeight,
          clientWidth = res.windowWidth,
          rpxR = 750 / clientWidth;
        var calc = clientHeight * rpxR - 84 - (app.globalData.navHeight * rpxR);
        that.setData({
          winHeight: calc
        });
      }
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    // wx.showLoading({
    //   title: '拼命加载中...',
    // })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  // 获取全部订单
  handleAllOrderList: function () {
    wx.showLoading({
      title: '拼命加载中'
    })
    let query = app.query('com.zenith.api.apis.OrderListApiService');
    let body = Object.assign(app.commonBody(), this.data.all_order_body);
    this.changeLoadingData('all_order', true);
    app.request(query, body, (res) => {
      console.log(res);
      let arr = this.data.update.all_order ? [] : this.data.all_order;
      let all_order = arr.concat(res.orders.map(item => {
        item.statusText = this.orderStatusFormat(item.orderStatus);
        return item;
      }));
      let max = this.data.max;
      max.all_order = res.orders.length === this.data.all_order_body.size ? false : true;
      this.setData({
        all_order: all_order,
        max: max
      });
      this.data.update.all_order = false;
      this.changeLoadingData('all_order', false);
      wx.hideLoading();
    }, (err) => {
      wx.hideLoading();
      this.changeLoadingData('all_order', false);
      wx.showToast('接口有误');
      console.error(err);
    })
  },
  // 获取待付款订单
  handlePendingOrderList: function () {
    wx.showLoading({
      title: '拼命加载中'
    })
    let query = app.query('com.zenith.api.apis.OrderListApiService');
    let body = Object.assign(app.commonBody(), this.data.pending_order_body);
    this.changeLoadingData('pending_order', true);
    app.request(query, body, (res) => {
      console.log(res);
      let arr = this.data.update.pending_order ? [] : this.data.pending_order;
      let pending_order = arr.concat(res.orders.map(item => {
        item.statusText = this.orderStatusFormat(item.orderStatus);
        return item;
      }));
      let max = this.data.max;
      max.pending_order = res.orders.length === this.data.pending_order_body.size ? false : true;
      this.setData({
        pending_order: pending_order,
        max: max
      });
      this.data.update.pending_order = false;
      this.changeLoadingData('pending_order', false);
      wx.hideLoading();
    }, (err) => {
      wx.hideLoading();
      this.changeLoadingData('pending_order', false);
      wx.showToast('接口有误');
      console.error(err);
    })
  },
  // 获取已付款订单
  handlePaidOrderList: function () {
    wx.showLoading({
      title: '拼命加载中'
    })
    let query = app.query('com.zenith.api.apis.OrderListApiService');
    let body = Object.assign(app.commonBody(), this.data.paid_order_body);
    this.changeLoadingData('paid_order', true);
    app.request(query, body, (res) => {
      console.log(res);
      let arr = this.data.update.paid_order ? [] : this.data.paid_order;
      let paid_order = arr.concat(res.orders.map(item => {
        item.statusText = this.orderStatusFormat(item.orderStatus);
        return item;
      }));
      let max = this.data.max;
      max.paid_order = res.orders.length === this.data.paid_order_body.size ? false : true;
      this.setData({
        paid_order: paid_order,
        max: max
      });
      this.data.update.paid_order = false;
      this.changeLoadingData('paid_order', false);
      wx.hideLoading();
    }, (err) => {
      wx.hideLoading();
      this.changeLoadingData('paid_order', false);
      wx.showToast('接口有误');
      console.error(err);
    })
  },
  // 获取已完成订单
  handleCompletedOrderList: function () {
    wx.showLoading({
      title: '拼命加载中'
    })
    let query = app.query('com.zenith.api.apis.OrderListApiService');
    let body = Object.assign(app.commonBody(), this.data.completed_order_body);
    this.changeLoadingData('completed_order', true);
    app.request(query, body, (res) => {
      console.log(res);
      let arr = this.data.update.completed_order ? [] : this.data.completed_order;
      let completed_order = arr.concat(res.orders.map(item => {
        item.statusText = this.orderStatusFormat(item.orderStatus);
        return item;
      }));
      let max = this.data.max;
      max.completed_order = res.orders.length === this.data.completed_order_body.size ? false : true;
      this.setData({
        completed_order: completed_order,
        max: max
      });
      this.data.update.completed_order = false;
      this.changeLoadingData('completed_order', false);
      wx.hideLoading();
    }, (err) => {
      wx.hideLoading();
      this.changeLoadingData('completed_order', false);
      wx.showToast('接口有误');
      console.error(err);
    })
  },
  // 获取已取消订单
  handleCancelledOrderList: function () {
    wx.showLoading({
      title: '拼命加载中'
    })
    let query = app.query('com.zenith.api.apis.OrderListApiService');
    let body = Object.assign(app.commonBody(), this.data.cancelled_order_body);
    this.changeLoadingData('cancelled_order', true);
    app.request(query, body, (res) => {
      console.log(res);
      let arr = this.data.update.cancelled_order ? [] : this.data.cancelled_order;
      let cancelled_order = arr.concat(res.orders.map(item => {
        item.statusText = this.orderStatusFormat(item.orderStatus);
        return item;
      }));
      let max = this.data.max;
      max.cancelled_order = res.orders.length === this.data.cancelled_order_body.size ? false : true;
      this.setData({
        cancelled_order: cancelled_order,
        max: max
      });
      this.data.update.cancelled_order = false;
      this.changeLoadingData('cancelled_order', false);
      wx.hideLoading();
    }, (err) => {
      wx.hideLoading();
      this.changeLoadingData('cancelled_order', false);
      wx.showToast('接口有误');
      console.error(err);
    })
  },
  // 获取已退款订单
  handleRefundedOrderList: function () {
    wx.showLoading({
      title: '拼命加载中'
    })
    let query = app.query('com.zenith.api.apis.OrderListApiService');
    let body = Object.assign(app.commonBody(), this.data.refunded_order_body);
    this.changeLoadingData('refunded_order', true);
    app.request(query, body, (res) => {
      console.log(res);
      let arr = this.data.update.refunded_order ? [] : this.data.refunded_order;
      let refunded_order = arr.concat(res.orders.map(item => {
        item.statusText = this.orderStatusFormat(item.orderStatus);
        return item;
      }));
      let max = this.data.max;
      max.refunded_order = res.orders.length === this.data.refunded_order_body.size ? false : true;
      this.setData({
        refunded_order: refunded_order,
        max: max
      });
      this.data.update.refunded_order = false;
      wx.hideLoading();
      this.changeLoadingData('refunded_order', false);
    }, (err) => {
      wx.hideLoading();
      if (this.data.refunded_order_body.page > 1) this.data.refunded_order_body.page--;
      this.changeLoadingData('refunded_order', false);
      wx.showToast('接口有误');
      console.error(err);
    })
  },
  // 左右滑动的时候判断当前tab是否获取了数据
  handleGetOrderList: function () {
    if (this.data.currentTab === 0 && (!this.data.all_order.length || this.data.update.all_order)) {
      if (this.data.update.all_order) this.data.all_order_body.page = 1;
      this.handleAllOrderList();
    } else if (this.data.currentTab === 1 && (!this.data.pending_order.length || this.data.update.pending_order)) {
      if (this.data.update.pending_order) this.data.pending_order_body.page = 1;
      this.handlePendingOrderList();
    } else if (this.data.currentTab === 2 && (!this.data.paid_order.length || this.data.update.paid_order)) {
      if (this.data.update.paid_order) this.data.paid_order_body.page = 1;
      this.handlePaidOrderList();
    } else if (this.data.currentTab === 3 && (!this.data.completed_order.length || this.data.update.completed_order)) {
      if (this.data.update.completed_order) this.data.completed_order_body.page = 1;
      this.handleCompletedOrderList();
    } else if (this.data.currentTab === 4 && (!this.data.cancelled_order.length || this.data.update.cancelled_order)) {
      if (this.data.update.cancelled_order) this.data.cancelled_order_body.page = 1;
      this.handleCancelledOrderList();
    } else if (this.data.currentTab === 5 && (!this.data.refunded_order.length || this.data.update.refunded_order)) {
      if (this.data.update.refunded_order) this.data.refunded_order_body.page = 1;
      this.handleRefundedOrderList();
    }
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
    return item.text;
  },
  // 滚动切换标签样式
  switchTab: function(e) {
    this.setData({
      currentTab: e.detail.current
    });
    this.checkCor();
    this.handleGetOrderList();
  },
  // 点击标题切换当前页时改变样式
  swichNav: function(e) {
    var cur = e.target.dataset.current;
    if (this.data.currentTab == cur) {
      return false;
    } else {
      this.setData({
        currentTab: cur
      })
    }
    this.handleGetOrderList();
  },
  //判断当前滚动超过一屏时，设置tab标题滚动条。
  checkCor: function() {
    if (this.data.currentTab >= 4) {
      this.setData({
        scrollLeft: 320
      })
    } else {
      this.setData({
        scrollLeft: 0
      })
    }
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '所有订单',
      path: '/pages/index/index'
    }
  },
  // 滚动条触发事件
  scrolltolower: function (e) {
    console.log(e);
    if (e.currentTarget.dataset.current === '0' && !this.data.max.all_order && !this.data.loading.all_order) {
      let all_order_body = this.data.all_order_body;
      all_order_body.page++;
      this.setData({
        all_order_body: all_order_body
      })
      this.handleAllOrderList();
    } else if (e.currentTarget.dataset.current === '1' && !this.data.max.pending_order && !this.data.loading.pending_order) {
      let pending_order_body = this.data.pending_order_body;
      pending_order_body.page++;
      this.setData({
        pending_order_body: pending_order_body
      })
      this.handlePendingOrderList();
    } else if (e.currentTarget.dataset.current === '2' && !this.data.max.paid_order && !this.data.loading.paid_order) {
      let paid_order_body = this.data.paid_order_body;
      paid_order_body.page++;
      this.setData({
        paid_order_body: paid_order_body
      })
      this.handlePaidOrderList();
    } else if (e.currentTarget.dataset.current === '3' && !this.data.max.completed_order && !this.data.loading.completed_order) {
      let completed_order_body = this.data.completed_order_body;
      completed_order_body.page++;
      this.setData({
        completed_order_body: completed_order_body
      })
      this.handleCompletedOrderList();
    } else if (e.currentTarget.dataset.current === '4' && !this.data.max.cancelled_order && !this.data.loading.cancelled_order) {
      let cancelled_order_body = this.data.cancelled_order_body;
      cancelled_order_body.page++;
      this.setData({
        cancelled_order_body: cancelled_order_body
      })
      this.handleCancelledOrderList();
    } else if (e.currentTarget.dataset.current === '5' && !this.data.max.refunded_order && !this.data.loading.refunded_order) {
      let refunded_order_body = this.data.refunded_order_body;
      refunded_order_body.page++;
      this.setData({
        refunded_order_body: refunded_order_body
      })
      this.handleRefundedOrderList();
    }
  },
  changeLoadingData (files, value) {
    let loading = this.data.loading;
    loading[files] = value;
    this.setData({
      loading: loading
    })
  },
  changeUpdateValue: function () {
    let update = {
      all_order: true,
      pending_order: true,
      paid_order: true,
      completed_order: true,
      cancelled_order: true,
      refunded_order: true
    };
    this.setData({
      update: update
    });
    this.handleGetOrderList();
  },
  goToTheOrderDetail: function (e) {
    wx.navigateTo({
      url: '../order_detail/order_detail?orderid=' + e.currentTarget.dataset.orderid,
    })
  }
})