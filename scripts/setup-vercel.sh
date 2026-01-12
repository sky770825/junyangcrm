#!/bin/bash

# Vercel 快速部署助手

set -e

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}╔══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║        🚀 Vercel 部署助手                                  ║${NC}"
echo -e "${BLUE}╚══════════════════════════════════════════════════════════════╝${NC}"
echo ""

# 检查是否安装了 Vercel CLI
if ! command -v vercel &> /dev/null; then
    echo -e "${YELLOW}⚠️  Vercel CLI 未安装${NC}"
    echo ""
    echo -e "${CYAN}安装 Vercel CLI：${NC}"
    echo -e "${YELLOW}npm install -g vercel${NC}"
    echo ""
    read -p "是否现在安装？(y/N): " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        npm install -g vercel
    else
        echo -e "${YELLOW}请先安装 Vercel CLI，或使用网页版部署${NC}"
        echo ""
        echo -e "${CYAN}网页版部署：${NC}"
        echo -e "${BLUE}https://vercel.com/new${NC}"
        exit 0
    fi
fi

echo -e "${GREEN}✅ Vercel CLI 已安装${NC}"
echo ""

# 检查环境变量文件
if [ -f ".env.local" ]; then
    echo -e "${CYAN}📋 检测到 .env.local 文件${NC}"
    echo ""
    echo -e "${YELLOW}环境变量清单：${NC}"
    grep -E "^[A-Z_]+=" .env.local | grep -v "^#" | cut -d'=' -f1 | while read var; do
        echo -e "  • ${GREEN}$var${NC}"
    done
    echo ""
    echo -e "${CYAN}这些环境变量需要在 Vercel 项目中手动配置${NC}"
    echo ""
else
    echo -e "${YELLOW}⚠️  未找到 .env.local 文件${NC}"
    echo -e "${CYAN}请参考 env.example 创建 .env.local${NC}"
    echo ""
fi

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}📝 部署步骤：${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${CYAN}方式 1: 使用 Vercel CLI（当前）${NC}"
echo ""
echo -e "${YELLOW}1. 登录 Vercel${NC}"
echo -e "   ${CYAN}vercel login${NC}"
echo ""
echo -e "${YELLOW}2. 部署项目${NC}"
echo -e "   ${CYAN}vercel${NC}        # 预览部署"
echo -e "   ${CYAN}vercel --prod${NC} # 生产部署"
echo ""
echo -e "${CYAN}方式 2: 使用网页版（推荐首次部署）${NC}"
echo ""
echo -e "${YELLOW}1. 访问：${NC}"
echo -e "   ${BLUE}https://vercel.com/new${NC}"
echo ""
echo -e "${YELLOW}2. 导入 GitHub 仓库：${NC}"
echo -e "   ${CYAN}sky770825/junyangcrm${NC}"
echo ""
echo -e "${YELLOW}3. 配置环境变量${NC}"
echo -e "   ${CYAN}项目设置 → Environment Variables${NC}"
echo ""
echo -e "${YELLOW}4. 点击 Deploy${NC}"
echo ""

read -p "是否现在开始部署？(y/N): " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo ""
    echo -e "${CYAN}开始部署...${NC}"
    echo ""
    
    # 检查是否已登录
    if ! vercel whoami &> /dev/null; then
        echo -e "${YELLOW}需要先登录 Vercel${NC}"
        vercel login
    fi
    
    echo ""
    echo -e "${CYAN}执行预览部署...${NC}"
    vercel
    
    echo ""
    echo -e "${GREEN}✅ 预览部署完成！${NC}"
    echo ""
    read -p "是否部署到生产环境？(y/N): " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo ""
        echo -e "${CYAN}部署到生产环境...${NC}"
        vercel --prod
        echo ""
        echo -e "${GREEN}✅ 生产部署完成！${NC}"
    fi
else
    echo ""
    echo -e "${CYAN}你可以稍后运行：${NC}"
    echo -e "${YELLOW}vercel${NC}        # 预览部署"
    echo -e "${YELLOW}vercel --prod${NC} # 生产部署"
fi

echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}📚 相关文档：${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "• ${CYAN}DEPLOY_CHECKLIST.md${NC} - 部署检查清单"
echo -e "• ${CYAN}DEPLOYMENT.md${NC} - 完整部署指南"
echo ""
