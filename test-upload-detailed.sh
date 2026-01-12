#!/bin/bash
echo "🧪 R2 文件上传详细测试"
echo "===================="
echo ""

# 检查服务器
echo "1. 检查开发服务器..."
if curl -s http://localhost:3000 > /dev/null; then
    echo "   ✅ 开发服务器正在运行"
else
    echo "   ❌ 开发服务器未运行"
    echo "   请运行: npm run dev"
    exit 1
fi

# 检查测试文件
echo ""
echo "2. 检查测试文件..."
if [ -f test-upload.jpg ]; then
    SIZE=$(stat -f%z test-upload.jpg 2>/dev/null || stat -c%s test-upload.jpg 2>/dev/null)
    echo "   ✅ 测试文件存在: test-upload.jpg ($SIZE bytes)"
else
    echo "   ❌ 测试文件不存在"
    exit 1
fi

# 测试上传
echo ""
echo "3. 测试文件上传..."
echo "   上传到: http://localhost:3000/api/upload"
echo ""

RESPONSE=$(curl -s -w "\n%{http_code}" -X POST http://localhost:3000/api/upload \
  -F "file=@test-upload.jpg" \
  -F "folder=test")

HTTP_CODE=$(echo "$RESPONSE" | tail -1)
BODY=$(echo "$RESPONSE" | sed '$d')

echo "   HTTP 状态码: $HTTP_CODE"
echo ""
echo "   响应内容:"
echo "$BODY" | python3 -m json.tool 2>/dev/null || echo "$BODY"
echo ""

if [ "$HTTP_CODE" = "200" ]; then
    if echo "$BODY" | grep -q "success"; then
        URL=$(echo "$BODY" | grep -o '"url":"[^"]*"' | cut -d'"' -f4)
        echo "   ✅ 上传成功！"
        echo "   文件 URL: $URL"
        echo ""
        echo "   💡 在浏览器中打开 URL 查看文件"
    else
        echo "   ⚠️  服务器返回 200，但响应中没有 success"
    fi
elif [ "$HTTP_CODE" = "404" ]; then
    echo "   ❌ 路由不存在 (404)"
    echo ""
    echo "   可能的原因："
    echo "   1. Next.js 需要重新编译路由"
    echo "   2. 请重启开发服务器: npm run dev"
    echo "   3. 检查 app/api/upload/route.ts 文件是否存在"
elif [ "$HTTP_CODE" = "500" ]; then
    echo "   ❌ 服务器错误 (500)"
    echo ""
    echo "   可能的原因："
    echo "   1. R2 配置不正确"
    echo "   2. 检查环境变量: npm run verify:r2"
    echo "   3. 查看服务器日志获取详细错误"
else
    echo "   ❌ 上传失败 (HTTP $HTTP_CODE)"
fi
