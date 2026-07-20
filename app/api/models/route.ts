import { stat } from "fs/promises";
import { existsSync, readFileSync } from "fs";
import { resolve, join } from "path";
import { createAgentSessionServices, getAgentDir, type SettingsManager } from "@earendil-works/pi-coding-agent";
import { getSupportedThinkingLevels } from "@earendil-works/pi-ai";
import { loadModelsWithCache, type ModelsData } from "@/lib/models-cache";

export const dynamic = "force-dynamic";

const modelNameCollator = new Intl.Collator(undefined, { numeric: true, sensitivity: "base" });

function compareModelEntries(
  a: { id: string; name: string; provider: string },
  b: { id: string; name: string; provider: string }
): number {
  return modelNameCollator.compare(a.name || a.id, b.name || b.id)
    || modelNameCollator.compare(a.provider, b.provider)
    || modelNameCollator.compare(a.id, b.id);
}

const THINKING_SUFFIXES = new Set(["off", "minimal", "low", "medium", "high", "xhigh", "max"]);

function stripThinkingSuffix(modelRef: string): string {
  const trimmed = modelRef.trim();
  const colonIndex = trimmed.lastIndexOf(":");
  if (colonIndex === -1) return trimmed;
  const suffix = trimmed.substring(colonIndex + 1);
  return THINKING_SUFFIXES.has(suffix) ? trimmed.substring(0, colonIndex) : trimmed;
}

function filterByExactEnabledModels<T extends { id: string; provider: string }>(
  available: readonly T[],
  enabledModels: string[] | undefined,
): readonly T[] {
  if (!enabledModels || enabledModels.length === 0) return available;

  const refs = new Set(enabledModels.map(stripThinkingSuffix).filter(Boolean));
  const visible = available.filter((m) => refs.has(`${m.provider}/${m.id}`) || refs.has(m.id));
  return visible.length > 0 ? visible : available;
}

async function loadModels(cwd: string): Promise<ModelsData> {
  const nameMap = new Map<string, string>();
  let modelList: { id: string; name: string; provider: string }[] = [];
  let defaultModel: { provider: string; modelId: string } | null = null;
  const thinkingLevels: Record<string, string[]> = {};
  const thinkingLevelMaps: Record<string, Record<string, string | null>> = {};

  const agentDir = getAgentDir();
  const services = await createAgentSessionServices({ cwd, agentDir });
  const available = await services.modelRuntime.getAvailable();
  const settings: SettingsManager = services.settingsManager;
  const enabledModels = settings.getEnabledModels();
  let visible = filterByExactEnabledModels(available, enabledModels);

  // Windows fallback: SDK 的 AuthStorage.reload() 在 lockfile.lockSync 失败时
  // 静默吞错并保持 this.data = {}，导致 getAvailable() 因没有凭证返回空数组。
  // 直接读取 auth.json，对有凭证的 provider 调用 getModels() 绕过 auth 检查。
  if (visible.length === 0) {
    try {
      const authPath = join(agentDir, "auth.json");
      if (existsSync(authPath)) {
        const authData = JSON.parse(readFileSync(authPath, "utf-8")) as Record<string, { type?: string }>;
        const providersWithCreds = Object.keys(authData).filter((id) => authData[id]?.type);
        if (providersWithCreds.length > 0) {
          const fallback: { id: string; name: string; provider: string; thinkingLevelMap?: Record<string, string | null> }[] = [];
          for (const providerId of providersWithCreds) {
            const provider = services.modelRuntime.getProvider(providerId);
            if (!provider) continue;
            try {
              const models = provider.getModels();
              for (const m of models) {
                fallback.push({
                  id: m.id,
                  name: m.name,
                  provider: m.provider,
                  thinkingLevelMap: m.thinkingLevelMap,
                });
              }
            } catch {
              // 单个 provider 失败时跳过，继续尝试其他
            }
          }
          visible = filterByExactEnabledModels(fallback, enabledModels);
        }
      }
    } catch {
      // fallback 读取失败时保持空 visible
    }
  }

  modelList = visible.map((m: { id: string; name: string; provider: string }) => ({
    id: m.id,
    name: m.name,
    provider: m.provider,
  })).sort(compareModelEntries);
  for (const m of visible) {
    const key = `${m.provider}:${m.id}`;
    nameMap.set(key, m.name);
    thinkingLevels[key] = getSupportedThinkingLevels(m);
    if (m.thinkingLevelMap) thinkingLevelMaps[key] = m.thinkingLevelMap;
  }

  const provider = settings.getDefaultProvider();
  const modelId = settings.getDefaultModel();
  if (provider && modelId && visible.some((m) => m.provider === provider && m.id === modelId)) {
    defaultModel = { provider, modelId };
  } else if (visible.length > 0) {
    // 如果配置的默认模型不可用，回退到第一个可用模型
    defaultModel = { provider: visible[0].provider, modelId: visible[0].id };
  }

  return { models: Object.fromEntries(nameMap), modelList, defaultModel, thinkingLevels, thinkingLevelMaps };
}

const EMPTY_MODELS: ModelsData = {
  models: {},
  modelList: [],
  defaultModel: null,
  thinkingLevels: {},
  thinkingLevelMaps: {},
};

export async function GET(req: Request) {
  const requestedCwd = new URL(req.url).searchParams.get("cwd") || process.cwd();
  const cwd = resolve(requestedCwd);

  let cwdStat;
  try {
    cwdStat = await stat(cwd);
  } catch {
    return Response.json({ error: `Directory does not exist: ${cwd}` }, { status: 400 });
  }
  if (!cwdStat.isDirectory()) {
    return Response.json({ error: `Not a directory: ${cwd}` }, { status: 400 });
  }

  try {
    return Response.json(await loadModelsWithCache(cwd, () => loadModels(cwd)));
  } catch (err) {
    console.error("[/api/models] loadModels failed:", err);
    return Response.json(EMPTY_MODELS);
  }
}
