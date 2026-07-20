# 汉化执行计划 exec-plan-i18n-zh-CN.md

## 计划背景
pi-web 项目目前无国际化框架，需直接将 UI 界面所有用户可见的英文字符串汉化为中文。

## 汉化范围
所有 React 组件中用户可见的文本内容，包括：
- 按钮标签
- 菜单选项
- 提示信息
- 标题与标签
- 占位文本
- 错误提示
- 状态描述

不包含的内容：
- 代码变量名、函数名
- 代码注释
- 技术术语（API、JSON、Git、CLI 等
- 文件名和路径

## 任务拆分

### 任务1：核心布局组件汉化
文件：components/AppShell.tsx
- 侧边栏切换按钮提示
- 主题切换按钮提示
- 历史记录按钮
- 系统提示按钮
- 会话信息面板
- 文件面板切换按钮
- 欢迎页面引导文本

### 任务2：聊天窗口汉化
文件：components/ChatWindow.tsx
- 加载状态
- 错误信息
- 过程详情折叠面板
- 思考/运行中状态提示
- 扩展对话框按钮
- 扩展面板标题

### 任务3：聊天输入框汉化
文件：components/ChatInput.tsx
- 思考等级描述
- 斜杠命令描述
- 斜杠命令来源标签
- 重试提示
- 压缩结果提示
- 排队消息标签
- 文件匹配结果
- 加载状态

### 任务4：消息视图汉化
文件：components/MessageView.tsx
- 各种消息类型标签
- 工具调用/结果展示
- 复制/编辑/分叉按钮
- 时间显示

### 任务5：侧边栏汉化
文件：components/SessionSidebar.tsx
- 新建会话按钮
- 刷新按钮
- 项目选择器
- 工作树切换
- 会话列表
- 文件浏览器

### 任务6：配置面板汉化
文件：components/ModelsConfig.tsx, components/SkillsConfig.tsx, components/PluginsConfig.tsx
- 模型配置
- 技能管理
- 插件管理

### 任务7：文件相关组件汉化
文件：components/FileExplorer.tsx, components/FileViewer.tsx, components/TabBar.tsx
- 文件浏览器
- 文件查看器
- 标签栏

### 任务8：其他辅助组件汉化
文件：components/BranchNavigator.tsx, components/ChatMinimap.tsx, components/MarkdownBody.tsx
- 分支导航
- 聊天小地图
- Markdown 渲染

## 执行顺序
按任务1→任务8顺序执行，每个任务完成后进行验证。
