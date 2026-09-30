// 小红书卡组：封面 + 内容分页，固定 540×720（导出 2x = 1080×1440，标准 3:4）。
// 只负责"卡组"这一种版式；拼贴板报在 poster.ts。
import { toPng } from 'html-to-image';
import { SCENES, wordsByScene } from './data';
import { el } from './ui';
import { speakAll } from './tts';
import type { SceneId, Word } from './types';

let currentScene: SceneId = 'numbers';
let perPage = 5;

function sceneMeta() {
  const scene = SCENES.find((s) => s.id === currentScene);
  return { icon: scene?.icon ?? '📚', zh: scene?.zh ?? currentScene };
}

function footer(text: string): HTMLElement {
  const foot = el('div', 'xhs-foot', text);
  return foot;
}

function coverCard(words: Word[], pages: number): HTMLElement {
  const { icon, zh } = sceneMeta();
  const card = el('div', 'xhs-card xhs-cover');
  card.append(
    el('div', 'xhs-kicker', 'ENGLISH LAB · 场景表达'),
    el('div', 'xhs-title', `${icon} ${zh}`),
    el('div', 'xhs-title-en', currentScene.toUpperCase()),
  );
  const stat = el('div', 'xhs-stat');
  stat.append(
    el('span', 'xhs-stat-b', `${words.length} 个`),
    el('span', undefined, `开口就能用的说法 · 共 ${pages + 1} 页，左滑读完`),
  );
  card.append(stat);
  const chips = el('div', 'xhs-chips');
  words.slice(0, 6).forEach((w) => chips.append(el('span', 'xhs-chip', w.en)));
  card.append(chips);
  card.append(footer('建议收藏 ⭐ 随时翻 · english-lab'));
  return card;
}

function pageCard(words: Word[], pageNo: number, pages: number): HTMLElement {
  const { icon, zh } = sceneMeta();
  const card = el('div', 'xhs-card');
  const head = el('div', 'xhs-head');
  head.append(
    el('span', 'xhs-chip-solid', `${icon} ${zh}`),
    el('span', 'xhs-pageno mono', `${String(pageNo).padStart(2, '0')} / ${String(pages).padStart(2, '0')}`),
  );
  card.append(head);
  const list = el('div', 'xhs-items');
  words.forEach((word) => {
    const item = el('div', 'xhs-item');
    item.append(
      el('div', 'xhs-en', word.en),
      ...(word.ipa ? [el('div', 'xhs-ipa mono', word.ipa)] : []),
      el('div', 'xhs-zh', word.zh),
      el('div', 'xhs-ex', `${word.example} — ${word.exampleZh}`),
    );
    list.append(item);
  });
  card.append(list);
  card.append(footer('English Lab · 口语场景词 · 存下慢慢背'));
  return card;
}

function buildDeck(): HTMLElement[] {
  const words = wordsByScene(currentScene);
  const chunks: Word[][] = [];
  for (let i = 0; i < words.length; i += perPage) chunks.push(words.slice(i, i + perPage));
  return [coverCard(words, chunks.length), ...chunks.map((c, i) => pageCard(c, i + 1, chunks.length))];
}

async function downloadCard(card: HTMLElement, index: number): Promise<void> {
  const url = await toPng(card, { pixelRatio: 2, cacheBust: true });
  const link = el('a');
  link.href = url;
  link.download = `小红书-${currentScene}-${String(index + 1).padStart(2, '0')}.png`;
  link.click();
}

export function renderDeck(root: HTMLElement): void {
  const { zh } = sceneMeta();
  const toolbar = el('div', 'poster-toolbar');

  const sceneSel = el('select', 'poster-select');
  for (const scene of SCENES) {
    const opt = el('option', undefined, `${scene.icon} ${scene.zh}`);
    opt.value = scene.id;
    if (scene.id === currentScene) opt.selected = true;
    sceneSel.append(opt);
  }
  const perSel = el('select', 'poster-select');
  for (const n of [4, 5, 6]) {
    const opt = el('option', undefined, `每页 ${n} 条`);
    opt.value = String(n);
    if (n === perPage) opt.selected = true;
    perSel.append(opt);
  }

  const stage = el('div', 'xhs-stage');
  const draw = () => {
    const cards = buildDeck();
    stage.replaceChildren();
    cards.forEach((card, index) => {
      const wrap = el('div', 'xhs-wrap');
      wrap.append(card);
      if (index > 0) {
        const save = el('button', 'xhs-save', '↓ 存这页');
        save.addEventListener('click', () => void downloadCard(card, index));
        wrap.append(save);
      }
      stage.append(wrap);
    });
    saveAll.textContent = `📦 导出全部 ${cards.length} 张（3:4 · 1080×1440）`;
  };

  const speakBtn = el('button', 'tab', '🔊 读一遍');
  speakBtn.addEventListener('click', () => {
    const words = wordsByScene(currentScene);
    speakAll(words.flatMap((w) => [w.en, w.example]));
  });
  const saveAll = el('button', 'tab', '');
  saveAll.addEventListener('click', async () => {
    const cards = Array.from(stage.querySelectorAll<HTMLElement>('.xhs-card'));
    for (let i = 0; i < cards.length; i++) {
      await downloadCard(cards[i], i);
      await new Promise((r) => setTimeout(r, 350)); // 让浏览器喘口气，防下载被吞
    }
  });

  sceneSel.addEventListener('change', () => {
    currentScene = sceneSel.value as SceneId;
    draw();
  });
  perSel.addEventListener('change', () => {
    perPage = Number(perSel.value);
    draw();
  });

  toolbar.append(sceneSel, perSel, speakBtn, saveAll);
  root.append(el('div', 'xhs-note', `当前主题：${zh} · 封面 + 每页 ${perPage} 条，适合小红书/朋友圈九宫格`), toolbar);
  draw();
}
