// 全部数据契约，零逻辑。

/** 场景 ID，与 src/data/*.json 一一对应 */
export type SceneId =
  | 'greetings'
  | 'numbers'
  | 'daily'
  | 'transport'
  | 'shopping'
  | 'food'
  | 'directions'
  | 'phone'
  | 'work'
  | 'tech'
  | 'feelings';

/** 词库静态条目 */
export interface Word {
  id: string; // 如 "greetings-001"，SRS 进度以此挂接
  en: string; // 英文词条/短语/句型
  ipa: string; // 美式 IPA；长短语允许空字符串
  zh: string; // 中文释义（含语用说明）
  example: string; // 独立生活例句
  exampleZh: string; // 例句中文翻译
  scene: SceneId;
  difficulty: 1 | 2 | 3; // 1=简单 2=高频搭配 3=长句/易错
}

/** 场景元信息（用于 tab、图标、校验） */
export interface Scene {
  id: SceneId;
  zh: string;
  icon: string; // 单个 emoji，避免图标库
  count: number; // 期望词数，assertWordsValid 对账用
}

/** 复习评分四档 */
export type Grade = 'again' | 'hard' | 'good' | 'easy';

/** 单个词的 SRS 状态（存 localStorage） */
export interface CardState {
  id: string;
  ease: number; // 初始 2.5，钳制 [1.3, 3.0]
  interval: number; // 距下次复习的天数；0 = 今天到期
  reps: number; // 连续成功次数（again 清零）
  lapses: number; // 历史遗忘次数
  due: number; // 到期日 = 当天 0 点毫秒 + interval*天
  createdAt: number; // 首次入卡时间
}

/** 应用全局状态（localStorage 唯一 blob） */
export interface AppState {
  version: 1;
  cards: Record<string, CardState>;
  checkins: Record<string, number>; // "2026-09-29" -> 当日活动次数
  newPerDay: number; // 每日新词上限
  quizTotal: number; // 小测累计做题数
}
