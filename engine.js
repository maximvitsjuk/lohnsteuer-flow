// Shared calculation engine – year-parameterised.
// Tax: § 32a EStG tariffs (official), PAP logic (Vorsorgepauschale, classes V/VI).
// Social insurance: values as of 1 January of each year (2023: care insurance changed in July).
(function(){
const T=(g,e2,a2,e3,a3,c3,c4,e4,c5)=>({g,e2,a2,e3,a3,c3,c4,e4,c5});
const base={rv:0.186,sa:36,soliMild:0.119,kvGen:0.146,kvRed:0.140,kvAN:0.073,kvAG:0.073,zbAN:0.5,ebChild:true,pauschSt:0.02,miniRvAN:0.036,miniKvAG:0.13,miniRvAG:0.15,snExtra:0.005};
const P={
2010:{...base,year:2010,t:T(8004,13469,912.17,52881,228.74,1038,8172,250730,15694),anp:920,eb:1308,ebChild:false,kfb:7008,soliFG:972,soliMild:0.20,W:[9429,26441,200584],rvVsp:0.40,
 kvBBG:3750,pvBBG:3750,rvBBG:5500,zb:0,kvGen:0.149,kvAN:0.079,kvAG:0.070,kvVspFix:0.076,pv:0.0195,pvK:0.0025,pvRed:0,rv:0.199,av:0.028,mini:400,ueTop:800,ueOld:true,Fnum:0.30,miniRvAN:0},
2011:{...base,year:2011,t:T(8004,13469,912.17,52881,228.74,1038,8172,250730,15694),anp:1000,eb:1308,ebChild:false,kfb:7008,soliFG:972,soliMild:0.20,W:[9429,26441,200584],rvVsp:0.44,
 kvBBG:3712.5,pvBBG:3712.5,rvBBG:5500,zb:0,kvGen:0.155,kvAN:0.082,kvAG:0.073,kvVspFix:0.079,pv:0.0195,pvK:0.0025,pvRed:0,rv:0.199,av:0.030,mini:400,ueTop:800,ueOld:true,Fnum:0.30,miniRvAN:0},
2012:{...base,year:2012,t:T(8004,13469,912.17,52881,228.74,1038,8172,250730,15694),anp:1000,eb:1308,ebChild:false,kfb:7008,soliFG:972,soliMild:0.20,W:[9429,26441,200584],rvVsp:0.48,
 kvBBG:3825,pvBBG:3825,rvBBG:5600,zb:0,kvGen:0.155,kvAN:0.082,kvAG:0.073,kvVspFix:0.079,pv:0.0195,pvK:0.0025,pvRed:0,rv:0.196,av:0.030,mini:400,ueTop:800,ueOld:true,Fnum:0.30,miniRvAN:0},
2013:{...base,year:2013,t:T(8130,13469,933.70,52881,228.74,1014,8196,250730,15718),anp:1000,eb:1308,ebChild:false,kfb:7008,soliFG:972,soliMild:0.20,W:[9550,26441,200584],rvVsp:0.52,
 kvBBG:3937.5,pvBBG:3937.5,rvBBG:5800,zb:0,kvGen:0.155,kvAN:0.082,kvAG:0.073,kvVspFix:0.079,pv:0.0205,pvK:0.0025,pvRed:0,rv:0.189,av:0.030,mini:450,ueTop:850,ueOld:true,Fnum:0.30,miniRvAN:0.039},
2014:{...base,year:2014,t:T(8354,13469,974.58,52881,228.74,971,8239,250730,15761),anp:1000,eb:1308,ebChild:false,kfb:7008,soliFG:972,soliMild:0.20,W:[9763,26441,200584],rvVsp:0.56,
 kvBBG:4050,pvBBG:4050,rvBBG:5950,zb:0,kvGen:0.155,kvAN:0.082,kvAG:0.073,kvVspFix:0.079,pv:0.0205,pvK:0.0025,pvRed:0,rv:0.189,av:0.030,mini:450,ueTop:850,ueOld:true,Fnum:0.30,miniRvAN:0.039},
2015:{...base,year:2015,t:T(8472,13469,997.60,52881,228.74,948.68,8261.29,250730,15783.19),anp:1000,eb:1908,kfb:7152,soliFG:972,soliMild:0.20,W:[9763,26441,200584],rvVsp:0.60,
 kvBBG:4125,pvBBG:4125,rvBBG:6050,zb:0.9,zbAN:1,pv:0.0235,pvK:0.0025,pvRed:0,rv:0.187,av:0.030,mini:450,ueTop:850,ueOld:true,Fnum:0.30,miniRvAN:0.037},
2016:{...base,year:2016,t:T(8652,13669,993.62,53665,225.40,952.48,8394.14,254446,16027.52),anp:1000,eb:1908,kfb:7248,soliFG:972,soliMild:0.20,W:[10070,26832,203557],rvVsp:0.64,
 kvBBG:4237.5,pvBBG:4237.5,rvBBG:6200,zb:1.1,zbAN:1,pv:0.0235,pvK:0.0025,pvRed:0,rv:0.187,av:0.030,mini:450,ueTop:850,ueOld:true,Fnum:0.30,miniRvAN:0.037},
2017:{...base,year:2017,t:T(8820,13769,1007.27,54057,223.76,939.57,8475.44,256303,16164.53),anp:1000,eb:1908,kfb:7356,soliFG:972,soliMild:0.20,W:[10240,27029,205043],rvVsp:0.68,
 kvBBG:4350,pvBBG:4350,rvBBG:6350,zb:1.1,zbAN:1,pv:0.0255,pvK:0.0025,pvRed:0,rv:0.187,av:0.030,mini:450,ueTop:850,ueOld:true,Fnum:0.30,miniRvAN:0.037},
2018:{...base,year:2018,t:T(9000,13996,997.80,54949,220.13,948.49,8621.75,260532,16437.70),anp:1000,eb:1908,kfb:7428,soliFG:972,soliMild:0.20,W:[10440,27475,208426],rvVsp:0.72,
 kvBBG:4425,pvBBG:4425,rvBBG:6500,zb:1.0,zbAN:1,pv:0.0255,pvK:0.0025,pvRed:0,rv:0.186,av:0.030,mini:450,ueTop:850,ueOld:true,Fnum:0.30},
2019:{...base,year:2019,t:T(9168,14254,980.14,55960,216.16,965.58,8780.90,265326,16740.68),anp:1000,eb:1908,kfb:7620,soliFG:972,soliMild:0.20,W:[10635,27980,212261],rvVsp:0.76,
 kvBBG:4537.5,pvBBG:4537.5,rvBBG:6700,zb:0.9,pv:0.0305,pvK:0.0025,pvRed:0,rv:0.186,av:0.025,mini:450,ueTop:850,ueOld:true,Fnum:0.30},
2020:{...base,year:2020,t:T(9408,14532,972.87,57051,212.02,972.79,8963.74,270500,17078.74),anp:1000,eb:4008,kfb:7812,soliFG:972,soliMild:0.20,W:[10898,28526,216400],rvVsp:0.80,
 kvBBG:4687.5,pvBBG:4687.5,rvBBG:6900,zb:1.1,pv:0.0305,pvK:0.0025,pvRed:0,av:0.024,mini:450,ueTop:1300,ueOld:true,Fnum:0.30},
2021:{...base,year:2021,t:T(9744,14753,995.21,57918,208.85,950.96,9136.63,274612,17374.99),anp:1000,eb:4008,kfb:8388,soliFG:16956,W:[11237,28959,219690],rvVsp:0.84,
 kvBBG:4837.5,pvBBG:4837.5,rvBBG:7100,zb:1.3,pv:0.0305,pvK:0.0025,pvRed:0,av:0.024,mini:450,ueTop:1300,ueOld:true,Fnum:0.30},
2022:{...base,year:2022,t:T(10347,14926,1088.67,58596,206.43,869.32,9336.45,277825,17671.20),anp:1200,eb:4008,kfb:8548,soliFG:16956,W:[11793,29298,222260],rvVsp:0.88,
 kvBBG:4837.5,pvBBG:4837.5,rvBBG:7050,zb:1.3,pv:0.0305,pvK:0.0035,pvRed:0,av:0.024,mini:450,ueTop:1300,ueOld:true,Fnum:0.30},
2023:{...base,year:2023,t:T(10908,15999,979.18,62809,192.59,966.53,9972.98,277825,18307.73),anp:1230,eb:4260,kfb:8952,soliFG:17543,W:[12485,30826,222260],rvVsp:1,
 kvBBG:4987.5,pvBBG:4987.5,rvBBG:7300,zb:1.6,pv:0.0305,pvK:0.0035,pvRed:0,av:0.026,mini:520,ueTop:2000,ueOld:false,Fnum:0.28},
2024:{...base,year:2024,t:T(11784,17005,954.80,66760,181.19,991.21,10636.31,277825,18971.06),anp:1230,eb:4260,kfb:9540,soliFG:18130,W:[13279,33380,222260],rvVsp:1,
 kvBBG:5175,pvBBG:5175,rvBBG:7550,zb:1.7,pv:0.034,pvK:0.006,pvRed:0.0025,av:0.026,mini:538,ueTop:2000,ueOld:false,Fnum:0.28},
2025:{...base,year:2025,t:T(12096,17443,932.30,68480,176.64,1015.13,10911.92,277825,19246.67),anp:1230,eb:4260,kfb:9600,soliFG:19950,W:[13785,34240,222260],rvVsp:1,
 kvBBG:5512.5,pvBBG:5512.5,rvBBG:8050,zb:2.5,pv:0.036,pvK:0.006,pvRed:0.0025,av:0.026,mini:556,ueTop:2000,ueOld:false,Fnum:0.28},
2026:{...base,year:2026,t:T(12348,17799,914.51,69878,173.10,1034.87,11135.63,277825,19470.38),anp:1230,eb:4260,kfb:9756,soliFG:20350,W:[14071,34939,222260],rvVsp:1,
 kvBBG:5812.5,pvBBG:5812.5,rvBBG:8450,zb:2.9,pv:0.036,pvK:0.006,pvRed:0.0025,av:0.026,mini:603,ueTop:2000,ueOld:false,Fnum:0.28}
};
const fF=p=>p.Fnum/(p.kvAN+p.kvAG+p.zb/100+p.pv+p.rv+p.av);
for(const y in P){P[y].F=fF(P[y]);}
const r2=v=>Math.round(v*100)/100;

function tariff(x,p){
 if(p.scale)x=x*p.scale;
 x=Math.floor(x);const t=p.t;
 if(x<=t.g)return 0;
 if(x<=t.e2){const y=(x-t.g)/1e4;return Math.floor((t.a2*y+1400)*y);}
 if(x<=t.e3){const z=(x-t.e2)/1e4;return Math.floor((t.a3*z+2397)*z+t.c3);}
 if(x<=t.e4)return Math.floor(0.42*x-t.c4);
 return Math.floor(0.45*x-t.c5);}
function up56(zx,p){return Math.max((tariff(zx*1.25,p)-tariff(zx*0.75,p))*2,Math.floor(zx*0.14));}
function st56(z,p){const [W1,W2,W3]=p.W;let st;
 if(z>W2){st=up56(W2,p);st=z>W3?Math.floor(st+(W3-W2)*0.42+(z-W3)*0.45):Math.floor(st+(z-W2)*0.42);}
 else{st=up56(z,p);if(z>W1)st=Math.min(st,Math.floor(up56(W1,p)+(z-W1)*0.42));}return st;}
function pvRates(o,p){
 const kidsN=o.kids,sn=o.state==='SN';
 const PVk=(kidsN===0&&o.age23)?p.pvK:0,PVred=Math.max(0,Math.min(kidsN,5)-1)*p.pvRed;
 const PV=Math.max(0,p.pv/2+(sn?p.snExtra:0)-PVred);
 const PVag=p.pv/2-(sn?p.snExtra:0);
 return {PV,PVk,PVred,PVag};}
function svCalc(g,o,p){
 const zb=o.zb/100,{PV,PVk,PVred,PVag}=pvRates(o,p);
 const KV=p.kvAN+zb*p.zbAN,RV=p.rv/2,AV=p.av/2;
 const tot={kv:p.kvAN+p.kvAG+zb,pv:p.pv,rv:p.rv,av:p.av},agR={kv:p.kvAG+zb*(1-p.zbAN),pv:PVag,rv:RV,av:AV};
 const on={kv:o.kv,pv:o.pv,rv:o.rv,av:o.av},an={kv:KV,pv:PV,rv:RV,av:AV};
 const c={kv:0,pv:0,rv:0,av:0,ag:{kv:0,pv:0,rv:0,av:0},zone:'normal',PV,PVk,KV,
  rates:{kv:[KV,agR.kv,tot.kv],pv:[PV+PVk,agR.pv,tot.pv+PVk-PVred],rv:[RV,RV,tot.rv],av:[AV,AV,tot.av]},
  base:{kv:Math.min(g,p.kvBBG),pv:Math.min(g,p.pvBBG),rv:Math.min(g,p.rvBBG),av:Math.min(g,p.rvBBG)}};
 if(g<=0)return c;
 const G=p.mini,O=p.ueTop,F=p.F;
 if(g<=G){c.zone='mini';if(on.rv){c.rv=r2(g*p.miniRvAN);c.ag.rv=r2(g*p.miniRvAG);}if(on.kv)c.ag.kv=r2(g*p.miniKvAG);}
 else if(g<=O){c.zone='ueb';
  const BE=F*G+(O/(O-G)-G/(O-G)*F)*(g-G);c.BE=BE;
  if(p.ueOld){ // until Sept 2022: employee pays total on BE minus employer half on actual pay
   for(const x of ['kv','pv','rv','av']){if(!on[x])continue;
    const agAmt=r2(agR[x]*g);let own=r2(tot[x]*BE-agAmt);if(x==='pv')own=r2(own+PVk*BE-(PVred*BE));
    c[x]=Math.max(0,own);c.ag[x]=agAmt;c.base[x]=r2(BE);}
  } else {
   const bAN=(O/(O-G))*(g-G);c.bAN=bAN;
   for(const x of ['kv','pv','rv','av']){if(!on[x])continue;const own=r2(an[x]*bAN);c[x]=x==='pv'?r2(own+PVk*BE):own;c.ag[x]=Math.max(0,r2(tot[x]*BE-own));c.base[x]=r2(bAN);}
  }}
 else{const bk=Math.min(g,p.kvBBG),bp=Math.min(g,p.pvBBG),br=Math.min(g,p.rvBBG);
  if(on.kv){c.kv=r2(KV*bk);c.ag.kv=r2(agR.kv*bk);} if(on.pv){c.pv=r2((PV+PVk)*bp);c.ag.pv=r2(agR.pv*bp);}
  if(on.rv){c.rv=r2(RV*br);c.ag.rv=r2(agR.rv*br);} if(on.av){c.av=r2(AV*br);c.ag.av=r2(agR.av*br);}}
 return c;}
function vspOf(gSV,o,cls,pkvOwn,p){
 const zb=o.zb/100,{PV,PVk}=pvRates(o,p);
 const yr=gSV*12,kvb=Math.min(gSV,p.kvBBG)*12,pvb=Math.min(gSV,p.pvBBG)*12,rvb=Math.min(gSV,p.rvBBG)*12;let v=0;
 if(o.rv)v+=p.rv/2*rvb*p.rvVsp;
 const mind=Math.min(0.12*yr,cls===3?3000:1900);
 if(o.kv)v+=Math.max((p.kvVspFix!=null?p.kvVspFix:(p.kvRed/2+zb*p.zbAN))*kvb+(o.pv?(PV+PVk)*pvb:0),mind);
 else if(pkvOwn>0)v+=Math.max(pkvOwn*12,mind); else v+=mind;
 return Math.ceil(v);}
function zvEof(gTax,gSV,o,cls,pkvOwn,fbYr,p){
 let ded=cls===6?0:p.anp+p.sa; if(cls===2)ded+=p.eb+(p.ebChild?240*Math.max(0,o.kids-1):0);
 return Math.max(0,Math.floor(gTax*12-ded-vspOf(gSV,o,cls,pkvOwn,p)-(fbYr||0)));}
const estOf=(z,cls,p)=>cls===3?2*tariff(z/2,p):(cls>=5?st56(z,p):tariff(z,p));
function soliKist(est,estK,cls,o,f,p){
 const fg=(cls===3?2:1)*p.soliFG,ek=Math.floor(estK*f);
 const s=ek<=fg?0:Math.min(0.055*ek,p.soliMild*(ek-fg));
 const sj=Math.floor(s*100)/100;
 return {soli:Math.floor(sj/12*100)/100,kist:o.ki?Math.floor(ek*o.kiRate/12*100)/100:0};}
function calc(o,p){
 const g=o.g,adv=o.adv;
 const bavTaxLim=p.rvBBG*0.08,bavSvLim=p.rvBBG*0.04;
 const bav=adv.bav?Math.min(adv.bavAmt,g):0,bavTax=Math.min(bav,bavTaxLim),bavSv=Math.min(bav,bavSvLim);
 const gTax=g-bavTax,gSV=g-bavSv;
 const sj=adv.sj?adv.sjg:0,sjMini=sj>0&&sj<=p.mini,sjReg=sj>p.mini;
 const svBase=sjReg?gSV+sj:gSV;
 const S=svCalc(svBase,o,p);
 const c={P:p,S,svBase,g:g+sj,gMain:g,sj,zone:S.zone,kv:S.kv,pv:S.pv,rv:S.rv,av:S.av,ag:{...S.ag},bav,bavAg:0,flat:0,flatAg:0,sjRv:0,sjAgMini:0,bavSv};
 if(bavSv>0&&S.zone!=='mini')c.bavAg=r2(bavSv*0.15);
 c.pkvOwn=0;c.pkvAg=0;
 const pkvCap=r2(p.kvBBG*(p.kvAG+p.zb/100*(1-p.zbAN))+p.pvBBG*p.pv/2);c.pkvCap=pkvCap;
 if(o.priv&&o.pkv>0&&S.zone!=='mini'){c.pkvAg=o.subsidy?r2(Math.min(o.pkv/2,pkvCap)):0;c.pkvOwn=r2(o.pkv-c.pkvAg);}
 let cls=o.cls; if(adv.fac)cls=4;
 let lst=0,soli=0,kist=0,factor=null;
 const cnt={1:0.5,2:1,3:1,4:0.5,5:0,6:0}[cls]*o.kids;
 if(S.zone!=='mini'||sjReg){
  const z=zvEof(gTax,gSV,o,cls,c.pkvOwn,adv.fb?adv.fbAmt*12:0,p);c.zvE=z;
  const est=estOf(z,cls,p);
  const estK=o.kids>0&&cnt>0?estOf(Math.max(0,z-cnt*p.kfb),cls,p):est;
  let f=1;
  if(adv.fac&&adv.sg>0){
   const sp={...o,kv:true,pv:true,rv:true,av:true,priv:false};
   const z2=zvEof(adv.sg,adv.sg,sp,4,0,0,p);
   const X=est+tariff(z2,p),Y=2*tariff((z+z2)/2,p);
   f=X>0?Math.min(1,Math.floor(Y/X*1000)/1000):1;factor=f;}
  lst=Math.floor(Math.floor(est*f)/12*100)/100;c.estYr=Math.floor(est*f);
  const sk=soliKist(est,estK,cls,o,f,p);soli=sk.soli;kist=sk.kist;
 }
 let sjLst=0,sjSoli=0,sjKist=0;
 if(sjReg){const z6=zvEof(sj,sj,o,6,0,0,p),e6=st56(z6,p);sjLst=Math.floor(e6/12*100)/100;const sk=soliKist(e6,e6,6,o,1,p);sjSoli=sk.soli;sjKist=sk.kist;}
 if(sjMini){
  if(o.rv&&!adv.sjrv)c.sjRv=r2(sj*p.miniRvAN);
  c.sjAgMini=r2(sj*p.miniRvAG+(o.kv?sj*p.miniKvAG:0));
  if(adv.sj2)c.flat=r2(sj*p.pauschSt);else c.flatAg=r2(sj*p.pauschSt);}
 c.lst=r2(lst+sjLst+c.flat);c.lstMain=lst;c.sjLst=sjLst;c.soli=r2(soli+sjSoli);c.kist=r2(kist+sjKist);c.factor=factor;c.cls=cls;
 c.tax=r2(c.lst+c.soli+c.kist);
 c.svOnly=r2(c.kv+c.pv+c.rv+c.av+c.sjRv);
 c.sv=r2(c.svOnly+c.pkvOwn);
 c.net=r2(c.g-c.tax-c.sv-c.bav);
 c.agTot=r2(c.ag.kv+c.ag.pv+c.ag.rv+c.ag.av+c.pkvAg+c.bavAg+c.sjAgMini+c.flatAg);
 c.bund=r2(c.lst*0.425+c.soli);c.land=r2(c.lst*0.425);c.gem=r2(c.lst*0.15);
 return c;}

// ---- 2027+ scenarios for the "What's changing" page ----
function variant(base,mods){const p=JSON.parse(JSON.stringify(base));Object.assign(p,mods);p.F=fF(p);return p;}
const CHANGES={
 miniLimit:{mods:{mini:633}},
 kvBBG:{mods:{kvBBG:6375}},
 rvBBG:{mods:{rvBBG:8850}},
 taxReform:{mods:{scale:12348/12564}},
 pvDraft:{mods:{pvK:0.009,pvBBG:6375}},
 flat5:{mods:{pauschSt:0.05}},
 rv20:{mods:{rv:0.20}},
 noSoli:{mods:{soliFG:1e12}},
 miniRvMandatory:{special:'miniRv'}
};
function scenario(keys){let p=P[2026];const m={};for(const k of keys){Object.assign(m,CHANGES[k].mods||{});}return variant(p,m);}


// Average gross earnings (DRV, Anlage 1 SGB VI; 2025/2026 provisional) and consumer price index (Destatis, 2020=100; 2010–2014 rebased from 2010=100; 2026 Jan–Sep estimate)
const WAGE={2010:31144,2011:32100,2012:33002,2013:33659,2014:34514,2015:35363,2016:36187,2017:37077,2018:38212,2019:39301,2020:39167,2021:40463,2022:42053,2023:44732,2024:47085,2025:50493,2026:51944};
const CPI={2010:88.4,2011:90.3,2012:92.0,2013:93.4,2014:94.2,2015:94.5,2016:95.0,2017:96.4,2018:98.1,2019:99.5,2020:100,2021:103.1,2022:110.2,2023:116.7,2024:119.3,2025:121.9,2026:124.4};
window.SalaryEngine={WAGE,CPI,PARAMS:P,YEARS:Object.keys(P).map(Number),calc,tariff,st56,svCalc,r2,variant,scenario,CHANGES};
})();
