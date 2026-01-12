# 文档自动部署配置

## 功能说明

当 `docs` 子模块仓库有更新时，自动构建并部署到 Cloudflare Pages。

## 配置步骤

### 1. 获取 Cloudflare 凭证

- **获取 Cloudflare API Token**
  - 登录 Cloudflare Dashboard
  - 进入 "My Profile" → "API Tokens"
  - 创建自定义 token，需要以下权限：
    - Account: Cloudflare Pages:Edit
    - Zone: Zone:Read（如果使用自定义域名）

- **获取 Account ID**
  - 在 Cloudflare Dashboard 右侧边栏找到 Account ID

### 2. 配置 GitHub Secrets

在 **docs 子模块仓库**（`laow5717-prog/gtscrm-docs`）中配置：

进入 GitHub 仓库 → Settings → Secrets and variables → Actions，添加以下 Secrets：

- `CLOUDFLARE_API_TOKEN`: Cloudflare API Token
- `CLOUDFLARE_ACCOUNT_ID`: Cloudflare Account ID
- `MAIN_REPO`: 主仓库地址（可选，默认：`laow5717-prog/gtscrm-backend-web`）
- `MAIN_REPO_TOKEN`: 访问主仓库的 token（如果主仓库是私有仓库，否则可选）

### 3. 修改项目名称（可选）

编辑 `.github/workflows/deploy-docs.yml`，将 `projectName: 'gtchat-docs'` 改为您的 Cloudflare Pages 项目名称。

## 工作原理

1. 工作流在 docs 子模块仓库中触发
2. 检出当前触发工作流的子模块代码
3. 检出主仓库（用于获取 workspace 依赖）
4. 将当前子模块内容复制到主仓库的 docs 目录
5. 在主仓库环境中安装依赖并构建文档
6. 将构建产物部署到 Cloudflare Pages

## 使用

- **自动触发**：推送代码到 `main` 或 `master` 分支时
- **手动触发**：在 GitHub Actions 页面点击 "Run workflow"
