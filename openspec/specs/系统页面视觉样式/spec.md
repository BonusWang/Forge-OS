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

### Requirement: Product brand uses Forge-OS identity / 产品品牌使用 Forge-OS 标识

系统 MUST（必须）将页面展示品牌调整为 `Forge-OS`，并展示 slogan `Forge yourself —— 自己锻造自己`，用于强调个人目标确认与持续成长的产品定位。

#### Scenario: Brand appears in navigation / 导航展示品牌

- **WHEN** 用户查看顶部导航
- **THEN** 导航主品牌显示 `Forge-OS`
- **AND** 新风格下可见 `Forge yourself —— 自己锻造自己`

#### Scenario: Brand text is not auto-translated / 品牌文案不被自动翻译

- **WHEN** 浏览器或翻译插件尝试翻译页面
- **THEN** 顶部品牌 `Forge-OS` 和 slogan MUST（必须）保留原文
- **AND** 不显示“伪造”“造假”等错误翻译

#### Scenario: Document title uses new brand / 文档标题使用新品牌

- **WHEN** 浏览器或 Electron 窗口显示页面标题
- **THEN** 标题使用 `Forge-OS`
- **AND** 不再使用 `ASCII Life OS`

### Requirement: Functional module titles are Chinese / 功能模块标题使用中文

系统 MUST（必须）将主要功能模块标题从英文改为对应中文，提升中文用户的理解效率，并确保系统维护类模块归属系统页。

#### Scenario: Dashboard module titles are Chinese / 周看板模块标题为中文

- **WHEN** 用户查看周看板页面
- **THEN** 今日进度、每日反思、时间块、我的原则、日历、娱乐、习惯追踪、情绪追踪和灵感库等模块标题使用中文
- **AND** 周看板不展示数据备份模块

#### Scenario: Reflection and system module titles are Chinese / 反思库和系统模块标题为中文

- **WHEN** 用户查看反思库或系统页
- **THEN** 反思库、能力阅读、能力训练、更新、数据备份、关于和每日真相等模块标题使用中文
- **AND** 数据备份入口归属系统页
- **AND** 系统页数据备份入口展示导出数据和导入数据操作
- **AND** 系统页不展示重复的数据仪式、封存罪证和展开旧账入口

### Requirement: First version layout is aligned and consistent / 第一版本布局对齐且一致

系统 MUST（必须）检查并优化主要页面的功能模块排版，使卡片宽度、间距、标题层级、响应式布局和关键列顺序保持一致。

#### Scenario: Main pages use consistent spacing / 主要页面间距一致

- **WHEN** 用户查看周看板、反思库或系统页
- **THEN** 页面主要内容使用统一最大宽度
- **AND** 模块之间使用一致的横向和纵向间距

#### Scenario: Responsive layout remains readable / 响应式布局保持可读

- **WHEN** 用户在窄屏下查看页面
- **THEN** 模块按单列或可横向滚动方式展示
- **AND** 标题和按钮不发生明显重叠或裁切

#### Scenario: Backlog is first task board column / 收纳箱是周看板第一列

- **WHEN** 用户查看周看板横向任务列
- **THEN** 收纳箱列显示在最左侧第一列
- **AND** 周一到周日按日期顺序显示在收纳箱之后
- **AND** OKR 收纳列保留在周任务列之后

### Requirement: Orbit page headers avoid explanatory copy / Orbit 页头避免说明性文案

系统 MUST（必须）移除 orbit 页头中解释实现方式或数据复用方式的 summary 文案，让页面更像产品界面而不是需求注释。

#### Scenario: Main orbit headers show no summary paragraph / 主要 orbit 页头不显示说明段落

- **WHEN** 用户切换到新风格并查看周看板、反思库或系统页
- **THEN** 页头只展示短标签、页面标题和状态卡片
- **AND** 不展示“用同一套任务”“反思库、OKR”“保留原来的更新”等说明句

### Requirement: Main pages use a unified workspace shell / 主页面使用统一工作台外壳

系统 MUST（必须）为周看板、反思库、周复盘和系统页提供一致的页面外壳、最大宽度、模块间距和响应式边界，使电脑端页面看起来属于同一套工作台系统。

#### Scenario: Main pages share page container constraints / 主页面共享容器约束

- **WHEN** 用户在桌面端查看周看板、反思库、周复盘或系统页
- **THEN** 页面主体使用一致的外层容器宽度和横向内边距策略
- **AND** 页面不产生非预期的横向滚动

#### Scenario: Main pages use consistent module spacing / 主页面模块间距一致

- **WHEN** 用户在主页面之间切换
- **THEN** 主要模块之间使用一致的纵向和横向间距
- **AND** 模块标题、卡片边界和分栏节奏保持稳定

### Requirement: Navigation remains stable and scannable / 导航保持稳定可扫

顶部导航 MUST（必须）保持现有功能入口和文案不变，同时优化按钮尺寸、激活态、焦点态和横向滚动表现，让桌面端和窄屏下都可快速扫描。

#### Scenario: Navigation entries remain unchanged / 导航入口不变

- **WHEN** 用户查看顶部导航
- **THEN** 导航仍展示周看板、反思库、周复盘、◇ 系统、`[◇ 风格切换]`、`[⊕ 模块]` 和主题切换按钮
- **AND** 不新增、不删除、不重命名这些入口

#### Scenario: Navigation has stable interaction states / 导航交互状态稳定

- **WHEN** 用户 hover、focus 或切换当前页面
- **THEN** 导航按钮提供清晰但克制的视觉反馈
- **AND** 按钮文本不因状态切换出现明显宽度跳动

### Requirement: Layout polish preserves business behavior / 排版优化保持业务行为

系统 MUST（必须）只通过页面层容器、网格、间距和视觉交互呈现优化布局，不得改变业务模块集合、业务操作语义或数据契约。

#### Scenario: Business modules remain same per page / 每页业务模块集合保持不变

- **WHEN** 页面排版优化完成
- **THEN** 周看板、反思库、周复盘和系统页保留各自原有业务模块集合
- **AND** 不因排版优化新增、删除或复制业务模块

#### Scenario: Style toggle shares the same structure / 风格切换共享同一结构

- **WHEN** 用户在 classic 和 orbit 风格之间切换
- **THEN** 当前业务页面的 DOM 业务模块集合和顺序保持一致
- **AND** 风格切换只改变视觉表现

#### Scenario: Data and operations remain unchanged / 数据与操作保持不变

- **WHEN** 页面排版优化实现完成
- **THEN** store 结构、持久化格式、Electron IPC 合约和业务操作逻辑均不发生变化

### Requirement: Desktop dashboard uses today-first weekly layout / 桌面端周看板使用今日优先周布局

系统 MUST（必须）在桌面端周看板页面使用“今日执行 + 周看板 + 辅助沉淀”的基础排版，使用户先看到今日状态，再进入本周任务规划，最后查看辅助模块。

#### Scenario: Today execution strip appears before weekly board / 今日执行条位于周看板之前

- **WHEN** 用户在桌面端查看周看板页面
- **THEN** 今日进度、每日反思、时间块和情绪追踪作为今日执行条展示在本周任务看板之前
- **AND** 这些模块继续使用原有组件和数据源

#### Scenario: Weekly board remains the primary planning area / 周看板仍是主要规划区

- **WHEN** 用户在桌面端查看周看板页面
- **THEN** 本周任务看板位于今日执行条之后
- **AND** 收纳箱、周一至周日任务列、周切换和周复盘入口保持可用
- **AND** 任务添加、完成、拖拽和周复盘打开逻辑不发生变化

#### Scenario: Supporting modules are grouped after weekly board / 辅助模块位于周看板之后

- **WHEN** 用户在桌面端查看周看板页面
- **THEN** 我的原则、日历、娱乐、习惯追踪和灵感库展示在周看板之后的辅助沉淀区
- **AND** 模块的原有交互和数据逻辑不发生变化

### Requirement: Dashboard layout optimization preserves business behavior / 周看板排版优化保持业务行为

系统 MUST（必须）只通过模块重排、布局容器、网格、间距和视觉交互优化来改善桌面端体验，不得改变业务处理逻辑。

#### Scenario: Store and data contracts remain unchanged / 数据契约保持不变

- **WHEN** 桌面端周看板排版优化实现完成
- **THEN** store 结构、持久化格式、Electron IPC 合约和模块业务操作语义均不发生变化

#### Scenario: Style modes share the same dashboard structure / 风格模式共享同一周看板结构

- **WHEN** 用户在原风格和 orbit 风格之间切换
- **THEN** 两种风格使用同一套周看板基础排版
- **AND** 风格切换不得改变今日执行条、周看板和辅助沉淀区的模块集合或顺序

#### Scenario: Desktop layout remains readable without horizontal page overflow / 桌面端布局可读且页面不横向溢出

- **WHEN** 用户在电脑端常见宽度查看周看板页面
- **THEN** 今日执行条和辅助沉淀区使用适合桌面扫描的网格布局
- **AND** 页面主体不产生非预期的横向滚动
- **AND** 周看板自身可以保留内部横向滚动以承载任务列
