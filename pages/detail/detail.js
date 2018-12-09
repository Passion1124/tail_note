Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrls: [
      'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg'
    ],
    indicatorDots: true,
    autoplay: false,
    interval: 5000,
    duration: 1000,
    tripDate: [
      { value: 'trip1', name: '7月17日(最迟7月5日报名)' },
      { value: 'trip2', name: '7月17日(最迟7月5日报名)' },
      { value: 'trip3', name: '7月17日(最迟7月5日报名)' }
    ],
    checkedArray: [],
    num: 1,
    minusStatus: 'disabled',
    mask: false,
    popup: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
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
  checkboxChange: function(e) {
    console.log(e);
    var checkedArray = e.detail.value;
    var tripDate = this.data.tripDate.map(item => {
      if (checkedArray.indexOf(item.value) !== -1) {
        item.checked = true;
      } else {
        item.checked = false;
      }
      return item;
    })
    this.setData({
      checkedArray: checkedArray,
      tripDate: tripDate
    });
    console.log(this.data);
  },
  // 点击减号
  bindMinus: function () {
    var num = this.data.num;
    // 如果大于1时，才可以减  
    if (num > 1) {
      num--;
    }
    // 只有大于一件的时候，才能normal状态，否则disable状态  
    var minusStatus = num <= 1 ? 'disabled' : 'normal';
    // 将数值与状态写回  
    this.setData({
      num: num,
      minusStatus: minusStatus
    });
  },
  // 点击加号
  bindPlus: function () {
    var num = this.data.num;
    // 不作过多考虑自增1  
    num++;
    // 只有大于一件的时候，才能normal状态，否则disable状态  
    var minusStatus = num < 1 ? 'disabled' : 'normal';
    // 将数值与状态写回  
    this.setData({
      num: num,
      minusStatus: minusStatus
    });  
  },
  // 输入框事件
  bindManual: function (e) {
    var num = e.detail.value;
    var minusStatus = num < 1 ? 'disabled' : 'normal';
    this.setData({
      num: num,
      minusStatus: minusStatus
    }); 
  },
  // 关闭弹窗事件
  closeMaskAndPopup: function () {
    this.setData({
      mask: false,
      popup: false
    })
  },
  // 打开弹窗事件
  openMaskAndPopup: function () {
    this.setData({
      mask: true,
      popup: true
    })
  }
})