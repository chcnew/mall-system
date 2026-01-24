// utils/util.js - 通用工具函数

// 格式化时间戳
function formatTime(timestamp, format = 'YYYY-MM-DD HH:mm:ss') {
  if (!timestamp) {
    return ''
  }
  
  const date = new Date(timestamp * 1000 || timestamp)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')
  
  const formatObj = {
    YYYY: year,
    MM: month,
    DD: day,
    HH: hours,
    mm: minutes,
    ss: seconds
  }
  
  return format.replace(/YYYY|MM|DD|HH|mm|ss/g, match => formatObj[match])
}

// 格式化日期（不包含时间）
function formatDate(timestamp) {
  return formatTime(timestamp, 'YYYY-MM-DD')
}

// 格式化时间（不包含日期）
function formatTimeOnly(timestamp) {
  return formatTime(timestamp, 'HH:mm:ss')
}

// 相对时间格式化
function formatRelativeTime(timestamp) {
  const now = Date.now()
  const diff = now - (timestamp * 1000 || timestamp)
  
  // 秒、分、时、天
  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  
  if (days > 0) {
    return `${days}天前`
  } else if (hours > 0) {
    return `${hours}小时前`
  } else if (minutes > 0) {
    return `${minutes}分钟前`
  } else if (seconds > 0) {
    return `${seconds}秒前`
  } else {
    return '刚刚'
  }
}

// 格式化价格（元转元）
function formatPrice(price, showUnit = true) {
  if (!price && price !== 0) {
    return '0.00'
  }
  
  const priceStr = Number(price).toFixed(2)
  return showUnit ? `¥${priceStr}` : priceStr
}

// 格式化手机号
function formatPhoneNumber(phone) {
  if (!phone) {
    return ''
  }
  
  return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
}

// 格式化金额（千分位）
function formatAmount(amount) {
  if (!amount && amount !== 0) {
    return '0'
  }
  
  return Number(amount).toLocaleString('zh-CN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
}

// 手机号验证
function validatePhoneNumber(phone) {
  return /^1[3-9]\d{9}$/.test(phone)
}

// 邮箱验证
function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

// 身份证号验证
function validateIDCard(idCard) {
  return /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(idCard)
}

// URL 验证
function validateURL(url) {
  return /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/.test(url)
}

// 防抖函数
function debounce(fn, delay = 300) {
  let timer = null
  
  return function(...args) {
    if (timer) {
      clearTimeout(timer)
    }
    
    timer = setTimeout(() => {
      fn.apply(this, args)
    }, delay)
  }
}

// 节流函数
function throttle(fn, delay = 300) {
  let lastTime = 0
  
  return function(...args) {
    const now = Date.now()
    if (now - lastTime >= delay) {
      fn.apply(this, args)
      lastTime = now
    }
  }
}

// 深拷贝
function deepClone(obj) {
  if (obj === null || typeof obj !== 'object') {
    return obj
  }
  
  if (obj instanceof Date) {
    return new Date(obj)
  }
  
  if (obj instanceof Array) {
    return obj.map(item => deepClone(item))
  }
  
  const cloned = {}
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      cloned[key] = deepClone(obj[key])
    }
  }
  
  return cloned
}

// 生成随机字符串
function generateRandomString(length = 32) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

// 生成随机数字
function generateRandomNumber(min = 1000, max = 9999) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

// 本地存储
const storage = {
  set(key, value) {
    try {
      wx.setStorageSync(key, value)
    } catch (e) {
      console.error('存储失败:', e)
    }
  },
  
  get(key, defaultValue = null) {
    try {
      const value = wx.getStorageSync(key)
      return value === undefined ? defaultValue : value
    } catch (e) {
      console.error('读取失败:', e)
      return defaultValue
    }
  },
  
  remove(key) {
    try {
      wx.removeStorageSync(key)
    } catch (e) {
      console.error('删除失败:', e)
    }
  },
  
  clear() {
    try {
      wx.clearStorageSync()
    } catch (e) {
      console.error('清空失败:', e)
    }
  }
}

// 缓存工具
const cache = {
  set(key, value, expire = 3600) {
    const data = {
      value,
      expire: Date.now() + expire * 1000
    }
    storage.set(`cache_${key}`, data)
  },
  
  get(key) {
    const data = storage.get(`cache_${key}`)
    if (!data) {
      return null
    }
    
    if (Date.now() > data.expire) {
      this.remove(key)
      return null
    }
    
    return data.value
  },
  
  remove(key) {
    storage.remove(`cache_${key}`)
  },
  
  clear() {
    try {
      const keys = wx.getStorageInfoSync().keys
      keys.forEach(key => {
        if (key.startsWith('cache_')) {
          storage.remove(key)
        }
      })
    } catch (e) {
      console.error('清理缓存失败:', e)
    }
  }
}

// 图片处理
const image = {
  // 处理图片路径
  getPath(path) {
    if (!path) {
      return '/images/default-placeholder.png'
    }
    
    if (path.startsWith('http')) {
      return path
    }
    
    return `${config.API_BASE_URL}${path}`
  },
  
  // 图片预加载
  preload(urls) {
    return new Promise((resolve, reject) => {
      const images = []
      let loaded = 0
      const total = urls.length
      
      if (total === 0) {
        resolve()
        return
      }
      
      urls.forEach((url, index) => {
        const img = new Image()
        img.onload = () => {
          loaded++
          if (loaded === total) {
            resolve()
          }
        }
        img.onerror = () => {
          loaded++
          if (loaded === total) {
            resolve()
          }
        }
        img.src = url
        images.push(img)
      })
    })
  }
}

// 设备信息
const device = {
  // 获取系统信息
  getSystemInfo() {
    try {
      return wx.getSystemInfoSync()
    } catch (e) {
      console.error('获取系统信息失败:', e)
      return {}
    }
  },
  
  // 是否为 iOS
  isIOS() {
    const systemInfo = this.getSystemInfo()
    return systemInfo.platform === 'ios'
  },
  
  // 是否为 Android
  isAndroid() {
    const systemInfo = this.getSystemInfo()
    return systemInfo.platform === 'android'
  },
  
  // 获取屏幕宽度
  getScreenWidth() {
    const systemInfo = this.getSystemInfo()
    return systemInfo.screenWidth
  },
  
  // 获取屏幕高度
  getScreenHeight() {
    const systemInfo = this.getSystemInfo()
    return systemInfo.screenHeight
  },
  
  // 获取导航栏高度
  getNavBarHeight() {
    const systemInfo = this.getSystemInfo()
    // iPhone X 等全面屏设备
    if (systemInfo.model.includes('iPhone X') || 
        systemInfo.model.includes('iPhone 11') ||
        systemInfo.model.includes('iPhone 12') ||
        systemInfo.model.includes('iPhone 13')) {
      return 88
    }
    return 44
  }
}

// 导出工具函数
module.exports = {
  // 时间相关
  formatTime,
  formatDate,
  formatTimeOnly,
  formatRelativeTime,
  
  // 价格相关
  formatPrice,
  formatAmount,
  
  // 验证相关
  validatePhoneNumber,
  validateEmail,
  validateIDCard,
  validateURL,
  
  // 功能相关
  debounce,
  throttle,
  deepClone,
  generateRandomString,
  generateRandomNumber,
  
  // 存储相关
  storage,
  cache,
  
  // 图片相关
  image,
  
  // 设备相关
  device
}