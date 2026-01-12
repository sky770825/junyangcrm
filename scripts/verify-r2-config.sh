#!/bin/bash

# Cloudflare R2 配置验证脚本

set -e

echo "🔍 Cloudflare R2 配置验证"
echo "=========================="
echo ""

# 颜色定义
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

ENV_FILE=".env.local"
ERRORS=0

# 检查 .env.local 文件
if [ ! -f "$ENV_FILE" ]; then
    echo -e "${RED}❌ .env.local 文件不存在${NC}"
    echo "   运行: ./scripts/setup-r2.sh 进行配置"
    exit 1
fi

echo -e "${GREEN}✅ .env.local 文件存在${NC}"

# 加载环境变量
source "$ENV_FILE" 2>/dev/null || true

# 检查必要的环境变量
echo ""
echo "检查环境变量："

check_var() {
    local var_name=$1
    local var_value=${!var_name}
    
    if [ -z "$var_value" ] || [[ "$var_value" == *"your-"* ]] || [[ "$var_value" == *"xxxxx"* ]]; then
        echo -e "${RED}❌ $var_name: 未配置或使用占位符${NC}"
        ((ERRORS++))
        return 1
    else
        # 隐藏敏感信息
        if [[ "$var_name" == *"SECRET"* ]] || [[ "$var_name" == *"KEY"* ]]; then
            masked_value="${var_value:0:8}...${var_value: -4}"
            echo -e "${GREEN}✅ $var_name: $masked_value${NC}"
        else
            echo -e "${GREEN}✅ $var_name: $var_value${NC}"
        fi
        return 0
    fi
}

check_var "R2_ACCOUNT_ID"
check_var "R2_ACCESS_KEY_ID"
check_var "R2_SECRET_ACCESS_KEY"
check_var "R2_BUCKET_NAME"

if [ -z "$R2_PUBLIC_URL" ] || [[ "$R2_PUBLIC_URL" == *"your-bucket"* ]] || [[ "$R2_PUBLIC_URL" == *"xxxxx"* ]]; then
    echo -e "${YELLOW}⚠️  R2_PUBLIC_URL: 未配置（可选，用于公开访问）${NC}"
else
    echo -e "${GREEN}✅ R2_PUBLIC_URL: $R2_PUBLIC_URL${NC}"
fi

if [ -z "$R2_ENDPOINT" ] || [[ "$R2_ENDPOINT" == *"your-account-id"* ]]; then
    if [ ! -z "$R2_ACCOUNT_ID" ]; then
        expected_endpoint="https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com"
        echo -e "${YELLOW}⚠️  R2_ENDPOINT: 未配置，建议设置为: $expected_endpoint${NC}"
    else
        echo -e "${YELLOW}⚠️  R2_ENDPOINT: 未配置${NC}"
    fi
else
    echo -e "${GREEN}✅ R2_ENDPOINT: $R2_ENDPOINT${NC}"
fi

echo ""

# 检查 Node.js 依赖
if [ -f "package.json" ]; then
    if grep -q "@aws-sdk/client-s3" package.json; then
        echo -e "${GREEN}✅ @aws-sdk/client-s3 依赖已安装${NC}"
    else
        echo -e "${YELLOW}⚠️  @aws-sdk/client-s3 依赖未安装${NC}"
        echo "   运行: npm install @aws-sdk/client-s3"
        ((ERRORS++))
    fi
else
    echo -e "${RED}❌ package.json 文件不存在${NC}"
    ((ERRORS++))
fi

echo ""

# 检查 API 路由文件
if [ -f "app/api/upload/route.ts" ]; then
    echo -e "${GREEN}✅ 上传 API 路由文件存在${NC}"
else
    echo -e "${RED}❌ 上传 API 路由文件不存在${NC}"
    ((ERRORS++))
fi

if [ -f "app/lib/r2/client.ts" ]; then
    echo -e "${GREEN}✅ R2 客户端文件存在${NC}"
else
    echo -e "${RED}❌ R2 客户端文件不存在${NC}"
    ((ERRORS++))
fi

echo ""

# 测试连接（如果所有配置都完成）
if [ $ERRORS -eq 0 ]; then
    echo "🧪 测试 R2 连接..."
    
    # 检查开发服务器是否运行
    if curl -s http://localhost:3000 > /dev/null 2>&1; then
        echo -e "${GREEN}✅ 开发服务器正在运行${NC}"
        echo ""
        echo "💡 提示: 运行以下命令测试上传："
        echo "   ./scripts/test-r2-upload.sh"
    else
        echo -e "${YELLOW}⚠️  开发服务器未运行${NC}"
        echo "   运行: npm run dev"
    fi
else
    echo -e "${RED}❌ 发现 $ERRORS 个配置问题${NC}"
    echo ""
    echo "请运行配置脚本："
    echo "   ./scripts/setup-r2.sh"
    exit 1
fi

echo ""
echo -e "${GREEN}✅ 配置验证完成！${NC}"
