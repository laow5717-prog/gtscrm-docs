#!/bin/bash

# 文档部署脚本
# 用于快速提交文档更改、推送到远程仓库并触发 GitHub Actions 部署

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 获取脚本所在目录
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DOCS_DIR="$(dirname "$SCRIPT_DIR")"
cd "$DOCS_DIR"

echo -e "${GREEN}开始部署文档...${NC}"

# 检查是否有未提交的更改
if [ -z "$(git status --porcelain)" ]; then
    echo -e "${YELLOW}没有未提交的更改${NC}"
    exit 0
fi

# 显示当前状态
echo -e "${GREEN}当前更改状态：${NC}"
git status --short

# 询问提交信息
if [ -z "$1" ]; then
    read -p "请输入提交信息（默认: 更新文档）: " COMMIT_MSG
    COMMIT_MSG=${COMMIT_MSG:-"更新文档"}
else
    COMMIT_MSG="$1"
fi

# 添加所有更改
echo -e "${GREEN}添加更改到暂存区...${NC}"
git add -A

# 提交更改
echo -e "${GREEN}提交更改...${NC}"
git commit -m "$COMMIT_MSG"

# 推送到远程仓库
echo -e "${GREEN}推送到远程仓库...${NC}"
BRANCH=$(git branch --show-current)
git push origin "$BRANCH"

echo -e "${GREEN}✓ 文档已推送到远程仓库${NC}"
echo -e "${GREEN}✓ GitHub Actions 部署将自动触发${NC}"
echo -e "${YELLOW}您可以在 GitHub Actions 页面查看部署进度${NC}"
