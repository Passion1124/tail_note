const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    address: '',
    phone: '',
    nickname: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    wx.hideShareMenu();
    this.setData({
      nickname: options.nickname,
      phone: options.phone,
      address: options.address
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
  handleUserUpdate: function () {
    let data = this.data;
    let query = app.query('com.zenith.api.apis.UserUpdateApiService');
    let body = Object.assign(app.commonBody(), { nickname: data.nickname, phone: data.phone, address: data.address });
    app.request(query, body, res => {
      console.log(res);
      this.handleSureChangeUserInfo();
    }, err => {
      console.error(err);
    })
  },
  handleSureChangeUserInfo: function () {
    var pages = getCurrentPages();
    if (pages.length > 1) {
      var prePage = pages[pages.length - 2];
      prePage.changeNicknameAndPhone(this.data.nickname, this.data.phone);
      wx.navigateBack()
    }
  },
  nicknameInput: function (e) {
    this.setData({
      nickname: e.detail.value
    })
  },
  phoneInput: function (e) {
    this.setData({
      phone: e.detail.value
    })
  },
  addressInput: function (e) {
    this.setData({
      address: e.detail.value
    })
  }
})