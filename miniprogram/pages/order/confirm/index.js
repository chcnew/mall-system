Page({
  data: {
    address: {
      id: 1,
      name: '张三',
      phone: '138****8888',
      province: '广东省',
      city: '深圳市',
      district: '南山区',
      detail: '科技园南区某某大厦A座1001室',
      isDefault: true
    },

    products: [
      {
        id: 1,
        product_id: 1,
        sku_id: 101,
        name: '春季新款时尚连衣裙',
        cover: '/images/default-product.png',
        sku_name: '红色 / S码',
        price: 299.00,
        quantity: 2
      },
      {
        id: 2,
        product_id: 2,
        sku_id: 202,
        name: '复古格子衬衫',
        cover: '/images/default-product.png',
        sku_name: '蓝色 / M码',
        price: 158.00,
        quantity: 1
      }
    ],

    availableCoupons: [
      {
        id: 1,
        name: '新用户专享券',
        type: 1,
        amount: 20.00,
        min_amount: 100.00,
        start_time: '2025-01-01 00:00:00',
        end_time: '2025-12-31 23:59:59'
      },
      {
        id: 2,
        name: '满200减50',
        type: 1,
        amount: 50.00,
        min_amount: 200.00,
        start_time: '2025-01-01 00:00:00',
        end_time: '2025-06-30 23:59:59'
      }
    ],

    selectedCoupon: null,

    remark: '',

    freightAmount: 0.00,
    discountAmount: 0.00,
    subtotal: 0.00,
    totalAmount: 0.00,

    loading: false,
    submitting: false
  },

  onLoad(options) {
    this.loadOrderData()
  },

  loadOrderData() {
    this.setData({ loading: true })
    
    setTimeout(() => {
      this.calculatePrice()
      this.setData({ loading: false })
    }, 500)
  },

  calculatePrice() {
    const { products, freightAmount, selectedCoupon } = this.data
    
    const subtotal = products.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const realFreight = subtotal >= 99 ? 0 : freightAmount
    
    let discountAmount = 0
    if (selectedCoupon) {
      const { amount, min_amount } = selectedCoupon
      if (subtotal >= min_amount) {
        discountAmount = amount
      }
    }
    
    const totalAmount = subtotal + realFreight - discountAmount
    
    this.setData({
      subtotal,
      freightAmount: realFreight,
      discountAmount,
      totalAmount: totalAmount > 0 ? totalAmount : 0
    })
  },

  onAddressClick() {
    wx.navigateTo({
      url: '/pages/address/list/index?select=true'
    })
  },

  onAddressSelected(address) {
    this.setData({ address })
    this.calculatePrice()
  },

  onCouponClick() {
    const { availableCoupons, subtotal } = this.data
    const validCoupons = availableCoupons.filter(c => subtotal >= c.min_amount)
    
    if (validCoupons.length === 0) {
      wx.showToast({
        title: '无可用优惠券',
        icon: 'none'
      })
      return
    }
    
    wx.showActionSheet({
      itemList: validCoupons.map(c => `${c.name}（减${c.amount}元）`),
      success: (res) => {
        const selected = validCoupons[res.tapIndex]
        this.setData({ selectedCoupon: selected })
        this.calculatePrice()
      }
    })
  },

  onRemoveCoupon() {
    this.setData({ selectedCoupon: null })
    this.calculatePrice()
  },

  onRemarkChange(e) {
    this.setData({ remark: e.detail.value })
  },

  onSubmitOrder() {
    const { address, products, selectedCoupon, remark, totalAmount } = this.data
    
    if (!address) {
      wx.showToast({
        title: '请选择收货地址',
        icon: 'none'
      })
      return
    }
    
    if (products.length === 0) {
      wx.showToast({
        title: '订单中无商品',
        icon: 'none'
      })
      return
    }
    
    if (totalAmount <= 0) {
      wx.showToast({
        title: '订单金额异常',
        icon: 'none'
      })
      return
    }
    
    this.setData({ submitting: true })
    
    setTimeout(() => {
      wx.showToast({
        title: '提交成功',
        icon: 'success'
      })
      
      setTimeout(() => {
        wx.redirectTo({
          url: `/pages/pay/index?id=1&orderNo=ORD20250124120001&amount=${totalAmount}`
        })
      }, 1500)
    }, 1000)
  }
})