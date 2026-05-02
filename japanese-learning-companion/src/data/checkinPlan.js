export const checkinPlan = {
  title: "30天复习打卡表",
  totalDays: 30,
  items: Array.from({ length: 30 }, (_, i) => ({
    day: i + 1,
    focus: `第${Math.min(25, i + 1)}课复习`,
    done: false,
    note: ""
  }))
};
