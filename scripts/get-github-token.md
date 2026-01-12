# 🔑 获取 GitHub Token 完整指南

> 一步步教你创建 GitHub Personal Access Token

---

## 🚀 快速步骤（5分钟）

### 步骤 1: 访问 Token 设置页面

**方式 A: 直接链接**
- 点击：https://github.com/settings/tokens

**方式 B: 手动导航**
1. 访问 https://github.com
2. 点击右上角头像
3. 选择 **Settings**
4. 左侧菜单找到 **Developer settings**
5. 点击 **Personal access tokens** → **Tokens (classic)**

---

### 步骤 2: 创建新 Token

1. **点击生成按钮**
   - 点击 **"Generate new token"** 下拉菜单
   - 选择 **"Generate new token (classic)"**

2. **填写 Token 信息**
   ```
   Note: junyangcrm-workflow-token
   （或任何你喜欢的名称，用于识别这个 token 的用途）
   
   Expiration: 
   - 选择 "90 days"（推荐，更安全）
   - 或 "No expiration"（如果确定安全）
   ```

3. **选择权限（重要！）**
   
   必须勾选以下权限：
   
   ✅ **repo** (完整仓库权限)
      - 这会自动包含所有子权限：
        - repo:status
        - repo_deployment
        - public_repo
        - repo:invite
        - security_events
   
   ✅ **workflow** (工作流权限)
      - 允许创建和更新 GitHub Actions 工作流
      - **这是推送工作流文件必需的！**

4. **滚动到底部，点击 "Generate token"**

---

### 步骤 3: 复制 Token

⚠️ **重要：立即复制 Token！**

- Token 会显示在页面上（类似：`ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`）
- **离开这个页面后，你将无法再次查看这个 Token**
- 如果忘记，需要删除并重新创建

**复制 Token 后，保存到安全的地方（暂时）**

---

### 步骤 4: 使用 Token

创建 Token 后，运行以下脚本自动配置：

```bash
./scripts/fix-github-token.sh
```

脚本会要求你输入 Token，然后自动：
- 更新 Git 配置
- 测试连接
- 推送代码

---

## 📸 可视化指南

### Token 设置页面位置

```
GitHub 首页
  └─ 头像 (右上角)
      └─ Settings
          └─ Developer settings (左侧菜单)
              └─ Personal access tokens
                  └─ Tokens (classic)
                      └─ Generate new token (classic)
```

### 权限选择界面

```
Select scopes (勾选以下权限):

☑️ repo
   ☑️ repo:status
   ☑️ repo_deployment
   ☑️ public_repo
   ☑️ repo:invite
   ☑️ security_events

☑️ workflow
   ☑️ 允许创建和更新 GitHub Actions 工作流
```

---

## 🔍 验证 Token

创建 Token 后，可以测试是否有效：

```bash
# 测试 Token（替换 YOUR_TOKEN）
curl -H "Authorization: token YOUR_TOKEN" https://api.github.com/user
```

如果返回你的用户信息，说明 Token 有效。

---

## ⚠️ 常见问题

### Q1: Token 格式是什么？
**A:** 通常以 `ghp_` 开头，后面跟着 36 个字符，例如：
```
ghp_1234567890abcdefghijklmnopqrstuvwxyz
```

### Q2: 为什么需要 workflow 权限？
**A:** 因为我们要推送 `.github/workflows/` 目录下的文件，这些文件控制 GitHub Actions 的行为。没有 `workflow` 权限，GitHub 会拒绝这些文件的推送。

### Q3: Token 泄露了怎么办？
**A:** 立即访问 https://github.com/settings/tokens，找到对应的 Token，点击 **"Revoke"**（撤销）。

### Q4: Token 过期了怎么办？
**A:** 创建新的 Token，然后重新运行配置脚本。

### Q5: 可以给 Token 设置更少的权限吗？
**A:** 对于这个项目，`repo` 和 `workflow` 是必需的。如果只给 `workflow` 权限，可能无法推送代码。

---

## 🛡️ 安全最佳实践

1. **不要分享 Token**
   - 不要通过聊天工具分享
   - 不要提交到代码仓库
   - 不要截图分享

2. **定期更新**
   - 建议每 90 天更新一次
   - 如果怀疑泄露，立即撤销

3. **最小权限原则**
   - 只勾选必要的权限
   - 不要勾选 `delete_repo` 等危险权限

4. **使用环境变量**
   - 在 CI/CD 中使用 Secrets
   - 不要在代码中硬编码

---

## ✅ 完成检查清单

创建 Token 前：
- [ ] 确认已登录 GitHub
- [ ] 知道 Token 的用途（推送工作流文件）

创建 Token 时：
- [ ] 填写了 Note（便于识别）
- [ ] 选择了合适的过期时间
- [ ] ✅ 勾选了 `repo` 权限
- [ ] ✅ 勾选了 `workflow` 权限
- [ ] 点击了 "Generate token"

创建 Token 后：
- [ ] ✅ 立即复制了 Token
- [ ] 保存到安全的地方（临时）
- [ ] 运行了配置脚本或手动更新了 Git 配置
- [ ] 测试了推送功能
- [ ] 验证了工作流文件已成功推送

---

## 📚 相关链接

- [GitHub Personal Access Tokens 官方文档](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token)
- [GitHub Actions 权限文档](https://docs.github.com/en/actions/security-guides/automatic-token-authentication)
- [项目部署指南](./DEPLOYMENT.md)

---

**🎉 完成！现在你有了一个有效的 GitHub Token，可以推送工作流文件了！**
