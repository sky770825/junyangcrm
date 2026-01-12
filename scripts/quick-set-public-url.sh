#!/bin/bash

# 快速设置 Public URL（非交互式）

set -e

ENV_FILE=".env.local"

echo "🌐 配置 R2 Public URL"
echo "===================="
echo ""

if [ -z "$1" ]; then
    echo "用法: ./scripts/quick-set-public-url.sh <public-url>"
    echo ""
    echo "示例:"
    echo "  ./scripts/quick-set-public-url.sh https://pub-xxxxx.r2.dev"
    echo ""
    echo "💡 如何获取 Public URL："
    echo "1. 访问: https://dash.cloudflare.com/82ebeb1d91888e83e8e1b30eeb33d3c3/r2/buckets/junyangcrm-files"
    echo "2. 点击 'Settings' 标签"
    echo "3. 在 'Public Access' 部分点击 'Allow Access'"
    echo "4. 复制显示的 Public URL"
    echo ""
    exit 1
fi

PUBLIC_URL="$1"

# 验证 URL 格式
if [[ ! "$PUBLIC_URL" =~ ^https://.*\.r2\.dev$ ]]; then
    echo "❌ 错误: URL 格式不正确"
    echo "   应该是: https://pub-xxxxx.r2.dev 或 https://xxxxx.r2.dev"
    exit 1
fi

# 检查 .env.local
if [ ! -f "$ENV_FILE" ]; then
    echo "❌ 错误: .env.local 文件不存在"
    exit 1
fi

# 更新 Public URL
if grep -q "R2_PUBLIC_URL=" "$ENV_FILE"; then
    sed -i.bak "s|R2_PUBLIC_URL=.*|R2_PUBLIC_URL=$PUBLIC_URL|" "$ENV_FILE" 2>/dev/null || \
    sed -i '' "s|R2_PUBLIC_URL=.*|R2_PUBLIC_URL=$PUBLIC_URL|" "$ENV_FILE"
else
    echo "R2_PUBLIC_URL=$PUBLIC_URL" >> "$ENV_FILE"
fi

# 清理备份
rm -f "$ENV_FILE.bak" 2>/dev/null || true

echo "✅ Public URL 已设置: $PUBLIC_URL"
echo ""
echo "📝 当前配置："
grep "^R2_" "$ENV_FILE" | grep -v "SECRET" | grep -v "ACCESS_KEY" | sed 's/=.*/=***/' || true
echo ""
echo "✅ 配置完成！"
echo ""
echo "下一步："
echo "1. 验证配置: npm run verify:r2"
echo "2. 重启开发服务器: npm run dev"
echo "3. 测试上传: npm run test:r2"
