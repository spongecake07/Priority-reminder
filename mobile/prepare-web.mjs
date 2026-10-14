import { cpSync, existsSync, mkdirSync, rmSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';

const root = resolve('.');
const destination = join(root, 'www');
const required = ['index.html', 'app.js', 'styles.css', 'nav-polish.css', 'minna-theme.css', 'manifest.json', 'service-worker.js', 'icons'];

for (const name of required) {
  if (!existsSync(join(root, name))) {
    throw new Error('Missing required web asset: ' + name);
  }
}
if (!existsSync(join(root, 'icons', 'icon-192.png')) || !existsSync(join(root, 'icons', 'icon-512.png'))) {
  throw new Error('Missing required application icons');
}
rmSync(destination, { recursive: true, force: true });
mkdirSync(destination, { recursive: true });
for (const name of required) {
  const source = join(root, name);
  cpSync(source, join(destination, name), { recursive: statSync(source).isDirectory() });
}
console.log('Minna web assets prepared in www/');
