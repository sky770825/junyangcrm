#!/usr/bin/env node

/**
 * Cloudflare 快取清除工具
 * 使用 Cloudflare API 清除指定域名的快取
 */

import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 載入環境變數
config({ path: join(__dirname, '../../.env.local') });
config({ path: join(__dirname, '../rag/.env') });

const CLOUDFLARE_API_TOKEN = process.env.CLOUDFLARE_API_TOKEN;
const CLOUDFLARE_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID;

if (!CLOUDFLARE_API_TOKEN) {
  console.error('❌ 錯誤: 未設定 CLOUDFLARE_API_TOKEN');
  console.log('請在 .env.local 或 cursor自動化指揮官/rag/.env 中設定');
  process.exit(1);
}

async function purgeCache(zoneId, files = null, tags = null, hosts = null) {
  const url = `https://api.cloudflare.com/client/v4/zones/${zoneId}/purge_cache`;
  
  const body = {};
  if (files) body.files = files;
  if (tags) body.tags = tags;
  if (hosts) body.hosts = hosts;
  if (Object.keys(body).length === 0) {
    body.purge_everything = true;
  }

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${CLOUDFLARE_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (data.success) {
      console.log('✅ 快取清除成功');
      if (data.result?.id) {
        console.log(`   清除 ID: ${data.result.id}`);
      }
      return true;
    } else {
      console.error('❌ 快取清除失敗:', data.errors);
      return false;
    }
  } catch (error) {
    console.error('❌ 請求錯誤:', error.message);
    return false;
  }
}

async function getZoneId(domain) {
  const url = `https://api.cloudflare.com/client/v4/zones?name=${domain}`;
  
  try {
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${CLOUDFLARE_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (data.success && data.result && data.result.length > 0) {
      return data.result[0].id;
    } else {
      console.error('❌ 找不到域名:', domain);
      return null;
    }
  } catch (error) {
    console.error('❌ 請求錯誤:', error.message);
    return null;
  }
}

async function main() {
  const args = process.argv.slice(2);
  const domain = args[0] || process.env.CLOUDFLARE_DOMAIN;
  const purgeType = args[1] || 'everything'; // everything, files, tags, hosts

  if (!domain) {
    console.error('❌ 請提供域名');
    console.log('用法: node cloudflare-purge.mjs <domain> [everything|files|tags|hosts]');
    console.log('或設定環境變數 CLOUDFLARE_DOMAIN');
    process.exit(1);
  }

  console.log(`🧹 清除 Cloudflare 快取: ${domain}`);
  console.log(`   類型: ${purgeType}`);

  const zoneId = await getZoneId(domain);
  if (!zoneId) {
    process.exit(1);
  }

  console.log(`   區域 ID: ${zoneId}`);

  let success = false;
  switch (purgeType) {
    case 'everything':
      success = await purgeCache(zoneId);
      break;
    case 'files':
      const files = args.slice(2);
      if (files.length === 0) {
        console.error('❌ files 模式需要提供檔案 URL');
        process.exit(1);
      }
      success = await purgeCache(zoneId, files);
      break;
    case 'tags':
      const tags = args.slice(2);
      if (tags.length === 0) {
        console.error('❌ tags 模式需要提供標籤');
        process.exit(1);
      }
      success = await purgeCache(zoneId, null, tags);
      break;
    case 'hosts':
      const hosts = args.slice(2);
      if (hosts.length === 0) {
        console.error('❌ hosts 模式需要提供主機名稱');
        process.exit(1);
      }
      success = await purgeCache(zoneId, null, null, hosts);
      break;
    default:
      console.error(`❌ 未知的清除類型: ${purgeType}`);
      process.exit(1);
  }

  process.exit(success ? 0 : 1);
}

main();
