// 教程卡组内容：英语数词完整规则（基数词 + 序数词）。数据与渲染分离（cards.ts 负责排版）。
// 结构：思维导图封面 + 每个 section 一页细节。

export interface TopicRow {
  label: string; // 左侧区间标签，如 "1-12"
  word: string; // 核心内容（英文）
  note: string; // 一句话讲解
  hl?: boolean; // 粉色荧光标记（拼写/听力坑）
}

export interface TopicSection {
  title: string;
  en: string;
  rows: TopicRow[];
  demo: string; // 示范行：一个具体例子
  tip?: string; // 本页最容易错的一点
}

export interface TopicDeck {
  id: string;
  title: string;
  en: string;
  outcome: string; // 封面：学完能做到什么
  stat: string; // 封面页脚行
  post: string[]; // 小红书发帖文案：标题/正文行/标签
  center: string[]; // 思维导图中心规则（分行）
  branches: { t: string; d: string }[]; // 中心下分支
  demoBig: { parts: { text: string; c: string }[] }; // 封面底部拆解示例，c=颜色类
  sections: TopicSection[];
}

export const NUMBER_TUTORIAL: TopicDeck = {
  id: 'numbers',
  title: '英语数词 · 一张图',
  en: '基数 + 序数 · 0 → 1,000,000',
  outcome: '学会这条规则：数字念得对，名次日期也说得出口',
  stat: '9 页细节拆解 · 左滑逐课学',
  post: [
    '【标题·二选一】',
    '英语数词笔记｜0到百万读法全整理',
    '一张存下｜英语数字+序数词读法',
    '',
    '【正文】',
    '英语数词 · 笔记',
    '',
    '① 0-12 硬背',
    'zero（电话 0 读 oh）',
    'one  two（w不发音）  three（咬舌θ）',
    'four  five（v振动）  six（尾音ks）',
    'seven  eight（一个t）  nine  ten',
    'eleven  twelve（无规律）',
    '',
    '② 13-19＝数字+teen，重音在 -TEEN',
    '特例：thirteen｜fifteen｜eighteen',
    '听力坑：40 FOR-ty↘ vs 14 four-TEEN↗',
    '',
    '③ 20-90＝-ty，重音在前',
    'forty 没有 u｜eighty 一个 t',
    '21-99 加连字符不加 and：twenty-one',
    '',
    '④ 百位',
    '345＝three hundred (and) forty-five',
    'two hundred students ✓',
    'two hundreds ✗（模糊量 hundreds of 才加 s）',
    '',
    '⑤ 逗号换挡：每 3 位一切',
    '2 个逗号＝million（锚点）｜3 个＝billion',
    '1,234,567＝',
    'one million',
    'two hundred thirty-four thousand',
    'five hundred sixty-seven',
    '',
    '⑥ 中英换算（中文4位一切，英文3位）',
    '10,000 万＝ten thousand',
    '1,000,000 百万＝one million',
    '100,000,000 亿＝one hundred million',
    '23万＝two hundred thirty thousand',
    '1.5亿＝one hundred fifty million',
    '',
    '⑦ 序数词：first second third 硬背',
    '变形：fifth｜ninth｜twelfth｜twentieth(y→ie)',
    '复合只变个位：twenty-first',
    'the second floor',
    'May 3rd 读 May the third',
    '',
    '⑧ 场景',
    '年龄 in his twenties',
    '年份 1990＝nineteen ninety',
    '　　　2025＝twenty twenty-five',
    '时刻 6:15＝a quarter past six',
    '　　　6:45＝a quarter to seven',
    '（≤30 past，>30 to）',
    '',
    '口诀：每三位一切，段内几百十几几，',
    '段尾挂千百万，顺序要用 th',
    '',
    '【标签】',
    '#英语笔记 #英语学习 #数词 #基数词 #序数词 #大数读法 #音标 #成人英语 #学习笔记分享 #英语干货',
  ],
  center: ['数词 = 基数（数量）+ 序数（顺序）', '大数每 3 位切一段', '段内读「百 · 十 · 个」段尾挂单位'],
  branches: [
    { t: '基数词', d: 'one two three · 数数量' },
    { t: '序数词', d: 'first second third · 排顺序' },
    { t: '大数换挡', d: 'thousand / million' },
    { t: '中英换算', d: '万和亿没有对应词' },
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
      title: '硬背区：0-12',
      en: 'THE ONES',
      rows: [
        { label: '0-10', word: 'zero one two three four five six seven eight nine ten', note: '全独立单词。three 咬舌 /θ/，five 的 v 振动，eight 只发一个 /t/；报电话号码 0 常读 oh' },
        { label: '11-12', word: 'eleven · twelve', note: '唯一的两个"不讲理"，直接背', hl: true },
      ],
      demo: '0 → zero    3 → three /θriː/    12 → twelve /twelv/',
    },
    {
      title: 'teens 区：13-19',
      en: 'TEEN',
      rows: [
        { label: '规则', word: '数字 + teen', note: 'sixteen · seventeen · nineteen，重音落在 -TEEN 上 ↗' },
        { label: '拼写特例', word: 'thirteen · fifteen · eighteen', note: '3 是 thir 不是 three，5 去掉了 y，8 只写一个 t', hl: true },
      ],
      demo: '16 → sixteen（十六）    18 → eighteen（不是 eightteen）',
      tip: '14/40 陷阱提前记：fourTEEN 重音在后，FORty 重音在前',
    },
    {
      title: '整十区：20-90',
      en: 'TENS',
      rows: [
        { label: '规则', word: 'twenty thirty forty fifty … ninety', note: '重音全在前：TWEN-ty ↘；forty 拼写没有 u', hl: true },
        { label: '21-99', word: 'tens + 连字符 + ones', note: 'twenty-one、sixty-seven，中间不加 and' },
      ],
      demo: '67 → sixty-seven    90 → ninety',
    },
    {
      title: '百位格：段内第一格',
      en: 'HUNDRED',
      rows: [
        { label: '公式', word: 'X hundred (and) YZ', note: '英音十位前必带 and，美音可省；hundred 永远单数（有具体数字时）' },
        { label: '反例', word: 'two hundreds ✗', note: '只有 hundreds of（好几百人）这种模糊量才加 s', hl: true },
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
        { label: '亿', word: '100,000,000 → one hundred million', note: '英文没有"亿"，= 100 个百万', hl: true },
      ],
      demo: '23 万 → two hundred thirty thousand    1.5 亿 → one hundred fifty million',
    },
    {
      title: '序数词 I：排顺序的词',
      en: 'ORDINAL',
      rows: [
        { label: '先背 3 个', word: 'first · second · third', note: '1st 2nd 3rd 完全变形，没有规律，硬背', hl: true },
        { label: '规则', word: 'fourth fifth … tenth + th', note: '4-19 大多直接加 th；二十以上只变个位：twenty-first' },
        { label: '拼写变化', word: 'five→fifth nine→ninth twelve→twelfth forty→fortieth', note: 've 变 f、e 去 加 th、y 变 ie —— 考试和口语都栽在这', hl: true },
      ],
      demo: '5 → five 第5 → fifth    21 → twenty-one 第21 → twenty-first',
    },
    {
      title: '序数词 II：什么时候用',
      en: 'WHEN TO USE',
      rows: [
        { label: '日期', word: 'May (the) twelfth', note: '书写可省 the，读必须读出 the；口语问日期用 What\'s the date?' },
        { label: '名次楼层', word: 'the first · the second floor', note: '序数词前面几乎总带 the：He won the first prize.' },
        { label: '世纪年代', word: 'the twentieth century', note: '整十变 tieth：twentieth · thirtieth', hl: true },
      ],
      demo: 'My birthday is on May 3rd → 读作 May the third',
      tip: '基数=数量几个，序数=顺序第几个，一句话分清 one / first',
    },
    {
      title: '口诀 + 自测',
      en: 'RECAP',
      rows: [
        { label: '口诀', word: '每三位一切 · 段内几百十几几 · 段尾挂千百万 · 顺序要用 th', note: 'THE ONLY RULE: slice by 3, read the chunk, add the comma word.' },
        { label: '自测 1', word: '40 vs 14', note: '读出来：FOR-ty ↘ / four-TEEN ↗' },
        { label: '自测 2', word: '230,000', note: 'two hundred thirty thousand' },
        { label: '自测 3', word: '第 25 层', note: 'the twenty-fifth floor（five→fifth 又变了）' },
      ],
      demo: '全对 → 1 到 1,000,000 的基数序数，你已经没有不会说的了',
    },
  ],
};

export const TOPIC_DECKS: Record<string, TopicDeck> = { numbers: NUMBER_TUTORIAL };
