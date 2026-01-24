Page({
  data: {
    tabs: [
      { id: 0, name: '全部' },
      { id: 1, name: '待付款' },
      { id: 2, name: '待发货' },
      { id: 3, name: '待收货' },
      { id: 4, name: '已完成' }
    ],
    activeTab: 0,

    orders: [
      {
        id: 1,
        order_no: 'ORD20250124120001',
        status: 1,
        status_text: '待付款',
        create_time: '2025-01-24 12:00:01',
        total_amount: 756.00,
        pay_amount: 756.00,
        products: [
          {
            id: 1,
            name: '春季新款时尚连衣裙',
            cover: '/images/default-product.png',
            sku_name: '红色 / S码',
            price: 299.00,
            quantity: 2
          }
        ]
      },
      {
        id: 2,
        order_no: 'ORD20250123180002',
        status: 2,
        status_text: '待发货',
        create_time: '2025-01-23 18:00:02',
        total_amount: 158.00,
        pay_amount: 158.00,
        products: [
          {
            id: 2,
            name: '复古格子衬衫',
            cover: '/images/default-product.png',
            sku_name: '蓝色 / M码',
            price: 158.00,
            quantity: 1
          }
        ]
      },
      {
        id: 3,
        order_no: 'ORD20250122150003',
        status: 4,
        status_text: '已完成',
        create_time: '2025-01-22 15:00:03',
        total_amount: 599.00,
        pay_amount: 549.00,
        products: [
          {
            id: 3,
            name: '高腰阔腿牛仔裤',
            cover: '/images/default-product.png',
            sku_name: '黑色 / 26码',
            price: 299.00,
            quantity: 2
          }
        ]
      }
    ],

    filteredOrders: [],
    loading: false
  },

  onLoad(options) {
    const tabId = options.tab ? parseInt(options.tab) : 0
    this.setData({ activeTab: tabId })
    this.filterOrders()
  },

  filterOrders() {
    const { activeTab, orders } = this.data
    let filtered = orders

    if (activeTab !== 0) {
      filtered = orders.filter(order => order.status === activeTab)
    }

    this.setData({ filteredOrders: filtered })
  },

  onTabClick(e) {
    const tabId = e.currentTarget.dataset.id
    this.setData({ activeTab: tabId })
    this.filterOrders()
  },

  onOrderClick(e) {
    const orderId = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/order/detail/index?id=${orderId}`
    })
  },

  onPay(e) {
    const orderId = e.currentTarget.dataset.id
    const order = this.data.orders.find(item => item.id === orderId)
    wx.navigateTo({
      url: `/pages/pay/index?id=${orderId}&orderNo=${order.order_no}&amount=${order.pay_amount}`
    })
  },

  onCancelOrder(e) {
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

  onConfirmReceipt(e) {
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

  onBuyAgain(e) {
    wx.showToast({
      title: '已加入购物车',
      icon: 'success'
    })
  }
})