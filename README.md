# cv

Bogdan (Bo) Plieshka's CV, at [gotbahn.github.io/cv](https://gotbahn.github.io/cv).

- `index.html` is the CV: one page, no build step
- On every push to `main`, a GitHub Action prints it to `cv.pdf` with headless
  Chromium and deploys both to GitHub Pages, so the page and the PDF never drift

Local PDF: `npm ci && npx playwright install chromium && node scripts/pdf.mjs`
