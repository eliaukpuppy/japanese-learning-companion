import { motion } from "framer-motion";
import { BookOpen } from "lucide-react";
import { resources } from "../data/resources";

export default function ResourcesTab() {
  return <motion.main initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">{resources.map((resource) => <div key={resource.title} className="rounded-[2rem] bg-white/80 p-6 shadow-sm ring-1 ring-rose-100"><div className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-rose-100 text-rose-600"><BookOpen size={21} /></div><h2 className="text-lg font-bold text-stone-900">{resource.title}</h2><p className="mt-1 font-semibold text-rose-600">{resource.name}</p><p className="mt-3 text-sm leading-6 text-stone-600">{resource.desc}</p><div className="mt-4 flex flex-wrap gap-2">{resource.links.map((link) => <a key={link.href} href={link.href} target="_blank" rel="noreferrer" className="rounded-full bg-rose-100 px-3 py-1.5 text-xs font-semibold text-rose-700 transition hover:bg-rose-200">{link.label}</a>)}</div></div>)}</motion.main>;
}
