import { motion } from "framer-motion";
import { quickReference } from "../data/quickReference";
export default function QuickReferenceTab(){return <motion.main initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} className="grid gap-5 md:grid-cols-2">{quickReference.map((item)=><section key={item} className="rounded-[2rem] bg-white/80 p-6 shadow-sm ring-1 ring-rose-100"><h2 className="text-lg font-bold text-stone-900">{item}</h2><p className="mt-2 text-sm text-stone-600">（结构预留）后续补充可检索内容。</p></section>)}</motion.main>}
