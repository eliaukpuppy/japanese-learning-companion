import React, { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BookOpen, CalendarCheck, Target, ListChecks, PenSquare, Flame, Settings, Download, Upload, Sparkles, Heart, Award, Flower2, Inbox } from "lucide-react";
import { minnaUpperLessons } from "./data/minnaUpperLessons";
import { quickReference } from "./data/quickReference";
import { practiceQuestions } from "./data/practiceQuestions";
import { checkinPlan } from "./data/checkinPlan";
import { resources } from "./data/resources";

const STORAGE_KEY = "nihongo-companion-v1";
const APP_STORAGE_PREFIX = "nihongo-companion";

const isAppStorageKey = (key) => key === STORAGE_KEY || key.startsWith(APP_STORAGE_PREFIX);

const collectAppStorage = () => {
  const data = {};
  for (let i = 0; i < localStorage.length; i += 1) {
    const key = localStorage.key(i);
    if (!key || !isAppStorageKey(key)) continue;
    if (key.toLowerCase().includes("note")) continue;
    data[key] = localStorage.getItem(key);
  }
  return data;
};

const downloadJson = (filename, payload) => {
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
};

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
    { id: "stage-0", name: "阶段0｜假名与学习系统", duration: "2–4周", goal: "学完你能熟练读写假名、会查词、会做每日复习。", reason: "这是把学习机器装好，后面才不会每天都从头开始。", units: [{ id: "u0-1", title: "平假名与片假名巩固", time: "5天", done: true }, { id: "u0-2", title: "长音、促音、拗音、拨音", time: "3天", done: true }, { id: "u0-3", title: "安装日语输入法和词典", time: "1天", done: false }, { id: "u0-4", title: "建立每日复习卡片", time: "2天", done: false }], check: "随机读20个假名，并用日语输入法打出10个单词。", stuck: "假名混淆时，不要重背整张表，只专练シ/ツ、ソ/ン、ぬ/め这类易混组。" },
    { id: "stage-1", name: "阶段1｜N5生活日语入门", duration: "2–3个月", goal: "学完你能自我介绍、描述物品位置、说喜欢和日常安排。", reason: "先学能马上用的句子，最快获得“我真的会了”的感觉。", units: [{ id: "u1-1", title: "复习第1–10课：です、は、も、これ/それ/あれ", time: "1周", done: false }, { id: "u1-2", title: "位置表达：ここ/そこ/あそこ、あります/います", time: "1周", done: false }, { id: "u1-3", title: "ます形：去哪里、做什么、几点做", time: "2周", done: false }, { id: "u1-4", title: "喜欢、想要、邀请：すき、ほしい、ませんか", time: "2周", done: false }, { id: "u1-5", title: "点餐、购物、问路场景", time: "2周", done: false }], check: "录一段30秒日语自我介绍，并写5句今天做了什么。", stuck: "语法术语看不懂时，先背可直接套用的句型：___がすきです、___へ行きます。" }
  ],
  checkins: checkinPlan.items.map((item) => ({ day: item.day, done: false, sentence: "", mistakes: "" })),
  lessonChecks: {},
  wrongQuestions: {}
};

function loadPlan() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : initialPlan;
    return {
      ...initialPlan,
      ...parsed,
      checkins: checkinPlan.items.map((item) => {
        const stored = parsed.checkins?.find((c) => c.day === item.day);
        return { day: item.day, done: stored?.done ?? false, sentence: stored?.sentence ?? "", mistakes: stored?.mistakes ?? "" };
      }),
      lessonChecks: parsed.lessonChecks || {},
      wrongQuestions: parsed.wrongQuestions || {}
    };
  } catch {
    return initialPlan;
  }
}

const savePlan = (plan) => localStorage.setItem(STORAGE_KEY, JSON.stringify(plan));
const allProgress = (stages) => {
  const units = stages.flatMap((s) => s.units);
  return Math.round((units.filter((u) => u.done).length / units.length) * 100);
};

const getRankTitle = (progress) => {
  if (progress <= 10) return "假名幼苗";
  if (progress <= 30) return "初级冒险者";
  if (progress <= 50) return "て形挑战者";
  if (progress <= 75) return "N4准备中";
  return "N2远征队";
};

const cardClass = "rounded-[2rem] border border-rose-100 bg-white/80 p-6 shadow-[0_12px_30px_rgba(251,113,133,0.12)] transition duration-200 hover:-translate-y-1 hover:shadow-[0_16px_35px_rgba(244,114,182,0.16)]";

export default function JapaneseLearningCompanion() {
  const [plan, setPlan] = useState(loadPlan);
  const [tab, setTab] = useState("today");
  const [answersVisible, setAnswersVisible] = useState({});
  const importInputRef = useRef(null);

  useEffect(() => savePlan(plan), [plan]);

  const currentStage = useMemo(() => plan.stages.find((s) => s.id === plan.currentStageId) || plan.stages[0], [plan]);
  const overallProgress = useMemo(() => allProgress(plan.stages), [plan.stages]);
  const rankTitle = getRankTitle(overallProgress);
  const progressHint = overallProgress < 34 ? "慢慢来" : overallProgress < 70 ? "进步中" : "很棒";

  const toggleLessonCheck = (lessonNumber) => setPlan((p) => ({ ...p, lessonChecks: { ...p.lessonChecks, [lessonNumber]: !p.lessonChecks[lessonNumber] } }));
  const toggleWrongQuestion = (id) => setPlan((p) => ({ ...p, wrongQuestions: { ...p.wrongQuestions, [id]: !p.wrongQuestions[id] } }));
  const toggleCheckin = (day) => setPlan((p) => ({ ...p, checkins: p.checkins.map((c) => c.day === day ? { ...c, done: !c.done } : c) }));
  const updateCheckinField = (day, field, value) => setPlan((p) => ({ ...p, checkins: p.checkins.map((c) => c.day === day ? { ...c, [field]: value } : c) }));

  const wrongQuestionCount = Object.values(plan.wrongQuestions).filter(Boolean).length;
  const todayDay = new Date().getDate();
  const todayCheckin = plan.checkins.find((c) => c.day === todayDay);

  const tabTransition = { initial: { opacity: 0, y: 6 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -6 }, transition: { duration: 0.2 } };

  return <div className="min-h-screen bg-gradient-to-br from-rose-50 via-orange-50 to-violet-50 text-stone-800"><div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
    <header className={cardClass}><h1 className="text-3xl font-bold">{plan.profile.title}</h1></header>
    <nav className="mb-6 mt-6 grid grid-cols-3 gap-2 rounded-3xl bg-white/70 p-2 shadow-sm ring-1 ring-rose-100 backdrop-blur sm:grid-cols-6">
      {[["today", "今日", CalendarCheck],["route", "课程", Target],["quick", "速查", ListChecks],["practice", "练习", PenSquare],["checkin", "打卡", Flame],["resources", "资源", BookOpen]].map(([key,label,Icon]) => <button key={key} onClick={()=>setTab(key)} className={`flex items-center justify-center gap-2 rounded-2xl px-3 py-3 text-sm font-semibold transition ${tab===key?"bg-rose-500 text-white":"text-stone-600 hover:bg-rose-50"}`}><Icon size={17}/>{label}</button>)}
    </nav>
    <AnimatePresence mode="wait">
      {tab === "today" && <motion.main key="today" className="space-y-4" {...tabTransition}>
        <section className="rounded-[2rem] border border-rose-100 bg-gradient-to-br from-rose-100 via-orange-50 to-violet-100 p-6 shadow-[0_12px_30px_rgba(244,114,182,0.16)]">
          <div className="flex items-center gap-2 text-rose-600"><Sparkles size={16} /><Heart size={16} /><BookOpen size={16} /></div>
          <h2 className="mt-2 text-xl font-bold">まなちゃん</h2>
          <p className="mt-2 text-sm">今天也只要学一点点，就已经很棒啦 🌸</p>
        </section>
        <section className={cardClass}>
          <div className="flex items-center justify-between gap-3"><h2 className="text-xl font-bold">总进度</h2><span className="rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold text-violet-700">{rankTitle}</span></div>
          <p className="mt-2 text-sm text-stone-600">{overallProgress}% 已完成</p>
          <div className="mt-3 h-3 w-full overflow-hidden rounded-full bg-rose-100">
            <div className="h-full rounded-full bg-gradient-to-r from-rose-300 via-fuchsia-300 to-violet-300" style={{ width: `${overallProgress}%` }} />
          </div>
          <span className="mt-3 inline-block rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700">{progressHint}</span>
        </section>
        <section className={cardClass}><h2 className="flex items-center gap-2 text-xl font-bold"><Flower2 size={18} className="text-rose-500" />当前阶段</h2><p className="mt-2 font-semibold">{currentStage.name}</p><p className="text-sm text-stone-600">阶段时长：{currentStage.duration}</p></section>
        <section className={cardClass}><h2 className="flex items-center gap-2 text-xl font-bold"><Sparkles size={18} className="text-rose-500" />阶段目标</h2><p className="mt-2 text-sm">{currentStage.goal}</p></section>
      </motion.main>}

      {tab === "route" && <motion.main key="route" className="space-y-4" {...tabTransition}>{minnaUpperLessons.slice(0,25).map((lesson)=><section key={lesson.lessonNumber} className={cardClass}><div className="flex justify-between gap-2"><h2 className="text-xl font-bold">第{lesson.lessonNumber}课｜{lesson.title}</h2><motion.button whileTap={{ scale: 1.05 }} onClick={()=>toggleLessonCheck(lesson.lessonNumber)} className={`rounded-full px-3 py-1 text-sm font-semibold ${plan.lessonChecks[lesson.lessonNumber]?"bg-emerald-100 text-emerald-700":"bg-rose-100 text-rose-700"}`}>{plan.lessonChecks[lesson.lessonNumber]?"已完成":"标记完成"}</motion.button></div><p className="mt-3 text-sm text-stone-700"><span className="font-semibold">本课目标：</span>{lesson.goal}</p><div className="mt-3"><h3 className="text-sm font-semibold text-stone-800">核心句型 / 语法</h3><ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-stone-700">{lesson.grammarPoints.map((point, idx)=><li key={`${lesson.lessonNumber}-grammar-${idx}`}>{point}</li>)}</ul></div><div className="mt-3"><h3 className="text-sm font-semibold text-stone-800">关键词 / 助词 / 形式</h3><div className="mt-2 flex flex-wrap gap-2">{lesson.keywords.map((keyword, idx)=><span key={`${lesson.lessonNumber}-keyword-${idx}`} className="rounded-full bg-rose-100 px-3 py-1 text-xs text-rose-700">{keyword}</span>)}</div></div><div className="mt-3"><h3 className="text-sm font-semibold text-stone-800">例句</h3><ul className="mt-2 space-y-2 text-sm text-stone-700">{lesson.examples.map((example, idx)=><li key={`${lesson.lessonNumber}-example-${idx}`}><p>{example.jp}</p><p className="text-stone-500">{example.cn}</p></li>)}</ul></div><div className="mt-3"><h3 className="text-sm font-semibold text-stone-800">小练习</h3><ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-stone-700">{lesson.miniPractice.map((practice, idx)=><li key={`${lesson.lessonNumber}-practice-${idx}`}>{practice.prompt}</li>)}</ul></div></section>)}</motion.main>}

      {tab === "quick" && <motion.main key="quick" className="grid gap-5 md:grid-cols-2" {...tabTransition}>{[quickReference.particles,quickReference.verbForms,quickReference.adjectiveNoun,quickReference.confusionPairs].map((sec)=><section key={sec.title} className={cardClass}><h2 className="flex items-center gap-2 text-lg font-bold"><BookOpen size={16} className="text-rose-500" />{sec.title}</h2><ul className="mt-2 space-y-2 text-sm">{sec.items.map((item,idx)=><li key={idx}>{typeof item==="string"?item:item.particle?`${item.particle}：${item.usage}（${item.example}）`:`${item.pair}：${item.tip}`}</li>)}</ul></section>)}</motion.main>}

      {tab === "practice" && <motion.main key="practice" className="space-y-4" {...tabTransition}>{wrongQuestionCount === 0 && <section className={cardClass}><p className="text-sm text-rose-700">还没有错题，今天很顺利呀 🍡</p></section>}{[["A. 选择助词",practiceQuestions.sectionA],["B. 翻译成日语",practiceQuestions.sectionB],["C. 动词变形",practiceQuestions.sectionC]].map(([label,sec])=><section key={sec.title} className={cardClass}><h2 className="text-lg font-bold">{label}</h2>{sec.questions.map((q)=><div key={q.id} className="mt-3 rounded-2xl bg-stone-50 p-3"><p className="text-sm font-medium">{q.id}. {q.prompt}</p><div className="mt-2 flex gap-2"><button onClick={()=>setAnswersVisible((v)=>({...v,[q.id]:!v[q.id]}))} className="rounded-full bg-rose-100 px-3 py-1 text-xs">{answersVisible[q.id]?"隐藏答案":"查看答案"}</button><motion.button whileTap={{ scale: 1.08 }} onClick={()=>toggleWrongQuestion(q.id)} className={`rounded-full px-3 py-1 text-xs ${plan.wrongQuestions[q.id]?"bg-amber-200":"bg-stone-200"}`}>{plan.wrongQuestions[q.id]?"已标记错题":"标记错题"}</motion.button></div>{answersVisible[q.id] && <p className="mt-1 text-sm text-rose-700">参考答案：{q.answer}</p>}</div>)}</section>)}</motion.main>}

      {tab === "checkin" && <motion.main key="checkin" className="space-y-3" {...tabTransition}>{todayCheckin && !todayCheckin.done && <section className={cardClass}><p className="text-sm text-rose-700">学5分钟也可以打卡，先开始就赢了 🌷</p></section>}{checkinPlan.items.map((item)=>{const state=plan.checkins.find((c)=>c.day===item.day)||{done:false,sentence:"",mistakes:""}; return <section key={item.day} className="rounded-[1.5rem] border border-rose-100 bg-white/80 p-4 shadow-[0_10px_25px_rgba(251,113,133,0.12)] transition hover:-translate-y-1"><div className="flex items-center justify-between"><h3 className="font-bold">Day {item.day}</h3><motion.button whileTap={{ scale: 1.08 }} onClick={()=>toggleCheckin(item.day)} className={`rounded-full px-3 py-1 text-xs ${state.done?"bg-rose-500 text-white":"bg-rose-100 text-rose-700"}`}>{state.done?"已完成":"完成"}</motion.button></div><input value={state.sentence} onChange={(e)=>updateCheckinField(item.day,"sentence",e.target.value)} placeholder="造句" className="mt-2 w-full rounded-xl border border-rose-100 px-3 py-2 text-sm"/><input value={state.mistakes} onChange={(e)=>updateCheckinField(item.day,"mistakes",e.target.value)} placeholder="错题" className="mt-2 w-full rounded-xl border border-rose-100 px-3 py-2 text-sm"/></section>;})}
      <section className={cardClass}><div className="flex items-center gap-2"><Settings size={18} className="text-rose-600" /><h2 className="text-lg font-bold">设置</h2></div></section>
    </motion.main>}

    {tab === "resources" && <motion.main key="resources" className="grid gap-5 md:grid-cols-2" {...tabTransition}>
      {resources.length === 0 ? <section className={cardClass}><p className="flex items-center gap-2 text-sm text-rose-700"><Inbox size={16} />资源小篮子暂时空空的 🧺</p></section> : resources.map((category) => (
        <section key={category.title} className={cardClass}><h2 className="flex items-center gap-2 text-lg font-bold"><BookOpen size={16} className="text-rose-500" />{category.title}</h2><p className="mt-2 text-sm text-stone-600">{category.description}</p><div className="mt-3 flex flex-wrap gap-2">{category.links.map((link) => (<a key={link.href} href={link.href} target="_blank" rel="noreferrer" className="rounded-full bg-rose-100 px-3 py-1 text-sm text-rose-700 hover:bg-rose-200">{link.label}</a>))}</div></section>
      ))}
    </motion.main>}
    </AnimatePresence>
  </div></div>;
}
