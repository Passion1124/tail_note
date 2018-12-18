const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.handleUserDetail();
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
  handleUserDetail: function () {
    let query = app.query('com.zenith.api.apis.UserDetailApiService');
    let body = app.commonBody();
    app.request(query, body, res => {
      console.log(res);
      this.setData({
        userInfo: res.user
      });
    }, err => {
      console.error(err);
    })
  },
  changeNicknameAndPhone: function (nickname, phone) {
    let userInfo = this.data.userInfo;
    userInfo.nickname = nickname;
    userInfo.phone = phone;
    this.setData({
      userInfo: userInfo
    })
  },
  goToTheAllOrder: function (e) {
    wx.navigateTo({
      url: '../all_order/all_order?currentTab=' + e.currentTarget.dataset.currenttab,
    })
  },
  goToTheCollect: function () {
    wx.navigateTo({
      url: '../list/list?source=my_collection&category=我的收藏',
    })
  },
  goToTheUserInfo: function (e) {
    let data = e.currentTarget.dataset;
    wx.navigateTo({
      url: '../user_info/user_info?nickname=' + data.nickname + '&phone=' + data.phone,
    })
  }
})