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
    refunded_order: [] // 已退款订单
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    this.setData({
      currentTab: Number(options.currentTab)
    })
    //  高度自适应
    wx.getSystemInfo({
      success: function(res) {
        var clientHeight = res.windowHeight,
          clientWidth = res.windowWidth,
          rpxR = 750 / clientWidth;
        var calc = clientHeight * rpxR - 80;
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
  // 滚动切换标签样式
  switchTab: function(e) {
    this.setData({
      currentTab: e.detail.current
    });
    this.checkCor();
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
  scrolltolower: function () {
    console.log(123);
  },
  goToTheOrderDetail: function () {
    wx.navigateTo({
      url: '../order_detail/order_detail',
    })
  }
})