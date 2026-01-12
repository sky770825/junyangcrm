# ⚡ 快速部署指南

> 5 分钟完成部署

---

## 🚀 方式 1: Vercel 网页版（最简单）⭐

### 步骤 1: 访问 Vercel

**直接链接：**
```
https://vercel.com/new
```

### 步骤 2: 导入项目

1. 使用 GitHub 账号登录
2. 点击 "Import Git Repository"
3. 选择：`sky770825/junyangcrm`
4. 点击 "Import"

### 步骤 3: 配置项目

- **Project Name**: `junyangcrm`（或自定义）
- **Framework Preset**: Next.js（自动检测）
- **Root Directory**: `./`（默认）
- **其他设置**: 保持默认

### 步骤 4: 配置环境变量

在 "Environment Variables" 部分，添加以下变量：

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=你的Supabase URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=你的Supabase Anon Key

# NextAuth
NEXTAUTH_URL=https://你的项目.vercel.app
NEXTAUTH_SECRET=生成的secret（运行：openssl rand -base64 32）

# Cloudflare R2
R2_ACCOUNT_ID=你的R2 Account ID
R2_ACCESS_KEY_ID=你的R2 Access Key ID
R2_SECRET_ACCESS_KEY=你的R2 Secret Access Key
R2_BUCKET_NAME=你的R2 Bucket名称
R2_PUBLIC_URL=你的R2 Public URL
R2_ENDPOINT=你的R2 Endpoint（可选）
```

**获取方式：**
- Supabase: https://supabase.com/dashboard → 项目 → Settings → API
- R2: 查看本地 `.env.local` 文件

### 步骤 5: 部署

1. 点击 "Deploy"
2. 等待构建完成（约 2-3 分钟）
3. ✅ 完成！访问提供的 URL

---

## 🛠️ 方式 2: Vercel CLI

### 安装 CLI

```bash
npm install -g vercel
```

### 登录

```bash
vercel login
```

### 部署

```bash
# 预览部署
vercel

# 生产部署
vercel --prod
```

### 配置环境变量

```bash
# 在 Vercel Dashboard 配置，或使用 CLI：
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
# ... 其他变量
```

---

## 🌐 方式 3: Cloudflare Pages

### 步骤 1: 配置 GitHub Secrets

1. 访问：https://github.com/sky770825/junyangcrm/settings/secrets/actions
2. 添加 Secrets：

```
CLOUDFLARE_API_TOKEN=你的Token
CLOUDFLARE_ACCOUNT_ID=你的Account ID
```

### 步骤 2: 配置环境变量

在 Cloudflare Pages 项目设置中添加环境变量（同上）

### 步骤 3: 自动部署

推送代码到 `main` 分支，GitHub Actions 会自动部署。

---

## ✅ 部署后验证

### 1. 检查部署状态

- 访问部署 URL
- 检查页面是否正常加载
- 查看控制台是否有错误

### 2. 测试功能

- [ ] 首页加载正常
- [ ] 登录功能（如果已配置）
- [ ] API 路由
- [ ] 文件上传（R2）

### 3. 检查环境变量

确保所有环境变量已正确设置：
- Vercel: Project → Settings → Environment Variables
- Cloudflare: Pages → Settings → Environment Variables

---

## 🐛 常见问题

### 构建失败

1. **检查环境变量**
   - 确保所有必需变量已设置
   - 检查变量名是否正确（注意大小写）

2. **查看构建日志**
   - Vercel: Deployments → 查看日志
   - 查找错误信息

3. **本地测试**
   ```bash
   npm run build
   ```

### 运行时错误

1. **检查环境变量**
   - 确保生产环境变量已设置
   - 检查 `NEXTAUTH_URL` 是否正确（应该是部署后的 URL）

2. **检查数据库连接**
   - 确保 Supabase URL 和 Key 正确
   - 检查 RLS 策略

---

## 📚 相关文档

- [DEPLOY_CHECKLIST.md](./DEPLOY_CHECKLIST.md) - 详细检查清单
- [DEPLOYMENT.md](./DEPLOYMENT.md) - 完整部署指南
- [env.example](./env.example) - 环境变量示例

---

## 🎯 推荐流程

1. ✅ **使用 Vercel 网页版**（最简单）
2. ✅ **配置环境变量**（参考上方）
3. ✅ **点击 Deploy**
4. ✅ **验证部署**

**完成！** 🎉

---

**需要帮助？** 查看 [DEPLOY_CHECKLIST.md](./DEPLOY_CHECKLIST.md) 获取详细步骤。
