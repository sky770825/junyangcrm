# 🔧 GitHub Actions 设置指南

## ⚠️ 权限问题

如果推送时遇到权限错误，需要更新 GitHub Personal Access Token。

## 解决方案

### 方法 1: 更新 Token 权限（推荐）

1. **创建新的 Personal Access Token**
   - 访问：https://github.com/settings/tokens
   - 点击 "Generate new token" → "Generate new token (classic)"
   - 选择权限：
     - ✅ `repo` (完整仓库权限)
     - ✅ `workflow` (工作流权限)
   - 生成并复制 Token

2. **更新本地 Git 配置**
   ```bash
   git remote set-url origin https://你的新Token@github.com/sky770825/junyangcrm.git
   ```

3. **重新推送**
   ```bash
   git push origin main
   ```

### 方法 2: 手动上传工作流文件

1. 访问 GitHub 仓库
2. 点击 "Add file" → "Create new file"
3. 路径输入：`.github/workflows/deploy.yml`
4. 复制文件内容并粘贴
5. 提交文件

---

## ✅ 设置完成后

GitHub Actions 会自动：
- ✅ 监听 `main` 分支的推送
- ✅ 自动构建和测试
- ✅ 准备部署（需要配置平台）

---

## 📚 下一步

查看 `DEPLOYMENT.md` 了解如何配置：
- Vercel 部署
- Cloudflare Pages 部署
