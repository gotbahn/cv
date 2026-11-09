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
await page.pdf({
    path: join(outDir, 'cv.pdf'),
    format: 'A4',
    printBackground: true,
    preferCSSPageSize: true,
    displayHeaderFooter: true,
    headerTemplate: '<span></span>',
    // Every page carries the name, so a loose second sheet is never anonymous.
    footerTemplate: `<div style="width:100%;margin:0 14mm;font:8px Helvetica,Arial,sans-serif;color:#555;display:flex;justify-content:space-between">
        <span>Bogdan (Bo) Plieshka · bogdanplieshka@gmail.com · gotbahn.github.io/cv</span>
        <span>Page <span class="pageNumber"></span> of <span class="totalPages"></span></span>
    </div>`,
});
await browser.close();

if (outDir !== resolve('.')) {
    for (const file of ['index.html', 'favicon.svg', 'apple-touch-icon.png', 'icon-512.png']) {
        copyFileSync(file, join(outDir, file));
    }
}
console.log(`cv.pdf written to ${outDir}`);
