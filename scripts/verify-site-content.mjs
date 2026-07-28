import assert from 'node:assert/strict';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const root = new URL('..', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1');
const read = (path) => readFileSync(join(root, path), 'utf8');

const app = read('src/App.jsx');
const styles = read('src/mdggisStyle.css');
const ru = read('src/i18n/ru.js');
const en = read('src/i18n/en.js');

assert.match(ru, /\{ num: '15', label: \['направлений', 'автоматизации'\] \}/);
assert.match(ru, /\{ num: '15', label: \['автоматизированных служб', 'предприятий и научных институтов'\] \}/);
assert.doesNotMatch(ru, /\{ num: '9', label: \['автоматизированных'/);
assert.match(ru, /\{ num: '6', label: \['рудников включены', 'в единый цифровой контур'\] \}/);
assert.match(en, /\{ num: '15', label: \['automation', 'workstreams'\] \}/);

for (const name of ['УРАЛКАЛИЙ', 'ВНИИ ГАЛУРГИИ', 'ГОРНЫЙ ИНСТИТУТ', 'ПЕРМСКИЙ ПОЛИТЕХ', 'ЕВРОХИМ', 'АКРОН']) {
  assert.ok(ru.includes(`name: '${name}'`), `Missing client: ${name}`);
}
const ruClients = ru.slice(ru.indexOf('clients:'), ru.indexOf('case:'));
assert.doesNotMatch(ruClients, /GLOBALCIO/i);

assert.match(app, /clientLogoAssets\[client\.logoKey\]/);
assert.doesNotMatch(app, /backgroundImage:/);
assert.doesNotMatch(app, /import mine(?:img|3|4)/);
assert.doesNotMatch(styles, /\.parallax-bg/);

assert.match(ru, /demo: 'Запросить демо'/);
assert.match(ru, /price: 'от 100 000 ₽'/);
assert.match(en, /price: 'from 100,000 RUB'/);

for (const value of ['Антон Вадимович Оверин', 'gissol@gissol.ru', 'overinanton@gissol.ru']) {
  assert.ok(ru.includes(value), `Missing contact value: ${value}`);
}
assert.match(app, /person\.email/);
assert.doesNotMatch(app, /gissolutions@ya\.ru/);

const suppliedLogos = [
  'uralkali.jpg',
  'vniig-galurgii.jpg',
  'perm-polytechnic.png',
  'eurochem.jpg',
  'acron-engineering.jpg',
];

for (const file of suppliedLogos) {
  const path = join(root, 'src/assets/clients', file);
  assert.ok(existsSync(path), `Missing supplied partner logo: ${file}`);
  assert.ok(statSync(path).size > 0, `Partner logo is empty: ${file}`);
  assert.ok(app.includes(`./assets/clients/${file}`), `Partner logo is not used: ${file}`);
}

const vectorLogos = [
  'mining-institute.svg',
];

for (const file of vectorLogos) {
  const path = join(root, 'src/assets/clients', file);
  assert.ok(existsSync(path), `Missing SVG logo: ${file}`);
  const svg = readFileSync(path, 'utf8');
  assert.match(svg, /<svg\b/);
  assert.doesNotMatch(svg, /<image\b|data:image/i, `${file} must be vector-only`);
  assert.doesNotMatch(svg, /#[0-9a-f]{6}/gi, `${file} must use currentColor/black and white only`);
}

assert.match(styles, /\.client-logo-image\s*\{[\s\S]*?max-width:\s*150px;/);
assert.match(styles, /\.client-logo-image\s*\{[\s\S]*?height:\s*72px;/);
assert.match(styles, /\.client-logo-image\s*\{[\s\S]*?filter:\s*grayscale\(1\)/);
assert.match(app, /data-logo=\{client\.logoKey\}/);

console.log('Site content verification passed.');
