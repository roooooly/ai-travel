# AI旅行家 - 技术方案

> Version: 0.2
> 创建日期: 2026-03-24
> 状态: 草稿（单人本地开发版）

---

## 一、技术可行性分析

### 1.1 技术栈评估（单人开发者）

| 技术 | 选型 | 可行性 | 风险 | 备注 |
|------|------|--------|------|------|
| 前端-Web | Next.js 14 (App Router) | ✅ 高 | 低 | React生态成熟，全栈友好，单人可覆盖前后端 |
| 后端框架 | FastAPI | ✅ 高 | 低 | 异步AI集成方便，自动文档 |
| 数据库 | PostgreSQL 15 + pgvector | ✅ 高 | 低 | 向量检索内置，一站式 |
| 缓存 | Redis 7 | ✅ 高 | 低 | 会话/热点缓存 |
| AI-LLM | DeepSeek-V3 | ✅ 高 | 中 | API稳定，成本低 |
| AI-Embedding | DeepSeek-Embeddings | ✅ 高 | 低 | 文本向量化 |
| 地图 | 高德地图 | ✅ 高 | 中 | 免费额度充足 |
| 天气 | 和风天气 | ✅ 高 | 低 | 免费额度充足 |
| 文件存储 | 本地MinIO / 阿里云OSS | ✅ 高 | 低 | MVP用本地即可 |

### 1.2 单人开发关键技术选型理由

| 层级 | 推荐 | 替代方案 | 理由 |
|------|------|---------|------|
| 前端 | Next.js | Nuxt/Remix | 全栈框架，前后端同仓库，减少上下文切换 |
| 后端 | FastAPI | Flask | 异步支持好，AI集成方便 |
| 数据库 | PostgreSQL + pgvector | SQLite + Chroma | pgvector内置向量，避免多系统 |
| AI | DeepSeek API | OpenAI | 成本低，中文支持好 |
| 部署 | Docker Compose | K8s | 单机运维简单 |

### 1.3 核心能力边界

**✅ MVP可实现（单人）：**
- AI行程生成（基于LLM + RAG知识库）
- 景点/美食推荐（基于向量检索）
- 天气查询（定时任务）
- 高德地图导航集成
- 用户打卡成就系统

**⚠️ 单人需注意：**
- 前后端同时开发，上下文切换损耗
- 数据准备耗时（苏州+上海+杭州）
- 调试周期长，问题定位慢
- 建议：严格控制MVP范围

**❌ 暂不推荐（单人MVP）：**
- 真正"本地人视角"需要大量人工维护
- 实时库存/票务需对接供应商API
- 复杂社区功能需内容审核系统

---

## 二、系统架构（本地开发版）

### 2.1 整体架构图

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              用户终端                                         │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐              │
│  │  微信小程序      │  │   Web (Next.js) │  │   H5 (响应式)    │              │
│  │  (后续)          │  │   localhost:3000│  │   localhost:3000 │              │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘              │
└───────────┬─────────────────────┬─────────────────────┬─────────────────────┘
            │ localhost:8000       │ localhost:8000        │
            ▼                      ▼                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                          本地开发环境 (Docker Compose)                        │
│                                                                             │
│  ┌───────────────────┐  ┌───────────────────┐  ┌───────────────────┐      │
│  │   Next.js         │  │   FastAPI          │  │   AI Service      │      │
│  │   端口: 3000      │  │   端口: 8000        │  │   (集成在FastAPI)  │      │
│  │                   │  │                     │  │                   │      │
│  │   - SSR页面       │  │   - 业务API         │  │   - LLM调用       │      │
│  │   - API调用       │  │   - 数据CRUD        │  │   - RAG检索       │      │
│  │                   │  │   - 第三方集成       │  │                   │      │
│  └───────────────────┘  └─────────────────────┘  └─────────────────────┘      │
│                                    │                                         │
│         ┌──────────────────────────┼──────────────────────────┐             │
│         ▼                          ▼                          ▼             │
│  ┌───────────────────┐  ┌───────────────────┐  ┌───────────────────┐          │
│  │   PostgreSQL 5432 │  │   Redis 6379       │  │   MinIO 9000      │          │
│  │   + pgvector      │  │                    │  │   (本地文件存储)   │          │
│  │                    │  │   - Session        │  │                   │          │
│  │   - 用户数据       │  │   - 热点缓存        │  │   - 图片存储      │          │
│  │   - 景点/美食      │  │   - AI限流          │  │   - 静态资源      │          │
│  │   - 行程数据       │  │   - 实时数据        │  │                   │          │
│  │   - 知识库向量     │  │                    │  │                   │          │
│  └───────────────────┘  └───────────────────┘  └───────────────────┘          │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 2.2 服务职责划分（单人开发简化版）

| 服务 | 职责 | 关键技术 |
|------|------|----------|
| Next.js | 端口:3000 | SSR、Web端、全栈 |
| FastAPI | 端口:8000 | 业务API、AI服务、CRUD |
| PostgreSQL | 端口:5432 | 主数据库 + 向量 |
| Redis | 端口:6379 | 缓存、会话、限流 |
| MinIO | 端口:9000 | 本地文件存储(替代OSS) |

### 2.3 部署架构（本地Docker Compose）

```
WSL2/Linux/macOS
│
└── docker-compose.yml
    ├── web (Next.js)
    ├── api (FastAPI)
    ├── db (PostgreSQL + pgvector)
    ├── redis (Redis)
    └── minio (MinIO)
```

---

## 三、本地开发环境配置

### 3.1 Docker Compose配置（本地MVP）

```yaml
version: '3.8'

services:
  api:
    build:
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=postgresql://ai_traveler:dev_password@db:5432/ai_traveler
      - REDIS_URL=redis://redis:6379
      - DEEPSEEK_API_KEY=${DEEPSEEK_API_KEY}
      - AMAP_KEY=${AMAP_KEY}
      - QWEATHER_KEY=${QWEATHER_KEY}
    depends_on:
      - db
      - redis
    volumes:
      - ./backend:/app
    command: uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload

  web:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://localhost:8000
    depends_on:
      - api
    volumes:
      - ./frontend:/app
      - /app/node_modules
    command: npm run dev

  db:
    image: postgis/postgis:15-3.3
    ports:
      - "5432:5432"
    environment:
      - POSTGRES_USER=ai_traveler
      - POSTGRES_PASSWORD=dev_password
      - POSTGRES_DB=ai_traveler
    volumes:
      - pgdata:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ai_traveler"]
      interval: 5s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redisdata:/data
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 5s
      timeout: 5s
      retries: 5

  minio:
    image: minio/minio
    ports:
      - "9000:9000"
      - "9001:9001"
    environment:
      - MINIO_ROOT_USER=minioadmin
      - MINIO_ROOT_PASSWORD=minioadmin
    volumes:
      - miniodata:/data
    command: server /data --console-address ":9001"

volumes:
  pgdata:
  redisdata:
  miniodata:
```

### 3.2 环境变量配置

```bash
# 根目录 .env 文件
DEEPSEEK_API_KEY=your_deepseek_api_key
AMAP_KEY=your_amap_key
QWEATHER_KEY=your_qweather_key

# 可选：微信小程序（后续）
WECHAT_APPID=your_appid
WECHAT_SECRET=your_secret
```

### 3.3 WSL2 支持情况

| 组件 | WSL2支持 | 备注 |
|------|---------|------|
| Docker Desktop | ✅ | 需启用WSL2 backend |
| PostgreSQL | ✅ | 官方镜像支持 |
| Redis | ✅ | 官方镜像支持 |
| Next.js | ✅ | Node.js原生支持 |
| FastAPI | ✅ | Python原生支持 |

**WSL2开发前提：**
```bash
# 1. 安装Docker Desktop with WSL2 backend
# 2. 确保WSL2内核更新
wsl --update

# 3. 启动开发
cd ai-traveler
docker-compose up -d
```

### 3.4 本地开发命令

```bash
# 启动全部服务
docker-compose up -d

# 查看服务状态
docker-compose ps

# 查看日志
docker-compose logs -f api
docker-compose logs -f web

# 进入后端容器
docker-compose exec api bash

# 数据库迁移
docker-compose exec api alembic upgrade head

# 停止服务
docker-compose down
```

---

## 四、API设计

### 4.1 MVP核心API（精简版）

| 方法 | 路径 | 说明 | 状态 |
|------|------|------|------|
| POST | /auth/login | 简单登录（无微信） | MVP |
| GET | /auth/me | 获取当前用户 | MVP |
| GET | /destinations | 目的地列表 | MVP |
| GET | /destinations/{id} | 目的地详情 | MVP |
| GET | /attractions | 景点列表（支持城市筛选） | MVP |
| GET | /attractions/{id} | 景点详情 | MVP |
| GET | /restaurants | 美食列表 | MVP |
| GET | /restaurants/{id} | 美食详情 | MVP |
| POST | /itineraries/generate | AI生成行程 | MVP |
| GET | /itineraries | 我的行程 | MVP |
| GET | /itineraries/{id} | 行程详情 | MVP |
| PUT | /itineraries/{id} | 更新行程 | MVP |
| DELETE | /itineraries/{id} | 删除行程 | MVP |
| GET | /weather/{city} | 天气预报 | MVP |
| GET | /checkins/spots/{attraction_id} | 景点打卡点 | MVP |

**延后功能（V1.1）：**
- 微信小程序登录
- 打卡成就系统
- AI对话
- 路线优化

---

## 五、数据策略（3城市）

### 5.1 数据优先级

| 阶段 | 城市 | 景点数 | 美食数 | 说明 |
|------|------|--------|--------|------|
| MVP | 苏州 | 30+ | 20+ | 核心数据，精耕细作 |
| V1.1 | 上海 | 30+ | 20+ | 可复用苏州结构 |
| V1.2 | 杭州 | 30+ | 20+ | 可复用苏州结构 |

### 5.2 数据来源

| 类型 | 来源 | 方式 | 苏州工作量 |
|------|------|------|----------|
| 景点基础信息 | 高德地图API | 批量导入 | 1-2天 |
| 景点详情 | 人工编辑/公开攻略 | 人工整理 | 3-5天 |
| 美食基础信息 | 大众点评/高德 | 批量导入 | 1-2天 |
| 美食详情 | 人工编辑 | 人工整理 | 2-3天 |
| AI知识库 | 以上数据整理 | 人工+脚本 | 2-3天 |

**预估：苏州完整数据准备 = 8-15天（单人）**

### 5.3 数据导入顺序

1. **基础数据（Day 1）**
   - 目的地（苏州、上海、杭州）
   - 景点基础信息（高德API）
   - 美食基础信息（高德API）

2. **详情补充（Day 2-5）**
   - 景点开放时间、门票、简介
   - 美食人均、招牌菜
   - 人工Tips

3. **AI知识库（Day 6-7）**
   - 景点/美食文档化
   - Embedding向量化
   - Prompt调优

---

## 六、技术栈最终推荐

### 6.1 推荐方案（单人MVP最优）

| 层级 | 技术 | 理由 |
|------|------|------|
| **前端** | Next.js 14 + TailwindCSS | 全栈友好，开发效率高 |
| **后端** | FastAPI + SQLAlchemy | 异步高效，AI集成方便 |
| **数据库** | PostgreSQL 15 + pgvector | 向量内置，减少系统复杂度 |
| **缓存** | Redis 7 | 必需 |
| **AI** | DeepSeek-V3 + DeepSeek-Embeddings | 成本低，效果好 |
| **地图** | 高德地图API | 国内数据全 |
| **天气** | 和风天气API | 免费额度充足 |
| **文件存储** | MinIO（本地）或阿里云OSS | MVP用MinIO |
| **部署** | Docker Compose | 单机足够 |

### 6.2 不推荐的方案（单人慎用）

| 方案 | 不推荐理由 |
|------|-----------|
| Spring Boot (Java) | 启动慢，配置复杂 |
| Django | ORM灵活但AI集成不便 |
| Vue/Nuxt | 组件生态不如React |
| MongoDB | 缺乏pgvector的向量支持 |
| Milvus/Qdrant | 多系统增加运维负担 |

### 6.3 为什么不换技术栈

- **FastAPI + Next.js**：全栈JavaScript/Python，减少语言切换
- **PostgreSQL + pgvector**：一站式数据库，避免多系统
- **DeepSeek**：API成本是OpenAI的1%，效果接近

---

## 七、安全设计（本地开发简化）

### 7.1 认证（MVP简化版）

```python
# MVP：简单JWT认证，不接入微信
# 后续再接微信登录

JWTPayload = {
  "user_id": 123,
  "exp": 1234567890
}
```

### 7.2 限流策略（本地可放宽）

| 接口 | 限制 | 窗口 |
|------|------|------|
| AI生成行程 | 10次/用户/天 | 自然日 |
| 搜索 | 100次/用户/分钟 | 分钟 |

---

## 八、本地开发 vs 云部署对比

| 项目 | 本地开发 | 云部署（后续） |
|------|---------|---------------|
| 成本 | ~0元（自己的电脑） | ~100-300元/月 |
| 访问 | 只能自己访问 | 可对外服务 |
| 微信小程序 | 需内网穿透 | 可直接对接 |
| 域名SSL | 可跳过 | 需要 |
| 数据备份 | 手动 | 自动 |
| 适用阶段 | MVP验证期 | 正式运营 |

**建议：先用本地开发验证核心功能，确认可行后再上云**

---

**文档版本**: 0.2
**更新内容**: 单人开发版架构、本地Docker配置、数据策略
