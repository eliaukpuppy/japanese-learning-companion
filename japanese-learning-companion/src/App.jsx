import React, { useEffect, useMemo, useState } from "react";
import { Sparkles, CalendarCheck, Target, BookOpen, ListChecks, PenSquare, Flame, RotateCcw, Heart } from "lucide-react";
import { initialPlan } from "./data/initialPlan";
import TodayTab from "./components/TodayTab";
import CourseTab from "./components/CourseTab";
import QuickReferenceTab from "./components/QuickReferenceTab";
import PracticeTab from "./components/PracticeTab";
import CheckinTab from "./components/CheckinTab";
import ResourcesTab from "./components/ResourcesTab";

const STORAGE_KEY = "nihongo-companion-v1";
const getTodayTasks = (stage) => [{ icon: RotateCcw, title: "5分钟复习", desc: "回看昨天的3个词/1个句型" }, { icon: BookOpen, title: "15分钟主线学习", desc: stage.units.find((u) => !u.done)?.title || stage.units[0].title }, { icon: CalendarCheck, title: "5分钟输出", desc: "写1句日语或录10秒跟读" }, { icon: Heart, title: "5分钟奖励", desc: "看一句漫画/乙游/乙抓台词，不要求全懂" }];
const progressOfStage = (stage) => Math.round((stage.units.filter((u) => u.done).length / stage.units.length) * 100);
const allProgress = (stages) => { const units = stages.flatMap((s) => s.units); return Math.round((units.filter((u) => u.done).length / units.length) * 100); };

export default function JapaneseLearningCompanion() {
  const [plan, setPlan] = useState(() => {
    try { const raw = localStorage.getItem(STORAGE_KEY); const parsed = raw ? JSON.parse(raw) : initialPlan; return { ...initialPlan, ...parsed, checkins: parsed.checkins || initialPlan.checkins }; } catch { return initialPlan; }
  });
  const [tab, setTab] = useState("today");
  const [showPracticeAnswer, setShowPracticeAnswer] = useState(false);
  useEffect(() => localStorage.setItem(STORAGE_KEY, JSON.stringify(plan)), [plan]);

  const currentStage = useMemo(() => plan.stages.find((s) => s.id === plan.currentStageId) || plan.stages[0], [plan]);
  const totalProgress = allProgress(plan.stages);

  return <div className="min-h-screen bg-gradient-to-br from-rose-50 via-orange-50 to-violet-50 text-stone-800"><div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8"><header className="mb-6 overflow-hidden rounded-[2rem] bg-white/75 p-6 shadow-sm ring-1 ring-rose-100 backdrop-blur"><div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between"><div><div className="mb-3 inline-flex items-center gap-2 rounded-full bg-rose-100 px-3 py-1 text-sm font-medium text-rose-700"><Sparkles size={16} /> 30分钟也能慢慢学会日语</div><h1 className="text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">{plan.profile.title}</h1></div><div className="rounded-3xl bg-gradient-to-br from-rose-100 to-violet-100 p-5 text-center shadow-inner"><div className="text-sm text-stone-600">总进度</div><div className="mt-1 text-4xl font-black text-rose-600">{totalProgress}%</div></div></div></header>
<nav className="mb-6 grid grid-cols-3 gap-2 rounded-3xl bg-white/70 p-2 shadow-sm ring-1 ring-rose-100 backdrop-blur sm:grid-cols-6">{[["today","今日",CalendarCheck],["route","课程",Target],["quick","速查",ListChecks],["practice","练习",PenSquare],["checkin","打卡",Flame],["resources","资源",BookOpen]].map(([key,label,Icon])=><button key={key} onClick={()=>setTab(key)} className={`flex items-center justify-center gap-2 rounded-2xl px-3 py-3 text-sm font-semibold transition ${tab===key?"bg-rose-500 text-white shadow-sm":"text-stone-600 hover:bg-rose-50"}`}><Icon size={17}/>{label}</button>)}</nav>
{tab==="today"&&<TodayTab currentStage={currentStage} progressOfStage={progressOfStage} todayTasks={getTodayTasks(currentStage)} />}
{tab==="route"&&<CourseTab stages={plan.stages} currentStageId={plan.currentStageId} progressOfStage={progressOfStage} setCurrentStage={(id)=>setPlan((p)=>({...p,currentStageId:id}))} toggleUnit={(stageId,unitId)=>setPlan((p)=>({...p,stages:p.stages.map((s)=>s.id!==stageId?s:{...s,units:s.units.map((u)=>u.id===unitId?{...u,done:!u.done}:u)})}))} />}
{tab==="quick"&&<QuickReferenceTab />}
{tab==="practice"&&<PracticeTab showPracticeAnswer={showPracticeAnswer} setShowPracticeAnswer={setShowPracticeAnswer} />}
{tab==="checkin"&&<CheckinTab checkins={plan.checkins} toggleCheckin={(day)=>setPlan((p)=>({...p,checkins:p.checkins.map((c)=>c.day===day?{...c,done:!c.done}:c)}))} />}
{tab==="resources"&&<ResourcesTab />}
<div className="mt-6"><button onClick={()=>{localStorage.removeItem(STORAGE_KEY);setPlan(initialPlan);}} className="w-full rounded-2xl bg-stone-100 px-4 py-3 text-sm font-bold text-stone-600 hover:bg-stone-200">重置演示数据</button></div>
</div></div>;
}
