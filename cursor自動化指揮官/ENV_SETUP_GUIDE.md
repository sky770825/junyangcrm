# 🔧 環境變數設定指南

## 📍 從 Supabase Dashboard 獲取環境變數

您的 Supabase 專案：`wblcfnodlwebsssoqfaz`

### 步驟 1: 獲取 Supabase URL 和 Service Role Key

1. 前往：https://supabase.com/dashboard/project/wblcfnodlwebsssoqfaz/settings/api
2. 在 **Project URL** 區塊：
   - 複製 `Project URL` → `SUPABASE_URL`
   - 格式：`https://wblcfnodlwebsssoqfaz.supabase.co`

3. 在 **Project API keys** 區塊：
   - 找到 `service_role` key（⚠️ 注意：這是 secret key，請妥善保管）
   - 點擊眼睛圖示顯示，然後複製 → `SUPABASE_SERVICE_ROLE_KEY`

### 步驟 2: 獲取 Supabase Access Token

有兩種方式：

**方式 A: 使用 Supabase CLI（推薦）**
```bash
# 安裝 Supabase CLI（如果還沒安裝）
npm install -g supabase

# 登入並取得 token
supabase login
```

**方式 B: 從 Dashboard 手動建立**
1. 前往：https://supabase.com/dashboard/account/tokens
2. 建立新的 Access Token
3. 複製 token → `SUPABASE_ACCESS_TOKEN`

### 步驟 3: 獲取 Project Ref 和 Database Password

**Project Ref:**
- 就是您的專案 ID：`wblcfnodlwebsssoqfaz`
- 用於 `SUPABASE_PROJECT_REF_STAGING` 和 `SUPABASE_PROJECT_REF_PROD`

**Database Password:**
1. 前往：https://supabase.com/dashboard/project/wblcfnodlwebsssoqfaz/settings/database
2. 在 **Database Password** 區塊：
   - 如果還沒設定，點擊 "Reset database password"
   - 複製密碼 → `SUPABASE_DB_PASSWORD_STAGING` 和 `SUPABASE_DB_PASSWORD_PROD`
   - （如果 staging 和 prod 是不同專案，請分別設定）

### 步驟 4: 獲取 OpenAI API Key

1. 前往：https://platform.openai.com/api-keys
2. 登入 OpenAI 帳號
3. 點擊 "Create new secret key"
4. 複製 API key → `OPENAI_API_KEY`
5. ⚠️ 注意：API key 只會顯示一次，請妥善保存

## 📝 建立環境變數檔案

```bash
# 1. 進入 rag 目錄
cd cursor自動化指揮官/rag

# 2. 複製範本
cp .env.example .env

# 3. 編輯並填入實際值
nano .env
# 或使用其他編輯器
code .env
```

## ✅ 驗證設定

完成設定後，執行：

```bash
# 測試環境變數是否正確載入
cd cursor自動化指揮官
node -e "require('dotenv').config({path: './rag/.env'}); console.log('SUPABASE_URL:', process.env.SUPABASE_URL ? '✅ 已設定' : '❌ 未設定')"
```

## 🔒 安全注意事項

- ⚠️ **永遠不要**將 `.env` 檔案提交到 Git
- ⚠️ `SUPABASE_SERVICE_ROLE_KEY` 具有完整資料庫權限，請妥善保管
- ⚠️ `OPENAI_API_KEY` 會產生費用，請妥善保管
- ✅ `.env` 檔案已在 `.gitignore` 中，不會被提交

## 📚 相關連結

- Supabase Dashboard: https://supabase.com/dashboard/project/wblcfnodlwebsssoqfaz
- Supabase API Settings: https://supabase.com/dashboard/project/wblcfnodlwebsssoqfaz/settings/api
- Supabase Database Settings: https://supabase.com/dashboard/project/wblcfnodlwebsssoqfaz/settings/database
- OpenAI API Keys: https://platform.openai.com/api-keys
