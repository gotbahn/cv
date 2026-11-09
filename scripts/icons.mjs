// Renders the PNG icons from the same mark as favicon.svg, in Inter.
// Phones ignore SVG icons, so the home-screen icon needs a PNG.
// Usage: node scripts/icons.mjs
import {chromium} from 'playwright';

const html = size => `<!doctype html><html><head>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@700&display=swap" rel="stylesheet">
<style>html,body{margin:0;background:transparent}
div{width:${size}px;height:${size}px;background:#000;color:#fff;display:flex;align-items:center;justify-content:center;
font:700 ${Math.round(size * 0.53)}px Inter,sans-serif;letter-spacing:-${size / 64}px;padding-bottom:${Math.round(size * 0.04)}px;box-sizing:border-box}</style>
</head><body><div>bo</div></body></html>`;

const browser = await chromium.launch();
for (const [file, size] of [['apple-touch-icon.png', 180], ['icon-512.png', 512]]) {
    const page = await browser.newPage({viewport: {width: size, height: size}});
    await page.setContent(html(size), {waitUntil: 'networkidle'});
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({path: file});
    await page.close();
}
await browser.close();
console.log('apple-touch-icon.png, icon-512.png');
