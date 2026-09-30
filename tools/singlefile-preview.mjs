// 把 dist 内联成单文件 dist/poster-preview.html，供 file:// 截图/离线分享用
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const dist = resolve(dirname(fileURLToPath(import.meta.url)), '../dist');
const assets = readdirSync(resolve(dist, 'assets'));
const css = assets.filter((f) => f.endsWith('.css')).map((f) => readFileSync(resolve(dist, 'assets', f), 'utf8'));
const js = assets.filter((f) => f.endsWith('.js')).map((f) => readFileSync(resolve(dist, 'assets', f), 'utf8'));

let html = readFileSync(resolve(dist, 'index.html'), 'utf8');
html = html
  .replace(/<link[^>]*stylesheet[^>]*>/g, () => `<style>${css.join('\n')}</style>`)
  .replace(/<link[^>]*modulepreload[^>]*>/g, '')
  .replace(/<script[^>]*src=[^>]*><\/script>/g, () => `<script type="module">${js.join('\n')}</script>`);
writeFileSync(resolve(dist, 'poster-preview.html'), html);
console.log('已生成 dist/poster-preview.html');
