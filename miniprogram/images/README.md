# 图片资源说明

## 占位符说明

由于是代码仓库，无法存储实际的图片文件。以下是需要的图片文件列表：

### 必要的图片文件

#### TabBar 图标
```
images/tabbar/
├── home.png                     # 首页图标（未点亮）
├── home-active.png             # 首页图标（点亮）
├── category.png                 # 分类图标（未点亮）
├── category-active.png          # 分类图标（点亮）
├── cart.png                     # 购物车图标（未点亮）
├── cart-active.png             # 购物车图标（点亮）
└── user.png                     # 我的图标（未点亮）
└── user-active.png             # 我的图标（点亮）
```

#### 功能图标
```
images/icons/
├── search.png                    # 搜索图标
├── cart.png                      # 购物车图标
├── favorite-empty.png            # 空心收藏图标
├── favorite-full.png             # 实心收藏图标
└── checkbox-checked.png          # 复选框选中图标
└── checkbox-unchecked.png        # 复选框未选中图标
└── plus.png                      # 加号图标
└── minus.png                     # 减号图标
└── back.png                      # 返回图标
└── close.png                     # 关闭图标
├── arrow-right.png              # 右箭头图标
└── loading.gif                  # 加载动画
└── logout.png                   # 退出图标
└── settings.png                 # 设置图标
└── address.png                   # 地址图标
└── service.png                   # 客服图标
└── order-unpaid.png               # 待付款图标
└── order-unshipped.png             # 待发货图标
└── order-unreceived.png            # 待收货图标
└── order-completed.png            # 已完成订单图标
```

#### 商品图片
```
images/products/
├── product1.png                  # 商品主图
├── product1-1.png               # SKU 图片1
├── product1-2.png               # SKU 图片2
└── product1-3.png               # SKU 图片3
```

#### 默认图片
```
images/
├── default-product.png            # 默认商品图片
└── default-category.png          # 默认分类图标
└── default-avatar.png             # 默认头像图片
└── empty.png                    # 空状态图片
└── empty-cart.png              # 空购物车图片
```

## 获取图片

### 方式一：从设计稿获取
1. 使用设计师提供的设计稿导出图片
2. 按照上述命名规范重命名
3. 放置到对应的目录

### 方式二：使用在线图标库
推荐使用的图标库：
- IconFont：https://www.iconfont.cn/
- IconPark：https://www.iconpark.com/
- 阿巴巴矢量图标库：https://www.iconfont.cn/

### 方式三：使用图片生成工具
- Canva（可画）：https://www.canva.cn/
- 创稿网：https://www稿定设计/
- 摄我图：https://www.nipic.com/

## 图片规格建议

| 图片类型 | 建议尺寸 | 格式 |
|---------|---------|------|
| TabBar图标 | 81x81 px | PNG，透明背景 |
| 功能图标 | 64x64 px | PNG，透明背景 |
| 商品主图 | 750x750 px | JPG/PNG，< 500KB |
| 商品详情图 | 750x750 px | JPG/PNG，< 1MB |
| 商品轮播图 | 1920x600 px | JPG/PNG，< 2MB |

## 注意事项

1. **图片命名**：严格遵循上述命名规范
2. **图片格式**：使用 PNG 或 JPG 格式
3. **图片大小**：图片文件尽量压缩，控制在 500KB 以内
4. **图片质量**：保持良好的图片质量
5. **版权问题**：确保所有图片都有使用权限

## 临时方案

在没有真实图片的情况下，可以使用以下方式：

### 方式一：使用在线图片
- 使用阿里云OSS、七牛云等云存储的免费额度
- 上传图片后，获取 CDN 地址

### 方式二：使用占位图服务
- 使用 Placehold.co 生成占位图
- 地址：https://via.placeholder.com/150
- 示例：https://via.placeholder.com/300x400

### 方式三：纯色占位图
- 使用 CSS 渐染纯色块作为图片占位符
- 在 app.wxss 中定义默认样式

## 快速开始

在图片资源准备完成之前，小程序会使用默认的占位符显示。可以在小程序中看到基本的界面效果。
