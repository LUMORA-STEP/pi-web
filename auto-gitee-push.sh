#!/bin/bash
# Gitee自动提交推送脚本
# 读取project-log.md最后一条变更备注作为提交信息
commit_msg=$(tail -1 project-log.md | grep -E "^\[" | awk -F"|" '{print $3}' | xargs)
if [ -z "$commit_msg" ]; then
    commit_msg="常规项目更新，同步HANDOFF与日志文件"
fi
# 执行git推送全流程
git add .
git commit -m "$commit_msg"
git pull origin main --rebase
git push origin main
echo "✅ Gitee仓库同步完成，日志已归档"
