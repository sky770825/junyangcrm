#!/bin/bash

# 更新 R2 配置

set -e

ENV_FILE=".env.local"
ACCOUNT_ID="82ebeb1d91888e83e8e1b30eeb33d3c3"
SECRET_KEY="-r4iBSVKcUDrBLs8ZIQZAn1taQ5Z5TC19veEWr8h"
ACCESS_KEY_ID="j1qkUj6Gh4h3TaOkPe_2YXgxhgL2YRoXHmz063hs"

echo "🔧 更新 Cloudflare R2 配置"
echo "========================"
echo ""

# 确保 .env.local 存在
if [ ! -f "$ENV_FILE" ]; then
    if [ -f "env.example" ]; then
        cp env.example "$ENV_FILE"
    else
        touch "$ENV_FILE"
    fi
fi

# 更新 Account ID
if grep -q "R2_ACCOUNT_ID=" "$ENV_FILE"; then
    sed -i.bak "s|R2_ACCOUNT_ID=.*|R2_ACCOUNT_ID=$ACCOUNT_ID|" "$ENV_FILE" 2>/dev/null || \
    sed -i '' "s|R2_ACCOUNT_ID=.*|R2_ACCOUNT_ID=$ACCOUNT_ID|" "$ENV_FILE"
else
    echo "R2_ACCOUNT_ID=$ACCOUNT_ID" >> "$ENV_FILE"
fi
echo "✅ Account ID 已设置: $ACCOUNT_ID"

# 更新 Access Key ID
if grep -q "R2_ACCESS_KEY_ID=" "$ENV_FILE"; then
    sed -i.bak "s|R2_ACCESS_KEY_ID=.*|R2_ACCESS_KEY_ID=$ACCESS_KEY_ID|" "$ENV_FILE" 2>/dev/null || \
    sed -i '' "s|R2_ACCESS_KEY_ID=.*|R2_ACCESS_KEY_ID=$ACCESS_KEY_ID|" "$ENV_FILE"
else
    echo "R2_ACCESS_KEY_ID=$ACCESS_KEY_ID" >> "$ENV_FILE"
fi
echo "✅ Access Key ID 已设置"

# 更新 Secret Access Key
if grep -q "R2_SECRET_ACCESS_KEY=" "$ENV_FILE"; then
    sed -i.bak "s|R2_SECRET_ACCESS_KEY=.*|R2_SECRET_ACCESS_KEY=$SECRET_KEY|" "$ENV_FILE" 2>/dev/null || \
    sed -i '' "s|R2_SECRET_ACCESS_KEY=.*|R2_SECRET_ACCESS_KEY=$SECRET_KEY|" "$ENV_FILE"
else
    echo "R2_SECRET_ACCESS_KEY=$SECRET_KEY" >> "$ENV_FILE"
fi
echo "✅ Secret Access Key 已设置"

# 自动生成 Endpoint
ENDPOINT="https://${ACCOUNT_ID}.r2.cloudflarestorage.com"
if grep -q "R2_ENDPOINT=" "$ENV_FILE"; then
    sed -i.bak "s|R2_ENDPOINT=.*|R2_ENDPOINT=$ENDPOINT|" "$ENV_FILE" 2>/dev/null || \
    sed -i '' "s|R2_ENDPOINT=.*|R2_ENDPOINT=$ENDPOINT|" "$ENV_FILE"
else
    echo "R2_ENDPOINT=$ENDPOINT" >> "$ENV_FILE"
fi
echo "✅ Endpoint 已自动生成: $ENDPOINT"

# 清理备份文件
rm -f "$ENV_FILE.bak" 2>/dev/null || true

echo ""
echo "📋 还需要配置："
echo ""

# 检查 Bucket Name
if grep -q "R2_BUCKET_NAME=" "$ENV_FILE"; then
    source "$ENV_FILE" 2>/dev/null || true
    if [ -z "$R2_BUCKET_NAME" ] || [[ "$R2_BUCKET_NAME" == *"your-"* ]] || [[ "$R2_BUCKET_NAME" == *"xxxxx"* ]]; then
        echo "❌ R2 Bucket Name - 未配置"
        echo "   请输入您的 R2 Bucket 名称（例如: junyangcrm-files）"
        read -p "R2 Bucket Name: " bucket_name
        if [ ! -z "$bucket_name" ]; then
            sed -i.bak "s|R2_BUCKET_NAME=.*|R2_BUCKET_NAME=$bucket_name|" "$ENV_FILE" 2>/dev/null || \
            sed -i '' "s|R2_BUCKET_NAME=.*|R2_BUCKET_NAME=$bucket_name|" "$ENV_FILE"
            echo "✅ Bucket Name 已设置: $bucket_name"
        fi
    else
        echo "✅ Bucket Name: $R2_BUCKET_NAME"
    fi
else
    echo "❌ R2 Bucket Name - 未配置"
    echo "   请输入您的 R2 Bucket 名称（例如: junyangcrm-files）"
    read -p "R2 Bucket Name: " bucket_name
    bucket_name=${bucket_name:-junyangcrm-files}
    echo "R2_BUCKET_NAME=$bucket_name" >> "$ENV_FILE"
    echo "✅ Bucket Name 已设置: $bucket_name"
fi

# 清理备份
rm -f "$ENV_FILE.bak" 2>/dev/null || true

echo ""
echo "✅ 核心配置已完成！"
echo ""
echo "📝 当前配置状态："
echo "   ✅ Account ID: $ACCOUNT_ID"
echo "   ✅ Access Key ID: 已设置"
echo "   ✅ Secret Access Key: 已设置"
echo "   ✅ Endpoint: $ENDPOINT"
if [ ! -z "$bucket_name" ] || [ ! -z "$R2_BUCKET_NAME" ]; then
    echo "   ✅ Bucket Name: ${bucket_name:-$R2_BUCKET_NAME}"
fi
echo ""
echo "💡 可选配置："
echo "   - R2 Public URL（如果启用了 Public Access）"
echo ""
echo "下一步："
echo "1. 验证配置: npm run verify:r2"
echo "2. 重启开发服务器: npm run dev"
echo "3. 测试上传: npm run test:r2"
