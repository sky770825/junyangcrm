#!/bin/bash

# Cloudflare R2 上传测试脚本

echo "=== Cloudflare R2 上传测试 ==="
echo ""

# 检查环境变量（从 .env.local 加载）
if [ -f .env.local ]; then
  source .env.local 2>/dev/null || true
fi

# 检查必要的环境变量
if [ -z "$R2_ACCOUNT_ID" ] || [ -z "$R2_ACCESS_KEY_ID" ] || [ -z "$R2_BUCKET_NAME" ]; then
  echo "❌ 错误: 请先配置环境变量"
  echo ""
  echo "请在 .env.local 文件中设置："
  echo "  R2_ACCOUNT_ID=your-account-id"
  echo "  R2_ACCESS_KEY_ID=your-access-key-id"
  echo "  R2_SECRET_ACCESS_KEY=your-secret-access-key"
  echo "  R2_BUCKET_NAME=your-bucket-name"
  echo ""
  echo "运行配置脚本: npm run setup:r2"
  exit 1
fi

echo "✅ 环境变量已配置"
echo "   Bucket: $R2_BUCKET_NAME"
echo ""

# 检查测试文件
TEST_FILE="test-upload.jpg"
if [ ! -f "$TEST_FILE" ]; then
  echo "⚠️  未找到测试文件: $TEST_FILE"
  echo "创建测试文件..."
  # 创建一个简单的测试图片（1x1 像素的 PNG，转换为 base64）
  echo "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==" | base64 -d > "$TEST_FILE" 2>/dev/null || echo "请手动创建测试文件"
fi

if [ ! -f "$TEST_FILE" ]; then
  echo "❌ 无法创建测试文件，请手动创建一个测试图片文件"
  exit 1
fi

echo "📤 开始上传测试文件..."
echo ""

# 测试上传
RESPONSE=$(curl -s -X POST http://localhost:3000/api/upload \
  -F "file=@$TEST_FILE" \
  -F "folder=test")

echo "响应:"
echo "$RESPONSE" | jq '.' 2>/dev/null || echo "$RESPONSE"
echo ""

# 检查响应
if echo "$RESPONSE" | grep -q "success"; then
  echo "✅ 上传成功！"
  URL=$(echo "$RESPONSE" | grep -o '"url":"[^"]*"' | cut -d'"' -f4)
  echo "文件 URL: $URL"
  echo ""
  echo "💡 提示: 在浏览器中打开 URL 查看文件"
else
  echo "❌ 上传失败"
  echo ""
  echo "请检查："
  echo "1. 开发服务器是否运行 (npm run dev)"
  echo "2. 环境变量是否正确配置"
  echo "3. R2 Bucket 是否已创建"
  echo "4. API Token 是否有正确的权限"
fi
