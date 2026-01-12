# ✅ 部署检查清单

> 常順客戶追蹤進度表 - 部署前检查清单

---

## 📋 部署前检查

### 1. 代码状态 ✅

- [x] 代码已推送到 GitHub
- [x] GitHub Actions 工作流已配置
- [x] 工作流文件已推送
- [ ] 所有功能已测试
- [ ] 没有未提交的更改

### 2. 环境变量准备

#### 必需的环境变量

- [ ] `NEXT_PUBLIC_SUPABASE_URL`
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] `NEXTAUTH_URL`
- [ ] `NEXTAUTH_SECRET`
- [ ] `R2_ACCOUNT_ID`
- [ ] `R2_ACCESS_KEY_ID`
- [ ] `R2_SECRET_ACCESS_KEY`
- [ ] `R2_BUCKET_NAME`
- [ ] `R2_PUBLIC_URL`
- [ ] `R2_ENDPOINT` (可选)

#### 获取方式

**Supabase:**
- 访问：https://supabase.com/dashboard
- 选择项目 → Settings → API
- 复制 Project URL 和 anon/public key

**NextAuth Secret:**
```bash
openssl rand -base64 32
```

**Cloudflare R2:**
- 已在本地配置，复制 `.env.local` 中的值

---

## 🚀 部署步骤

### 选项 A: Vercel 部署（推荐）⭐

#### 步骤 1: 导入项目

1. 访问：https://vercel.com
2. 使用 GitHub 账号登录
3. 点击 "Add New Project"
4. 选择仓库：`sky770825/junyangcrm`
5. 点击 "Import"

#### 步骤 2: 配置项目

- **Framework Preset**: Next.js（自动检测）
- **Root Directory**: `./`（默认）
- **Build Command**: `npm run build`（默认）
- **Output Directory**: `.next`（默认）
- **Install Command**: `npm install`（默认）

#### 步骤 3: 配置环境变量

在 Vercel 项目设置中添加：

```
NEXT_PUBLIC_SUPABASE_URL=你的Supabase URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=你的Supabase Anon Key
NEXTAUTH_URL=https://你的项目.vercel.app
NEXTAUTH_SECRET=生成的secret
R2_ACCOUNT_ID=你的R2 Account ID
R2_ACCESS_KEY_ID=你的R2 Access Key ID
R2_SECRET_ACCESS_KEY=你的R2 Secret Access Key
R2_BUCKET_NAME=你的R2 Bucket名称
R2_PUBLIC_URL=你的R2 Public URL
R2_ENDPOINT=你的R2 Endpoint（可选）
```

#### 步骤 4: 部署

- 点击 "Deploy"
- 等待构建完成
- ✅ 部署成功！

---

### 选项 B: Cloudflare Pages 部署

#### 步骤 1: 配置 GitHub Secrets

1. 访问：https://github.com/sky770825/junyangcrm/settings/secrets/actions
2. 添加以下 Secrets：

```
CLOUDFLARE_API_TOKEN=你的Cloudflare API Token
CLOUDFLARE_ACCOUNT_ID=你的Account ID
```

#### 步骤 2: 触发部署

推送代码到 `main` 分支，GitHub Actions 会自动部署。

---

## 🔍 部署后验证

### 1. 检查部署状态

- [ ] 访问部署 URL
- [ ] 检查页面是否正常加载
- [ ] 检查控制台是否有错误

### 2. 测试功能

- [ ] 登录功能
- [ ] 客户列表
- [ ] 文件上传（R2）
- [ ] API 路由

### 3. 检查环境变量

- [ ] 所有环境变量已正确设置
- [ ] 没有敏感信息泄露

---

## 🐛 故障排除

### 构建失败

1. **检查环境变量**
   - 确保所有必需变量已设置
   - 检查变量名是否正确

2. **查看构建日志**
   - Vercel: 项目 → Deployments → 查看日志
   - Cloudflare: Pages → 查看构建日志

3. **本地测试**
   ```bash
   npm run build
   ```

### 运行时错误

1. **检查环境变量**
   - 确保生产环境变量已设置
   - 检查 `NEXTAUTH_URL` 是否正确

2. **检查数据库连接**
   - 确保 Supabase URL 和 Key 正确
   - 检查 RLS 策略

3. **检查 R2 配置**
   - 确保 R2 凭证正确
   - 检查 Bucket 权限

---

## 📚 相关文档

- [DEPLOYMENT.md](./DEPLOYMENT.md) - 完整部署指南
- [env.example](./env.example) - 环境变量示例
- [README.md](./README.md) - 项目说明

---

## ✅ 完成检查

部署完成后，确认：

- [ ] 应用可以正常访问
- [ ] 所有功能正常工作
- [ ] 环境变量已正确配置
- [ ] 没有安全漏洞
- [ ] 性能表现良好

---

**🎉 部署完成！**
