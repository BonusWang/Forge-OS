# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

## [1.0.1] - 2026-06-02

### Changed
- 统一周看板、反思库、周复盘和系统页的桌面工作台排版，减少中心空白和错位感。
- 周看板顶部今日模块调整为紧凑操作带，保留任务看板作为首屏主工作区。
- 周复盘改为顶部周导航工具条，加宽复盘编辑和本周证据的主工作区。
- 反思库能力区调整为辅助栏，系统页调整为 2x2 设置面板。
- 项目展示名调整为 `Forge-OS`，用于强化“确认目标、持续锻造自己”的产品定位。
- 本地远端仓库和 README 链接同步为 `BonusWang/Forge-OS`。
- 构建产物名调整为 `Forge-OS-${version}-${arch}.${ext}`。

### Fixed
- 修复情绪追踪已保存记录在刷新后仍可重复保存的问题。
- 修复 classic/orbit 风格切换导致页面业务结构和排版形态不一致的问题。

### Notes
- 数据目录继续保留 `%APPDATA%\Forge`，避免改名影响已有用户数据。

## [1.0.0] - 2026-06-02

### Added
- Forge 品牌与 `Forge yourself —— 自己锻造自己` slogan。
- orbit-general 参考风格与 `[◇ 风格切换]`。
- 独立“周复盘”页面，采用“一周一页”的 Wiki 式结构。
- 精简周复盘模板：完成、卡点、下周一件事。
- OpenSpec 正式规格与需求归档。

### Changed
- 功能模块标题、页面文案和 OpenSpec 模板进一步中文化。
- 开发页和 Electron 统一使用 `%APPDATA%\Forge\alo-data.json`。
- 启动时不再自动搬移或归档历史任务，避免跨天重启造成数据丢失感。
- orbit 风格下隐藏旧像素空状态图，保留原风格表现。

### Fixed
- 修复品牌改名和开发页运行方式不同导致的数据读取路径漂移。
- 修复 Vite 开发页空状态可能先覆盖本地持久化数据的问题。

## [0.1.0] - 2025-05-31

### Added
- 周看板 (Dashboard) — 任务管理、能力雷达、数据备份、娱乐追踪、原则面板
- 反思库 (Reflection) — 月度计划、能力训练、反思记录与筛选
- 双主题支持 — 深色 / 浅色模式切换
- 数据持久化 — 自动保存到本地，支持导出/导入备份
- 跨平台发布 — Windows (.exe) + macOS (.dmg / .zip)
