import { chromium } from 'playwright';
const b = await chromium.launch();
const results = {};
for (const [w, h, name] of [[375, 812, 'mobile'], [768, 1024, 'ipad-mini'], [820, 1180, 'ipad-air'], [1280, 900, 'desktop']]) {
  const p = await (await b.newContext({ viewport: { width: w, height: h } })).newPage();
  await p.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await p.waitForTimeout(1100);
  const m = await p.evaluate(() => {
    const docW = document.documentElement.clientWidth;
    const cols = sel => { const g = document.querySelector(sel); if (!g) return 0; return getComputedStyle(g).gridTemplateColumns.split(' ').filter(x => x !== 'none').length; };
    const timelineGrid = document.querySelectorAll('#timeline article')[0];
    const tGrid = timelineGrid ? timelineGrid.querySelector(':scope > div') : null;
    return {
      overflowX: document.documentElement.scrollWidth - docW,
      skillsCols: cols('#skills .grid'),
      projectsCols: cols('#projects .grid'),
      agenticCols: cols('#agentic .grid'),
      timeline2col: tGrid ? getComputedStyle(tGrid).display === 'grid' : false,
      hamburgerVisible: (() => { const btns = Array.from(document.querySelectorAll('button')); const hb = btns.find(x => x.getAttribute('aria-label') === 'Open navigation menu'); return hb ? getComputedStyle(hb).display !== 'none' : null; })(),
      desktopNavVisible: (() => { const nav = document.querySelector('header nav'); return nav ? getComputedStyle(nav).display !== 'none' : null; })()
    };
  });
  results[name] = m;
  console.log(name.padEnd(10), JSON.stringify(m));
  await p.screenshot({ path: '/tmp/after-' + name + '-top.png' });
  await p.evaluate(() => document.querySelector('#timeline')?.scrollIntoView());
  await p.waitForTimeout(1000);
  await p.screenshot({ path: '/tmp/after-' + name + '-timeline.png' });
}
await b.close();
console.log('DONE');
