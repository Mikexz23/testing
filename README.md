# 招商银行交互演示

Open `index.html` directly in a modern browser. No installation or server is required.

## Recorded journey

1. Splash → home → **账户总览**.
2. Tap the Face ID icon in the login dialog. Verification is simulated; no camera, credentials, or banking connection is used.
3. Scroll the account overview and tap the deposit balance or a deposit product.
4. **我的存单** opens through a white loading page, progress line, and skeleton placeholders.
5. Tap any of the three holdings to open **持仓详情**, then go back.
6. Tap **交易记录**, then open an **提前支取本息** or **已起息** entry to view **交易详情**.

Back buttons, browser back/forward, Escape, and rightward swipes from the left edge work. Back navigation restores page scroll position. Pull down at the top of overview/deposits/history to refresh. Product/status filters, card selection, section collapse, and the product/holding tabs work. Desktop has a restart button; mobile has a restart option in the More menu.

## Fidelity and data

- Original screenshot balances and products are retained, per request: ¥15,502,016.86 deposits, ¥15,502,376.38 total assets, all three holdings and their 2.75% rates/maturity dates.
- Home, profile login, and splash reuse supplied images. The overview and deposit pages are real scrollable HTML; holding details and transaction pages are reconstructed from `reference/IMG_4032.mov`.
- The recording uses a different ¥100 account. Missing product codes, opening dates, example transactions, and estimated interest are illustrative local data adapted to the supplied holdings, not verified bank records. The two transaction states are demonstrated for each product.
- Loading timing approximates the recording: Face ID ~1.45s; overview ~1.95s; deposits ~2.6s; details ~0.95s; transaction list ~1.1s. Repeat/back visits load faster. Timings are in `navigate()` in `script.js`.
- Services not visited in the recording (paper certificates, reservations, pledge, plans, withdrawal) show local informational states. Other home services remain screenshot-only. No real financial actions occur.
- All runtime assets are local. The reference video and extracted frames are development references and are not loaded by the website.

## Verification

Run `node verify-interactions.cjs` for deterministic navigation/timer checks and `node --check script.js` for syntax validation. These checks exercise the app's rendered markup, event handlers, history, and timers in a lightweight DOM harness; they are not browser rendering tests.
