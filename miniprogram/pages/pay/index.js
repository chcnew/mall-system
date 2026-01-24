Page({
  data: {
    orderId: null,
    orderNo: '',
    amount: 0.00,
    paymentMethods: [
      { id: 1, name: '微信支付', icon: '/images/icons/wechat-pay.png', checked: true },
      { id: 2, name: '余额支付', icon: '/images/icons/balance.png', checked: false }
    ],
    selectedMethod: 1,
    loading: false,
    paying: false
  },

  onLoad(options) {
    const { orderNo, amount } = options
    this.setData({
      orderId: options.id,
      orderNo: orderNo || 'ORD20250124120001',
      amount: amount || 756.00
    })
  },

  onSelectMethod(e) {
    const { id } = e.currentTarget.dataset
    this.setData({ 
      selectedMethod: id,
      paymentMethods: this.data.paymentMethods.map(item => ({
        ...item,
        checked: item.id === id
      }))
    })
  },

  onPay() {
    if (this.data.paying) return
    
    this.setData({ paying: true })
    
    setTimeout(() => {
      wx.showToast({
        title: '支付成功',
        icon: 'success'
      })
      
      setTimeout(() => {
        wx.redirectTo({
          url: `/pages/order/detail/index?id=${this.data.orderId}`
        })
      }, 1500)
    }, 2000)
  },

  onCancel() {
    wx.navigateBack()
  }
})