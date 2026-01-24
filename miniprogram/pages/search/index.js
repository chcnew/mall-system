Page({
  data: {
    keyword: '',
    hotKeywords: [],
    historyKeywords: [],
    searchResults: [],
    hasSearched: false,
    loading: false
  },

  onLoad(options) {
    this.loadHotKeywords()
    this.loadHistoryKeywords()
  },

  onShow() {
    if (this.data.keyword) {
      wx.setNavigationBarTitle({
        title: this.data.keyword
      })
    }
  },

  loadHotKeywords() {
    setTimeout(() => {
      const hotKeywords = [
        '连衣裙', 'T恤', '牛仔裤', '运动鞋', 
        '外套', '裙子', '衬衫', '凉鞋'
      ]
      this.setData({ hotKeywords })
    }, 300)
  },

  loadHistoryKeywords() {
    const history = wx.getStorageSync('searchHistory') || []
    this.setData({ historyKeywords: history })
  },

  onInput(e) {
    this.setData({ keyword: e.detail.value })
  },

  onClearInput() {
    this.setData({ 
      keyword: '',
      searchResults: [],
      hasSearched: false
    })
  },

  onSearch() {
    const { keyword } = this.data
    if (!keyword.trim()) {
      return
    }
    
    this.performSearch(keyword)
  },

  performSearch(keyword) {
    this.setData({ loading: true })
    
    setTimeout(() => {
      const results = [
        { id: 1, name: '春季新款时尚连衣裙', price: 299.00, cover: '/images/default-product.png' },
        { id: 2, name: '复古格子衬衫', price: 158.00, cover: '/images/default-product.png' },
        { id: 3, name: '高腰阔腿牛仔裤', price: 259.00, cover: '/images/default-product.png' },
        { id: 4, name: '针织开衫外套', price: 199.00, cover: '/images/default-product.png' }
      ]
      
      this.saveHistory(keyword)
      this.setData({ 
        searchResults: results,
        hasSearched: true,
        loading: false
      })
      
      wx.setNavigationBarTitle({
        title: keyword
      })
    }, 500)
  },

  saveHistory(keyword) {
    let history = wx.getStorageSync('searchHistory') || []
    const index = history.indexOf(keyword)
    if (index !== -1) {
      history.splice(index, 1)
    }
    history.unshift(keyword)
    if (history.length > 10) {
      history = history.slice(0, 10)
    }
    wx.setStorageSync('searchHistory', history)
    this.setData({ historyKeywords: history })
  },

  onKeywordClick(e) {
    const { keyword } = e.currentTarget.dataset
    this.setData({ keyword })
    this.performSearch(keyword)
  },

  onClearHistory() {
    wx.showModal({
      title: '提示',
      content: '确定要清空搜索历史吗？',
      success: (res) => {
        if (res.confirm) {
          wx.removeStorageSync('searchHistory')
          this.setData({ historyKeywords: [] })
        }
      }
    })
  },

  onProductClick(e) {
    const { id } = e.currentTarget.dataset
    wx.navigateTo({
      url: `/pages/product/index?id=${id}`
    })
  }
})