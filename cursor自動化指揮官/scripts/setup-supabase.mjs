#!/usr/bin/env node

/**
 * Supabase 設定輔助工具
 * 協助檢查和設定 Supabase 環境變數
 */

import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync, existsSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 載入環境變數的輔助函數
function loadEnvFile(filePath) {
  const env = {};
  if (!existsSync(filePath)) return env;
  
  const content = readFileSync(filePath, 'utf8');
  const lines = content.split(/\r?\n/);
  
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    
    const match = trimmed.match(/^([^=]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      let value = match[2].trim();
      // 移除引號
      if ((value.startsWith('"') && value.endsWith('"')) || 
          (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      env[key] = value;
    }
  }
  
  return env;
}

// 載入環境變數
const rootDir = join(__dirname, '../..');
const nextjsEnv = loadEnvFile(join(rootDir, '.env.local'));
const ragEnv = loadEnvFile(join(rootDir, 'cursor自動化指揮官/rag/.env'));

// 合併到 process.env（不覆蓋已存在的）
for (const [key, value] of Object.entries({ ...nextjsEnv, ...ragEnv })) {
  if (!process.env[key]) {
    process.env[key] = value;
  }
}

console.log('🔍 Supabase 環境變數檢查\n');

// 檢查 Next.js 專案環境變數
console.log('📦 Next.js 專案環境變數 (.env.local):');
const nextjsVars = {
  'NEXT_PUBLIC_SUPABASE_URL': process.env.NEXT_PUBLIC_SUPABASE_URL,
  'NEXT_PUBLIC_SUPABASE_ANON_KEY': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  'NEXTAUTH_URL': process.env.NEXTAUTH_URL,
  'NEXTAUTH_SECRET': process.env.NEXTAUTH_SECRET,
};

let nextjsComplete = true;
for (const [key, value] of Object.entries(nextjsVars)) {
  const status = value && !value.includes('your-') && !value.includes('here') ? '✅' : '❌';
  console.log(`  ${status} ${key}: ${value ? (value.length > 50 ? value.substring(0, 50) + '...' : value) : '未設定'}`);
  if (!value || value.includes('your-') || value.includes('here')) {
    nextjsComplete = false;
  }
}

// 檢查 RAG 系統環境變數
console.log('\n🧠 RAG 系統環境變數 (cursor自動化指揮官/rag/.env):');
const ragVars = {
  'SUPABASE_URL': process.env.SUPABASE_URL,
  'SUPABASE_SERVICE_ROLE_KEY': process.env.SUPABASE_SERVICE_ROLE_KEY,
  'SUPABASE_ACCESS_TOKEN': process.env.SUPABASE_ACCESS_TOKEN,
  'SUPABASE_PROJECT_REF_STAGING': process.env.SUPABASE_PROJECT_REF_STAGING,
  'SUPABASE_DB_PASSWORD_STAGING': process.env.SUPABASE_DB_PASSWORD_STAGING,
  'SUPABASE_PROJECT_REF_PROD': process.env.SUPABASE_PROJECT_REF_PROD,
  'SUPABASE_DB_PASSWORD_PROD': process.env.SUPABASE_DB_PASSWORD_PROD,
  'OPENAI_API_KEY': process.env.OPENAI_API_KEY,
};

let ragComplete = true;
for (const [key, value] of Object.entries(ragVars)) {
  const status = value && !value.includes('your-') && !value.includes('here') ? '✅' : '❌';
  const displayValue = value 
    ? (key.includes('KEY') || key.includes('TOKEN') || key.includes('PASSWORD') 
      ? (value.length > 20 ? value.substring(0, 20) + '...' : '***') 
      : value)
    : '未設定';
  console.log(`  ${status} ${key}: ${displayValue}`);
  if (!value || value.includes('your-') || value.includes('here')) {
    ragComplete = false;
  }
}

// 總結
console.log('\n📊 設定狀態總結:');
console.log(`  Next.js 專案: ${nextjsComplete ? '✅ 完成' : '❌ 需要設定'}`);
console.log(`  RAG 系統: ${ragComplete ? '✅ 完成' : '❌ 需要設定'}`);

if (!nextjsComplete || !ragComplete) {
  console.log('\n📝 設定指引:');
  console.log('\n1. Next.js 專案環境變數 (.env.local):');
  console.log('   前往: https://supabase.com/dashboard/project/wblcfnodlwebsssoqfaz/settings/api');
  console.log('   - 複製 Project URL → NEXT_PUBLIC_SUPABASE_URL');
  console.log('   - 複製 anon/public key → NEXT_PUBLIC_SUPABASE_ANON_KEY');
  
  console.log('\n2. RAG 系統環境變數 (cursor自動化指揮官/rag/.env):');
  console.log('   建立檔案: cp cursor自動化指揮官/rag/.env.example cursor自動化指揮官/rag/.env');
  console.log('   然後填入:');
  console.log('   - SUPABASE_URL (同上)');
  console.log('   - SUPABASE_SERVICE_ROLE_KEY (從 API 設定頁取得 service_role key)');
  console.log('   - SUPABASE_ACCESS_TOKEN (執行: supabase login)');
  console.log('   - Database Password (從 Database 設定頁取得)');
  console.log('   - OPENAI_API_KEY (從 https://platform.openai.com/api-keys 取得)');
  
  console.log('\n詳細指引: cursor自動化指揮官/ENV_SETUP_GUIDE.md');
  process.exit(1);
} else {
  console.log('\n✅ 所有環境變數已正確設定！');
  process.exit(0);
}
