#!/usr/bin/env node

/**
 * Cloudflare R2 自动化配置工具 (Node.js 版本)
 * 提供交互式配置界面
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const ENV_FILE = '.env.local';
const ENV_EXAMPLE = 'env.example';

// 颜色输出
const colors = {
  green: (text) => `\x1b[32m${text}\x1b[0m`,
  yellow: (text) => `\x1b[33m${text}\x1b[0m`,
  red: (text) => `\x1b[31m${text}\x1b[0m`,
  blue: (text) => `\x1b[34m${text}\x1b[0m`,
};

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

function questionSecret(prompt) {
  return new Promise((resolve) => {
    const stdin = process.stdin;
    stdin.setRawMode(true);
    stdin.resume();
    stdin.setEncoding('utf8');
    
    process.stdout.write(prompt);
    
    let input = '';
    stdin.on('data', (char) => {
      char = char.toString();
      switch (char) {
        case '\n':
        case '\r':
        case '\u0004': // Ctrl+D
          stdin.setRawMode(false);
          stdin.pause();
          process.stdout.write('\n');
          resolve(input);
          break;
        case '\u0003': // Ctrl+C
          process.exit();
          break;
        case '\u007f': // Backspace
          if (input.length > 0) {
            input = input.slice(0, -1);
            process.stdout.write('\b \b');
          }
          break;
        default:
          input += char;
          process.stdout.write('*');
          break;
      }
    });
  });
}

function loadEnvFile() {
  const env = {};
  if (fs.existsSync(ENV_FILE)) {
    const content = fs.readFileSync(ENV_FILE, 'utf8');
    content.split('\n').forEach(line => {
      const match = line.match(/^([^#=]+)=(.*)$/);
      if (match) {
        env[match[1].trim()] = match[2].trim();
      }
    });
  }
  return env;
}

function saveEnvFile(env) {
  let content = '';
  const allVars = {
    ...loadEnvFile(),
    ...env
  };
  
  // 读取示例文件作为模板
  if (fs.existsSync(ENV_EXAMPLE)) {
    const template = fs.readFileSync(ENV_EXAMPLE, 'utf8');
    content = template;
    
    // 替换变量
    Object.keys(allVars).forEach(key => {
      const regex = new RegExp(`^${key}=.*$`, 'm');
      if (regex.test(content)) {
        content = content.replace(regex, `${key}=${allVars[key]}`);
      } else {
        content += `\n${key}=${allVars[key]}`;
      }
    });
  } else {
    Object.keys(allVars).forEach(key => {
      content += `${key}=${allVars[key]}\n`;
    });
  }
  
  fs.writeFileSync(ENV_FILE, content);
}

function isPlaceholder(value) {
  return !value || 
         value.includes('your-') || 
         value.includes('xxxxx') || 
         value === '';
}

async function main() {
  console.log(colors.blue('🚀 Cloudflare R2 自动化配置工具'));
  console.log('==================================\n');
  
  // 检查 .env.local
  if (!fs.existsSync(ENV_FILE)) {
    console.log(colors.yellow('⚠️  .env.local 文件不存在，正在创建...'));
    if (fs.existsSync(ENV_EXAMPLE)) {
      fs.copyFileSync(ENV_EXAMPLE, ENV_FILE);
      console.log(colors.green('✅ 已创建 .env.local 文件\n'));
    }
  }
  
  const currentEnv = loadEnvFile();
  const newEnv = {};
  
  console.log('📋 配置步骤：');
  console.log('1. 在 Cloudflare Dashboard 创建 R2 Bucket');
  console.log('2. 创建 API Token');
  console.log('3. 获取 Account ID');
  console.log('4. 配置 Public Access（可选）\n');
  console.log('请输入以下信息（按 Enter 跳过已配置的项）：\n');
  
  // Account ID
  if (isPlaceholder(currentEnv.R2_ACCOUNT_ID)) {
    const accountId = await question('R2 Account ID: ');
    if (accountId) newEnv.R2_ACCOUNT_ID = accountId;
  } else {
    console.log(colors.green(`✅ Account ID 已配置: ${currentEnv.R2_ACCOUNT_ID}`));
  }
  
  // Access Key ID
  if (isPlaceholder(currentEnv.R2_ACCESS_KEY_ID)) {
    const accessKeyId = await question('R2 Access Key ID: ');
    if (accessKeyId) newEnv.R2_ACCESS_KEY_ID = accessKeyId;
  } else {
    console.log(colors.green('✅ Access Key ID 已配置'));
  }
  
  // Secret Access Key
  if (isPlaceholder(currentEnv.R2_SECRET_ACCESS_KEY)) {
    const secretKey = await questionSecret('R2 Secret Access Key: ');
    if (secretKey) newEnv.R2_SECRET_ACCESS_KEY = secretKey;
  } else {
    console.log(colors.green('✅ Secret Access Key 已配置'));
  }
  
  // Bucket Name
  if (isPlaceholder(currentEnv.R2_BUCKET_NAME)) {
    const bucketName = await question('R2 Bucket Name (默认: junyangcrm-files): ');
    newEnv.R2_BUCKET_NAME = bucketName || 'junyangcrm-files';
  } else {
    console.log(colors.green(`✅ Bucket Name 已配置: ${currentEnv.R2_BUCKET_NAME}`));
  }
  
  // Public URL
  if (isPlaceholder(currentEnv.R2_PUBLIC_URL)) {
    const publicUrl = await question('R2 Public URL (可选，格式: https://pub-xxxxx.r2.dev): ');
    if (publicUrl) newEnv.R2_PUBLIC_URL = publicUrl;
  } else {
    console.log(colors.green(`✅ Public URL 已配置: ${currentEnv.R2_PUBLIC_URL}`));
  }
  
  // Endpoint (自动生成)
  const accountId = newEnv.R2_ACCOUNT_ID || currentEnv.R2_ACCOUNT_ID;
  if (accountId && isPlaceholder(currentEnv.R2_ENDPOINT)) {
    newEnv.R2_ENDPOINT = `https://${accountId}.r2.cloudflarestorage.com`;
    console.log(colors.green(`✅ Endpoint 已自动生成: ${newEnv.R2_ENDPOINT}`));
  }
  
  // 保存配置
  if (Object.keys(newEnv).length > 0) {
    saveEnvFile(newEnv);
    console.log(colors.green('\n✅ 配置已保存到 .env.local'));
  }
  
  console.log('\n📝 下一步：');
  console.log('1. 重启开发服务器: npm run dev');
  console.log('2. 验证配置: ./scripts/verify-r2-config.sh');
  console.log('3. 测试上传: ./scripts/test-r2-upload.sh\n');
  
  rl.close();
}

main().catch(console.error);
