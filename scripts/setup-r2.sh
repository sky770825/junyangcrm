#!/bin/bash

# Cloudflare R2 自动化配置脚本

set -e

echo "🚀 Cloudflare R2 自动化配置工具"
echo "=================================="
echo ""

# 颜色定义
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# 检查 .env.local 文件
ENV_FILE=".env.local"
if [ ! -f "$ENV_FILE" ]; then
    echo -e "${YELLOW}⚠️  .env.local 文件不存在，正在创建...${NC}"
    cp env.example "$ENV_FILE"
    echo -e "${GREEN}✅ 已创建 .env.local 文件${NC}"
    echo ""
fi

# 读取现有配置
source "$ENV_FILE" 2>/dev/null || true

echo "📋 配置步骤："
echo "1. 在 Cloudflare Dashboard 创建 R2 Bucket"
echo "2. 创建 API Token"
echo "3. 获取 Account ID"
echo "4. 配置 Public Access（可选）"
echo ""

# 交互式配置
echo "请输入以下信息（按 Enter 跳过已配置的项）："
echo ""

# Account ID
if [ -z "$R2_ACCOUNT_ID" ] || [ "$R2_ACCOUNT_ID" = "your-account-id-here" ]; then
    read -p "R2 Account ID: " account_id
    if [ ! -z "$account_id" ]; then
        # 更新 .env.local
        if grep -q "R2_ACCOUNT_ID=" "$ENV_FILE"; then
            sed -i.bak "s|R2_ACCOUNT_ID=.*|R2_ACCOUNT_ID=$account_id|" "$ENV_FILE"
        else
            echo "R2_ACCOUNT_ID=$account_id" >> "$ENV_FILE"
        fi
        echo -e "${GREEN}✅ Account ID 已保存${NC}"
    fi
else
    echo -e "${GREEN}✅ Account ID 已配置: $R2_ACCOUNT_ID${NC}"
fi

# Access Key ID
if [ -z "$R2_ACCESS_KEY_ID" ] || [ "$R2_ACCESS_KEY_ID" = "your-access-key-id-here" ]; then
    read -p "R2 Access Key ID: " access_key_id
    if [ ! -z "$access_key_id" ]; then
        if grep -q "R2_ACCESS_KEY_ID=" "$ENV_FILE"; then
            sed -i.bak "s|R2_ACCESS_KEY_ID=.*|R2_ACCESS_KEY_ID=$access_key_id|" "$ENV_FILE"
        else
            echo "R2_ACCESS_KEY_ID=$access_key_id" >> "$ENV_FILE"
        fi
        echo -e "${GREEN}✅ Access Key ID 已保存${NC}"
    fi
else
    echo -e "${GREEN}✅ Access Key ID 已配置${NC}"
fi

# Secret Access Key
if [ -z "$R2_SECRET_ACCESS_KEY" ] || [ "$R2_SECRET_ACCESS_KEY" = "your-secret-access-key-here" ]; then
    read -sp "R2 Secret Access Key: " secret_key
    echo ""
    if [ ! -z "$secret_key" ]; then
        if grep -q "R2_SECRET_ACCESS_KEY=" "$ENV_FILE"; then
            sed -i.bak "s|R2_SECRET_ACCESS_KEY=.*|R2_SECRET_ACCESS_KEY=$secret_key|" "$ENV_FILE"
        else
            echo "R2_SECRET_ACCESS_KEY=$secret_key" >> "$ENV_FILE"
        fi
        echo -e "${GREEN}✅ Secret Access Key 已保存${NC}"
    fi
else
    echo -e "${GREEN}✅ Secret Access Key 已配置${NC}"
fi

# Bucket Name
if [ -z "$R2_BUCKET_NAME" ] || [ "$R2_BUCKET_NAME" = "your-r2-bucket-name" ]; then
    read -p "R2 Bucket Name (默认: junyangcrm-files): " bucket_name
    bucket_name=${bucket_name:-junyangcrm-files}
    if grep -q "R2_BUCKET_NAME=" "$ENV_FILE"; then
        sed -i.bak "s|R2_BUCKET_NAME=.*|R2_BUCKET_NAME=$bucket_name|" "$ENV_FILE"
    else
        echo "R2_BUCKET_NAME=$bucket_name" >> "$ENV_FILE"
    fi
    echo -e "${GREEN}✅ Bucket Name 已保存: $bucket_name${NC}"
else
    echo -e "${GREEN}✅ Bucket Name 已配置: $R2_BUCKET_NAME${NC}"
fi

# Public URL
if [ -z "$R2_PUBLIC_URL" ] || [ "$R2_PUBLIC_URL" = "https://your-bucket.r2.dev" ]; then
    read -p "R2 Public URL (可选，格式: https://pub-xxxxx.r2.dev): " public_url
    if [ ! -z "$public_url" ]; then
        if grep -q "R2_PUBLIC_URL=" "$ENV_FILE"; then
            sed -i.bak "s|R2_PUBLIC_URL=.*|R2_PUBLIC_URL=$public_url|" "$ENV_FILE"
        else
            echo "R2_PUBLIC_URL=$public_url" >> "$ENV_FILE"
        fi
        echo -e "${GREEN}✅ Public URL 已保存${NC}"
    fi
else
    echo -e "${GREEN}✅ Public URL 已配置${NC}"
fi

# Endpoint
if [ -z "$R2_ENDPOINT" ] || [ "$R2_ENDPOINT" = "https://your-account-id.r2.cloudflarestorage.com" ]; then
    if [ ! -z "$account_id" ] || [ ! -z "$R2_ACCOUNT_ID" ]; then
        acc_id=${account_id:-$R2_ACCOUNT_ID}
        endpoint="https://${acc_id}.r2.cloudflarestorage.com"
        if grep -q "R2_ENDPOINT=" "$ENV_FILE"; then
            sed -i.bak "s|R2_ENDPOINT=.*|R2_ENDPOINT=$endpoint|" "$ENV_FILE"
        else
            echo "R2_ENDPOINT=$endpoint" >> "$ENV_FILE"
        fi
        echo -e "${GREEN}✅ Endpoint 已自动生成: $endpoint${NC}"
    fi
else
    echo -e "${GREEN}✅ Endpoint 已配置${NC}"
fi

# 清理备份文件
rm -f "$ENV_FILE.bak"

echo ""
echo -e "${GREEN}✅ 配置完成！${NC}"
echo ""
echo "📝 下一步："
echo "1. 重启开发服务器: npm run dev"
echo "2. 测试上传功能: ./scripts/test-r2-upload.sh"
echo "3. 或访问: http://localhost:3000/api/upload"
echo ""
