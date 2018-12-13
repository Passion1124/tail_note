//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    imgUrls: [
      'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg'
    ],
    indicatorDots: true,
    autoplay: false,
    interval: 5000,
    duration: 1000,
    category: [],
    page: 1,
    size: 10,
    foodsList: []
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    this.login();
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
    console.log(app);
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  goToTheList: function (e) {
    wx.navigateTo({
      url: '../list/list?category=' + e.currentTarget.dataset.category,
    })
  },
  goToTheOrderDetail: function (e) {
    wx.navigateTo({
      url: '../detail/detail?gid=' + e.currentTarget.dataset.gid,
    })
  },
  login: function () {
    let query = { appid: 'ZenithTail', api: 'com.zenith.api.apis.LoginApiService', version: '1.0', nonce: app.uuid(), timestamp: new Date().getTime()};
    let body = { openId: 'openId', nickname: '', avatar: '', unionid: 'unionid', sex: '', province: '', city: '', country: '', regUid: ''}
    app.request(app.dataFormat(query), body, (res) => {
      console.log(res);
      app.globalData.auth = res.auth;
      app.globalData.uid = res.user.uuid;
      this.getBanner();
      this.getCategoryList();
      this.getGoodList();
    }, function(res){
      console.log(res);
    })
  },
  getBanner: function () {
    let query = { appid: 'ZenithTail', api: 'com.zenith.api.apis.BannerListApiService', version: '1.0', nonce: app.uuid(), timestamp: new Date().getTime() };
    let body = { auth: app.globalData.auth, uid: app.globalData.uid}
    app.request(app.dataFormat(query), body, (res) => {
      console.log(res);
      this.setData({
        imgUrls: res.bannerList
      })
    }, function (res) {
      console.log(res);
    })
  },
  getCategoryList: function () {
    let query = { appid: 'ZenithTail', api: 'com.zenith.api.apis.CategoryListApiService', version: '1.0', nonce: app.uuid(), timestamp: new Date().getTime() };
    let body = { auth: app.globalData.auth, uid: app.globalData.uid }
    app.request(app.dataFormat(query), body, (res) => {
      console.log(res);
      this.setData({
        category: res.categoryList
      })
    }, function (res) {
      console.log(res);
    })
  },
  getGoodList: function () {
    let query = { appid: 'ZenithTail', api: 'com.zenith.api.apis.GoodsListApiService', version: '1.0', nonce: app.uuid(), timestamp: new Date().getTime() };
    let body = { auth: app.globalData.auth, uid: app.globalData.uid, page: this.data.page, size: this.data.size }
    app.request(app.dataFormat(query), body, (res) => {
      console.log(res);
      this.setData({
        foodsList: res.goods
      })
    }, function (res) {
      console.log(res);
    })
  }
})
