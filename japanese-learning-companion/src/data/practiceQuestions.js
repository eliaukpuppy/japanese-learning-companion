export const practiceQuestions = {
  sectionA: {
    title: "综合练习 A：选择助词",
    questions: [
      { id: "A1", prompt: "わたし___毎日日本語を勉強します。", choices: ["は", "を", "に"], answer: "は" },
      { id: "A2", prompt: "7時___起きます。", choices: ["で", "に", "が"], answer: "に" },
      { id: "A3", prompt: "図書館___本を読みます。", choices: ["で", "を", "へ"], answer: "で" }
    ]
  },
  sectionB: {
    title: "综合练习 B：翻译成日语",
    questions: [
      { id: "B1", prompt: "我每天学习日语。", answer: "わたしは毎日日本語を勉強します。" },
      { id: "B2", prompt: "明天去学校。", answer: "あした学校へ行きます。" },
      { id: "B3", prompt: "这里很安静。", answer: "ここは静かです。" }
    ]
  },
  sectionC: {
    title: "综合练习 C：动词变形",
    questions: [
      { id: "C1", prompt: "食べます → て形", answer: "食べて" },
      { id: "C2", prompt: "読みます → ない形", answer: "読まない" },
      { id: "C3", prompt: "行きます → た形", answer: "行った" }
    ]
  },
  answerKey: "答案已包含在各题 answer 字段中，便于后续页面直接读取。"
};
