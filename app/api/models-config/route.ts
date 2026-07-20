import { NextResponse } from "next/server";
import { readFileSync, writeFileSync, existsSync, mkdirSync, unlinkSync, renameSync } from "fs";
import { join, dirname } from "path";
import { getAgentDir } from "@earendil-works/pi-coding-agent";
import { invalidateModelsCache } from "@/lib/models-cache";

export const dynamic = "force-dynamic";

function getModelsPath(): string {
  const agentDir = getAgentDir();
  try {
    const testPath = join(agentDir, "test-write.tmp");
    writeFileSync(testPath, "test", "utf8");
    unlinkSync(testPath);
    return join(agentDir, "models.json");
  } catch {
    const projectDir = process.cwd();
    const fallbackDir = join(projectDir, ".pi-agent");
    if (!existsSync(fallbackDir)) mkdirSync(fallbackDir, { recursive: true });
    return join(fallbackDir, "models.json");
  }
}

function readModelsJson(): Record<string, unknown> {
  const path = getModelsPath();
  if (!existsSync(path)) return { providers: {} };
  try {
    return JSON.parse(readFileSync(path, "utf8")) as Record<string, unknown>;
  } catch {
    return { providers: {} };
  }
}

function writeModelsJson(data: Record<string, unknown>): void {
  const path = getModelsPath();
  const dir = dirname(path);
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  const tempPath = path + ".tmp";
  writeFileSync(tempPath, JSON.stringify(data, null, 2), "utf8");
  try {
    writeFileSync(path, JSON.stringify(data, null, 2), "utf8");
    if (existsSync(tempPath)) unlinkSync(tempPath);
  } catch (err) {
    if (existsSync(tempPath)) {
      if (existsSync(path)) unlinkSync(path);
      renameSync(tempPath, path);
    }
    throw err;
  }
}

export async function GET() {
  return NextResponse.json(readModelsJson());
}

export async function PUT(req: Request) {
  try {
    const body = await req.json() as Record<string, unknown>;
    writeModelsJson(body);
    invalidateModelsCache();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("PUT /api/models-config error:", error);
    return NextResponse.json({ error: String(error), stack: (error as Error).stack }, { status: 500 });
  }
}
