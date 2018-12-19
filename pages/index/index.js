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
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      });
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        });
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          });
        }
      })
    }
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '首页呀',
      path: '/pages/index/index'
    }
  },
  /**
   * 拨打电话
   */
  callPhone: function (e) {
    wx.makePhoneCall({
      phoneNumber: '15708449685',
      success: function () {
        console.log('拨打成功');
      },
      fail: function () {
        console.log('拨打失败');
      }
    })
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    });
  },
  goToTheList: function (e) {
    wx.navigateTo({
      url: '../list/list?category=' + e.currentTarget.dataset.category + '&source=index',
    })
  },
  goToTheOrderDetail: function (e) {
    wx.navigateTo({
      url: '../detail/detail?gid=' + e.currentTarget.dataset.gid,
    })
  },
  login: function () {
    let query = app.query('com.zenith.api.apis.LoginApiService');
    let userInfo = this.data.userInfo;
    let body = { openId: app.globalData.openId, nickname: userInfo.nickName, avatar: userInfo.avatarUrl, sex: userInfo.gender, province: userInfo.province, city: userInfo.city, country: userInfo.country, regUid: userInfo.regUid }
    if (this.data.hasUserInfo) {
      wx.showLoading({
        title: '拼命加载中',
      })
    }
    app.request(query, body, (res) => {
      console.log(res);
      app.globalData.auth = res.auth;
      app.globalData.uid = res.user.uuid;
      this.getBanner();
      this.getCategoryList();
      this.getGoodList();
      wx.hideLoading();
    }, function(res){
      console.log(res);
      wx.hideLoading();
    })
  },
  getBanner: function () {
    let query = app.query('com.zenith.api.apis.BannerListApiService');
    let body = app.commonBody();
    app.request(query, body, (res) => {
      console.log(res);
      this.setData({
        imgUrls: res.bannerList
      })
    }, function (res) {
      console.log(res);
    })
  },
  getCategoryList: function () {
    let query = app.query('com.zenith.api.apis.CategoryListApiService');
    let body = app.commonBody();
    app.request(query, body, (res) => {
      console.log(res);
      this.setData({
        category: res.categoryList
      })
    }, function (res) {
      console.log(res);
    })
  },
  getGoodList: function () {
    let query = app.query('com.zenith.api.apis.GoodsListApiService');
    let body = Object.assign(app.commonBody(), { page: this.data.page, size: this.data.size });
    app.request(query, body, (res) => {
      console.log(res);
      this.setData({
        foodsList: res.goods
      })
    }, function (res) {
      console.log(res);
    })
  }
})
