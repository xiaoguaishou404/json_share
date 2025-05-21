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
  - 虚拟滚动优化：
    - 采用 虚拟列表方案 实现大型 JSON 数据的高效渲染
    - 仅渲染可视区域内的 JSON 节点，显著减少 DOM 节点数量
    - 滚动时动态加载和卸载节点，保持流畅的滚动体验
    - 支持处理超过 10MB 的大型 JSON 文件而不卡顿
- **用户管理**：简化的用户标识系统，无需登录即可管理个人分享记录
- **分享管理**：查看、删除个人创建的分享链接

## 🔧 技术栈

- **前端**：
  - Nuxt.js 3.17.3 
  - TypeScript 5.8.3
  - vue-json-pretty 2.3.0
  - Nuxt UI 3.1.2
  - Tailwind CSS 4.1.7
  - Pinia 2.1.7
  
- **后端**：
  - Nuxt 服务器API
  - MySQL 8.0
  
- **测试框架**：
  - Vitest
  - @nuxt/test-utils
  - happy-dom (浏览器环境模拟)
  
- **部署与运行环境**：
  - Docker 和 Docker Compose
  - Nginx（反向代理）
  - Cloudflare（HTTPS/CDN，提供免费 SSL 证书和全球加速）


### dev开发环境脚本

```bash
./dev.sh
```

### test本地测试用例运行+docker本地nuxtJS打包运行脚本
```bash
./test.sh
```

#### prod服务器部署
**GitHub Actions 工作流核心逻辑**：
此工作流程会：
1. 在推送到 main 分支时触发CI/CD流程
2. 检出代码并设置 Node.js 环境
3. 安装项目依赖并运行测试
4. 登录到 Docker Hub
5. 构建生产环境 Docker 镜像并推送
6. SSH 连接到生产服务器
7. 更新环境变量并重新部署服务


**GitHub Secrets配置**：
- `DOCKER_USERNAME`：Docker Hub用户名
- `DOCKER_PASSWORD`：Docker Hub密码
- `SERVER_HOST`：服务器主机地址
- `SERVER_USERNAME`：服务器用户名
- `SERVER_SSH_KEY`：服务器SSH私钥
- `ENV_FILE`：环境配置文件内容如下：

```env
# 环境配置
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
```


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

1. **技术选型**：
   - 使用 Vitest 作为测试运行器
   - 测试文件位于 `test/` 目录
   - 使用 happy-dom 模拟浏览器环境

2. **测试命令**：
   - `npm run test`: 运行所有测试
   - `npm run test:watch`: 开发模式下监听文件变化并运行测试

## 📚 相关资源

- [Nuxt.js 文档](https://nuxt.com/docs)
- [Vue 3 文档](https://vuejs.org/guide/introduction.html)
- [vue-json-pretty 文档](https://github.com/leezng/vue-json-pretty)
- [Vitest 文档](https://vitest.dev/)
- [Docker 文档](https://docs.docker.com/)

## 🤖 AI 辅助开发总结

### 使用的 AI 工具
- **Cursor IDE**: 提供了强大的 AI 代码理解和重构能力
- **ChatGPT**: 网页版的 ChatGPT 更聪明，在方案选型和查阅官方文档时更准确

### AI 辅助的具体环节

#### 1. 架构设计阶段
在设计数据库时，我主要让 AI 帮我思考了用户分享数据的存储结构。通过多轮讨论，确定了用 JSON 类型字段存储内容，还特意加了过期时间索引来优化查询。API 接口设计上，AI 帮我梳理了一套清晰的 RESTful 风格的路由，包括错误处理和状态码的规范。

#### 2. 前端实现阶段
选择 JSON 预览组件时，和 AI 讨论了好几个方案，最终看中了 vue-json-pretty 的功能特性。状态管理这块用 Pinia，AI 帮我设计了 store 的结构，特别是用户标识这块，想了个用 LocalStorage 存 UUID 的简单方案。

#### 3. 测试和性能优化
测试方面，AI 给了不少实用的测试用例模板，特别是一些边界情况的测试建议很受用。性能这块主要是处理大 JSON 文件时遇到了些问题，AI 帮我分析了几种优化方案，包括如何监控性能指标。

### AI 交互要点
- 会使用到 cursor 的 rules、Docs、Notepads 等功能
- 先使用 Ask 技术选型，包括方案选型和常见的一些沟通
- 确定好方案之后使用 agent 的模式进行执行
- 一个功能需求开发开启一次对话
- 在 cursor 里面 AI 会降智，但是他的记忆力会增强，经常需要使用网页版的 GPT4 来进行困难问题的沟通
- 网页版的 GPT 的思考能力和查阅官方文档能力是一流的

### 输出结果处理
- 要求每次最小化的改动代码
- 使用 git 每次保存代码，返回回退
- 保留关键注释和文档说明

### 经验总结

#### AI 最有价值的方面
1. 扩展思维，扩展解决方案
2. 提供多种技术方案的对比分析
3. 生成完整的文档框架

#### 遇到的挑战
1. AI 可能生成过时或不准确的依赖版本
2. 需要人工验证性能优化建议
3. 复杂业务逻辑需要多轮对话才能准确表达
4. 某些特定场景下的代码生成质量不稳定

### 总体评估


AI 可以扩展你的思维给你很多以前从来不知道的解决方案，但是要时刻注意 AI 的幻觉，他经常会创造出一些根本不存在的 API 或者是一些解决方案来误导你。

AI 的前景是巨大的在于现在的传统开发模式并不能完美的解决问题，但是后面可能会出现一批更适合 AI 的框架和技术，如果让 AI 写代码写得爽写得舒服，那时候 AI 的能力将进一步跨越。
今天此刻AI 工具极大提升了开发效率，但仍需要开发者的专业判断和必要的人工验证，将 AI 视为强大的辅助工具而非完全替代者。