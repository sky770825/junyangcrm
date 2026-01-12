# 常順地產CRM系統 - Real Estate CRM & Activity Tracking System

## 專案概述

這是一個專注於重新激活舊客戶並嚴格執行活動報告期限的房地產CRM系統。

## 技術棧

- **框架**: Next.js 14 (App Router)
- **語言**: TypeScript
- **樣式**: Tailwind CSS (移動優先設計)
- **數據庫**: Supabase (PostgreSQL)
- **身份驗證**: NextAuth (角色：Admin vs Agent)

## 功能特性

### Agent (用戶)
- 查看分配的客戶和任務
- 通過特定表單完成任務
- 查看任務列表（按到期日期排序）
- 逾期任務顯示紅色加粗警告

### Manager (管理員)
- 查看所有數據
- 分配客戶給代理
- 查看逾期報告
- 活動時間線
- 客戶池管理

## 開始使用

1. 安裝依賴：
```bash
npm install
```

2. 設置環境變數：
創建 `.env.local` 文件並添加：
```
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

3. 運行開發服務器：
```bash
npm run dev
```

4. 訪問 http://localhost:3000
