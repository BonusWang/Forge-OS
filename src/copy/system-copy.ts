// System Page Copy — Updates, Backup, About, Last Words
// Sprint 12: 软件人格化独白版
// 调性：软件不再是一个工具，是一个冷眼旁观你摆烂的室友。

export const systemCopy = {
  update: {
    currentVersion: '当前版本',
    checkButton: '打听一下',
    checking: '正在向远方修道院打听……',
    upToDate: '已是最新版。修道院也没新活儿了，继续修行吧。',
    hasUpdate: '新的启示已降临——虽然你未必会因此变得更自律。',
    updateError: '信使迷了路。可能是网络问题，也可能是信使自己也在拖延。',
    downloadUrl: '去下载',
  },

  backup: {
    title: '数据仪式',
    exportButton: '封存罪证',
    importButton: '展开旧账',
    exportSuccess: '卷轴已封存。你的黑历史现在安全地躺在硬盘里了。',
    importSuccess: '旧账已展开，即将刷新… 希望过去的你没给自己埋雷。',
    importFailed: '卷轴破损，无法辨识。你是不是又在导入表情包？',
    sepiaHint: '点击封存，羊皮卷将缓缓卷起，就像你的耐心一样。',
  },

  about: {
    title: '关于 Forge',
    appName: 'Forge',
    description: '一个面向个人成长的生活管理系统。Forge yourself —— 自己锻造自己。',
    author: 'Forge Contributors',
    license: 'MIT',
  },

  // Last words: app-before-quit, softer than quotes
  lastWords: [
    '今日无反思，你的 24 小时又将被毫无痕迹地回收。',
    '你没有留下任何文字就离开了，仿佛今天从未存在过——客观上，也确实不存在了。',
    '系统即将关闭，而你今天的答案栏里，只有沉默。',
    '别忘了：记录不是为了完美，是为了证明今天确实发生过。',
    '又一天过去了。你记住了什么？软件帮你记住了：什么也没记。',
    '关闭窗口只需要 0.3 秒，关闭愧疚感需要更久——如果你选择去感受它的话。',
  ],

  nav: {
    systemTitle: '系统设置与备份',
    hasUpdateMarker: '*',
  },

  // Monk quote box title
  quoteTitle: '每日真相',
} as const;

export type SystemCopy = typeof systemCopy;
