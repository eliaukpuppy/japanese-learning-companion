import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, CalendarCheck, CheckCircle2, Heart, Sparkles, Target, Trophy, RotateCcw, ChevronRight, Clock, Gamepad2, ListChecks, PenSquare, Flame } from "lucide-react";
import { minnaUpperLessons } from "./data/minnaUpperLessons";
import { quickReference } from "./data/quickReference";
import { practiceQuestions } from "./data/practiceQuestions";
import { checkinPlan } from "./data/checkinPlan";

const STORAGE_KEY = "nihongo-companion-v1";

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
const progressOfStage = (stage) => Math.round((stage.units.filter((u) => u.done).length / stage.units.length) * 100);
const allProgress = (stages) => {
  const units = stages.flatMap((s) => s.units);
  return Math.round((units.filter((u) => u.done).length / units.length) * 100);
};

export default function JapaneseLearningCompanion() {
  const [plan, setPlan] = useState(loadPlan);
  const [tab, setTab] = useState("today");
  const [answersVisible, setAnswersVisible] = useState({});
  useEffect(() => savePlan(plan), [plan]);
  const currentStage = useMemo(() => plan.stages.find((s) => s.id === plan.currentStageId) || plan.stages[0], [plan]);

  const toggleLessonCheck = (lessonNumber) => setPlan((p) => ({ ...p, lessonChecks: { ...p.lessonChecks, [lessonNumber]: !p.lessonChecks[lessonNumber] } }));
  const toggleWrongQuestion = (id) => setPlan((p) => ({ ...p, wrongQuestions: { ...p.wrongQuestions, [id]: !p.wrongQuestions[id] } }));
  const toggleCheckin = (day) => setPlan((p) => ({ ...p, checkins: p.checkins.map((c) => c.day === day ? { ...c, done: !c.done } : c) }));
  const updateCheckinField = (day, field, value) => setPlan((p) => ({ ...p, checkins: p.checkins.map((c) => c.day === day ? { ...c, [field]: value } : c) }));

  return <div className="min-h-screen bg-gradient-to-br from-rose-50 via-orange-50 to-violet-50 text-stone-800"><div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
    <header className="mb-6 overflow-hidden rounded-[2rem] bg-white/75 p-6 shadow-sm ring-1 ring-rose-100 backdrop-blur"><h1 className="text-3xl font-bold">{plan.profile.title}</h1></header>
    <nav className="mb-6 grid grid-cols-3 gap-2 rounded-3xl bg-white/70 p-2 shadow-sm ring-1 ring-rose-100 backdrop-blur sm:grid-cols-6">
      {[["today", "今日", CalendarCheck],["route", "课程", Target],["quick", "速查", ListChecks],["practice", "练习", PenSquare],["checkin", "打卡", Flame],["resources", "资源", BookOpen]].map(([key,label,Icon]) => <button key={key} onClick={()=>setTab(key)} className={`flex items-center justify-center gap-2 rounded-2xl px-3 py-3 text-sm font-semibold ${tab===key?"bg-rose-500 text-white":"text-stone-600 hover:bg-rose-50"}`}><Icon size={17}/>{label}</button>)}
    </nav>

    {tab === "route" && <motion.main className="space-y-4">{minnaUpperLessons.slice(0,25).map((lesson)=><section key={lesson.lessonNumber} className="rounded-[2rem] bg-white/80 p-6 shadow-sm ring-1 ring-rose-100"><div className="flex justify-between"><h2 className="text-xl font-bold">{lesson.title}</h2><button onClick={()=>toggleLessonCheck(lesson.lessonNumber)} className={`rounded-full px-3 py-1 text-sm font-semibold ${plan.lessonChecks[lesson.lessonNumber]?"bg-emerald-100 text-emerald-700":"bg-rose-100 text-rose-700"}`}>{plan.lessonChecks[lesson.lessonNumber]?"已完成":"标记完成"}</button></div><p className="mt-2 text-sm">本课目标：{lesson.goal}</p><p className="mt-3 font-semibold">核心句型/语法</p><ul className="list-disc pl-5 text-sm">{lesson.grammarPoints.map((g)=><li key={g}>{g}</li>)}</ul><p className="mt-3 font-semibold">关键词/助词/形式</p><div className="mt-1 flex flex-wrap gap-2">{lesson.keywords.map((k)=><span key={k} className="rounded-full bg-rose-100 px-2 py-1 text-xs">{k}</span>)}</div><p className="mt-3 font-semibold">例句</p><ul className="text-sm">{lesson.examples.map((e,idx)=><li key={idx}>{e.jp}（{e.cn}）</li>)}</ul><p className="mt-3 font-semibold">小练习</p><ul className="list-disc pl-5 text-sm">{lesson.miniPractice.map((m,idx)=><li key={idx}>{m.prompt}</li>)}</ul></section>)}</motion.main>}

    {tab === "quick" && <motion.main className="grid gap-5 md:grid-cols-2">{[quickReference.particles,quickReference.verbForms,quickReference.adjectiveNoun,quickReference.confusionPairs].map((sec)=><section key={sec.title} className="rounded-[2rem] bg-white/80 p-6 shadow-sm ring-1 ring-rose-100"><h2 className="text-lg font-bold">{sec.title}</h2><ul className="mt-2 space-y-2 text-sm">{sec.items.map((item,idx)=><li key={idx}>{typeof item==="string"?item:item.particle?`${item.particle}：${item.usage}（${item.example}）`:`${item.pair}：${item.tip}`}</li>)}</ul></section>)}</motion.main>}

    {tab === "practice" && <motion.main className="space-y-4">{[["A. 选择助词",practiceQuestions.sectionA],["B. 翻译成日语",practiceQuestions.sectionB],["C. 动词变形",practiceQuestions.sectionC]].map(([label,sec])=><section key={sec.title} className="rounded-[2rem] bg-white/80 p-6 shadow-sm ring-1 ring-rose-100"><h2 className="text-lg font-bold">{label}</h2>{sec.questions.map((q)=><div key={q.id} className="mt-3 rounded-2xl bg-stone-50 p-3"><p className="text-sm font-medium">{q.id}. {q.prompt}</p>{q.choices && <p className="mt-1 text-xs text-stone-500">选项：{q.choices.join(" / ")}</p>}<div className="mt-2 flex gap-2"><button onClick={()=>setAnswersVisible((v)=>({...v,[q.id]:!v[q.id]}))} className="rounded-full bg-rose-100 px-3 py-1 text-xs">{answersVisible[q.id]?"隐藏答案":"查看答案"}</button><button onClick={()=>toggleWrongQuestion(q.id)} className={`rounded-full px-3 py-1 text-xs ${plan.wrongQuestions[q.id]?"bg-amber-200":"bg-stone-200"}`}>{plan.wrongQuestions[q.id]?"已标记错题":"标记错题"}</button></div>{answersVisible[q.id] && <p className="mt-1 text-sm text-rose-700">参考答案：{q.answer}</p>}</div>)}</section>)}</motion.main>}

    {tab === "checkin" && <motion.main className="space-y-3">{checkinPlan.items.map((item)=>{const state=plan.checkins.find((c)=>c.day===item.day)||{done:false,sentence:"",mistakes:""}; return <section key={item.day} className="rounded-[1.5rem] bg-white/80 p-4 shadow-sm ring-1 ring-rose-100"><div className="flex items-center justify-between"><h3 className="font-bold">Day {item.day}</h3><button onClick={()=>toggleCheckin(item.day)} className={`rounded-full px-3 py-1 text-xs ${state.done?"bg-rose-500 text-white":"bg-rose-100 text-rose-700"}`}>{state.done?"已完成":"完成"}</button></div><p className="text-sm mt-1">复习课次：{item.focus}</p><p className="text-sm">今日重点：{item.focus}</p><input value={state.sentence} onChange={(e)=>updateCheckinField(item.day,"sentence",e.target.value)} placeholder="造句" className="mt-2 w-full rounded-xl border border-rose-100 px-3 py-2 text-sm"/><input value={state.mistakes} onChange={(e)=>updateCheckinField(item.day,"mistakes",e.target.value)} placeholder="错题" className="mt-2 w-full rounded-xl border border-rose-100 px-3 py-2 text-sm"/></section>;})}</motion.main>}
  </div></div>;
}
