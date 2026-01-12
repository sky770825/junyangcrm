# Cloudflare R2 快速配置指南

## 🎯 您已提供 Access Key ID

您的 Access Key ID: `j1qkUj6Gh4h3TaOkPe_2YXgxhgL2YRoXHmz063hs`

## 📋 还需要的信息

要完成 R2 配置，您还需要：

### 1. R2 Account ID
- 位置：Cloudflare Dashboard 右侧边栏
- 格式：32 位字符（例如：`82ebeb1d91888e83e8e1b30eeb33d3c3`）

### 2. R2 Secret Access Key
- 位置：创建 API Token 时显示的 Secret Access Key
- ⚠️ **重要**：只显示一次，请妥善保存
- 格式：长字符串

### 3. R2 Bucket Name
- 位置：您创建的 R2 Bucket 名称
- 例如：`junyangcrm-files`

### 4. R2 Public URL（可选）
- 位置：Bucket Settings → Public Access
- 格式：`https://pub-xxxxx.r2.dev`
- 如果不需要公开访问，可以跳过

## 🚀 快速配置方法

### 方法一：使用快速配置脚本

```bash
# 设置 Access Key ID（已提供）
./scripts/quick-setup-r2.sh j1qkUj6Gh4h3TaOkPe_2YXgxhgL2YRoXHmz063hs

# 然后按提示输入其他信息
```

### 方法二：使用交互式配置

```bash
npm run setup:r2
```

脚本会自动检测已设置的 Access Key ID，您只需输入其他信息。

### 方法三：手动编辑 .env.local

```bash
# 编辑 .env.local 文件
nano .env.local
```

添加或更新以下内容：

```env
R2_ACCOUNT_ID=你的account-id
R2_ACCESS_KEY_ID=j1qkUj6Gh4h3TaOkPe_2YXgxhgL2YRoXHmz063hs
R2_SECRET_ACCESS_KEY=你的secret-access-key
R2_BUCKET_NAME=你的bucket名称
R2_PUBLIC_URL=https://pub-xxxxx.r2.dev
R2_ENDPOINT=https://你的account-id.r2.cloudflarestorage.com
```

## ✅ 验证配置

配置完成后，运行验证：

```bash
npm run verify:r2
```

## 🧪 测试上传

```bash
npm run test:r2
```

## 📍 在 Cloudflare Dashboard 查找信息

### 查找 Account ID
1. 登录 https://dash.cloudflare.com
2. 右侧边栏找到 **Account ID**
3. 点击复制

### 查找 Secret Access Key
1. 进入 R2 → Manage R2 API Tokens
2. 如果刚创建，应该还在显示
3. 如果已关闭，需要创建新的 API Token

### 查找 Bucket Name
1. 进入 R2
2. 查看您的 Bucket 列表
3. 复制 Bucket 名称

### 查找 Public URL
1. 进入您的 Bucket
2. 点击 **Settings**
3. 在 **Public Access** 部分查看 URL

## ⚠️ 注意事项

1. **Secret Access Key 只显示一次**，请妥善保存
2. 如果丢失 Secret Access Key，需要创建新的 API Token
3. 确保 API Token 有正确的权限（Object Read & Write）
4. 不要将 `.env.local` 提交到 Git

## 🎉 配置完成后

1. 重启开发服务器：`npm run dev`
2. 在客户管理页面添加文件上传功能
3. 开始使用 R2 存储照片和视频
