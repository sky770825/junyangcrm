#!/bin/bash

# GitHub Token 权限修复脚本

set -e

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
CYAN='\033[0;36m'
NC='\033[0m'

echo -e "${BLUE}╔══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║        🔧 GitHub Token 权限修复助手                        ║${NC}"
echo -e "${BLUE}╚══════════════════════════════════════════════════════════════╝${NC}"
echo ""

# 检查当前 remote URL
CURRENT_URL=$(git remote get-url origin 2>/dev/null || echo "")
echo -e "${CYAN}📋 当前 Git Remote 配置：${NC}"
echo -e "   ${YELLOW}$CURRENT_URL${NC}"
echo ""

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}📝 步骤 1: 创建新的 GitHub Personal Access Token${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${GREEN}1. 访问 GitHub Token 设置页面：${NC}"
echo -e "   ${CYAN}https://github.com/settings/tokens${NC}"
echo ""
echo -e "${GREEN}2. 点击 'Generate new token' → 'Generate new token (classic)'${NC}"
echo ""
echo -e "${GREEN}3. 填写 Token 信息：${NC}"
echo -e "   • Note: ${YELLOW}junyangcrm-workflow-token${NC}"
echo -e "   • Expiration: ${YELLOW}选择合适的时间（建议 90 天或 No expiration）${NC}"
echo ""
echo -e "${GREEN}4. 选择权限（必须勾选）：${NC}"
echo -e "   ${YELLOW}✅ repo${NC} (完整仓库权限)"
echo -e "      └─ 包含所有子权限：repo:status, repo_deployment, public_repo, repo:invite, security_events"
echo -e "   ${YELLOW}✅ workflow${NC} (工作流权限)"
echo ""
echo -e "${GREEN}5. 点击 'Generate token'${NC}"
echo ""
echo -e "${RED}⚠️  重要：立即复制 Token！离开页面后无法再次查看${NC}"
echo ""

read -p "按 Enter 继续下一步..." -r
echo ""

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}📝 步骤 2: 更新本地 Git 配置${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# 获取仓库信息
REPO_OWNER="sky770825"
REPO_NAME="junyangcrm"

echo -e "${CYAN}请输入你刚才创建的 GitHub Token：${NC}"
read -s GITHUB_TOKEN
echo ""

if [ -z "$GITHUB_TOKEN" ]; then
    echo -e "${RED}❌ 错误：Token 不能为空${NC}"
    exit 1
fi

# 构建新的 remote URL
NEW_URL="https://${GITHUB_TOKEN}@github.com/${REPO_OWNER}/${REPO_NAME}.git"

echo ""
echo -e "${YELLOW}准备更新 Git Remote URL...${NC}"
echo ""

# 更新 remote URL
git remote set-url origin "$NEW_URL"

echo -e "${GREEN}✅ Git Remote URL 已更新${NC}"
echo ""

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}📝 步骤 3: 测试连接并推送${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# 测试连接
echo -e "${CYAN}测试 GitHub 连接...${NC}"
if git ls-remote origin > /dev/null 2>&1; then
    echo -e "${GREEN}✅ 连接成功！${NC}"
else
    echo -e "${RED}❌ 连接失败，请检查 Token 是否正确${NC}"
    exit 1
fi

echo ""
echo -e "${CYAN}准备推送代码到 GitHub...${NC}"
echo ""

# 检查是否有未推送的提交
UNPUSHED=$(git log origin/main..main --oneline 2>/dev/null | wc -l | tr -d ' ')

if [ "$UNPUSHED" -gt 0 ]; then
    echo -e "${YELLOW}发现 $UNPUSHED 个未推送的提交${NC}"
    echo ""
    read -p "是否现在推送？(y/N): " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo ""
        echo -e "${CYAN}正在推送...${NC}"
        if git push origin main; then
            echo ""
            echo -e "${GREEN}✅ 推送成功！${NC}"
            echo ""
            echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
            echo -e "${GREEN}🎉 完成！现在可以正常使用 GitHub Actions 了${NC}"
            echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
            echo ""
            echo -e "${CYAN}下一步：${NC}"
            echo -e "1. 访问 ${BLUE}https://github.com/${REPO_OWNER}/${REPO_NAME}/actions${NC}"
            echo -e "2. 查看工作流是否正常运行"
            echo ""
        else
            echo ""
            echo -e "${RED}❌ 推送失败${NC}"
            echo -e "${YELLOW}请检查：${NC}"
            echo -e "  • Token 是否有正确的权限"
            echo -e "  • 仓库是否存在且有权限"
            exit 1
        fi
    else
        echo -e "${YELLOW}已跳过推送，你可以稍后手动执行：${NC}"
        echo -e "  ${CYAN}git push origin main${NC}"
    fi
else
    echo -e "${GREEN}✅ 所有提交已推送${NC}"
fi

echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}💡 安全提示${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${CYAN}Token 已保存在 Git 配置中，但为了安全：${NC}"
echo -e "  • 不要将 Token 分享给他人"
echo -e "  • 定期更新 Token"
echo -e "  • 如果 Token 泄露，立即在 GitHub 撤销"
echo ""
