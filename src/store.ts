// 唯一碰 localStorage 的文件：状态单例 + 本地日期工具。
import type { AppState } from './types';

export const STORAGE_KEY = 'english-lab:state:v1';

function defaults(): AppState {
  return { version: 1, cards: {}, checkins: {}, newPerDay: 10, quizTotal: 0 };
}

function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaults();
    const parsed = JSON.parse(raw) as Partial<AppState>;
    return { ...defaults(), ...parsed, cards: parsed.cards ?? {}, checkins: parsed.checkins ?? {} };
  } catch {
    return defaults(); // 数据损坏则重置，不让应用白屏
  }
}

let state: AppState = loadState();

export function getState(): AppState {
  return state;
}

export function persist(): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function pad2(n: number): string {
  return String(n).padStart(2, '0');
}

/** 本地时区的 "YYYY-MM-DD"。禁用 toISOString——UTC+8 早 8 点前会算错一天 */
export function todayKey(ts: number = Date.now()): string {
  const d = new Date(ts);
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

/** 记一次当日活动（驱动打卡格与连续天数） */
export function recordActivity(s: AppState, now: number = Date.now()): void {
  const key = todayKey(now);
  s.checkins[key] = (s.checkins[key] ?? 0) + 1;
}
