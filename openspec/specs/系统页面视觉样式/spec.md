# 系统页面视觉样式规范

## Purpose

本规范定义系统页面在原风格与 orbit-general 参考风格之间切换时的视觉、导航、交互和业务边界要求。能力目录和正文使用中文；OpenSpec 必需的结构关键字保持英文，以保证框架可以继续解析和校验。
## Requirements
### Requirement: Style toggle replaces separate new system page / 风格切换替代独立新系统页

系统 MUST（必须）使用 `[◇ 风格切换]` 在原风格和 orbit-general 参考风格之间切换，而不是通过 `[◇ 新系统]` 跳转到独立页面。

#### Scenario: Style toggle is available / 风格切换可用

- **WHEN** 用户查看顶部导航
- **THEN** 导航展示 `[◇ 风格切换]`
- **AND** 导航不展示 `[◇ 新系统]`

#### Scenario: Toggle returns to original style / 可切回原风格

- **WHEN** 用户在新风格下再次点击 `[◇ 风格切换]`
- **THEN** 系统切回原风格
- **AND** 当前功能页面保持在同一业务页面上

### Requirement: New style preserves existing functional navigation / 新风格保留现有功能导航

新风格 MUST（必须）保留周看板、反思库、系统页、模块管理和主题切换入口。

#### Scenario: New style navigation includes existing functions / 新风格导航包含现有功能

- **WHEN** 用户切换到新风格
- **THEN** 导航仍展示周看板、反思库、◇ 系统、[◇ 风格切换]、[⊕ 模块] 和主题切换按钮

#### Scenario: Original page state is reused / 复用原页面状态

- **WHEN** 用户在新风格下点击周看板、反思库或◇ 系统
- **THEN** 系统仍使用原有 `dashboard`、`reflection` 或 `system` 页面状态
- **AND** 不进入 `systemOrbit` 或其他新增业务页面状态

### Requirement: Style mode uses same data source and business logic / 风格模式使用同一数据源和业务逻辑

风格切换 MUST（必须）只改变视觉外壳和交互样式，不改变数据源或业务逻辑。

#### Scenario: Existing page components remain functional source / 原页面组件仍是功能来源

- **WHEN** 用户在任一风格下使用周看板、反思库或系统页
- **THEN** 功能仍由现有页面组件和 store 数据提供
- **AND** 不复制更新检查、数据备份、任务或反思等业务逻辑

#### Scenario: Data contracts remain unchanged / 数据契约保持不变

- **WHEN** 风格切换能力实现完成
- **THEN** store 结构、持久化格式、Electron IPC 合约、更新检查逻辑和备份逻辑均不发生变化

### Requirement: Orbit style provides visual and interaction treatment / Orbit 风格提供视觉与交互处理

新风格 MUST（必须）参考 `orbit-general` 的暖色纸面背景、浅色表面、细边框、克制状态色、卡片质感和轻量交互反馈，并避免显示与该风格明显冲突的旧像素风空状态图片。

#### Scenario: Orbit empty states avoid mismatched pixel art / Orbit 空状态避免不匹配像素图

- **WHEN** 用户切换到 orbit 风格
- **AND** 页面展示空状态
- **THEN** 系统不展示旧像素风空状态图片
- **AND** 空状态文案仍然可见

#### Scenario: Original style keeps existing empty state image / 原风格保留空状态图片

- **WHEN** 用户使用原风格
- **THEN** 系统仍可展示现有空状态图片
- **AND** 不改变原风格空状态布局

### Requirement: Product brand uses Forge identity / 产品品牌使用 Forge 标识

系统 MUST（必须）将页面展示品牌从 `ASCII LIFE OS` 调整为 `Forge`，并展示 slogan `Forge yourself —— 自己锻造自己`。

#### Scenario: Brand appears in navigation / 导航展示品牌

- **WHEN** 用户查看顶部导航
- **THEN** 导航主品牌显示 `Forge`
- **AND** 新风格下可见 `Forge yourself —— 自己锻造自己`

#### Scenario: Brand text is not auto-translated / 品牌文案不被自动翻译

- **WHEN** 浏览器或翻译插件尝试翻译页面
- **THEN** 顶部品牌 `Forge` 和 slogan MUST（必须）保留原文
- **AND** 不显示“伪造”“造假”等错误翻译

#### Scenario: Document title uses new brand / 文档标题使用新品牌

- **WHEN** 浏览器或 Electron 窗口显示页面标题
- **THEN** 标题使用 `Forge`
- **AND** 不再使用 `ASCII Life OS`

### Requirement: Functional module titles are Chinese / 功能模块标题使用中文

系统 MUST（必须）将主要功能模块标题从英文改为对应中文，提升中文用户的理解效率。

#### Scenario: Dashboard module titles are Chinese / 周看板模块标题为中文

- **WHEN** 用户查看周看板页面
- **THEN** 今日进度、每日反思、数据备份、时间块、我的原则、日历、娱乐、习惯追踪、情绪追踪和灵感库等模块标题使用中文

#### Scenario: Reflection and system module titles are Chinese / 反思库和系统模块标题为中文

- **WHEN** 用户查看反思库或系统页
- **THEN** 反思库、能力阅读、能力训练、更新、数据仪式、关于和每日真相等模块标题使用中文

### Requirement: First version layout is aligned and consistent / 第一版本布局对齐且一致

系统 MUST（必须）检查并优化主要页面的功能模块排版，使卡片宽度、间距、标题层级和响应式布局保持一致。

#### Scenario: Main pages use consistent spacing / 主要页面间距一致

- **WHEN** 用户查看周看板、反思库或系统页
- **THEN** 页面主要内容使用统一最大宽度
- **AND** 模块之间使用一致的横向和纵向间距

#### Scenario: Responsive layout remains readable / 响应式布局保持可读

- **WHEN** 用户在窄屏下查看页面
- **THEN** 模块按单列或可横向滚动方式展示
- **AND** 标题和按钮不发生明显重叠或裁切

### Requirement: Orbit page headers avoid explanatory copy / Orbit 页头避免说明性文案

系统 MUST（必须）移除 orbit 页头中解释实现方式或数据复用方式的 summary 文案，让页面更像产品界面而不是需求注释。

#### Scenario: Main orbit headers show no summary paragraph / 主要 orbit 页头不显示说明段落

- **WHEN** 用户切换到新风格并查看周看板、反思库或系统页
- **THEN** 页头只展示短标签、页面标题和状态卡片
- **AND** 不展示“用同一套任务”“反思库、OKR”“保留原来的更新”等说明句
