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
  // 点击全选
  handleCliclAllSelected(e) {
    let all = e.currentTarget.dataset.all;
    let cart = this.data.cart.map(item => {
      item.selected = !all;
      return item;
    });
    this.setData({
      cart
    })
  },
  handleUpdateDeleting() {
    this.setData({
      deleting: !this.data.deleting
    })
  },
  // 删除选中的商品
  handleDeleteSelectedGoods() {
    let selected_shop = this.data.cart.filter(item => item.selected);
    if (selected_shop.length) {
      let cart = this.data.cart.filter(item => !item.selected);
      this.setData({
        cart,
        deleting: false
      }, function () {
        let storage = cart.map(item => {
          delete item.selected;
          return item;
        })
        wx.setStorageSync('cart', storage);
        utils.setCartTabbarBadge();
      });
    } else {
      util.showMessage('请选择商品');
    }
  },
  // 购物车添加(购)
  handleShoppingCartAdd(e) {
    let item = e.currentTarget.dataset.item;
    let type = Number(e.currentTarget.dataset.type);
    let index = e.currentTarget.dataset.index;
    if (type === -1 && item.num <= 1) {
      utils.showMessage('最少购买一件哦');
    } else {
      type === -1 ? item.num -= 1 : item.num += 1;
      let str = 'cart['+ index +']'
      this.setData({
        [str]: item
      }, () => {
        let cart = this.data.cart.map(item => {
          delete item.selected;
          return item;
        });
        wx.setStorageSync('cart', cart);
        utils.setCartTabbarBadge();
      });
    }
  },
  // 点击去付款按钮
  handleClickPayButton() {
    let selected_shop = this.data.cart.filter(item => item.selected);
    if (selected_shop.length) {
      utils.navigateTo('/pages/pay_cart/pay_cart');
      wx.setStorageSync('pay_cart', selected_shop);
    } else {
      utils.showMessage('请选择商品');
    }
  },
  goToTheOrderDetail: function (e) {
    wx.navigateTo({
      url: '../detail/detail?gid=' + e.currentTarget.dataset.gid,
    })
  }
})