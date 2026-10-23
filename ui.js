// Левая панель «Заказы» и окно «План на день»: всё считается из строк таблицы (DATA.items).
(function(){
var items=(window.DATA&&DATA.items)||[];
var STG={q:['Ожидает','#9aa6b1'],w:['На складе','#7b838c'],c:['Отливка','#3f7fd1'],p:['Покраска и монтаж','#e07b1a'],r:['Готово к отгрузке','#3fae5a'],h:['Отгрузка','#2f9e4f'],s:['Отгружено','#1f6f3a']};
function pl(n,w){var a=n%10,b=n%100;return n+' '+(a==1&&b!=11?w[0]:(a>=2&&a<=4&&(b<10||b>=20))?w[1]:w[2])}
function esc(s){return String(s).replace(/[&<>]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;'}[c]})}
// ----- заказы -----
var map={},list=[];
items.forEach(function(i){var o=map[i.order];if(!o){o=map[i.order]={n:i.order,obj:i.obj,its:[]};list.push(o)}if(!o.obj&&i.obj)o.obj=i.obj;o.its.push(i)});
function weight(v){return v==='готово'?1:v==='в работе'?.5:0}
list.forEach(function(o){var c={q:0,wait:0,cast:0,paint:0,ready:0,shipped:0},sh=false,sum=0,cnt=0,b=0,p=0;
  o.its.forEach(function(i){var s=i.stage||stageOf(i);c[s]++;if(i.st.ship==='в работе')sh=true;i.kind==='b'?b++:p++;
    ['walls','base','inner','outer','fin','ship'].forEach(function(k){if(i.st[k]!=='не требуется'){sum+=weight(i.st[k]);cnt++}})});
  o.b=b;o.p=p;o.c=c;o.pr=cnt?Math.round(sum/cnt*100):0;var t=o.its.length;
  o.tag=c.shipped===t?'s':sh?'h':c.cast?'c':(c.paint||c.ready)&&c.ready<t-c.shipped?'p':(c.ready&&c.ready+c.shipped===t)?'r':c.wait?'w':'q';
  o.txt=STG[o.tag][0];
  o.bar=[['s',c.shipped],['r',c.ready],['p',c.paint],['c',c.cast],['w',c.wait],['q',c.q]].filter(function(x){return x[1]})});
list.sort(function(a,b){return(a.tag==='s')-(b.tag==='s')});
$('oc').textContent='· '+list.length;
$('olist').innerHTML=list.length?list.map(function(o,i){var t=o.its.length;
  return'<div class="o" data-i="'+i+'"><div class="r1"><b>'+esc(o.n)+'</b><span class="chip" style="background:'+STG[o.tag][1]+'">'+o.txt+'</span></div><div class="ob">'+esc(o.obj||'')+'</div><div class="sb">'+o.bar.map(function(x){return'<i style="width:'+x[1]/t*100+'%;background:'+STG[x[0]][1]+'"></i>'}).join('')+'</div><div class="r3"><span>'+[o.b?pl(o.b,['здание','здания','зданий']):'',o.p?pl(o.p,['приямок','приямка','приямков']):''].filter(Boolean).join(' · ')+'</span><span>'+o.pr+' %</span></div></div>'}).join(''):'<div class="empty">В таблице нет заказов</div>';
$('lg').innerHTML=['q','w','c','p','r','s'].map(function(k){return'<span><i style="background:'+STG[k][1]+'"></i>'+STG[k][0]+'</span>'}).join('');
function orderCard(o){if(ST.card){ST.card.ms.forEach(function(m){m.material.emissive.setHex(0)});ST.card=null}
  var e=$('card'),done=o.its.filter(function(i){return(i.stage||stageOf(i))==='shipped'}).length;e.style.setProperty('--c',STG[o.tag][1]);e.style.display='block';
  var rows=[['Объект',esc(o.obj||'—')],['Состав',[o.b?pl(o.b,['здание','здания','зданий']):'',o.p?pl(o.p,['приямок','приямка','приямков']):''].filter(Boolean).join(' · ')],['Этап',o.txt],['Отгружено',done+' из '+o.its.length],['Готовность',o.pr+' %']];
  e.innerHTML='<h3><span class="cx">×</span>Заказ '+esc(o.n)+' <span class="demo">'+BADGE+'</span></h3>'+rows.map(function(r){return'<div><span>'+r[0]+'</span><span>'+r[1]+'</span></div>'}).join('')+'<div class="bar"><i style="width:'+o.pr+'%"></i></div>'}
// ----- план на день: операции со статусом «В работе» -----
var OPS=[['ship','Отгрузка','14:45–16:30','#3fae5a'],['walls','Отливка стен','07:45–16:30','#3f7fd1'],['base','Отливка основания','07:45–16:30','#3f7fd1'],['inner','Покраска изнутри','в течение дня','#e07b1a'],['outer','Покраска снаружи','в течение дня','#e07b1a'],['fin','','в течение дня','#e07b1a']];
var rows=[];
list.forEach(function(o){OPS.forEach(function(op){var k=op[0];
  (k==='fin'?['b','p']:[null]).forEach(function(kind){
    var all=o.its.filter(function(i){return!kind||i.kind===kind}),act=all.filter(function(i){return i.st[k]==='в работе'});if(!act.length)return;
    var app=all.filter(function(i){return i.st[k]!=='не требуется'}),dn=app.filter(function(i){return i.st[k]==='готово'}).length;
    var name=k==='fin'?(kind==='b'?'Покрытие крыши':'Монтаж лотков и заземления'):op[1];
    rows.push({n:o.n,op:name,it:act.map(function(i){return i.name}).join(', ')+(k==='ship'?' · трал, кран-балка':''),t:op[2],dn:dn,tot:app.length,c:op[3]})})})});
$('plist').innerHTML=rows.length?rows.map(function(p){var w=p.tot?Math.round(p.dn/p.tot*100):0;
  return'<div class="pr"><div class="t"><span class="nb">'+esc(p.n)+'</span>'+esc(p.op)+'</div><div class="it">'+esc(p.it)+'</div><div class="bar" style="--c:'+p.c+'"><i style="width:'+w+'%"></i></div><div class="m"><span>'+p.t+'</span><span class="chip" style="background:'+p.c+'">В работе · готово '+p.dn+' из '+p.tot+'</span></div></div>'}).join(''):'<div class="empty">На сегодня нет операций со статусом «В работе»</div>';
try{$('pd').textContent=new Intl.DateTimeFormat('ru-RU',{timeZone:CONFIG.TIMEZONE||'Europe/Moscow',weekday:'short',day:'2-digit',month:'2-digit'}).format(new Date()).replace(',',',')}catch(e){}
// ----- показать / скрыть -----
function show(id,on){var el=$(id),b=$(id==='ord'?'bo':'bp');el.style.display=on?'flex':'none';b.classList.toggle('on',on);
  if(on&&MOB){var o=id==='ord'?'plan':'ord';$(o).style.display='none';$(o==='ord'?'bo':'bp').classList.remove('on');closeCard()}}
$('bo').onclick=function(){show('ord',$('ord').style.display==='none')};$('bp').onclick=function(){show('plan',$('plan').style.display==='none')};
$('ox').onclick=function(){show('ord',false)};$('px').onclick=function(){show('plan',false)};
$('olist').onclick=function(e){var r=e.target.closest('.o');if(!r)return;[].forEach.call($('olist').children,function(x){x.classList.toggle('sel',x===r)});orderCard(list[+r.dataset.i]);if(MOB)show('ord',false)};
var sel0=select;select=function(g){sel0(g);if(MOB){$('ord').style.display='none';$('plan').style.display='none';$('bo').classList.remove('on');$('bp').classList.remove('on')}};
if(MOB){$('ord').style.display='none';$('plan').style.display='none'}else{$('bo').classList.add('on');$('bp').classList.add('on')}
// отступ панелей от нижней панели управления
function fit(){document.documentElement.style.setProperty('--ch',($('ctl').offsetHeight+16)+'px')}
fit();addEventListener('resize',fit);if(window.ResizeObserver)new ResizeObserver(fit).observe($('ctl'));
})();
