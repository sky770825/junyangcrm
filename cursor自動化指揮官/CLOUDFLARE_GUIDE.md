# ☁️ Cloudflare 自動化指南

> Cloudflare API 整合與自動化工具使用說明

---

## 🔑 環境變數設定

在 `.env.local` 或 `cursor自動化指揮官/rag/.env` 中設定：

```env
CLOUDFLARE_API_TOKEN=K1FNF4xZ_oLUw1NKceZqMU0mdo1q2wKAmNXRjEYQ
CLOUDFLARE_ACCOUNT_ID=82ebeb1d91888e83e8e1b30eeb33d3c3
```

**已自動設定完成！** ✅

---

## 🛠️ 可用工具

### 1. 快取清除工具 (`cloudflare-purge.mjs`)

清除 Cloudflare CDN 快取，支援多種清除模式。

#### 清除所有快取
```bash
node cursor自動化指揮官/scripts/cloudflare-purge.mjs example.com everything
```

#### 清除特定檔案
```bash
node cursor自動化指揮官/scripts/cloudflare-purge.mjs example.com files https://example.com/page1 https://example.com/page2
```

#### 清除特定標籤
```bash
node cursor自動化指揮官/scripts/cloudflare-purge.mjs example.com tags tag1 tag2
```

#### 清除特定主機
```bash
node cursor自動化指揮官/scripts/cloudflare-purge.mjs example.com hosts www.example.com api.example.com
```

#### 使用環境變數
```bash
# 設定環境變數
export CLOUDFLARE_DOMAIN=example.com

# 執行（會自動使用環境變數中的域名）
node cursor自動化指揮官/scripts/cloudflare-purge.mjs
```

---

### 2. DNS 管理工具 (`cloudflare-dns.mjs`)

管理 Cloudflare DNS 記錄，支援列出、建立、更新操作。

#### 列出所有 DNS 記錄
```bash
node cursor自動化指揮官/scripts/cloudflare-dns.mjs list example.com
```

#### 建立新的 DNS 記錄
```bash
# 建立 A 記錄
node cursor自動化指揮官/scripts/cloudflare-dns.mjs create example.com A www 192.0.2.1 3600

# 建立 CNAME 記錄
node cursor自動化指揮官/scripts/cloudflare-dns.mjs create example.com CNAME api api.example.com 3600

# 建立 MX 記錄
node cursor自動化指揮官/scripts/cloudflare-dns.mjs create example.com MX @ mail.example.com 3600
```

#### 更新 DNS 記錄
```bash
# 先列出記錄取得 record-id
node cursor自動化指揮官/scripts/cloudflare-dns.mjs list example.com

# 更新記錄（使用 record-id）
node cursor自動化指揮官/scripts/cloudflare-dns.mjs update example.com <record-id> A www 192.0.2.2
```

---

## 🚀 自動化指令

使用 Cursor 自動化指揮官執行 Cloudflare 操作：

```bash
# 列出所有 Cloudflare 相關指令
node cursor自動化指揮官/scripts/automate.mjs list

# 執行 Cloudflare 快取清除
node cursor自動化指揮官/scripts/automate.mjs execute cloudflare-purge-cache

# 執行 Cloudflare DNS 更新
node cursor自動化指揮官/scripts/automate.mjs execute cloudflare-dns-update
```

---

## 📋 支援的 DNS 記錄類型

- **A**: IPv4 地址
- **AAAA**: IPv6 地址
- **CNAME**: 別名記錄
- **MX**: 郵件交換記錄
- **TXT**: 文字記錄
- **SRV**: 服務記錄
- **NS**: 名稱伺服器記錄

---

## 🔒 安全性注意事項

1. **API Token 權限**
   - 建議只給予必要的權限
   - Zone DNS Edit: 管理 DNS 記錄
   - Zone Cache Purge: 清除快取
   - Account Read: 讀取帳戶資訊（可選）

2. **環境變數保護**
   - ✅ `.env.local` 已在 `.gitignore` 中
   - ✅ 不會被提交到 Git
   - ⚠️ 請勿在公開場合分享 API Token

3. **Token 輪換**
   - 定期更換 API Token
   - 如果 Token 洩露，立即撤銷並建立新的

---

## 🎯 使用情境

### 情境 1: 部署後清除快取
```bash
# 部署完成後自動清除快取
npm run build
npm run deploy
node cursor自動化指揮官/scripts/cloudflare-purge.mjs yourdomain.com everything
```

### 情境 2: 更新 DNS 指向新伺服器
```bash
# 列出現有記錄
node cursor自動化指揮官/scripts/cloudflare-dns.mjs list yourdomain.com

# 更新 A 記錄指向新 IP
node cursor自動化指揮官/scripts/cloudflare-dns.mjs update yourdomain.com <record-id> A www 203.0.113.1
```

### 情境 3: 建立子域名
```bash
# 建立 api 子域名
node cursor自動化指揮官/scripts/cloudflare-dns.mjs create yourdomain.com CNAME api api.example.com 3600
```

---

## 🔗 相關連結

- **Cloudflare Dashboard**: https://dash.cloudflare.com/82ebeb1d91888e83e8e1b30eeb33d3c3
- **API Tokens**: https://dash.cloudflare.com/profile/api-tokens
- **API 文件**: https://developers.cloudflare.com/api/
- **DNS API**: https://developers.cloudflare.com/api/operations/dns-records-for-a-zone-list-dns-records
- **Cache Purge API**: https://developers.cloudflare.com/api/operations/zone-purge-cache-by-urls,-tags-or-host

---

## 🆘 常見問題

### Q: 如何取得 Zone ID？
A: 使用 `cloudflare-dns.mjs list` 命令會自動取得，或從 Cloudflare Dashboard 的域名概覽頁面取得。

### Q: 如何取得 Record ID？
A: 使用 `cloudflare-dns.mjs list <domain>` 列出所有記錄，Record ID 會顯示在輸出中。

### Q: API Token 權限不足？
A: 前往 https://dash.cloudflare.com/profile/api-tokens 檢查 Token 權限，確保有 Zone DNS Edit 和 Zone Cache Purge 權限。

### Q: 清除快取後多久生效？
A: 通常幾秒內生效，但可能需要幾分鐘才能在全球所有節點生效。

---

**最後更新**: 2025-01-20
**狀態**: ✅ 已整合並可使用
