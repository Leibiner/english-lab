// DOM 小工具。风格：Duolingo 式活泼绿（样式全在 styles.css）。
import type { Grade, Word } from './types';
import { SCENES } from './data';
import { speak } from './tts';

export function el<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  cls?: string,
  text?: string,
): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  if (cls) node.className = cls;
  if (text !== undefined) node.textContent = text;
  return node;
}

function speakButton(text: string): HTMLButtonElement {
  const btn = el('button', 'speak-btn', '🔊');
  btn.title = '朗读';
  btn.addEventListener('click', (e) => {
    e.stopPropagation(); // 别触发翻面
    speak(text);
  });
  return btn;
}

function flashcard(front: Node, back: Node, onFlip: () => void): HTMLElement {
  const card = el('div', 'flashcard');
  const inner = el('div', 'card-inner');
  const frontFace = el('div', 'card-face card-front');
  const backFace = el('div', 'card-face card-back');
  frontFace.append(front);
  backFace.append(back);
  inner.append(frontFace, backFace);
  card.append(inner);
  card.addEventListener('click', () => {
    if (card.classList.toggle('flipped')) onFlip();
  });
  return card;
}

/** 学新词/复习共用的卡片：正面英文+音标+场景，背面中文+例句。onBackSide 在翻到背面时触发（朗读例句） */
export function wordCard(word: Word, onBackSide: () => void): HTMLElement {
  const scene = SCENES.find((s) => s.id === word.scene);

  const front = el('div', 'face-content');
  if (scene) front.append(el('span', 'scene-chip', `${scene.icon} ${scene.zh}`));
  front.append(el('div', 'word-en', word.en));
  if (word.ipa) front.append(el('div', 'word-ipa', word.ipa));
  front.append(speakButton(word.en), el('div', 'flip-hint', '点击翻面'));

  const back = el('div', 'face-content');
  back.append(el('div', 'word-zh', word.zh));
  const exampleRow = el('div', 'example-row');
  exampleRow.append(el('span', 'word-example', word.example), speakButton(word.example));
  back.append(exampleRow, el('div', 'word-example-zh', word.exampleZh));
  back.append(el('div', 'flip-hint', '评分后进入下一个'));

  return flashcard(front, back, onBackSide);
}

const GRADE_DEFS: { grade: Grade; label: string; cls: string; key: string }[] = [
  { grade: 'again', label: '😓 忘记', cls: 'btn-again', key: '1' },
  { grade: 'hard', label: '🤔 模糊', cls: 'btn-hard', key: '2' },
  { grade: 'good', label: '😊 记得', cls: 'btn-good', key: '3' },
  { grade: 'easy', label: '😎 简单', cls: 'btn-easy', key: '4' },
];

/** 四档评分按钮，键盘 1-4 快捷评分；按钮离开 DOM 后快捷键自动失效 */
export function gradeRow(onGrade: (grade: Grade) => void): HTMLElement {
  const row = el('div', 'grade-row');
  for (const def of GRADE_DEFS) {
    const btn = el('button', `grade-btn ${def.cls}`, `${def.label} (${def.key})`);
    btn.addEventListener('click', () => onGrade(def.grade));
    row.append(btn);
  }
  window.addEventListener('keydown', (e) => {
    if (!row.isConnected) return;
    const def = GRADE_DEFS.find((d) => d.key === e.key);
    if (def) onGrade(def.grade);
  });
  return row;
}
