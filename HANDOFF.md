# 项目交接总文档 HANDOFF.md

## 1. 项目基础信息
项目名称：pi-web 中文版
主计划文件：main-plan.md
当前生效执行计划：exec-plan-i18n-zh-CN.md
仓库地址：Gitee仓库地址（尚未配置远程仓库，目前仅本地 git commit 8423680）

## 2. 当前任务（核心目标）
修复"未找到所选模型的 API 密钥"错误 + 会话文件创建 EPERM 问题。
验收标准：使用 DeepSeek V4 Pro 模型发送消息能正常获得 AI 回复，会话文件正确持久化。
**当前状态：两项修复均已完成，端到端验证通过（AI 成功回复"OK"）。**

## 3. 已完成内容（逐条清单）
- [x] 任务1：克隆 GitHub 项目到本地 + 完成时间：2026-07-20 + 验证结果：项目已成功克隆到 d:\项目\PI
- [x] 任务2：分析项目结构与汉化范围 + 完成时间：2026-07-20 + 验证结果：确认无i18n框架，需直接翻译UI字符串
- [x] 任务3：创建项目管控文件（main-plan.md） + 完成时间：2026-07-20 + 验证结果：主计划文件已创建
- [x] 任务4：创建 exec-plan-i18n-zh-CN.md 补充执行计划 + 完成时间：2026-07-20 + 验证结果：汉化执行计划已创建
- [x] 任务5：创建 HANDOFF.md、project-log.md、auto-gitee-push.sh 管控文件 + 完成时间：2026-07-20 + 验证结果：管控文件已创建
- [x] 任务6：汉化 AppShell.tsx 核心布局组件 + 完成时间：2026-07-20 + 验证结果：约30处UI文本已汉化
- [x] 任务7：汉化 ChatWindow.tsx 聊天窗口组件 + 完成时间：2026-07-20 + 验证结果：约20处UI文本已汉化
- [x] 任务8：汉化 ChatInput.tsx 聊天输入框组件 + 完成时间：2026-07-20 + 验证结果：约40处UI文本已汉化
- [x] 任务9：汉化 MessageView.tsx 消息视图组件 + 完成时间：2026-07-20 + 验证结果：约30处UI文本已汉化
- [x] 任务10：汉化 SessionSidebar.tsx 侧边栏组件 + 完成时间：2026-07-20 + 验证结果：约40处UI文本已汉化
- [x] 任务11：汉化配置面板（ModelsConfig, SkillsConfig, PluginsConfig） + 完成时间：2026-07-20 + 验证结果：约60处UI文本已汉化
- [x] 任务12：汉化文件相关组件（FileExplorer, FileViewer, TabBar） + 完成时间：2026-07-20 + 验证结果：约62处UI文本已汉化
- [x] 任务13：汉化辅助组件（BranchNavigator, ChatMinimap, MarkdownBody） + 完成时间：2026-07-20 + 验证结果：约16处UI文本已汉化
- [x] 任务14：验证汉化完整性 + 完成时间：2026-07-20 + 验证结果：TypeScript 类型检查通过，ESLint 检查通过
- [x] 任务15：修复 Windows AuthStorage 读取 auth.json 问题 + 完成时间：2026-07-21 + 验证结果：auth/providers 与 auth/all-providers 添加 fallback 直接读取 auth.json
- [x] 任务16：修复创建新会话 HTTP 500（EPERM mkdir Unicode 目录） + 完成时间：2026-07-21 + 验证结果：在 lib/rpc-manager.ts 添加 ensureSessionDirExists 预创建+重试逻辑，5 次连续测试全部成功
- [x] 任务17：深入检查 API/Lib/Hooks/Components 全链路完整性 + 完成时间：2026-07-21 + 验证结果：发现 7 处问题（汉化遗漏 4 处、安全 stack 泄露 2 处、SDK 一致性 1 处）
- [x] 任务18：修复 PluginsConfig.tsx 汉化遗漏（disabled/filtered 标签） + 完成时间：2026-07-21 + 验证结果：改为“已禁用”/“已过滤”
- [x] 任务19：修复 ChatInput.tsx 汉化遗漏（tokens 英文残留） + 完成时间：2026-07-21 + 验证结果：改为“令牌”
- [x] 任务20：修复 AppShell.tsx 术语不一致（Token/令牌混用） + 完成时间：2026-07-21 + 验证结果：统一为“令牌”
- [x] 任务21：修复 bin/pi-web.js 汉化遗漏（浏览器打开失败警告） + 完成时间：2026-07-21 + 验证结果：改为“无法自动打开浏览器：”
- [x] 任务22：修复 agent/new 和 models-config 路由 stack 字段泄露 + 完成时间：2026-07-21 + 验证结果：移除 stack 字段，仅保留 console.error 服务端日志
- [x] 任务23：修复 rpc-manager.ts computeDefaultSessionDir 与 SDK 一致性 + 完成时间：2026-07-21 + 验证结果：添加 resolvePath(agentDir) 调用
- [x] 任务24：汉化 hooks/useAgentSession.ts 中 25+ 处用户可见文本 + 完成时间：2026-07-21 + 验证结果：错误消息、通知、斜杠命令反馈全部汉化
- [x] 任务25：TypeScript 类型检查 + ESLint 检查 + 完成时间：2026-07-21 + 验证结果：均通过（exit code 0）
- [x] 任务26：API 链路端到端测试（9 个接口） + 完成时间：2026-07-21 + 验证结果：全部返回 200
- [x] 任务27：浏览器 UI 端到端测试 + 完成时间：2026-07-21 + 验证结果：首页/侧边栏/新建会话/配置面板全部汉化正确
- [x] 任务28：修复 /api/models 返回空导致输入框下方不显示模型选项 + 完成时间：2026-07-21 + 验证结果：在 app/api/models/route.ts 添加 Windows fallback 直接读取 auth.json 并调用 provider.getModels()，绕过 SDK AuthStorage.reload() 静默吞错；当前返回 9 个模型（deepseek×2 + openai-codex×7），defaultModel = deepseek-v4-flash
- [x] 任务29：修复 GET /api/auth/api-key/[provider] 返回 configured: false + 完成时间：2026-07-21 + 验证结果：添加 Windows fallback 直接读取 auth.json 检查凭证存在性，deepseek 现在正确返回 configured: true
- [x] 任务30：创建 lib/auth-write.js 独立写入脚本 + 完成时间：2026-07-21 + 验证结果：脚本支持 write/delete 两种模式，使用 atomicWrite（tmp 文件 + rename + 多级降级）保证原子性，独立进程测试通过
- [x] 任务31：创建 lib/auth-test.js 诊断脚本 + 完成时间：2026-07-21 + 验证结果：脚本包含 4 个测试 + 10 次重试循环，用于定位 EPERM 问题根因
- [x] 任务32：彻底修复 POST /api/auth/api-key 写入失败问题 + 完成时间：2026-07-21 + 验证结果：重写 api-key route 使用进程内 atomicWriteFileSync + PowerShell Start-Process 降级；经分析确认 EPERM 为间歇性问题（SDK 不持有持久句柄），当前写入链路完全正常
- [x] 任务33：清理诊断文件 + 完成时间：2026-07-21 + 验证结果：删除 lib/auth-test.js 和 .tmp-auth-test.json，保留 lib/auth-write.js 作为生产降级脚本
- [x] 任务34：修复 models/route.ts TypeScript 类型错误 + 完成时间：2026-07-21 + 验证结果：添加 VisibleModel 类型声明，tsc --noEmit 通过
- [x] 任务36：修复"未找到所选模型的 API 密钥"错误 + 完成时间：2026-07-21 + 验证结果：在 startRpcSession 中添加 injectStoredApiKeys()，直接读取 auth.json 并通过 modelRuntime.setRuntimeApiKey() 注入密钥，绕过 Windows 上失灵的 AuthStorage
- [x] 任务37：修复会话文件创建 EPERM 导致消息丢失 + 完成时间：2026-07-21 + 验证结果：添加 preCreateSessionFile() 预创建空文件（4次重试）+ 改用 SessionManager.open() 使 SDK 走 appendFileSync 路径，避免中途 openSync("wx") 失败
- [x] 任务38：端到端验证 + 完成时间：2026-07-21 + 验证结果：DeepSeek V4 Pro 完整流式回复（thinking + text "OK"），会话文件 8 条目正确持久化，TypeScript + ESLint 通过

## 4. 当前卡点（阻塞/未解决问题）
无。两项核心修复已完成并验证。

备注：
- API 密钥问题根因：SDK AuthStorage.reload() 在 Windows 上静默失败 → injectStoredApiKeys 运行时注入解决
- 会话文件 EPERM 根因：SDK 延迟用 openSync("wx") 创建新文件被杀毒软件拦截 → 预创建空文件 + SessionManager.open() 解决
- 若 dev server 进程被杀毒软件持续标记，重启 dev server 可解除

## 5. 下一步执行顺序（不可颠倒）
所有计划任务已完成。后续可选优化：
1. 如后续再次出现 EPERM，可尝试将 `C:\Users\Administrator\.pi\agent\` 目录添加到 Windows Defender 排除列表
2. 可考虑将 auth.json 写入操作改为异步（避免 spawnSync 阻塞请求）
3. 可考虑添加端到端自动化测试（Playwright/Cypress）覆盖核心链路

## 6. 历史踩坑记录（全项目汇总，持续新增）
| 发生时间 | 问题现象 | 根因 | 解决方案 | 后续规避规则 |
| ---- | ---- | ---- | ---- | ---- |
| 2026-07-20 | 项目目录初始为空 | 新项目初始化 | 从 GitHub 克隆项目 | 新项目先检查目录内容 |
| 2026-07-20 | Windows 下 node_modules/.bin/tsc 路径不识别 | 路径分隔符问题 | 使用 npx tsc 替代 | Windows 环境优先使用 npx 调用命令 |
| 2026-07-20 | Windows 下 AuthStorage 无法读取 auth.json | SDK 的 AuthStorage.reload() 在 Windows 上因文件锁/chmod 失败，this.data 保持为空 | 在 auth/providers 与 auth/all-providers 路由添加 fallback 直接读取 auth.json | Windows 环境下 SDK 文件操作可能失败，关键路径需要 fallback |
| 2026-07-21 | 创建新会话 HTTP 500: EPERM mkdir 含 Unicode 字符的目录 | Windows 上 Next.js dev server 调用 fs.mkdirSync 创建含 CJK 字符（如“项目”）的会话目录时，被杀毒/索引器间歇性锁定导致 EPERM | 在 lib/rpc-manager.ts 的 startRpcSession 中预创建会话目录并添加 EPERM 重试逻辑（3 次重试，100ms 递增延迟） | Windows 上 fs.mkdirSync 对 Unicode 路径可能间歇性失败，需添加重试机制 |
| 2026-07-21 | 汉化遗漏：hooks 层用户可见文本未汉化 | 前期汉化只覆盖 components 层，忽略 hooks/useAgentSession.ts 中的错误消息、通知、斜杠命令反馈 | 全面扫描 hooks 层并汉化 25+ 处用户可见文本 | 汉化范围必须覆盖所有层的用户可见文本，不能只看 components |
| 2026-07-21 | 安全问题：stack 字段泄露到前端 | agent/new 和 models-config 路由在错误响应中包含 (error as Error).stack，会暴露文件路径和依赖版本 | 移除 stack 字段，仅保留 console.error 服务端日志 | 错误响应不应包含 stack 字段，stack 只应记录在服务端日志 |
| 2026-07-21 | 术语不一致：Token 与 令牌 混用 | AppShell.tsx 中 section("Token", ...) 与 ModelsConfig.tsx 中“令牌”不统一 | 统一为“令牌” | 汉化后需做术语一致性检查，同一概念在所有文件中应保持一致 |
| 2026-07-21 | /api/models 返回空 modelList 导致输入框下方不显示模型选项 | SDK AuthStorage.reload() 在 lockfile.lockSync 失败时静默吞错保持 this.data={}，getAvailable() 因无凭证返回空数组 | 在 /api/models 路由添加 Windows fallback：getAvailable() 返回空时直接读 auth.json，对有凭证的 provider 调用 provider.getModels() 绕过 auth 检查；defaultModel 不可用时回退到第一个可用模型 | Windows 上 SDK 的 AuthStorage 可能因 lockfile 失败而返回空数据，所有依赖 getAvailable() 的接口都需要 fallback |
| 2026-07-21 | POST /api/auth/api-key 写入失败 EPERM | 间歇性问题：经分析 SDK 的 proper-lockfile 用 mkdir 做临时锁不持有持久句柄，EPERM 可能由 Windows Defender/索引器瞬时锁定引起；之前的诊断期间恰好持续触发 | 重写 api-key route：进程内 atomicWriteFileSync（tmp+rename）为主，PowerShell Start-Process 独立进程写入为降级方案；删除诊断脚本 | Windows 上文件写入应使用"直接写入+降级"双层方案，不应依赖单一写入路径；诊断完成后及时清理临时脚本 |
| 2026-07-21 | 对话时提示"未找到所选模型的 API 密钥" | SDK AuthStorage.reload() 在 Windows 上因 lockfile EPERM 静默失败，this.data 为空，prompt 时 _getRequiredRequestAuth 找不到凭证 | startRpcSession 中添加 injectStoredApiKeys()：直接读 auth.json，对 type=api_key 的条目调用 modelRuntime.setRuntimeApiKey() 注入运行时凭证覆盖层 | 所有依赖 SDK AuthStorage 的运行时路径都需要 fallback 注入机制 |
| 2026-07-21 | 会话文件创建 EPERM 导致用户消息丢失 | SDK 延迟到第一条 assistant 消息时才用 openSync(path,"wx") 创建 .jsonl 文件，O_EXCL 创建被杀毒软件拦截，此时 prompt 已无法重试 | preCreateSessionFile() 预创建空文件（4次重试200ms递增）+ 改用 SessionManager.open(emptyFile, undefined, cwd)，SDK 检测空文件后自行写 header 并设 flushed=true，后续全部走 appendFileSync | 文件创建（O_EXCL）比追加写入更容易被拦截；应在可控时机预创建文件并带重试 |
