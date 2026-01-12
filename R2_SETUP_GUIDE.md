# Cloudflare R2 配置完整指南

## 第一步：在 Cloudflare Dashboard 创建 R2 Bucket

### 1.1 登录 Cloudflare Dashboard
访问：https://dash.cloudflare.com

### 1.2 创建 R2 Bucket
1. 在左侧菜单找到 **R2**（如果没有，可能需要升级计划）
2. 点击 **Create bucket**
3. 输入 Bucket 名称（例如：`junyangcrm-files`）
4. 选择位置（建议选择离您最近的区域）
5. 点击 **Create bucket**

### 1.3 创建 API Token
1. 在 R2 页面，点击右上角的 **Manage R2 API Tokens**
2. 点击 **Create API token**
3. 配置：
   - **Token name**: `junyangcrm-upload-token`
   - **Permissions**: 选择 **Object Read & Write**
   - **TTL**: 留空（永久有效）或设置过期时间
   - **Bucket access**: 选择您刚创建的 bucket
4. 点击 **Create API Token**
5. **重要**：复制并保存以下信息（只显示一次）：
   - Access Key ID
   - Secret Access Key

### 1.4 获取 Account ID
1. 在 Cloudflare Dashboard 右侧边栏找到 **Account ID**
2. 复制 Account ID

### 1.5 配置 Public Access（可选）
如果需要公开访问文件：
1. 进入您的 Bucket
2. 点击 **Settings**
3. 在 **Public Access** 部分，点击 **Allow Access**
4. 复制 **Public URL**（格式：`https://pub-xxxxx.r2.dev`）

## 第二步：配置环境变量

### 2.1 创建或编辑 `.env.local` 文件

在项目根目录创建 `.env.local` 文件（如果不存在），添加以下配置：

```env
# Cloudflare R2 配置
R2_ACCOUNT_ID=your-account-id-here
R2_ACCESS_KEY_ID=your-access-key-id-here
R2_SECRET_ACCESS_KEY=your-secret-access-key-here
R2_BUCKET_NAME=junyangcrm-files
R2_PUBLIC_URL=https://pub-xxxxx.r2.dev
R2_ENDPOINT=https://your-account-id.r2.cloudflarestorage.com
```

### 2.2 替换占位符
- `your-account-id-here` → 您的 Cloudflare Account ID
- `your-access-key-id-here` → 从步骤 1.3 获取的 Access Key ID
- `your-secret-access-key-here` → 从步骤 1.3 获取的 Secret Access Key
- `junyangcrm-files` → 您的 Bucket 名称
- `https://pub-xxxxx.r2.dev` → 您的 Public URL（如果启用了公开访问）
- `https://your-account-id.r2.cloudflarestorage.com` → 将 `your-account-id` 替换为您的 Account ID

## 第三步：验证配置

### 3.1 测试上传功能

创建一个测试脚本：

```bash
# 测试上传
curl -X POST http://localhost:3000/api/upload \
  -F "file=@test-image.jpg" \
  -F "folder=test"
```

### 3.2 检查文件是否上传成功

1. 在 Cloudflare Dashboard 进入您的 R2 Bucket
2. 查看文件列表，应该能看到上传的文件

## 第四步：更新数据库 Schema（可选）

如果需要将文件 URL 存储到客户记录中，可以添加字段：

```sql
-- 在 clients 表中添加文件字段
ALTER TABLE clients 
ADD COLUMN IF NOT EXISTS photos TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN IF NOT EXISTS videos TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN IF NOT EXISTS documents TEXT[] DEFAULT ARRAY[]::TEXT[];
```

## 第五步：在应用中使用

### 5.1 在客户编辑表单中添加文件上传

```tsx
import FileUpload from '@/app/components/FileUpload'

<FileUpload
  onUploadSuccess={(url, key) => {
    // 保存到数据库
    console.log('文件 URL:', url)
  }}
  folder="clients"
  accept="image/*,video/*"
  maxSize={100}
/>
```

## 常见问题

### Q1: R2 是免费的吗？
A: R2 有免费额度：
- 存储：每月前 10GB 免费
- 操作：每月前 1000 万次 Class A 操作免费
- 出口流量：完全免费（这是 R2 的主要优势）

### Q2: 如何设置文件访问权限？
A: 
- **私有访问**：默认所有文件都是私有的，需要通过 API 访问
- **公开访问**：在 Bucket Settings 中启用 Public Access，然后使用 Public URL

### Q3: 文件大小限制是多少？
A: R2 支持单个文件最大 5TB，但建议：
- 图片：< 10MB
- 视频：< 100MB（可以更大，但上传时间会较长）

### Q4: 如何删除文件？
A: 使用 DELETE API：
```bash
DELETE /api/upload/[key]
```

### Q5: 如何批量上传？
A: 可以循环调用上传 API，或使用前端组件支持多文件选择。

## 安全建议

1. **保护 API Token**：
   - 永远不要将 Secret Access Key 提交到 Git
   - 使用环境变量存储敏感信息
   - 定期轮换 API Token

2. **文件验证**：
   - 验证文件类型
   - 限制文件大小
   - 扫描恶意文件（可选）

3. **访问控制**：
   - 使用私有 Bucket（默认）
   - 通过应用服务器控制访问
   - 实现用户权限验证

## 下一步

配置完成后，您可以：
1. 在客户管理页面添加照片上传功能
2. 创建文件管理界面
3. 实现文件预览功能
4. 添加批量上传功能
