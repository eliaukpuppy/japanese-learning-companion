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
  },
  { id: "stage-2", name: "阶段2｜N5到N4语法骨架", duration: "5–7个月", goal: "学完你能表达过去、请求、许可、能力、经验和简单原因。", reason: "这阶段像给房子搭梁柱，て形、た形、ない形会决定后面读写听说是否顺。", units: [{ id: "u2-1", title: "动词分类与て形", time: "4周", done: false }, { id: "u2-2", title: "た形、ない形、普通形", time: "4周", done: false }, { id: "u2-3", title: "请求与许可：てください、てもいいですか", time: "3周", done: false }, { id: "u2-4", title: "能力与经验：できます、たことがあります", time: "3周", done: false }, { id: "u2-5", title: "原因与连接：から、けど、そして", time: "3周", done: false }], check: "写一篇100字小日记，主题是“昨天的一天”。", stuck: "て形卡住时，把动词分成三盒：る动词、う动词、不规则动词，每天只练10个。" },
  { id: "stage-3", name: "阶段3｜N4到N3阅读听力桥梁", duration: "7–9个月", goal: "学完你能读简单短文、听懂慢速日常对话，并开始看懂简单漫画台词。", reason: "这是从教材日语走向真实日语的桥。别追求全懂，先学会抓重点。", units: [{ id: "u3-1", title: "N4语法复盘：と思う、という、なら", time: "4周", done: false }, { id: "u3-2", title: "复句连接：ので、のに、ながら、前に、後で", time: "4周", done: false }, { id: "u3-3", title: "阅读方法：找句尾、找主语、拆长句", time: "5周", done: false }, { id: "u3-4", title: "听力方法：精听、跟读、影子练习", time: "5周", done: false }, { id: "u3-5", title: "每周漫画/乙游/乙抓3句显微镜法", time: "持续", done: false }], check: "读一篇简单分级读物或一页漫画，记录5个词、3个表达、1句感想。", stuck: "看句子看晕时，先找句尾：ました、たいです、と思います、かもしれません。" },
  { id: "stage-4", name: "阶段4｜N3到N2核心能力", duration: "10–14个月", goal: "学完你能理解较长文章、日常播客大意和复杂剧情中的人物关系。", reason: "N2不是背更多词，而是能处理转折、省略、语气和作者态度。", units: [{ id: "u4-1", title: "N3核心语法：推量、传闻、条件", time: "8周", done: false }, { id: "u4-2", title: "被动、使役、使役被动", time: "5周", done: false }, { id: "u4-3", title: "N2语法：逆接、强调、限定、评价", time: "10周", done: false }, { id: "u4-4", title: "中级阅读：主题句、转折词、指示词", time: "8周", done: false }, { id: "u4-5", title: "中级听力：省略、语气、场景推断", time: "8周", done: false }], check: "每周拆解一篇文章或一段剧情：5词、3语法、1句总结、30秒复述。", stuck: "中级语法越学越像时，按功能分类：虽然、好像、只、正因为，而不是孤立背。" },
  { id: "stage-5", name: "阶段5｜N2冲刺与兴趣实战", duration: "6–10个月", goal: "学完你能系统备考N2，并稳定啃漫画、日乙和乙抓片段。", reason: "考试给你明确终点，兴趣材料给你长期动力，两条线要一起走。", units: [{ id: "u5-1", title: "N2词汇语法专项", time: "8周", done: false }, { id: "u5-2", title: "N2阅读专项：限时与错题复盘", time: "8周", done: false }, { id: "u5-3", title: "N2听力专项：场景、人物关系、态度", time: "8周", done: false }, { id: "u5-4", title: "漫画口语、省略、拟声词", time: "6周", done: false }, { id: "u5-5", title: "乙游/乙抓角色语气词库", time: "持续", done: false }], check: "每月做一次N2分项测试，并完成一份错题复盘。", stuck: "真实材料满屏不懂时，每天只处理3句话：猜意思、查关键词、找句尾、复述情绪。" }
];
