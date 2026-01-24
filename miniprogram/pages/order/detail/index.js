Page({
  data: {
    order: {
      id: 1,
      order_no: 'ORD20250124120001',
      status: 1,
      status_text: '待付款',
      create_time: '2025-01-24 12:00:01',
      total_amount: 756.00,
      freight_amount: 0.00,
      discount_amount: 0.00,
      pay_amount: 756.00,
      address: {
        name: '张三',
        phone: '138****8888',
        province: '广东省',
        city: '深圳市',
        district: '南山区',
        detail: '科技园南区某某大厦A座1001室'
      },
      products: [
        {
          id: 1,
          name: '春季新款时尚连衣裙',
          cover: '/images/default-product.png',
          sku_name: '红色 / S码',
          price: 299.00,
          quantity: 2
        },
        {
          id: 2,
          name: '复古格子衬衫',
          cover: '/images/default-product.png',
          sku_name: '蓝色 / M码',
          price: 158.00,
          quantity: 1
        }
      ],
      timeline: [
        { time: '2025-01-24 12:00:01', content: '订单创建成功' },
        { time: '2025-01-24 12:00:01', content: '等待买家付款' }
      ],
      remark: ''
    },

    loading: false
  },

  onLoad(options) {
    const orderId = options.id
    this.loadOrderDetail(orderId)
  },

  loadOrderDetail(orderId) {
    this.setData({ loading: true })
    
    setTimeout(() => {
      this.setData({ loading: false })
    }, 500)
  },

  onCancelOrder() {
    wx.showModal({
      title: '提示',
      content: '确定要取消该订单吗？',
      success: (res) => {
        if (res.confirm) {
          wx.showToast({
            title: '已取消',
            icon: 'success'
          })
        }
      }
    })
  },

  onPay() {
    wx.navigateTo({
      url: `/pages/pay/index?id=${this.data.order.id}&orderNo=${this.data.order.order_no}&amount=${this.data.order.pay_amount}`
    })
  },

  onConfirmReceipt() {
    wx.showModal({
      title: '提示',
      content: '确定已收到商品吗？',
      success: (res) => {
        if (res.confirm) {
          wx.showToast({
            title: '确认成功',
            icon: 'success'
          })
        }
      }
    })
  },

  onBuyAgain() {
    wx.showToast({
      title: '已加入购物车',
      icon: 'success'
    })
  },

  onContactService() {
    wx.showToast({
      title: '请联系客服',
      icon: 'none'
    })
  }
})