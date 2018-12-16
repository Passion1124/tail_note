Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: '',
    taxNumber: '',
    disabled: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    if (options.title !== 'undefined' && options.taxNumber !== 'undefined') {
      this.setData({
        title: options.title,
        taxNumber: options.taxNumber,
        disabled: true
      })
    }
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
  chooseInvoiceTitle: function () {
    wx.chooseInvoiceTitle({
      success: (res) => {
        console.log(res);
        this.setData({
          title: res.title,
          taxNumber: res.taxNumber
        })
      },
      fail: function (res) {
        console.error(res);
      },
      complete: function (res) { },
    })
  },
  changeCompanyName: function (e) {
    this.setData({
      title: e.detail.value
    })
  },
  changeCompanyTaxNumber: function (e) {
    this.setData({
      taxNumber: e.detail.value
    })
  },
  confirmRevision: function () {
    var pages = getCurrentPages();
    // console.log(pages);
    if (pages.length > 1) {
      var prePage = pages[pages.length - 2];
      prePage.changeCompany(this.data.title, this.data.taxNumber);
      wx.navigateBack()
    }
  }
})