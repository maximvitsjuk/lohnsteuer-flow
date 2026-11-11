"""Quality check for the built site in dist/: placeholders, broken internal links,
JS errors, CSP violations, NaN/undefined in rendered text, horizontal overflow on phones.
Run after building:  python3 build.py && python3 build_site.py && python3 tests/qa.py"""
import http.server, os, re, threading, sys
from playwright.sync_api import sync_playwright
ROOT=os.path.join(os.path.dirname(os.path.abspath(__file__)),'..','dist')
H=[l.strip().split(': ',1) for l in open(os.path.join(ROOT,'_headers')).read().splitlines()[1:] if ': ' in l]
class R(http.server.SimpleHTTPRequestHandler):
    def __init__(s,*a,**k): super().__init__(*a,directory=ROOT,**k)
    def end_headers(s):
        for k,v in H:
            if k=='Content-Security-Policy': s.send_header(k,v.replace('; upgrade-insecure-requests',''))
            elif k!='Strict-Transport-Security': s.send_header(k,v)
        super().end_headers()
    def log_message(s,*a): pass
srv=http.server.ThreadingHTTPServer(('127.0.0.1',0),R); threading.Thread(target=srv.serve_forever,daemon=True).start()
B=f'http://127.0.0.1:{srv.server_port}/'
problems=[]
# static scan
for dp,_,fs in os.walk(ROOT):
    for f in fs:
        if not f.endswith('.html'): continue
        p=os.path.join(dp,f); s=open(p,encoding='utf-8').read()
        vis=re.sub(r'<script.*?</script>|<style.*?</style>','',s,flags=re.S)
        if re.search(r'class="todo"|TODO|DEINE-DOMAIN|example\.com',vis): problems.append(('placeholder',p))
        for ref in re.findall(r'(?:href|src)="([^"#:]+)"',vis):
            if ref.startswith(('http','mailto','data')): continue
            t=os.path.normpath(os.path.join(dp,ref))
            if ref.endswith('/') or os.path.isdir(t): t=os.path.join(t,'index.html')
            if not os.path.exists(t): problems.append(('broken link',p,ref))
BAD=re.compile(r'\bNaN\b|\bundefined\b|\bnull\b|Infinity|\$\{')
with sync_playwright() as pw:
    b=pw.chromium.launch()
    for scheme in ['light','dark']:
        for w in [1280,375]:
            ctx=b.new_context(viewport={'width':w,'height':900},color_scheme=scheme); pg=ctx.new_page(); errs=[]
            pg.on('pageerror',lambda e:errs.append(str(e))); pg.on('console',lambda m: errs.append(m.text) if m.type=='error' else None)
            for l in ['de','en']:
                for f in ['index.html','past.html','summary.html','changes.html','privacy.html']:
                    pg.goto(B+l+'/'+f); pg.wait_for_timeout(400)
                    for v in ([0,450,1500,3500,9000] if f!='privacy.html' else [None]):
                        if v is not None: pg.evaluate("v=>{const g=document.getElementById('gross');g.value=String(v);g.dispatchEvent(new Event('input',{bubbles:true}));}",v); pg.wait_for_timeout(120)
                        t=pg.inner_text('body')
                        for m in BAD.finditer(t): problems.append(('bad value',scheme,w,l,f,v,t[max(0,m.start()-40):m.end()+20]))
                        o=pg.evaluate('document.documentElement.scrollWidth-document.documentElement.clientWidth')
                        if o>1: problems.append(('overflow',scheme,w,l,f,o))
            # Past: no take-home switch on the page, year in the list = year in the text
            pg.goto(B+'en/past.html'); pg.wait_for_timeout(400)
            if pg.evaluate("(()=>{const e=document.getElementById('srcSeg');return !!e&&e.offsetParent!==null})()"): problems.append(('past shows net switch',scheme,w))
            yv=pg.input_value('#year')
            if yv not in pg.inner_text('#adjOut'): problems.append(('past year mismatch',scheme,w,yv))
            # settings drawer opens and holds the salary field
            pg.goto(B+'en/summary.html'); pg.wait_for_timeout(400); pg.click('#setFab'); pg.wait_for_timeout(900)
            fr=[f for f in pg.frames if 'embed=1' in f.url]
            if not fr or not fr[0].evaluate("document.getElementById('grossV').offsetParent!==null"): problems.append(('drawer without salary',scheme,w))
            if errs: problems.append(('js errors',scheme,w,errs[:5]))
            ctx.close()
    b.close()
for x in problems: print(x)
print('problems:',len(problems)); sys.exit(1 if problems else 0)
