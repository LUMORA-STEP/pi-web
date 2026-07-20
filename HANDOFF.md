# 项目交接总文档 HANDOFF.md

## 1. 项目基础信息
项目名称：pi-web 中文版
主计划文件：main-plan.md
当前生效执行计划：exec-plan-i18n-zh-CN.md
仓库地址：Gitee仓库地址（尚未配置远程仓库，目前仅本地 git commit 8423680）

## 2. 当前任务（核心目标）
全面深入检查所有汉化修改文件的完整链路，修复发现的汉化遗漏、安全问题和一致性问题，端到端测试通过；并修复 Windows 平台下 auth.json 凭证写入失败、/api/models 返回空导致输入框下方不显示模型选项两个核心阻塞问题。
验收标准：所有用户可见文本完全汉化，TypeScript/ESLint 通过，API 链路和浏览器 UI 测试通过，模型密钥可保存、模型选择器正常显示。

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
- [x] 任务18：修复 PluginsConfig.tsx 汉化遗漏（disabled/filtered 标签） + 完成时间：2026-07-21 + 验证结果：改为"已禁用"/"已过滤"
- [x] 任务19：修复 ChatInput.tsx 汉化遗漏（tokens 英文残留） + 完成时间：2026-07-21 + 验证结果：改为"令牌"
- [x] 任务20：修复 AppShell.tsx 术语不一致（Token/令牌混用） + 完成时间：2026-07-21 + 验证结果：统一为"令牌"
- [x] 任务21：修复 bin/pi-web.js 汉化遗漏（浏览器打开失败警告） + 完成时间：2026-07-21 + 验证结果：改为"无法自动打开浏览器："
- [x] 任务22：修复 agent/new 和 models-config 路由 stack 字段泄露 + 完成时间：2026-07-21 + 验证结果：移除 stack 字段，仅保留 console.error 服务端日志
- [x] 任务23：修复 rpc-manager.ts computeDefaultSessionDir 与 SDK 一致性 + 完成时间：2026-07-21 + 验证结果：添加 resolvePath(agentDir) 调用
- [x] 任务24：汉化 hooks/useAgentSession.ts 中 25+ 处用户可见文本 + 完成时间：2026-07-21 + 验证结果：错误消息、通知、斜杠命令反馈全部汉化
- [x] 任务25：TypeScript 类型检查 + ESLint 检查 + 完成时间：2026-07-21 + 验证结果：均通过（exit code 0）
- [x] 任务26：API 链路端到端测试（9 个接口） + 完成时间：2026-07-21 + 验证结果：全部返回 200
- [x] 任务27：浏览器 UI 端到端测试 + 完成时间：2026-07-21 + 验证结果：首页/侧边栏/新建会话/配置面板全部汉化正确
- [x] 任务28：修复 /api/models 返回空导致输入框下方不显示模型选项 + 完成时间：2026-07-21 + 验证结果：在 app/api/models/route.ts 添加 Windows fallback 直接读取 auth.json 并调用 provider.getModels()，绕过 SDK AuthStorage.reload() 静默吞错；当前返回 9 个模型（deepseek×2 + openai-codex×7），defaultModel = deepseek-v4-flash
- [x] 任务29：修复 GET /api/auth/api-key/[provider] 返回 configured: false + 完成时间：2026-07-21 + 验证结果：添加 Windows fallback 直接读取 auth.json 检查凭证存在性，deepseek 现在正确返回 configured: true
- [x] 任务30：创建 lib/auth-write.js 独立写入脚本 + 完成时间：2026-07-21 + 验证结果：脚本支持 write/delete 两种模式，使用 atomicWrite（tmp 文件 + rename + 多级降级）保证原子性，独立进程测试通过
- [x] 任务31：创建 lib/auth-test.js 诊断脚本 + 完成时间：2026-07-21 + 验证结果：脚本包含 4 个测试（写新文件、写 auth.json、rename 到 auth.json、stat auth.json）+ 10 次重试循环，用于定位 EPERM 问题根因

## 4. 当前卡点（阻塞/未解决问题）
1. 问题描述：POST /api/auth/api-key/deepseek 报错 "ModelsError: Credential store modify failed for deepseek"，本地复现为 "auth.json 写入失败（exit 2）"，根因是 dev server 进程内对 auth.json 的写入（writeFileSync/renameSync/unlinkSync）均失败 with EPERM
2. 已尝试方案：
   - 迭代1-4：在 dev server 进程内直接调用 SDK AuthStorage.modify()、fs.writeFileSync、fs.renameSync、fs.unlinkSync + writeFileSync，均失败 EPERM
   - 迭代5：spawnSync(node, ['-e', inlineScript]) 启动子进程写入，失败 EPERM（子进程继承 dev server 句柄）
   - 迭代6：spawnSync(node, [scriptPath, ...]) + stdio:'ignore' 启动独立脚本 lib/auth-write.js，失败 EPERM（stdio:'ignore' 只影响 stdio 句柄继承，不影响其他文件句柄继承）
   - 迭代7：spawnSync(powershell, Start-Process node lib/auth-write.js) 通过 PowerShell Start-Process 启动独立 Node 进程，失败 EPERM
   - 诊断脚本 lib/auth-test.js 验证：从 dev server 通过 Start-Process 启动的 Node 进程，仍无法 open auth.json for write；10 次 500ms 重试全部失败
   - 对比测试：从 PowerShell 终端直接运行 `node lib/auth-test.js "C:\Users\Administrator\.pi\agent\auth.json"` 立即成功（attempt 1: OK）
3. 临时规避手段（如有）：
   - GET /api/auth/api-key/[provider] 已添加 fallback 直接读 auth.json，configured 状态正确显示
   - /api/models 已添加 fallback 直接读 auth.json，模型列表正常返回 9 个
   - 用户可手动在 PowerShell 终端运行 `node lib/auth-write.js write "C:\Users\Administrator\.pi\agent\auth.json" deepseek <apiKey>` 完成密钥写入
4. 根因分析：dev server 进程（PID 19520）持有 auth.json 的非共享写入句柄。即使通过 PowerShell Start-Process 启动的"独立"Node 进程也无法 open auth.json for write（EPERM: operation not permitted, open '...auth.json'）。怀疑 dev server 内某处（graceful-fs / proper-lockfile / ModelRuntime）持有了未释放的文件句柄；也可能 Windows 文件系统在父进程持有非共享写入句柄时，所有"子进程树"内的进程都受影响（待验证）。

## 5. 下一步执行顺序（不可颠倒）
1. 步骤1：定位 dev server 内持有 auth.json 句柄的代码位置。可用方法：
   - 用 Sysinternals handle.exe 查询 PID 19520 打开的所有句柄，过滤 auth.json
   - 或在 dev server 启动后立即测试写入（排除启动时锁）；在每次 API 请求后测试写入（定位哪个请求触发锁）
2. 步骤2：根据定位结果，在 dev server 内主动释放 auth.json 句柄（如调用 ModelRuntime.dispose() 或类似清理逻辑），再启动子进程写入
3. 步骤3：备选方案 — 重启 dev server 后立即写入（如果句柄只在运行时累积，重启后短时间内可写）
4. 步骤4：备选方案 — 通过 Windows API 强制关闭目标进程对 auth.json 的句柄（需要 native addon，复杂度高）
5. 步骤5：备选方案 — 把 auth.json 改为存储在项目本地的 .pi-agent/auth.json（通过 PI_AGENT_DIR 环境变量），避开 ~/.pi/agent 路径上可能的杀毒/索引干扰
6. 步骤6：写入功能修复后，运行 TypeScript 检查（npx tsc --noEmit）和 ESLint（npm run lint）
7. 步骤7：浏览器 UI 测试：打开配置面板 → 输入 deepseek API key → 保存 → 验证 GET 返回 configured: true → 验证输入框下方显示模型选择器
8. 步骤8：清理诊断脚本 lib/auth-test.js（保留 lib/auth-write.js 作为生产辅助脚本）

## 6. 历史踩坑记录（全项目汇总，持续新增）
| 发生时间 | 问题现象 | 根因 | 解决方案 | 后续规避规则 |
| ---- | ---- | ---- | ---- | ---- |
| 2026-07-20 | 项目目录初始为空 | 新项目初始化 | 从 GitHub 克隆项目 | 新项目先检查目录内容 |
| 2026-07-20 | Windows 下 node_modules/.bin/tsc 路径不识别 | 路径分隔符问题 | 使用 npx tsc 替代 | Windows 环境优先使用 npx 调用命令 |
| 2026-07-20 | Windows 下 AuthStorage 无法读取 auth.json | SDK 的 AuthStorage.reload() 在 Windows 上因文件锁/chmod 失败，this.data 保持为空 | 在 auth/providers 与 auth/all-providers 路由添加 fallback 直接读取 auth.json | Windows 环境下 SDK 文件操作可能失败，关键路径需要 fallback |
| 2026-07-21 | 创建新会话 HTTP 500: EPERM mkdir 含 Unicode 字符的目录 | Windows 上 Next.js dev server 调用 fs.mkdirSync 创建含 CJK 字符（如"项目"）的会话目录时，被杀毒/索引器间歇性锁定导致 EPERM | 在 lib/rpc-manager.ts 的 startRpcSession 中预创建会话目录并添加 EPERM 重试逻辑（3 次重试，100ms 递增延迟） | Windows 上 fs.mkdirSync 对 Unicode 路径可能间歇性失败，需添加重试机制 |
| 2026-07-21 | 汉化遗漏：hooks 层用户可见文本未汉化 | 前期汉化只覆盖 components 层，忽略 hooks/useAgentSession.ts 中的错误消息、通知、斜杠命令反馈 | 全面扫描 hooks 层并汉化 25+ 处用户可见文本 | 汉化范围必须覆盖所有层的用户可见文本，不能只看 components |
| 2026-07-21 | 安全问题：stack 字段泄露到前端 | agent/new 和 models-config 路由在错误响应中包含 (error as Error).stack，会暴露文件路径和依赖版本 | 移除 stack 字段，仅保留 console.error 服务端日志 | 错误响应不应包含 stack 字段，stack 只应记录在服务端日志 |
| 2026-07-21 | 术语不一致：Token 与 令牌 混用 | AppShell.tsx 中 section("Token", ...) 与 ModelsConfig.tsx 中"令牌"不统一 | 统一为"令牌" | 汉化后需做术语一致性检查，同一概念在所有文件中应保持一致 |
| 2026-07-21 | /api/models 返回空 modelList 导致输入框下方不显示模型选项 | SDK AuthStorage.reload() 在 lockfile.lockSync 失败时静默吞错保持 this.data={}，getAvailable() 因无凭证返回空数组 | 在 /api/models 路由添加 Windows fallback：getAvailable() 返回空时直接读 auth.json，对有凭证的 provider 调用 provider.getModels() 绕过 auth 检查；defaultModel 不可用时回退到第一个可用模型 | Windows 上 SDK 的 AuthStorage 可能因 lockfile 失败而返回空数据，所有依赖 getAvailable() 的接口都需要 fallback |
| 2026-07-21 | POST /api/auth/api-key/deepseek 报 "Credential store modify failed" / EPERM 写入失败 | dev server 长驻进程内 graceful-fs/proper-lockfile 持有 auth.json 的非共享写入句柄；子进程（即使通过 Start-Process 启动）也无法 open auth.json for write | 已尝试 7 种迭代方案均未彻底解决；当前临时方案是让用户在 PowerShell 终端直接运行 lib/auth-write.js。下一步用 handle.exe 定位具体持有句柄的代码位置 | Windows 长驻进程内的文件句柄可能持续占用，导致所有子进程无法写入；关键写入操作应避免依赖长驻进程内的 fs API，考虑使用独立进程或 IPC 队列 |
