// 视图：复习。SRS 到期队列；评 again 的卡回队尾，本轮再见一次。
import type { CardState, Grade, Word } from './types';
import { wordById } from './data';
import { getState, persist, recordActivity } from './store';
import { dueCards, schedule } from './srs';
import { speak } from './tts';
import { el, gradeRow, wordCard } from './ui';

interface SessionItem {
  card: CardState;
  word: Word;
}

let session: SessionItem[] | null = null;

function buildSession(): SessionItem[] {
  return dueCards(getState(), Date.now()).flatMap((card) => {
    const word = wordById.get(card.id);
    return word ? [{ card, word }] : [];
  });
}

export function renderReview(root: HTMLElement): void {
  root.replaceChildren();
  if (!session) session = buildSession();

  let gradedCount = 0;
  const stage = el('div', 'stage');
  const counter = el('div', 'counter');
  root.append(stage, counter);

  const show = (): void => {
    stage.replaceChildren();
    if (!session || session.length === 0) {
      session = null;
      stage.append(
        el(
          'div',
          'empty-hint',
          gradedCount > 0
            ? `🎉 本轮复习完成，共评分 ${gradedCount} 张`
            : '😌 现在没有到期的卡片，先去「学新词」吧',
        ),
      );
      counter.textContent = '';
      return;
    }
    counter.textContent = `⏳ 还剩 ${session.length} 张 · 本轮已评 ${gradedCount} 张`;

    const { card, word } = session[0];
    const onGrade = (grade: Grade): void => {
      const now = Date.now();
      const state = getState();
      const updated = schedule(state.cards[word.id] ?? card, grade, now);
      state.cards[word.id] = updated;
      recordActivity(state, now);
      persist();
      gradedCount += 1;
      if (grade === 'again') session?.push({ card: updated, word });
      session?.shift();
      show();
    };
    stage.append(wordCard(word, () => speak(word.example)), gradeRow(onGrade));
  };

  show();
}
