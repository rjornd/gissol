import assert from 'node:assert/strict';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const root = new URL('..', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1');
const read = (path) => readFileSync(join(root, path), 'utf8');

const app = read('src/App.jsx');
const styles = read('src/mdggisStyle.css');
const ru = read('src/i18n/ru.js');
const en = read('src/i18n/en.js');
const ruData = (await import('../src/i18n/ru.js')).default;
const enData = (await import('../src/i18n/en.js')).default;

assert.equal(ruData.case.metrics.length, 4);
assert.deepEqual(ruData.case.metrics[0], {
  num: '800+',
  label: ['специалистов работают', 'в системе'],
});
assert.equal(enData.case.metrics.length, 4);
assert.deepEqual(enData.case.metrics[0], {
  num: '800+',
  label: ['specialists work', 'in the system'],
});

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
assert.match(app, /import mineimg from '\.\/assets\/shahta\.png\?inline'/);
assert.match(app, /import mine3 from '\.\/assets\/mine3\.jpg\?inline'/);
assert.match(app, /import mine4 from '\.\/assets\/mine4\.jpg\?inline'/);
assert.match(app, /function SectionWithBgImage\(/);
assert.match(app, /backgroundImage:\s*`linear-gradient[\s\S]*?url\(\$\{image\}\)`/);
assert.match(app, /<SectionWithBgImage image=\{mineimg\} id="hero">/);
assert.match(app, /<SectionWithBgImage image=\{mine3\} id="solutions">/);
assert.match(app, /<SectionWithBgImage image=\{mine4\} id="products">/);
assert.match(app, /<SectionWithBgImage image=\{mineimg\} id="about">/);
assert.match(styles, /\.parallax-bg\s*\{[\s\S]*?background-attachment:\s*fixed\s*!important;/);

assert.match(ru, /demo: 'Запросить демо'/);
assert.match(ru, /price: 'от 100 000 ₽'/);
assert.match(en, /price: 'from 100,000 RUB'/);

for (const value of ['Оверин Антон Вадимович', 'gissol@gissol.ru', 'overinanton@gissol.ru']) {
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
assert.match(app, /data-logo=\{client\.logoKey\}/);
assert.match(styles, /\.case-metrics\s*\{[\s\S]*?grid-template-columns:\s*repeat\(4,\s*1fr\)/);
assert.match(styles, /@media \(max-width:\s*900px\)[\s\S]*?\.case-metrics\s*\{\s*grid-template-columns:\s*repeat\(2,\s*1fr\)/);
assert.match(styles, /@media \(max-width:\s*560px\)[\s\S]*?\.case-metrics,[\s\S]*?grid-template-columns:\s*1fr/);

console.log('Site content verification passed.');
