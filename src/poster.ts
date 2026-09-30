// 板报视图：把某场景的词排成拼贴手抄报样式，朗读 + 导出 PNG。
// 文字全部由代码渲染（AI 生图不可控中文/音标），版式在 styles.css 的 poster-* 类。
import { toPng } from 'html-to-image';
import { SCENES, wordsByScene } from './data';
import { speakAll } from './tts';
import { el } from './ui';
import type { SceneId, Word } from './types';

let currentScene: SceneId = 'numbers';
let currentCount = 10;

/** 当前要上板报的词：场景内取前 N 条（数据文件把基础词放前面即可控顺序） */
function posterWords(): Word[] {
  return wordsByScene(currentScene).slice(0, currentCount);
}

function buildBoard(): HTMLElement {
  const scene = SCENES.find((s) => s.id === currentScene);
  const board = el('div', 'poster-board');
  board.append(
    el('div', 'poster-title', `${scene?.icon ?? ''} ${scene?.zh ?? ''}`),
    el('div', 'poster-sub', 'English Lab · 拼贴板报 · 开口就能用'),
  );

  const grid = el('div', 'poster-grid');
  posterWords().forEach((word, index) => {
    const card = el('div', 'poster-card');
    card.append(
      el('span', 'poster-num', String(index + 1).padStart(2, '0')),
      el('div', 'poster-en', word.en),
    );
    if (word.ipa) card.append(el('div', 'poster-ipa', word.ipa));
    card.append(el('div', 'poster-zh', word.zh));
    if (currentCount <= 10) {
      // 词少时才带例句，板报不拥挤
      const ex = el('div', 'poster-example', `${word.example}  ${word.exampleZh}`);
      card.append(ex);
    }
    grid.append(card);
  });

  board.append(grid);
  const date = new Date().toISOString().slice(0, 10);
  board.append(el('div', 'poster-footer', `${date} · 共 ${posterWords().length} 条 · 每天 10 分钟，开口不卡壳`));
  return board;
}

function downloadBoard(board: HTMLElement): void {
  toPng(board, { pixelRatio: 2, cacheBust: true }).then((dataUrl) => {
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `板报-${currentScene}-${new Date().toISOString().slice(0, 10)}.png`;
    link.click();
  });
}

export function renderPoster(root: HTMLElement): void {
  const toolbar = el('div', 'poster-toolbar');

  const sceneSel = el('select', 'poster-select');
  for (const scene of SCENES) {
    const opt = el('option', undefined, `${scene.icon} ${scene.zh}`);
    opt.value = scene.id;
    if (scene.id === currentScene) opt.selected = true;
    sceneSel.append(opt);
  }

  const countSel = el('select', 'poster-select');
  for (const n of [6, 8, 10, 12]) {
    const opt = el('option', undefined, `${n} 条`);
    opt.value = String(n);
    if (n === currentCount) opt.selected = true;
    countSel.append(opt);
  }

  const boardHost = el('div', 'poster-host');
  const draw = () => boardHost.replaceChildren(buildBoard());
  sceneSel.addEventListener('change', () => {
    currentScene = sceneSel.value as SceneId;
    draw();
  });
  countSel.addEventListener('change', () => {
    currentCount = Number(countSel.value);
    draw();
  });

  const speakBtn = el('button', 'tab', '🔊 读一遍');
  speakBtn.addEventListener('click', () => speakAll(posterWords().flatMap((w) => [w.en, w.example])));
  const saveBtn = el('button', 'tab', '💾 保存图片');
  saveBtn.addEventListener('click', () => {
    const board = boardHost.querySelector<HTMLElement>('.poster-board');
    if (board) downloadBoard(board);
  });

  toolbar.append(sceneSel, countSel, speakBtn, saveBtn);
  draw();
  root.append(toolbar, boardHost);
}
