import { mkdir, copyFile, readFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';

// Bundle every local stylesheet/script referenced by index.html, plus PWA assets.
const html = await readFile('index.html', 'utf8');
const refs = [...html.matchAll(/<(?:script|link)\b[^>]*?(?:src|href)="([^"]+)"/g)].map(m => m[1].split('?')[0]);
const assets = new Set(['index.html', 'app.js', 'styles.css', 'nav-polish.css', 'minna-theme.css', 'service-worker.js', 'manifest.json', 'icons/icon-192.png', 'icons/icon-512.png', ...refs]);
for (const asset of assets) {
  if (!asset || /^(?:https?:|data:|\/|#)/.test(asset)) continue;
  const destination = join('www', asset);
  await mkdir(dirname(destination), { recursive: true });
  await copyFile(asset, destination);
}
console.log('Minna web assets prepared for Android:', assets.size);
