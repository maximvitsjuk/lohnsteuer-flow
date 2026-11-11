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
