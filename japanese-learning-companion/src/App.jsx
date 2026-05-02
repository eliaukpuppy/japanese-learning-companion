import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, CalendarCheck, CheckCircle2, Heart, NotebookPen, Sparkles, Target, Trophy, RotateCcw, ChevronRight, Clock, Gamepad2 } from "lucide-react";

const STORAGE_KEY = "nihongo-companion-v1";

const COURSE_STORAGE_KEY = "minna-course-v1";

const detailedLessons = {
  1: {
    goal: "掌握です/ではありません句型，能做基础自我介绍。",
    grammar: ["NはNです", "NはNじゃありません", "か 疑问句"],
    examples: ["わたしは リンです。", "これは 日本語のノートです。"],
    task: "写3句自我介绍，并录音跟读2遍。",
    quiz: "把“我是学生”翻成日语，并改成否定句。",
    tip: "注意“は”读作“wa”，不是“ha”。"
  },
  2: {
    goal: "掌握指示代词与物品归属表达。",
    grammar: ["これ/それ/あれ", "このN/そのN/あのN", "NのN"],
    examples: ["これは だれのかさですか。", "そのほんは せんせいのです。"],
    task: "用房间里的物品练习这/那/那边各2句。",
    quiz: "选择正确词：___ ほんは わたしのです。(この/これ)",
    tip: "“この”后必须接名词，“これ”可单独使用。"
  },
  3: { goal: "掌握ここ/そこ/あそこ与场所问答。", grammar: ["ここ/そこ/あそこ", "Nは どこですか", "Nも"], examples: ["トイレは ここです。", "ぎんこうは あそこです。"], task: "画一张教室地图并写5句位置句。", quiz: "把“银行在那边”翻成日语。", tip: "“どこ”问地点，回答要配合场所词。" },
  4: { goal: "掌握时间表达与动词ます形基础。", grammar: ["Vます", "Vません", "〜ますか"], examples: ["まいにち 7じに おきます。", "きょうは べんきょうしません。"], task: "记录今天作息，写4句时间+动作。", quiz: "把“你几点睡觉？”翻成日语。", tip: "时间词后常接“に”，但“きょう/あした”通常不用。" },
  5: { goal: "会说去哪里、怎么去。", grammar: ["Nへ いきます", "Nで いきます", "〜から〜まで"], examples: ["がっこうへ じてんしゃで いきます。", "9じから 5じまで はたらきます。"], task: "写你的通勤/上学路线3句。", quiz: "把“我坐地铁去车站”翻成日语。", tip: "助词“へ”表示方向，读音为“e”。" },
  6: { goal: "掌握动作对象与共同动作表达。", grammar: ["Nを V", "Nと V", "なん/なに"], examples: ["パンを たべます。", "ともだちと えいがを みます。"], task: "写今天做的3个动作（对象+动词）。", quiz: "填空：わたしは ほん___ よみます。", tip: "“を”标记动作对象，不要漏写。" },
  7: { goal: "会说给予与收受（あげる/もらう）。", grammar: ["Nを あげます", "Nを もらいます", "だれに"], examples: ["いもうとに はなを あげました。", "せんせいに ほんを もらいました。"], task: "写2句送礼、2句收礼。", quiz: "翻译“我从朋友那里收到了巧克力”。", tip: "“に”提示动作对象（给谁/从谁）。" },
  8: { goal: "掌握形容词句型与比较基础。", grammar: ["Aいです / Aなです", "Aくないです", "Aでした"], examples: ["このまちは にぎやかです。", "きのうは さむかったです。"], task: "描述今天的天气和心情各2句。", quiz: "把“这家店不安静”翻成日语。", tip: "い形容词和な形容词变形规则不同。" },
  9: { goal: "掌握喜欢/讨厌/上手等表达。", grammar: ["Nが すきです", "Nが きらいです", "Nが じょうずです"], examples: ["わたしは りょうりが すきです。", "かれは えが じょうずです。"], task: "写你喜欢的3件事并说明原因。", quiz: "填空：わたしは ねこ___ すきです。", tip: "此类句型常用“が”，不是“を”。" },
  10: { goal: "掌握存在句与位置描述。", grammar: ["Nが あります/います", "Nは 〜に あります/います"], examples: ["つくえのうえに ほんが あります。", "こうえんに こどもが います。"], task: "观察房间并写5句存在句。", quiz: "翻译“教室里有老师”。", tip: "无生命多用あります，有生命多用います。" }
};

const lessonList = Array.from({ length: 50 }, (_, i) => {
  const lessonNo = i + 1;
  const detail = detailedLessons[lessonNo];
  return {
    id: lessonNo,
    title: `第${lessonNo}课`,
    volume: lessonNo <= 25 ? "初级上册" : "初级下册",
    goal: detail?.goal || "待完善",
    grammar: detail?.grammar || ["待完善"],
    examples: detail?.examples || ["待完善"],
    task: detail?.task || "待完善",
    quiz: detail?.quiz || "待完善",
    tip: detail?.tip || "待完善"
  };
});

function loadCourseState() {
  const fallback = { progress: {}, notes: {}, quizDone: {}, openLessonId: 1 };
  try {
    const raw = localStorage.getItem(COURSE_STORAGE_KEY);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return {
      progress: parsed?.progress || {},
      notes: parsed?.notes || {},
      quizDone: parsed?.quizDone || {},
      openLessonId: parsed?.openLessonId || 1
    };
  } catch {
    return fallback;
  }
}

const initialPlan = {
  profile: {
    title: "我的日语自学小搭子",
    level: "会五十音，学到《大家的日语》第10课",
    goal: "达到N2，能看懂日本漫画、玩日乙游戏、听懂乙抓",
    dailyTime: "每天30分钟",
    interestRule: "兴趣输入每周集中一次"
  },
  currentStageId: "stage-1",
  stages: [
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
    {
      id: "stage-2",
      name: "阶段2｜N5到N4语法骨架",
      duration: "5–7个月",
      goal: "学完你能表达过去、请求、许可、能力、经验和简单原因。",
      reason: "这阶段像给房子搭梁柱，て形、た形、ない形会决定后面读写听说是否顺。",
      units: [
        { id: "u2-1", title: "动词分类与て形", time: "4周", done: false },
        { id: "u2-2", title: "た形、ない形、普通形", time: "4周", done: false },
        { id: "u2-3", title: "请求与许可：てください、てもいいですか", time: "3周", done: false },
        { id: "u2-4", title: "能力与经验：できます、たことがあります", time: "3周", done: false },
        { id: "u2-5", title: "原因与连接：から、けど、そして", time: "3周", done: false }
      ],
      check: "写一篇100字小日记，主题是“昨天的一天”。",
      stuck: "て形卡住时，把动词分成三盒：る动词、う动词、不规则动词，每天只练10个。"
    },
    {
      id: "stage-3",
      name: "阶段3｜N4到N3阅读听力桥梁",
      duration: "7–9个月",
      goal: "学完你能读简单短文、听懂慢速日常对话，并开始看懂简单漫画台词。",
      reason: "这是从教材日语走向真实日语的桥。别追求全懂，先学会抓重点。",
      units: [
        { id: "u3-1", title: "N4语法复盘：と思う、という、なら", time: "4周", done: false },
        { id: "u3-2", title: "复句连接：ので、のに、ながら、前に、後で", time: "4周", done: false },
        { id: "u3-3", title: "阅读方法：找句尾、找主语、拆长句", time: "5周", done: false },
        { id: "u3-4", title: "听力方法：精听、跟读、影子练习", time: "5周", done: false },
        { id: "u3-5", title: "每周漫画/乙游/乙抓3句显微镜法", time: "持续", done: false }
      ],
      check: "读一篇简单分级读物或一页漫画，记录5个词、3个表达、1句感想。",
      stuck: "看句子看晕时，先找句尾：ました、たいです、と思います、かもしれません。"
    },
    {
      id: "stage-4",
      name: "阶段4｜N3到N2核心能力",
      duration: "10–14个月",
      goal: "学完你能理解较长文章、日常播客大意和复杂剧情中的人物关系。",
      reason: "N2不是背更多词，而是能处理转折、省略、语气和作者态度。",
      units: [
        { id: "u4-1", title: "N3核心语法：推量、传闻、条件", time: "8周", done: false },
        { id: "u4-2", title: "被动、使役、使役被动", time: "5周", done: false },
        { id: "u4-3", title: "N2语法：逆接、强调、限定、评价", time: "10周", done: false },
        { id: "u4-4", title: "中级阅读：主题句、转折词、指示词", time: "8周", done: false },
        { id: "u4-5", title: "中级听力：省略、语气、场景推断", time: "8周", done: false }
      ],
      check: "每周拆解一篇文章或一段剧情：5词、3语法、1句总结、30秒复述。",
      stuck: "中级语法越学越像时，按功能分类：虽然、好像、只、正因为，而不是孤立背。"
    },
    {
      id: "stage-5",
      name: "阶段5｜N2冲刺与兴趣实战",
      duration: "6–10个月",
      goal: "学完你能系统备考N2，并稳定啃漫画、日乙和乙抓片段。",
      reason: "考试给你明确终点，兴趣材料给你长期动力，两条线要一起走。",
      units: [
        { id: "u5-1", title: "N2词汇语法专项", time: "8周", done: false },
        { id: "u5-2", title: "N2阅读专项：限时与错题复盘", time: "8周", done: false },
        { id: "u5-3", title: "N2听力专项：场景、人物关系、态度", time: "8周", done: false },
        { id: "u5-4", title: "漫画口语、省略、拟声词", time: "6周", done: false },
        { id: "u5-5", title: "乙游/乙抓角色语气词库", time: "持续", done: false }
      ],
      check: "每月做一次N2分项测试，并完成一份错题复盘。",
      stuck: "真实材料满屏不懂时，每天只处理3句话：猜意思、查关键词、找句尾、复述情绪。"
    }
  ],
  notes: [
    { id: "n1", date: "今天", text: "本周目标：复习《大家的日语》第1–10课，重新找回手感。" }
  ]
};

function loadPlan() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : initialPlan;
  } catch {
    return initialPlan;
  }
}

function savePlan(plan) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(plan));
}

function progressOfStage(stage) {
  const total = stage.units.length;
  const done = stage.units.filter((u) => u.done).length;
  return total === 0 ? 0 : Math.round((done / total) * 100);
}

function allProgress(stages) {
  const units = stages.flatMap((s) => s.units);
  const done = units.filter((u) => u.done).length;
  return units.length === 0 ? 0 : Math.round((done / units.length) * 100);
}

function getTodayTasks(stage) {
  const firstUndone = stage.units.find((u) => !u.done) || stage.units[0];
  return [
    { icon: RotateCcw, title: "5分钟复习", desc: "回看昨天的3个词/1个句型" },
    { icon: BookOpen, title: "15分钟主线学习", desc: firstUndone ? firstUndone.title : "复盘本阶段内容" },
    { icon: CalendarCheck, title: "5分钟输出", desc: "写1句日语或录10秒跟读" },
    { icon: Heart, title: "5分钟奖励", desc: "看一句漫画/乙游/乙抓台词，不要求全懂" }
  ];
}

export default function JapaneseLearningCompanion() {
  const [plan, setPlan] = useState(loadPlan);
  const [tab, setTab] = useState("today");
  const [noteText, setNoteText] = useState("");
  const [courseState, setCourseState] = useState(loadCourseState);

  useEffect(() => savePlan(plan), [plan]);
  useEffect(() => {
    localStorage.setItem(COURSE_STORAGE_KEY, JSON.stringify(courseState));
  }, [courseState]);

  const currentStage = useMemo(
    () => plan.stages.find((s) => s.id === plan.currentStageId) || plan.stages[0],
    [plan]
  );

  const totalProgress = allProgress(plan.stages);
  const todayTasks = getTodayTasks(currentStage);

  function toggleUnit(stageId, unitId) {
    setPlan((prev) => ({
      ...prev,
      stages: prev.stages.map((stage) =>
        stage.id !== stageId
          ? stage
          : {
              ...stage,
              units: stage.units.map((unit) =>
                unit.id === unitId ? { ...unit, done: !unit.done } : unit
              )
            }
      )
    }));
  }

  function setCurrentStage(stageId) {
    setPlan((prev) => ({ ...prev, currentStageId: stageId }));
    setTab("today");
  }

  function addNote() {
    if (!noteText.trim()) return;
    const note = {
      id: `n-${Date.now()}`,
      date: new Date().toLocaleDateString("zh-CN", { month: "short", day: "numeric" }),
      text: noteText.trim()
    };
    setPlan((prev) => ({ ...prev, notes: [note, ...prev.notes] }));
    setNoteText("");
  }

  function toggleLessonDone(lessonId) {
    setCourseState((prev) => ({
      ...prev,
      progress: { ...prev.progress, [lessonId]: !prev.progress[lessonId] }
    }));
  }

  function toggleQuizDone(lessonId) {
    setCourseState((prev) => ({
      ...prev,
      quizDone: { ...prev.quizDone, [lessonId]: !prev.quizDone[lessonId] }
    }));
  }

  function updateLessonNote(lessonId, value) {
    setCourseState((prev) => ({
      ...prev,
      notes: { ...prev.notes, [lessonId]: value }
    }));
  }

  const upperLessons = lessonList.filter((l) => l.id <= 25);
  const lowerLessons = lessonList.filter((l) => l.id >= 26);
  const doneCount = lessonList.filter((l) => courseState.progress[l.id]).length;
  const upperDone = upperLessons.filter((l) => courseState.progress[l.id]).length;
  const lowerDone = lowerLessons.filter((l) => courseState.progress[l.id]).length;
  const totalLessonProgress = Math.round((doneCount / lessonList.length) * 100);

  function resetDemo() {
    localStorage.removeItem(STORAGE_KEY);
    setPlan(initialPlan);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-orange-50 to-violet-50 text-stone-800">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        <header className="mb-6 overflow-hidden rounded-[2rem] bg-white/75 p-6 shadow-sm ring-1 ring-rose-100 backdrop-blur">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-rose-100 px-3 py-1 text-sm font-medium text-rose-700">
                <Sparkles size={16} /> 30分钟也能慢慢学会日语
              </div>
              <h1 className="text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
                {plan.profile.title}
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-stone-600 sm:text-base">
                当前基础：{plan.profile.level}。目标：{plan.profile.goal}。
              </p>
            </div>
            <div className="rounded-3xl bg-gradient-to-br from-rose-100 to-violet-100 p-5 text-center shadow-inner">
              <div className="text-sm text-stone-600">总进度</div>
              <div className="mt-1 text-4xl font-black text-rose-600">{totalProgress}%</div>
              <div className="mt-2 h-2 w-48 rounded-full bg-white/70">
                <div
                  className="h-2 rounded-full bg-rose-400 transition-all"
                  style={{ width: `${totalProgress}%` }}
                />
              </div>
            </div>
          </div>
        </header>

        <nav className="mb-6 grid grid-cols-5 gap-2 rounded-3xl bg-white/70 p-2 shadow-sm ring-1 ring-rose-100 backdrop-blur">
          {[
            ["today", "今日", CalendarCheck],
            ["route", "路线", Target],
            ["course", "课程", BookOpen],
            ["resources", "资源", BookOpen],
            ["notes", "笔记", NotebookPen]
          ].map(([key, label, Icon]) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`flex items-center justify-center gap-2 rounded-2xl px-3 py-3 text-sm font-semibold transition ${
                tab === key
                  ? "bg-rose-500 text-white shadow-sm"
                  : "text-stone-600 hover:bg-rose-50"
              }`}
            >
              <Icon size={17} />
              {label}
            </button>
          ))}
        </nav>

        {tab === "today" && (
          <motion.main initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="grid gap-6 lg:grid-cols-[1.2fr_.8fr]">
            <section className="rounded-[2rem] bg-white/80 p-6 shadow-sm ring-1 ring-rose-100">
              <div className="mb-5 flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-rose-600">当前阶段</p>
                  <h2 className="mt-1 text-2xl font-bold text-stone-900">{currentStage.name}</h2>
                  <p className="mt-2 text-sm leading-6 text-stone-600">{currentStage.reason}</p>
                </div>
                <span className="rounded-full bg-violet-100 px-3 py-1 text-sm font-semibold text-violet-700">
                  {progressOfStage(currentStage)}%
                </span>
              </div>

              <div className="mb-6 rounded-3xl bg-rose-50 p-4">
                <div className="flex items-start gap-3">
                  <Trophy className="mt-0.5 text-rose-500" size={20} />
                  <div>
                    <div className="font-bold text-stone-900">阶段目标</div>
                    <p className="mt-1 text-sm leading-6 text-stone-700">{currentStage.goal}</p>
                  </div>
                </div>
              </div>

              <h3 className="mb-3 text-lg font-bold">今天只做这4件小事</h3>
              <div className="grid gap-3 sm:grid-cols-2">
                {todayTasks.map((task, index) => {
                  const Icon = task.icon;
                  return (
                    <div key={task.title} className="rounded-3xl border border-rose-100 bg-white p-4 shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-rose-100 text-rose-600">
                          <Icon size={19} />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-rose-500">STEP {index + 1}</div>
                          <div className="font-bold text-stone-900">{task.title}</div>
                        </div>
                      </div>
                      <p className="mt-3 text-sm leading-6 text-stone-600">{task.desc}</p>
                    </div>
                  );
                })}
              </div>
            </section>

            <aside className="space-y-6">
              <div className="rounded-[2rem] bg-white/80 p-6 shadow-sm ring-1 ring-rose-100">
                <h3 className="mb-4 flex items-center gap-2 text-lg font-bold">
                  <Clock size={19} className="text-rose-500" /> 30分钟学习节奏
                </h3>
                <div className="space-y-3 text-sm">
                  {[
                    ["5分钟", "复习昨天的词和句型"],
                    ["15分钟", "学习一个小语法/教材片段"],
                    ["5分钟", "听一句、跟读一句"],
                    ["5分钟", "写一句输出或记录笔记"]
                  ].map(([time, text]) => (
                    <div key={time} className="flex gap-3 rounded-2xl bg-stone-50 p-3">
                      <span className="font-bold text-rose-600">{time}</span>
                      <span className="text-stone-700">{text}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[2rem] bg-gradient-to-br from-violet-100 to-rose-100 p-6 shadow-sm">
                <h3 className="flex items-center gap-2 text-lg font-bold text-stone-900">
                  <Gamepad2 size={20} className="text-violet-600" /> 每周兴趣输入
                </h3>
                <p className="mt-3 text-sm leading-6 text-stone-700">
                  每周集中一次，选漫画/乙游/乙抓中的3句话，用“猜意思 → 查关键词 → 找句尾 → 复述情绪”的显微镜法处理。
                </p>
              </div>
            </aside>
          </motion.main>
        )}

        {tab === "route" && (
          <motion.main initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
            {plan.stages.map((stage) => {
              const progress = progressOfStage(stage);
              const isCurrent = stage.id === plan.currentStageId;
              return (
                <section key={stage.id} className={`rounded-[2rem] bg-white/80 p-5 shadow-sm ring-1 ${isCurrent ? "ring-rose-300" : "ring-rose-100"}`}>
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div>
                      <div className="mb-2 flex flex-wrap items-center gap-2">
                        <h2 className="text-xl font-bold text-stone-900">{stage.name}</h2>
                        {isCurrent && <span className="rounded-full bg-rose-500 px-3 py-1 text-xs font-bold text-white">进行中</span>}
                        <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-medium text-stone-600">{stage.duration}</span>
                      </div>
                      <p className="max-w-3xl text-sm leading-6 text-stone-600">{stage.goal}</p>
                    </div>
                    <button
                      onClick={() => setCurrentStage(stage.id)}
                      className="inline-flex items-center justify-center gap-2 rounded-2xl bg-stone-900 px-4 py-2 text-sm font-bold text-white hover:bg-stone-700"
                    >
                      设为当前阶段 <ChevronRight size={16} />
                    </button>
                  </div>

                  <div className="mt-4 h-2 rounded-full bg-rose-50">
                    <div className="h-2 rounded-full bg-rose-400 transition-all" style={{ width: `${progress}%` }} />
                  </div>

                  <div className="mt-5 grid gap-3 lg:grid-cols-2">
                    {stage.units.map((unit) => (
                      <button
                        key={unit.id}
                        onClick={() => toggleUnit(stage.id, unit.id)}
                        className={`flex items-center gap-3 rounded-3xl border p-4 text-left transition ${
                          unit.done
                            ? "border-emerald-100 bg-emerald-50"
                            : "border-rose-100 bg-white hover:bg-rose-50"
                        }`}
                      >
                        <CheckCircle2 className={unit.done ? "text-emerald-500" : "text-stone-300"} size={22} />
                        <div className="flex-1">
                          <div className="font-semibold text-stone-900">{unit.title}</div>
                          <div className="mt-1 text-xs text-stone-500">预计：{unit.time}</div>
                        </div>
                      </button>
                    ))}
                  </div>

                  <div className="mt-5 grid gap-3 md:grid-cols-2">
                    <div className="rounded-3xl bg-rose-50 p-4">
                      <div className="font-bold text-rose-700">阶段检测</div>
                      <p className="mt-1 text-sm leading-6 text-stone-700">{stage.check}</p>
                    </div>
                    <div className="rounded-3xl bg-violet-50 p-4">
                      <div className="font-bold text-violet-700">卡住怎么办</div>
                      <p className="mt-1 text-sm leading-6 text-stone-700">{stage.stuck}</p>
                    </div>
                  </div>
                </section>
              );
            })}
          </motion.main>
        )}

                {tab === "course" && (
          <motion.main initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
            <section className="grid gap-4 md:grid-cols-3">
              {[
                ["初级上册", `${Math.round((upperDone / upperLessons.length) * 100)}%`, `${upperDone}/${upperLessons.length}`],
                ["初级下册", `${Math.round((lowerDone / lowerLessons.length) * 100)}%`, `${lowerDone}/${lowerLessons.length}`],
                ["总完成进度", `${totalLessonProgress}%`, `${doneCount}/${lessonList.length}`]
              ].map(([label, progress, count]) => (
                <div key={label} className="rounded-[2rem] bg-white/80 p-5 shadow-sm ring-1 ring-rose-100">
                  <p className="text-sm text-rose-500">{label}</p><p className="mt-1 text-3xl font-black text-rose-600">{progress}</p><p className="text-sm text-stone-500">{count}</p>
                </div>
              ))}
            </section>

            <section className="rounded-[2rem] bg-white/80 p-5 shadow-sm ring-1 ring-rose-100">
              <h2 className="mb-4 text-xl font-bold text-stone-900">《大家的日语》课程总览（第1课–第50课）</h2>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                {lessonList.map((lesson) => {
                  const active = courseState.openLessonId === lesson.id;
                  const done = Boolean(courseState.progress[lesson.id]);
                  return (
                    <button key={lesson.id} onClick={() => setCourseState((prev) => ({ ...prev, openLessonId: lesson.id }))} className={`rounded-2xl border p-3 text-left transition ${active ? "border-rose-300 bg-rose-50" : "border-rose-100 bg-white hover:bg-rose-50"}`}>
                      <div className="flex items-center justify-between"><span className="font-bold text-stone-900">{lesson.title}</span>{done && <CheckCircle2 size={16} className="text-emerald-500" />}</div>
                      <p className="mt-1 text-xs text-stone-500">{lesson.volume}</p>
                    </button>
                  );
                })}
              </div>
            </section>

            {lessonList.filter((l) => l.id === courseState.openLessonId).map((lesson) => (
              <section key={lesson.id} className="rounded-[2rem] bg-white/80 p-6 shadow-sm ring-1 ring-rose-100">
                <h3 className="text-2xl font-bold text-stone-900">{lesson.title}｜{lesson.volume}</h3>
                <p className="mt-3 text-sm leading-6 text-stone-700"><span className="font-semibold text-rose-600">学习目标：</span>{lesson.goal}</p>
                <p className="mt-2 text-sm leading-6 text-stone-700"><span className="font-semibold text-rose-600">核心语法点：</span>{lesson.grammar.join("、")}</p>
                <p className="mt-2 text-sm leading-6 text-stone-700"><span className="font-semibold text-rose-600">原创例句：</span>{lesson.examples.join(" / ")}</p>
                <p className="mt-2 text-sm leading-6 text-stone-700"><span className="font-semibold text-rose-600">今日任务：</span>{lesson.task}</p>
                <p className="mt-2 text-sm leading-6 text-stone-700"><span className="font-semibold text-rose-600">原创小测验：</span>{lesson.quiz}</p>
                <p className="mt-2 text-sm leading-6 text-stone-700"><span className="font-semibold text-violet-600">易错提醒：</span>{lesson.tip}</p>

                <textarea value={courseState.notes[lesson.id] || ""} onChange={(e) => updateLessonNote(lesson.id, e.target.value)} placeholder="我的笔记..." className="mt-4 min-h-24 w-full resize-none rounded-3xl border border-rose-100 bg-white p-4 text-sm outline-none focus:border-rose-300 focus:ring-4 focus:ring-rose-100" />
                <div className="mt-4 flex flex-wrap gap-2">
                  <button onClick={() => toggleLessonDone(lesson.id)} className={`rounded-2xl px-4 py-2 text-sm font-bold ${courseState.progress[lesson.id] ? "bg-emerald-500 text-white" : "bg-rose-500 text-white"}`}>{courseState.progress[lesson.id] ? "已完成" : "标记完成"}</button>
                  <button onClick={() => toggleQuizDone(lesson.id)} className={`rounded-2xl px-4 py-2 text-sm font-bold ${courseState.quizDone[lesson.id] ? "bg-violet-500 text-white" : "bg-stone-100 text-stone-700"}`}>{courseState.quizDone[lesson.id] ? "小测已完成" : "标记小测完成"}</button>
                </div>
              </section>
            ))}
          </motion.main>
        )}

{tab === "resources" && (
          <motion.main initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "主线教材",
                name: "系统推进，先打稳语法和表达",
                desc: "主线一次选1套，按章节稳步推进。",
                links: [
                  { label: "IRODORI", href: "https://www.irodori.jpf.go.jp/" },
                  { label: "Marugoto", href: "https://marugoto.jpf.go.jp/" }
                ]
              },
              {
                title: "中文辅助",
                name: "中文讲解更友好，适合查漏补缺",
                desc: "看不懂时用中文资源补理解，再回到主线。",
                links: [
                  { label: "MOOC《大学日语》", href: "https://www.icourse163.org/course/0502XJTU044-1002533017" },
                  { label: "MOOC《综合日语》", href: "https://www.icourse163.org/course/BLCU-1464046179" },
                  { label: "沪江初级专题", href: "https://jp.hjenglish.com/new/zt/chuji/" }
                ]
              },
              {
                title: "听力输入",
                name: "先听熟节奏，再追求全懂",
                desc: "每天5分钟，反复听+跟读短音频更有效。",
                links: [
                  { label: "NHK Easy Japanese", href: "https://www.nhk.or.jp/lesson/" },
                  { label: "Marugoto", href: "https://marugoto.jpf.go.jp/" }
                ]
              },
              {
                title: "阅读输入",
                name: "从短句和分级读物开始",
                desc: "优先选带图、短句、重复率高的材料，降低挫败感。",
                links: [
                  { label: "Tadoku Free Books", href: "https://tadoku.org/japanese/en/free-books-en/" },
                  { label: "NHK Easy Japanese", href: "https://www.nhk.or.jp/lesson/" }
                ]
              },
              {
                title: "考试检测",
                name: "定期做题，追踪阶段进度",
                desc: "每月做一次样题，按错题类型复盘。",
                links: [
                  { label: "JLPT 官方样题", href: "https://www.jlpt.jp/e/samples/sampleindex.html" },
                  { label: "Kana Quiz", href: "https://kana-quiz.tofugu.com/" }
                ]
              }
            ].map((resource) => (
              <div key={resource.title} className="rounded-[2rem] bg-white/80 p-6 shadow-sm ring-1 ring-rose-100">
                <div className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-rose-100 text-rose-600">
                  <BookOpen size={21} />
                </div>
                <h2 className="text-lg font-bold text-stone-900">{resource.title}</h2>
                <p className="mt-1 font-semibold text-rose-600">{resource.name}</p>
                <p className="mt-3 text-sm leading-6 text-stone-600">{resource.desc}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {resource.links.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-full bg-rose-100 px-3 py-1.5 text-xs font-semibold text-rose-700 transition hover:bg-rose-200"
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </motion.main>
        )}

        {tab === "notes" && (
          <motion.main initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="grid gap-6 lg:grid-cols-[.9fr_1.1fr]">
            <section className="rounded-[2rem] bg-white/80 p-6 shadow-sm ring-1 ring-rose-100">
              <h2 className="mb-3 text-xl font-bold">写一条学习笔记</h2>
              <textarea
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="比如：今天复习了て形，飲む→飲んで，書く→書いて。"
                className="min-h-40 w-full resize-none rounded-3xl border border-rose-100 bg-white p-4 text-sm outline-none focus:border-rose-300 focus:ring-4 focus:ring-rose-100"
              />
              <button onClick={addNote} className="mt-3 w-full rounded-2xl bg-rose-500 px-4 py-3 font-bold text-white shadow-sm hover:bg-rose-600">
                保存笔记
              </button>
              <button onClick={resetDemo} className="mt-3 w-full rounded-2xl bg-stone-100 px-4 py-3 text-sm font-bold text-stone-600 hover:bg-stone-200">
                重置演示数据
              </button>
            </section>

            <section className="space-y-3">
              {plan.notes.map((note) => (
                <div key={note.id} className="rounded-[2rem] bg-white/80 p-5 shadow-sm ring-1 ring-rose-100">
                  <div className="mb-2 text-xs font-bold text-rose-500">{note.date}</div>
                  <p className="text-sm leading-6 text-stone-700">{note.text}</p>
                </div>
              ))}
            </section>
          </motion.main>
        )}
      </div>
    </div>
  );
}
