export const minnaLessons = [
  {
    id: "stage-0",
    name: "阶段0｜假名与学习系统",
    duration: "2–4周",
    goal: "学完你能熟练读写假名、会查词、会做每日复习。",
    reason: "这是把学习机器装好，后面才不会每天都从头开始。",
    units: [
      { id: "u0-1", title: "平假名与片假名巩固", time: "5天", done: true },
      { id: "u0-2", title: "长音、促音、拗音、拨音", time: "3天", done: true },
      { id: "u0-3", title: "安装日语输入法和词典", time: "1天", done: false },
      { id: "u0-4", title: "建立每日复习卡片", time: "2天", done: false }
    ],
    check: "随机读20个假名，并用日语输入法打出10个单词。",
    stuck: "假名混淆时，不要重背整张表，只专练シ/ツ、ソ/ン、ぬ/め这类易混组。"
  },
  {
    id: "stage-1",
    name: "阶段1｜N5生活日语入门",
    duration: "2–3个月",
    goal: "学完你能自我介绍、描述物品位置、说喜欢和日常安排。",
    reason: "先学能马上用的句子，最快获得“我真的会了”的感觉。",
    units: [
      { id: "u1-1", title: "复习第1–10课：です、は、も、これ/それ/あれ", time: "1周", done: false },
      { id: "u1-2", title: "位置表达：ここ/そこ/あそこ、あります/います", time: "1周", done: false },
      { id: "u1-3", title: "ます形：去哪里、做什么、几点做", time: "2周", done: false },
      { id: "u1-4", title: "喜欢、想要、邀请：すき、ほしい、ませんか", time: "2周", done: false },
      { id: "u1-5", title: "点餐、购物、问路场景", time: "2周", done: false }
    ],
    check: "录一段30秒日语自我介绍，并写5句今天做了什么。",
    stuck: "语法术语看不懂时，先背可直接套用的句型：___がすきです、___へ行きます。"
  }
];
