# ASCII Life OS (ALO)

> 一个基于 Electron + React 构建的个人生活管理系统，采用 ASCII 艺术风格的终端界面设计。

<!-- 仓库创建后，取消下方徽章注释并替换 owner/repo -->
<!-- [![Release](https://img.shields.io/github/v/release/OWNER/REPO)](https://github.com/OWNER/REPO/releases) -->
<!-- [![Platform](https://img.shields.io/badge/platform-Windows%20%7C%20macOS-blue)]() -->
<!-- [![License](https://img.shields.io/github/license/OWNER/REPO)](LICENSE) -->

---

## 下载安装

| 平台 | 下载方式 | 说明 |
|------|----------|------|
| **Windows** | [Releases](https://github.com/OWNER/REPO/releases) 下载 `.exe` | 便携版，双击即用，无需安装 |
| **macOS** | [Releases](https://github.com/OWNER/REPO/releases) 下载 `.dmg` | 拖拽安装到「应用程序」文件夹 |

> **macOS 用户注意**：当前版本未进行 Apple 开发者签名，首次打开时可能会看到「无法验证开发者」提示。请前往 **系统设置 → 隐私与安全性** → 找到 ALO → 点击 **「仍要打开」**。
>
> 或在终端执行：
> ```bash
> xattr -cr /Applications/ASCII\ Life\ OS.app
> ```

---

## 功能特性

- **周看板 (Dashboard)** — 任务管理、能力雷达、数据备份、娱乐追踪、原则面板
- **反思库 (Reflection)** — 月度计划、能力训练、反思记录与筛选
- **双主题** — 深色 / 浅色模式一键切换
- **数据安全** — 本地自动持久化，支持导出/导入 JSON 备份
- **离线运行** — 无需网络，所有数据保存在本地

<!-- TODO: 替换为实际应用截图 -->
<!-- ![Dashboard](./docs/screenshot-dashboard.png) -->
<!-- ![Reflection](./docs/screenshot-reflection.png) -->

---

## 技术栈

| 层级 | 技术 |
|------|------|
| 前端框架 | React 19 + TypeScript |
| 构建工具 | Vite |
| 状态管理 | Zustand + persist 中间件 |
| 样式方案 | CSS Variables（双主题） |
| 桌面端 | Electron + electron-builder |
| 拖拽交互 | @dnd-kit |

---

## 开发环境

```bash
# 克隆仓库
git clone https://github.com/OWNER/REPO.git
cd matrix-app

# 安装依赖
npm install

# 开发模式（热更新）
npm run dev

# 构建前端资源
npm run build

# 本地打包 Electron 应用
npm run electron:build
```

---

## 项目结构

```
matrix-app/
├── build/              # 应用图标（electron-builder 自动转换为 .ico / .icns）
├── electron/           # Electron 主进程
│   ├── main.cjs        # 主进程入口
│   └── preload.cjs     # 预加载脚本
├── public/             # 静态资源
├── src/
│   ├── components/     # 通用组件
│   ├── features/       # 功能模块
│   ├── hooks/          # 自定义 Hooks
│   ├── pages/          # 页面
│   ├── store/          # Zustand Store
│   ├── types/          # TypeScript 类型
│   └── utils/          # 工具函数
├── .github/workflows/  # CI/CD 自动化发布
├── package.json
└── ...
```

---

## 数据存储

所有数据保存在操作系统标准的用户数据目录：

- **Windows**: `%APPDATA%/ASCII Life OS/`
- **macOS**: `~/Library/Application Support/ASCII Life OS/`

支持通过应用内「数据备份」面板导出/导入 JSON 备份文件。

---

## 开源协议

[MIT](LICENSE)
