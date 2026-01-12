# 🔧 故障排除指南

> 网站无法访问时的诊断和解决方案

---

## ⚠️ 问题：网站无法访问

**URL:** https://junyangcrm.pages.dev

---

## 🔍 诊断步骤

### 步骤 1: 检查 GitHub Actions

**链接：**
```
https://github.com/sky770825/junyangcrm/actions
```

**检查项：**
- [ ] 是否有 "🌐 Cloudflare Pages 部署" 工作流
- [ ] 工作流是否已运行
- [ ] 工作流状态：
  - ✅ 绿色 = 成功
  - 🟡 黄色 = 运行中
  - ❌ 红色 = 失败

**如果工作流未运行：**
- 检查是否已配置所有 GitHub Secrets
- 检查工作流文件是否有错误

**如果工作流失败：**
- 点击工作流查看详细日志
- 查找错误信息
- 常见错误见下方

---

### 步骤 2: 检查 GitHub Secrets

**链接：**
```
https://github.com/sky770825/junyangcrm/settings/secrets/actions
```

**必需 Secrets（12 个）：**
- [ ] `CLOUDFLARE_API_TOKEN`
- [ ] `CLOUDFLARE_ACCOUNT_ID`
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

**如果 Secrets 未配置：**
- 运行 `./scripts/generate-secrets-template.sh` 查看所有值
- 参考 `FINAL_DEPLOYMENT_STEPS.md` 配置步骤

---

### 步骤 3: 检查 Cloudflare Pages

**链接：**
```
https://dash.cloudflare.com/82ebeb1d91888e83e8e1b30eeb33d3c3/pages
```

**检查项：**
- [ ] 是否有 "junyangcrm" 项目
- [ ] 项目状态
- [ ] 最新部署状态
- [ ] 部署 URL

**如果项目不存在：**
- 首次部署需要手动创建项目，或等待 GitHub Actions 自动创建
- 如果 GitHub Actions 失败，可能需要手动创建

---

## 🐛 常见问题和解决方案

### 问题 1: 工作流未运行

**症状：**
- GitHub Actions 中没有工作流记录

**原因：**
- GitHub Secrets 未配置
- 工作流文件有错误

**解决方案：**
1. 检查是否已配置所有 GitHub Secrets
2. 检查 `.github/workflows/cloudflare-pages.yml` 文件
3. 手动触发工作流：
   - 访问 GitHub Actions
   - 选择 "🌐 Cloudflare Pages 部署"
   - 点击 "Run workflow"

---

### 问题 2: 构建失败

**症状：**
- 工作流运行但构建失败

**原因：**
- 环境变量缺失
- 代码错误
- 依赖问题

**解决方案：**
1. 检查所有 GitHub Secrets 是否已配置
2. 查看构建日志了解具体错误
3. 本地测试：
   ```bash
   npm run build
   ```
4. 修复错误后重新推送

---

### 问题 3: 部署失败 - API Token 错误

**症状：**
- 构建成功但部署失败
- 错误信息包含 "API Token" 或 "authentication"

**原因：**
- Cloudflare API Token 无效
- Token 权限不足

**解决方案：**
1. 检查 `CLOUDFLARE_API_TOKEN` Secret 是否正确
2. 确认 Token 有 `Cloudflare Pages: Edit` 权限
3. 重新创建 Token：
   - 访问：https://dash.cloudflare.com/profile/api-tokens
   - 创建新 Token
   - 更新 GitHub Secret

---

### 问题 4: 部署成功但网站无法访问

**症状：**
- GitHub Actions 显示成功
- Cloudflare Pages 显示部署成功
- 但网站无法访问

**原因：**
- 环境变量未在 Cloudflare Pages 中设置
- `NEXTAUTH_URL` 配置错误
- DNS 未生效

**解决方案：**
1. 在 Cloudflare Pages 项目设置中添加环境变量
2. 确保 `NEXTAUTH_URL` 设置为 `https://junyangcrm.pages.dev`
3. 等待几分钟让 DNS 生效
4. 检查 Cloudflare Pages 项目设置中的自定义域名配置

---

### 问题 5: 404 错误

**症状：**
- 网站可以访问但显示 404

**原因：**
- Next.js 路由配置问题
- 构建输出目录错误

**解决方案：**
1. 检查 `next.config.js` 配置
2. 检查 Cloudflare Pages 构建设置
3. 确保使用正确的构建命令和输出目录

---

## 🛠️ 诊断工具

### 检查配置值
```bash
./scripts/generate-secrets-template.sh
```

### 检查准备状态
```bash
./scripts/check-deployment-ready.sh
```

### 快速部署检查
```bash
./scripts/quick-deploy.sh
```

---

## 📚 相关文档

- [DEPLOYMENT_STATUS.md](./DEPLOYMENT_STATUS.md) - 部署状态检查
- [FINAL_DEPLOYMENT_STEPS.md](./FINAL_DEPLOYMENT_STEPS.md) - 最终部署步骤
- [CLOUDFLARE_PAGES_SETUP.md](./CLOUDFLARE_PAGES_SETUP.md) - 完整设置指南

---

## 💡 快速修复

如果所有配置都正确但仍无法访问：

1. **重新触发部署：**
   ```bash
   git commit --allow-empty -m "触发重新部署"
   git push origin main
   ```

2. **手动触发 GitHub Actions：**
   - 访问：https://github.com/sky770825/junyangcrm/actions
   - 选择工作流 → Run workflow

3. **检查 Cloudflare Pages 日志：**
   - 在 Cloudflare Dashboard 查看部署日志
   - 查找错误信息

---

**需要更多帮助？** 查看 GitHub Actions 日志或 Cloudflare Pages 日志获取详细错误信息。
