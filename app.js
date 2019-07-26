//app.js
const ald = require('./utils/ald-stat.js')

const debug = false;

App({
  onLaunch: function() {
    var authority = wx.getStorageSync('authority') || '';
    if (authority) {
      this.globalData.auth = authority.auth;
      this.globalData.uid = authority.uid;
      this.globalData.openId = authority.openId;
    }
    wx.getSystemInfo({
      success: res => {
        //导航高度
        this.globalData.navHeight = res.platform == 'android' ? res.statusBarHeight + 48 : res.statusBarHeight + 44;
      }, fail(err) {
        console.log(err);
      }
    })
  },
  globalData: {
    userInfo: null,
    baseUrl: debug ? 'https://api.weixiaola.cn/gateway?' : 'https://api.weixiaola.cn/gateway?',
    auth: null,
    uid: null,
    openId: null,
    sessionKey: null,
    pollingNum: 5,
    fUid: '',
    cartStatus: 'init',
    navHeight: ''
  },
  request: function(query, data, success, fail) {
    if (this.globalData.fUid) data.fUid = this.globalData.fUid;
    wx.request({
      url: this.globalData.baseUrl + query,
      data: data,
      header: {
        "api": '123'
      },
      method: 'POST',
      dataType: 'json',
      responseType: 'text',
      success: function(res) {
        if (res.data.ret_code === '0000') {
          success(res.data);
        } else{
          console.log(res.data.ret_msg);
          fail(res.data);
        }
      },
      fail: function(res) {
        fail(res);
      },
      complete: function(res) {},
    })
  },
  uuid: function() {
    var s = [];
    var hexDigits = "0123456789abcdef";
    for (var i = 0; i < 36; i++) {
      s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23] = "-";
    var uuid = s.join("");
    return uuid;
  },
  query: function (api) {
    let query = { appid: 'ZenithTail', api: api, version: '1.0', nonce: this.uuid(), timestamp: new Date().getTime() };
    return this.dataFormat(query);
  },
  commonBody: function () {
    return { auth: this.globalData.auth, uid: this.globalData.uid }
  },
  dataFormat: function(data) {
      let text = '';
      for (let i in data) {
        text += i + '=' + data[i] + '&';
      }
      return text;
  }
})