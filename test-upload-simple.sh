#!/bin/bash
echo "🧪 测试 R2 文件上传"
echo "=================="
echo ""

# 检查服务器
if ! curl -s http://localhost:3000 > /dev/null; then
    echo "❌ 开发服务器未运行"
    echo "   请先运行: npm run dev"
    exit 1
fi

echo "✅ 开发服务器正在运行"
echo ""

# 创建测试文件
if [ ! -f test-upload.jpg ]; then
    echo "创建测试图片..."
    # 创建一个 1x1 像素的 PNG 图片
    python3 -c "
import base64
data = base64.b64decode('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==')
with open('test-upload.jpg', 'wb') as f:
    f.write(data)
" 2>/dev/null || echo "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==" | base64 -d > test-upload.jpg 2>/dev/null || {
        echo "⚠️  无法创建测试文件，使用 curl 测试 API 端点"
        RESPONSE=$(curl -s -X POST http://localhost:3000/api/upload -F "file=@/dev/null" -F "folder=test")
        echo "响应: $RESPONSE"
        exit 0
    }
fi

echo "📤 上传测试文件..."
RESPONSE=$(curl -s -X POST http://localhost:3000/api/upload -F "file=@test-upload.jpg" -F "folder=test")

echo ""
echo "📥 服务器响应:"
echo "$RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$RESPONSE"
echo ""

if echo "$RESPONSE" | grep -q "success\|url"; then
    echo "✅ 上传成功！"
    URL=$(echo "$RESPONSE" | grep -o '"url":"[^"]*"' | cut -d'"' -f4)
    if [ ! -z "$URL" ]; then
        echo "   文件 URL: $URL"
        echo ""
        echo "💡 在浏览器中打开 URL 查看文件"
    fi
else
    echo "❌ 上传失败"
    echo ""
    echo "可能的原因："
    echo "1. R2 配置不正确"
    echo "2. 网络连接问题"
    echo "3. 文件格式不支持"
    echo ""
    echo "检查配置: npm run verify:r2"
fi
