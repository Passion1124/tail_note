const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    oid: '',
    body: '',
    header: '',
    disabled: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    if (options.body !== 'undefined' && options.header !== 'undefined') {
      this.setData({
        body: options.body,
        header: options.header,
        disabled: true
      })
    };
    this.setData({
      oid: options.oid
    })
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
          body: res.title,
          header: res.taxNumber
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
      body: e.detail.value
    })
  },
  changeCompanyTaxNumber: function (e) {
    this.setData({
      header: e.detail.value
    })
  },
  confirmRevision: function () {
    let query = app.query('com.zenith.api.apis.OrderInvoiceApiService');
    let body = Object.assign(app.commonBody(), { oid: this.data.oid, body: this.data.body, header: this.data.header });
    app.request(query, body, res => {
      console.log(res);
      wx.showToast({
        title: '发票信息保存成功',
      });
      var pages = getCurrentPages();
      if (pages.length > 1) {
        var prePage = pages[pages.length - 2];
        prePage.changeCompany(this.data.body, this.data.header);
        wx.navigateBack()
      }
    }, err => {
      console.error(err);
    })
  }
})