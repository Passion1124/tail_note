import utils from '../../utils/util.js'

const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    cart: [],
    contact: {
      phone: '',
      address: ''
    },
    pay_loading: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let cart = wx.getStorageSync('pay_cart') || [];
    this.setData({
      cart
    });
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
  // 获取用户信息
  handleUserDetail: function () {
    let query = app.query('com.zenith.api.apis.UserDetailApiService');
    let body = app.commonBody();
    app.request(query, body, res => {
      console.log(res);
      let user = res.user;
      let contact = {};
      if (user.phone) contact.phone = user.phone;
      if (user.address) contact.address = user.address;
      let arr = Object.keys(contact);
      if (arr.length) {
        this.setData({
          contact
        });
      }
    }, err => {
      console.error(err);
      wx.clearStorageSync('authority');
    })
  },
  // 输入框，选择框等改变时间
  handleParameterUpdate(e) {
    let parameter = e.currentTarget.dataset.parameter;
    let value = e.detail.value;
    this.setData({
      [parameter]: value
    });
  },
  // 点击去付款按钮生成订单
  handleClickPayButton() {
    if (this.data.pay_loading) {
      return false;
    }
    let contact = this.data.contact;
    if (!contact.phone) {
      utils.showMessage('请输入手机号');
    } else if (!utils.validatePhone(contact.phone)) {
      utils.showMessage('请输入正确的手机号');
    } else if (!contact.address) {
      utils.showMessage('请输入收货地址');
    } else {
      this.handleShoppingOrderGen();
    }
  },
  // 生成订单
  handleShoppingOrderGen() {
    utils.userIsLogin().then(_ => {
      let data = this.data;
      wx.showLoading({
        title: '正在生成订单中',
      });
      let query = app.query('com.zenith.api.apis.OrdersApiService');
      let orderInfos = this.data.cart.map(item => ({ gid: item.gid, giid: item.giid, num: item.num }));
      let body = Object.assign(app.commonBody(), { sn: app.uuid(), orderInfos }, this.data.contact);
      app.request(query, body, (res) => {
        console.log(res);
        let cart = wx.getStorageSync('cart');
        cart = cart.filter(item => {
          let fIndex = this.data.cart.findIndex(c => c.gid === item.gid && c.giid === item.giid);
          return fIndex === -1
        });
        wx.setStorageSync('cart', cart);
        app.globalData.cartStatus = 'change';
        wx.navigateTo({
          url: '../payment/payment?orderId=' + res.order.uuid,
        })
        wx.hideLoading();
      }, (err) => {
        console.error(err);
        wx.hideLoading();
        wx.showToast({
          title: '订单生成失败！！',
          icon: 'none'
        })
      })
    })
  }
})