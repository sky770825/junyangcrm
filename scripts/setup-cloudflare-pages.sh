#!/bin/bash

# Cloudflare Pages 快速设置脚本

set -e

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
RED='\033[0;31m'
NC='\033[0m'

ACCOUNT_ID="82ebeb1d91888e83e8e1b30eeb33d3c3"
PROJECT_NAME="junyangcrm"
REPO="sky770825/junyangcrm"

echo -e "${BLUE}╔══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║        🌐 Cloudflare Pages 部署设置助手                    ║${NC}"
echo -e "${BLUE}╚══════════════════════════════════════════════════════════════╝${NC}"
echo ""

echo -e "${CYAN}项目信息：${NC}"
echo -e "  • Account ID: ${YELLOW}$ACCOUNT_ID${NC}"
echo -e "  • 项目名称: ${YELLOW}$PROJECT_NAME${NC}"
echo -e "  • GitHub 仓库: ${YELLOW}$REPO${NC}"
echo ""

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}📝 设置步骤：${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

echo -e "${YELLOW}步骤 1: 创建 Cloudflare API Token${NC}"
echo -e "${CYAN}访问：${BLUE}https://dash.cloudflare.com/profile/api-tokens${NC}"
echo ""
echo -e "权限设置："
echo -e "  • Account → Cloudflare Pages → Edit"
echo -e "  • Account Resources: Include → All accounts"
echo ""

read -p "按 Enter 打开 Token 设置页面..." -r
open "https://dash.cloudflare.com/profile/api-tokens" 2>/dev/null || echo "请手动访问：https://dash.cloudflare.com/profile/api-tokens"

echo ""
echo -e "${YELLOW}步骤 2: 配置 GitHub Secrets${NC}"
echo -e "${CYAN}访问：${BLUE}https://github.com/$REPO/settings/secrets/actions${NC}"
echo ""
echo -e "需要添加的 Secrets："
echo -e "  ${GREEN}1. CLOUDFLARE_API_TOKEN${NC} - 刚才创建的 Token"
echo -e "  ${GREEN}2. CLOUDFLARE_ACCOUNT_ID${NC} - $ACCOUNT_ID"
echo -e "  ${GREEN}3. NEXT_PUBLIC_SUPABASE_URL${NC}"
echo -e "  ${GREEN}4. NEXT_PUBLIC_SUPABASE_ANON_KEY${NC}"
echo -e "  ${GREEN}5. NEXTAUTH_URL${NC} - https://$PROJECT_NAME.pages.dev"
echo -e "  ${GREEN}6. NEXTAUTH_SECRET${NC} - 运行: openssl rand -base64 32"
echo -e "  ${GREEN}7-12. R2 相关变量${NC}（从 .env.local 复制）"
echo ""

read -p "按 Enter 打开 GitHub Secrets 设置..." -r
open "https://github.com/$REPO/settings/secrets/actions" 2>/dev/null || echo "请手动访问：https://github.com/$REPO/settings/secrets/actions"

echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}📋 快速参考${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${CYAN}重要链接：${NC}"
echo -e "  • Token 设置: ${BLUE}https://dash.cloudflare.com/profile/api-tokens${NC}"
echo -e "  • GitHub Secrets: ${BLUE}https://github.com/$REPO/settings/secrets/actions${NC}"
echo -e "  • Cloudflare Pages: ${BLUE}https://dash.cloudflare.com/$ACCOUNT_ID/pages${NC}"
echo -e "  • GitHub Actions: ${BLUE}https://github.com/$REPO/actions${NC}"
echo ""
echo -e "${CYAN}生成 NEXTAUTH_SECRET：${NC}"
echo -e "${YELLOW}openssl rand -base64 32${NC}"
echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✅ 配置完成后${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${CYAN}触发部署：${NC}"
echo -e "  ${YELLOW}git push origin main${NC}"
echo ""
echo -e "${CYAN}或手动触发：${NC}"
echo -e "  ${BLUE}https://github.com/$REPO/actions${NC}"
echo "  选择 '🌐 Cloudflare Pages 部署' → Run workflow"
echo ""
echo -e "${CYAN}查看详细指南：${NC}"
echo -e "  ${YELLOW}cat CLOUDFLARE_PAGES_SETUP.md${NC}"
echo ""
