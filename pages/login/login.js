import utils from '../../utils/util.js'

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
    wx.hideShareMenu();
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
  getUserInfo (e) {
    console.log(e);
    if (e.detail.userInfo) {
      this.data.userInfo = e.detail.userInfo;
      this.getWeChatOpenId();
    } else {
      wx.showModal({
        title: '用户未授权',
        content: '如需正常使用小程序功能，请按确定并且在登录页面中点击登录按钮，同意授权。',
        showCancel: false,
        success: function (res) {
          console.log(res);
        }
      })
    }
  },
  getWeChatOpenId () {
    // 登录
    wx.login({
      success: res => {
        console.log(res);
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        if (res.code) {
          this.showLoading();
          this.handleWxLogin(res.code);
        }
      }
    })
  },
  handleWxLogin: function (code) {
    let query = app.query('com.zenith.api.apis.WXLoginApiService');
    let body = { code: code };
    app.request(query, body, res => {
      console.log(res);
      app.globalData.openId = res.openId;
      app.globalData.sessionKey = res.sessionKey;
      this.handleSocialLogin(res);
    }, err => {
      console.error(err);
      this.hideLoading();
    })
  },
  handleSocialLogin: function (info) {
    let query = app.query('com.zenith.api.apis.LoginApiService');
    let userInfo = this.data.userInfo;
    let body = { openId: info.openId, nickname: userInfo.nickName, avatar: userInfo.avatarUrl, sex: userInfo.gender, province: userInfo.province, city: userInfo.city, country: userInfo.country, regUid: userInfo.regUid }
    app.request(query, body, (res) => {
      console.log(res);
      app.globalData.auth = res.auth;
      app.globalData.uid = res.user.uuid;
      app.globalData.userInfo = res.user;
      wx.setStorageSync('user', res.user);
      let authority = { uid: res.user.uuid, auth: res.auth, openId: info.openId };
      wx.setStorageSync('authority', authority);
      utils.showMessage('登录成功', 'success');
      wx.navigateBack();
    }, function (res) {
      console.log(res);
      this.hideLoading();
    })
  },
  showLoading() {
    wx.showLoading({
      title: '登录中'
    })
  },
  hideLoading() {
    wx.hideLoading();
  }
})