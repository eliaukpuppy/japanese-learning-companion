import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, CalendarCheck, CheckCircle2, Heart, Sparkles, Target, Trophy, RotateCcw, ListChecks, PenSquare, Flame } from "lucide-react";

const STORAGE_KEY = "nihongo-companion-v1";

const initialPlan = {
  profile: {
    title: "我的日语自学小搭子",
    level: "会五十音，学到《大家的日语》第10课",
    goal: "达到N2，能看懂日本漫画、玩日乙游戏、听懂乙抓",
    dailyTime: "每天30分钟",
    interestRule: "兴趣输入每周集中一次"
  },
  stages: [
    { id: "stage-1", units: [{ id: "u1", title: "复习第1–10课", done: false }] }
  ],
  lessons: Array.from({ length: 25 }, (_, i) => ({
    id: `lesson-${i + 1}`,
    title: `第${i + 1}课`,
    goal: "（待填写）本课目标",
    patterns: "（待填写）核心句型",
    keywords: "（待填写）关键词",
    examples: "（待填写）例句",
    practice: "（待填写）小练习",
    done: false
  })),
  checkins: Array.from({ length: 30 }, (_, i) => ({ day: i + 1, done: false }))
};

function loadPlan() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : initialPlan;
    return {
      ...initialPlan,
      ...parsed,
      lessons: parsed.lessons || initialPlan.lessons,
      checkins: parsed.checkins || initialPlan.checkins
    };
  } catch {
    return initialPlan;
  }
}

function savePlan(plan) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(plan));
}

function allProgress(stages) {
  const units = stages.flatMap((s) => s.units);
  const done = units.filter((u) => u.done).length;
  return units.length === 0 ? 0 : Math.round((done / units.length) * 100);
}

function getTodayTasks() {
  return [
    { icon: RotateCcw, title: "5分钟复习", desc: "回看昨天的3个词/1个句型" },
    { icon: BookOpen, title: "15分钟主线学习", desc: "继续推进当前课程" },
    { icon: CalendarCheck, title: "5分钟输出", desc: "写1句日语或录10秒跟读" },
    { icon: Heart, title: "5分钟奖励", desc: "看一句漫画/乙游/乙抓台词，不要求全懂" }
  ];
}

export default function JapaneseLearningCompanion() {
  const [plan, setPlan] = useState(loadPlan);
  const [tab, setTab] = useState("today");
  const [showPracticeAnswer, setShowPracticeAnswer] = useState(false);

  useEffect(() => savePlan(plan), [plan]);

  const totalProgress = allProgress(plan.stages);
  const todayTasks = useMemo(() => getTodayTasks(), []);

  function resetDemo() {
    localStorage.removeItem(STORAGE_KEY);
    setPlan(initialPlan);
  }

  function toggleLesson(lessonId) {
    setPlan((prev) => ({
      ...prev,
      lessons: prev.lessons.map((lesson) => (lesson.id === lessonId ? { ...lesson, done: !lesson.done } : lesson))
    }));
  }

  function toggleCheckin(day) {
    setPlan((prev) => ({
      ...prev,
      checkins: prev.checkins.map((item) => (item.day === day ? { ...item, done: !item.done } : item))
    }));
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
              <h1 className="text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">{plan.profile.title}</h1>
            </div>
            <div className="rounded-3xl bg-gradient-to-br from-rose-100 to-violet-100 p-5 text-center shadow-inner">
              <div className="text-sm text-stone-600">总进度</div>
              <div className="mt-1 text-4xl font-black text-rose-600">{totalProgress}%</div>
            </div>
          </div>
        </header>

        <nav className="mb-6 grid grid-cols-3 gap-2 rounded-3xl bg-white/70 p-2 shadow-sm ring-1 ring-rose-100 backdrop-blur sm:grid-cols-6">
          {[
            ["today", "今日", CalendarCheck],
            ["course", "课程", Target],
            ["quick", "速查", ListChecks],
            ["practice", "练习", PenSquare],
            ["checkin", "打卡", Flame],
            ["resources", "资源", BookOpen]
          ].map(([key, label, Icon]) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`flex items-center justify-center gap-2 rounded-2xl px-3 py-3 text-sm font-semibold transition ${tab === key ? "bg-rose-500 text-white shadow-sm" : "text-stone-600 hover:bg-rose-50"}`}
            >
              <Icon size={17} />
              {label}
            </button>
          ))}
        </nav>

        {tab === "today" && <motion.main initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="grid gap-4 md:grid-cols-2">{todayTasks.map((task) => <section key={task.title} className="rounded-[2rem] bg-white/80 p-5 shadow-sm ring-1 ring-rose-100"><div className="flex items-center gap-2 font-bold"><task.icon size={18} />{task.title}</div><p className="mt-2 text-sm text-stone-600">{task.desc}</p></section>)}</motion.main>}

        {tab === "course" && <motion.main initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">{plan.lessons.map((lesson) => <section key={lesson.id} className="rounded-[2rem] bg-white/80 p-6 shadow-sm ring-1 ring-rose-100"><div className="mb-3 flex items-center justify-between"><h2 className="text-xl font-bold text-stone-900">{lesson.title}</h2><button onClick={() => toggleLesson(lesson.id)} className={`rounded-full px-3 py-1 text-xs font-bold ${lesson.done ? "bg-green-100 text-green-700" : "bg-rose-100 text-rose-700"}`}>{lesson.done ? "已完成" : "未完成"}</button></div><div className="grid gap-3 text-sm md:grid-cols-2"><div className="rounded-2xl bg-rose-50 p-3"><strong>本课目标：</strong>{lesson.goal}</div><div className="rounded-2xl bg-rose-50 p-3"><strong>核心句型：</strong>{lesson.patterns}</div><div className="rounded-2xl bg-rose-50 p-3"><strong>关键词：</strong>{lesson.keywords}</div><div className="rounded-2xl bg-rose-50 p-3"><strong>例句：</strong>{lesson.examples}</div><div className="rounded-2xl bg-violet-50 p-3 md:col-span-2"><strong>小练习：</strong>{lesson.practice}</div></div></section>)}</motion.main>}

        {tab === "quick" && <motion.main initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="grid gap-4 md:grid-cols-2">{["助词总整理", "动词形式总整理", "形容词与名词句整理", "易混点速查"].map((item) => <section key={item} className="rounded-[2rem] bg-white/80 p-6 shadow-sm ring-1 ring-rose-100"><h2 className="text-lg font-bold text-stone-900">{item}</h2><p className="mt-2 text-sm text-stone-600">（结构预留）</p></section>)}</motion.main>}

        {tab === "practice" && <motion.main initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">{["选择助词", "翻译成日语", "动词变形"].map((item) => <section key={item} className="rounded-[2rem] bg-white/80 p-6 shadow-sm ring-1 ring-rose-100"><h2 className="text-lg font-bold text-stone-900">{item}</h2><p className="mt-2 text-sm text-stone-600">（结构预留）</p></section>)}<section className="rounded-[2rem] bg-white/80 p-6 shadow-sm ring-1 ring-rose-100"><h2 className="text-lg font-bold text-stone-900">查看答案</h2><button onClick={() => setShowPracticeAnswer((v) => !v)} className="mt-3 rounded-full bg-rose-100 px-4 py-2 text-sm font-semibold text-rose-700">{showPracticeAnswer ? "隐藏答案" : "显示答案"}</button>{showPracticeAnswer && <p className="mt-3 text-sm text-stone-600">（结构预留）</p>}</section></motion.main>}

        {tab === "checkin" && <motion.main initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-[2rem] bg-white/80 p-6 shadow-sm ring-1 ring-rose-100"><h2 className="text-xl font-bold text-stone-900">30天复习打卡</h2><div className="mt-4 grid grid-cols-5 gap-2 sm:grid-cols-6 md:grid-cols-10">{plan.checkins.map((item) => <button key={item.day} onClick={() => toggleCheckin(item.day)} className={`rounded-xl px-2 py-3 text-xs font-bold ${item.done ? "bg-rose-500 text-white" : "bg-rose-100 text-rose-700"}`}>Day {item.day}</button>)}</div></motion.main>}

        {tab === "resources" && <motion.main initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-[2rem] bg-white/80 p-6 shadow-sm ring-1 ring-rose-100"><h2 className="text-lg font-bold">短文阅读 / 多读（后续继续填充）</h2></motion.main>}

        <div className="mt-6"><button onClick={resetDemo} className="w-full rounded-2xl bg-stone-100 px-4 py-3 text-sm font-bold text-stone-600 hover:bg-stone-200">重置演示数据</button></div>
      </div>
    </div>
  );
}
