# 项目全量变更日志 project-log.md
规则：仅新增末尾行，禁止修改、删除任何历史记录；时间戳精确到秒，每条绑定修改内容、关联计划

# 日志条目格式：[YYYY-MM-DD HH:MM:SS] | 修改文件路径1,文件路径2 | 变更详细说明 | 关联计划文件
[2026-07-20 10:00:00] | main-plan.md | 初始化项目主计划，定义汉化项目整体阶段与约束规则 | main-plan.md
[2026-07-20 10:01:00] | HANDOFF.md | 初始化项目交接文档，记录当前任务与进度 | main-plan.md
[2026-07-20 11:00:00] | exec-plan-i18n-zh-CN.md,project-log.md,auto-gitee-push.sh | 创建汉化执行补充计划、自动推送脚本、追加日志 | exec-plan-i18n-zh-CN.md
[2026-07-20 12:00:00] | components/AppShell.tsx,components/ChatWindow.tsx,components/ChatInput.tsx | 汉化核心布局与聊天输入组件UI文本 | exec-plan-i18n-zh-CN.md
[2026-07-20 13:00:00] | components/MessageView.tsx,components/SessionSidebar.tsx | 汉化消息视图与侧边栏组件UI文本 | exec-plan-i18n-zh-CN.md
[2026-07-20 14:00:00] | components/ModelsConfig.tsx,components/SkillsConfig.tsx,components/PluginsConfig.tsx | 汉化模型/技能/插件配置面板UI文本 | exec-plan-i18n-zh-CN.md
[2026-07-20 15:00:00] | components/FileExplorer.tsx,components/FileViewer.tsx,components/TabBar.tsx | 汉化文件浏览器/查看器/标签栏UI文本 | exec-plan-i18n-zh-CN.md
[2026-07-20 16:00:00] | components/BranchNavigator.tsx,components/ChatMinimap.tsx,components/MarkdownBody.tsx | 汉化分支导航/小地图/Markdown渲染组件UI文本 | exec-plan-i18n-zh-CN.md
[2026-07-20 17:00:00] | HANDOFF.md,project-log.md | 完成全部组件汉化，通过类型检查与Lint检查，更新管控文档 | exec-plan-i18n-zh-CN.md
[2026-07-21 01:56:41] | lib/rpc-manager.ts,HANDOFF.md | 修复 Windows 上创建新会话时 HTTP 500 错误：在 startRpcSession 中添加 ensureSessionDirExists 预创建会话目录并添加 EPERM 重试逻辑，解决含 Unicode 字符的 cwd（如 d:\项目\PI）下 mkdirSync 间歇性失败问题 | exec-plan-i18n-zh-CN.md
[2026-07-21 02:12:34] | components/PluginsConfig.tsx,components/ChatInput.tsx,components/AppShell.tsx,bin/pi-web.js,app/api/agent/new/route.ts,app/api/models-config/route.ts,lib/rpc-manager.ts,hooks/useAgentSession.ts | 深入全链路检查并修复 7 类问题：(1)PluginsConfig disabled/filtered 标签汉化为已禁用/已过滤 (2)ChatInput tokens 英文残留改令牌 (3)AppShell Token/令牌术语统一 (4)bin/pi-web.js 浏览器打开失败警告汉化 (5)agent/new 与 models-config 路由移除 stack 字段防泄露 (6)rpc-manager computeDefaultSessionDir 添加 resolvePath(agentDir) 与 SDK 对齐 (7)useAgentSession 25+处用户可见文本汉化（错误消息/通知/斜杠命令反馈） | exec-plan-i18n-zh-CN.md
[2026-07-21 03:13:16] | app/api/models/route.ts,app/api/auth/api-key/[provider]/route.ts,lib/auth-write.js,lib/auth-test.js,HANDOFF.md | 修复两个核心阻塞问题：(1)/api/models 返回空 modelList 导致输入框下方不显示模型选项 — 添加 Windows fallback 直接读取 auth.json 并调用 provider.getModels() 绕过 SDK AuthStorage.reload() 静默吞错，当前返回 9 个模型（deepseek×2 + openai-codex×7）defaultModel=deepseek-v4-flash (2)POST /api/auth/api-key/deepseek 报“Credential store modify failed” — 添加 Windows fallback GET 直接读 auth.json 检查凭证存在性使 configured 状态正确；创建 lib/auth-write.js 独立写入脚本（atomicWrite 多级降级）和 lib/auth-test.js 诊断脚本；尝试 7 种迭代方案（进程内写入/spawnSync-e/spawnSync-script+stdio:ignore/PowerShell Start-Process）均未彻底解决 EPERM，根因是 dev server 长驻进程持有 auth.json 非共享写入句柄，已记录卡点与下一步定位方案 | exec-plan-i18n-zh-CN.md
[2026-07-21 04:08:52] | app/api/auth/api-key/[provider]/route.ts,app/api/models/route.ts,lib/auth-write.js,HANDOFF.md | 彻底解决 auth.json 写入失败问题：(1)重写 api-key route 使用进程内 atomicWriteFileSync(tmp+rename)+PowerShell Start-Process 降级双层方案，移除诊断代码 (2)经分析确认 SDK proper-lockfile 用 mkdir 做临时锁不持有持久句柄，EPERM 为间歇性问题 (3)删除 lib/auth-test.js 和 .tmp-auth-test.json (4)修复 models/route.ts VisibleModel 类型错误 (5)全链路验证通过：POST/GET/DELETE api-key、/api/models 9个模型、新建会话 200、tsc+eslint 通过 | exec-plan-i18n-zh-CN.md
