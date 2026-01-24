Page({
  data: {
    id: null,
    name: '',
    phone: '',
    province: '',
    city: '',
    district: '',
    detail: '',
    isDefault: false
  },

  onLoad(options) {
    if (options.id) {
      this.loadAddress(options.id)
    }
  },

  loadAddress(id) {
    setTimeout(() => {
      const address = {
        id: 1,
        name: '张三',
        phone: '138****8888',
        province: '广东省',
        city: '深圳市',
        district: '南山区',
        detail: '科技园南区某某大厦A座1001室',
        isDefault: true
      }
      
      this.setData({
        id: address.id,
        name: address.name,
        phone: address.phone,
        province: address.province,
        city: address.city,
        district: address.district,
        detail: address.detail,
        isDefault: address.isDefault
      })
    }, 300)
  },

  onNameInput(e) {
    this.setData({ name: e.detail.value })
  },

  onPhoneInput(e) {
    this.setData({ phone: e.detail.value })
  },

  onAddressPicker() {
    wx.showToast({
      title: '请选择省市区',
      icon: 'none'
    })
  },

  onDetailInput(e) {
    this.setData({ detail: e.detail.value })
  },

  onDefaultChange(e) {
    this.setData({ isDefault: e.detail.value })
  },

  onSave() {
    const { name, phone, province, city, district, detail } = this.data
    
    if (!name) {
      wx.showToast({
        title: '请输入收货人姓名',
        icon: 'none'
      })
      return
    }
    
    if (!phone) {
      wx.showToast({
        title: '请输入手机号',
        icon: 'none'
      })
      return
    }
    
    if (!/^[1][3-9]\d{9}$/.test(phone)) {
      wx.showToast({
        title: '手机号格式不正确',
        icon: 'none'
      })
      return
    }
    
    if (!province || !city || !district) {
      wx.showToast({
        title: '请选择省市区',
        icon: 'none'
      })
      return
    }
    
    if (!detail) {
      wx.showToast({
        title: '请输入详细地址',
        icon: 'none'
      })
      return
    }
    
    setTimeout(() => {
      wx.showToast({
        title: '保存成功',
        icon: 'success'
      })
      setTimeout(() => {
        wx.navigateBack()
      }, 1500)
    }, 500)
  }
})