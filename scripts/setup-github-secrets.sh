#!/bin/bash

# 自动配置 GitHub Secrets 脚本

set -e

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
RED='\033[0;31m'
NC='\033[0m'

REPO="sky770825/junyangcrm"

echo -e "${BLUE}╔══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║        🔐 GitHub Secrets 自动配置工具                       ║${NC}"
echo -e "${BLUE}╚══════════════════════════════════════════════════════════════╝${NC}"
echo ""

# 检查 GitHub CLI
if ! command -v gh &> /dev/null; then
    echo -e "${YELLOW}⚠️  GitHub CLI (gh) 未安装${NC}"
    echo ""
    echo -e "${CYAN}安装 GitHub CLI：${NC}"
    echo -e "${YELLOW}brew install gh${NC}"
    echo ""
    echo -e "${CYAN}或使用网页版配置：${NC}"
    echo -e "${BLUE}https://github.com/$REPO/settings/secrets/actions${NC}"
    echo ""
    echo -e "${YELLOW}查看配置值：${NC}"
    echo -e "${CYAN}./scripts/generate-secrets-template.sh${NC}"
    exit 0
fi

# 检查是否已登录
if ! gh auth status &> /dev/null; then
    echo -e "${YELLOW}需要先登录 GitHub${NC}"
    echo ""
    gh auth login
fi

echo -e "${GREEN}✅ GitHub CLI 已安装并登录${NC}"
echo ""

# 读取本地环境变量
if [ ! -f ".env.local" ]; then
    echo -e "${RED}❌ .env.local 文件不存在${NC}"
    exit 1
fi

echo -e "${CYAN}📋 从 .env.local 读取配置...${NC}"
echo ""

# 读取环境变量
read_env_var() {
    grep "^${1}=" .env.local | cut -d'=' -f2- | tr -d '"' | tr -d "'" | xargs
}

# 获取值
CLOUDFLARE_ACCOUNT_ID="82ebeb1d91888e83e8e1b30eeb33d3c3"
SUPABASE_URL=$(read_env_var "NEXT_PUBLIC_SUPABASE_URL")
SUPABASE_KEY=$(read_env_var "NEXT_PUBLIC_SUPABASE_ANON_KEY")
NEXTAUTH_URL="https://junyangcrm.pages.dev"
NEXTAUTH_SECRET=$(read_env_var "NEXTAUTH_SECRET")
R2_ACCOUNT_ID=$(read_env_var "R2_ACCOUNT_ID")
R2_ACCESS_KEY_ID=$(read_env_var "R2_ACCESS_KEY_ID")
R2_SECRET_ACCESS_KEY=$(read_env_var "R2_SECRET_ACCESS_KEY")
R2_BUCKET_NAME=$(read_env_var "R2_BUCKET_NAME")
R2_PUBLIC_URL=$(read_env_var "R2_PUBLIC_URL")
R2_ENDPOINT=$(read_env_var "R2_ENDPOINT")

echo -e "${YELLOW}需要配置的 Secrets：${NC}"
echo ""
echo -e "  ${GREEN}1.${NC} CLOUDFLARE_API_TOKEN (需要手动输入)"
echo -e "  ${GREEN}2.${NC} CLOUDFLARE_ACCOUNT_ID"
echo -e "  ${GREEN}3.${NC} NEXT_PUBLIC_SUPABASE_URL"
echo -e "  ${GREEN}4.${NC} NEXT_PUBLIC_SUPABASE_ANON_KEY"
echo -e "  ${GREEN}5.${NC} NEXTAUTH_URL"
echo -e "  ${GREEN}6.${NC} NEXTAUTH_SECRET"
echo -e "  ${GREEN}7.${NC} R2_ACCOUNT_ID"
echo -e "  ${GREEN}8.${NC} R2_ACCESS_KEY_ID"
echo -e "  ${GREEN}9.${NC} R2_SECRET_ACCESS_KEY"
echo -e "  ${GREEN}10.${NC} R2_BUCKET_NAME"
echo -e "  ${GREEN}11.${NC} R2_PUBLIC_URL"
echo -e "  ${GREEN}12.${NC} R2_ENDPOINT"
echo ""

# 获取 Cloudflare API Token
echo -e "${CYAN}请输入 Cloudflare API Token：${NC}"
echo -e "${YELLOW}（如果还没有，访问：https://dash.cloudflare.com/profile/api-tokens）${NC}"
read -s CLOUDFLARE_API_TOKEN
echo ""

if [ -z "$CLOUDFLARE_API_TOKEN" ]; then
    echo -e "${RED}❌ Cloudflare API Token 不能为空${NC}"
    exit 1
fi

echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${CYAN}开始配置 GitHub Secrets...${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# 配置函数
set_secret() {
    local name=$1
    local value=$2
    local description=$3
    
    if [ -z "$value" ]; then
        echo -e "${RED}❌${NC} $name - 值为空，跳过"
        return 1
    fi
    
    echo -e "${CYAN}配置 $name...${NC}"
    if echo -n "$value" | gh secret set "$name" --repo "$REPO" 2>/dev/null; then
        echo -e "${GREEN}✅${NC} $name 配置成功"
        return 0
    else
        echo -e "${RED}❌${NC} $name 配置失败"
        return 1
    fi
}

# 配置所有 Secrets
SUCCESS=0
TOTAL=12

set_secret "CLOUDFLARE_API_TOKEN" "$CLOUDFLARE_API_TOKEN" "Cloudflare API Token" && ((SUCCESS++))
set_secret "CLOUDFLARE_ACCOUNT_ID" "$CLOUDFLARE_ACCOUNT_ID" "Cloudflare Account ID" && ((SUCCESS++))
set_secret "NEXT_PUBLIC_SUPABASE_URL" "$SUPABASE_URL" "Supabase URL" && ((SUCCESS++))
set_secret "NEXT_PUBLIC_SUPABASE_ANON_KEY" "$SUPABASE_KEY" "Supabase Anon Key" && ((SUCCESS++))
set_secret "NEXTAUTH_URL" "$NEXTAUTH_URL" "NextAuth URL" && ((SUCCESS++))
set_secret "NEXTAUTH_SECRET" "$NEXTAUTH_SECRET" "NextAuth Secret" && ((SUCCESS++))
set_secret "R2_ACCOUNT_ID" "$R2_ACCOUNT_ID" "R2 Account ID" && ((SUCCESS++))
set_secret "R2_ACCESS_KEY_ID" "$R2_ACCESS_KEY_ID" "R2 Access Key ID" && ((SUCCESS++))
set_secret "R2_SECRET_ACCESS_KEY" "$R2_SECRET_ACCESS_KEY" "R2 Secret Access Key" && ((SUCCESS++))
set_secret "R2_BUCKET_NAME" "$R2_BUCKET_NAME" "R2 Bucket Name" && ((SUCCESS++))
set_secret "R2_PUBLIC_URL" "$R2_PUBLIC_URL" "R2 Public URL" && ((SUCCESS++))
set_secret "R2_ENDPOINT" "$R2_ENDPOINT" "R2 Endpoint" && ((SUCCESS++))

echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}配置完成：$SUCCESS / $TOTAL 个 Secrets${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

if [ $SUCCESS -eq $TOTAL ]; then
    echo -e "${GREEN}🎉 所有 Secrets 配置成功！${NC}"
    echo ""
    echo -e "${CYAN}下一步：${NC}"
    echo -e "${YELLOW}1. 触发部署：${NC}"
    echo -e "   ${CYAN}git commit --allow-empty -m '触发部署'${NC}"
    echo -e "   ${CYAN}git push origin main${NC}"
    echo ""
    echo -e "${YELLOW}2. 或手动触发 GitHub Actions：${NC}"
    echo -e "   ${BLUE}https://github.com/$REPO/actions${NC}"
else
    echo -e "${YELLOW}⚠️  部分 Secrets 配置失败，请检查错误信息${NC}"
    echo -e "${CYAN}可以手动配置：${NC}"
    echo -e "${BLUE}https://github.com/$REPO/settings/secrets/actions${NC}"
fi

echo ""
