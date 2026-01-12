#!/bin/bash

# 生成 GitHub Secrets 配置模板

set -e

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

echo -e "${BLUE}╔══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║        📋 GitHub Secrets 配置模板                           ║${NC}"
echo -e "${BLUE}╚══════════════════════════════════════════════════════════════╝${NC}"
echo ""

# 检查本地环境变量
if [ -f ".env.local" ]; then
    echo -e "${GREEN}✅ 从 .env.local 读取配置${NC}"
    echo ""
    
    # 读取环境变量
    if grep -q "^NEXT_PUBLIC_SUPABASE_URL=" .env.local; then
        SUPABASE_URL=$(grep "^NEXT_PUBLIC_SUPABASE_URL=" .env.local | cut -d'=' -f2 | tr -d '"' | tr -d "'")
    fi
    
    if grep -q "^NEXT_PUBLIC_SUPABASE_ANON_KEY=" .env.local; then
        SUPABASE_KEY=$(grep "^NEXT_PUBLIC_SUPABASE_ANON_KEY=" .env.local | cut -d'=' -f2 | tr -d '"' | tr -d "'")
    fi
    
    if grep -q "^R2_ACCOUNT_ID=" .env.local; then
        R2_ACCOUNT_ID=$(grep "^R2_ACCOUNT_ID=" .env.local | cut -d'=' -f2 | tr -d '"' | tr -d "'")
    fi
    
    if grep -q "^R2_ACCESS_KEY_ID=" .env.local; then
        R2_ACCESS_KEY_ID=$(grep "^R2_ACCESS_KEY_ID=" .env.local | cut -d'=' -f2 | tr -d '"' | tr -d "'")
    fi
    
    if grep -q "^R2_SECRET_ACCESS_KEY=" .env.local; then
        R2_SECRET_ACCESS_KEY=$(grep "^R2_SECRET_ACCESS_KEY=" .env.local | cut -d'=' -f2 | tr -d '"' | tr -d "'")
    fi
    
    if grep -q "^R2_BUCKET_NAME=" .env.local; then
        R2_BUCKET_NAME=$(grep "^R2_BUCKET_NAME=" .env.local | cut -d'=' -f2 | tr -d '"' | tr -d "'")
    fi
    
    if grep -q "^R2_PUBLIC_URL=" .env.local; then
        R2_PUBLIC_URL=$(grep "^R2_PUBLIC_URL=" .env.local | cut -d'=' -f2 | tr -d '"' | tr -d "'")
    fi
    
    if grep -q "^R2_ENDPOINT=" .env.local; then
        R2_ENDPOINT=$(grep "^R2_ENDPOINT=" .env.local | cut -d'=' -f2 | tr -d '"' | tr -d "'")
    fi
    
    # 生成 NEXTAUTH_SECRET
    NEXTAUTH_SECRET=$(openssl rand -base64 32 2>/dev/null || echo "请手动生成: openssl rand -base64 32")
    
    echo -e "${CYAN}📝 GitHub Secrets 配置清单：${NC}"
    echo ""
    echo -e "${YELLOW}1. CLOUDFLARE_API_TOKEN${NC}"
    echo -e "   值: ${RED}[需要从 Cloudflare Dashboard 创建]${NC}"
    echo ""
    echo -e "${YELLOW}2. CLOUDFLARE_ACCOUNT_ID${NC}"
    echo -e "   值: ${GREEN}82ebeb1d91888e83e8e1b30eeb33d3c3${NC}"
    echo ""
    echo -e "${YELLOW}3. NEXT_PUBLIC_SUPABASE_URL${NC}"
    echo -e "   值: ${GREEN}${SUPABASE_URL:-[未设置]}${NC}"
    echo ""
    echo -e "${YELLOW}4. NEXT_PUBLIC_SUPABASE_ANON_KEY${NC}"
    echo -e "   值: ${GREEN}${SUPABASE_KEY:-[未设置]}${NC}"
    echo ""
    echo -e "${YELLOW}5. NEXTAUTH_URL${NC}"
    echo -e "   值: ${GREEN}https://junyangcrm.pages.dev${NC}"
    echo ""
    echo -e "${YELLOW}6. NEXTAUTH_SECRET${NC}"
    echo -e "   值: ${GREEN}${NEXTAUTH_SECRET}${NC}"
    echo ""
    echo -e "${YELLOW}7. R2_ACCOUNT_ID${NC}"
    echo -e "   值: ${GREEN}${R2_ACCOUNT_ID:-[未设置]}${NC}"
    echo ""
    echo -e "${YELLOW}8. R2_ACCESS_KEY_ID${NC}"
    echo -e "   值: ${GREEN}${R2_ACCESS_KEY_ID:-[未设置]}${NC}"
    echo ""
    echo -e "${YELLOW}9. R2_SECRET_ACCESS_KEY${NC}"
    echo -e "   值: ${GREEN}${R2_SECRET_ACCESS_KEY:-[未设置]}${NC}"
    echo ""
    echo -e "${YELLOW}10. R2_BUCKET_NAME${NC}"
    echo -e "   值: ${GREEN}${R2_BUCKET_NAME:-[未设置]}${NC}"
    echo ""
    echo -e "${YELLOW}11. R2_PUBLIC_URL${NC}"
    echo -e "   值: ${GREEN}${R2_PUBLIC_URL:-[未设置]}${NC}"
    echo ""
    if [ -n "$R2_ENDPOINT" ]; then
        echo -e "${YELLOW}12. R2_ENDPOINT${NC} (可选)"
        echo -e "   值: ${GREEN}${R2_ENDPOINT}${NC}"
        echo ""
    fi
    
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${CYAN}📤 快速操作${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
    echo -e "${YELLOW}1. 复制上面的值${NC}"
    echo -e "${YELLOW}2. 访问 GitHub Secrets:${NC}"
    echo -e "${BLUE}https://github.com/sky770825/junyangcrm/settings/secrets/actions${NC}"
    echo -e "${YELLOW}3. 逐个添加 Secret${NC}"
    echo ""
    
else
    echo -e "${RED}❌ .env.local 文件不存在${NC}"
    echo -e "${YELLOW}请先创建 .env.local 文件${NC}"
    echo ""
    echo -e "${CYAN}参考 env.example 创建：${NC}"
    echo -e "${YELLOW}cp env.example .env.local${NC}"
fi
