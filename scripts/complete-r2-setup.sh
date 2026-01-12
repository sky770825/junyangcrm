#!/bin/bash

# 完成 R2 配置（使用已提供的 Access Key ID）

set -e

ENV_FILE=".env.local"
ACCESS_KEY_ID="j1qkUj6Gh4h3TaOkPe_2YXgxhgL2YRoXHmz063hs"

echo "🔧 完成 Cloudflare R2 配置"
echo "========================"
echo ""
echo "已设置 Access Key ID: $ACCESS_KEY_ID"
echo ""

# 确保 .env.local 存在
if [ ! -f "$ENV_FILE" ]; then
    if [ -f "env.example" ]; then
        cp env.example "$ENV_FILE"
    else
        touch "$ENV_FILE"
    fi
fi

# 更新 Access Key ID
if grep -q "R2_ACCESS_KEY_ID=" "$ENV_FILE"; then
    sed -i.bak "s|R2_ACCESS_KEY_ID=.*|R2_ACCESS_KEY_ID=$ACCESS_KEY_ID|" "$ENV_FILE" 2>/dev/null || \
    sed -i '' "s|R2_ACCESS_KEY_ID=.*|R2_ACCESS_KEY_ID=$ACCESS_KEY_ID|" "$ENV_FILE"
else
    echo "R2_ACCESS_KEY_ID=$ACCESS_KEY_ID" >> "$ENV_FILE"
fi

echo "✅ Access Key ID 已确认"
echo ""

# 检查还需要什么
source "$ENV_FILE" 2>/dev/null || true

echo "📋 还需要配置以下信息："
echo ""

NEEDED=0

if [ -z "$R2_ACCOUNT_ID" ] || [[ "$R2_ACCOUNT_ID" == *"your-"* ]] || [[ "$R2_ACCOUNT_ID" == *"xxxxx"* ]]; then
    echo "❌ R2 Account ID - 未配置"
    echo "   在 Cloudflare Dashboard 右侧边栏找到 Account ID"
    NEEDED=1
else
    echo "✅ R2 Account ID: $R2_ACCOUNT_ID"
fi

if [ -z "$R2_SECRET_ACCESS_KEY" ] || [[ "$R2_SECRET_ACCESS_KEY" == *"your-"* ]] || [[ "$R2_SECRET_ACCESS_KEY" == *"xxxxx"* ]]; then
    echo "❌ R2 Secret Access Key - 未配置"
    echo "   在创建 API Token 时显示的 Secret Access Key（只显示一次）"
    NEEDED=1
else
    echo "✅ R2 Secret Access Key: 已配置"
fi

if [ -z "$R2_BUCKET_NAME" ] || [[ "$R2_BUCKET_NAME" == *"your-"* ]] || [[ "$R2_BUCKET_NAME" == *"xxxxx"* ]]; then
    echo "❌ R2 Bucket Name - 未配置"
    echo "   您创建的 R2 Bucket 名称"
    NEEDED=1
else
    echo "✅ R2 Bucket Name: $R2_BUCKET_NAME"
fi

if [ -z "$R2_PUBLIC_URL" ] || [[ "$R2_PUBLIC_URL" == *"your-bucket"* ]] || [[ "$R2_PUBLIC_URL" == *"xxxxx"* ]]; then
    echo "⚠️  R2 Public URL - 未配置（可选）"
    echo "   如果启用了 Public Access，格式: https://pub-xxxxx.r2.dev"
else
    echo "✅ R2 Public URL: $R2_PUBLIC_URL"
fi

echo ""

if [ $NEEDED -eq 0 ]; then
    echo "🎉 所有必需配置已完成！"
    echo ""
    echo "下一步："
    echo "1. 验证配置: npm run verify:r2"
    echo "2. 重启开发服务器: npm run dev"
    echo "3. 测试上传: npm run test:r2"
else
    echo "💡 继续配置："
    echo "   运行: npm run setup:r2"
    echo "   或编辑: .env.local"
fi

# 清理备份
rm -f "$ENV_FILE.bak" 2>/dev/null || true
