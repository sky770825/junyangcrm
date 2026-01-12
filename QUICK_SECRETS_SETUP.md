# ⚡ 快速配置 GitHub Secrets

> 5 分钟完成所有 Secrets 配置

---

## 🎯 目标

配置 12 个 GitHub Secrets，让自动部署正常工作。

---

## 📋 配置步骤

### 步骤 1: 创建 Cloudflare API Token（如果还没有）

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

### 步骤 2: 配置 GitHub Secrets

**访问：**
```
https://github.com/sky770825/junyangcrm/settings/secrets/actions
```

**操作：**
1. 点击 **"New repository secret"**
2. 输入 Secret 名称（Name）
3. 粘贴对应的值（Value）
4. 点击 **"Add secret"**
5. 重复以上步骤添加所有 12 个 Secrets

---

## 📝 Secrets 清单（按顺序添加）

### Secret 1: CLOUDFLARE_API_TOKEN
```
Name:  CLOUDFLARE_API_TOKEN
Value: [从步骤 1 获取的 Token]
```

### Secret 2: CLOUDFLARE_ACCOUNT_ID
```
Name:  CLOUDFLARE_ACCOUNT_ID
Value: 82ebeb1d91888e83e8e1b30eeb33d3c3
```

### Secret 3: NEXT_PUBLIC_SUPABASE_URL
```
Name:  NEXT_PUBLIC_SUPABASE_URL
Value: https://wblcfnodlwebsssoqfaz.supabase.co
```

### Secret 4: NEXT_PUBLIC_SUPABASE_ANON_KEY
```
Name:  NEXT_PUBLIC_SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndibGNmbm9kbHdlYnNzc29xZmF6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgxODc2MTgsImV4cCI6MjA4Mzc2MzYxOH0.JfB9Zz9xR3Izz2DcsTXQ5ow_TaUd2SubfKgiKlZMAz4
```

### Secret 5: NEXTAUTH_URL
```
Name:  NEXTAUTH_URL
Value: https://junyangcrm.pages.dev
```

### Secret 6: NEXTAUTH_SECRET
```
Name:  NEXTAUTH_SECRET
Value: QyDl3cXKaceIuOZ0QOCeFHvivB73iH7A2cq7ysObHlA=
```

### Secret 7: R2_ACCOUNT_ID
```
Name:  R2_ACCOUNT_ID
Value: 82ebeb1d91888e83e8e1b30eeb33d3c3
```

### Secret 8: R2_ACCESS_KEY_ID
```
Name:  R2_ACCESS_KEY_ID
Value: j1qkUj6Gh4h3TaOkPe_2YXgxhgL2YRoXHmz063hs
```

### Secret 9: R2_SECRET_ACCESS_KEY
```
Name:  R2_SECRET_ACCESS_KEY
Value: -r4iBSVKcUDrBLs8ZIQZAn1taQ5Z5TC19veEWr8h
```

### Secret 10: R2_BUCKET_NAME
```
Name:  R2_BUCKET_NAME
Value: junyangcrm-files
```

### Secret 11: R2_PUBLIC_URL
```
Name:  R2_PUBLIC_URL
Value: https://pub-1e596b74f857475080db8cca0546d5b6.r2.dev
```

### Secret 12: R2_ENDPOINT (可选)
```
Name:  R2_ENDPOINT
Value: https://82ebeb1d91888e83e8e1b30eeb33d3c3.r2.cloudflarestorage.com
```

---

## ✅ 配置完成后

### 1. 验证配置

访问 GitHub Secrets 页面，确认所有 12 个 Secrets 都已添加：
```
https://github.com/sky770825/junyangcrm/settings/secrets/actions
```

### 2. 触发部署

**方式 1: 推送代码**
```bash
git commit --allow-empty -m "触发部署"
git push origin main
```

**方式 2: 手动触发**
1. 访问：https://github.com/sky770825/junyangcrm/actions
2. 选择 **"🌐 Cloudflare Pages 部署"** 工作流
3. 点击 **"Run workflow"**
4. 选择分支：`main`
5. 点击 **"Run workflow"**

### 3. 检查部署状态

- **GitHub Actions**: https://github.com/sky770825/junyangcrm/actions
- **Cloudflare Pages**: https://dash.cloudflare.com/82ebeb1d91888e83e8e1b30eeb33d3c3/pages

---

## ⚠️ 重要提示

1. **Secret 名称必须完全匹配**（注意大小写）
2. **Secret 值不要有多余的空格**
3. **CLOUDFLARE_API_TOKEN 需要从 Cloudflare Dashboard 创建**
4. **配置完成后，工作流会自动运行**

---

## 🐛 如果配置后仍无法部署

1. **检查 Secret 名称是否正确**
2. **检查 Secret 值是否正确复制**
3. **查看 GitHub Actions 日志了解错误**
4. **参考 TROUBLESHOOTING.md 获取更多帮助**

---

## 📚 相关工具

### 重新生成配置值
```bash
./scripts/generate-secrets-template.sh
```

### 检查准备状态
```bash
./scripts/check-deployment-ready.sh
```

---

**完成配置后，部署会自动开始！** 🚀
