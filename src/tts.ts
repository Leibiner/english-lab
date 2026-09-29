// 浏览器 SpeechSynthesis 封装。speak() 应在点击回调里调用（自动播放策略）。
let englishVoice: SpeechSynthesisVoice | null = null;

function refreshVoice(): void {
  const voices = window.speechSynthesis?.getVoices() ?? [];
  englishVoice =
    voices.find((v) => v.lang === 'en-US') ??
    voices.find((v) => v.lang === 'en-GB') ??
    voices.find((v) => v.lang.startsWith('en')) ??
    null;
}

if ('speechSynthesis' in window) {
  refreshVoice();
  // Chrome 里 getVoices() 首次调用可能返回空数组，必须等这个事件
  window.speechSynthesis.addEventListener('voiceschanged', refreshVoice);
}

export function speak(text: string, rate = 0.9): void {
  if (!('speechSynthesis' in window) || !text) return;
  if (!englishVoice) refreshVoice();
  window.speechSynthesis.cancel(); // 防叠音
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'en-US';
  if (englishVoice) utterance.voice = englishVoice;
  utterance.rate = rate;
  window.speechSynthesis.speak(utterance);
}
