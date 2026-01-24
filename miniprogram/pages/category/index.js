Page({
  data: {
    categories: [],
    subCategories: [],
    products: [],
    selectedCategory: null,
    selectedSubCategory: null,
    loading: false
  },

  onLoad(options) {
    this.loadCategories()
    if (options.categoryId) {
      this.data.selectedCategory = parseInt(options.categoryId)
      this.loadSubCategories()
      this.loadProducts()
    }
  },

  loadCategories() {
    this.setData({ loading: true })
    
    setTimeout(() => {
      const categories = [
        { id: 1, name: '女装', icon: '' },
        { id: 2, name: '男装', icon: '' },
        { id: 3, name: '鞋靴', icon: '' },
        { id: 4, name: '箱包', icon: '' },
        { id: 5, name: '配饰', icon: '' },
        { id: 6, name: '美妆', icon: '' },
        { id: 7, name: '家居', icon: '' },
        { id: 8, name: '食品', icon: '' },
        { id: 9, name: '数码', icon: '' },
        { id: 10, name: '运动', icon: '' }
      ]
      
      this.setData({ 
        categories,
        selectedCategory: this.data.selectedCategory || categories[0].id
      })
      this.loadSubCategories()
    }, 300)
  },

  loadSubCategories() {
    const { selectedCategory } = this.data
    const categoryMap = {
      1: [
        { id: 11, name: '连衣裙' },
        { id: 12, name: '上衣' },
        { id: 13, name: '半身裙' },
        { id: 14, name: '裤装' }
      ],
      2: [
        { id: 21, name: 'T恤' },
        { id: 22, name: '衬衫' },
        { id: 23, name: '牛仔裤' },
        { id: 24, name: '外套' }
      ],
      3: [
        { id: 31, name: '休闲鞋' },
        { id: 32, name: '运动鞋' },
        { id: 33, name: '凉鞋' },
        { id: 34, name: '靴子' }
      ]
    }
    
    const subCategories = categoryMap[selectedCategory] || []
    this.setData({ 
      subCategories,
      selectedSubCategory: null
    })
    this.loadProducts()
  },

  loadProducts() {
    const { selectedCategory, selectedSubCategory } = this.data
    
    setTimeout(() => {
      const products = [
        { id: 1, name: '春季新款时尚连衣裙', price: 299.00, cover: '/images/default-product.png', isHot: true },
        { id: 2, name: '复古格子衬衫', price: 158.00, cover: '/images/default-product.png', isNew: true },
        { id: 3, name: '高腰阔腿牛仔裤', price: 259.00, cover: '/images/default-product.png' },
        { id: 4, name: '针织开衫外套', price: 199.00, cover: '/images/default-product.png', isHot: true },
        { id: 5, name: '简约纯色T恤', price: 79.00, cover: '/images/default-product.png' },
        { id: 6, name: '休闲运动裤', price: 129.00, cover: '/images/default-product.png' },
        { id: 7, name: '帆布鞋', price: 159.00, cover: '/images/default-product.png' },
        { id: 8, name: '棒球帽', price: 49.00, cover: '/images/default-product.png' }
      ]
      
      this.setData({ 
        products,
        loading: false
      })
    }, 400)
  },

  onCategoryClick(e) {
    const { id } = e.currentTarget.dataset
    this.setData({ selectedCategory: id })
    this.loadSubCategories()
  },

  onSubCategoryClick(e) {
    const { id } = e.currentTarget.dataset
    this.setData({ selectedSubCategory: id === this.data.selectedSubCategory ? null : id })
    this.loadProducts()
  },

  onProductClick(e) {
    const { id } = e.currentTarget.dataset
    wx.navigateTo({
      url: `/pages/product/index?id=${id}`
    })
  }
})