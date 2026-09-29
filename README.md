# 🗣️ English Lab

按生活场景背「开口就能用」的英语表达。本地运行的背单词 Web 应用：Vite + 原生 TypeScript，无框架、无后端，进度存在浏览器 localStorage。

和应试词汇书的差别：词条以**短语和句型**为主（"How's it going?"、"Can I get this without onions?"），每条带例句、中文翻译和 IPA 音标，配合浏览器语音合成可以直接跟读。

## 运行

```bash
npm install
npm run dev        # 打开 http://localhost:5173
npm run build      # 产物在 dist/，可静态托管
```

## 功能

- **📖 学新词**：按场景筛选（11 个场景），翻牌卡片，点卡片翻面自动朗读例句，四档评分入卡。支持键盘 `1-4` 快捷评分。每日新词数有上限（默认 10，可在统计页调整）
- **🔄 复习**：SRS（间隔重复）到期队列；评「忘记」的卡片回队尾，当轮再见一次
- **✏️ 测一测**：看中文选英文 / 听音拼写两种小测，各 10 题一局。不影响 SRS 评分，只计入打卡
- **📊 统计**：连续打卡天数、近 30 天打卡格、各场景掌握进度、每日新词上限设置
- **🔊 发音**：浏览器 SpeechSynthesis，优先美式英语语音

## 词库（300 条）

数据在 `src/data/<scene>.json`，每个场景一个文件：

| 场景 | 条数 | 内容 |
|---|---|---|
| 👋 greetings | 25 | 打招呼、寒暄、介绍、告别 |
| 🔢 numbers | 30 | 时间/日期/价格/电话号码的读法 |
| 💬 daily | 40 | 应答、感谢道歉、天气、约时间、家务 |
| 🚇 transport | 30 | 打车、公交地铁、机场值机 |
| 🛍️ shopping | 25 | 试穿、讲价、退换货、支付 |
| 🍜 food | 30 | 点餐、咖啡、忌口、买单、请客 |
| 🗺️ directions | 25 | 问路、指路、方位 |
| 📞 phone | 20 | 接打电话、留言、改约 |
| 💼 work | 30 | 会议、进度、请假、远程办公 |
| 📱 tech | 25 | 网络、设备、App、AI 词汇 |
| 💭 feelings | 20 | 表达观点、同意反对、情绪安慰 |

词条格式（`difficulty`：1=简单短句，2=高频搭配，3=长句/易错表达）：

```json
{
  "id": "food-002",
  "en": "Can I get this without onions?",
  "ipa": "",
  "zh": "这个能不放洋葱吗？",
  "example": "Can I get the salad without onions?",
  "exampleZh": "沙拉能不放洋葱吗？",
  "scene": "food",
  "difficulty": 2
}
```

加词：往对应场景的 JSON 里追加即可，`id` 保持 `<scene>-NNN` 递增；改完把 `src/data.ts` 中该场景的 `count` 同步，页面启动时会自动校验（`assertWordsValid`）。

## SRS 规则（简化 SM-2，`src/srs.ts`）

| 评分 | 间隔变化 | 难度系数 ease | 其他 |
|---|---|---|---|
| 😓 忘记 again | 归零，今天重排 | −0.20 | reps 清零，lapses +1 |
| 🤔 模糊 hard | ×1.2（至少 1 天） | −0.15 | |
| 😊 记得 good | 新卡 1 天，之后 ×ease | 不变 | reps +1 |
| 😎 简单 easy | 新卡 3 天，之后 ×ease×1.3 | +0.15 | reps +1 |

ease 初始 2.5，钳制在 [1.3, 3.0]。连续评 good 的间隔序列约为 1 → 3 → 8 → 20 → 50 天。**掌握** 口径：间隔 ≥ 7 天且连续成功 ≥ 3 次。

## 代码结构

```
src/
├── main.ts     入口，tab 切换（无路由库）
├── types.ts    全部类型定义
├── data.ts     词库装载 + 启动校验
├── store.ts    localStorage 唯一出入口（key: english-lab:state:v1）
├── srs.ts      间隔重复调度，纯函数
├── tts.ts      SpeechSynthesis 封装
├── ui.ts       DOM 小工具：翻牌卡、评分按钮
├── study.ts / review.ts / quiz.ts / stats.ts   四个视图
├── styles.css  Duolingo 式活泼绿主题
└── data/*.json 11 个场景词库
```

设计原则：不加框架、不加状态库、不写超过 50 行的函数。

## 注意事项

- 进度只存在当前浏览器（localStorage）：换浏览器/清缓存会丢存档。重要数据请别清浏览器数据
- Linux 服务器/无声卡环境可能发不出声音（TTS 依赖系统语音包），不影响学习逻辑
- 发音在 Chrome/Edge 上效果最好；Safari 需点一次页面后才能出声
