# 🌐 Cloudflare Pages 部署设置指南

> 从 GitHub 自动部署到 Cloudflare Pages

---

## 📋 前置要求

- ✅ GitHub 仓库：`sky770825/junyangcrm`
- ✅ Cloudflare Account ID: `82ebeb1d91888e83e8e1b30eeb33d3c3`
- ✅ 项目名称：`junyangcrm`

---

## 🔧 步骤 1: 创建 Cloudflare API Token

### 1.1 访问 Token 设置

**直接链接：**
```
https://dash.cloudflare.com/profile/api-tokens
```

### 1.2 创建自定义 Token

1. 点击 **"Create Token"**
2. 点击 **"Create Custom Token"**
3. 填写信息：

   **Token name:**
   ```
   GitHub Actions - Pages Deploy
   ```

   **Permissions:**
   ```
   Account → Cloudflare Pages → Edit
   ```

   **Account Resources:**
   ```
   Include → All accounts
   ```

4. 点击 **"Continue to summary"**
5. 点击 **"Create Token"**
6. ⚠️ **立即复制 Token！** 离开页面后无法再次查看

---

## 🔐 步骤 2: 配置 GitHub Secrets

### 2.1 访问 GitHub Secrets 设置

**直接链接：**
```
https://github.com/sky770825/junyangcrm/settings/secrets/actions
```

### 2.2 添加必需的 Secrets

点击 **"New repository secret"**，添加以下 Secrets：

#### 必需 Secrets

1. **CLOUDFLARE_API_TOKEN**
   - Name: `CLOUDFLARE_API_TOKEN`
   - Value: 刚才创建的 Cloudflare API Token

2. **CLOUDFLARE_ACCOUNT_ID**
   - Name: `CLOUDFLARE_ACCOUNT_ID`
   - Value: `82ebeb1d91888e83e8e1b30eeb33d3c3`

#### 环境变量 Secrets（用于构建）

3. **NEXT_PUBLIC_SUPABASE_URL**
   - Name: `NEXT_PUBLIC_SUPABASE_URL`
   - Value: 你的 Supabase URL

4. **NEXT_PUBLIC_SUPABASE_ANON_KEY**
   - Name: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Value: 你的 Supabase Anon Key

5. **NEXTAUTH_URL**
   - Name: `NEXTAUTH_URL`
   - Value: `https://junyangcrm.pages.dev`（部署后会自动生成）

6. **NEXTAUTH_SECRET**
   - Name: `NEXTAUTH_SECRET`
   - Value: 运行 `openssl rand -base64 32` 生成

7. **R2_ACCOUNT_ID**
   - Name: `R2_ACCOUNT_ID`
   - Value: 你的 R2 Account ID

8. **R2_ACCESS_KEY_ID**
   - Name: `R2_ACCESS_KEY_ID`
   - Value: 你的 R2 Access Key ID

9. **R2_SECRET_ACCESS_KEY**
   - Name: `R2_SECRET_ACCESS_KEY`
   - Value: 你的 R2 Secret Access Key

10. **R2_BUCKET_NAME**
    - Name: `R2_BUCKET_NAME`
    - Value: 你的 R2 Bucket 名称

11. **R2_PUBLIC_URL**
    - Name: `R2_PUBLIC_URL`
    - Value: 你的 R2 Public URL

12. **R2_ENDPOINT** (可选)
    - Name: `R2_ENDPOINT`
    - Value: 你的 R2 Endpoint

---

## 🚀 步骤 3: 首次部署

### 方式 1: 通过 GitHub Actions（推荐）

1. **推送代码触发部署**
   ```bash
   git push origin main
   ```

2. **或手动触发**
   - 访问：https://github.com/sky770825/junyangcrm/actions
   - 选择 "🌐 Cloudflare Pages 部署" 工作流
   - 点击 "Run workflow"

### 方式 2: 在 Cloudflare Dashboard 创建项目

1. **访问 Cloudflare Pages**
   ```
   https://dash.cloudflare.com/82ebeb1d91888e83e8e1b30eeb33d3c3/pages
   ```

2. **创建新项目**
   - 点击 "Create a project"
   - 选择 "Connect to Git"
   - 选择 GitHub 仓库：`sky770825/junyangcrm`
   - 项目名称：`junyangcrm`
   - 框架预设：Next.js
   - 点击 "Save and Deploy"

---

## ⚙️ 步骤 4: 配置 Cloudflare Pages 环境变量

### 4.1 访问项目设置

部署后，访问：
```
https://dash.cloudflare.com/82ebeb1d91888e83e8e1b30eeb33d3c3/pages/view/junyangcrm
```

### 4.2 添加环境变量

1. 点击 **"Settings"** → **"Environment variables"**
2. 添加所有环境变量（与 GitHub Secrets 相同）

**注意：** Cloudflare Pages 的环境变量用于运行时，GitHub Secrets 用于构建时。

---

## 📊 步骤 5: 验证部署

### 5.1 检查部署状态

- **GitHub Actions**: https://github.com/sky770825/junyangcrm/actions
- **Cloudflare Pages**: https://dash.cloudflare.com/82ebeb1d91888e83e8e1b30eeb33d3c3/pages/view/junyangcrm

### 5.2 访问部署的网站

部署成功后，你会获得一个 URL：
```
https://junyangcrm.pages.dev
```

或自定义域名（如果已配置）

### 5.3 测试功能

- [ ] 首页加载正常
- [ ] API 路由正常工作
- [ ] 文件上传（R2）功能正常
- [ ] 数据库连接正常

---

## 🔄 自动部署流程

配置完成后，每次推送到 `main` 分支时：

1. ✅ GitHub Actions 自动触发
2. ✅ 构建 Next.js 应用
3. ✅ 部署到 Cloudflare Pages
4. ✅ 自动更新网站

---

## 🐛 故障排除

### 问题 1: 部署失败 - API Token 权限不足

**解决方案：**
- 检查 Token 是否有 "Cloudflare Pages: Edit" 权限
- 重新创建 Token 并更新 GitHub Secret

### 问题 2: 构建失败 - 环境变量缺失

**解决方案：**
- 检查所有 GitHub Secrets 是否已设置
- 确保变量名正确（注意大小写）

### 问题 3: 运行时错误

**解决方案：**
- 在 Cloudflare Pages 项目设置中添加环境变量
- 确保 `NEXTAUTH_URL` 设置为正确的 Pages URL

### 问题 4: Next.js 构建输出目录

**注意：** Cloudflare Pages 工作流配置为使用 `.next` 目录。如果构建失败，可能需要：

1. 检查 `next.config.js` 配置
2. 确保使用 Next.js 14（支持 Pages）
3. 可能需要使用 `@cloudflare/next-on-pages`

---

## 📚 相关链接

- [Cloudflare Pages 文档](https://developers.cloudflare.com/pages/)
- [Next.js on Cloudflare Pages](https://developers.cloudflare.com/pages/framework-guides/nextjs/)
- [GitHub Actions 文档](https://docs.github.com/en/actions)

---

## ✅ 检查清单

- [ ] Cloudflare API Token 已创建
- [ ] GitHub Secrets 已配置（所有必需变量）
- [ ] Cloudflare Pages 项目已创建（或通过 GitHub Actions）
- [ ] 环境变量已在 Cloudflare Pages 中设置
- [ ] 首次部署成功
- [ ] 网站可以正常访问
- [ ] 所有功能测试通过

---

**🎉 完成！你的应用现在会自动部署到 Cloudflare Pages 了！**
