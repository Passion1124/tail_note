// components/navbar/index.js

const app = getApp();

Component({
  options: {
    addGlobalClass: true
  },
  /**
   * 组件的属性列表
   */
  properties: {
    pageName: {
      type: String,
      value: ''
    },
    showNav: {
      type: Boolean,
      value: true
    },
    showHome: {
      type: Boolean,
      value: true
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    navH: ''
  },
  lifetimes: {
    
  },
  attached: function () {
    this.setData({
      navH: app.globalData.navHeight
    })
  },
  /**
   * 组件的方法列表
   */
  methods: {
    // 回退
    navBack: function () {
      wx.navigateBack({
        delta: 1
      })
    },
    // 回主页
    toIndex: function () {
      wx.switchTab({
        url: '/pages/index/index',
      })
    }
  }
})