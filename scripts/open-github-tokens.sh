#!/bin/bash

# 快速打开 GitHub Token 设置页面的脚本

set -e

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

TOKEN_URL="https://github.com/settings/tokens"

echo -e "${BLUE}╔══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║        🔑 GitHub Token 创建助手                            ║${NC}"
echo -e "${BLUE}╚══════════════════════════════════════════════════════════════╝${NC}"
echo ""

echo -e "${CYAN}正在打开 GitHub Token 设置页面...${NC}"
echo ""

# 检测操作系统并使用相应的命令打开浏览器
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    open "$TOKEN_URL"
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    # Linux
    if command -v xdg-open &> /dev/null; then
        xdg-open "$TOKEN_URL"
    elif command -v gnome-open &> /dev/null; then
        gnome-open "$TOKEN_URL"
    else
        echo -e "${YELLOW}无法自动打开浏览器，请手动访问：${NC}"
        echo -e "${CYAN}$TOKEN_URL${NC}"
    fi
elif [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
    # Windows
    start "$TOKEN_URL"
else
    echo -e "${YELLOW}无法自动打开浏览器，请手动访问：${NC}"
    echo -e "${CYAN}$TOKEN_URL${NC}"
fi

echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}📝 创建 Token 的步骤：${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${CYAN}1. 点击 'Generate new token' → 'Generate new token (classic)'${NC}"
echo ""
echo -e "${CYAN}2. 填写信息：${NC}"
echo -e "   • Note: ${YELLOW}junyangcrm-workflow-token${NC}"
echo -e "   • Expiration: ${YELLOW}90 days${NC} 或 ${YELLOW}No expiration${NC}"
echo ""
echo -e "${CYAN}3. 勾选权限（必须）：${NC}"
echo -e "   ${GREEN}✅ repo${NC} (完整仓库权限)"
echo -e "   ${GREEN}✅ workflow${NC} (工作流权限)"
echo ""
echo -e "${CYAN}4. 点击 'Generate token'${NC}"
echo ""
echo -e "${YELLOW}⚠️  重要：立即复制 Token！离开页面后无法再次查看${NC}"
echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${GREEN}创建 Token 后，运行以下命令配置：${NC}"
echo -e "${CYAN}./scripts/fix-github-token.sh${NC}"
echo ""
echo -e "${BLUE}或查看详细指南：${NC}"
echo -e "${CYAN}cat scripts/get-github-token.md${NC}"
echo ""
