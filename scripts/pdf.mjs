// Prints index.html to cv.pdf with headless Chromium.
// Usage: node scripts/pdf.mjs [outDir]
import {chromium} from 'playwright';
import {mkdirSync, copyFileSync} from 'node:fs';
import {resolve, join} from 'node:path';
import {pathToFileURL} from 'node:url';

const outDir = resolve(process.argv[2] ?? '.');
mkdirSync(outDir, {recursive: true});

const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto(pathToFileURL(resolve('index.html')).href, {waitUntil: 'networkidle'});
await page.evaluate(() => document.fonts.ready);
await page.emulateMedia({media: 'print', colorScheme: 'light'});
await page.pdf({path: join(outDir, 'cv.pdf'), format: 'A4', printBackground: true, preferCSSPageSize: true});
await browser.close();

if (outDir !== resolve('.')) {
    copyFileSync('index.html', join(outDir, 'index.html'));
}
console.log(`cv.pdf written to ${outDir}`);
