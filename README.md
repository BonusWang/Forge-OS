# ASCII Life OS (ALO)

> **你的人生，值得一款操作系统。**
>
> 把混沌的日常拆成可量化的数值，像玩 RPG 一样训练自己，用一套集成工具把「想做的事」真正推进到「已完成」。

<!-- 仓库创建后，取消下方徽章注释 -->
<!-- [![Release](https://img.shields.io/github/v/release/maverickgao8848/matrix-life-os)](https://github.com/maverickgao8848/matrix-life-os/releases) -->
<!-- [![Platform](https://img.shields.io/badge/platform-Windows%20%7C%20macOS-blue)]() -->
<!-- [![License](https://img.shields.io/github/license/maverickgao8848/matrix-life-os)](LICENSE) -->
---
<img width="2713" height="1572" alt="image" src="https://github.com/user-attachments/assets/03f83d9d-9d28-40b6-9741-59136970861e" />

<img width="2666" height="1518" alt="image" src="https://github.com/user-attachments/assets/6bac0af2-317b-4d69-a599-ec4529cb67da" />

<img width="2717" height="1463" alt="image" src="https://github.com/user-attachments/assets/1f302fa5-0eca-4b0c-9835-2f55069a4c2a" />


---

## 这不是又一个 Todo App

市面上有无数待办工具，但它们只解决**记录**，不解决**成长**。

ALO 的核心设计是：**把「自我管理」变成一套可观测、可训练、可复盘的操作系统**。

- 🎮 **能力数值化** — 像 RPG 角色面板一样，把领导力、执行力、创造力等维度量化为可追踪的数值，定期训练、直观成长
- 🧩 **多工具集成** — 周看板、月度反思、OKR 追踪、原则面板、能力训练、娱乐管理……不再在 5 个 App 之间切来切去
- 🖥️ **ASCII 终端美学** — 没有花里胡哨的渐变，只有克制、专注、有点酷的终端风格界面
- 🔒 **数据完全本地** — 不上传云端，所有数据保存在你的电脑里，支持导出/导入 JSON 备份

<!-- TODO: 替换为实际应用截图 -->
<!-- ![Dashboard](./docs/screenshot-dashboard.png) -->
<!-- ![Reflection](./docs/screenshot-reflection.png) -->

---

## 下载安装

| 平台 | 下载 | 说明 |
|------|------|------|
| **Windows** | [Releases](https://github.com/maverickgao8848/matrix-life-os/releases) 下载 `.exe` | 便携版，双击即用，无需安装 |
| **macOS** | [Releases](https://github.com/maverickgao8848/matrix-life-os/releases) 下载 `.dmg` | 拖拽到「应用程序」文件夹即可 |

> **macOS 用户注意**：当前版本未进行 Apple 开发者签名，首次打开时可能会看到「无法验证开发者」提示。请前往 **系统设置 → 隐私与安全性** → 找到 ALO → 点击 **「仍要打开」**。或在终端执行：
> ```bash
> xattr -cr /Applications/ASCII\ Life\ OS.app
> ```

---

## 功能模块一览

| 模块 | 作用 |
|------|------|
| **周看板** | 任务拖拽管理 + 本周进度追踪 + 四象限筛选 |
| **能力雷达** | 自定义维度，定期打分，可视化成长曲线 |
| **能力训练** | 针对弱项制定训练计划，记录每次训练日志 |
| **OKR 面板** | 目标与关键结果追踪，拆解长期愿景为季度/月度行动 |
| **反思库** | 月度复盘、情绪记录、标签筛选，构建个人知识库 |
| **原则面板** | 写下你的决策原则，在迷茫时给自己一份锚定 |
| **娱乐追踪** | 记录游戏/影视/阅读，平衡奋斗与放松 |
| **数据备份** | 一键导出全部数据为 JSON，换电脑不丢档 |

---

## 技术栈

| 层级 | 技术 |
|------|------|
| 前端框架 | React 19 + TypeScript |
| 构建工具 | Vite |
| 状态管理 | Zustand + persist 中间件 |
| 样式方案 | CSS Variables（深色 / 浅色双主题） |
| 桌面端 | Electron + electron-builder |
| 拖拽交互 | @dnd-kit |

---

## 开发环境

```bash
# 克隆仓库
git clone https://github.com/maverickgao8848/matrix-life-os.git
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
├── build/              # 应用图标（electron-builder 自动生成 .ico / .icns）
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
└── ...
```

---

## 数据存储

所有数据保存在操作系统标准的用户数据目录，**不上传任何服务器**：

- **Windows**: `%APPDATA%/ASCII Life OS/`
- **macOS**: `~/Library/Application Support/ASCII Life OS/`

支持通过应用内「数据备份」面板随时导出/导入 JSON 备份文件。

---

## 开源协议

[MIT](LICENSE)
