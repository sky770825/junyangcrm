# 🔧 GitHub Token 权限修复指南

> 解决 "workflow scope" 权限问题的完整指南

---

## ⚠️ 问题说明

当你尝试推送包含 `.github/workflows/` 文件时，可能会遇到以下错误：

```
! [remote rejected] main -> main (refusing to allow a Personal Access Token 
to create or update workflow `.github/workflows/xxx.yml` without `workflow` scope)
```

这是因为你的 GitHub Personal Access Token 缺少 `workflow` 权限。

---

## 🚀 快速修复（推荐）

### 方法 1: 使用自动化脚本（最简单）

```bash
./scripts/fix-github-token.sh
```

脚本会引导你完成所有步骤。

---

### 方法 2: 手动修复

#### 步骤 1: 创建新的 GitHub Token

1. **访问 Token 设置页面**
   - 链接：https://github.com/settings/tokens
   - 或：GitHub → 头像 → Settings → Developer settings → Personal access tokens → Tokens (classic)

2. **创建新 Token**
   - 点击 "Generate new token" → "Generate new token (classic)"
   - 填写信息：
     - **Note**: `junyangcrm-workflow-token`（或任何你喜欢的名称）
     - **Expiration**: 选择合适的时间（建议 90 天或 No expiration）

3. **选择权限（必须勾选）**
   ```
   ✅ repo
      └─ 包含所有子权限：
         • repo:status
         • repo_deployment
         • public_repo
         • repo:invite
         • security_events
   
   ✅ workflow
      └─ 允许创建和更新 GitHub Actions 工作流
   ```

4. **生成并复制 Token**
   - 点击 "Generate token"
   - ⚠️ **立即复制 Token！** 离开页面后无法再次查看
   - 如果忘记，需要重新创建

---

#### 步骤 2: 更新本地 Git 配置

```bash
# 更新 Git Remote URL，将 Token 嵌入其中
git remote set-url origin https://你的新Token@github.com/sky770825/junyangcrm.git

# 验证配置
git remote -v
```

**示例：**
```bash
git remote set-url origin https://ghp_xxxxxxxxxxxxxxxxxxxx@github.com/sky770825/junyangcrm.git
```

---

#### 步骤 3: 测试并推送

```bash
# 测试连接
git ls-remote origin

# 推送代码
git push origin main
```

如果一切正常，你会看到：
```
Enumerating objects: XX, done.
Counting objects: 100% (XX/XX), done.
...
To https://github.com/sky770825/junyangcrm.git
   abc1234..def5678  main -> main
```

---

## 🔍 验证修复

### 1. 检查工作流文件是否推送成功

```bash
# 查看远程仓库的工作流文件
git ls-tree -r origin/main --name-only | grep ".github/workflows"
```

应该看到：
```
.github/workflows/deploy.yml
.github/workflows/cloudflare-pages.yml
```

### 2. 检查 GitHub Actions 是否启用

1. 访问：https://github.com/sky770825/junyangcrm/actions
2. 应该能看到工作流列表
3. 推送新代码后，工作流会自动运行

---

## 🛡️ 安全最佳实践

### Token 安全

1. **不要分享 Token**
   - 不要将 Token 提交到代码仓库
   - 不要通过聊天工具分享
   - 不要截图分享

2. **定期更新**
   - 建议每 90 天更新一次
   - 如果怀疑泄露，立即撤销

3. **最小权限原则**
   - 只勾选必要的权限
   - 不要勾选 `delete_repo` 等危险权限

### 撤销 Token

如果 Token 泄露或不再需要：

1. 访问：https://github.com/settings/tokens
2. 找到对应的 Token
3. 点击 "Revoke"（撤销）

---

## 🐛 故障排除

### 问题 1: 仍然提示权限不足

**可能原因：**
- Token 没有正确设置 `workflow` 权限
- Token 已过期
- Remote URL 配置错误

**解决方案：**
```bash
# 检查当前 remote URL
git remote -v

# 重新设置（确保 Token 正确）
git remote set-url origin https://新Token@github.com/sky770825/junyangcrm.git

# 测试连接
git ls-remote origin
```

### 问题 2: 推送成功但工作流不运行

**可能原因：**
- GitHub Actions 未启用
- 工作流文件语法错误

**解决方案：**
1. 检查仓库设置：
   - Settings → Actions → General
   - 确保 "Allow all actions and reusable workflows" 已启用

2. 检查工作流文件语法：
   ```bash
   # 使用 GitHub Actions 的在线验证工具
   # 或查看 Actions 标签页的错误信息
   ```

### 问题 3: Token 在脚本中无法使用

**可能原因：**
- Token 包含特殊字符需要转义
- 使用了错误的 Token 格式

**解决方案：**
- 使用脚本：`./scripts/fix-github-token.sh`（会自动处理）
- 或手动设置：确保 Token 完整且正确

---

## 📚 相关文档

- [GitHub Personal Access Tokens 文档](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token)
- [GitHub Actions 权限文档](https://docs.github.com/en/actions/security-guides/automatic-token-authentication)
- [DEPLOYMENT.md](./DEPLOYMENT.md) - 部署指南

---

## ✅ 完成检查清单

- [ ] 创建了新的 GitHub Token（包含 `workflow` 权限）
- [ ] 更新了本地 Git Remote URL
- [ ] 成功推送了代码到 GitHub
- [ ] 验证了工作流文件存在于远程仓库
- [ ] 检查了 GitHub Actions 是否正常运行

---

**🎉 完成！现在你的 GitHub Actions 应该可以正常工作了！**
