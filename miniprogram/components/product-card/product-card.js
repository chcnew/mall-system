// components/product-card/product-card.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    // 商品对象
    product: {
      type: Object,
      value: {}
    },
    // 是否显示加入购物车按钮
    showCart: {
      type: Boolean,
      value: true
    },
    // 是否显示收藏按钮
    showFavorite: {
      type: Boolean,
      value: true
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    defaultImage: '/images/default-product.png'
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 点击商品卡片
    onProductClick() {
      const { product } = this.properties
      this.triggerEvent('click', product)
    },

    // 点击加入购物车
    onAddToCart() {
      const { product } = this.properties
      this.triggerEvent('addCart', product)
      
      // 加入购物车动画
      this.animateAddCart()
    },

    // 点击收藏
    onToggleFavorite() {
      const { product } = this.properties
      product.isFavorite = !product.isFavorite
      this.setData({ product })
      this.triggerEvent('favorite', { product, isFavorite: product.isFavorite })
    },

    // 加入购物车动画
    animateAddCart() {
      const cartIcon = this.selectComponent('.cart-icon')
      if (cartIcon) {
        // 创建动画
        cartIcon.animate({
          scale: [1, 1.2, 1],
          opacity: [1, 0.8, 1],
          duration: 500,
          timingFunction: 'ease-in-out'
        })
      }
    },

    // 图片加载失败
    onImageError(e) {
      const { product } = this.properties
      product.cover = this.data.defaultImage
      this.setData({ product })
    },

    // 格式化价格
    formatPrice(price) {
      return `¥${Number(price).toFixed(2)}`
    },

    // 判断是否在售
    isInSale(product) {
      return product.status === 1 || product.status === true
    },

    // 判断是否有库存
    hasStock(product) {
      return product.stock > 0
    }
  }
})