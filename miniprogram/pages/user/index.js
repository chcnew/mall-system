// pages/user/index.js - 个人中心
const auth = require('../../utils/auth')
const request = require('../../utils/request')
const util = require('../../utils/util')
const app = getApp()

Page({
  data: {
    // 用户信息
    userInfo: {},
    // 登录状态
    isLoggedIn: false,
    // 订单统计
    orderStats: {
      unpaid: 0,
      unshipped: 0,
      unreceived: 0,
      completed: 0
    },
    // 页面加载状态
    loading: false
  },

  onLoad(options) {
    this.initPage()
  },

  onShow() {
    this.loadUserInfo()
    this.loadOrderStats()
  },

  onPullDownRefresh() {
    this.refreshData()
  },

  onShareAppMessage() {
    return {
      title: '微信商城',
      path: '/pages/user/index'
    }
  },

  initPage() {
    this.setData({ isLoggedIn: true })
    this.loadUserInfo()
    this.loadOrderStats()
  },

  checkLoginStatus() {
    this.setData({ isLoggedIn: true })
  },

  // 刷新数据
  refreshData() {
    this.loadUserInfo()
      .then(() => this.loadOrderStats())
      .finally(() => {
        wx.stopPullDownRefresh()
      })
  },

  loadUserInfo() {
    this.setData({ loading: true })

    return new Promise(resolve => {
      setTimeout(() => {
        const userInfo = {
          id: 1,
          nickname: '微信用户',
          avatar: '/images/default-avatar.png',
          phone: '138****8888',
          balance: 0.00,
          points: 0
        }
        this.setData({ userInfo })
        resolve()
      }, 300)
    }).finally(() => {
      this.setData({ loading: false })
    })
  },

  loadOrderStats() {
    return new Promise(resolve => {
      setTimeout(() => {
        this.setData({
          orderStats: {
            unpaid: 1,
            unshipped: 1,
            unreceived: 0,
            completed: 1
          }
        })
        resolve()
      }, 300)
    })
  },

  // 处理 Token 过期
  handleTokenExpired() {
    wx.showModal({
      title: '登录已过期',
      content: '请重新登录',
      confirmText: '去登录',
      success: (res) => {
        if (res.confirm) {
          auth.relogin().then(() => {
            this.initPage()
          })
        }
      }
    })
  },

  // 点击登录
  onLogin() {
    if (this.data.isLoggedIn) {
      return
    }

    // 调用微信登录
    auth.login()
      .then(() => {
        this.initPage()
        wx.showToast({
          title: '登录成功',
          icon: 'none'
        })
      })
      .catch(() => {
        wx.showToast({
          title: '登录失败，请重试',
          icon: 'none'
        })
      })
  },

  // 点击退出登录
  onLogout() {
    wx.showModal({
      title: '确认退出',
      content: '确定要退出登录吗？',
      success: (res) => {
        if (res.confirm) {
          auth.logout().then(() => {
            this.setData({
              userInfo: {},
              isLoggedIn: false,
              orderStats: {
                unpaid: 0,
                unshipped: 0,
                unreceived: 0,
                completed: 0
              }
            })
            wx.showToast({
              title: '已退出登录',
              icon: 'none'
            })
          })
        }
      }
    })
  },

  // 点击订单（全部）
  onOrderAll() {
    this.goToOrderList()
  },

  onOrderUnpaid() {
    this.goToOrderList(1)
  },

  onOrderUnshipped() {
    this.goToOrderList(2)
  },

  onOrderUnreceived() {
    this.goToOrderList(3)
  },

  onOrderCompleted() {
    this.goToOrderList(4)
  },

  goToOrderList(status) {
    let url = '/pages/order/list/index'
    if (status !== undefined) {
      url += `?tab=${status}`
    }
    wx.navigateTo({
      url
    })
  },

  // 点击地址管理
  onAddress() {
    if (!this.data.isLoggedIn) {
      wx.showModal({
        title: '提示',
        content: '请先登录',
        confirmText: '去登录',
        success: (res) => {
          if (res.confirm) {
            this.onLogin()
          }
        }
      })
      return
    }

    wx.navigateTo({
      url: '/pages/address/list/index'
    })
  },

  // 点击我的优惠券
  onCoupon() {
    if (!this.data.isLoggedIn) {
      wx.showModal({
        title: '提示',
        content: '请先登录',
        confirmText: '去登录',
        success: (res) => {
          if (res.confirm) {
            this.onLogin()
          }
        }
      })
      return
    }

    wx.navigateTo({
      url: '/pages/coupon/index'
    })
  },

  // 点击客服
  onService() {
    wx.showModal({
      title: '联系客服',
      content: '客服电话：400-888-8888\n工作时间：9:00 - 18:00',
      confirmText: '拨打',
      success: (res) => {
        if (res.confirm) {
          wx.makePhoneCall({
            phoneNumber: '400-888-8888'
          })
        }
      }
    })
  },

  // 点击设置
  onSettings() {
    wx.showToast({
      title: '功能开发中',
      icon: 'none'
    })
  },

  // 点击余额
  onBalance() {
    if (!this.data.isLoggedIn) {
      wx.showModal({
        title: '提示',
        content: '请先登录',
        confirmText: '去登录',
        success: (res) => {
          if (res.confirm) {
            this.onLogin()
          }
        }
      })
      return
    }

    wx.showToast({
      title: '功能开发中',
      icon: 'none'
    })
  },

  // 点击积分
  onPoints() {
    if (!this.data.isLoggedIn) {
      wx.showModal({
        title: '提示',
        content: '请先登录',
        confirmText: '去登录',
        success: (res) => {
          if (res.confirm) {
            this.onLogin()
          }
        }
      })
      return
    }

    wx.showToast({
      title: '功能开发中',
      icon: 'none'
    })
  },

  onFavorite() {
    wx.navigateTo({
      url: '/pages/favorite/index'
    })
  }
})