# regenerate past.html from index.html
s=open('index.html').read()
open('past.html','w').write(s.replace('<script src="engine.js"></script>','<script src="engine.js"></script>\n<script>window.PAGE="past";</script>',1).replace('<title>Where does my salary go? · Germany 2026</title>','<title>How much did I pay back then? · Germany</title>',1))
