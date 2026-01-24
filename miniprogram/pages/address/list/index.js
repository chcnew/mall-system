Page({
  data: {
    addresses: [],
    selectMode: false,
    loading: false
  },

  onLoad(options) {
    if (options.select === 'true') {
      this.setData({ selectMode: true })
    }
  },

  onShow() {
    this.loadAddresses()
  },

  loadAddresses() {
    this.setData({ loading: true })
    
    setTimeout(() => {
      const addresses = [
        {
          id: 1,
          name: '张三',
          phone: '138****8888',
          province: '广东省',
          city: '深圳市',
          district: '南山区',
          detail: '科技园南区某某大厦A座1001室',
          isDefault: true
        },
        {
          id: 2,
          name: '李四',
          phone: '139****9999',
          province: '广东省',
          city: '广州市',
          district: '天河区',
          detail: '体育西路111号',
          isDefault: false
        }
      ]
      
      this.setData({ 
        addresses,
        loading: false
      })
    }, 500)
  },

  onAddAddress() {
    wx.navigateTo({
      url: '/pages/address/edit/index'
    })
  },

  onEditAddress(e) {
    const { id } = e.currentTarget.dataset
    wx.navigateTo({
      url: `/pages/address/edit/index?id=${id}`
    })
  },

  onDeleteAddress(e) {
    const { id } = e.currentTarget.dataset
    
    wx.showModal({
      title: '确认删除',
      content: '确定要删除该地址吗？',
      success: (res) => {
        if (res.confirm) {
          const addresses = this.data.addresses.filter(item => item.id !== id)
          this.setData({ addresses })
          wx.showToast({
            title: '删除成功',
            icon: 'success'
          })
        }
      }
    })
  },

  onSetDefault(e) {
    const { id } = e.currentTarget.dataset
    const addresses = this.data.addresses.map(item => ({
      ...item,
      isDefault: item.id === id
    }))
    this.setData({ addresses })
    wx.showToast({
      title: '设置成功',
      icon: 'success'
    })
  },

  onSelectAddress(e) {
    if (!this.data.selectMode) return
    
    const { id } = e.currentTarget.dataset
    const address = this.data.addresses.find(item => item.id === id)
    
    const pages = getCurrentPages()
    const prevPage = pages[pages.length - 2]
    if (prevPage && prevPage.onAddressSelected) {
      prevPage.onAddressSelected(address)
    }
    wx.navigateBack()
  }
})