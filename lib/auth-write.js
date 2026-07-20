#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-require-imports, @typescript-eslint/no-unused-vars */
// 独立的 auth.json 写入辅助脚本。
//
// 背景：Windows 上 Next.js dev server 长驻进程内的 graceful-fs / proper-lockfile
// 会导致 auth.json 被以非共享写入模式打开，dev server 进程内任何对 auth.json
// 的写入（writeFileSync / renameSync / unlinkSync）都会失败 with EPERM。
// 独立的 Node.js 子进程没有这些缓存句柄，能正常写入 auth.json。
//
// 用法：
//   node auth-write.js write <authPath> <provider> <apiKey>
//   node auth-write.js delete <authPath> <provider>
//
// 退出码：
//   0 - 成功
//   1 - 参数错误
//   2 - 写入失败

const fs = require("fs");
const os = require("os");
const path = require("path");

const [mode, authPath, provider, apiKey] = process.argv.slice(2);

if (!mode || !authPath || !provider) {
  console.error("Usage: node auth-write.js <write|delete> <authPath> <provider> [apiKey]");
  process.exit(1);
}

if (mode === "write" && !apiKey) {
  console.error("apiKey is required for write mode");
  process.exit(1);
}

function atomicWrite(targetPath, content) {
  // 先写临时文件，再 rename 原子替换。
  const tmpFile = path.join(
    os.tmpdir(),
    `pi-auth-${Date.now()}-${Math.random().toString(36).slice(2)}.json`,
  );
  fs.writeFileSync(tmpFile, content, "utf-8");
  try {
    fs.renameSync(tmpFile, targetPath);
  } catch (_e1) {
    // rename 失败（目标可能被锁定），尝试先删除再 rename
    try { fs.unlinkSync(targetPath); } catch { /* ignore */ }
    try {
      fs.renameSync(tmpFile, targetPath);
    } catch (_e2) {
      try { fs.unlinkSync(tmpFile); } catch { /* ignore */ }
      // 最后尝试直接 writeFileSync
      try {
        fs.writeFileSync(targetPath, content, "utf-8");
      } catch (e3) {
        throw new Error(
          `atomicWrite failed: rename="${_e2.code || _e2.message}", write="${e3.code || e3.message}"`,
        );
      }
    }
  }
}

try {
  let data = {};
  if (fs.existsSync(authPath)) {
    try {
      data = JSON.parse(fs.readFileSync(authPath, "utf-8"));
    } catch {
      data = {};
    }
  }

  if (mode === "write") {
    data[provider] = { type: "api_key", key: apiKey };
  } else if (mode === "delete") {
    if (!(provider in data)) {
      // provider 不存在，无需写入
      process.exit(0);
    }
    delete data[provider];
  } else {
    console.error(`Unknown mode: ${mode}`);
    process.exit(1);
  }

  atomicWrite(authPath, JSON.stringify(data, null, 2));
  process.exit(0);
} catch (err) {
  console.error(`auth-write.js failed: ${err.message}`);
  process.exit(2);
}
