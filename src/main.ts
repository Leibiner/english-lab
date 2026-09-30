// 入口：无路由器的 tab 切换。切 tab = 用当前视图重新渲染 #view。
import './styles.css';
import { assertWordsValid } from './data';
import { renderQuiz } from './quiz';
import { renderReview } from './review';
import { renderStats } from './stats';
import { renderStudy } from './study';
import { renderPoster } from './poster';
import { el } from './ui';

type TabId = 'study' | 'review' | 'quiz' | 'stats' | 'poster';

const TABS: { id: TabId; label: string; render: (root: HTMLElement) => void }[] = [
  { id: 'study', label: '📖 学新词', render: renderStudy },
  { id: 'review', label: '🔄 复习', render: renderReview },
  { id: 'quiz', label: '✏️ 测一测', render: renderQuiz },
  { id: 'stats', label: '📊 统计', render: renderStats },
  { id: 'poster', label: '📰 板报', render: renderPoster },
];

// 支持 #poster 之类深链（headless 截图 / 收藏直达）
const hashTab = location.hash.slice(1) as TabId;
let currentTab: TabId = TABS.some((t) => t.id === hashTab) ? hashTab : 'study';

function render(): void {
  const tabs = document.querySelector<HTMLElement>('#tabs');
  const view = document.querySelector<HTMLElement>('#view');
  if (!tabs || !view) throw new Error('index.html 里缺少 #tabs 或 #view');

  tabs.replaceChildren(
    ...TABS.map((tab) => {
      const btn = el('button', `tab${tab.id === currentTab ? ' active' : ''}`, tab.label);
      btn.addEventListener('click', () => {
        currentTab = tab.id;
        location.hash = tab.id;
        render();
      });
      return btn;
    }),
  );

  view.replaceChildren();
  const active = TABS.find((t) => t.id === currentTab);
  if (active) active.render(view);
}

assertWordsValid();
render();
