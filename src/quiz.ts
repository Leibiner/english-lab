// 视图：测一测。中→英四选一 / 听音拼写。刻意不联动 SRS，只做检测和打卡。
import type { Word } from './types';
import { WORDS, wordsByScene } from './data';
import { getState, persist, recordActivity } from './store';
import { speak } from './tts';
import { el } from './ui';

type QuizMode = 'choice' | 'spell';
const QUESTIONS_PER_ROUND = 10;

let mode: QuizMode = 'choice';

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/** 优先考已入 SRS 卡的词，不足再补新词 */
function buildQuestions(): Word[] {
  const state = getState();
  const studied = WORDS.filter((w) => state.cards[w.id]);
  const fresh = WORDS.filter((w) => !state.cards[w.id]);
  return shuffle(studied).concat(shuffle(fresh)).slice(0, QUESTIONS_PER_ROUND);
}

/** 忽略大小写/首尾空格/连续空格/常见标点 */
function normalize(text: string): string {
  return text.toLowerCase().trim().replace(/\s+/g, ' ').replace(/[.,!?"'’]/g, '');
}

function renderChoiceQuestion(
  stage: HTMLElement,
  word: Word,
  advance: () => void,
  onCorrect: () => void,
): void {
  stage.append(el('div', 'quiz-prompt', word.zh));
  const distractors = shuffle(wordsByScene(word.scene).filter((w) => w.id !== word.id)).slice(0, 3);
  const options = shuffle([word, ...distractors]);
  const grid = el('div', 'option-grid');
  const buttons = new Map<string, HTMLButtonElement>();
  let answered = false;
  for (const option of options) {
    const btn = el('button', 'option-btn', option.en);
    btn.addEventListener('click', () => {
      if (answered) return;
      answered = true;
      const correct = option.id === word.id;
      if (correct) onCorrect();
      buttons.get(word.id)?.classList.add('correct');
      if (!correct) btn.classList.add('wrong');
      window.setTimeout(advance, correct ? 650 : 1300);
    });
    buttons.set(option.id, btn);
    grid.append(btn);
  }
  stage.append(grid);
}

function renderSpellQuestion(
  stage: HTMLElement,
  word: Word,
  advance: () => void,
  onCorrect: () => void,
): void {
  const prompt = el('div', 'quiz-prompt');
  prompt.append(el('div', undefined, word.zh));
  const audioBtn = el('button', 'speak-btn', '🔊');
  audioBtn.title = '听正确答案';
  audioBtn.addEventListener('click', () => speak(word.en));
  prompt.append(audioBtn);

  const row = el('div', 'spell-row');
  const input = el('input', 'spell-input');
  input.placeholder = '听发音 / 看中文，写出英文';
  const checkBtn = el('button', 'primary-btn', '检查');
  row.append(input, checkBtn);

  const feedback = el('div', 'feedback');
  let answered = false;
  const check = (): void => {
    if (answered || !input.value.trim()) return;
    answered = true;
    const correct = normalize(input.value) === normalize(word.en);
    if (correct) onCorrect();
    feedback.textContent = correct
      ? `✅ ${word.en}`
      : `❌ 正确答案：${word.en}${word.ipa ? `　${word.ipa}` : ''}`;
    feedback.classList.add(correct ? 'ok' : 'no');
    const nextBtn = el('button', 'primary-btn', '下一题');
    nextBtn.addEventListener('click', advance);
    stage.append(nextBtn);
  };
  checkBtn.addEventListener('click', check);
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') check();
  });
  stage.append(prompt, row, feedback);
}

export function renderQuiz(root: HTMLElement): void {
  root.replaceChildren();

  let questions = buildQuestions();
  let index = 0;
  let correctCount = 0;

  const header = el('div', 'quiz-header');
  const modeButton = (m: QuizMode, label: string): HTMLButtonElement => {
    const btn = el('button', `scene-btn${mode === m ? ' active' : ''}`, label);
    btn.addEventListener('click', () => {
      mode = m;
      renderQuiz(root);
    });
    return btn;
  };
  header.append(modeButton('choice', '🔤 看中文选英文'), modeButton('spell', '✍️ 听音拼写'));

  const stage = el('div', 'stage');
  const counter = el('div', 'counter');
  root.append(header, stage, counter);

  const show = (): void => {
    stage.replaceChildren();
    if (questions.length === 0) {
      stage.append(el('div', 'empty-hint', '词库为空，暂时无法出题'));
      return;
    }
    if (index >= questions.length) {
      finish();
      return;
    }
    const word = questions[index];
    counter.textContent = `第 ${index + 1}/${questions.length} 题 · 已答对 ${correctCount}`;
    const advance = (): void => {
      index += 1;
      show();
    };
    const onCorrect = (): void => {
      correctCount += 1;
    };
    if (mode === 'choice') renderChoiceQuestion(stage, word, advance, onCorrect);
    else renderSpellQuestion(stage, word, advance, onCorrect);
  };

  const finish = (): void => {
    const state = getState();
    state.quizTotal += questions.length;
    recordActivity(state);
    persist();

    const card = el('div', 'result-card');
    const ratio = correctCount / questions.length;
    const comment =
      ratio >= 0.8 ? '🎉 很棒，这些表达已经快能开口用了' : ratio >= 0.5 ? '👍 不错，错题去复习页再巩固' : '💪 别灰心，多见几次面就记住了';
    card.append(
      el('div', 'result-score', `${correctCount}/${questions.length}`),
      el('div', 'feedback', comment),
      el('div', 'feedback', '小测不影响 SRS 评分，只计入打卡'),
    );
    const againBtn = el('button', 'primary-btn', '🔁 再来一局');
    againBtn.addEventListener('click', () => {
      questions = buildQuestions();
      index = 0;
      correctCount = 0;
      show();
    });
    card.append(againBtn);
    stage.append(card);
    counter.textContent = '';
  };

  show();
}
