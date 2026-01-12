#!/bin/bash

# 检查部署准备状态

set -e

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}╔══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║        🔍 部署准备状态检查                                  ║${NC}"
echo -e "${BLUE}╚══════════════════════════════════════════════════════════════╝${NC}"
echo ""

# 检查本地环境变量
echo -e "${CYAN}📋 检查本地环境变量...${NC}"
if [ -f ".env.local" ]; then
    echo -e "${GREEN}✅ .env.local 文件存在${NC}"
    
    REQUIRED_VARS=(
        "NEXT_PUBLIC_SUPABASE_URL"
        "NEXT_PUBLIC_SUPABASE_ANON_KEY"
        "NEXTAUTH_SECRET"
        "R2_ACCOUNT_ID"
        "R2_ACCESS_KEY_ID"
        "R2_SECRET_ACCESS_KEY"
        "R2_BUCKET_NAME"
        "R2_PUBLIC_URL"
    )
    
    echo ""
    echo -e "${YELLOW}必需的环境变量：${NC}"
    for var in "${REQUIRED_VARS[@]}"; do
        if grep -q "^${var}=" .env.local 2>/dev/null; then
            VALUE=$(grep "^${var}=" .env.local | cut -d'=' -f2)
            if [ -n "$VALUE" ] && [ "$VALUE" != "your-"* ]; then
                echo -e "  ${GREEN}✅${NC} $var"
            else
                echo -e "  ${RED}❌${NC} $var (未设置或使用默认值)"
            fi
        else
            echo -e "  ${RED}❌${NC} $var (缺失)"
        fi
    done
else
    echo -e "${RED}❌ .env.local 文件不存在${NC}"
    echo -e "${YELLOW}请参考 env.example 创建 .env.local${NC}"
fi

echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${CYAN}📋 GitHub Secrets 检查清单${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${YELLOW}访问以下链接检查：${NC}"
echo -e "${BLUE}https://github.com/sky770825/junyangcrm/settings/secrets/actions${NC}"
echo ""
echo -e "${CYAN}必需的 Secrets：${NC}"
echo -e "  ${GREEN}1. CLOUDFLARE_API_TOKEN${NC}"
echo -e "  ${GREEN}2. CLOUDFLARE_ACCOUNT_ID${NC} = 82ebeb1d91888e83e8e1b30eeb33d3c3"
echo -e "  ${GREEN}3. NEXT_PUBLIC_SUPABASE_URL${NC}"
echo -e "  ${GREEN}4. NEXT_PUBLIC_SUPABASE_ANON_KEY${NC}"
echo -e "  ${GREEN}5. NEXTAUTH_URL${NC} = https://junyangcrm.pages.dev"
echo -e "  ${GREEN}6. NEXTAUTH_SECRET${NC}"
echo -e "  ${GREEN}7. R2_ACCOUNT_ID${NC}"
echo -e "  ${GREEN}8. R2_ACCESS_KEY_ID${NC}"
echo -e "  ${GREEN}9. R2_SECRET_ACCESS_KEY${NC}"
echo -e "  ${GREEN}10. R2_BUCKET_NAME${NC}"
echo -e "  ${GREEN}11. R2_PUBLIC_URL${NC}"
echo -e "  ${GREEN}12. R2_ENDPOINT${NC} (可选)"
echo ""

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${CYAN}🚀 部署链接${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${YELLOW}Cloudflare API Token:${NC}"
echo -e "${BLUE}https://dash.cloudflare.com/profile/api-tokens${NC}"
echo ""
echo -e "${YELLOW}GitHub Secrets:${NC}"
echo -e "${BLUE}https://github.com/sky770825/junyangcrm/settings/secrets/actions${NC}"
echo ""
echo -e "${YELLOW}GitHub Actions:${NC}"
echo -e "${BLUE}https://github.com/sky770825/junyangcrm/actions${NC}"
echo ""
echo -e "${YELLOW}Cloudflare Pages:${NC}"
echo -e "${BLUE}https://dash.cloudflare.com/82ebeb1d91888e83e8e1b30eeb33d3c3/pages${NC}"
echo ""

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}💡 快速操作${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${CYAN}生成 NEXTAUTH_SECRET：${NC}"
echo -e "${YELLOW}openssl rand -base64 32${NC}"
echo ""
echo -e "${CYAN}触发部署：${NC}"
echo -e "${YELLOW}git push origin main${NC}"
echo ""
