import { ModelRuntime, getAgentDir } from "@earendil-works/pi-coding-agent";
import { existsSync, readFileSync } from "fs";
import { join } from "path";

export const dynamic = "force-dynamic";

// Providers that use OAuth — handled separately via /api/auth/providers
const OAUTH_PROVIDER_IDS = new Set(["anthropic", "github-copilot", "openai-codex"]);

// Fallback: 直接读取 auth.json 检查已存储的凭证。
// SDK 的 AuthStorage 在 Windows 上可能因文件锁/chmod 失败而无法加载凭证。
function readStoredProviderIds(): Set<string> {
  try {
    const authPath = join(getAgentDir(), "auth.json");
    if (existsSync(authPath)) {
      const data = JSON.parse(readFileSync(authPath, "utf-8")) as Record<string, unknown>;
      return new Set(Object.keys(data));
    }
  } catch {
    // ignore
  }
  return new Set();
}

export async function GET() {
  const modelRuntime = await ModelRuntime.create();
  const all = modelRuntime.getModels();
  const storedProviderIds = readStoredProviderIds();

  // Deduplicate by provider, skip OAuth-only providers and custom providers (source=models_json_key)
  const seen = new Set<string>();
  const result: {
    id: string;
    displayName: string;
    configured: boolean;
    source?: string;
    modelCount: number;
  }[] = [];

  for (const provider of modelRuntime.getProviders()) {
    if (seen.has(provider.id)) continue;
    seen.add(provider.id);
    if (OAUTH_PROVIDER_IDS.has(provider.id) || !provider.auth.apiKey?.login) continue;
    const status = modelRuntime.getProviderAuthStatus(provider.id);
    // Skip providers whose key comes from models.json (those are custom providers)
    if (status.source === "models_json_key") continue;
    const modelCount = all.filter((model) => model.provider === provider.id).length;
    // Fallback: 如果 SDK 返回未配置，但 auth.json 中有该 provider 的凭证，则标记为已配置
    const configured = status.configured || storedProviderIds.has(provider.id);
    result.push({
      id: provider.id,
      displayName: provider.name,
      configured,
      source: configured && !status.configured ? "stored" : status.source,
      modelCount,
    });
  }

  return Response.json({ providers: result });
}
