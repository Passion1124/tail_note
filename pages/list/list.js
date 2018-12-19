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
    loading: false,
    max: false,
    source: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '拼命加载中',
    });
    wx.setNavigationBarTitle({
      title: options.category,
    });
    this.setData({
      category: options.category,
      source: options.source
    });
    if (options.source === 'my_collection') {
      this.handleFavorList();
    } else {
      this.getGoodList();
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
    this.data.page = 1;
    if (this.data.source === 'my_collection') {
      this.handleFavorList('down');
    } else {
      this.getGoodList('down');
    }
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.loading || this.data.max) return false;
    this.data.page++;
    if (this.data.source === 'my_collection') {
      this.handleFavorList('up');
    } else{
      this.getGoodList('up');
    }
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
  getGoodList: function (type) {
    let query = app.query('com.zenith.api.apis.GoodsListApiService');
    let body = Object.assign(app.commonBody(), { category: this.data.category, page: this.data.page, size: this.data.size });
    this.changeLoadingValue(true);
    app.request(query, body, (res) => {
      console.log(res);
      let arr = type === 'down' ? [] : this.data.goodsList;
      let goodsList = arr.concat(res.goods);
      let max = res.goods.length === this.data.size ? false : true;
      this.setData({
        goodsList: goodsList,
        max: max
      });
      this.changeLoadingValue(false);
      this.getFavorCheck();
      wx.hideLoading();
      wx.stopPullDownRefresh();
    }, function (res) {
      this.changeLoadingValue(false);
      if (this.data.page > 1) this.data.page--;
      wx.hideLoading();
      wx.stopPullDownRefresh();
      console.error(res);
    })
  },
  getFavorCheck: function () {
    let query = app.query('com.zenith.api.apis.FavorCheckApiService');
    let body = Object.assign(app.commonBody(), { ids: this.data.goodsList.map(item => item.uuid) });
    app.request(query, body, (res) => {
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
    let query = app.query('com.zenith.api.apis.FavorApiService');
    let body = Object.assign(app.commonBody(), { gid: e.currentTarget.dataset.gid });
    app.request(query, body, (res) => {
      console.log(res);
      let goodsList = this.data.goodsList;
      goodsList[e.currentTarget.dataset.index].collect = 'yes';
      this.setData({
        goodsList: goodsList
      });
      wx.showToast({
        title: '收藏成功',
      })
    }, function (res) {
      console.log(res);
    })
  },
  handleGoodUnFavor: function (e) {
    let query = app.query('com.zenith.api.apis.UnFavorApiService');
    let body = Object.assign(app.commonBody(), { gid: e.currentTarget.dataset.gid });
    app.request(query, body, (res) => {
      console.log(res);
      let goodsList = this.data.goodsList;
      goodsList[e.currentTarget.dataset.index].collect = 'no';
      this.setData({
        goodsList: goodsList
      })
      wx.showToast({
        title: '已取消收藏',
      })
    }, function (res) {
      console.log(res);
    })
  },
  handleFavorList: function (type) {
    let query = app.query('com.zenith.api.apis.FavorListApiService');
    let body = Object.assign(app.commonBody(), { page: this.data.page, size: this.data.size });
    this.changeLoadingValue(true);
    app.request(query, body, (res) => {
      console.log(res);
      let arr = type === 'down' ? [] : this.data.goodsList;
      let goodsList = arr.concat(res.goodsList.map(item => {
        item.collect = 'yes';
        return item;
      }));
      let max = res.goodsList.length === this.data.size ? false : true;
      this.setData({
        goodsList: goodsList,
        max: max
      });
      this.changeLoadingValue(false);
      wx.hideLoading();
      wx.stopPullDownRefresh();
    }, (err) => {
      console.error(err);
      wx.hideLoading();
      wx.stopPullDownRefresh();
      this.changeLoadingValue(false);
      if (this.data.page > 1) this.data.page--;
    })
  },
  changeLoadingValue: function (value) {
    this.setData({
      loading: value
    })
  }
})