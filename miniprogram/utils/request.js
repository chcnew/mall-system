// utils/request.js - 网络请求封装

const config = require('../config')

// 默认配置
const DEFAULT_CONFIG = {
  showLoading: true,
  loadingText: '加载中...',
  timeout: 10000,
  data: {},
  header: {
    'Content-Type': 'application/json'
  }
}

// 请求队列
const requestQueue = new Set()
let loadingCount = 0

// 显示loading
function showLoading(text) {
  if (loadingCount === 0) {
    wx.showLoading({
      title: text,
      mask: true
    })
  }
  loadingCount++
}

// 隐藏loading
function hideLoading() {
  loadingCount--
  if (loadingCount <= 0) {
    wx.hideLoading()
    loadingCount = 0
  }
}

// 请求拦截器
function requestInterceptor(options) {
  // 添加 token
  const token = wx.getStorageSync('token')
  if (token) {
    options.header.Authorization = `Bearer ${token}`
  }
  
  // 添加时间戳防止缓存
  if (options.method === 'GET') {
    options.data._t = Date.now()
  }
  
  return options
}

// 响应拦截器
function responseInterceptor(response) {
  const { statusCode, data } = response
  
  // 处理 HTTP 错误
  if (statusCode >= 400) {
    handleHttpError(statusCode)
    return Promise.reject(new Error(`HTTP error: ${statusCode}`))
  }
  
  // 处理业务错误
  if (data && data.code !== 0) {
    handleBusinessError(data.code, data.message)
    return Promise.reject(new Error(data.message))
  }
  
  return data
}

// 处理 HTTP 错误
function handleHttpError(statusCode) {
  let message = '网络请求失败'
  
  switch (statusCode) {
    case 401:
      message = '登录已过期，请重新登录'
      // 清除本地存储并跳转到首页
      wx.removeStorageSync('token')
      wx.removeStorageSync('openid')
      setTimeout(() => {
        wx.reLaunch({
          url: '/pages/index/index'
        })
      }, 1500)
      break
    case 403:
      message = '没有访问权限'
      break
    case 404:
      message = '请求的资源不存在'
      break
    case 500:
      message = '服务器内部错误'
      break
    case 502:
      message = '网关错误'
      break
    case 503:
      message = '服务不可用'
      break
    default:
      message = `请求失败: ${statusCode}`
  }
  
  wx.showToast({
    title: message,
    icon: 'none',
    duration: 2000
  })
}

// 处理业务错误
function handleBusinessError(code, message) {
  let showToast = true
  
  switch (code) {
    case 400:
      // 参数错误，通常不需要全局提示
      showToast = false
      break
    case 401:
      // 未登录
      wx.removeStorageSync('token')
      wx.removeStorageSync('openid')
      setTimeout(() => {
        wx.reLaunch({
          url: '/pages/index/index'
        })
      }, 1500)
      break
    case 403:
      // 禁止访问
      message = '没有权限执行此操作'
      break
    case 404:
      // 资源不存在
      message = '请求的资源不存在'
      break
    case 500:
      // 服务器错误
      message = '服务器错误，请稍后重试'
      break
  }
  
  if (showToast && message) {
    wx.showToast({
      title: message,
      icon: 'none',
      duration: 2000
    })
  }
}

// 主请求函数
function request(options = {}) {
  // 合并配置
  const config = { ...DEFAULT_CONFIG, ...options }
  
  // 请求拦截
  const finalConfig = requestInterceptor(config)
  
  // 显示loading
  if (finalConfig.showLoading) {
    showLoading(finalConfig.loadingText)
  }
  
  // 生成请求唯一标识
  const requestId = `${finalConfig.method}_${finalConfig.url}_${Date.now()}`
  requestQueue.add(requestId)
  
  return new Promise((resolve, reject) => {
    // 发起请求
    wx.request({
      url: `${config.API_BASE_URL}${finalConfig.url}`,
      method: finalConfig.method,
      data: finalConfig.data,
      header: finalConfig.header,
      timeout: finalConfig.timeout,
      success: (response) => {
        // 响应拦截
        responseInterceptor(response)
          .then(resolve)
          .catch(reject)
      },
      fail: (error) => {
        // 网络错误处理
        let message = '网络连接失败'
        if (error.errMsg) {
          if (error.errMsg.includes('timeout')) {
            message = '请求超时，请检查网络'
          } else if (error.errMsg.includes('fail')) {
            message = '网络异常，请检查网络连接'
          }
        }
        
        wx.showToast({
          title: message,
          icon: 'none',
          duration: 2000
        })
        
        reject(new Error(message))
      },
      complete: () => {
        // 隐藏loading
        if (finalConfig.showLoading) {
          hideLoading()
        }
        
        // 从请求队列中移除
        requestQueue.delete(requestId)
      }
    })
  })
}

// GET 请求
function get(url, data = {}, options = {}) {
  return request({
    url,
    method: 'GET',
    data,
    ...options
  })
}

// POST 请求
function post(url, data = {}, options = {}) {
  return request({
    url,
    method: 'POST',
    data,
    ...options
  })
}

// PUT 请求
function put(url, data = {}, options = {}) {
  return request({
    url,
    method: 'PUT',
    data,
    ...options
  })
}

// DELETE 请求
function del(url, data = {}, options = {}) {
  return request({
    url,
    method: 'DELETE',
    data,
    ...options
  })
}

// 上传文件
function uploadFile(url, filePath, name, formData = {}, options = {}) {
  return new Promise((resolve, reject) => {
    const token = wx.getStorageSync('token')
    const header = {
      'Authorization': `Bearer ${token}`
    }
    
    wx.uploadFile({
      url: `${config.API_BASE_URL}${url}`,
      filePath,
      name,
      formData,
      header,
      success: (res) => {
        try {
          const data = JSON.parse(res.data)
          if (data.code === 0) {
            resolve(data.data)
          } else {
            handleBusinessError(data.code, data.message)
            reject(new Error(data.message))
          }
        } catch (error) {
          reject(new Error('文件上传失败'))
        }
      },
      fail: (error) => {
        reject(error)
      }
    })
  })
}

// 取消所有请求
function cancelAllRequests() {
  requestQueue.clear()
  hideLoading()
}

// 导出请求方法
module.exports = {
  request,
  get,
  post,
  put,
  delete: del,
  uploadFile,
  cancelAllRequests
}