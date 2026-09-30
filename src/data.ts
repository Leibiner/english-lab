// 词库装载与校验。数据文件在 src/data/<scene>.json。
import type { Scene, SceneId, Word } from './types';
import greetings from './data/greetings.json';
import numbers from './data/numbers.json';
import daily from './data/daily.json';
import transport from './data/transport.json';
import shopping from './data/shopping.json';
import food from './data/food.json';
import directions from './data/directions.json';
import phone from './data/phone.json';
import work from './data/work.json';
import tech from './data/tech.json';
import feelings from './data/feelings.json';

export const SCENES: Scene[] = [
  { id: 'greetings', zh: '打招呼寒暄', icon: '👋', count: 25 },
  { id: 'numbers', zh: '数字·时间', icon: '🔢', count: 40 },
  { id: 'daily', zh: '日常沟通', icon: '💬', count: 40 },
  { id: 'transport', zh: '出行交通', icon: '🚇', count: 30 },
  { id: 'shopping', zh: '购物金钱', icon: '🛍️', count: 25 },
  { id: 'food', zh: '餐饮点餐', icon: '🍜', count: 30 },
  { id: 'directions', zh: '问路方位', icon: '🗺️', count: 25 },
  { id: 'phone', zh: '电话消息', icon: '📞', count: 20 },
  { id: 'work', zh: '工作职场', icon: '💼', count: 30 },
  { id: 'tech', zh: '科技网络', icon: '📱', count: 25 },
  { id: 'feelings', zh: '感受观点', icon: '💭', count: 20 },
];

export const WORDS: Word[] = [
  ...greetings,
  ...numbers,
  ...daily,
  ...transport,
  ...shopping,
  ...food,
  ...directions,
  ...phone,
  ...work,
  ...tech,
  ...feelings,
] as unknown as Word[];

export const wordById: ReadonlyMap<string, Word> = new Map(WORDS.map((w) => [w.id, w]));

export function wordsByScene(scene: SceneId): Word[] {
  return WORDS.filter((w) => w.scene === scene);
}

/** 启动时跑一次：id 唯一、必填字段、scene 合法、各场景数量对账 */
export function assertWordsValid(): void {
  const errors: string[] = [];
  const seen = new Set<string>();
  const validScenes = new Set<string>(SCENES.map((s) => s.id));
  for (const w of WORDS) {
    if (seen.has(w.id)) errors.push(`duplicate id: ${w.id}`);
    seen.add(w.id);
    if (!validScenes.has(w.scene)) errors.push(`${w.id}: invalid scene "${w.scene}"`);
    for (const field of ['en', 'zh', 'example', 'exampleZh'] as const) {
      if (!w[field] || !w[field].trim()) errors.push(`${w.id}: ${field} is empty`);
    }
    if (![1, 2, 3].includes(w.difficulty)) errors.push(`${w.id}: difficulty=${w.difficulty} invalid`);
  }
  for (const scene of SCENES) {
    const actual = WORDS.filter((w) => w.scene === scene.id).length;
    if (actual !== scene.count) errors.push(`scene ${scene.id}: expected ${scene.count}, got ${actual}`);
  }
  if (errors.length > 0) {
    console.error('[english-lab] 词库校验失败:', errors);
    throw new Error(`词库校验失败：${errors.length} 处问题，详见 console`);
  }
}
