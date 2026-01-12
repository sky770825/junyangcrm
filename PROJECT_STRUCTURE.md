# 項目結構

```
.
├── app/                          # Next.js App Router 目錄
│   ├── api/                      # API 路由
│   │   └── tasks/
│   │       ├── route.ts         # GET /api/tasks
│   │       └── [id]/
│   │           └── complete/
│   │               └── route.ts # POST /api/tasks/[id]/complete
│   ├── components/               # React 組件
│   │   ├── TaskCard.tsx         # 任務卡片組件
│   │   └── CompleteTaskModal.tsx # 完成任務表單模態框
│   ├── dashboard/                # Agent Dashboard 頁面
│   │   └── page.tsx             # 任務列表頁面
│   ├── lib/                      # 工具函數和配置
│   │   ├── db/
│   │   │   └── tasks.ts         # 任務數據庫操作（服務器端）
│   │   ├── supabase/
│   │   │   ├── client.ts        # Supabase 客戶端（客戶端）
│   │   │   └── server.ts        # Supabase 客戶端（服務器端）
│   │   └── utils.ts             # 工具函數
│   ├── types/
│   │   └── database.ts          # TypeScript 類型定義
│   ├── globals.css              # 全局樣式
│   ├── layout.tsx               # 根佈局
│   └── page.tsx                 # 首頁
├── supabase/
│   └── migrations/
│       └── 001_initial_schema.sql # 數據庫遷移腳本
├── package.json                 # 項目依賴
├── tsconfig.json                # TypeScript 配置
├── tailwind.config.ts           # Tailwind CSS 配置
├── next.config.js               # Next.js 配置
├── README.md                    # 項目說明
├── SETUP.md                     # 設置指南
└── env.example                  # 環境變數示例
```

## 核心功能實現

### 1. 數據庫架構 (`supabase/migrations/001_initial_schema.sql`)
- **users**: 用戶表（支持 agent 和 manager 角色）
- **clients**: 客戶表（支持標籤、狀態、所有者）
- **tasks**: 任務表（核心票務系統）
- Row Level Security (RLS) 策略
- 自動更新時間戳觸發器

### 2. Agent Dashboard (`app/dashboard/page.tsx`)
- 顯示任務列表（按到期日期排序）
- 逾期任務顯示紅色加粗警告
- 分離待處理和已完成任務
- 點擊任務打開完成表單

### 3. 任務完成流程 (`app/api/tasks/[id]/complete/route.ts`)
- 驗證輸入（結果備註至少10個字符，下次跟進日期必填）
- 更新當前任務為已完成
- 自動創建新的跟進任務
- 更新客戶的最後聯繫日期

### 4. UI 組件
- **TaskCard**: 任務卡片，支持逾期狀態顯示
- **CompleteTaskModal**: 完成任務表單，移動端友好設計

## 待實現功能

1. **身份驗證系統**（NextAuth + Supabase Auth）
2. **Manager Dashboard**（逾期排行榜、活動時間線、客戶池）
3. **客戶管理**（創建、編輯、分配客戶）
4. **任務管理**（創建、編輯任務）
5. **中間件保護**（路由保護、角色驗證）

## 技術棧

- **框架**: Next.js 14 (App Router)
- **語言**: TypeScript
- **樣式**: Tailwind CSS (移動優先)
- **數據庫**: Supabase (PostgreSQL)
- **身份驗證**: 待實現（計劃使用 NextAuth 或 Supabase Auth）
