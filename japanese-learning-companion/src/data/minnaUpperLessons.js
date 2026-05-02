export const minnaUpperLessons = Array.from({ length: 25 }, (_, i) => {
  const n = i + 1;
  return {
    lessonNumber: n,
    title: `第${n}课复习`,
    goal: `掌握第${n}课核心句型并能在日常场景中输出。`,
    grammarPoints: [
      `第${n}课核心句型1`,
      `第${n}课核心句型2`,
      `第${n}课核心句型3`
    ],
    keywords: [`第${n}课词汇A`, `第${n}课词汇B`, `第${n}课词汇C`, `第${n}课词汇D`],
    examples: [
      { jp: `これは第${n}課の例文です。`, cn: `这是第${n}课的例句。` },
      { jp: `わたしは第${n}課を復習します。`, cn: `我复习第${n}课。` }
    ],
    miniPractice: [
      { type: "fill", prompt: `请用第${n}课句型补全句子。` },
      { type: "translate", prompt: `把“我今天复习第${n}课”翻成日语。` }
    ]
  };
});
