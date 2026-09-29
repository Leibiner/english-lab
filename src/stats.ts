// 视图：统计。连续打卡、近 30 天打卡格、各场景进度、每日新词上限设置。
import type { AppState, CardState, Scene } from './types';
import { SCENES, WORDS } from './data';
import { getState, persist, todayKey } from './store';
import { DAY_MS, dueCount, isMature } from './srs';
import { el } from './ui';

/** 连续打卡天数。今天还没打卡不算断，从昨天往回数 */
export function streakDays(checkins: Record<string, number>, now: number = Date.now()): number {
  let streak = 0;
  const startOffset = (checkins[todayKey(now)] ?? 0) > 0 ? 0 : 1;
  for (let i = startOffset; i < 366; i += 1) {
    if ((checkins[todayKey(now - i * DAY_MS)] ?? 0) > 0) streak += 1;
    else break;
  }
  return streak;
}

interface SceneRow {
  scene: Scene;
  learned: number;
  mature: number;
  total: number;
}

export function sceneProgress(state: AppState): SceneRow[] {
  return SCENES.map((scene) => {
    const words = WORDS.filter((w) => w.scene === scene.id);
    const cards = words.flatMap((w) => {
      const c = state.cards[w.id];
      return c ? [c] : [];
    });
    return {
      scene,
      learned: cards.length,
      mature: cards.filter((c: CardState) => isMature(c)).length,
      total: words.length,
    };
  });
}

function statCard(value: string, label: string): HTMLElement {
  const box = el('div', 'stat-card');
  box.append(el('div', 'stat-value', value), el('div', 'stat-label', label));
  return box;
}

function checkinGrid(state: AppState, now: number): HTMLElement {
  const grid = el('div', 'checkin-grid');
  for (let i = 29; i >= 0; i -= 1) {
    const day = todayKey(now - i * DAY_MS);
    const count = state.checkins[day] ?? 0;
    const cell = el('div', `checkin-cell${count > 0 ? ' on' : ''}`);
    cell.title = `${day} · ${count} 次学习`;
    grid.append(cell);
  }
  return grid;
}

function progressList(state: AppState): HTMLElement {
  const wrap = el('div', 'scene-progress');
  for (const row of sceneProgress(state)) {
    const fill = el('div', 'progress-fill');
    fill.style.width = row.total > 0 ? `${Math.round((row.learned / row.total) * 100)}%` : '0%';
    const track = el('div', 'progress-track');
    track.append(fill);
    const num = row.mature > 0 ? `${row.learned}/${row.total} · 熟 ${row.mature}` : `${row.learned}/${row.total}`;
    const line = el('div', 'progress-row');
    line.append(
      el('span', 'progress-label', `${row.scene.icon} ${row.scene.zh}`),
      track,
      el('span', 'progress-num', num),
    );
    wrap.append(line);
  }
  return wrap;
}

export function renderStats(root: HTMLElement): void {
  root.replaceChildren();
  const state = getState();
  const now = Date.now();

  const summary = el('div', 'summary-row');
  summary.append(
    statCard(`${streakDays(state.checkins, now)} 天`, '🔥 连续打卡'),
    statCard(`${Object.keys(state.cards).length}/${WORDS.length}`, '📖 已学'),
    statCard(`${Object.values(state.cards).filter((c) => isMature(c)).length}`, '🎓 已掌握'),
    statCard(`${dueCount(state, now)}`, '⏰ 今日待复习'),
  );

  const setting = el('div', 'setting-row');
  setting.append(el('span', undefined, '每日新词上限'));
  const select = el('select', 'new-per-day');
  for (const value of [5, 10, 15, 20]) {
    const option = el('option', undefined, String(value));
    option.value = String(value);
    if (value === state.newPerDay) option.selected = true;
    select.append(option);
  }
  select.addEventListener('change', () => {
    state.newPerDay = Number(select.value);
    persist();
  });
  setting.append(select);

  root.append(
    summary,
    el('h3', undefined, '📅 近 30 天打卡'),
    checkinGrid(state, now),
    el('h3', undefined, '🗂️ 各场景进度'),
    progressList(state),
    setting,
    el('div', 'footnote', `小测累计 ${state.quizTotal} 题 · 进度存在浏览器 localStorage，换浏览器需先导出`),
  );
}
