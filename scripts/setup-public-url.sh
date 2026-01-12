#!/bin/bash

# 配置 R2 Public URL 的辅助脚本

set -e

ENV_FILE=".env.local"

echo "🌐 Cloudflare R2 Public URL 配置助手"
echo "===================================="
echo ""
echo "此脚本将帮助您配置 R2 Public URL，以便公开访问文件。"
echo ""

# 检查 .env.local
if [ ! -f "$ENV_FILE" ]; then
    echo "❌ 错误: .env.local 文件不存在"
    echo "   请先完成基本 R2 配置"
    exit 1
fi

source "$ENV_FILE" 2>/dev/null || true

# 检查 Bucket Name
if [ -z "$R2_BUCKET_NAME" ]; then
    echo "❌ 错误: R2_BUCKET_NAME 未配置"
    exit 1
fi

echo "📋 当前配置："
echo "   Bucket Name: $R2_BUCKET_NAME"
echo ""

echo "📝 配置步骤："
echo ""
echo "1. 打开 Cloudflare Dashboard:"
echo "   https://dash.cloudflare.com"
echo ""
echo "2. 进入 R2 页面（左侧菜单）"
echo ""
echo "3. 点击您的 Bucket: $R2_BUCKET_NAME"
echo ""
echo "4. 点击 'Settings' 标签"
echo ""
echo "5. 在 'Public Access' 部分："
echo "   - 如果显示 'Allow Access' 按钮，点击它"
echo "   - 如果已经启用，会显示 Public URL"
echo ""
echo "6. 复制 Public URL（格式: https://pub-xxxxx.r2.dev）"
echo ""

read -p "请输入 Public URL（或按 Enter 跳过）: " public_url

if [ ! -z "$public_url" ]; then
    # 验证 URL 格式
    if [[ "$public_url" =~ ^https://pub-.*\.r2\.dev$ ]] || [[ "$public_url" =~ ^https://.*\.r2\.dev$ ]]; then
        # 更新 .env.local
        if grep -q "R2_PUBLIC_URL=" "$ENV_FILE"; then
            sed -i.bak "s|R2_PUBLIC_URL=.*|R2_PUBLIC_URL=$public_url|" "$ENV_FILE" 2>/dev/null || \
            sed -i '' "s|R2_PUBLIC_URL=.*|R2_PUBLIC_URL=$public_url|" "$ENV_FILE"
        else
            echo "R2_PUBLIC_URL=$public_url" >> "$ENV_FILE"
        fi
        
        # 清理备份
        rm -f "$ENV_FILE.bak" 2>/dev/null || true
        
        echo ""
        echo "✅ Public URL 已设置: $public_url"
        echo ""
        echo "💡 提示："
        echo "   - 现在文件上传后会返回公开访问的 URL"
        echo "   - 如果不需要公开访问，可以不设置 Public URL"
        echo "   - 未设置 Public URL 时，文件只能通过 API 访问"
        echo ""
    else
        echo ""
        echo "⚠️  URL 格式不正确，应该是: https://pub-xxxxx.r2.dev"
        echo "   请检查后重试"
        exit 1
    fi
else
    echo ""
    echo "ℹ️  已跳过 Public URL 配置"
    echo ""
    echo "💡 说明："
    echo "   - 不设置 Public URL 时，文件默认是私有的"
    echo "   - 文件只能通过您的应用 API 访问"
    echo "   - 如果需要公开访问文件，稍后可以运行此脚本再次配置"
    echo ""
fi

echo "✅ 配置完成！"
echo ""
echo "下一步："
echo "1. 重启开发服务器: npm run dev"
echo "2. 测试上传: npm run test:r2"
