// Загрузка таблицы «Заказы» из Google Таблицы (или демо-строки, если таблица не подключена).
// Колонки: A Номер заказа | B Объект | C Состав | D Габаритный размер | E Отливка стен | F Отливка основания |
//          G Внутренняя покраска | H Внешняя покраска | I Покрытие крыши | J Монтаж лотков и заземление | K Отгрузка
const DEMO = {demo:true, rebar:[{n:"Ø12",t:1.2,m:5},{n:"Ø16",t:3.9,m:5},{n:"Ø8",t:0.7,m:3},{n:"Ø10",t:2.1,m:4}]};
const NS="Не начато",VR="В работе",GT="Готово",NT="Не требуется";
const DEMO_ROWS=[
 ["7385","2БКТП-1250кВА г. Казань, БКТП-6717, Мицар","Здание 1","5000×2500×3070 мм",VR,NS,NS,NS,NS,NT,NS],
 ["","","Здание 2","5000×2500×3070 мм",NS,NS,NS,NS,NS,NT,NS],
 ["","","Приямок 1","5000×2500×1700 мм",VR,NS,NS,NS,NT,NS,NS],
 ["","","Приямок 2","5000×2500×1700 мм",NS,NS,NS,NS,NT,NS,NS],
 ["7380","БКТП-1000кВА г. Самара","Здание 1","5000×2500×3070 мм",GT,GT,NS,NS,NS,NT,NS],
 ["","","Приямок 1","5000×2500×1700 мм",GT,GT,NS,NS,NT,NS,NS],
 ["7378","КТП-630кВА г. Уфа","Здание 1","5000×2500×3070 мм",GT,GT,GT,VR,NS,NT,NS],
 ["","","Приямок 1","5000×2500×1700 мм",GT,GT,GT,GT,NT,VR,NS],
 ["7370","БКТП-1250кВА г. Пермь","Здание 1","5000×2500×3070 мм",GT,GT,GT,GT,GT,NT,NS],
 ["","","Приямок 1","5000×2500×1700 мм",GT,GT,GT,GT,NT,GT,NS],
 ["7360","КТП-400кВА г. Томск","Здание 1","5000×2500×3070 мм",GT,GT,GT,GT,GT,NT,GT],
 ["","","Приямок 1","5000×2500×1700 мм",GT,GT,GT,GT,NT,GT,GT]];

function norm(s){s=(s||"").trim().toLowerCase();return s==="готово"||s==="в работе"||s==="не требуется"?s:"не начато"}
// Дата готовности (столбец L): «21.10.2026», «1.11.2026» или «2026-10-21» -> число (мс) или null
function parseDue(s){s=(s||"").trim();var m=s.match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})/);if(m)return Date.UTC(+m[3],+m[2]-1,+m[1]);m=s.match(/^(\d{4})-(\d{2})-(\d{2})/);return m?Date.UTC(+m[1],+m[2]-1,+m[3]):null}
function ymd(s){s=(s||"").trim();var m=s.match(/^(\d{4})-(\d{2})-(\d{2})/);if(m)return m[1]+"-"+m[2]+"-"+m[3];m=s.match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})/);return m?m[3]+"-"+("0"+m[2]).slice(-2)+"-"+("0"+m[1]).slice(-2):""}
function todayYMD(){return new Intl.DateTimeFormat("en-CA",{timeZone:(window.CONFIG&&CONFIG.TIMEZONE)||"Europe/Moscow",year:"numeric",month:"2-digit",day:"2-digit"}).format(new Date())}
// История: последний сохранённый день раньше сегодняшнего (строки листа «История»: Дата | Заказ | Объект | Состав | E..K | Дата готовности)
function buildHist(hrows){if(!hrows)return null;var today=todayYMD(),ds={};hrows.forEach(function(r){var x=ymd(r[0]);if(x&&x<today)ds[x]=1});var all=Object.keys(ds).sort(),last=all[all.length-1];
  var rows=last?hrows.filter(function(r){return ymd(r[0])===last}).map(function(r){return[r[1],r[2],r[3],"",r[4],r[5],r[6],r[7],r[8],r[9],r[10],r[11]||""]}):[];
  return{has:true,date:last||null,items:rows.length?buildItems(rows):[]}}
function buildItems(rows){var items=[],ord="",obj="";
  rows.forEach(function(r){if((r[0]||"").trim())ord=r[0].trim();if((r[1]||"").trim())obj=r[1].trim();
    var c=(r[2]||"").trim();if(!c||!ord)return;var kind=/^(здан|блок)/i.test(c)?"b":/^при/i.test(c)?"p":null;if(!kind)return;
    var m=c.match(/\d+/),sh=(kind=="b"?(/^блок/i.test(c)?"Б":"З"):"П")+(m?m[0]:"");
    items.push({order:ord,obj:obj,name:c,label:ord+" "+sh,kind:kind,dims:(r[3]||"").trim(),due:parseDue(r[11]),
      st:{walls:norm(r[4]),base:norm(r[5]),inner:norm(r[6]),outer:norm(r[7]),fin:norm(kind=="b"?r[8]:r[9]),ship:norm(r[10])}})});
  return items}
// Где находится изделие по статусам: queue (в очереди), cast (отливается), wait (на складе, ждёт покраски), paint, ready (готово к отгрузке), shipped
function stageOf(i){var s=i.st;if(s.ship==="готово")return"shipped";
  if(s.walls!=="готово"||s.base!=="готово")return(s.walls==="в работе"||s.base==="в работе")?"cast":"queue";
  var steps=[s.inner,s.outer,s.fin].filter(function(x){return x!=="не требуется"});
  if(steps.every(function(x){return x==="готово"}))return"ready";
  if(steps.every(function(x){return x==="не начато"}))return"wait";
  return"paint"}
function buildPlan(items,hist){var P={slots:{},stb:0,stp:0,prevT:[null,null]};
  var live=items.filter(function(i){i.stage=stageOf(i);return i.stage!=="shipped"});
  // посты основания — по столбцу «Отливка основания», столы стен — по столбцу «Отливка стен»
  var cast=live.filter(function(i){return i.st.base==="в работе"}).slice(0,2);
  var castW=live.filter(function(i){return i.st.walls==="в работе"}).slice(0,2);
  var wait=live.filter(function(i){return i.stage==="wait"}),prev,rest;
  // «Прошлая смена» (переезд в основной цех в 07:45): то, что вчера стояло на постах основания (по листу «История»); если истории нет — первые готовые
  var key=function(i){return i.order+"|"+i.name},pk=null;
  if(hist&&hist.has){pk={};hist.items.forEach(function(h){if(h.st.base==="в работе")pk[key(h)]=1})}
  prev=(pk?wait.filter(function(i){return pk[key(i)]}):wait).slice(0,2);rest=wait.filter(function(i){return prev.indexOf(i)<0});
  cast.forEach(function(i,k){P.slots[11+k]=i});castW.forEach(function(i,k){P.slots[13+k]=i});
  prev.forEach(function(i,k){P.slots[9+k]=i;P.prevT[k]=i.kind});
  var sb=rest.filter(function(i){return i.kind==="b"}).slice(0,4),sp=rest.filter(function(i){return i.kind==="p"}).slice(0,4);
  sb.forEach(function(i,q){P.slots[50+Math.floor(q/2)*2+q%2]=i});
  sp.forEach(function(i,q){P.slots[50+(3+Math.floor(q/2))*2+q%2]=i});
  P.stb=sb.length;P.stp=sp.length;
  var pt=live.filter(function(i){return i.stage==="paint"||i.stage==="ready"}).sort(function(a,b){return(b.stage==="ready")-(a.stage==="ready")});
  pt.filter(function(i){return i.kind==="b"}).slice(0,6).forEach(function(i,q){P.slots[70+q]=i});
  pt.filter(function(i){return i.kind==="p"}).slice(0,6).forEach(function(i,q){P.slots[76+q]=i});
  P.scenario=(cast[0]?cast[0].kind:"-")+(cast[1]?cast[1].kind:"-");P.wscenario=(castW[0]?castW[0].kind:"-")+(castW[1]?castW[1].kind:"-");return P}
function orderFor(n){var it=window.DATA&&window.DATA.plan&&window.DATA.plan.slots[n];return it?it.label:"—"}
function parseCSV(t){var r=[],row=[],f="",q=false;
  for(var i=0;i<t.length;i++){var c=t[i];
    if(q){if(c=='"'){if(t[i+1]=='"'){f+='"';i++}else q=false}else f+=c}
    else if(c=='"')q=true; else if(c==",")(row.push(f),f="");
    else if(c=="\n"){row.push(f);r.push(row);row=[];f=""} else if(c!="\r")f+=c}
  if(f!==""||row.length){row.push(f);r.push(row)} return r}
function mk(rows,demo,warn,hrows){var items=buildItems(rows),h=buildHist(hrows),plan=buildPlan(items,h);
  return{data:{demo:demo,rebar:DEMO.rebar,items:items,plan:plan,scenario:plan.scenario,wscenario:plan.wscenario,hist:h},warn:warn}}
function sheetURL(){var n=Date.now();return "https://docs.google.com/spreadsheets/d/"+CONFIG.SHEET_ID+"/gviz/tq?tqx=out:csv;reqId:"+n+"&sheet="+encodeURIComponent(CONFIG.SHEET_ORDERS)+"&headers=1&_="+n}
// Читает строки таблицы: через Apps Script (если задан API_URL, всегда свежие данные) или через gviz (Google может отдавать кэш)
function fetchRows(){
  if(CONFIG.API_URL){var u=CONFIG.API_URL+(CONFIG.API_URL.indexOf("?")>=0?"&":"?")+"t="+Date.now();
    return fetch(u,{cache:"no-store"}).then(function(r){if(!r.ok)throw new Error("HTTP "+r.status);return r.json()}).then(function(j){if(!j||!j.rows)throw new Error("нет данных в ответе Apps Script");var rows=j.rows.slice(1),hist=j.hist?j.hist.slice(1):undefined;return{raw:JSON.stringify(rows)+"|"+JSON.stringify(hist||[]),rows:rows,hist:hist,src:"Apps Script"}})}
  return fetch(sheetURL(),{cache:"no-store"}).then(function(r){if(!r.ok)throw new Error("HTTP "+r.status);return r.text()}).then(function(t){return{raw:t,rows:parseCSV(t).slice(1),src:"Google"}})}
function fetchRaw(){return fetchRows().then(function(r){return r.raw})}
function loadData(){
  if(!CONFIG.SHEET_ID&&!CONFIG.API_URL)return Promise.resolve(mk(DEMO_ROWS,true));
  return fetchRows().then(function(r){var d=mk(r.rows,false,undefined,r.hist);if(!d.data.items.length)throw new Error("в таблице нет строк с составом («Блок…», «Здание…» или «Приямок…»)");d.raw=r.raw;d.src=r.src;return d})
  .catch(function(e){return mk(DEMO_ROWS,true,"Не удалось прочитать Google Таблицу ("+e.message+"). Показаны демо-данные.")});
}

// Текущее время цеха в минутах от полуночи (для режима «Сейчас»)
var NOWF=new Intl.DateTimeFormat("en-GB",{timeZone:CONFIG.TIMEZONE||"Europe/Moscow",hour:"2-digit",minute:"2-digit",second:"2-digit",hourCycle:"h23"});
function nowMin(){var p=NOWF.formatToParts(new Date()),g=function(t){return +p.find(function(x){return x.type===t}).value};return g("hour")*60+g("minute")+g("second")/60}
