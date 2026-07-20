#!/usr/bin/env node
// 等待并重试写入 auth.json
const fs = require("fs");
const path = require("path");
const os = require("os");

const authPath = process.argv[2];

console.log("start time:", new Date().toISOString());
for (let attempt = 1; attempt <= 10; attempt++) {
  try {
    const content = fs.existsSync(authPath) ? fs.readFileSync(authPath, "utf-8") : "{}";
    fs.writeFileSync(authPath, content, "utf-8");
    console.log(`attempt ${attempt} (${new Date().toISOString()}): OK`);
    process.exit(0);
  } catch (e) {
    console.log(`attempt ${attempt} (${new Date().toISOString()}): FAIL ${e.code}`);
    // Sleep 500ms
    const start = Date.now();
    while (Date.now() - start < 500) { /* busy wait */ }
  }
}
console.log("all attempts failed");
process.exit(2);
