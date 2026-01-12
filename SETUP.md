# 設置指南

## 1. 安裝依賴

```bash
npm install
```

## 2. 設置 Supabase

1. 創建一個 [Supabase](https://supabase.com) 帳戶和項目
2. 在 Supabase Dashboard 中，進入 SQL Editor
3. 執行 `supabase/migrations/001_initial_schema.sql` 中的 SQL 腳本
4. 在 Supabase Dashboard 中，進入 Settings > API，複製：
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - anon/public key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## 3. 設置環境變數

創建 `.env.local` 文件（參考 `env.example`）：

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

## 4. 設置測試數據（可選）

在 Supabase SQL Editor 中執行以下 SQL 來創建測試用戶和數據：

```sql
-- 創建測試用戶（Agent）
INSERT INTO users (id, email, name, role) VALUES
  ('00000000-0000-0000-0000-000000000001', 'agent@example.com', '測試代理', 'agent'),
  ('00000000-0000-0000-0000-000000000002', 'manager@example.com', '測試經理', 'manager');

-- 創建測試客戶
INSERT INTO clients (id, name, phone, tags, current_owner_id, status) VALUES
  ('10000000-0000-0000-0000-000000000001', '王小明', '0912345678', ARRAY['A-Hot'], '00000000-0000-0000-0000-000000000001', 'active'),
  ('10000000-0000-0000-0000-000000000002', '李小華', '0923456789', ARRAY['B-Warm'], '00000000-0000-0000-0000-000000000001', 'active');

-- 創建測試任務
INSERT INTO tasks (client_id, agent_id, type, due_date, status) VALUES
  ('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'Call', NOW() - INTERVAL '1 day', 'pending'),
  ('10000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 'Visit', NOW() + INTERVAL '2 days', 'pending');
```

## 5. 運行開發服務器

```bash
npm run dev
```

訪問 http://localhost:3000

## 注意事項

### 身份驗證

目前的實現使用 Supabase 的 Row Level Security (RLS)。在生產環境中，您需要：

1. 設置 Supabase Authentication
2. 實現 NextAuth 或其他身份驗證系統
3. 在 API 路由中驗證用戶身份

### 當前限制

- API 路由未實現身份驗證（需要添加中間件）
- 用戶 ID 是硬編碼的（需要在身份驗證後動態獲取）
- 需要在 API 路由中添加用戶身份驗證邏輯

### 下一步

1. 實現身份驗證系統（NextAuth + Supabase）
2. 添加中間件來保護路由
3. 實現 Manager Dashboard
4. 添加客戶管理功能
