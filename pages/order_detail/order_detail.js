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
    orderInvoice: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      orderId: options.orderid
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
  handleOrderDetail: function () {
    let query = app.query('com.zenith.api.apis.OrderDetailApiService');
    let body = Object.assign(app.commonBody(), { orderId: this.data.orderId });
    app.request(query, body, (res) => {
      console.log(res);
      this.orderStatusFormat(res.order.statusAt);
      this.setData({
        detail: res.order,
        orderInvoice: res.orderInvoice,
        orderTime: util.formatTime(new Date(res.order.orderTime)),
        payTime: util.formatTime(new Date(res.order.payTime))
      })
    }, (err) => {
      console.error(err);
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
      url: '../invoice/invoice?title=' + e.currentTarget.dataset.title + '&taxNumber=' + e.currentTarget.dataset.taxnumber,
    })
  },
  changeCompany: function (name, number) {
    this.setData({
      company_name: name,
      taxNumber: number
    });
  }
})