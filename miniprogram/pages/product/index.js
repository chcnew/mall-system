// pages/product/index.js - 商品详情页
const request = require('../../utils/request')
const auth = require('../../utils/auth')
const util = require('../../utils/util')
const app = getApp()

Page({
  data: {
    // 商品信息
    product: {},
    // SKU 信息
    skus: [],
    // 当前选中的规格
    selectedSpecs: {},
    // 当前选中 SKU
    selectedSku: null,
    // 数量
    quantity: 1,
    // 收藏状态
    isFavorite: false,
    // 是否显示规格弹窗
    showSkuModal: false,
    // 是否在加载
    loading: false
  },

  onLoad(options) {
    const productId = options.id
    if (productId) {
      this.loadProductDetail(productId)
    }
  },

  onShow() {
    // 更新购物车数量
    app.updateCartCount()
  },

  // 加载商品详情
  loadProductDetail(productId) {
    this.setData({ loading: true })

    // 模拟数据（后端 API 接通后移除模拟数据）
    setTimeout(() => {
      this.setData({
        loading: false,
        product: {
          id: productId,
          name: '春季新款时尚连衣裙',
          subtitle: '优质面料，舒适透气',
          cover: '/images/products/product1.png',
          images: [
            '/images/products/product1-1.png',
            '/images/products/product1-2.png',
            '/images/products/product1-3.png'
          ],
          description: '<p>本款连衣裙采用优质面料，透气舒适，简约设计，适合春夏季节穿着。</p>',
          price: 299.00,
          original_price: 599.00,
          stock: 500,
          sales: 128,
          status: 1,
          isHot: true,
          isNew: true,
          sort: 10
        },
        skus: [
          {
            id: 1,
            product_id: productId,
            sku_code: 'SPU001-S001',
            specs: {
              '颜色': '红色',
              '尺码': 'S'
            },
            price: 299.00,
            stock: 300,
            image: '/images/products/product1-1.png'
          },
          {
            id: 2,
            product_id: productId,
            sku_code: 'SPU001-S002',
            specs: {
              '颜色': '红色',
              '尺码': 'M'
            },
            price: 299.00,
            stock: 200,
            image: '/images/products/product1-1.png'
          },
          {
            id: 3,
            product_id: productId,
            sku_code: 'SPU001-S003',
            specs: {
              '颜色': '黑色',
              '尺码': 'L'
            },
            price: 299.00,
            stock: 0,
            image: '/images/products/product1-1.png'
          }
        ],
        selectedSku: {
          id: 1,
          product_id: productId,
          sku_code: 'SPU001-S001',
          specs: {
            '颜色': '红色',
            '尺码': 'S'
          },
          price: 299.00,
          stock: 300,
          image: '/images/products/product1-1.png'
        },
        selectedSpecs: {
          '颜色': '红色',
          '尺码': 'S'
        },
        quantity: 1
      })
    }, 500)
  },

  onShareAppMessage() {
    const { product } = this.data
    return {
      title: product.name || '商品详情',
      path: `/pages/product/index?id=${product.id}`,
      imageUrl: product.cover || ''
    }
  },

  // 选择规格
  onSpecChange(e) {
    const { specKey, specValue } = e.currentTarget.dataset
    const { selectedSpecs } = this.data

    // 更新选中规格
    selectedSpecs[specKey] = specValue

    this.setData({ selectedSpecs })

    // 检查是否有完整的规格组合
    const completeSpecs = this.isCompleteSpecs()
    if (completeSpecs) {
      this.findMatchingSku()
    }
  },

  // 判断规格是否完整
  isCompleteSpecs() {
    const { skus } = this.data
    if (skus.length === 0) return false

    // 获取所有可能的规格键
    const allSpecKeys = []
    skus.forEach(sku => {
      if (sku.specs) {
        Object.keys(sku.specs).forEach(key => {
          if (!allSpecKeys.includes(key)) {
            allSpecKeys.push(key)
          }
        })
      }
    })

    const { selectedSpecs } = this.data
    return allSpecKeys.every(key => selectedSpecs[key])
  },

  // 查找匹配的 SKU
  findMatchingSku() {
    const { skus, selectedSpecs } = this.data
    const matchingSku = skus.find(sku => {
      if (!sku.specs) return false
      return Object.keys(sku.specs).every(key => 
        sku.specs[key] === selectedSpecs[key]
      )
    })

    if (matchingSku) {
      this.selectSku(matchingSku)
    }
  },

  // 选择 SKU
  selectSku(sku) {
    this.setData({
      selectedSku: sku,
      selectedSpecs: sku.specs || {},
      quantity: 1
    })
  },

  // 数量减少
  onDecrease() {
    const { quantity, selectedSku, product } = this.data
    const stock = selectedSku ? selectedSku.stock : product.stock || 0

    if (quantity <= 1) {
      return
    }

    this.setData({ quantity: quantity - 1 })
  },

  // 数量增加
  onIncrease() {
    const { quantity, selectedSku, product } = this.data
    const stock = selectedSku ? selectedSku.stock : product.stock || 0

    if (quantity >= stock) {
      wx.showToast({
        title: '库存不足',
        icon: 'none'
      })
      return
    }

    this.setData({ quantity: quantity + 1 })
  },

  // 打开规格选择器
  onShowSkuModal() {
    this.setData({ showSkuModal: true })
  },

  // 关闭规格选择器
  onCloseSkuModal() {
    this.setData({ showSkuModal: false })
  },

  // 确认规格
  onConfirmSku() {
    this.onCloseSkuModal()
  },

  // 切换收藏
  onToggleFavorite() {
    const { product } = this.data
    product.isFavorite = !product.isFavorite
    this.setData({ product })
    
    wx.showToast({
      title: product.isFavorite ? '已收藏' : '已取消收藏',
      icon: 'none'
    })
    
    if (product.isFavorite) {
      wx.showToast({
        title: '已加入收藏',
        icon: 'success'
      })
    }
  },

  // 跳转到购物车
  goToCart() {
    wx.switchTab({
      url: '/pages/cart/index'
    })
  },

  // 立即购买
  onBuyNow() {
    this.checkLoginAndBuy()
  },

  // 检查登录并购买
  checkLoginAndBuy() {
    if (!auth.checkLoginStatus()) {
      wx.showModal({
        title: '提示',
        content: '请先登录',
        confirmText: '去登录',
        success: (res) => {
          if (res.confirm) {
            wx.switchTab({
              url: '/pages/user/index'
            })
          }
        }
      })
      return
    }

    this.goToOrderConfirm()
  },

  // 跳转到订单确认页
  goToOrderConfirm() {
    const { selectedSku, product, quantity } = this.data

    if (!selectedSku) {
      this.onShowSkuModal()
      return
    }

    const products = [{
      product_id: product.id,
      sku_id: selectedSku.id,
      quantity
    }]

    wx.navigateTo({
      url: `/pages/order/confirm/index?products=${encodeURIComponent(JSON.stringify(products))}`
    })
  },

  // 加入购物车
  onAddToCart() {
    if (!this.data.selectedSku) {
      this.onShowSkuModal()
      return
    }

    this.checkLoginAndAdd()
  },

  // 检查登录并添加
  checkLoginAndAdd() {
    if (!auth.checkLoginStatus()) {
      wx.showModal({
        title: '提示',
        content: '请先登录',
        confirmText: '去登录',
        success: (res) => {
          if (res.confirm) {
            wx.switchTab({
              url: '/pages/user/index'
            })
          }
        }
      })
      return
    }

    this.addToCart()
  },

  // 加入购物车请求
  addToCart() {
    const { selectedSku, product, quantity } = this.data

    // 模拟请求（后端 API 接通后移除模拟）
    setTimeout(() => {
      wx.showToast({
        title: '已加入购物车',
        icon: 'none'
      })

      // 更新购物车数量
      app.globalData.cartCount = (app.globalData.cartCount || 0) + quantity
    }, 300)
  },

  // 图片预览
  onPreviewImage(e) {
    const { url } = e.currentTarget.dataset
    const urls = this.data.product.images || []

    if (urls.length > 0) {
      wx.previewImage({
        current: url,
        urls: urls
      })
    }
  },

  // 格式化价格
  formatPrice(price) {
    if (!price && price !== 0) {
      return '0.00'
    }
    return `¥${this.toFixed2(price)}`
  },

  // 格式化价格为两位小数
  toFixed2(num) {
    return Number(num).toFixed(2)
  },

  // 判断商品是否可购买
  canBuy() {
    const { selectedSku, product } = this.data
    const stock = selectedSku ? selectedSku.stock : product.stock || 0
    const status = product.status !== 0

    return stock > 0 && status
  },

  // 获取当前价格
  getCurrentPrice() {
    const { selectedSku, product } = this.data
    return selectedSku ? selectedSku.price : product.price || 0
  },

  // 判断是否折扣
  isDiscount() {
    const { selectedSku, product } = this.data
    const originalPrice = selectedSku ? selectedSku.original_price : product.original_price
    const currentPrice = this.getCurrentPrice()

    return originalPrice && originalPrice > currentPrice
  },

  // 获取原价
  getOriginalPrice() {
    const { selectedSku, product } = this.data
    return selectedSku ? selectedSku.original_price : product.original_price
  },

  // 获取节省金额
  getDiscountAmount() {
    const original = this.getOriginalPrice()
    const current = this.getCurrentPrice()
    if (!original || original <= current) {
      return 0
    }
    return this.toFixed2(original - current)
  }
})