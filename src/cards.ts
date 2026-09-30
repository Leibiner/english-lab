// 小红书卡组：封面 + 内容分页，固定 540×720（导出 2x = 1080×1440，标准 3:4）。
// 两种卡组：主题教程卡组（topics.ts，思维导图封面+细节页）和场景词表卡组。
import { toPng } from 'html-to-image';
import { SCENES, wordsByScene } from './data';
import { TOPIC_DECKS, type TopicDeck, type TopicSection } from './topics';
import { el } from './ui';
import { speakAll } from './tts';
import type { SceneId, Word } from './types';

let currentKey = 'topic:numbers'; // 'topic:<id>' 或场景 id
let perPage = 5;

function deckLabel(): string {
  if (currentKey.startsWith('topic:')) return TOPIC_DECKS[currentKey.slice(6)].title;
  const scene = SCENES.find((s) => s.id === currentKey);
  return `${scene?.icon ?? ''} ${scene?.zh ?? currentKey}`;
}

function footer(text: string): HTMLElement {
  return el('div', 'xhs-foot', text);
}

function pageHead(chipText: string, pageNo: number, pages: number): HTMLElement {
  const head = el('div', 'xhs-head');
  head.append(
    el('span', 'xhs-chip-solid', chipText),
    el('span', 'xhs-pageno mono', `${String(pageNo).padStart(2, '0')} / ${String(pages).padStart(2, '0')}`),
  );
  return head;
}

/* ---------- 场景词表卡组 ---------- */

function coverCard(words: Word[], pages: number): HTMLElement {
  const card = el('div', 'xhs-card xhs-cover');
  card.append(
    el('div', 'xhs-kicker', 'ENGLISH LAB · 场景表达'),
    el('div', 'xhs-title', deckLabel()),
    el('div', 'xhs-title-en', currentKey.toUpperCase()),
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

function wordPageCard(words: Word[], pageNo: number, pages: number): HTMLElement {
  const card = el('div', 'xhs-card');
  card.append(pageHead(deckLabel(), pageNo, pages));
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
  card.append(list, footer('English Lab · 口语场景词 · 存下慢慢背'));
  return card;
}

/* ---------- 主题教程卡组（思维导图封面 + 细节页） ---------- */

function mindmapCover(deck: TopicDeck): HTMLElement {
  const card = el('div', 'xhs-card xhs-cover xhs-mm');
  card.append(
    el('div', 'xhs-kicker', 'ENGLISH LAB · 规则地图'),
    el('div', 'xhs-title', deck.title),
    el('div', 'xhs-title-en', deck.en),
    el('div', 'mm-outcome', deck.outcome),
  );
  const center = el('div', 'mm-center');
  deck.center.forEach((line) => center.append(el('div', 'mm-center-line', line)));
  card.append(el('div', 'mm-stem'), center);

  const links = el('div', 'mm-links');
  deck.branches.forEach((b) => {
    const node = el('div', 'mm-node');
    node.append(el('div', 'mm-node-t', b.t), el('div', 'mm-node-d', b.d));
    links.append(node);
  });
  card.append(el('div', 'mm-bus'), links);

  const demo = el('div', 'mm-demo mono');
  deck.demoBig.parts.forEach((p) => demo.append(el('span', p.c ? `mm-${p.c}` : '', p.text)));
  card.append(demo);

  const toc = el('div', 'mm-toc');
  deck.sections.forEach((s, i) => toc.append(el('span', 'mm-toc-item', `${'①②③④⑤⑥⑦⑧⑨'[i] ?? i + 1} ${s.title}`)));
  card.append(toc);
  card.append(footer(deck.stat));
  return card;
}

function sectionCard(deck: TopicDeck, s: TopicSection, pageNo: number, pages: number): HTMLElement {
  const card = el('div', 'xhs-card');
  card.append(pageHead(`${deck.title.split(' ')[0]} ${s.en}`, pageNo, pages));
  card.append(el('div', 'xhs-sec-title', s.title));
  const list = el('div', 'xhs-items');
  s.rows.forEach((r) => {
    const item = el('div', 'xhs-item');
    item.append(
      el('div', 'xhs-en', r.word),
      el('div', 'xhs-zh', r.note),
    );
    if (r.label) item.prepend(el('span', 'xhs-label', r.label));
    list.append(item);
  });
  card.append(list);
  card.append(el('div', 'xhs-demo mono', s.demo));
  if (s.tip) card.append(el('div', 'xhs-tip', `⚠️ ${s.tip}`));
  card.append(footer('English Lab · 数字全教程'));
  return card;
}

/* ---------- 组装 & 导出 ---------- */

function buildDeck(): HTMLElement[] {
  if (currentKey.startsWith('topic:')) {
    const deck = TOPIC_DECKS[currentKey.slice(6)];
    const pages = deck.sections.length;
    return [mindmapCover(deck), ...deck.sections.map((s, i) => sectionCard(deck, s, i + 1, pages))];
  }
  const words = wordsByScene(currentKey as SceneId);
  const chunks: Word[][] = [];
  for (let i = 0; i < words.length; i += perPage) chunks.push(words.slice(i, i + perPage));
  return [coverCard(words, chunks.length), ...chunks.map((c, i) => wordPageCard(c, i + 1, chunks.length))];
}

function speakTexts(): string[] {
  if (currentKey.startsWith('topic:')) {
    const deck = TOPIC_DECKS[currentKey.slice(6)];
    return deck.sections.flatMap((s) => [s.demo.replace(/→.*/g, ''), ...s.rows.map((r) => r.word)]);
  }
  return wordsByScene(currentKey as SceneId).flatMap((w) => [w.en, w.example]);
}

async function renderPng(card: HTMLElement): Promise<string> {
  // 显式 540×720 @2x：手机预览可能被 wrap 缩小，导出永远全尺寸 1080×1440
  return toPng(card, { width: 540, height: 720, pixelRatio: 2, cacheBust: true });
}

function dataUrlToPngFile(url: string, name: string): Promise<File> {
  return fetch(url).then((r) => r.blob()).then((b) => new File([b], name, { type: 'image/png' }));
}

/** 8 张竖拼成一张长图（微信里长按一次 = 整套到手；自用/打印，不适合小红书发布） */
async function mergeToLongImage(urls: string[]): Promise<string> {
  const imgs = await Promise.all(urls.map((u) => new Promise<HTMLImageElement>((res, rej) => {
    const img = el('img');
    img.onload = () => res(img);
    img.onerror = () => rej(new Error('图片解码失败'));
    img.src = u;
  })));
  const gap = 30;
  const canvas = el('canvas');
  canvas.width = imgs[0].naturalWidth;
  canvas.height = imgs.reduce((sum, i) => sum + i.naturalHeight, 0) + gap * (imgs.length - 1);
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('canvas 不可用');
  ctx.fillStyle = '#fbf7ef';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  let y = 0;
  for (const img of imgs) {
    ctx.drawImage(img, 0, y);
    y += img.naturalHeight + gap;
  }
  return canvas.toDataURL('image/png');
}

/* ---------- 全屏查看 + 下载/长按保存（iOS 微信不支持 a[download]） ---------- */

let overlayList: string[] = [];
let overlayIdx = 0;

function overlayName(i: number): string {
  return `english-lab-${currentKey.replace(':', '-')}-${String(i + 1).padStart(2, '0')}.png`;
}

function showOverlay(urls: string[], start: number): void {
  overlayList = urls;
  overlayIdx = start;
  document.querySelector('.xhs-ov')?.remove();

  const ov = el('div', 'xhs-ov');
  const img = el('img', 'xhs-ov-img');
  const counter = el('span', 'xhs-ov-count');
  const dl = el('button', 'xhs-ov-btn', '⬇ 下载文件');
  dl.addEventListener('click', () => {
    const link = el('a');
    link.href = overlayList[overlayIdx];
    link.download = overlayName(overlayIdx);
    link.click();
  });
  const close = el('button', 'xhs-ov-btn', '✕ 关闭');
  close.addEventListener('click', () => ov.remove());
  const prev = el('button', 'xhs-ov-arrow', '‹');
  const next = el('button', 'xhs-ov-arrow', '›');
  const nav = (d: number) => {
    overlayIdx = (overlayIdx + d + overlayList.length) % overlayList.length;
    sync();
  };
  prev.addEventListener('click', () => nav(-1));
  next.addEventListener('click', () => nav(1));
  function sync(): void {
    img.src = overlayList[overlayIdx];
    counter.textContent = `${overlayIdx + 1} / ${overlayList.length}`;
    img.alt = overlayName(overlayIdx);
  }
  const top = el('div', 'xhs-ov-top');
  top.append(counter, el('span', 'xhs-ov-hint', '📱 长按图片可存到相册（微信/iPhone）'), dl, close);
  ov.append(top, prev, next, img);
  ov.addEventListener('click', (e) => { if (e.target === ov) ov.remove(); });
  document.body.append(ov);
  sync();
}

async function openCardAt(stage: HTMLElement, index: number): Promise<void> {
  const cards = Array.from(stage.querySelectorAll<HTMLElement>('.xhs-card'));
  showOverlay([await renderPng(cards[index])], 0);
}

export function renderDeck(root: HTMLElement): void {
  const toolbar = el('div', 'poster-toolbar');

  const keySel = el('select', 'poster-select');
  for (const deck of Object.values(TOPIC_DECKS)) {
    const opt = el('option', undefined, `🧮 ${deck.title}（思维导图+细节）`);
    opt.value = `topic:${deck.id}`;
    if (currentKey === opt.value) opt.selected = true;
    keySel.append(opt);
  }
  for (const scene of SCENES) {
    const opt = el('option', undefined, `${scene.icon} ${scene.zh}词表`);
    opt.value = scene.id;
    if (currentKey === scene.id) opt.selected = true;
    keySel.append(opt);
  }
  const perSel = el('select', 'poster-select');
  for (const n of [4, 5, 6]) {
    const opt = el('option', undefined, `每页 ${n} 条`);
    opt.value = String(n);
    if (n === perPage) opt.selected = true;
    perSel.append(opt);
  }

  const stage = el('div', 'xhs-stage');
  const saveAll = el('button', 'tab', '');
  const draw = () => {
    const isTopic = currentKey.startsWith('topic:');
    perSel.disabled = isTopic;
    perSel.title = isTopic ? '教程卡组按规则分节，固定一页一节' : '';
    const cards = buildDeck();
    stage.replaceChildren();
    cards.forEach((card, index) => {
      const wrap = el('div', 'xhs-wrap');
      wrap.append(card);
      card.addEventListener('click', () => void openCardAt(stage, index)); // 点开=1:1 全屏查看
      if (index > 0) {
        const save = el('button', 'xhs-save', '👁 看大图 / 存图');
        save.addEventListener('click', () => void openCardAt(stage, index));
        wrap.append(save);
      }
      stage.append(wrap);
    });
    fitScale();
    saveAll.textContent = `📦 导出全部 ${cards.length} 张（3:4 · 1080×1440）`;
  };

  // 手机视口 <540 时整卡等比缩小显示；transform 加在 wrap 上，
  // 导出走 toPng(card) + 显式 540×720，不受缩放影响，手机导出的仍是全尺寸图。
  function fitScale(): void {
    const k = Math.min(1, (stage.clientWidth - 8) / 540);
    for (const wrap of Array.from(stage.children)) {
      (wrap as HTMLElement).style.transform = k < 1 ? `scale(${k})` : '';
      (wrap as HTMLElement).style.height = k < 1 ? `${720 * k + 44}px` : '';
    }
  }
  window.addEventListener('resize', fitScale);

  const speakBtn = el('button', 'tab', '🔊 读一遍');
  speakBtn.addEventListener('click', () => speakAll(speakTexts()));
  async function generateAll(progressBtn: HTMLButtonElement): Promise<string[]> {
    const cards = Array.from(stage.querySelectorAll<HTMLElement>('.xhs-card'));
    progressBtn.disabled = true;
    const urls: string[] = [];
    for (let i = 0; i < cards.length; i++) {
      progressBtn.textContent = `生成中 ${i + 1}/${cards.length} …`;
      urls.push(await renderPng(cards[i]));
    }
    progressBtn.disabled = false;
    return urls;
  }

  /** 批量导出分平台走：系统分享(一次存相册) → 下载(电脑/安卓) → 查看器长按(iOS 微信兜底) */
  saveAll.addEventListener('click', async () => {
    const count = stage.querySelectorAll('.xhs-card').length;
    const urls = await generateAll(saveAll);
    const reset = () => { saveAll.textContent = `📦 导出全部 ${count} 张（3:4 · 1080×1440）`; };
    reset();
    const files = await Promise.all(urls.map((u, i) => dataUrlToPngFile(u, overlayName(i))));
    const nav = navigator as Navigator & { canShare?: (d: ShareData) => boolean };
    if (nav.canShare?.({ files })) {
      await nav.share({ files, title: deckLabel() }).catch(() => undefined); // 用户取消分享不算错
      return;
    }
    if (!/iPhone|iPad|iPod/.test(navigator.userAgent)) {
      for (let i = 0; i < urls.length; i++) {
        const link = el('a');
        link.href = urls[i];
        link.download = overlayName(i);
        link.click();
        await new Promise((r) => setTimeout(r, 350)); // 浏览器一次触发多个下载需要间隔
      }
      return;
    }
    showOverlay(urls, 0); // iOS 微信：只能查看器长按，逐张存
  });

  const longBtn = el('button', 'tab', '🧩 拼一张长图');
  longBtn.addEventListener('click', async () => {
    const urls = await generateAll(longBtn);
    longBtn.textContent = '拼接中 …';
    const long = await mergeToLongImage(urls);
    longBtn.textContent = '🧩 拼一张长图';
    showOverlay([long], 0); // 长按一次，整套到手
  });

  keySel.addEventListener('change', () => {
    currentKey = keySel.value;
    draw();
  });
  perSel.addEventListener('change', () => {
    perPage = Number(perSel.value);
    draw();
  });

  toolbar.append(keySel, perSel, speakBtn, saveAll, longBtn);
  root.append(el('div', 'xhs-note', `当前卡组：${deckLabel()} · 每页一张 3:4，适合小红书/朋友圈九宫格`), toolbar, stage);
  draw();
}
