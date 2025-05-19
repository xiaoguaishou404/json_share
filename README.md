# JSON Share 应用

一个允许用户分享JSON数据并管理自己分享记录的Web应用。

## 功能特点

- 上传JSON文件并生成分享链接
- 设置分享链接的有效期
- 使用语法高亮和可折叠树状视图预览JSON内容
- 管理个人分享的链接


## 技术栈

- 前端：Nuxt.js (Vue 3), TypeScript, vue-json-pretty
- 后端：Nuxt 服务器端API
- 数据库：MySQL 8.0
- 部署：Docker, Docker Compose

## 本地开发环境

### 环境要求

- Docker 和 Docker Compose
- Node.js v18+（可选，仅用于本地开发不使用Docker的情况）

### 启动开发环境

1. 使用脚本启动（推荐）：

```bash
./dev.sh
```

2. 或手动启动：

```bash
# 复制开发环境配置
cp .env.development .env

# 启动开发容器
docker-compose -f docker-compose.dev.yml up --build
```

开发环境配置了代码热更新，修改代码后会自动重新加载。

## 生产环境部署

### 本地测试生产环境

```bash
./prod.sh
```

### 服务器部署

项目使用GitHub Actions自动部署到服务器。当代码推送到main分支时，会触发以下流程：

1. 构建Docker镜像并推送到Docker Hub
2. 在服务器上拉取最新镜像并启动容器

#### 环境变量配置

线上环境使用GitHub Secrets设置环境变量：

**必需的GitHub Secrets:**

- `DOCKER_USERNAME`: Docker Hub用户名
- `DOCKER_PASSWORD`: Docker Hub密码
- `SERVER_HOST`: 服务器主机地址
- `SERVER_USERNAME`: 服务器用户名
- `SERVER_SSH_KEY`: 服务器SSH私钥
- `MYSQL_DATABASE`: MySQL数据库名
- `MYSQL_USER`: MySQL用户名
- `MYSQL_PASSWORD`: MySQL密码
- `MYSQL_ROOT_PASSWORD`: MySQL root密码
- `APP_URL`: 应用URL（例如：https://your-domain.com）

## 环境区分

项目使用不同的Docker配置文件区分开发和生产环境：

- `docker-compose.dev.yml`: 开发环境，支持代码热更新
- `docker-compose.prod.yml`: 生产环境，使用预构建的镜像
- `Dockerfile.dev`: 开发环境Dockerfile
- `Dockerfile.prod`: 生产环境Dockerfile

## 数据库迁移

初始数据库结构在`mysql-init/init.sql`文件中定义。修改数据库结构请更新此文件。
