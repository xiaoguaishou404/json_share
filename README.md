# JSON Share 应用

一个简单高效的JSON数据分享平台，用户可以轻松上传、分享和管理JSON文件。

## 🌟 功能特点

- **上传分享**：
  - 轻松上传JSON文件并生成唯一分享链接
  - 支持最大50MB的JSON文件上传
  - 自动验证JSON格式
- **有效期控制**：可设置分享链接的有效期（1天、7天或永久有效）
- **高级预览**：
  - 语法高亮和树状视图（使用vue-json-pretty）
  - 支持全部展开/折叠功能
  - 显示行号和折叠图标
  - 支持点击括号折叠/展开
  - 默认显示第一层结构，避免数据过于复杂
- **用户管理**：简化的用户标识系统，无需登录即可管理个人分享记录
- **分享管理**：查看、删除个人创建的分享链接

## 🔧 技术栈

- **前端**：
  - Nuxt.js 3.17.3 (Vue 3.5.13)
  - TypeScript 5.8.3
  - vue-json-pretty 2.3.0
  - Nuxt UI 3.1.2
  - Tailwind CSS 4.1.7
  - Pinia 2.1.7
  
- **后端**：
  - Nuxt 服务器API (Nitro)
  - MySQL 8.0 (mysql2 包)
  
- **测试框架**：
  - Vitest
  - @nuxt/test-utils
  - happy-dom (浏览器环境模拟)
  
- **部署与运行环境**：
  - Docker 和 Docker Compose
  - Nginx（反向代理）

## 🚀 快速开始

### 开发环境

#### 方式1：使用脚本（推荐）

```bash
./dev.sh
```



### 测试

项目使用 Vitest 作为测试框架，支持单元测试和组件测试。

#### 运行所有测试

```bash
# 使用测试脚本（推荐）
./test.sh

# 或直接运行测试命令
npm run test
```

#### 开发时监听测试

```bash
npm run test:watch
```

#### 服务器部署

项目使用GitHub Actions自动化部署流程：
1. 当代码推送到main分支时触发CI/CD流程
2. 运行测试套件确保代码质量
3. 构建Docker镜像并推送到Docker Hub
4. 在服务器上拉取最新镜像并重启容器

**GitHub Secrets配置**：
- `DOCKER_USERNAME`：Docker Hub用户名
- `DOCKER_PASSWORD`：Docker Hub密码
- `SERVER_HOST`：服务器主机地址
- `SERVER_USERNAME`：服务器用户名
- `SERVER_SSH_KEY`：服务器SSH私钥
- `ENV_FILE`：# 环境配置
              NODE_ENV=development
              # 数据库配置
              MYSQL_HOST=mysql
              MYSQL_PORT=3306
              MYSQL_DATABASE=json_share_database
              MYSQL_USER=json_share_user
              MYSQL_PASSWORD=json_share_password
              MYSQL_ROOT_PASSWORD=root_password
              # 应用配置
              NUXT_PORT=3000

## 📦 项目结构

```
├── components/           # Vue组件
├── pages/               # 页面组件
│   ├── index.vue        # 首页（上传JSON）
│   ├── my-shares.vue    # 我的分享页面
│   └── share/[id].vue   # 分享查看页面
├── server/
│   ├── api/             # API接口
│   │   ├── share/       # 分享相关接口
│   │   └── shares/      # 用户分享列表接口
│   └── utils/           # 服务端工具函数
├── test/                # 测试文件
│   ├── setup.ts         # 测试环境配置
│   ├── types.ts         # 测试类型定义
│   └── server/          # 服务端测试
├── mysql-init/
│   └── init.sql         # 数据库初始化SQL
├── docker-compose.dev.yml  # 开发环境配置
├── docker-compose.test.yml # 测试环境配置
├── docker-compose.prod.yml # 生产环境配置
└── Dockerfile.{dev,test,prod} # Docker构建文件
```

## 📊 数据库结构

项目使用了简单的数据库设计：

```sql
CREATE TABLE IF NOT EXISTS shares (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    content JSON NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expiration_date TIMESTAMP NULL,
    INDEX idx_user_id (user_id),
    INDEX idx_expiration_date (expiration_date)
);
```

## 📝 开发指南

1. **用户标识**：采用前端生成UUID并存储在LocalStorage的方式标识用户
2. **API设计**：RESTful风格的API
   - `POST /api/share` - 创建分享
   - `GET /api/share/:id` - 获取分享内容
   - `DELETE /api/share/:id` - 删除分享
   - `GET /api/shares` - 获取用户的所有分享

## 🧪 测试指南

1. **单元测试**：
   - 使用 Vitest 作为测试运行器
   - 测试文件位于 `test/` 目录
   - 使用 happy-dom 模拟浏览器环境

2. **测试类型**：
   - API接口测试
   - 组件单元测试
   - 工具函数测试

3. **测试命令**：
   - `npm run test`: 运行所有测试
   - `npm run test:watch`: 开发模式下监听文件变化并运行测试

4. **编写测试**：
   - 测试文件使用 `.test.ts` 或 `.spec.ts` 后缀
   - 使用 `describe` 和 `it` 组织测试用例
   - 使用 `expect` 进行断言

## 📚 相关资源

- [Nuxt.js 文档](https://nuxt.com/docs)
- [Vue 3 文档](https://vuejs.org/guide/introduction.html)
- [vue-json-pretty 文档](https://github.com/leezng/vue-json-pretty)
- [Vitest 文档](https://vitest.dev/)
- [Docker 文档](https://docs.docker.com/)
