# 配置 R2 Public URL 快速指南

## 🚀 快速配置

运行以下命令，按提示操作：

```bash
./scripts/setup-public-url.sh
```

## 📋 手动配置步骤

### 1. 打开 Cloudflare Dashboard
访问：https://dash.cloudflare.com/82ebeb1d91888e83e8e1b30eeb33d3c3/r2/buckets/junyangcrm-files

### 2. 进入 Settings
- 点击 Bucket 详情页顶部的 **Settings** 标签

### 3. 启用 Public Access
- 在 **Public Access** 部分
- 点击 **Allow Access** 按钮
- 复制显示的 Public URL（格式：`https://pub-xxxxx.r2.dev`）

### 4. 配置到项目

**方法一：使用脚本**
```bash
./scripts/setup-public-url.sh
# 然后粘贴 Public URL
```

**方法二：手动编辑**
```bash
nano .env.local
```

添加或更新：
```env
R2_PUBLIC_URL=https://pub-xxxxx.r2.dev
```

## ✅ 验证配置

```bash
npm run verify:r2
```

## 🎯 直接链接

- **R2 页面**: https://dash.cloudflare.com/82ebeb1d91888e83e8e1b30eeb33d3c3/r2
- **您的 Bucket**: https://dash.cloudflare.com/82ebeb1d91888e83e8e1b30eeb33d3c3/r2/buckets/junyangcrm-files

## ⚠️ 重要提示

1. **Public Access 意味着文件可以被任何人访问**
   - 只上传可以公开的文件
   - 敏感文件保持私有

2. **如果不设置 Public URL**
   - 文件默认是私有的
   - 只能通过应用 API 访问
   - 更安全但需要额外代码

## 💡 需要帮助？

如果遇到问题，查看详细指南：
```bash
cat scripts/get-public-url-guide.md
```
