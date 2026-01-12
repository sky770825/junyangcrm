#!/bin/bash

# 快速部署检查工具

set -e

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}╔══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║        🚀 快速部署检查工具                                  ║${NC}"
echo -e "${BLUE}╚══════════════════════════════════════════════════════════════╝${NC}"
echo ""

# 检查本地配置
echo -e "${CYAN}📋 检查本地配置...${NC}"
if [ -f ".env.local" ]; then
    echo -e "${GREEN}✅ .env.local 存在${NC}"
else
    echo -e "${RED}❌ .env.local 不存在${NC}"
fi

echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${CYAN}🔗 快速链接${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

echo -e "${YELLOW}1. Cloudflare API Token${NC}"
echo -e "${BLUE}   https://dash.cloudflare.com/profile/api-tokens${NC}"
echo ""

echo -e "${YELLOW}2. GitHub Secrets${NC}"
echo -e "${BLUE}   https://github.com/sky770825/junyangcrm/settings/secrets/actions${NC}"
echo ""

echo -e "${YELLOW}3. GitHub Actions${NC}"
echo -e "${BLUE}   https://github.com/sky770825/junyangcrm/actions${NC}"
echo ""

echo -e "${YELLOW}4. Cloudflare Pages${NC}"
echo -e "${BLUE}   https://dash.cloudflare.com/82ebeb1d91888e83e8e1b30eeb33d3c3/pages${NC}"
echo ""

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}📝 配置清单${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${CYAN}必需的 GitHub Secrets：${NC}"
echo -e "  ${YELLOW}□${NC} CLOUDFLARE_API_TOKEN"
echo -e "  ${YELLOW}□${NC} CLOUDFLARE_ACCOUNT_ID"
echo -e "  ${YELLOW}□${NC} NEXT_PUBLIC_SUPABASE_URL"
echo -e "  ${YELLOW}□${NC} NEXT_PUBLIC_SUPABASE_ANON_KEY"
echo -e "  ${YELLOW}□${NC} NEXTAUTH_URL"
echo -e "  ${YELLOW}□${NC} NEXTAUTH_SECRET"
echo -e "  ${YELLOW}□${NC} R2_ACCOUNT_ID"
echo -e "  ${YELLOW}□${NC} R2_ACCESS_KEY_ID"
echo -e "  ${YELLOW}□${NC} R2_SECRET_ACCESS_KEY"
echo -e "  ${YELLOW}□${NC} R2_BUCKET_NAME"
echo -e "  ${YELLOW}□${NC} R2_PUBLIC_URL"
echo -e "  ${YELLOW}□${NC} R2_ENDPOINT"
echo ""

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}🚀 部署命令${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${CYAN}配置完成后，运行：${NC}"
echo -e "${YELLOW}git push origin main${NC}"
echo ""
echo -e "${CYAN}或查看配置值：${NC}"
echo -e "${YELLOW}./scripts/generate-secrets-template.sh${NC}"
echo ""
