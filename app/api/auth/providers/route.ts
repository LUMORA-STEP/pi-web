import { ModelRuntime, getAgentDir } from "@earendil-works/pi-coding-agent";
import { existsSync, readFileSync } from "fs";
import { join } from "path";

export const dynamic = "force-dynamic";

export async function GET() {
  const modelRuntime = await ModelRuntime.create();
  const credentials = await modelRuntime.listCredentials();
  const loggedInProviders = new Set(
    credentials.filter((credential) => credential.type === "oauth").map((credential) => credential.providerId),
  );

  // Fallback: SDK 的 AuthStorage 在 Windows 上可能因文件锁/chmod 失败而返回空列表。
  // 直接读取 auth.json 检查是否有 OAuth 凭证，确保登录状态正确反映。
  if (loggedInProviders.size === 0) {
    try {
      const authPath = join(getAgentDir(), "auth.json");
      if (existsSync(authPath)) {
        const data = JSON.parse(readFileSync(authPath, "utf-8")) as Record<string, { type?: string }>;
        for (const [providerId, cred] of Object.entries(data)) {
          if (cred?.type === "oauth") {
            loggedInProviders.add(providerId);
          }
        }
      }
    } catch {
      // ignore — fallback 读取失败时保持 SDK 返回的结果
    }
  }

  const providers = modelRuntime.getProviders().filter((provider) => provider.auth.oauth);

  const EXCLUDED = new Set(["anthropic"]);
  const DISPLAY_NAMES: Record<string, string> = {
    "openai-codex": "ChatGPT Plus/Pro",
    "github-copilot": "GitHub Copilot",
  };

  const result = await Promise.all(
    providers
      .filter((p) => !EXCLUDED.has(p.id))
      .map(async (p) => {
        return {
          id: p.id,
          name: DISPLAY_NAMES[p.id] ?? p.name,
          usesCallbackServer: false,
          loggedIn: loggedInProviders.has(p.id),
        };
      })
  );

  return Response.json({ providers: result });
}
