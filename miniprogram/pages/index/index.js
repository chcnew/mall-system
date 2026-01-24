// pages/index/index.js - 首页
const app = getApp()

Page({
  data: {
    banners: [],
    categories: [],
    hotProducts: [],
    newProducts: [],
    loading: true
  },

  onLoad(options) {
    console.log('首页加载')
    this.loadData()
  },

  onShow() {
    app.updateCartCount()
  },

  loadData() {
    console.log('开始加载数据')
    
    setTimeout(() => {
      this.setData({
        banners: [
          { id: 1, image: '/images/banner1.png' },
          { id: 2, image: '/images/banner2.png' },
          { id: 3, image: '/images/banner3.png' }
        ],
        categories: [
          { id: 1, name: '女装', icon: '' },
          { id: 2, name: '男装', icon: '' },
          { id: 3, name: '鞋靴', icon: '' },
          { id: 4, name: '箱包', icon: '' }
        ],
        hotProducts: [
          { id: 1, name: '春季新款时尚连衣裙', price: 299.00 },
          { id: 2, name: '复古格子衬衫', price: 158.00 }
        ],
        newProducts: [
          { id: 3, name: '简约纯色T恤', price: 79.00 },
          { id: 4, name: '休闲运动裤', price: 129.00 }
        ],
        loading: false
      })
      console.log('数据加载完成')
    }, 500)
  },

  onBannerChange(e) {
    console.log('轮播切换', e.detail.current)
  },

  onCategoryClick(e) {
    const id = e.currentTarget.dataset.id
    console.log('点击分类', id)
    wx.navigateTo({
      url: `/pages/category/index?categoryId=${id}`
    })
  },

  onProductClick(e) {
    const id = e.currentTarget.dataset.id
    console.log('点击商品', id)
    wx.navigateTo({
      url: `/pages/product/index?id=${id}`
    })
  },

  goToSearch() {
    wx.navigateTo({
      url: '/pages/search/index'
    })
  }
})