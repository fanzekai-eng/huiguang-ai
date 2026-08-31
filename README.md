# 绘光 AI · AI 图片生成网站

> 不懂 Prompt 也能 10 秒生成一张专业图片：勾选图片类型、比例、风格、场景、留白，输入主体，系统自动组装成专业英文提示词，调用 AI 绘图 API 生成图片。

## ✨ 功能特性

- **模板直达**：内置 10 个热门模板（微信头像、手机壁纸、小红书封面、电商主图、PPT 配图等），点击自动填好所有选项，改一句话即可生成
- **可视化勾选生成**：图片类型 / 比例 / 风格 / 场景 / 留白 5 组选项，全部中文界面，无需任何 Prompt 基础
- **专业提示词引擎**：勾选项自动组装成结构化英文提示词（`promptBuilder`），生成前实时预览、可复制
- **积分系统**：每天签到领 5 积分，每生成一张扣 1 分，先扣后生成、失败自动退还；积分不足引导签到，签到后用尽弹出升级提示（预留入口）
- **生成历史**：缩略图网格 + 统计卡片，可查看大图、查看当时选项与提示词、下载图片
- **手机号登录**：第一版用模拟验证码（固定 `123456`），后续可无缝切换真实短信

## 🛠 技术栈

- **框架**：Next.js 16（App Router + TypeScript + Tailwind CSS 4）
- **数据库**：Prisma + SQLite（本地开发）；部署时切换 Neon Postgres
- **认证**：JWT（jose）+ httpOnly Cookie
- **绘图 API**：默认硅基流动（FLUX.1-schnell，免费），支持一键切换智谱（CogView-3-Flash）

## 🚀 本地运行

```bash
npm install
npx prisma migrate dev --name init   # 初始化数据库
cp .env.example .env                  # 填写 IMAGE_API_KEY
npm run dev                           # 打开 http://localhost:3000
```

登录页显示的模拟验证码为 `123456`。

## 🔑 获取绘图 API Key

### 方式一：硅基流动（推荐，免费）

1. 注册 [硅基流动](https://cloud.siliconflow.cn)（手机号即可，免信用卡）
2. 控制台 → API 密钥 → 创建密钥
3. 填入 `.env`：`IMAGE_PROVIDER="siliconflow"`、`IMAGE_API_KEY="你的密钥"`

FLUX.1-schnell 每天 400 次免费调用，足以支撑个人站运营。

### 方式二：智谱 AI

1. 注册 [智谱开放平台](https://open.bigmodel.cn)
2. 控制台 → API Keys → 创建密钥
3. 填入 `.env`：`IMAGE_PROVIDER="zhipu"`、`IMAGE_API_KEY="你的密钥"`

CogView-3-Flash 官方标注免费。

## 📦 部署（Vercel）

1. 推送代码到 GitHub 仓库
2. [Vercel](https://vercel.com) 导入仓库，自动部署
3. 配置环境变量：`DATABASE_URL`（Neon Postgres 连接串）、`AUTH_SECRET`（随机长字符串）、`IMAGE_API_KEY`
4. 数据库迁移：本地执行 `npx prisma migrate deploy` 指向生产库，或在 Vercel 构建脚本中执行

## 📁 目录结构

```
src/
├── app/
│   ├── page.tsx              # 首页（模板区 + CTA）
│   ├── generate/             # 生图页（勾选表单 + 结果区）
│   ├── history/              # 生成历史
│   ├── login/                # 登录页（手机号 + 模拟验证码）
│   └── api/
│       ├── auth/             # 发送验证码 / 登录 / 退出 / me
│       ├── generate/         # 生成接口（鉴权 → 扣分 → 调 API → 存库）
│       ├── history/          # 历史列表
│       └── images/[id]/      # 图片输出
├── components/               # 导航栏、升级弹窗、认证 Provider
└── lib/
    ├── promptBuilder.ts      # ★ 提示词组装引擎
    ├── options.ts            # 勾选项配置（类型/比例/风格/场景/留白）
    ├── templates.ts          # 10 个热门模板
    ├── imageApi.ts           # ★ 绘图 API 适配层（硅基流动/智谱）
    └── auth.ts / session.ts  # JWT 签发与校验
```

## 📄 License

MIT
