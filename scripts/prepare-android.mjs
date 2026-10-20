import { mkdir, copyFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';

// Copy the GitHub Pages app into Capacitor's isolated web directory.
// Do not modify the source files or local user data.
const assets = [
  'index.html', 'app.js', 'styles.css', 'nav-polish.css',
  'minna-theme.css', 'service-worker.js', 'manifest.json',
  'icons/icon-192.png', 'icons/icon-512.png'
];
for (const asset of assets) {
  const destination = join('www', asset);
  await mkdir(dirname(destination), { recursive: true });
  await copyFile(asset, destination);
}
console.log('Minna web assets prepared for Android.');
