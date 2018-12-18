const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    result: '',
    orderId: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      result: options.result,
      orderId: options.orderId
    });
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
        detail: res.order
      })
    }, err => {
      console.error(err);
    })
  },
  // 预下单接口
  handlePrePay: function () {
    let query = app.query('com.zenith.api.apis.PrePayApiService');
    let body = Object.assign(app.commonBody(), { orderId: this.data.orderId });
    app.request(query, body, res => {
      console.log(res);
      this.handlePaySycnStatus(1);
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
      this.setData({
        result: 'success'
      })
    }, err => {
      if (num <= app.globalData.pollingNum) {
        this.handlePaySycnStatus(num + 1);
      } else {
        this.setData({
          result: 'fail'
        })
      }
      console.error(err);
    })
  },
  // 查看订单
  handleSeeOrder: function () {
    wx.navigateTo({
      url: '../order_detail/order_detail?orderid=' + this.data.orderId,
    })
  }
  // 再次购买
})