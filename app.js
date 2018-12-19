//app.js
App({
  onLaunch: function() {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        console.log(res);
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        if (res.code) {
          this.handleWxLogin(res.code);
        }
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null,
    baseUrl: 'http://47.99.131.137:8080/gateway?',
    auth: null,
    uid: null,
    openId: null,
    sessionKey: null,
    pollingNum: 5
  },
  request: function(query, data, success, fail) {
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
  handleWxLogin: function (code) {
    let query = this.query('com.zenith.api.apis.WXLoginApiService');
    let body = { code: code };
    this.request(query, body, res => {
      console.log(res);
      this.globalData.openId = res.openId;
      this.globalData.sessionKey = res.sessionKey;
      setTimeout(() => {
        let pages = getCurrentPages();
        pages[0].login();
      }, 300)
    }, err => {
      console.error(err);
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