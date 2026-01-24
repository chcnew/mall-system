Page({
  data: {
    favorites: [],
    selectMode: false,
    selectedIds: [],
    loading: false,
    editing: false
  },

  onLoad() {
    this.loadFavorites()
  },

  onShow() {
    if (this.data.editing) {
      this.loadFavorites()
    }
  },

  loadFavorites() {
    this.setData({ loading: true })
    
    setTimeout(() => {
      const favorites = [
        {
          id: 1,
          product_id: 1,
          name: '春季新款时尚连衣裙',
          price: 299.00,
          original_price: 599.00,
          cover: '/images/default-product.png',
          stock: 100,
          sales: 128
        },
        {
          id: 2,
          product_id: 2,
          name: '复古格子衬衫',
          price: 158.00,
          original_price: 299.00,
          cover: '/images/default-product.png',
          stock: 50,
          sales: 86
        },
        {
          id: 3,
          product_id: 3,
          name: '高腰阔腿牛仔裤',
          price: 259.00,
          original_price: 459.00,
          cover: '/images/default-product.png',
          stock: 80,
          sales: 215
        }
      ]
      
      this.setData({ 
        favorites,
        loading: false,
        editing: false
      })
    }, 500)
  },

  onProductClick(e) {
    if (this.data.editing) {
      this.toggleSelect(e.currentTarget.dataset.id)
      return
    }
    
    const { id } = e.currentTarget.dataset
    wx.navigateTo({
      url: `/pages/product/index?id=${id}`
    })
  },

  onEdit() {
    this.setData({ 
      editing: true,
      selectedIds: []
    })
  },

  onFinishEdit() {
    this.setData({ 
      editing: false,
      selectedIds: []
    })
  },

  toggleSelect(id) {
    const { selectedIds } = this.data
    const index = selectedIds.indexOf(id)
    
    if (index !== -1) {
      selectedIds.splice(index, 1)
    } else {
      selectedIds.push(id)
    }
    
    this.setData({ selectedIds })
  },

  onToggleSelect(e) {
    this.toggleSelect(e.currentTarget.dataset.id)
  },

  onAddToCart(e) {
    const { id } = e.currentTarget.dataset
    wx.showToast({
      title: '已加入购物车',
      icon: 'success'
    })
  },

  onDeleteSelected() {
    if (this.data.selectedIds.length === 0) {
      wx.showToast({
        title: '请选择商品',
        icon: 'none'
      })
      return
    }
    
    wx.showModal({
      title: '确认删除',
      content: `确定删除这${this.data.selectedIds.length}个商品吗？`,
      success: (res) => {
        if (res.confirm) {
          const favorites = this.data.favorites.filter(
            item => !this.data.selectedIds.includes(item.id)
          )
          this.setData({ 
            favorites,
            selectedIds: [],
            editing: false
          })
          wx.showToast({
            title: '删除成功',
            icon: 'success'
          })
        }
      }
    })
  }
})