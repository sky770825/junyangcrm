#!/bin/bash

# GitHub Actions 快速设置脚本

set -e

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}╔══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║        🔧 GitHub Actions 工作流设置助手                    ║${NC}"
echo -e "${BLUE}╚══════════════════════════════════════════════════════════════╝${NC}"
echo ""

# 检查工作流文件是否存在
if [ ! -d ".github/workflows" ]; then
    echo -e "${RED}❌ 错误：.github/workflows 目录不存在${NC}"
    exit 1
fi

echo -e "${YELLOW}📋 工作流文件列表：${NC}"
ls -1 .github/workflows/*.yml 2>/dev/null || echo "   (无文件)"

echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}⚠️  由于 GitHub Token 权限限制，需要手动上传工作流文件${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

echo -e "${GREEN}📝 手动上传步骤：${NC}"
echo ""
echo "1. 访问 GitHub 仓库："
echo -e "   ${BLUE}https://github.com/sky770825/junyangcrm${NC}"
echo ""
echo "2. 点击 'Add file' → 'Create new file'"
echo ""
echo "3. 输入文件路径："
echo -e "   ${YELLOW}.github/workflows/deploy.yml${NC}"
echo ""
echo "4. 复制以下文件内容并粘贴："
echo ""

# 显示文件内容
if [ -f ".github/workflows/deploy.yml" ]; then
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${GREEN}📄 .github/workflows/deploy.yml${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    cat .github/workflows/deploy.yml
    echo ""
fi

if [ -f ".github/workflows/cloudflare-pages.yml" ]; then
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${GREEN}📄 .github/workflows/cloudflare-pages.yml${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    cat .github/workflows/cloudflare-pages.yml
    echo ""
fi

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${GREEN}✅ 或者，更新 GitHub Token 权限后自动推送：${NC}"
echo ""
echo "1. 访问：https://github.com/settings/tokens"
echo "2. 创建新 Token，勾选 'workflow' 权限"
echo "3. 更新本地 Git 配置："
echo -e "   ${YELLOW}git remote set-url origin https://你的新Token@github.com/sky770825/junyangcrm.git${NC}"
echo "4. 重新推送："
echo -e "   ${YELLOW}git push origin main${NC}"
echo ""
