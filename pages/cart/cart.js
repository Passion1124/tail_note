import utils from '../../utils/util.js'

const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    cart: [],
    deleting: false
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
    let storageCart = wx.getStorageSync('cart') || [];
    if (app.globalData.cartStatus !== 'over') {
      utils.setCartTabbarBadge();
      app.globalData.cartStatus = 'over';
    }
    let cart = storageCart.map(item => {
      let index = this.data.cart.findIndex(c => c.gid === item.gid && c.giid === item.giid);
      if (index !== -1) {
        return this.data.cart[index];
      } else {
        item.selected = false;
        return item;
      }
    })
    this.setData({
      cart
    });
    console.log(this.data.cart);
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
  // 修改商品是否选中
  handleUpdateGoodsSelected(e) {
    console.log(e);
    let index = e.currentTarget.dataset.index;
    let goods = e.currentTarget.dataset.goods;
    let type = e.currentTarget.dataset.type;
    if (type === '1') {
      goods.selected = true;
    } else if (type === '-1') {
      goods.selected = false;
    };
    let str = 'cart[' + index + ']';
    this.setData({
      [str]: goods
    });
  },
})