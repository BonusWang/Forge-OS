# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

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
