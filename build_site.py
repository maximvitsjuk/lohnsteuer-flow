"""Build the deployable site into dist/: /en/ and /de/ folders, prerendered HTML, meta tags, sitemap.
Run: python3 build.py && python3 build_site.py"""
import os, shutil, json, html
from playwright.sync_api import sync_playwright
SRC=os.path.dirname(os.path.abspath(__file__)); OUT=os.path.join(SRC,'dist')
import sys
BASE=(sys.argv[1] if len(sys.argv)>1 else 'https://wohin-geht-mein-gehalt.statichost.page').rstrip('/')   # site address; pass your own domain as argument later
LANGS=['de','en']
PAGES=['index.html','past.html','summary.html','changes.html','privacy.html']
META={
'en':{
 'index.html':("Gross to net salary calculator Germany 2026 – where does every euro go?","Enter your gross salary and see where it goes: income tax, solidarity surcharge, health, care, pension and unemployment insurance – and what the state does with it. Tax classes I–VI, all 16 states, private insurance, minijob. Checked against the official BMF calculator."),
 'past.html':("Salary in Germany 2010–2026: taxes and contributions back then","How much tax and social insurance would your salary have cost in any year since 2010? Compare nominally, adjusted for inflation or for wage growth."),
 'summary.html':("Overview: how deductions from German salaries changed 2010–2028","Your net pay, taxes and social insurance from 2010 to 2028 in two charts, with the reasons behind each change and practical recommendations."),
 'changes.html':("What changes for your salary in 2027 and beyond – Germany","Decided and planned changes to taxes and social insurance – minijob limit, contribution ceilings, tax tariff – and what each one means for your net pay."),
 'privacy.html':("Privacy policy · Where does my salary go?","No login, no cookies, no tracking: everything you enter is calculated in your browser.")},
'de':{
 'index.html':("Brutto-Netto-Rechner 2026 – wohin geht mein Gehalt?","Gib dein Bruttogehalt ein und sieh, wohin es fließt: Lohnsteuer, Soli, Kranken-, Pflege-, Renten- und Arbeitslosenversicherung – und was der Staat damit macht. Steuerklassen I–VI, alle 16 Bundesländer, PKV, Minijob. Geprüft mit dem BMF-Rechner."),
 'past.html':("Gehalt 2010–2026: Steuern und Abgaben von damals berechnen","Wie viel Steuern und Sozialabgaben hätte dein Gehalt in jedem Jahr seit 2010 gekostet? Nominal, inflationsbereinigt oder lohnbereinigt vergleichen."),
 'summary.html':("Überblick: Wie sich die Abzüge vom Gehalt 2010–2028 verändert haben","Netto, Steuern und Sozialabgaben von 2010 bis 2028 in zwei Diagrammen – mit den Gründen für jede Änderung und konkreten Empfehlungen."),
 'changes.html':("Was sich 2027 bei Steuern und Sozialabgaben ändert – und was es für dein Netto bedeutet","Beschlossene und geplante Änderungen bei Steuern und Sozialversicherung – Minijob-Grenze, Beitragsbemessungsgrenzen, Steuertarif – und ihre Wirkung auf dein Netto."),
 'privacy.html':("Datenschutzerklärung · Wohin geht mein Gehalt?","Kein Login, keine Cookies, kein Tracking: Alles, was du eingibst, wird in deinem Browser berechnet.")}}
DE_SRC={'BMF – § 32a EStG tariffs of earlier years (EStH / LStH)': 'BMF – Tarife nach § 32a EStG früherer Jahre (EStH / LStH)', 'Ordio – Lohnsteuer 2026 reference values (used to test this calculator)': 'Ordio – Lohnsteuer-Vergleichswerte 2026 (zum Testen dieses Rechners)', 'Beitragssätze 2026 incl. PV child reductions (DEHOGA NRW)': 'Beitragssätze 2026 inkl. PV-Kinderabschläge (DEHOGA NRW)', 'HEK – Beitragsübersicht 2026 (employer subsidy for private insurance)': 'HEK – Beitragsübersicht 2026 (Arbeitgeberzuschuss zur PKV)', 'Anlage 1 SGB VI – average gross earnings by year (wage adjustment)': 'Anlage 1 SGB VI – Durchschnittsentgelt je Jahr (Lohnbereinigung)', 'DRV – average earnings 2024 (final) and 2026 (provisional)': 'DRV – Durchschnittsentgelt 2024 (endgültig) und 2026 (vorläufig)', 'Consumer price index 2020=100 (Destatis data) – inflation adjustment': 'Verbraucherpreisindex 2020=100 (Destatis) – Inflationsbereinigung', 'sozialpolitik-aktuell.de – contribution rates of earlier years': 'sozialpolitik-aktuell.de – Beitragssätze früherer Jahre', 'Stiftung Warentest – changes during 2026': 'Stiftung Warentest – Änderungen im Lauf von 2026', 'Grundgesetz Art. 106 – distribution of taxes': 'Grundgesetz Art. 106 – Verteilung der Steuern', 'Bundestag – federal budget 2026': 'Bundestag – Bundeshaushalt 2026', 'Bundestag hib 622/2025 – budget 2026: €524.54 bn, taxes €387.21 bn, borrowing €97.97 bn': 'Bundestag hib 622/2025 – Haushalt 2026: 524,54 Mrd. €, Steuern 387,21 Mrd. €, Kredite 97,97 Mrd. €', 'Bundestag – Einzelplan 11: payments to the pension insurance 2026 (€127.42 bn)': 'Bundestag – Einzelplan 11: Leistungen an die Rentenversicherung 2026 (127,42 Mrd. €)', 'Bundestag hib 656/2026 – federal interest 2026/2027': 'Bundestag hib 656/2026 – Zinsausgaben des Bundes 2026/2027', 'DIHK – borrowing incl. special funds 2026 (98 + 83 bn)': 'DIHK – Kreditaufnahme inkl. Sondervermögen 2026 (98 + 83 Mrd. €)', 'BMF Monatsbericht April 2026 – Finanzkraftausgleich 2025, preliminary (copy)': 'BMF-Monatsbericht April 2026 – Finanzkraftausgleich 2025, vorläufig (Kopie)', 'Bundestag hib 623/2025 – Finanzkraftausgleich, federal government answer': 'Bundestag hib 623/2025 – Finanzkraftausgleich, Antwort der Bundesregierung', 'svg-maps – map of German states (CC BY 4.0)': 'svg-maps – Karte der Bundesländer (CC BY 4.0)'}
LOC={'de':'de_DE','en':'en_GB'}
def url(l,p): return f"{BASE}/{l}/" + ('' if p=='index.html' else p)
def head(l,p):
    t,d=META[l][p]; e=html.escape
    alt=''.join(f'<link rel="alternate" hreflang="{x}" href="{url(x,p)}">\n' for x in LANGS)
    alt+=f'<link rel="alternate" hreflang="x-default" href="{BASE}/">\n'
    return (f'<script>window.FORCE_LANG="{l}";window.PAGE_TITLE={json.dumps(t)};</script>\n'
      f'<meta name="description" content="{e(d)}">\n<link rel="canonical" href="{url(l,p)}">\n{alt}'
      f'<meta property="og:type" content="website">\n<meta property="og:title" content="{e(t)}">\n'
      f'<meta property="og:description" content="{e(d)}">\n<meta property="og:url" content="{url(l,p)}">\n'
      f'<meta property="og:locale" content="{LOC[l]}">\n<meta name="twitter:card" content="summary">\n'
      f'<meta property="og:image" content="{BASE}/icon-512.png">\n'+ICONS('../'))
shutil.rmtree(OUT,ignore_errors=True)
for l in LANGS: os.makedirs(os.path.join(OUT,l))
for f in ['engine.js','common.js']: shutil.copy(os.path.join(SRC,f),OUT)
for f in os.listdir(os.path.join(SRC,'assets')): shutil.copy(os.path.join(SRC,'assets',f),OUT)
ICONS=lambda pre: (f'<link rel="icon" href="{pre}favicon.ico" sizes="any">\n<link rel="icon" href="{pre}favicon.svg" type="image/svg+xml">\n'
  f'<link rel="apple-touch-icon" href="{pre}apple-touch-icon.png">\n<meta name="theme-color" content="#534AB7">\n')
for l in LANGS:
    for p in PAGES:
        s=open(os.path.join(SRC,p),encoding='utf-8').read()
        s=s.replace('src="engine.js"','src="../engine.js"').replace('src="common.js"','src="../common.js"')
        s=s.replace('<html lang="en">',f'<html lang="{l}">',1)
        if l=='de':
            for a,b2 in DE_SRC.items(): s=s.replace('>'+a+'</a>','>'+b2+'</a>')
        i=s.index('<meta charset="utf-8">')+len('<meta charset="utf-8">')
        s=s[:i]+'\n'+head(l,p)+s[i:]
        open(os.path.join(OUT,l,p),'w',encoding='utf-8').write(s)
# prerender: run each page once and save the rendered DOM so the text is in the HTML
with sync_playwright() as pw:
    b=pw.chromium.launch(); errs=[]
    for l in LANGS:
        for p in PAGES:
            ctx=b.new_context(viewport={'width':1200,'height':900},locale='de-DE' if l=='de' else 'en-GB'); pg=ctx.new_page()
            pg.on('pageerror',lambda e,l=l,p=p:errs.append(f'{l}/{p}: {e}'))
            fp=os.path.join(OUT,l,p); pg.goto('file://'+fp); pg.wait_for_timeout(1200)
            out='<!DOCTYPE html>\n'+pg.evaluate('document.documentElement.outerHTML')
            open(fp,'w',encoding='utf-8').write(out); ctx.close()
    b.close()
if errs: raise SystemExit('JS errors: '+'; '.join(errs))
# refuse to build while placeholders are left on any page
left=[f'{l}/{p}' for l in LANGS for p in PAGES if 'class="todo"' in open(os.path.join(OUT,l,p),encoding='utf-8').read()]
if left: raise SystemExit('Unfilled placeholders [...] on: '+', '.join(left))
root=f'''<!DOCTYPE html>
<html lang="de"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Wohin geht mein Gehalt? · Where does my salary go?</title>
{ICONS("")}
<meta name="description" content="Brutto-Netto-Rechner mit Geldfluss: wohin Steuern und Sozialabgaben gehen. Gross-to-net calculator for Germany.">
<link rel="canonical" href="{BASE}/">
<link rel="alternate" hreflang="de" href="{url('de','index.html')}">
<link rel="alternate" hreflang="en" href="{url('en','index.html')}">
<link rel="alternate" hreflang="x-default" href="{BASE}/">
<script>(function(){{var l;try{{l=sessionStorage.getItem('lang');}}catch(e){{}}
if(!l)l=(navigator.language||'').toLowerCase().indexOf('de')===0?'de':'en';location.replace(l+'/');}})();</script>
<style>body{{font-family:system-ui,sans-serif;max-width:520px;margin:15vh auto;padding:0 16px;line-height:1.6}}a{{color:#534AB7}}</style>
</head><body><h1>Wohin geht mein Gehalt? · Where does my salary go?</h1>
<p><a href="de/index.html">Deutsch</a> · <a href="en/index.html">English</a></p></body></html>'''
open(os.path.join(OUT,'index.html'),'w',encoding='utf-8').write(root)
sm=['<?xml version="1.0" encoding="UTF-8"?>','<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">']
for l in LANGS:
    for p in PAGES:
        sm.append(f'<url><loc>{url(l,p)}</loc>'+''.join(f'<xhtml:link rel="alternate" hreflang="{x}" href="{url(x,p)}"/>' for x in LANGS)+'</url>')
sm.append('</urlset>')
open(os.path.join(OUT,'sitemap.xml'),'w').write('\n'.join(sm))
open(os.path.join(OUT,'robots.txt'),'w').write(f'User-agent: *\nAllow: /\nSitemap: {BASE}/sitemap.xml\n')
# security headers for statichost.eu (_headers): strict CSP with hashes of every inline script
import re, hashlib, base64
hashes=set()
for dp,_,fs in os.walk(OUT):
    for f in fs:
        if f.endswith('.html'):
            for m in re.finditer(r'<script(?![^>]*\bsrc=)[^>]*>(.*?)</script>',open(os.path.join(dp,f),encoding='utf-8').read(),re.S):
                hashes.add("'sha256-"+base64.b64encode(hashlib.sha256(m.group(1).encode('utf-8')).digest()).decode()+"'")
csp=("default-src 'none'; script-src 'self' "+' '.join(sorted(hashes))+"; style-src 'self' 'unsafe-inline'; img-src 'self' data:; "
     "connect-src 'none'; frame-src 'self'; font-src 'none'; object-src 'none'; base-uri 'none'; form-action 'none'; frame-ancestors 'self'; upgrade-insecure-requests")
open(os.path.join(OUT,'_headers'),'w').write(f'''*
    Content-Security-Policy: {csp}
    Strict-Transport-Security: max-age=31536000
    X-Content-Type-Options: nosniff
    X-Frame-Options: SAMEORIGIN
    Referrer-Policy: no-referrer
    Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()
    Cross-Origin-Opener-Policy: same-origin
''')
print('inline script hashes:',len(hashes))
print('built', sum(len(fs) for _,_,fs in os.walk(OUT)), 'files')
