const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    winHeight: "", //窗口高度
    hotWord: ['推荐1', '推荐2', '推荐3'],
    history: [],
    foodsList: [],
    goods: [],
    loading: false,
    input: '',
    inputFocus: false,
    page: 1,
    size: 10,
    isSearch: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let history = wx.getStorageSync('historySearchList') || [];
    if (history.length) {
      this.setData({
        history: history
      });
    }
    this.handleHeightAuto();
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
  handleHeightAuto() {
    var that = this;
    //  高度自适应
    wx.getSystemInfo({
      success: function (res) {
        var clientHeight = res.windowHeight,
          clientWidth = res.windowWidth,
          rpxR = 750 / clientWidth;
        var calc = clientHeight * rpxR - 112 - (res.platform == 'android' ? res.statusBarHeight + 48 : res.statusBarHeight + 44) * rpxR;
        that.setData({
          winHeight: calc
        });
      }
    });
  },
  // 搜索
  getSearchResult: function () {
    this.data.loading = true;
    let query = app.query('com.zenith.api.apis.GoodsSearchListApiService');
    let body = Object.assign(app.commonBody(), { page: this.data.page, size: this.data.size, keyword: this.data.input });
    app.request(query, body, (res) => {
      console.log(res);
      let max = res.goods.length === this.data.size ? false : true;
      let foodsList = this.data.foodsList.concat(res.goods);
      this.setData({
        foodsList: foodsList,
        max: max,
        isSearch: true
      }, () => {
        this.data.loading = false;
      });
    }, (res) => {
      console.log(res);
      this.data.loading = false;
    })
  },
  // 滚动到底部触发
  handleScrollToLower () {
    if (this.data.loading || this.data.max) return false;
    this.data.page++;
    this.getSearchResult();
  },
  // 清除历史记录
  handleClearHistory() {
    let _that = this;
    wx.showModal({
      title: '提示',
      content: '确定要删除历史记录吗？',
      success(res) {
        if (res.confirm) {
          wx.removeStorageSync('historySearchList');
          _that.setData({
            history: []
          })
        }
      }
    })
  },
  // 跳转到搜索列表及保存搜索的历史记录
  goToTheSearchList(e) {
    let type = e.type;
    let search = type === 'tap' ? e.currentTarget.dataset.name : e.detail.value;
    let obj = {};
    obj.input = search;
    if (this.data.history.indexOf(search) === -1 && search) {
      let history = this.data.history;
      history.push(search);
      if (history.length > 10) {
        history.pop();
      }
      wx.setStorageSync('historySearchList', history);
      obj.history = history;
    }
    this.setData(obj);
    this.getSearchResult();
  },
  //删除一个信息
  delSingle(event) {
    let _that = this;
    var currentIndex = event.currentTarget.dataset['index'];
    let history = this.data.history;
    history.splice(currentIndex, 1);
    wx.setStorageSync('historySearchList', history);
    _that.setData({
      history: history
    })
  },
  // 输入框输入事件
  handleInput (e) {
    this.setData({
      input: e.detail.value
    })
  },
  // 输入框获取焦点事件
  handleInputFocus () {
    this.setData({
      inputFocus: true
    })
  },
  // 输入框失去焦点事件
  handleInputBlur () {
    this.setData({
      inputFocus: false
    })
  },
  // 跳转到商品详情页面
  goToTheOrderDetail: function (e) {
    wx.navigateTo({
      url: '/pages/detail/detail?gid=' + e.currentTarget.dataset.gid,
    })
  }
})