# 🔧 手动创建 Cloudflare Pages 项目

> 如果自动部署失败，手动创建项目

---

## ⚠️ 问题

如果看到 "沒有啟用 URL" 或 "Automatic deployment on upload" 错误，说明 Cloudflare Pages 项目还没有创建。

---

## 🚀 解决方案：手动创建项目

### 步骤 1: 访问 Cloudflare Pages

**链接：**
```
https://dash.cloudflare.com/82ebeb1d91888e83e8e1b30eeb33d3c3/pages
```

### 步骤 2: 创建新项目

1. **点击 "Create a project"**
2. **选择 "Connect to Git"**
3. **选择 GitHub**
   - 如果首次连接，需要授权 Cloudflare 访问 GitHub
   - 选择账号：`sky770825`
4. **选择仓库**
   - 选择：`junyangcrm`
5. **点击 "Begin setup"**

### 步骤 3: 配置项目

**项目名称：**
```
junyangcrm
```

**框架预设：**
```
Next.js
```

**构建设置：**
- **Build command**: `npm run build`
- **Build output directory**: `.next`
- **Root directory**: `/` (默认)

**环境变量：**
在 "Environment variables" 部分添加：

```
NEXT_PUBLIC_SUPABASE_URL=https://wblcfnodlwebsssoqfaz.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndibGNmbm9kbHdlYnNzc29xZmF6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgxODc2MTgsImV4cCI6MjA4Mzc2MzYxOH0.JfB9Zz9xR3Izz2DcsTXQ5ow_TaUd2SubfKgiKlZMAz4
NEXTAUTH_URL=https://junyangcrm.pages.dev
NEXTAUTH_SECRET=K7GjtUWzGB9pZ9OtMkbeyuc0/GKbmsceQdZcrHC2Zoo=
R2_ACCOUNT_ID=82ebeb1d91888e83e8e1b30eeb33d3c3
R2_ACCESS_KEY_ID=j1qkUj6Gh4h3TaOkPe_2YXgxhgL2YRoXHmz063hs
R2_SECRET_ACCESS_KEY=-r4iBSVKcUDrBLs8ZIQZAn1taQ5Z5TC19veEWr8h
R2_BUCKET_NAME=junyangcrm-files
R2_PUBLIC_URL=https://pub-1e596b74f857475080db8cca0546d5b6.r2.dev
R2_ENDPOINT=https://82ebeb1d91888e83e8e1b30eeb33d3c3.r2.cloudflarestorage.com
```

### 步骤 4: 保存并部署

1. **点击 "Save and Deploy"**
2. **等待构建完成**（约 3-5 分钟）
3. **部署成功后，会获得 URL**：`https://junyangcrm.pages.dev`

---

## ✅ 创建后的配置

### 1. 启用自动部署

项目创建后，Cloudflare Pages 会自动：
- ✅ 监听 GitHub 仓库的推送
- ✅ 自动触发构建和部署
- ✅ 更新网站

### 2. 配置自定义域名（可选）

1. 在项目设置中点击 "Custom domains"
2. 添加你的域名
3. 按照提示配置 DNS

---

## 🔄 后续部署

项目创建后，有两种部署方式：

### 方式 1: 自动部署（推荐）

每次推送到 `main` 分支，Cloudflare Pages 会自动：
1. 检测代码变更
2. 触发构建
3. 部署新版本

### 方式 2: 通过 GitHub Actions

GitHub Actions 工作流也会自动部署（如果项目已存在）。

---

## 🐛 故障排除

### 问题 1: 构建失败

**检查：**
- 环境变量是否正确配置
- 构建命令是否正确
- 查看构建日志

### 问题 2: 部署成功但网站无法访问

**检查：**
- `NEXTAUTH_URL` 是否正确设置为 Pages URL
- 环境变量是否在 Cloudflare Pages 中设置
- DNS 是否已生效

---

## 📚 相关文档

- [CLOUDFLARE_PAGES_SETUP.md](./CLOUDFLARE_PAGES_SETUP.md) - 完整设置指南
- [DEPLOYMENT_STATUS.md](./DEPLOYMENT_STATUS.md) - 部署状态检查

---

**完成！项目创建后，自动部署就会正常工作。** 🎉
