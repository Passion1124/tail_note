const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    hotWord: [],
    history: [],
    goods: [],
    loading: false,
    input: '',
    inputFocus: false
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
    if (this.data.history.indexOf(search) === -1 && search) {
      let history = this.data.history;
      history.push(search);
      if (history.length > 10) {
        history.pop();
      }
      wx.setStorageSync('historySearchList', history);
      this.setData({
        history
      })
    }
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
  }
})