import { ModelRuntime, getAgentDir } from "@earendil-works/pi-coding-agent";
import { NextResponse } from "next/server";
import { invalidateModelsCache } from "@/lib/models-cache";
import { existsSync, readFileSync, writeFileSync, renameSync, unlinkSync, mkdirSync } from "fs";
import { spawnSync } from "child_process";
import { join, resolve, dirname } from "path";
import { tmpdir } from "os";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ provider: string }> };

/**
 * 原子写入：先写临时文件再 rename 替换目标。
 * 如果 rename 失败（Windows 文件锁），降级为直接 writeFileSync。
 */
function atomicWriteFileSync(targetPath: string, content: string): void {
  const dir = dirname(targetPath);
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
  const tmpFile = join(tmpdir(), `pi-auth-${Date.now()}-${Math.random().toString(36).slice(2)}.json`);
  writeFileSync(tmpFile, content, "utf-8");
  try {
    renameSync(tmpFile, targetPath);
  } catch {
    // rename 失败时尝试直接写入
    try { unlinkSync(tmpFile); } catch { /* ignore */ }
    writeFileSync(targetPath, content, "utf-8");
  }
}

/**
 * 读取当前 auth.json 内容，修改指定 provider 的凭证后写回。
 * 优先在进程内直接写入；若遇 EPERM 则通过 PowerShell Start-Process
 * 启动独立 Node 进程（lib/auth-write.js）完成写入。
 */
function modifyCredential(mode: "write" | "delete", provider: string, apiKey?: string): void {
  const authPath = join(getAgentDir(), "auth.json");

  // 第一步：尝试进程内直接写入
  try {
    let data: Record<string, unknown> = {};
    if (existsSync(authPath)) {
      try { data = JSON.parse(readFileSync(authPath, "utf-8")); } catch { data = {}; }
    }
    if (mode === "write") {
      data[provider] = { type: "api_key", key: apiKey };
    } else {
      delete data[provider];
    }
    atomicWriteFileSync(authPath, JSON.stringify(data, null, 2));
    return; // 成功
  } catch (directErr) {
    const code = (directErr as NodeJS.ErrnoException).code;
    if (code !== "EPERM" && code !== "EACCES" && code !== "EBUSY") {
      throw directErr; // 非文件锁错误，直接抛出
    }
    console.error(`[auth-write] 进程内写入失败 (${code})，降级为独立进程写入`);
  }

  // 第二步：通过 PowerShell Start-Process 启动独立 Node 进程写入
  const scriptPath = resolve(process.cwd(), "lib", "auth-write.js");
  const args = mode === "write"
    ? [scriptPath, "write", authPath, provider, apiKey!]
    : [scriptPath, "delete", authPath, provider];
  const argStr = args.map((a) => `'${a}'`).join(",");
  const psCommand = `$p = Start-Process -FilePath '${process.execPath}' -ArgumentList ${argStr} -Wait -PassThru -WindowStyle Hidden; exit $p.ExitCode`;
  const result = spawnSync("powershell.exe", ["-NoProfile", "-NonInteractive", "-Command", psCommand], {
    encoding: "utf-8",
    windowsHide: true,
    timeout: 15000,
  });
  if (result.status !== 0) {
    throw new Error(
      `auth.json 写入失败（独立进程 exit ${result.status}）: ${result.stderr || "unknown error"}`,
    );
  }
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

    modifyCredential("write", provider, trimmedKey);
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
    modifyCredential("delete", provider);
    invalidateModelsCache();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`DELETE /api/auth/api-key/${provider} error:`, error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
