// 简化 SM-2 间隔重复调度。全部纯函数：不碰 DOM、不碰 localStorage。
import type { AppState, CardState, Grade, SceneId, Word } from './types';

export const DAY_MS = 86_400_000;

export function dayStart(ts: number): number {
  const d = new Date(ts);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

function clampEase(ease: number): number {
  return Math.min(3, Math.max(1.3, Math.round(ease * 100) / 100));
}

export function newCard(id: string, now: number): CardState {
  return { id, ease: 2.5, interval: 0, reps: 0, lapses: 0, due: dayStart(now), createdAt: now };
}

/** 评分规则：again=今天重排 ease-0.2；hard=×1.2 ease-0.15；good=新卡1天否则×ease；easy=新卡3天否则×ease×1.3 */
export function schedule(card: CardState, grade: Grade, now: number): CardState {
  let { ease, interval, reps, lapses } = card;
  switch (grade) {
    case 'again':
      interval = 0;
      ease = clampEase(ease - 0.2);
      reps = 0;
      lapses += 1;
      break;
    case 'hard':
      interval = Math.max(1, Math.round(interval * 1.2));
      ease = clampEase(ease - 0.15);
      break;
    case 'good':
      interval = interval === 0 ? 1 : Math.round(interval * ease);
      reps += 1;
      break;
    case 'easy':
      interval = interval === 0 ? 3 : Math.ceil(interval * ease * 1.3);
      ease = clampEase(ease + 0.15);
      reps += 1;
      break;
  }
  return { ...card, ease, interval, reps, lapses, due: dayStart(now) + interval * DAY_MS };
}

export function isDue(card: CardState, now: number): boolean {
  return card.due <= dayStart(now);
}

export function dueCards(state: AppState, now: number): CardState[] {
  return Object.values(state.cards)
    .filter((c) => isDue(c, now))
    .sort((a, b) => a.due - b.due);
}

export function dueCount(state: AppState, now: number): number {
  return dueCards(state, now).length;
}

/** 今天已入卡的新词数 */
export function newLearnedCount(state: AppState, now: number): number {
  return Object.values(state.cards).filter((c) => c.createdAt >= dayStart(now)).length;
}

/** 今日剩余新词额度 */
export function newBudget(state: AppState, now: number): number {
  return Math.max(0, state.newPerDay - newLearnedCount(state, now));
}

/** 按场景挑未学的新词，简单的排前面，不超过今日额度 */
export function pickNew(
  state: AppState,
  words: Word[],
  scene: SceneId | 'all',
  now: number,
): Word[] {
  const budget = newBudget(state, now);
  if (budget === 0) return [];
  return words
    .filter((w) => !state.cards[w.id] && (scene === 'all' || w.scene === scene))
    .sort((a, b) => a.difficulty - b.difficulty || a.id.localeCompare(b.id))
    .slice(0, budget);
}

/** 掌握口径：间隔 >= 7 天且连续成功 >= 3 次 */
export function isMature(card: CardState): boolean {
  return card.interval >= 7 && card.reps >= 3;
}
