# Wohin geht mein Gehalt? · Where does my salary go?

A bilingual (DE/EN) gross-to-net salary calculator for Germany that shows **where every euro goes**: income tax split between federal, state and municipal budgets, solidarity surcharge, church tax, and each social insurance fund (health, long-term care, pension, unemployment), including the employer's share.

**Live:** https://wohin-geht-mein-gehalt.statichost.page

## What it does

- **Now** – 2026 rules: tax classes I–VI, all 16 states, church tax, children, public or private health insurance (54 statutory insurers with their 2026 extra contribution), minijob/midijob (Übergangsbereich), plus advanced options: tax allowance, company pension, factor method, second job. Flow diagram and a "what happens next" map of public finances.
- **Past** – the same salary under the rules of any year since 2010, nominal, wage-adjusted or inflation-adjusted.
- **Future** – decided, drafted and planned changes for 2027+ and their effect on your net pay.
- **Overview** – a short story of how deductions changed 2010–2028, with practical recommendations.

## Accuracy

The wage tax engine follows the BMF *Programmablaufplan* (PAP). For 2026 it matches the official BMF calculator (`bmf-steuerrechner.de`) **to the cent in 16 test cases** (classes I–VI, children, church tax, high incomes with Soli, private insurance, allowances, Saxony, factor method, midijob), and in 5 cases for 2025. Earlier years use the published § 32a EStG tariffs and contribution rates; they were checked for consistency but cannot be compared against an official online calculator.

It is an estimate, not tax advice. One-off payments (13th salary, bonuses) are taxed differently and are not modelled.

## Privacy by design

- No accounts, cookies, analytics or ads. No third-party requests: every script, icon and map is served from this site.
- All calculations run in the browser. A strict Content-Security-Policy (`connect-src 'none'`) makes it technically impossible for the page to send data anywhere.
- Inputs are kept in `sessionStorage` only, so the four pages can share them during a visit.

## Project structure

| File | Purpose |
|---|---|
| `engine.js` | Tax and social-insurance engine, parameters 2010–2026, scenarios 2027+, wage and price indices |
| `index.html` | "Now" page (also the template for `past.html`) |
| `summary.html`, `changes.html`, `privacy.html` | Overview, Future and privacy pages |
| `common.js` | Shared UI: language switch, theme toggle, month/year salary input, data notice |
| `assets/` | Icons |
| `build.py` | Generates `past.html` from `index.html` |
| `build_site.py` | Builds `dist/`: `/de/` and `/en/` folders, prerendered HTML for search engines, meta tags, sitemap, `_headers` with CSP hashes |
| `tests/qa.py` | Checks the build: placeholders, broken links, JS/CSP errors, NaN values, mobile overflow |
| `dist/` | The deployable site |

## Build

```sh
pip install playwright && playwright install chromium
python3 build.py && python3 build_site.py   # optional: pass your own base URL to build_site.py
python3 tests/qa.py
```

`dist/` is committed and is what the host serves.

## Updating the data

Rates change every year (contribution ceilings in December, tax tariff and extra contributions in January, occasionally mid-year). Each update: change the parameters in `engine.js`, re-check against the official BMF calculator, rebuild, run the QA script, and review the change before it goes live.

## Sources

All figures link to their sources on the site itself (Bundestag, BMF, Deutsche Rentenversicherung, Destatis, statutory health insurers). Map of German states: [svg-maps](https://github.com/VictorCazanave/svg-maps) by Victor Cazanave, CC BY 4.0.

## License

Copyright (C) 2026 Maxim Vitsuk.

Code: **GNU Affero General Public License v3.0** – see [LICENSE](LICENSE). You may use, change and share it; if you run a modified version as a website, you must publish your source code under the same license.

The map of German states is derived from [svg-maps](https://github.com/VictorCazanave/svg-maps) by Victor Cazanave, licensed under CC BY 4.0.

Contact: maximvitsuk@proton.me
