// 教程卡组内容：英语数词完整规则。无封面，第一页直接开讲；每页内容列全、写清楚。
// 数据与渲染分离（cards.ts 负责排版）。

export interface TopicRow {
  label: string; // 左标签：数字或区名，如 "13"、"规则"
  word: string; // 核心内容（英文）
  note: string; // 中文注释/坑
  hl?: boolean; // 荧光标记（拼写/听力坑）
}

export interface TopicSection {
  title: string; // 页标题（就是本页要讲的事）
  en: string;
  compact?: boolean; // true=逐行小字全列表；false=大块讲解
  rows: TopicRow[];
  demo: string; // 示范行：一个具体例子
  tip?: string; // 本页最容易错的一点
}

export interface TopicDeck {
  id: string;
  title: string;
  en: string;
  post: string[]; // 小红书发帖文案：标题/正文行/标签
  sections: TopicSection[];
}

export const NUMBER_TUTORIAL: TopicDeck = {
  id: 'numbers',
  title: '英语数词',
  en: '0 → 1,000,000',
  post: [
    '【标题·二选一】',
    '英语数词笔记｜0到百万读法全整理',
    '一张存下｜英语数字+序数词读法',
    '',
    '【正文】',
    '英语数词 · 笔记',
    '',
    '① 0-12 硬背',
    'zero（电话读 oh）',
    'one  two（w不发音）  three（咬舌θ）',
    'four  five（v振动）  six（尾音ks）',
    'seven  eight（一个t）  nine  ten',
    'eleven  twelve',
    '',
    '② 13-19＝数字+teen（重音 -TEEN）',
    '特例：thirteen｜fifteen｜eighteen',
    '听力坑：40 FOR-ty↘ vs 14 four-TEEN↗',
    '',
    '③ 20-90＝-ty，重音在前',
    'forty无u｜eighty一个t',
    '21-99 加连字符不加 and：twenty-one',
    '',
    '④ 百位',
    '345＝three hundred (and) forty-five',
    'two hundred students ✓',
    'two hundreds ✗｜hundreds of（数百）加 s',
    '',
    '⑤ 逗号换挡',
    '2 个逗号＝million（锚点）｜3 个＝billion',
    '1,234,567＝',
    'one million',
    'two hundred thirty-four thousand',
    'five hundred sixty-seven',
    '',
    '⑥ 中英换算（中4位切，英3位切）',
    '10,000 万＝ten thousand',
    '1,000,000 百万＝one million',
    '100,000,000 亿＝one hundred million',
    '1.5亿＝one hundred fifty million',
    '',
    '⑦ 序数词：first second third 硬背',
    '变形：fifth｜ninth｜twelfth｜twentieth(y→ie)',
    '只变个位：twenty-first',
    'the second floor｜May 3rd＝May the third',
    '',
    '⑧ 场景',
    '年龄 in his twenties',
    '年份 1990＝nineteen ninety',
    '　　　2025＝twenty twenty-five',
    '时刻 6:15＝a quarter past six',
    '　　　6:45＝a quarter to seven',
    '（≤30 past｜>30 to）',
    '',
    '口诀：每三位一切，段内几百十几几，',
    '段尾挂千百万，顺序要用 th',
    '',
    '【标签】',
    '#英语笔记 #英语学习 #数词 #基数词 #序数词 #大数读法 #音标 #成人英语 #学习笔记分享 #英语干货',
  ],
  sections: [
    {
      title: '0-12：全部硬背，没有规律',
      en: 'BASICS',
      compact: true,
      rows: [
        { label: '0', word: 'zero', note: '报电话号码常读 oh（505 = five oh five）' },
        { label: '1', word: 'one /wʌn/', note: 'one more＝再来一个' },
        { label: '2', word: 'two /tuː/', note: 'w 不发音' },
        { label: '3', word: 'three /θriː/', note: '咬舌清音 /θ/' },
        { label: '4', word: 'four /fɔːr/', note: '' },
        { label: '5', word: 'five /faɪv/', note: 'v 唇齿音带振动' },
        { label: '6', word: 'six /sɪks/', note: '尾音 /ks/ 要出来' },
        { label: '7', word: 'seven /ˈsevən/', note: '重音在前' },
        { label: '8', word: 'eight /eɪt/', note: '两个 t 只发一个' },
        { label: '9', word: 'nine /naɪn/', note: '鼻音收尾' },
        { label: '10', word: 'ten /ten/', note: '' },
        { label: '11', word: 'eleven /ɪˈlevn/', note: '重音在后' },
        { label: '12', word: 'twelve /twelv/', note: 've 发 /v/' },
      ],
      demo: '这 13 个是一切数字的地基，背熟再往下',
    },
    {
      title: '13-19：数字 + teen（重音 -TEEN）',
      en: 'TEENS',
      compact: true,
      rows: [
        { label: '13', word: 'thirteen', note: '不是 three-teen，拼写变了', hl: true },
        { label: '14', word: 'fourteen', note: '重音后：four-TEEN ↗' },
        { label: '15', word: 'fifteen', note: 'five 变 fif', hl: true },
        { label: '16', word: 'sixteen', note: '' },
        { label: '17', word: 'seventeen', note: '' },
        { label: '18', word: 'eighteen', note: '只写一个 t', hl: true },
        { label: '19', word: 'nineteen', note: '' },
      ],
      demo: '16 → sixteen /ˌsɪksˈtiːn/    13 → thirteen /ˌθɜːrˈtiːn/',
      tip: '听力生死线：fourTEEN(14) 重音在后，FORty(40) 重音在前——听重音不猜',
    },
    {
      title: '20-90：整十 -ty，重音在前',
      en: 'TENS',
      compact: true,
      rows: [
        { label: '20', word: 'twenty', note: 'TWEN-ty ↘' },
        { label: '30', word: 'thirty', note: 'three 变 thir' },
        { label: '40', word: 'forty', note: 'four 去掉 u！', hl: true },
        { label: '50', word: 'fifty', note: 'five 变 fif' },
        { label: '60', word: 'sixty', note: '' },
        { label: '70', word: 'seventy', note: '' },
        { label: '80', word: 'eighty', note: 'eight 去一个 t', hl: true },
        { label: '90', word: 'ninety', note: '' },
      ],
      demo: '30 → thirty（不是 three-ty）    50 → fifty（不是 fivty）',
    },
    {
      title: '21-99：连字符必须有',
      en: 'HYPHEN RULE',
      compact: true,
      rows: [
        { label: '21', word: 'twenty-one', note: '不加 and' },
        { label: '35', word: 'thirty-five', note: '' },
        { label: '44', word: 'forty-four', note: 'forty 拼写别带错' },
        { label: '58', word: 'fifty-eight', note: '' },
        { label: '67', word: 'sixty-seven', note: '' },
        { label: '99', word: 'ninety-nine', note: '' },
      ],
      demo: '公式：TENS + 连字符 + ONES',
      tip: '整十不加连字符（twenty ✓），有零头必须加（twenty one ✗）',
    },
    {
      title: '三位数：hundred + and',
      en: 'HUNDRED',
      rows: [
        { label: '公式', word: 'X hundred (and) YZ', note: '英音十位前必带 and；美音可省' },
        { label: '具体量', word: 'two hundred students', note: 'hundred 不加 s、不加 of ✓' },
        { label: '模糊量', word: 'hundreds of students', note: '数百名学生——这时才加 s + of', hl: true },
      ],
      demo: '345 → three hundred (and) forty-five',
      tip: 'two hundreds ✗——有具体数字时 hundred 永远单数',
    },
    {
      title: '四位数以上：逗号换挡',
      en: 'COMMA = SHIFT',
      rows: [
        { label: '1 个逗号', word: '1,000 → one thousand', note: '两千＝two thousand（不加 s）' },
        { label: '2 个逗号', word: '1,000,000 → one million', note: '锚点！百万＝两个逗号', hl: true },
        { label: '3 个逗号', word: '1,000,000,000 → one billion', note: '十亿' },
      ],
      demo: '1,234,567 → one million · two hundred thirty-four thousand · five hundred sixty-seven',
      tip: '3,050 → three thousand (and) fifty：零头那一段照常读百十个',
    },
    {
      title: '中英换算：中文4位切，英文3位切',
      en: 'CN ↔ EN',
      compact: true,
      rows: [
        { label: '万', word: '10,000 → ten thousand', note: '英文没有"万"，＝10 个千', hl: true },
        { label: '十万', word: '100,000 → one hundred thousand', note: '' },
        { label: '百万', word: '1,000,000 → one million', note: '正好＝million' },
        { label: '千万', word: '10,000,000 → ten million', note: '' },
        { label: '亿', word: '100,000,000 → one hundred million', note: '英文没有"亿"，＝100 个百万', hl: true },
      ],
      demo: '23万 → two hundred thirty thousand    1.5亿 → one hundred fifty million',
    },
    {
      title: '序数词 I：例外与变形',
      en: 'ORDINAL',
      rows: [
        { label: '硬背', word: 'first · second · third', note: '1st 2nd 3rd 完全变形，没规律', hl: true },
        { label: '规则', word: 'fourth · sixth · tenth', note: '4 往上大多直接 +th' },
        { label: '变形', word: 'fifth · ninth · twelfth', note: 've→f、去 e、加 th', hl: true },
        { label: '整十', word: 'twentieth · thirtieth', note: 'y 变 ie 再加 th' },
      ],
      demo: '21st → twenty-first（复合词只变个位）',
      tip: '序数词前面几乎总带 the：the second floor · the first prize',
    },
    {
      title: '序数词 II：日期·年龄·时刻',
      en: 'IN REAL LIFE',
      compact: true,
      rows: [
        { label: '日期', word: 'May 3rd → 读 May the third', note: '书写可省 the，读必须读出来' },
        { label: '年龄', word: 'in his twenties', note: 'in one\'s + 整十复数＝二十多岁' },
        { label: '年份', word: '1990 → nineteen ninety', note: '两位一组；2025 → twenty twenty-five' },
        { label: '≤30分', word: '6:15 a quarter past six', note: 'past＝过了' },
        { label: '>30分', word: '6:45 a quarter to seven', note: 'to＝差几分到几点', hl: true },
      ],
      demo: '世纪：the twentieth century（20 世纪）',
    },
    {
      title: '自测 5 题：全对通关',
      en: 'QUIZ',
      compact: true,
      rows: [
        { label: '1', word: '40 和 14 怎么读得不一样？', note: 'FOR-ty↘ / four-TEEN↗' },
        { label: '2', word: '230,000', note: 'two hundred thirty thousand' },
        { label: '3', word: '1,005', note: 'one thousand (and) five' },
        { label: '4', word: '第 25 层', note: 'the twenty-fifth floor（five→fifth）' },
        { label: '5', word: '1.2 亿', note: 'one hundred twenty million' },
      ],
      demo: '口诀：每三位一切 · 段内几百十几几 · 段尾挂千百万 · 顺序要用 th',
      tip: '全对 → 0 到 1,000,000 你已经没有读不对的数',
    },
  ],
};

export const TOPIC_DECKS: Record<string, TopicDeck> = { numbers: NUMBER_TUTORIAL };
