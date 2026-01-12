# 🚀 最终部署步骤

> 完成最后 2 步即可开始自动部署

---

## ✅ 已完成的工作

- ✅ GitHub Actions 工作流已配置
- ✅ Cloudflare Pages 配置已准备
- ✅ 所有环境变量值已生成
- ✅ 部署工具已创建

---

## 📋 最后 2 步

### 步骤 1: 创建 Cloudflare API Token ⏱️ 2分钟

**访问：**
```
https://dash.cloudflare.com/profile/api-tokens
```

**操作：**
1. 点击 **"Create Token"**
2. 点击 **"Create Custom Token"**
3. 填写：
   - **Token name**: `GitHub Actions - Pages Deploy`
   - **Permissions**: 
     - `Account` → `Cloudflare Pages` → `Edit`
   - **Account Resources**: 
     - `Include` → `All accounts`
4. 点击 **"Continue to summary"**
5. 点击 **"Create Token"**
6. ⚠️ **立即复制 Token！**

---

### 步骤 2: 配置 GitHub Secrets ⏱️ 5分钟

**访问：**
```
https://github.com/sky770825/junyangcrm/settings/secrets/actions
```

**添加以下 Secrets：**

#### 必需 Secrets

| Secret 名称 | 值 | 说明 |
|------------|-----|------|
| `CLOUDFLARE_API_TOKEN` | [从步骤 1 获取] | Cloudflare API Token |
| `CLOUDFLARE_ACCOUNT_ID` | `82ebeb1d91888e83e8e1b30eeb33d3c3` | Cloudflare Account ID |

#### 环境变量 Secrets

| Secret 名称 | 值 |
|------------|-----|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://wblcfnodlwebsssoqfaz.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndibGNmbm9kbHdlYnNzc29xZmF6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgxODc2MTgsImV4cCI6MjA4Mzc2MzYxOH0.JfB9Zz9xR3Izz2DcsTXQ5ow_TaUd2SubfKgiKlZMAz4` |
| `NEXTAUTH_URL` | `https://junyangcrm.pages.dev` |
| `NEXTAUTH_SECRET` | `kjpXP3dlbWNaPvRaXy3kcBdiAJRNzlTrvK1CPDnHzA0=` |
| `R2_ACCOUNT_ID` | `82ebeb1d91888e83e8e1b30eeb33d3c3` |
| `R2_ACCESS_KEY_ID` | `j1qkUj6Gh4h3TaOkPe_2YXgxhgL2YRoXHmz063hs` |
| `R2_SECRET_ACCESS_KEY` | `-r4iBSVKcUDrBLs8ZIQZAn1taQ5Z5TC19veEWr8h` |
| `R2_BUCKET_NAME` | `junyangcrm-files` |
| `R2_PUBLIC_URL` | `https://pub-1e596b74f857475080db8cca0546d5b6.r2.dev` |
| `R2_ENDPOINT` | `https://82ebeb1d91888e83e8e1b30eeb33d3c3.r2.cloudflarestorage.com` |

**操作步骤：**
1. 点击 **"New repository secret"**
2. 输入 Secret 名称
3. 粘贴对应的值
4. 点击 **"Add secret"**
5. 重复以上步骤添加所有 Secrets

---

## 🚀 触发部署

### 方式 1: 推送代码（推荐）

```bash
git push origin main
```

### 方式 2: 手动触发

1. 访问：https://github.com/sky770825/junyangcrm/actions
2. 选择 **"🌐 Cloudflare Pages 部署"** 工作流
3. 点击 **"Run workflow"**
4. 选择分支：`main`
5. 点击 **"Run workflow"**

---

## 📊 验证部署

### 1. 检查 GitHub Actions

访问：https://github.com/sky770825/junyangcrm/actions

应该看到：
- ✅ 工作流正在运行
- ✅ 构建成功
- ✅ 部署成功

### 2. 检查 Cloudflare Pages

访问：https://dash.cloudflare.com/82ebeb1d91888e83e8e1b30eeb33d3c3/pages

应该看到：
- ✅ 项目 `junyangcrm` 已创建
- ✅ 部署状态：Success
- ✅ 部署 URL：`https://junyangcrm.pages.dev`

### 3. 访问网站

访问：https://junyangcrm.pages.dev

应该看到：
- ✅ 网站正常加载
- ✅ 功能正常工作

---

## 🐛 故障排除

### 问题 1: 工作流失败 - API Token 错误

**解决方案：**
- 检查 Token 是否正确复制
- 确认 Token 有 `Cloudflare Pages: Edit` 权限
- 重新创建 Token 并更新 Secret

### 问题 2: 构建失败 - 环境变量缺失

**解决方案：**
- 检查所有 GitHub Secrets 是否已添加
- 确认变量名正确（注意大小写）
- 运行 `./scripts/check-deployment-ready.sh` 检查

### 问题 3: 部署成功但网站无法访问

**解决方案：**
- 检查 Cloudflare Pages 项目设置
- 确认环境变量已在 Cloudflare Pages 中设置
- 检查 `NEXTAUTH_URL` 是否正确

---

## 📚 相关工具

### 检查部署准备状态
```bash
./scripts/check-deployment-ready.sh
```

### 重新生成配置模板
```bash
./scripts/generate-secrets-template.sh
```

### 查看详细指南
```bash
cat CLOUDFLARE_PAGES_SETUP.md
```

---

## ✅ 完成检查清单

- [ ] Cloudflare API Token 已创建
- [ ] GitHub Secrets 已配置（所有 12 个）
- [ ] 代码已推送或手动触发工作流
- [ ] GitHub Actions 运行成功
- [ ] Cloudflare Pages 部署成功
- [ ] 网站可以正常访问

---

## 🎉 完成！

配置完成后，每次推送到 `main` 分支都会自动：
1. ✅ 构建 Next.js 应用
2. ✅ 运行测试
3. ✅ 部署到 Cloudflare Pages
4. ✅ 更新网站

**你的应用现在已实现全自动部署！** 🚀

---

**需要帮助？** 查看：
- `CLOUDFLARE_PAGES_SETUP.md` - 完整设置指南
- `DEPLOY_CHECKLIST.md` - 详细检查清单
- `QUICK_DEPLOY.md` - 快速部署指南
