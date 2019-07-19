const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const userIsLogin = _ => {
  return new Promise((resolve, reject) => {
    let user = wx.getStorageSync('user') || '';
    if (user) {
      resolve('success');
    } else {
      navigateTo('/pages/login/login');
      reject('fail');
    }
  })
}

const navigateTo = url => {
  wx.navigateTo({
    url: url,
  })
}

const showMessage = (message, icon) => {
  wx.showToast({
    title: message,
    duration: 1500,
    icon: icon ? icon : 'none'
  })
}

const setCartTabbarBadge = (index = 1) => {
  let cart = wx.getStorageSync('cart') || [];
  if (cart.length) {
    let num = cart.reduce((cur, pre) => {
      return cur + pre.num
    }, 0)
    wx.setTabBarBadge({
      index,
      text: num.toString(),
    })
  } else {
    wx.removeTabBarBadge({
      index
    })
  }
}

const validatePhone = phone => {
  let reg = new RegExp('^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\\d{8}$');
  return reg.test(phone);
}

module.exports = {
  formatTime: formatTime,
  userIsLogin: userIsLogin,
  navigateTo: navigateTo,
  showMessage: showMessage,
  setCartTabbarBadge: setCartTabbarBadge,
  validatePhone: validatePhone
}
