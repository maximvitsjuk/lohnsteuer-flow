// Shared data-protection line (EN/DE). No storage, no network.
window.DATA_LINE={
 en:'🔒 No login, no cookies, no tracking. Everything you enter is calculated in your browser and is never sent to a server. Your inputs stay only in this tab and are deleted when you close it. <a href="privacy.html">Privacy policy</a>',
 de:'🔒 Kein Login, keine Cookies, kein Tracking. Alles, was du eingibst, wird in deinem Browser berechnet und nie an einen Server gesendet. Deine Eingaben bleiben nur in diesem Tab und werden beim Schließen gelöscht. <a href="privacy.html">Datenschutzerklärung</a>'};
// Language folders (/en/, /de/): switching language = go to the same page in the other folder; inputs travel via sessionStorage.
window.switchLang=function(l){if(!window.FORCE_LANG||l===window.FORCE_LANG)return !!window.FORCE_LANG;
 try{sessionStorage.setItem('lang',l);}catch(e){}
 location.href='../'+l+'/'+(location.pathname.split('/').pop()||'index.html');return true;};
// Theme: auto (follow system) → light → dark. Kept only for this tab (sessionStorage), like all other settings.
(function(){
 var root=document.documentElement,KEY='theme',ORDER=['auto','light','dark'];
 var LBL={en:{auto:'Auto',light:'Light',dark:'Dark',t:'Colour theme: '},de:{auto:'Auto',light:'Hell',dark:'Dunkel',t:'Farbschema: '}};
 var ICON={auto:'◐',light:'☀',dark:'☾'};
 function get(){var t=null;try{t=sessionStorage.getItem(KEY);}catch(e){}return ORDER.indexOf(t)>0?t:'auto';}
 function apply(t){if(t==='auto')root.removeAttribute('data-theme');else root.setAttribute('data-theme',t);}
 apply(get());
 window.isDark=function(){var t=root.getAttribute('data-theme');return t?t==='dark':matchMedia('(prefers-color-scheme: dark)').matches;};
 function label(){var b=document.getElementById('themeBtn');if(!b)return;var l=LBL[(root.lang||'en').slice(0,2)]||LBL.en,t=get();
  b.textContent=ICON[t]+' '+l[t];b.title=l.t+l[t];b.setAttribute('aria-label',l.t+l[t]);}
 function mount(){
  var b=document.getElementById('themeBtn');
  if(!b){var lb=document.querySelector('[data-lang]');if(!lb)return;b=document.createElement('button');b.id='themeBtn';b.type='button';b.className='themebtn';
   var grp=lb.parentNode;grp.parentNode.insertBefore(b,grp);}
  b.onclick=function(){var t=ORDER[(ORDER.indexOf(get())+1)%3];try{sessionStorage.setItem(KEY,t);}catch(e){}apply(t);label();window.dispatchEvent(new Event('themechange'));};
  label();new MutationObserver(label).observe(root,{attributes:true,attributeFilter:['lang']});
 }
 var st=document.createElement('style');
 st.textContent='.themebtn{background:transparent;border:1px solid var(--border);color:var(--muted);border-radius:6px;padding:4px 10px;margin:0 8px 0 auto;font:inherit;font-size:13px;cursor:pointer;white-space:nowrap;vertical-align:middle}.themebtn:hover{color:var(--text)}';
 (document.head||root).appendChild(st);
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount);else mount();
})();
// Gross salary: enter per month or per year. The page keeps working with the monthly value in #gross (hidden);
// the visible field #grossV shows month or year. Unit is kept for this tab only.
(function(){
 var LBL={en:{m:'/ month',y:'/ year',t:'Enter gross per month or per year'},de:{m:'/ Monat',y:'/ Jahr',t:'Brutto pro Monat oder pro Jahr eingeben'}};
 function unit(){try{return (JSON.parse(sessionStorage.getItem('salaryState')||'{}').grossUnit)==='y'?'y':'m';}catch(e){return 'm';}}
 function setUnit(u){try{var s=JSON.parse(sessionStorage.getItem('salaryState')||'{}');s.grossUnit=u;sessionStorage.setItem('salaryState',JSON.stringify(s));}catch(e){}}
 var st=document.createElement('style');
 st.textContent='.gu{display:flex;gap:6px;align-items:center;min-width:0}.gu input{flex:1;min-width:0}.guseg{display:inline-flex;border:1px solid var(--border);border-radius:8px;overflow:hidden;flex:none}'+
  '.guseg button{background:transparent;border:0;color:var(--muted);padding:7px 9px;font:inherit;font-size:13px;cursor:pointer;white-space:nowrap}'+
  '.guseg button.on{background:var(--accent,#534AB7);color:#fff}'+
  /* field + unit on one line, slider full width underneath */
  'div.grossrow,div.sal{grid-template-columns:1fr!important;gap:10px!important}.gu{max-width:380px}.gu input{min-width:120px}'+
  '.topnav{overflow-x:auto;scrollbar-width:none;flex-wrap:nowrap}.topnav::-webkit-scrollbar{display:none}.topnav a{white-space:nowrap;flex:none}'+
  '@media (max-width:600px){nav.topnav a{padding:8px 8px;font-size:13px}}@media (max-width:360px){nav.topnav a{padding:8px 6px;font-size:12.5px}}';
 (document.head||document.documentElement).appendChild(st);
 function mount(){
  var g=document.getElementById('gross');if(!g)return;
  var v=document.getElementById('grossV'),w;
  if(!v){w=document.createElement('div');w.className='gu';v=document.createElement('input');v.type='number';v.id='grossV';v.min='0';v.step='any';v.inputMode='decimal';
   var seg=document.createElement('div');seg.className='guseg';seg.setAttribute('role','group');
   seg.innerHTML='<button type="button" data-u="m"></button><button type="button" data-u="y"></button>';
   w.appendChild(v);w.appendChild(seg);g.parentNode.insertBefore(w,g);g.style.display='none';g.tabIndex=-1;g.setAttribute('aria-hidden','true');}
  var lab=document.querySelector('label[for="gross"]');if(lab)lab.htmlFor='grossV';
  var desc=Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value');
  function show(){if(document.activeElement===v)return;var m=+desc.get.call(g)||0;desc.set.call(v,String(unit()==='y'?Math.round(m*12):m));}
  Object.defineProperty(g,'value',{configurable:true,get:function(){return desc.get.call(g);},set:function(x){desc.set.call(g,x);show();}});
  v.addEventListener('input',function(){var x=Math.max(0,+v.value||0);var m=unit()==='y'?Math.round(x/12*100)/100:x;
   desc.set.call(g,String(m));g.dispatchEvent(new Event('input',{bubbles:true}));g.dispatchEvent(new Event('change',{bubbles:true}));});
  function paint(){var l=LBL[(document.documentElement.lang||'en').slice(0,2)]||LBL.en,u=unit();
   v.max=u==='y'?'360000':'30000';v.step='any';
   document.querySelectorAll('.guseg button').forEach(function(b){b.textContent=l[b.dataset.u];b.classList.toggle('on',b.dataset.u===u);b.setAttribute('aria-pressed',b.dataset.u===u);});
   var sg=document.querySelector('.guseg');if(sg)sg.setAttribute('aria-label',l.t);}
  document.querySelectorAll('.guseg button').forEach(function(b){b.onclick=function(){setUnit(b.dataset.u);paint();var a=document.activeElement;if(a===v)v.blur();show();};});
  paint();show();new MutationObserver(paint).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount);else mount();
})();
// Settings drawer: the calculator's own settings (index.html?embed=1) opened over Overview/Future,
// so every setting can be changed from any page. Same tab and origin, so it shares sessionStorage.
(function(){
 if(/[?&]embed=1\b/.test(location.search))document.documentElement.classList.add('embed');
 var LBL={en:{t:'Settings',c:'Close',d:'Done'},de:{t:'Einstellungen',c:'Schließen',d:'Fertig'}};
 var st=document.createElement('style');
 st.textContent='.sdrawer{position:fixed;inset:0;z-index:1000;display:flex;justify-content:flex-end}.sdrawer .sbk{position:absolute;inset:0;background:rgba(0,0,0,.45)}'+
 '.sdrawer .spanel{position:relative;width:min(760px,100%);height:100%;background:var(--bg);display:flex;flex-direction:column;box-shadow:-8px 0 24px rgba(0,0,0,.25)}'+
 '.sdrawer .shead{display:flex;justify-content:space-between;align-items:center;padding:12px 16px;border-bottom:1px solid var(--border)}.sdrawer .shead b{font-size:17px}'+
 '.sdrawer .shead button{background:var(--accent,#534AB7);color:#fff;border:0;border-radius:8px;padding:7px 16px;font:inherit;font-size:14px;cursor:pointer}'+
 '.sdrawer iframe{flex:1;width:100%;border:0;background:var(--bg)}html.sdopen,html.sdopen body{overflow:hidden}'+
 '.setbtn{background:transparent;border:1px solid var(--accent,#534AB7);color:var(--accent,#534AB7);border-radius:999px;padding:3px 12px;font:inherit;font-size:12px;cursor:pointer}'+
 '.setbtn:hover{background:var(--accent,#534AB7);color:#fff}.chips span{cursor:pointer}.embed #setFab,.embed #topSum{display:none!important}';
 (document.head||document.documentElement).appendChild(st);
 var dr=null,fr=null,lastFocus=null;
 function close(){if(!dr)return;dr.remove();dr=null;fr=null;document.documentElement.classList.remove('sdopen');window.dispatchEvent(new Event('settingschange'));if(lastFocus)lastFocus.focus();}
 window.openSettings=function(){
  if(dr)return;lastFocus=document.activeElement;var l=LBL[(document.documentElement.lang||'en').slice(0,2)]||LBL.en;
  dr=document.createElement('div');dr.className='sdrawer';dr.setAttribute('role','dialog');dr.setAttribute('aria-modal','true');dr.setAttribute('aria-label',l.t);
  dr.innerHTML='<div class="sbk"></div><div class="spanel"><div class="shead"><b></b><button type="button"></button></div><iframe title=""></iframe></div>';
  dr.querySelector('b').textContent=l.t;var btn=dr.querySelector('button');btn.textContent=l.d;btn.setAttribute('aria-label',l.c);
  fr=dr.querySelector('iframe');fr.title=l.t;fr.src='index.html?embed=1';
  dr.querySelector('.sbk').onclick=close;btn.onclick=close;
  document.body.appendChild(dr);document.documentElement.classList.add('sdopen');btn.focus();
 };
 window.addEventListener('message',function(e){if(fr&&e.source===fr.contentWindow&&e.data&&e.data.type==='salary-settings')window.dispatchEvent(new Event('settingschange'));});
 document.addEventListener('keydown',function(e){if(e.key==='Escape'&&dr)close();});
 document.addEventListener('click',function(e){var t=e.target;if(!t.closest)return;if(t.closest('.setbtn')||t.closest('.chips span')){e.preventDefault();window.openSettings();}});
})();
window.STATE_NAMES={BW:'Baden-Württemberg',BY:'Bayern',BE:'Berlin',BB:'Brandenburg',HB:'Bremen',HH:'Hamburg',HE:'Hessen',MV:'Mecklenburg-Vorpommern',NI:'Niedersachsen',NW:'Nordrhein-Westfalen',RP:'Rheinland-Pfalz',SL:'Saarland',SN:'Sachsen',ST:'Sachsen-Anhalt',SH:'Schleswig-Holstein',TH:'Thüringen'};
// Summary bar above the menu (salary + chosen settings) and a settings tab fixed to the right edge.
(function(){
 if(document.documentElement.classList.contains('embed'))return;
 var L={en:{gross:'gross',net:'take-home',m:'/ month',y:'/ year',cls:'Class',k1:'child',kn:'children',pub:'public insurance',priv:'private insurance',stud:'student',beamt:'civil servant',ki:'church tax',adv:'advanced options',btn:'Settings',edit:'Change'},
        de:{gross:'brutto',net:'netto',m:'/ Monat',y:'/ Jahr',cls:'Klasse',k1:'Kind',kn:'Kinder',pub:'gesetzlich versichert',priv:'privat versichert',stud:'Student/in',beamt:'Beamt/in',ki:'Kirchensteuer',adv:'erweiterte Optionen',btn:'Einstellungen',edit:'Ändern'}};
 var st=document.createElement('style');
 st.textContent='.topsum{display:flex;width:100%;text-align:left;background:var(--card);border:1px solid var(--border);border-radius:10px;padding:8px 12px;margin:10px 0 4px;font:inherit;font-size:13px;color:var(--muted);cursor:pointer;gap:4px 10px;align-items:center;flex-wrap:wrap}'+
 '.topsum b{color:var(--text);font-weight:600;font-size:14px}.topsum .ts-edit{margin-left:auto;color:var(--accent,#534AB7);white-space:nowrap}.topsum:hover{border-color:var(--accent,#534AB7)}'+
 '.setfab{position:fixed;right:0;top:50%;transform:translateY(-50%);z-index:900;writing-mode:vertical-rl;background:var(--accent,#534AB7);color:#fff;border:0;border-radius:10px 0 0 10px;padding:16px 9px;font:inherit;font-size:14px;letter-spacing:.02em;cursor:pointer;box-shadow:-2px 2px 12px rgba(0,0,0,.25)}'+
 '.setfab:hover{padding-right:13px}html.sdopen .setfab{display:none}'+
 '@media (max-width:600px){.setfab{writing-mode:horizontal-tb;top:auto;bottom:16px;right:16px;transform:none;border-radius:999px;padding:12px 18px}}';
 (document.head||document.documentElement).appendChild(st);
 function state(){try{return JSON.parse(sessionStorage.getItem('salaryState')||'{}');}catch(e){return {};}}
 function esc(x){return String(x).replace(/&/g,'&amp;').replace(/</g,'&lt;');}
 window.updateTopSummary=function(){
  var bar=document.getElementById('topSum'),fab=document.getElementById('setFab');if(!bar)return;
  var lg=(document.documentElement.lang||'en').slice(0,2),l=L[lg]||L.en,s=state(),y=s.grossUnit==='y',f=y?12:1;
  var money=function(v){return new Intl.NumberFormat(lg==='de'?'de-DE':'en-IE',{style:'currency',currency:'EUR',maximumFractionDigits:0}).format(v);};
  var g=+(s.gross!=null?s.gross:2000)||0,first=s.netMode&&s.netTarget!=null?'<b>'+money(+s.netTarget*f)+'</b> '+l.net+' '+(y?l.y:l.m):'<b>'+money(g*f)+'</b> '+l.gross+' '+(y?l.y:l.m);
  var kids=+(s.kids||0),status=s.status||'emp',hi=s.hi||'pub',adv=s.adv&&(s.adv.fb||s.adv.bav||s.adv.fac||s.adv.sj);
  var parts=[l.cls+' '+['I','II','III','IV','V','VI'][(+(s.cls||1))-1],kids+' '+(kids===1?l.k1:l.kn),(window.STATE_NAMES||{})[s.state||'BW']||s.state||'',
   status==='stud'?l.stud:status==='beamt'?l.beamt:(hi==='priv'?l.priv:l.pub),s.c_ki?l.ki:'',adv?l.adv:''].filter(Boolean);
  bar.innerHTML=first+' · '+parts.map(esc).join(' · ')+'<span class="ts-edit">⚙ '+l.edit+'</span>';
  bar.setAttribute('aria-label',l.btn);if(fab){fab.textContent='⚙ '+l.btn;fab.setAttribute('aria-label',l.btn);}
 };
 function mount(){
  var nav=document.querySelector('nav.topnav');if(!nav)return;
  var bar=document.getElementById('topSum');
  if(!bar){bar=document.createElement('button');bar.type='button';bar.id='topSum';bar.className='topsum';nav.parentNode.insertBefore(bar,nav);}
  var fab=document.getElementById('setFab');
  if(!fab){fab=document.createElement('button');fab.type='button';fab.id='setFab';fab.className='setfab';document.body.appendChild(fab);}
  bar.onclick=fab.onclick=function(){window.openSettings();};
  window.updateTopSummary();
  new MutationObserver(window.updateTopSummary).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
  window.addEventListener('settingschange',window.updateTopSummary);
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount);else mount();
})();
