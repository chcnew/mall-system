// pages/cart/index.js - 购物车
const request = require('../../utils/request')
const auth = require('../../utils/auth')
const util = require('../../utils/util')
const app = getApp()

Page({
  data: {
    // 购物车列表
    cartList: [],
    // 是否全选
    selectAll: false,
    // 总价
    totalPrice: '0.00',
    // 总数量
    totalCount: 0,
    // 页面状态
    loading: false,
    // 编辑模式
    editMode: false,
    // 编辑选中的商品
    editSelectedIds: []
  },

  onLoad(options) {
    this.loadCartList()
  },

  onShow() {
    // 每次显示页面时刷新购物车
    this.loadCartList()
    // 更新 TabBar 徽标
    app.updateCartCount()
  },

  onPullDownRefresh() {
    this.refreshCartList()
  },

  onShareAppMessage() {
    return {
      title: '我的购物车',
      path: '/pages/cart/index'
    }
  },

  loadCartList() {
    this.setData({ loading: true })

    setTimeout(() => {
      const cartList = [
        {
          id: 1,
          product_id: 1,
          sku_id: 101,
          product: {
            id: 1,
            name: '春季新款时尚连衣裙',
            cover: '/images/default-product.png'
          },
          specs: '红色 / S码',
          price: 299.00,
          quantity: 2,
          stock: 100,
          selected: true
        },
        {
          id: 2,
          product_id: 2,
          sku_id: 202,
          product: {
            id: 2,
            name: '复古格子衬衫',
            cover: '/images/default-product.png'
          },
          specs: '蓝色 / M码',
          price: 158.00,
          quantity: 1,
          stock: 50,
          selected: false
        }
      ]

      this.setData({
        cartList,
        selectAll: this.isAllSelected(cartList),
        editSelectedIds: []
      })
      this.calculateTotal()
      this.setData({ loading: false })
    }, 500)
  },

  // 刷新购物车
  refreshCartList() {
    this.loadCartList().finally(() => {
      wx.stopPullDownRefresh()
    })
  },

  // 判断是否全选
  isAllSelected(cartList) {
    if (cartList.length === 0) {
      return false
    }
    return cartList.every(item => item.selected)
  },

  // 计算总价和总数
  calculateTotal() {
    const { cartList, editMode } = this.data
    let totalAmount = 0
    let totalCount = 0

    cartList.forEach(item => {
      // 计算模式或编辑模式
      if (item.selected || (editMode && this.data.editSelectedIds.includes(item.id))) {
        totalAmount += item.price * item.quantity
        totalCount += item.quantity
      }
    })

    this.setData({
      totalPrice: util.formatAmount(totalAmount),
      totalCount
    })
  },

  // 点击商品选中
  onItemSelect(e) {
    const { id } = e.currentTarget.dataset
    const { cartList } = this.data

    const index = cartList.findIndex(item => item.id === id)
    if (index !== -1) {
      cartList[index].selected = !cartList[index].selected
      this.setData({
        cartList,
        selectAll: this.isAllSelected(cartList)
      })
      this.calculateTotal()
    }
  },

  // 点击全选
  onSelectAll() {
    const { cartList, selectAll } = this.data
    const newSelectAll = !selectAll

    cartList.forEach(item => {
      item.selected = newSelectAll
    })

    this.setData({
      cartList,
      selectAll: newSelectAll
    })
    this.calculateTotal()
  },

  // 增加数量
  onIncrease(e) {
    const { id, maxStock } = e.currentTarget.dataset
    const { cartList } = this.data

    const index = cartList.findIndex(item => item.id === id)
    if (index !== -1) {
      const quantity = cartList[index].quantity
      if (quantity >= maxStock) {
        wx.showToast({
          title: '库存不足',
          icon: 'none'
        })
        return
      }

      this.updateCartItem(id, quantity + 1)
    }
  },

  // 减少数量
  onDecrease(e) {
    const { id } = e.currentTarget.dataset
    const { cartList } = this.data

    const index = cartList.findIndex(item => item.id === id)
    if (index !== -1) {
      const quantity = cartList[index].quantity
      if (quantity <= 1) {
        return
      }

      this.updateCartItem(id, quantity - 1)
    }
  },

  // 更新购物车商品
  updateCartItem(id, quantity) {
    const { cartList } = this.data
    const index = cartList.findIndex(item => item.id === id)
    
    if (index !== -1) {
      // 先更新本地数据
      cartList[index].quantity = quantity
      this.setData({ cartList })

      // 调用 API 更新
      request.put(`/cart/${id}`, {
        quantity
      }, { showLoading: false })
        .then(() => {
          // 成功后重新计算
          this.calculateTotal()
          // 更新 TabBar 徽标
          app.updateCartCount()
        })
        .catch(() => {
          // 失败后恢复数据
          cartList[index].quantity -= quantity > 1 ? 1 : 0
          this.setData({ cartList })
        })
    }
  },

  // 删除商品
  onDeleteItem(e) {
    const { id } = e.currentTarget.dataset

    wx.showModal({
      title: '确认删除',
      content: '确定要删除该商品吗？',
      success: (res) => {
        if (res.confirm) {
          this.deleteCartItem(id)
        }
      }
    })
  },

  // 删除购物车商品
  deleteCartItem(id) {
    const { cartList } = this.data

    request.delete(`/cart/${id}`, { showLoading: false })
      .then(() => {
        // 从列表中移除
        const newCartList = cartList.filter(item => item.id !== id)
        this.setData({ 
          cartList: newCartList,
          selectAll: this.isAllSelected(newCartList)
        })
        this.calculateTotal()
        // 更新 TabBar 徽标
        app.updateCartCount()
      })
      .catch(() => {
        // 错误已处理
      })
  },

  // 切换编辑模式
  onEditMode() {
    const { editMode } = this.data
    this.setData({
      editMode: !editMode,
      editSelectedIds: []
    })
    this.calculateTotal()
  },

  // 编辑模式下的选中
  onEditSelect(e) {
    const { id } = e.currentTarget.dataset
    const { editSelectedIds } = this.data

    const index = editSelectedIds.indexOf(id)
    if (index !== -1) {
      editSelectedIds.splice(index, 1)
    } else {
      editSelectedIds.push(id)
    }

    this.setData({ editSelectedIds })
    this.calculateTotal()
  },

  // 批量删除
  onBatchDelete() {
    const { editSelectedIds } = this.data

    if (editSelectedIds.length === 0) {
      wx.showToast({
        title: '请选择要删除的商品',
        icon: 'none'
      })
      return
    }

    wx.showModal({
      title: '确认删除',
      content: `确定要删除这 ${editSelectedIds.length} 个商品吗？`,
      success: (res) => {
        if (res.confirm) {
          this.batchDeleteItems()
        }
      }
    })
  },

  // 批量删除商品
  batchDeleteItems() {
    const { editSelectedIds, cartList } = this.data

    // 使用 Promise.all 并行删除
    const deletePromises = editSelectedIds.map(id => 
      request.delete(`/cart/${id}`, { showLoading: false })
    )

    Promise.all(deletePromises)
      .then(() => {
        // 从列表中移除
        const newCartList = cartList.filter(item => !editSelectedIds.includes(item.id))
        this.setData({
          cartList: newCartList,
          editMode: false,
          editSelectedIds: [],
          selectAll: this.isAllSelected(newCartList)
        })
        this.calculateTotal()
        // 更新 TabBar 徽标
        app.updateCartCount()
        wx.showToast({
          title: '删除成功',
          icon: 'none'
        })
      })
      .catch(() => {
        wx.showToast({
          title: '删除失败，请重试',
          icon: 'none'
        })
      })
  },

  onCheckout() {
    const selectedItems = this.data.cartList.filter(item => item.selected)

    if (selectedItems.length === 0) {
      wx.showToast({
        title: '请选择要结算的商品',
        icon: 'none'
      })
      return
    }

    wx.navigateTo({
      url: '/pages/order/confirm/index'
    })
  },

  // 跳转到商品详情
  onProductClick(e) {
    const { product } = e.detail
    wx.navigateTo({
      url: `/pages/product/index?id=${product.id}`
    })
  },

  // 点击商品卡片
  onCardClick(e) {
    const { product } = e.detail
    wx.navigateTo({
      url: `/pages/product/index?id=${product.id}`
    })
  }
})