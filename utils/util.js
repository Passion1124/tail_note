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
      resolve();
    } else {
      navigateTo('/pages/login/login');
      reject();
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

module.exports = {
  formatTime: formatTime,
  userIsLogin: userIsLogin,
  navigateTo: navigateTo,
  showMessage: showMessage
}
