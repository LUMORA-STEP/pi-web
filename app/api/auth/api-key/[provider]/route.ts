import { ModelRuntime, getAgentDir } from "@earendil-works/pi-coding-agent";
import { NextResponse } from "next/server";
import { invalidateModelsCache } from "@/lib/models-cache";
import { existsSync, readFileSync } from "fs";
import { spawnSync } from "child_process";
import { join, resolve } from "path";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ provider: string }> };

// Windows 上 dev server 长驻进程内的 graceful-fs / proper-lockfile 会缓存 auth.json
// 的文件句柄（非共享写入模式），导致 dev server 进程内任何对 auth.json 的写入
// （writeFileSync / renameSync / unlinkSync）都失败 with EPERM。
//
// 即使通过 spawnSync 启动子进程，libuv 在 Windows 上默认使用 bInheritHandles=TRUE，
// 子进程仍然继承 dev server 持有的 auth.json 句柄，依然无法写入。
//
// 解决方案：通过 PowerShell 的 Start-Process 启动独立 Node 进程。
// Start-Process 默认使用 ShellExecuteEx（UseShellExecute=true），
// ShellExecuteEx 不会继承父进程的句柄，因此独立进程能正常写入 auth.json。
function runAuthWriteScript(mode: "write" | "delete", authPath: string, provider: string, apiKey?: string): void {
  // 临时使用 auth-test.js 进行诊断
  const scriptPath = resolve(process.cwd(), "lib", "auth-test.js");
  const os = require("os") as typeof import("os");
  const stdoutFile = join(os.tmpdir(), `pi-auth-stdout-${Date.now()}.txt`);
  const stderrFile = join(os.tmpdir(), `pi-auth-stderr-${Date.now()}.txt`);
  const psCommand = `$p = Start-Process -FilePath '${process.execPath}' -ArgumentList '${scriptPath}','${authPath}' -Wait -PassThru -WindowStyle Hidden -RedirectStandardOutput '${stdoutFile}' -RedirectStandardError '${stderrFile}'; exit $p.ExitCode`;
  const psArgs = ["-NoProfile", "-NonInteractive", "-Command", psCommand];
  const result = spawnSync("powershell.exe", psArgs, {
    encoding: "utf-8",
    windowsHide: true,
    timeout: 20000,
  });
  let stdoutContent = "";
  let stderrContent = "";
  try {
    if (existsSync(stdoutFile)) stdoutContent = readFileSync(stdoutFile, "utf-8");
    if (existsSync(stderrFile)) stderrContent = readFileSync(stderrFile, "utf-8");
  } catch { /* ignore */ }
  console.error(`[auth-test] ps_exit=${result.status} stdout=${stdoutContent} stderr=${stderrContent} ps_stderr=${result.stderr || "(empty)"}`);
  throw new Error(`诊断测试完成（exit ${result.status}）: stdout=${stdoutContent}`);
}

function writeCredentialDirectly(provider: string, apiKey: string): void {
  const authPath = join(getAgentDir(), "auth.json");
  runAuthWriteScript("write", authPath, provider, apiKey);
}

function deleteCredentialDirectly(provider: string): void {
  const authPath = join(getAgentDir(), "auth.json");
  runAuthWriteScript("delete", authPath, provider);
}

// GET /api/auth/api-key/[provider] — returns auth status (never returns the actual key)
export async function GET(_req: Request, { params }: Params) {
  const { provider } = await params;
  const modelRuntime = await ModelRuntime.create();
  const status = modelRuntime.getProviderAuthStatus(provider);
  const displayName = modelRuntime.getProvider(provider)?.name ?? provider;
  const models = modelRuntime.getModels(provider).length;

  // Windows fallback: SDK 的 AuthStorage.reload() 可能因 lockfile 失败而返回空数据。
  // 直接读取 auth.json 检查凭证是否存在，确保 configured 状态正确反映。
  let configured = status.configured;
  if (!configured) {
    try {
      const authPath = join(getAgentDir(), "auth.json");
      if (existsSync(authPath)) {
        const data = JSON.parse(readFileSync(authPath, "utf-8")) as Record<string, { type?: string }>;
        if (data[provider]?.type) {
          configured = true;
        }
      }
    } catch {
      // ignore fallback read errors
    }
  }

  return NextResponse.json({ provider, displayName, configured, source: status.source, models });
}

// POST /api/auth/api-key/[provider]  body: { apiKey: string }
export async function POST(req: Request, { params }: Params) {
  const { provider } = await params;
  try {
    const { apiKey } = await req.json() as { apiKey?: string };
    if (!apiKey || typeof apiKey !== "string" || !apiKey.trim()) {
      return NextResponse.json({ error: "apiKey is required" }, { status: 400 });
    }
    const trimmedKey = apiKey.trim();

    // 通过子进程写入 auth.json，避免 dev server 进程内的 graceful-fs 缓存句柄
    // 导致的 EPERM 写入失败。
    writeCredentialDirectly(provider, trimmedKey);
    invalidateModelsCache();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`POST /api/auth/api-key/${provider} error:`, error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

// DELETE /api/auth/api-key/[provider] — removes stored API key
export async function DELETE(_req: Request, { params }: Params) {
  const { provider } = await params;
  try {
    deleteCredentialDirectly(provider);
    invalidateModelsCache();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`DELETE /api/auth/api-key/${provider} error:`, error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
