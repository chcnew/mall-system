Page({
  data: {
    tabs: [
      { id: 0, name: '可领取' },
      { id: 1, name: '已领取' },
      { id: 2, name: '已使用' },
      { id: 3, name: '已过期' }
    ],
    activeTab: 0,
    coupons: [],
    myCoupons: [],
    loading: false
  },

  onLoad(options) {
    if (options.tab) {
      this.setData({ activeTab: parseInt(options.tab) })
    }
    this.loadCoupons()
  },

  loadCoupons() {
    this.setData({ loading: true })
    
    setTimeout(() => {
      const coupons = [
        {
          id: 1,
          name: '新用户专享券',
          type: 1,
          amount: 20.00,
          min_amount: 100.00,
          start_time: '2025-01-01 00:00:00',
          end_time: '2025-12-31 23:59:59',
          received: false
        },
        {
          id: 2,
          name: '满200减50',
          type: 1,
          amount: 50.00,
          min_amount: 200.00,
          start_time: '2025-01-01 00:00:00',
          end_time: '2025-06-30 23:59:59',
          received: false
        },
        {
          id: 3,
          name: '全场通用券',
          type: 1,
          amount: 30.00,
          min_amount: 150.00,
          start_time: '2025-01-01 00:00:00',
          end_time: '2025-03-31 23:59:59',
          received: false
        }
      ]
      
      const myCoupons = [
        {
          id: 4,
          name: '生日福利券',
          type: 1,
          amount: 100.00,
          min_amount: 300.00,
          start_time: '2025-01-01 00:00:00',
          end_time: '2025-01-31 23:59:59',
          status: 1
        }
      ]
      
      this.setData({
        coupons,
        myCoupons,
        loading: false
      })
    }, 500)
  },

  onTabClick(e) {
    const tabId = e.currentTarget.dataset.id
    this.setData({ activeTab: tabId })
  },

  onReceiveCoupon(e) {
    const { id } = e.currentTarget.dataset
    const coupons = this.data.coupons.map(item => {
      if (item.id === id) {
        return { ...item, received: true }
      }
      return item
    })
    
    this.setData({ coupons })
    wx.showToast({
      title: '领取成功',
      icon: 'success'
    })
  },

  onCouponUse(e) {
    wx.switchTab({
      url: '/pages/index/index'
    })
  }
})