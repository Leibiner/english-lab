// 视图：学新词。场景筛选 + 翻牌 + 评分入卡。
import type { Grade, SceneId } from './types';
import { SCENES, WORDS } from './data';
import { getState, persist, recordActivity } from './store';
import { newBudget, newCard, newLearnedCount, pickNew, schedule } from './srs';
import { speak } from './tts';
import { el, gradeRow, wordCard } from './ui';

let currentScene: SceneId | 'all' = 'all';

export function renderStudy(root: HTMLElement): void {
  root.replaceChildren();

  const selector = el('div', 'scene-selector');
  const sceneButton = (id: SceneId | 'all', label: string): HTMLButtonElement => {
    const btn = el('button', `scene-btn${currentScene === id ? ' active' : ''}`, label);
    btn.addEventListener('click', () => {
      currentScene = id;
      renderStudy(root);
    });
    return btn;
  };
  selector.append(
    sceneButton('all', '🌐 全部'),
    ...SCENES.map((s) => sceneButton(s.id, `${s.icon} ${s.zh}`)),
  );

  const stage = el('div', 'stage');
  const counter = el('div', 'counter');
  root.append(selector, stage, counter);

  const showNext = (): void => {
    stage.replaceChildren();
    const now = Date.now();
    const state = getState();
    counter.textContent = `今日新词 ${newLearnedCount(state, now)}/${state.newPerDay}`;

    const queue = pickNew(state, WORDS, currentScene, now);
    if (queue.length === 0) {
      const hint =
        newBudget(state, now) === 0
          ? `🎉 今日新词额度 ${state.newPerDay} 个已用完。可去「统计」页调整，或去「复习」巩固`
          : '🈳 该场景没有新词了，换个场景或选「全部」';
      stage.append(el('div', 'empty-hint', hint));
      return;
    }

    const word = queue[0];
    const onGrade = (grade: Grade): void => {
      const t = Date.now();
      const s = getState();
      s.cards[word.id] = schedule(s.cards[word.id] ?? newCard(word.id, t), grade, t);
      recordActivity(s, t);
      persist();
      showNext();
    };
    stage.append(wordCard(word, () => speak(word.example)), gradeRow(onGrade));
  };

  showNext();
}
