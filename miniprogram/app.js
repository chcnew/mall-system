// app.js - 小程序入口文件

App({
  onLaunch() {
    console.log('小程序启动')
  },

  globalData: {
    userInfo: null,
    token: null,
    cartCount: 0
  },

  updateCartCount(count) {
    this.globalData.cartCount = count || 0
    if (count > 0) {
      wx.setTabBarBadge({
        index: 1,
        text: count.toString()
      })
    } else {
      wx.removeTabBarBadge({
        index: 1
      })
    }
  },

  setUserInfo(userInfo) {
    this.globalData.userInfo = userInfo
  },

  setToken(token) {
    this.globalData.token = token
  },

  getUserInfo() {
    return this.globalData.userInfo
  },

  getToken() {
    return this.globalData.token
  }
})