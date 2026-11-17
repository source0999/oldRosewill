import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const source = join(root, 'source-snapshots');
const mirror = join(root, 'mirror');
const pages = ['home', 'about', 'our-founder', 'services', 'contact', 'resources', 'events', 'privacy', 'legal-notice'];
const origin = 'https://rosewill.org';
const staticFiles = [
  '/webcard/static/app.min.1782401128.css',
  '/css/custom.260320055552.css',
  '/webcard/static/app.bundle.1782401144.js',
  '/js/custom.250916051050.js',
  '/webcard/static/fonts/fontawesome-webfont.1e59d233.ttf',
  '/webcard/static/fonts/fontawesome-webfont.20fd1704.woff2',
  '/webcard/static/fonts/fontawesome-webfont.8b43027f.eot',
  '/webcard/static/fonts/fontawesome-webfont.f691f37e.woff',
  '/webcard/static/images/fontawesome-webfont.c1e38fd9.svg',
  '/webcard/static/images/ku.7a2e2db3.svg',
  '/g/fonts.css?family=Lora:300,regular,600%7CManrope:300,regular,600,500&subset=latin&display=swap'
];
const sourceToLocal = p => {
  if (p.startsWith('/g/fonts.css')) return 'mirror/fonts.css';
  return `mirror${p}`;
};
async function fetchTo(path) {
  const target = join(root, sourceToLocal(path));
  if (existsSync(target)) return;
  await mkdir(dirname(target), { recursive: true });
  const response = await fetch(origin + path);
  if (!response.ok) throw new Error(`${response.status} ${path}`);
  await writeFile(target, Buffer.from(await response.arrayBuffer()));
}
function localize(text) {
  return text
    .replaceAll('/webcard/static/app.min.1782401128.css', 'mirror/webcard/static/app.min.1782401128.css')
    .replaceAll('/css/custom.260320055552.css', 'mirror/css/custom.260320055552.css')
    .replaceAll('/webcard/static/app.bundle.1782401144.js', 'mirror/webcard/static/app.bundle.1782401144.js')
    .replaceAll('/js/custom.250916051050.js', 'mirror/js/custom.250916051050.js')
    .replace(/\/g\/fonts\.css\?[^"'\s)]+/g, 'mirror/fonts.css')
    .replace(/(["'(])\/images\//g, '$1mirror/images/')
    .replace(/href="\/(about|our-founder|services|contact|resources|events|privacy|legal-notice)"/g, 'href="$1/"')
    .replace(/href="\/"/g, 'href="./"')
    .replace(/action="\/[^" ]*"/g, 'action="#" onsubmit="return false"');
}
const imagePaths = new Set();
for (const page of pages) {
  const raw = await readFile(join(source, `${page}.html`), 'utf8');
  for (const hit of raw.matchAll(/\/images\/[^"'()\s<>]+/g)) imagePaths.add(hit[0]);
}
for (const file of staticFiles) await fetchTo(file);
for (const file of ['mirror/webcard/static/app.min.1782401128.css', 'mirror/css/custom.260320055552.css']) {
  const target = join(root, file);
  const css = await readFile(target, 'utf8');
  await writeFile(target, css.replaceAll('url(/webcard/static/', 'url('));
}
for (const imagePath of imagePaths) await fetchTo(imagePath.replace(/&quot;.*$/, ''));
for (const page of pages) {
  const raw = await readFile(join(source, `${page}.html`), 'utf8');
  const base = page === 'home' ? './' : '../';
  const exact = localize(raw).replace('<head>', `<head><base href="${base}">`);
  const destination = page === 'home' ? join(root, 'index.html') : join(root, page, 'index.html');
  await mkdir(dirname(destination), { recursive: true });
  await writeFile(destination, exact);
}
console.log(`Mirrored ${imagePaths.size} original image URLs and rebuilt ${pages.length} pages.`);
