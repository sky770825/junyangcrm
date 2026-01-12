#!/bin/bash

# 完整测试流程：上传文件并添加到客户记录

set -e

echo "🧪 完整测试流程：文件上传 + 客户照片管理"
echo "=========================================="
echo ""

# 检查服务器
if ! curl -s http://localhost:3000 > /dev/null; then
    echo "❌ 开发服务器未运行"
    echo "   请运行: npm run dev"
    exit 1
fi

echo "✅ 开发服务器正在运行"
echo ""

# 步骤 1: 上传文件
echo "📤 步骤 1: 上传测试文件到 R2"
echo "----------------------------"

if [ ! -f test-upload.jpg ]; then
    echo "创建测试文件..."
    echo "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==" | base64 -d > test-upload.jpg
fi

RESPONSE=$(curl -s -X POST http://localhost:3000/api/upload \
  -F "file=@test-upload.jpg" \
  -F "folder=test")

echo "响应:"
echo "$RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$RESPONSE"
echo ""

if ! echo "$RESPONSE" | grep -q "success\|url"; then
    echo "❌ 文件上传失败"
    exit 1
fi

URL=$(echo "$RESPONSE" | grep -o '"url":"[^"]*"' | cut -d'"' -f4)
echo "✅ 文件上传成功"
echo "   文件 URL: $URL"
echo ""

# 步骤 2: 获取客户列表
echo "📋 步骤 2: 获取客户列表"
echo "----------------------"

CLIENTS_RESPONSE=$(curl -s http://localhost:3000/api/clients)
CLIENT_COUNT=$(echo "$CLIENTS_RESPONSE" | python3 -c "import sys, json; data=json.load(sys.stdin); print(len(data) if isinstance(data, list) else 0)" 2>/dev/null || echo "0")

echo "找到 $CLIENT_COUNT 个客户"
echo ""

if [ "$CLIENT_COUNT" -eq "0" ]; then
    echo "⚠️  没有客户数据，无法测试添加到客户记录"
    echo "   请先在管理后台创建客户或上传 Excel"
    exit 0
fi

# 获取第一个客户 ID
FIRST_CLIENT_ID=$(echo "$CLIENTS_RESPONSE" | python3 -c "import sys, json; data=json.load(sys.stdin); print(data[0]['id'] if isinstance(data, list) and len(data) > 0 else '')" 2>/dev/null || echo "")

if [ -z "$FIRST_CLIENT_ID" ]; then
    echo "⚠️  无法获取客户 ID"
    exit 1
fi

echo "使用客户 ID: $FIRST_CLIENT_ID"
echo ""

# 步骤 3: 添加照片到客户记录
echo "📸 步骤 3: 添加照片到客户记录"
echo "----------------------------"

ADD_PHOTO_RESPONSE=$(curl -s -X POST "http://localhost:3000/api/clients/$FIRST_CLIENT_ID/files" \
  -H "Content-Type: application/json" \
  -d "{\"url\": \"$URL\", \"type\": \"photo\"}")

echo "响应:"
echo "$ADD_PHOTO_RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$ADD_PHOTO_RESPONSE"
echo ""

if echo "$ADD_PHOTO_RESPONSE" | grep -q "photos\|id"; then
    echo "✅ 照片已添加到客户记录"
    PHOTO_COUNT=$(echo "$ADD_PHOTO_RESPONSE" | python3 -c "import sys, json; data=json.load(sys.stdin); photos=data.get('photos', []); print(len(photos) if isinstance(photos, list) else 0)" 2>/dev/null || echo "0")
    echo "   客户现在有 $PHOTO_COUNT 张照片"
else
    echo "❌ 添加照片到客户记录失败"
    exit 1
fi

echo ""
echo "✅ 所有测试完成！"
echo ""
echo "💡 下一步："
echo "   1. 访问管理后台: http://localhost:3000/admin"
echo "   2. 点击客户的'编辑'按钮"
echo "   3. 查看'客户照片'部分，应该能看到上传的照片"
