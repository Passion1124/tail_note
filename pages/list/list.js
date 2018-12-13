const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    category: '',
    page: 1,
    size: 10,
    goodsList: [],
    loading: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: options.category,
    })
    this.setData({
      category: options.category
    });
    this.getGoodList();
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
    if (this.data.loading) return false;
    this.data.page++;
    this.getGoodList();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  },
  goToTheOrderDetail: function (e) {
    wx.navigateTo({
      url: '../detail/detail?gid=' + e.currentTarget.dataset.gid,
    })
  },
  getGoodList: function () {
    let query = { appid: 'ZenithTail', api: 'com.zenith.api.apis.GoodsListApiService', version: '1.0', nonce: app.uuid(), timestamp: new Date().getTime() };
    let body = { auth: app.globalData.auth, uid: app.globalData.uid, category: this.data.category, page: this.data.page, size: this.data.size }
    this.data.loading = true;
    app.request(app.dataFormat(query), body, (res) => {
      console.log(res);
      let goodsList = this.data.goodsList.concat(res.goods);
      this.setData({
        goodsList: goodsList
      });
      this.data.loading = false;
      this.getFavorCheck();
    }, function (res) {
      this.data.loading = false;
      this.data.page--;
      console.log(res);
    })
  },
  getFavorCheck: function () {
    let query = { appid: 'ZenithTail', api: 'com.zenith.api.apis.FavorCheckApiService', version: '1.0', nonce: app.uuid(), timestamp: new Date().getTime() };
    let body = { auth: app.globalData.auth, uid: app.globalData.uid, ids: this.data.goodsList.map(item => item.uuid) }
    app.request(app.dataFormat(query), body, (res) => {
      console.log(res);
      let goodsList = this.data.goodsList.map(item => {
        if (res.favorIds.indexOf(item.uuid) !== -1) {
          item.collect = 'yes'
        } else{
          item.collect = 'no'
        }
        return item;
      });
      this.setData({
        goodsList: goodsList
      });
    }, function (res) {
      console.log(res);
    })
  },
  handleGoodFavor: function (e) {
    let query = { appid: 'ZenithTail', api: 'com.zenith.api.apis.FavorApiService', version: '1.0', nonce: app.uuid(), timestamp: new Date().getTime() };
    let body = { auth: app.globalData.auth, uid: app.globalData.uid, gid: e.currentTarget.dataset.gid }
    app.request(app.dataFormat(query), body, (res) => {
      console.log(res);
      let goodsList = this.data.goodsList;
      goodsList[e.currentTarget.dataset.index].collect = 'yes';
      this.setData({
        goodsList: goodsList
      })
    }, function (res) {
      console.log(res);
    })
  },
  handleGoodUnFavor: function (e) {
    let query = { appid: 'ZenithTail', api: 'com.zenith.api.apis.UnFavorApiService', version: '1.0', nonce: app.uuid(), timestamp: new Date().getTime() };
    let body = { auth: app.globalData.auth, uid: app.globalData.uid, gid: e.currentTarget.dataset.gid }
    app.request(app.dataFormat(query), body, (res) => {
      console.log(res);
      let goodsList = this.data.goodsList;
      goodsList[e.currentTarget.dataset.index].collect = 'no';
      this.setData({
        goodsList: goodsList
      })
    }, function (res) {
      console.log(res);
    })
  }
})