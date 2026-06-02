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
    title: '数据备份',
    exportButton: '导出数据',
    importButton: '导入数据',
    exportSuccess: '数据已导出。你的本地记录现在有了一份备份。',
    importSuccess: '数据已导入，即将刷新…',
    importFailed: '数据导入失败。请确认文件格式正确。',
    sepiaHint: '导出或导入本地数据，入口统一放在系统页面。',
  },

  about: {
    title: '关于 Forge-OS',
    appName: 'Forge-OS',
    description: '一个面向个人目标确认与成长复盘的生活管理系统。Forge yourself —— 自己锻造自己。',
    author: 'Forge-OS Contributors',
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
