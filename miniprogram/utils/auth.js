// utils/auth.js - 认证相关工具函数

const request = require('./request')

// 用户登录状态
let isLoggedIn = false

// 检查登录状态
function checkLoginStatus() {
  const token = wx.getStorageSync('token')
  isLoggedIn = !!token
  return isLoggedIn
}

// 微信登录
function wxLogin() {
  return new Promise((resolve, reject) => {
    wx.login({
      success: (res) => {
        if (res.code) {
          resolve(res.code)
        } else {
          reject(new Error('微信登录失败'))
        }
      },
      fail: (err) => {
        reject(err)
      }
    })
  })
}

// 调用后端登录接口
function callLoginApi(code) {
  return new Promise((resolve, reject) => {
    request.post('/auth/login', { code })
      .then(data => {
        // 存储 token 和用户信息
        wx.setStorageSync('token', data.token)
        wx.setStorageSync('openid', data.openid)
        if (data.session_key) {
          wx.setStorageSync('session_key', data.session_key)
        }
        
        isLoggedIn = true
        resolve(data)
      })
      .catch(reject)
  })
}

// 登录流程
function login() {
  return new Promise((resolve, reject) => {
    wxLogin()
      .then(code => callLoginApi(code))
      .then(resolve)
      .catch(reject)
  })
}

// 登出
function logout() {
  return new Promise((resolve) => {
    // 清除本地存储
    wx.removeStorageSync('token')
    wx.removeStorageSync('openid')
    wx.removeStorageSync('session_key')
    
    // 更新登录状态
    isLoggedIn = false
    
    resolve()
  })
}

// 获取 Token
function getToken() {
  return wx.getStorageSync('token')
}

// 设置 Token
function setToken(token) {
  wx.setStorageSync('token', token)
  isLoggedIn = true
}

// 获取 OpenID
function getOpenID() {
  return wx.getStorageSync('openid')
}

// 获取 SessionKey
function getSessionKey() {
  return wx.getStorageSync('session_key')
}

// 检查手机号是否已绑定
function hasPhoneNumber() {
  const phone = wx.getStorageSync('user_phone')
  return !!phone
}

// 解密手机号
function decryptPhoneNumber(encryptedData, iv) {
  return new Promise((resolve, reject) => {
    const sessionKey = getSessionKey()
    if (!sessionKey) {
      reject(new Error('没有 session_key'))
      return
    }

    request.post('/auth/phone', { encryptedData, iv })
      .then(data => {
        // 存储手机号
        wx.setStorageSync('user_phone', data.phoneNumber)
        resolve(data.phoneNumber)
      })
      .catch(reject)
  })
}

// 获取用户信息
function getUserInfo() {
  return wx.getStorageSync('user_info') || {}
}

// 设置用户信息
function setUserInfo(userInfo) {
  wx.setStorageSync('user_info', userInfo)
}

// 更新用户信息
function updateUserInfo(userInfo) {
  const currentInfo = getUserInfo()
  const newInfo = { ...currentInfo, ...userInfo }
  setUserInfo(newInfo)
}

// 获取登录状态
function getLoginStatus() {
  return isLoggedIn
}

// 检查是否需要登录
function requireLogin() {
  if (!checkLoginStatus()) {
    wx.showModal({
      title: '提示',
      content: '请先登录',
      confirmText: '去登录',
      success: (res) => {
        if (res.confirm) {
          wx.navigateTo({
            url: '/pages/user/index'
          })
        }
      }
    })
    return false
  }
  return true
}

// 重新登录
function relogin() {
  return new Promise((resolve, reject) => {
    // 清除旧 token
    wx.removeStorageSync('token')
    wx.removeStorageSync('openid')
    wx.removeStorageSync('session_key')
    
    // 执行登录流程
    login()
      .then(resolve)
      .catch(reject)
  })
}

// 导出认证相关函数
module.exports = {
  checkLoginStatus,
  wxLogin,
  callLoginApi,
  login,
  logout,
  getToken,
  setToken,
  getOpenID,
  getSessionKey,
  hasPhoneNumber,
  decryptPhoneNumber,
  getUserInfo,
  setUserInfo,
  updateUserInfo,
  getLoginStatus,
  requireLogin,
  relogin
}