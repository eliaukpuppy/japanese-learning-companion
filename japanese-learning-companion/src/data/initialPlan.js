import { minnaLessons } from "./minnaLessons";
import { checkinPlan } from "./checkinPlan";

export const initialPlan = {
  profile: {
    title: "我的日语自学小搭子",
    level: "会五十音，学到《大家的日语》第10课",
    goal: "达到N2，能看懂日本漫画、玩日乙游戏、听懂乙抓",
    dailyTime: "每天30分钟",
    interestRule: "兴趣输入每周集中一次"
  },
  currentStageId: "stage-1",
  stages: minnaLessons,
  checkins: checkinPlan
};
