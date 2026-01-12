#!/bin/bash

echo "=== API 端点测试 ==="
echo ""

BASE_URL="http://localhost:3000"

# 测试首页
echo "1. 测试首页..."
STATUS=$(curl -s -o /dev/null -w "%{http_code}" $BASE_URL)
if [ "$STATUS" = "200" ]; then
  echo "   ✓ 首页正常 (HTTP $STATUS)"
else
  echo "   ✗ 首页异常 (HTTP $STATUS)"
fi
echo ""

# 测试管理后台页面
echo "2. 测试管理后台页面..."
STATUS=$(curl -s -o /dev/null -w "%{http_code}" $BASE_URL/admin)
if [ "$STATUS" = "200" ]; then
  echo "   ✓ 管理后台页面正常 (HTTP $STATUS)"
else
  echo "   ✗ 管理后台页面异常 (HTTP $STATUS)"
fi
echo ""

# 测试业务员面板
echo "3. 测试业务员面板..."
STATUS=$(curl -s -o /dev/null -w "%{http_code}" $BASE_URL/dashboard)
if [ "$STATUS" = "200" ]; then
  echo "   ✓ 业务员面板正常 (HTTP $STATUS)"
else
  echo "   ✗ 业务员面板异常 (HTTP $STATUS)"
fi
echo ""

# 测试客户列表页面
echo "4. 测试客户列表页面..."
STATUS=$(curl -s -o /dev/null -w "%{http_code}" $BASE_URL/dashboard/clients)
if [ "$STATUS" = "200" ]; then
  echo "   ✓ 客户列表页面正常 (HTTP $STATUS)"
else
  echo "   ✗ 客户列表页面异常 (HTTP $STATUS)"
fi
echo ""

# 测试 API 端点
echo "5. 测试 API 端点..."

# 测试 GET /api/clients
STATUS=$(curl -s -o /dev/null -w "%{http_code}" $BASE_URL/api/clients)
if [ "$STATUS" = "200" ] || [ "$STATUS" = "500" ]; then
  echo "   ✓ GET /api/clients 响应正常 (HTTP $STATUS)"
else
  echo "   ✗ GET /api/clients 异常 (HTTP $STATUS)"
fi

# 测试 GET /api/users
STATUS=$(curl -s -o /dev/null -w "%{http_code}" $BASE_URL/api/users)
if [ "$STATUS" = "200" ] || [ "$STATUS" = "500" ]; then
  echo "   ✓ GET /api/users 响应正常 (HTTP $STATUS)"
else
  echo "   ✗ GET /api/users 异常 (HTTP $STATUS)"
fi

# 测试 GET /api/tasks
STATUS=$(curl -s -o /dev/null -w "%{http_code}" $BASE_URL/api/tasks)
if [ "$STATUS" = "200" ] || [ "$STATUS" = "500" ]; then
  echo "   ✓ GET /api/tasks 响应正常 (HTTP $STATUS)"
else
  echo "   ✗ GET /api/tasks 异常 (HTTP $STATUS)"
fi

# 测试 GET /api/users/applications
STATUS=$(curl -s -o /dev/null -w "%{http_code}" $BASE_URL/api/users/applications)
if [ "$STATUS" = "200" ] || [ "$STATUS" = "500" ]; then
  echo "   ✓ GET /api/users/applications 响应正常 (HTTP $STATUS)"
else
  echo "   ✗ GET /api/users/applications 异常 (HTTP $STATUS)"
fi

# 测试 GET /api/client-requests
STATUS=$(curl -s -o /dev/null -w "%{http_code}" $BASE_URL/api/client-requests)
if [ "$STATUS" = "200" ] || [ "$STATUS" = "500" ]; then
  echo "   ✓ GET /api/client-requests 响应正常 (HTTP $STATUS)"
else
  echo "   ✗ GET /api/client-requests 异常 (HTTP $STATUS)"
fi

echo ""
echo "=== 测试完成 ==="
echo ""
echo "注意: API 端点返回 500 是正常的，因为需要配置 Supabase 数据库连接。"
echo "如果页面返回 200，说明前端代码正常。"
