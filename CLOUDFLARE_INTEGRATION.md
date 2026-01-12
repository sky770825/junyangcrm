# Cloudflare 集成方案

## Cloudflare 服务说明

### 1. Cloudflare Workers
- **用途**: 运行边缘计算代码（类似 API 服务器）
- **不适合**: 直接存储文件或数据库
- **适合**: API 路由、业务逻辑处理

### 2. Cloudflare R2 (推荐用于文件存储)
- **用途**: 对象存储服务（类似 AWS S3）
- **适合**: 存储照片、影片、文档等文件
- **优势**: 
  - 无出口费用（免费）
  - 与 Workers 集成简单
  - 全球 CDN 加速

### 3. Cloudflare D1 (数据库)
- **用途**: SQLite 数据库（边缘数据库）
- **限制**: 功能相对简单，不如 Supabase 强大
- **建议**: 继续使用 Supabase（功能更完整）

## 推荐方案

### 方案一：混合方案（推荐）
- **数据库**: 继续使用 Supabase（PostgreSQL，功能完整）
- **文件存储**: 使用 Cloudflare R2（照片、影片）
- **API**: 可以部署到 Cloudflare Workers（可选）

### 方案二：全 Cloudflare
- **数据库**: Cloudflare D1（需要迁移数据）
- **文件存储**: Cloudflare R2
- **API**: Cloudflare Workers

## 集成步骤

### 1. 设置 Cloudflare R2

1. 在 Cloudflare Dashboard 创建 R2 Bucket
2. 获取 API Token
3. 配置环境变量

### 2. 安装依赖

```bash
npm install @aws-sdk/client-s3
```

### 3. 配置环境变量

```env
# Cloudflare R2
R2_ACCOUNT_ID=your-account-id
R2_ACCESS_KEY_ID=your-access-key
R2_SECRET_ACCESS_KEY=your-secret-key
R2_BUCKET_NAME=your-bucket-name
R2_PUBLIC_URL=https://your-bucket.r2.dev
```

### 4. 创建 R2 客户端

```typescript
// app/lib/r2/client.ts
import { S3Client } from '@aws-sdk/client-s3'

export const r2Client = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
})
```

### 5. 上传文件 API

```typescript
// app/api/upload/route.ts
import { PutObjectCommand } from '@aws-sdk/client-s3'
import { r2Client } from '@/app/lib/r2/client'

export async function POST(request: Request) {
  const formData = await request.formData()
  const file = formData.get('file') as File
  
  // 上传到 R2
  const key = `uploads/${Date.now()}-${file.name}`
  await r2Client.send(new PutObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME!,
    Key: key,
    Body: Buffer.from(await file.arrayBuffer()),
    ContentType: file.type,
  }))
  
  const url = `${process.env.R2_PUBLIC_URL}/${key}`
  return Response.json({ url })
}
```

## 数据库迁移考虑

### Supabase vs Cloudflare D1

| 特性 | Supabase | Cloudflare D1 |
|------|----------|---------------|
| 数据库类型 | PostgreSQL | SQLite |
| 功能完整性 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| 实时功能 | ✅ | ❌ |
| 身份验证 | ✅ | ❌ |
| 存储 | ✅ | ❌ |
| 边缘计算 | ❌ | ✅ |
| 成本 | 免费额度 | 免费额度 |

**建议**: 继续使用 Supabase，因为：
1. 功能更完整（PostgreSQL）
2. 已有完整的身份验证系统
3. 支持实时更新
4. 集成简单

## 实施建议

### 阶段一：文件存储迁移到 R2
1. 设置 R2 Bucket
2. 创建文件上传 API
3. 更新客户资料，支持上传照片
4. 迁移现有文件（如果有）

### 阶段二：可选 - API 部署到 Workers
1. 将 Next.js API 路由转换为 Workers
2. 部署到 Cloudflare Workers
3. 配置域名和路由

### 阶段三：保持 Supabase 数据库
- 继续使用 Supabase 作为主数据库
- 利用其强大的功能和生态系统

## 成本对比

### Cloudflare R2
- 存储: $0.015/GB/月
- 操作: 免费（前 1000 万次/月）
- 出口流量: 免费

### Supabase
- 数据库: 免费额度 500MB
- 存储: 免费额度 1GB
- 超出后按使用量计费

## 总结

**推荐方案**:
- ✅ **文件存储**: Cloudflare R2（照片、影片）
- ✅ **数据库**: Supabase（继续使用）
- ⚠️ **API**: 可以部署到 Workers（可选，当前 Next.js 已足够）

这样可以：
1. 利用 R2 的免费出口流量存储大文件
2. 保持 Supabase 的强大数据库功能
3. 无需大规模重构现有代码
