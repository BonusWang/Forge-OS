# ASCII Life OS (ALO)

一个基于 Electron + React + Vite 构建的个人生活管理系统，采用 ASCII 艺术风格的终端界面设计。

## 功能模块

- **周看板 (Dashboard)** — 任务管理、能力雷达、数据备份、娱乐追踪、原则面板
- **反思库 (Reflection)** — 月度计划、能力训练、反思记录与筛选

## 技术栈

- **前端**: React 19 + TypeScript + Vite
- **状态管理**: Zustand + persist 中间件
- **样式**: CSS Variables（双主题：深色/浅色）
- **桌面端**: Electron + electron-builder
- **拖拽**: @dnd-kit

## 开发命令

```bash
# 安装依赖
npm install

# 开发模式
npm run dev

# 构建
npm run build

# 打包 Electron 应用
npm run electron:build
```

## 项目结构

```
matrix-app/
├── electron/          # Electron 主进程
├── public/            # 静态资源
├── src/
│   ├── components/    # 通用组件
│   ├── features/      # 功能模块
│   ├── hooks/         # 自定义 Hooks
│   ├── pages/         # 页面
│   ├── store/         # Zustand Store
│   ├── types/         # TypeScript 类型
│   └── utils/         # 工具函数
└── ...
```

## 数据持久化

所有数据通过 Zustand 的 `persist` 中间件自动保存到 `localStorage`，支持导出/导入备份。
