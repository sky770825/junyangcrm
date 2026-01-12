#!/usr/bin/env node

/**
 * Cloudflare DNS 管理工具
 * 使用 Cloudflare API 更新或建立 DNS 記錄
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

async function listDNSRecords(zoneId) {
  const url = `https://api.cloudflare.com/client/v4/zones/${zoneId}/dns_records`;
  
  try {
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${CLOUDFLARE_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (data.success) {
      return data.result;
    } else {
      console.error('❌ 取得 DNS 記錄失敗:', data.errors);
      return null;
    }
  } catch (error) {
    console.error('❌ 請求錯誤:', error.message);
    return null;
  }
}

async function createDNSRecord(zoneId, record) {
  const url = `https://api.cloudflare.com/client/v4/zones/${zoneId}/dns_records`;
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${CLOUDFLARE_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(record),
    });

    const data = await response.json();

    if (data.success) {
      console.log(`✅ DNS 記錄建立成功: ${record.name} ${record.type} ${record.content}`);
      return data.result;
    } else {
      console.error('❌ DNS 記錄建立失敗:', data.errors);
      return null;
    }
  } catch (error) {
    console.error('❌ 請求錯誤:', error.message);
    return null;
  }
}

async function updateDNSRecord(zoneId, recordId, record) {
  const url = `https://api.cloudflare.com/client/v4/zones/${zoneId}/dns_records/${recordId}`;
  
  try {
    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${CLOUDFLARE_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(record),
    });

    const data = await response.json();

    if (data.success) {
      console.log(`✅ DNS 記錄更新成功: ${record.name || 'ID: ' + recordId}`);
      return data.result;
    } else {
      console.error('❌ DNS 記錄更新失敗:', data.errors);
      return null;
    }
  } catch (error) {
    console.error('❌ 請求錯誤:', error.message);
    return null;
  }
}

async function main() {
  const args = process.argv.slice(2);
  const command = args[0]; // list, create, update

  if (!command || !['list', 'create', 'update'].includes(command)) {
    console.log('用法:');
    console.log('  node cloudflare-dns.mjs list <domain>');
    console.log('  node cloudflare-dns.mjs create <domain> <type> <name> <content> [ttl]');
    console.log('  node cloudflare-dns.mjs update <domain> <record-id> <type> <name> <content> [ttl]');
    console.log('');
    console.log('範例:');
    console.log('  node cloudflare-dns.mjs list example.com');
    console.log('  node cloudflare-dns.mjs create example.com A www 192.0.2.1 3600');
    console.log('  node cloudflare-dns.mjs update example.com <record-id> A www 192.0.2.2');
    process.exit(1);
  }

  const domain = args[1];
  if (!domain) {
    console.error('❌ 請提供域名');
    process.exit(1);
  }

  console.log(`🌐 Cloudflare DNS 管理: ${domain}`);
  const zoneId = await getZoneId(domain);
  if (!zoneId) {
    process.exit(1);
  }

  if (command === 'list') {
    console.log(`\n📋 DNS 記錄列表:`);
    const records = await listDNSRecords(zoneId);
    if (records) {
      records.forEach(record => {
        console.log(`  ${record.name} ${record.type} ${record.content} (TTL: ${record.ttl})`);
      });
    }
  } else if (command === 'create') {
    const type = args[2];
    const name = args[3];
    const content = args[4];
    const ttl = args[5] ? parseInt(args[5]) : 3600;

    if (!type || !name || !content) {
      console.error('❌ 請提供 type, name, content');
      process.exit(1);
    }

    const record = {
      type,
      name,
      content,
      ttl,
    };

    await createDNSRecord(zoneId, record);
  } else if (command === 'update') {
    const recordId = args[2];
    const type = args[3];
    const name = args[4];
    const content = args[5];
    const ttl = args[6] ? parseInt(args[6]) : undefined;

    if (!recordId || !type || !name || !content) {
      console.error('❌ 請提供 record-id, type, name, content');
      process.exit(1);
    }

    const record = {
      type,
      name,
      content,
    };
    if (ttl) record.ttl = ttl;

    await updateDNSRecord(zoneId, recordId, record);
  }
}

main();
