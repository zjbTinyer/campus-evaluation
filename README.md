# 🏫 校园评价系统 (Campus Evaluation System)

> **以自然语言搜索为主入口的 AI 驱动校园门户** — 家长不用翻菜单，直接输入问题获取信息。

## ✨ 核心亮点

- 🔍 **自然语言搜索** — 输入"小明最近数学怎么样？"直接得到答案，不翻菜单
- 🤖 **NL Search Agent** — 意图识别 → 实体提取 → Tool 选择 → 并行执行 → 回复生成
- 🔔 **智能通知** — 新评语、请假审批、任务提醒、活动通知，主动推送到首页
- 📱 **移动端优先** — 微信内嵌浏览器友好的 H5 设计

## 🏗️ 技术架构

```
┌─────────────────────────────────────────┐
│  React 18 + TypeScript + Ant Design 5   │  ← 前端 H5
│  底部导航: 搜索 | 通知 | 首页 | 我的      │
└──────────────────┬──────────────────────┘
                   │ JWT + REST API
┌──────────────────┴──────────────────────┐
│       Spring Boot 2.7 (Java)            │  ← 后端
│  ┌──────────────────────────────────┐   │
│  │  NL Search Agent (核心)          │   │
│  │  Intent → Entity → Tool → Reply  │   │
│  └──────────────────────────────────┘   │
│  评语 | 荣誉 | 任务 | 请假 | 活动 | 档案 │
└──────────────────┬──────────────────────┘
                   │
┌──────────────────┴──────────────────────┐
│  MySQL 8.0 | Redis | Elasticsearch 8.x  │  ← 数据层
└─────────────────────────────────────────┘
```

## 📦 项目结构

```
campus-evaluation/
├── campus-evaluation-server/     # Spring Boot 后端 (52 Java 文件)
│   └── src/main/java/com/campuseval/
│       ├── agent/                # 🔥 NL Search Agent 核心
│       │   ├── AgentOrchestrator.java   # 状态机中枢
│       │   ├── IntentClassifier.java    # 意图分类 (正则+LLM)
│       │   ├── EntityExtractor.java     # 实体提取
│       │   ├── ToolRegistry.java        # 10个Tool注册
│       │   └── ResponseGenerator.java   # 回复生成
│       ├── llm/                  # 通义千问/DeepSeek 集成
│       ├── search/               # ES 搜索 + 文档索引
│       ├── notification/         # 通知系统
│       ├── controller/           # REST API
│       ├── model/entity/         # 15张表实体
│       └── security/             # JWT 认证
│
└── campus-evaluation-web/        # React 前端 (30 源文件)
    └── src/
        ├── pages/search/         # 🔥 搜索页 (默认首页)
        ├── pages/                # 评语|荣誉|任务|请假|活动|档案|个人
        ├── components/           # StudentSwitcher, NotificationPanel
        ├── contexts/             # Auth, Student, Notification
        ├── hooks/                # useAgentQuery, useSSEAgent
        └── api/                  # Axios + Mock
```

## 🚀 快速启动

### 前端 Demo（Mock 数据，无需后端）

```bash
cd campus-evaluation-web
npm install
npm run dev
# 打开 http://localhost:5173/
```

登录页输入任意手机号+密码即可进入，试试这些搜索词：
- `小明最近数学怎么样？`
- `获得了哪些荣誉？`
- `有什么任务需要完成？`
- `有什么活动？`
- `上学期档案`

### 后端（需要 Maven + MySQL + Redis）

```bash
cd campus-evaluation-server

# 1. 创建数据库
mysql -u root -p -e "CREATE DATABASE campus_evaluation DEFAULT CHARSET utf8mb4"

# 2. 配置 application.yml 中的数据库连接

# 3. 启动 (Flyway 自动建表)
mvn spring-boot:run
```

### 环境变量

| 变量 | 说明 | 默认值 |
|------|------|--------|
| `DB_PASSWORD` | MySQL 密码 | root |
| `REDIS_PASSWORD` | Redis 密码 | (空) |
| `JWT_SECRET` | JWT 签名密钥 | campus-evaluation-jwt-secret-key-2026 |
| `LLM_API_KEY` | 通义千问/DeepSeek API Key | (空) |
| `LLM_PROVIDER` | LLM 提供商 | qwen |

## 🔧 关键技术决策

| 决策 | 选择 | 原因 |
|------|------|------|
| Agent 位置 | 后端（非前端直调 LLM） | 不暴露 API Key，缓存友好 |
| 意图分类 | 正则优先 → LLM 兜底 | 80%查询命中正则，零延迟零成本 |
| 通知推送 | 轮询（MVP）→ SSE（后期） | 微信 WebView 兼容性最好 |
| WRITE 操作 | 必须确认后才执行 | 防止误打卡、误请假 |
| Tool 执行 | 独立 Tool 并行调用 | 多意图查询同时执行 |

## 📊 数据库 (15张表)

```
parent ──1:N── parent_student ──N:1── student
student ──1:N── teacher_evaluation
student ──1:N── honor
student ──1:N── task ──1:N── task_checkin
student ──1:N── leave_application
student ──N:M── activity_registration ──M:1── school_activity
student ──1:N── archive_record
parent ──1:N── notification
```

## 📋 API 概览

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | `/api/v1/agent/query` | **NL 搜索主入口** |
| POST | `/api/v1/agent/stream` | SSE 流式响应 |
| POST | `/api/v1/auth/login` | 手机号登录 |
| GET | `/api/v1/dashboard/overview` | 综合概览 |
| GET | `/api/v1/notifications/unread-count` | 未读计数（轮询） |

## 🧠 Agent 设计原则

本项目遵循 [Agent 设计七大原则](https://github.com/zjbTinyer/campus-evaluation)：

1. **系统设计** — 状态机驱动，Tool 原子化
2. **工具设计** — 严格 JSON Schema，枚举值写死
3. **检索工程** — 结构化数据→文本文档→ES hybrid search
4. **可靠性** — LLM→正则降级，ES→MySQL FULLTEXT 降级
5. **安全** — JWT 权限边界 + WRITE 确认 + 输入校验
6. **可观测性** — 全链路日志 + 意图置信度 + 耗时追踪
7. **产品思维** — 无数据给建议，歧义列选项，搜索框是首页

---

🤖 Generated with [Claude Code](https://claude.com/claude-code)
