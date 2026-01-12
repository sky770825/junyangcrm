# Cloudflare R2 自动化配置指南

## 🚀 快速开始

### 方法一：使用自动化脚本（推荐）

```bash
# 运行自动化配置工具
npm run setup:r2

# 或直接运行
./scripts/setup-r2.sh
```

脚本会引导您完成所有配置步骤。

### 方法二：使用 Node.js 交互式工具

```bash
node scripts/auto-setup-r2.js
```

### 方法三：手动配置

1. 复制环境变量模板：
```bash
cp env.example .env.local
```

2. 编辑 `.env.local`，填入您的 Cloudflare R2 配置

## ✅ 验证配置

配置完成后，验证配置是否正确：

```bash
npm run verify:r2

# 或
./scripts/verify-r2-config.sh
```

## 🧪 测试上传

```bash
npm run test:r2

# 或
./scripts/test-r2-upload.sh
```

## 📋 配置步骤详解

### 1. 在 Cloudflare Dashboard 创建 R2 Bucket

1. 访问：https://dash.cloudflare.com
2. 进入 **R2**（左侧菜单）
3. 点击 **Create bucket**
4. 输入名称（例如：`junyangcrm-files`）
5. 选择位置
6. 点击 **Create bucket**

### 2. 创建 API Token

1. 在 R2 页面，点击右上角 **Manage R2 API Tokens**
2. 点击 **Create API token**
3. 配置：
   - **Token name**: `junyangcrm-upload`
   - **Permissions**: `Object Read & Write`
   - **Bucket access**: 选择您刚创建的 bucket
4. 点击 **Create API Token**
5. **重要**：复制并保存（只显示一次）：
   - Access Key ID
   - Secret Access Key

### 3. 获取 Account ID

在 Cloudflare Dashboard 右侧边栏找到 **Account ID** 并复制。

### 4. 配置 Public Access（可选）

如果需要公开访问文件：
1. 进入您的 Bucket
2. 点击 **Settings**
3. 在 **Public Access** 部分，点击 **Allow Access**
4. 复制 **Public URL**（格式：`https://pub-xxxxx.r2.dev`）

## 🔧 环境变量说明

| 变量名 | 说明 | 必需 |
|--------|------|------|
| `R2_ACCOUNT_ID` | Cloudflare Account ID | ✅ |
| `R2_ACCESS_KEY_ID` | R2 API Token 的 Access Key ID | ✅ |
| `R2_SECRET_ACCESS_KEY` | R2 API Token 的 Secret Access Key | ✅ |
| `R2_BUCKET_NAME` | R2 Bucket 名称 | ✅ |
| `R2_PUBLIC_URL` | Public URL（如果启用了公开访问） | ⚠️ 可选 |
| `R2_ENDPOINT` | R2 Endpoint（会自动生成） | ⚠️ 可选 |

## 📝 自动化脚本说明

### `setup-r2.sh`
- Bash 脚本，交互式配置
- 自动更新 `.env.local` 文件
- 支持跳过已配置的项

### `auto-setup-r2.js`
- Node.js 脚本，更友好的交互界面
- 支持密码隐藏输入
- 自动生成 Endpoint

### `verify-r2-config.sh`
- 验证所有配置是否正确
- 检查依赖是否安装
- 检查 API 文件是否存在

### `test-r2-upload.sh`
- 测试文件上传功能
- 验证 R2 连接是否正常

## 🎯 使用示例

配置完成后，在代码中使用：

```tsx
import FileUpload from '@/app/components/FileUpload'

<FileUpload
  onUploadSuccess={(url, key) => {
    console.log('文件上传成功:', url)
    // 保存到数据库
  }}
  folder="clients"
  accept="image/*,video/*"
  maxSize={100}
/>
```

## ❓ 常见问题

### Q: 配置脚本运行失败？
A: 确保脚本有执行权限：
```bash
chmod +x scripts/*.sh
```

### Q: 如何重新配置？
A: 直接运行配置脚本，已配置的项可以跳过。

### Q: 如何查看当前配置？
A: 运行验证脚本：
```bash
npm run verify:r2
```

### Q: 测试上传失败？
A: 检查：
1. 开发服务器是否运行
2. 环境变量是否正确
3. R2 Bucket 是否已创建
4. API Token 权限是否正确

## 🔒 安全提示

1. **不要提交 `.env.local` 到 Git**
2. **妥善保管 Secret Access Key**
3. **定期轮换 API Token**
4. **使用最小权限原则**

## 📚 相关文档

- [R2_SETUP_GUIDE.md](./R2_SETUP_GUIDE.md) - 详细配置指南
- [CLOUDFLARE_INTEGRATION.md](./CLOUDFLARE_INTEGRATION.md) - 集成方案说明
