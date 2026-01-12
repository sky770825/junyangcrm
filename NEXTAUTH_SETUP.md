# NextAuth 身份验证系统设置指南

## ✅ 已完成的功能

1. **NextAuth 配置**
   - ✅ 使用 Supabase Auth 作为身份验证提供者
   - ✅ JWT session 策略
   - ✅ 用户角色管理（agent/manager）

2. **路由保护**
   - ✅ 中间件保护 `/admin` 和 `/dashboard` 路由
   - ✅ API 路由身份验证
   - ✅ 角色权限验证

3. **用户界面**
   - ✅ 登录页面 (`/auth/signin`)
   - ✅ 登出功能
   - ✅ 用户信息显示

4. **API 集成**
   - ✅ 任务 API 使用身份验证
   - ✅ 客户 API 使用身份验证
   - ✅ 权限验证（只有任务所有者或 manager 可以完成任务）

## 📋 环境变量配置

在 `.env.local` 文件中添加以下配置：

```env
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here-generate-with-openssl-rand-base64-32

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 生成 NEXTAUTH_SECRET

```bash
openssl rand -base64 32
```

## 🔐 Supabase 设置

### 1. 启用 Supabase Auth

在 Supabase Dashboard 中：
1. 前往 **Authentication** > **Providers**
2. 确保 **Email** provider 已启用
3. 配置邮箱验证（可选）

### 2. 创建测试用户

在 Supabase Dashboard 中：
1. 前往 **Authentication** > **Users**
2. 点击 **Add user** > **Create new user**
3. 输入邮箱和密码
4. 创建用户后，在 **Database** > **users** 表中：
   - 确保 `id` 与 Supabase Auth 用户 ID 匹配
   - 设置 `role` 为 `'agent'` 或 `'manager'`

### 3. 数据库用户表同步

系统会自动处理：
- 如果用户在 Supabase Auth 中但不在 `users` 表中，登录时会自动创建
- 默认角色为 `'agent'`

## 🚀 使用流程

### 1. 用户登录

1. 访问 `/auth/signin`
2. 输入 Supabase Auth 中的邮箱和密码
3. 登录成功后重定向到 `/dashboard`

### 2. 角色权限

- **agent（业务员）**：
  - 可以访问 `/dashboard`
  - 只能看到自己的任务
  - 可以申请客户

- **manager（管理员）**：
  - 可以访问 `/admin` 和 `/dashboard`
  - 可以看到所有任务和客户
  - 可以审核申请

### 3. 登出

点击页面上的"登出"按钮，会清除 session 并重定向到首页。

## 📁 文件结构

```
app/
├── api/
│   └── auth/
│       └── [...nextauth]/
│           └── route.ts          # NextAuth API 路由
├── auth/
│   └── signin/
│       └── page.tsx               # 登录页面
├── lib/
│   ├── auth.ts                    # 身份验证工具函数
│   └── auth-config.ts             # NextAuth 配置
├── components/
│   ├── AuthButton.tsx             # 登录/登出按钮
│   └── SessionProvider.tsx        # Session Provider
middleware.ts                       # 路由保护中间件
types/
└── next-auth.d.ts                 # NextAuth 类型定义
```

## 🔧 API 路由使用身份验证

### 示例：获取当前用户

```typescript
import { getCurrentUser } from '@/app/lib/auth'

export async function GET() {
  const user = await getCurrentUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  // 使用 user.id, user.role 等
}
```

### 示例：要求特定角色

```typescript
import { requireRole } from '@/app/lib/auth'

export async function POST() {
  const user = await requireRole('manager')
  // 只有 manager 可以访问
}
```

## ⚠️ 注意事项

1. **Supabase Auth 与 users 表同步**
   - 首次登录时，如果 `users` 表中没有记录，会自动创建
   - 确保 Supabase Auth 用户 ID 与 `users.id` 匹配

2. **环境变量**
   - `NEXTAUTH_SECRET` 必须设置，用于加密 JWT
   - 生产环境使用强随机密钥

3. **Session 过期**
   - 默认 30 天
   - 可在 `auth-config.ts` 中修改 `maxAge`

4. **中间件**
   - 保护 `/admin` 和 `/dashboard` 路由
   - 未登录用户会被重定向到 `/auth/signin`

## 🐛 故障排除

### 问题：登录失败

1. 检查 Supabase Auth 中用户是否存在
2. 检查邮箱和密码是否正确
3. 查看浏览器控制台和服务器日志

### 问题：权限错误

1. 检查 `users` 表中的 `role` 字段
2. 确保 session 中包含正确的角色信息
3. 清除浏览器 cookies 并重新登录

### 问题：类型错误

1. 确保 `types/next-auth.d.ts` 文件存在
2. 重启 TypeScript 服务器
3. 运行 `npm run build` 检查类型错误

---

**下一步**：配置 Supabase Auth 并创建测试用户，然后测试登录功能。
