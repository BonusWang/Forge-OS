# Forge-OS

> Forge yourself —— 自己锻造自己

Forge-OS 是一个本地优先的个人成长操作系统。它以“确认目标、周执行、月成长”为核心节奏，把任务、OKR、能力训练、反思沉淀和数据备份放在同一个工作台里，帮助使用者把每天的行动逐步锻造成长期能力。

## 二次开发说明

本仓库是对原项目的 fork 二次开发版本。

- 当前维护仓库: <https://github.com/BonusWang/Forge-OS>
- Fork 来源项目: <https://github.com/maverickgao8848/matrix-life-os>
- 当前发布版本: `v1.0.4`

本版本在原有 ASCII Life OS 的基础上进行了品牌、视觉、数据持久化和复盘工作流调整。原项目的基础能力仍被保留，Forge-OS 版本重点强化本地数据稳定性、中文使用体验、目标确认和长期成长规划。

## v1.0.4 发布重点

- 修复浏览器页面滚动后点击日历日期时，详情弹出框远离日期格的问题。
- 今日进度条改为 CSS 轨道和填充层，不再使用 `░` 字符绘制未完成部分。
- 今日进度条在卡片内扩展到约 80% 可用宽度，减少大面积空白。
- OpenSpec 已补充并归档周看板交互显示细节规格，正式规格保存在 `openspec/specs/`。

## 功能模块

| 模块 | 作用 |
| --- | --- |
| 周看板 | 按周组织任务，支持拖拽、完成状态和收纳箱 |
| 周复盘 | 一周一页，记录完成、卡点和下周调整 |
| 反思库 | 保存每日反思和周复盘沉淀，支持标签识别 |
| 月度 OKR | 管理目标和关键结果，将长期方向拆成月度行动 |
| 能力系统 | 管理能力项、训练任务和能力阅读面板 |
| 原则面板 | 保存个人决策原则 |
| 模块系统 | 按需启用日历、习惯、心情、灵感、娱乐、时间块等模块 |
| 数据备份 | 本地数据导出、导入和回滚辅助 |
| COS 数据同步 | 通过腾讯云 COS 进行云端备份、恢复、冲突处理和跨端同步 |
| 移动端工作台 | Android 和窄屏网页下的今日、推进、记录、系统入口 |

## 数据存储

Forge-OS 默认不上传任何个人数据。当前本地数据仍固定保存在：

```text
%APPDATA%\Forge\alo-data.json
```

历史兼容说明：

- 旧版数据可能位于 `%APPDATA%\ascii-life-os\alo-data.json`。
- 当 Forge 数据文件不存在时，应用会尝试从旧目录迁移一次。
- 虽然项目展示名已改为 `Forge-OS`，但数据目录继续保留 `%APPDATA%\Forge`，避免改名造成数据丢失。
- 只有显式传入 `--reset-data`、`--clear-data` 或 `FORGE_RESET_DATA=1` 时，才允许清理数据文件。
- Android App 使用应用私有本地存储；未配置 COS 或网络不可用时仍可离线读写。
- COS 同步为可选能力，手动 Access Key 和 Secret Access Key 不会写入云端同步快照。

## 开发环境

```bash
npm install
npm run dev
npm run build
npm run electron:build
npm run android:build
npm run android:smoke
npm run cos:signer
```

开发页 `http://127.0.0.1:5173/` 会通过 Vite 本地接口读写同一份 `%APPDATA%\Forge\alo-data.json`，因此开发调试和 Electron 运行看到的数据应保持一致。

## 技术栈

| 层级 | 技术 |
| --- | --- |
| 前端 | React 19 + TypeScript |
| 构建 | Vite |
| 状态管理 | Zustand + persist |
| 桌面端 | Electron + electron-builder |
| 拖拽 | @dnd-kit |
| 需求流程 | OpenSpec |

## 发布

本仓库使用 GitHub Actions 在推送 `v*` tag 时触发 Electron 打包和 GitHub Release 发布。

```bash
git tag v1.0.4
git push origin v1.0.4
```

Release 页面：<https://github.com/BonusWang/Forge-OS/releases>

## 项目结构

```text
Forge-OS/
├── electron/           # Electron 主进程与 preload
├── openspec/           # OpenSpec 规格、归档需求和工作流文档
├── public/             # 静态资源
├── src/
│   ├── components/     # 通用组件
│   ├── features/       # 功能模块
│   ├── hooks/          # 自定义 Hooks
│   ├── pages/          # 页面
│   ├── store/          # Zustand Store
│   ├── types/          # TypeScript 类型
│   └── utils/          # 工具函数
└── .github/workflows/  # GitHub Actions 发布流程
```

## 开源协议

[MIT](LICENSE)
