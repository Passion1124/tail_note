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
  onLoad: function () {
    this.getBanner();
    this.getCategoryList();
    this.getGoodList();
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
  goToTheList: function (e) {
    wx.navigateTo({
      url: '/pages/list/list?category=' + e.currentTarget.dataset.category + '&source=index',
    })
  },
  goToTheOrderDetail: function (e) {
    wx.navigateTo({
      url: '/pages/detail/detail?gid=' + e.currentTarget.dataset.gid,
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
