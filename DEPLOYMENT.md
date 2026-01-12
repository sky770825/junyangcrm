# 🚀 自动部署指南

> 常順客戶追蹤進度表 - 全自动部署配置

---

## 📋 部署选项

### 选项 1: Vercel（推荐，最简单）⭐

Vercel 是 Next.js 的官方推荐平台，零配置自动部署。

#### 快速设置（5分钟）

1. **访问 Vercel**
   - 前往 https://vercel.com
   - 使用 GitHub 账号登录

2. **导入项目**
   - 点击 "Add New Project"
   - 选择 `sky770825/junyangcrm` 仓库
   - 点击 "Import"

3. **配置环境变量**
   在 Vercel 项目设置中添加以下环境变量：
   ```
   NEXT_PUBLIC_SUPABASE_URL=你的Supabase URL
   NEXT_PUBLIC_SUPABASE_ANON_KEY=你的Supabase Anon Key
   NEXTAUTH_URL=https://你的域名.vercel.app
   NEXTAUTH_SECRET=生成一个随机字符串
   R2_ACCOUNT_ID=你的R2 Account ID
   R2_ACCESS_KEY_ID=你的R2 Access Key ID
   R2_SECRET_ACCESS_KEY=你的R2 Secret Access Key
   R2_BUCKET_NAME=你的R2 Bucket名称
   R2_PUBLIC_URL=你的R2 Public URL
   R2_ENDPOINT=你的R2 Endpoint（可选）
   ```

4. **自动部署**
   - ✅ 每次推送到 `main` 分支会自动部署
   - ✅ 预览环境：每个 PR 都会创建预览
   - ✅ 生产环境：合并到 main 后自动部署

---

### 选项 2: Cloudflare Pages（与 R2 集成）

如果你已经使用 Cloudflare R2，Pages 是很好的选择。

#### 设置步骤

1. **获取 Cloudflare API Token**
   - 访问 https://dash.cloudflare.com/profile/api-tokens
   - 创建自定义 Token，权限：
     - Account: Cloudflare Pages: Edit
     - Zone: Zone: Read

2. **在 GitHub 设置 Secrets**
   - 前往仓库 Settings → Secrets and variables → Actions
   - 添加以下 Secrets：
     ```
     CLOUDFLARE_API_TOKEN=你的API Token
     CLOUDFLARE_ACCOUNT_ID=你的Account ID
     ```

3. **启用 GitHub Actions**
   - 推送代码后，`.github/workflows/cloudflare-pages.yml` 会自动运行
   - 首次部署需要在 Cloudflare Dashboard 创建 Pages 项目

---

### 选项 3: GitHub Actions（自定义）

已配置 GitHub Actions 工作流，可以：
- ✅ 自动构建和测试
- ✅ 部署到多个平台
- ✅ 自定义部署流程

**工作流文件：**
- `.github/workflows/deploy.yml` - 通用部署工作流
- `.github/workflows/cloudflare-pages.yml` - Cloudflare Pages 专用

---

## 🔧 环境变量配置

### 必需的环境变量

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

# NextAuth
NEXTAUTH_URL=
NEXTAUTH_SECRET=

# Cloudflare R2
R2_ACCOUNT_ID=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET_NAME=
R2_PUBLIC_URL=
```

### 生成 NEXTAUTH_SECRET

```bash
openssl rand -base64 32
```

---

## 📊 部署状态

### 查看部署状态

- **Vercel**: https://vercel.com/dashboard
- **Cloudflare Pages**: https://dash.cloudflare.com → Pages
- **GitHub Actions**: 仓库 → Actions 标签

### 部署日志

所有部署日志都会在对应平台显示：
- ✅ 构建成功/失败
- ✅ 部署时间
- ✅ 错误信息（如有）

---

## 🎯 自动化流程

### 当前配置

1. **代码推送** → 自动触发部署
2. **构建测试** → 自动运行 lint 和 build
3. **部署** → 自动部署到生产环境

### 工作流

```
Git Push (main)
    ↓
GitHub Actions 触发
    ↓
安装依赖 → 代码检查 → 构建
    ↓
部署到平台（Vercel/Cloudflare）
    ↓
✅ 部署完成
```

---

## 🐛 故障排除

### 构建失败

1. **检查环境变量**
   - 确保所有必需的环境变量都已设置
   - 检查变量名是否正确

2. **检查日志**
   - 查看 GitHub Actions 日志
   - 查看平台部署日志

3. **本地测试**
   ```bash
   npm run build
   ```

### 部署失败

1. **检查权限**
   - Vercel: 确保 GitHub 账号有权限
   - Cloudflare: 检查 API Token 权限

2. **检查配置**
   - 确保 `package.json` 中的构建脚本正确
   - 确保 `next.config.js` 配置正确

---

## 📚 相关文档

- [Vercel 部署文档](https://vercel.com/docs)
- [Cloudflare Pages 文档](https://developers.cloudflare.com/pages/)
- [GitHub Actions 文档](https://docs.github.com/en/actions)

---

## ✅ 下一步

1. ✅ 选择部署平台（推荐 Vercel）
2. ✅ 配置环境变量
3. ✅ 推送代码触发首次部署
4. ✅ 验证部署成功

---

**🎉 完成！你的应用现在会自动部署了！**
