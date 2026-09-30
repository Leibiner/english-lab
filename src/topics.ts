// 教程卡组内容：数字读法完整规则。数据与渲染分离（cards.ts 负责排版）。
// 结构：思维导图封面 + 每个 section 一页细节。

export interface TopicRow {
  label: string; // 左侧区间标签，如 "1-12"
  word: string; // 核心内容（英文）
  note: string; // 一句话讲解
}

export interface TopicSection {
  title: string;
  en: string;
  rows: TopicRow[];
  demo: string; // 示范行：一个具体数字怎么读
  tip?: string; // 本页最容易错的一点
}

export interface TopicDeck {
  id: string;
  title: string;
  en: string;
  outcome: string; // 封面：学完能做到什么
  stat: string; // 封面数据行
  center: string[]; // 思维导图中心规则（分行）
  branches: { t: string; d: string }[]; // 中心下四个分支
  demoBig: { parts: { text: string; c: string }[] }; // 封面底部拆解示例，c=颜色类
  sections: TopicSection[];
}

export const NUMBER_TUTORIAL: TopicDeck = {
  id: 'numbers',
  title: '英语数字 · 一张图',
  en: '1 → 1,000,000',
  outcome: '学会这条规则：1 到 1,000,000 任意数字，看一眼就能读对',
  stat: '7 页细节拆解 · 左滑逐课学',
  center: ['每 3 位切一段', '段内读「百 · 十 · 个」', '段尾挂单位词'],
  branches: [
    { t: '段内三格', d: '1-999 的读法' },
    { t: '段尾单位', d: 'thousand / million' },
    { t: '中英换算', d: '万和亿没有对应词' },
    { t: '听口三坑', d: '14≠40 靠重音' },
  ],
  demoBig: {
    parts: [
      { text: '1', c: 'b1' }, { text: ', ', c: '' },
      { text: '234', c: 'b2' }, { text: ', ', c: '' },
      { text: '567', c: 'b3' },
      { text: '   one million · two hundred thirty-four thousand · five hundred sixty-seven', c: 'dim' },
    ],
  },
  sections: [
    {
      title: '硬背区：1-12',
      en: 'THE ONES',
      rows: [
        { label: '1-10', word: 'one two three four five six seven eight nine ten', note: '全独立单词。three 咬舌 /θ/，five 的 v 振动，eight 只发一个 /t/' },
        { label: '11-12', word: 'eleven · twelve', note: '唯一的两个"不讲理"，直接背' },
      ],
      demo: '3 → three /θriː/    12 → twelve /twelv/',
    },
    {
      title: 'teens 区：13-19',
      en: 'TEEN',
      rows: [
        { label: '规则', word: '数字 + teen', note: 'sixteen · seventeen · nineteen，重音落在 -TEEN 上 ↗' },
        { label: '拼写特例', word: 'thirteen · fifteen · eighteen', note: '3 是 thir 不是 three，5 去掉了 y，8 只写一个 t' },
      ],
      demo: '16 → sixteen（十六）    18 → eighteen（不是 eightteen）',
      tip: '14/40 陷阱提前记：fourTEEN 重音在后，FORty 重音在前',
    },
    {
      title: '整十区：20-90',
      en: 'TENS',
      rows: [
        { label: '规则', word: 'twenty thirty forty fifty … ninety', note: '重音全在前：TWEN-ty ↘；forty 拼写没有 u' },
        { label: '21-99', word: 'tens + 连字符 + ones', note: 'twenty-one、sixty-seven，中间不加 and' },
      ],
      demo: '67 → sixty-seven    90 → ninety',
    },
    {
      title: '百位格：段内第一格',
      en: 'HUNDRED',
      rows: [
        { label: '公式', word: 'X hundred (and) YZ', note: '英音十位前必带 and，美音可省；hundred 永远单数（有具体数字时）' },
        { label: '反例', word: 'two hundreds ✗', note: '只有 hundreds of（好几百人）这种模糊量才加 s' },
      ],
      demo: '345 → three hundred (and) forty-five',
    },
    {
      title: '逗号换挡：thousand → million',
      en: 'COMMA = SHIFT',
      rows: [
        { label: '台阶', word: '1,000 → one thousand', note: '过一个逗号换一个单位词' },
        { label: '', word: '1,000,000 → one million', note: '两个逗号 = 百万（记住这个锚点）' },
        { label: '', word: '1,000,000,000 → one billion', note: '三个逗号 = 十亿；单位词全部不加 s：two thousand ✓' },
      ],
      demo: '3,050 → three thousand (and) fifty',
    },
    {
      title: '中英换算：只背这 5 行',
      en: '×10000 vs ×1000',
      rows: [
        { label: '万', word: '10,000 → ten thousand', note: '英文没有"万"，= 10 个千' },
        { label: '十万', word: '100,000 → one hundred thousand', note: '段内 100 + thousand' },
        { label: '百万', word: '1,000,000 → one million', note: '锚点：两个逗号' },
        { label: '千万', word: '10,000,000 → ten million', note: '= 10 个百万' },
        { label: '亿', word: '100,000,000 → one hundred million', note: '英文没有"亿"，= 100 个百万' },
      ],
      demo: '23 万 → two hundred thirty thousand    1.5 亿 → one hundred fifty million',
    },
    {
      title: '口诀 + 自测',
      en: 'RECAP',
      rows: [
        { label: '口诀', word: '每三位一切 · 段内几百十几几 · 段尾挂千百万', note: 'THE ONLY RULE: slice by 3, read the chunk, add the comma word.' },
        { label: '自测 1', word: '40 vs 14', note: '读出来：FOR-ty ↘ / four-TEEN ↗' },
        { label: '自测 2', word: '230,000', note: 'two hundred thirty thousand' },
        { label: '自测 3', word: '1,005,000', note: 'one million and five thousand' },
      ],
      demo: '全对 → 1 到 1,000,000 你已经没有不会读的数字了',
    },
  ],
};

export const TOPIC_DECKS: Record<string, TopicDeck> = { numbers: NUMBER_TUTORIAL };
