#!/bin/bash

# 快速配置 Cloudflare R2（使用提供的 Token）

set -e

echo "🚀 Cloudflare R2 快速配置"
echo "========================"
echo ""

ENV_FILE=".env.local"
TOKEN="$1"

if [ -z "$TOKEN" ]; then
    echo "用法: ./scripts/quick-setup-r2.sh <your-access-key-id>"
    echo ""
    echo "或者运行交互式配置:"
    echo "  npm run setup:r2"
    exit 1
fi

# 检查 .env.local
if [ ! -f "$ENV_FILE" ]; then
    if [ -f "env.example" ]; then
        cp env.example "$ENV_FILE"
        echo "✅ 已创建 .env.local 文件"
    else
        touch "$ENV_FILE"
        echo "✅ 已创建 .env.local 文件"
    fi
fi

echo "📝 配置 R2 Access Key ID..."
echo ""

# 更新或添加 R2_ACCESS_KEY_ID
if grep -q "R2_ACCESS_KEY_ID=" "$ENV_FILE"; then
    sed -i.bak "s|R2_ACCESS_KEY_ID=.*|R2_ACCESS_KEY_ID=$TOKEN|" "$ENV_FILE"
else
    echo "R2_ACCESS_KEY_ID=$TOKEN" >> "$ENV_FILE"
fi

echo "✅ R2_ACCESS_KEY_ID 已设置: $TOKEN"
echo ""

# 提示还需要的信息
echo "⚠️  还需要配置以下信息："
echo ""
echo "1. R2 Account ID"
echo "   - 在 Cloudflare Dashboard 右侧边栏找到 Account ID"
echo ""
echo "2. R2 Secret Access Key"
echo "   - 在创建 API Token 时显示的 Secret Access Key"
echo "   - 注意：只显示一次，请妥善保存"
echo ""
echo "3. R2 Bucket Name"
echo "   - 您创建的 R2 Bucket 名称"
echo ""
echo "4. R2 Public URL (可选)"
echo "   - 如果启用了 Public Access，格式: https://pub-xxxxx.r2.dev"
echo ""

# 询问是否继续配置其他项
read -p "是否现在配置其他项？(y/n): " continue_setup

if [ "$continue_setup" = "y" ] || [ "$continue_setup" = "Y" ]; then
    echo ""
    
    # Account ID
    read -p "R2 Account ID: " account_id
    if [ ! -z "$account_id" ]; then
        if grep -q "R2_ACCOUNT_ID=" "$ENV_FILE"; then
            sed -i.bak "s|R2_ACCOUNT_ID=.*|R2_ACCOUNT_ID=$account_id|" "$ENV_FILE"
        else
            echo "R2_ACCOUNT_ID=$account_id" >> "$ENV_FILE"
        fi
        echo "✅ Account ID 已设置"
        
        # 自动生成 Endpoint
        if ! grep -q "R2_ENDPOINT=" "$ENV_FILE" || grep -q "R2_ENDPOINT=.*your-account-id" "$ENV_FILE"; then
            endpoint="https://${account_id}.r2.cloudflarestorage.com"
            if grep -q "R2_ENDPOINT=" "$ENV_FILE"; then
                sed -i.bak "s|R2_ENDPOINT=.*|R2_ENDPOINT=$endpoint|" "$ENV_FILE"
            else
                echo "R2_ENDPOINT=$endpoint" >> "$ENV_FILE"
            fi
            echo "✅ Endpoint 已自动生成: $endpoint"
        fi
    fi
    
    # Secret Access Key
    read -sp "R2 Secret Access Key: " secret_key
    echo ""
    if [ ! -z "$secret_key" ]; then
        if grep -q "R2_SECRET_ACCESS_KEY=" "$ENV_FILE"; then
            sed -i.bak "s|R2_SECRET_ACCESS_KEY=.*|R2_SECRET_ACCESS_KEY=$secret_key|" "$ENV_FILE"
        else
            echo "R2_SECRET_ACCESS_KEY=$secret_key" >> "$ENV_FILE"
        fi
        echo "✅ Secret Access Key 已设置"
    fi
    
    # Bucket Name
    read -p "R2 Bucket Name (默认: junyangcrm-files): " bucket_name
    bucket_name=${bucket_name:-junyangcrm-files}
    if grep -q "R2_BUCKET_NAME=" "$ENV_FILE"; then
        sed -i.bak "s|R2_BUCKET_NAME=.*|R2_BUCKET_NAME=$bucket_name|" "$ENV_FILE"
    else
        echo "R2_BUCKET_NAME=$bucket_name" >> "$ENV_FILE"
    fi
    echo "✅ Bucket Name 已设置: $bucket_name"
    
    # Public URL
    read -p "R2 Public URL (可选，按 Enter 跳过): " public_url
    if [ ! -z "$public_url" ]; then
        if grep -q "R2_PUBLIC_URL=" "$ENV_FILE"; then
            sed -i.bak "s|R2_PUBLIC_URL=.*|R2_PUBLIC_URL=$public_url|" "$ENV_FILE"
        else
            echo "R2_PUBLIC_URL=$public_url" >> "$ENV_FILE"
        fi
        echo "✅ Public URL 已设置"
    fi
    
    # 清理备份文件
    rm -f "$ENV_FILE.bak"
    
    echo ""
    echo "✅ 配置完成！"
    echo ""
    echo "下一步："
    echo "1. 验证配置: npm run verify:r2"
    echo "2. 重启开发服务器: npm run dev"
    echo "3. 测试上传: npm run test:r2"
else
    echo ""
    echo "💡 提示：稍后可以运行以下命令继续配置："
    echo "  npm run setup:r2"
    echo "  或"
    echo "  ./scripts/setup-r2.sh"
fi
