
const dark=matchMedia('(prefers-color-scheme: dark)').matches,$=id=>document.getElementById(id);
const scene=new THREE.Scene();scene.background=new THREE.Color(dark?0x20252b:0xeef1f4);
const cam=new THREE.PerspectiveCamera(35,innerWidth/innerHeight,1,500);
const ren=new THREE.WebGLRenderer({antialias:true});ren.setPixelRatio(Math.min(devicePixelRatio,2));ren.setSize(innerWidth,innerHeight);ren.shadowMap.enabled=true;ren.shadowMap.type=THREE.PCFSoftShadowMap;ren.outputEncoding=THREE.sRGBEncoding;$('cv').appendChild(ren.domElement);
const ctl=new THREE.OrbitControls(cam,ren.domElement);ctl.maxPolarAngle=Math.PI/2.1;
const isoV=()=>{cam.position.set(62,62,84);ctl.target.set(0,0,0);ctl.update()},topV=()=>{cam.position.set(0,125,.01);ctl.target.set(0,0,0);ctl.update()};isoV();$('b1').onclick=isoV;$('b2').onclick=topV;
scene.add(new THREE.HemisphereLight(0xffffff,dark?0x39424b:0xc9d1d9,.85));
const sun=new THREE.DirectionalLight(0xfff4e6,.9);sun.position.set(-30,70,45);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);Object.assign(sun.shadow.camera,{left:-48,right:48,top:48,bottom:-48,near:1,far:200});sun.shadow.bias=-.0004;sun.shadow.normalBias=.04;scene.add(sun);
const X=p=>(p-450)*.09,Z=p=>(p-460)*.09,S=p=>p*.09,M=(c,r=.75,m=0)=>new THREE.MeshStandardMaterial({color:c,roughness:r,metalness:m,emissive:0});
const pick=[],labels=[],ord=n=>orderFor(n),cl=x=>Math.max(0,Math.min(1,x)),sm=x=>{x=cl(x);return x*x*(3-2*x)};
const fmt=m=>String(Math.floor(m/60)).padStart(2,'0')+':'+String(Math.floor(m%60)).padStart(2,'0');
function B(w,h,d,c,x,y,z,g,r,m){const o=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),M(c,r,m));o.position.set(x,y+h/2,z);o.castShadow=o.receiveShadow=true;(g||scene).add(o);return o}
function grp(x,z,ry,d,c,y0){const g=new THREE.Group();g.position.set(x,y0||0,z);g.rotation.y=ry||0;g.ms=[];d.c=c;g.d=d;scene.add(g);return g}
function part(g,geo,c,x,y,z,ry,r,m){const o=new THREE.Mesh(geo,M(c,r,m));o.position.set(x,y,z);o.rotation.y=ry||0;o.castShadow=o.receiveShadow=true;o.userData.g=g;g.add(o);g.ms.push(o);pick.push(o);return o}
const bx=(g,w,h,d,c,x,y,z,r,m)=>part(g,new THREE.BoxGeometry(w,h,d),c,x,y+h/2,z,0,r,m);
function wallGeo(L,H,t,holes){const s=new THREE.Shape();s.moveTo(0,0);s.lineTo(L,0);s.lineTo(L,H);s.lineTo(0,H);s.lineTo(0,0);holes.forEach(h=>{const p=new THREE.Path();p.moveTo(h[0],h[1]);p.lineTo(h[0]+h[2],h[1]);p.lineTo(h[0]+h[2],h[1]+h[3]);p.lineTo(h[0],h[1]+h[3]);p.lineTo(h[0],h[1]);s.holes.push(p)});return new THREE.ExtrudeGeometry(s,{depth:t,bevelEnabled:false})}
function label(t,s,c,x,y,z){const e=document.createElement('div');e.className='lb';e.style.setProperty('--c',c);e.innerHTML='<b></b><span></span>';document.body.appendChild(e);const l={e,b:e.firstChild,s:e.lastChild,v:new THREE.Vector3(x,y,z)};l.b.textContent=t;l.s.textContent=s;labels.push(l);return l}

// пол, стены, колонны, краны
const fl=new THREE.Mesh(new THREE.PlaneGeometry(72,72),M(dark?0x313840:0xe6e9ec,.9));fl.rotation.x=-Math.PI/2;fl.receiveShadow=true;scene.add(fl);
const gr=new THREE.GridHelper(72,36,dark?0x3b434b:0xd2d7dc,dark?0x3b434b:0xd8dde1);gr.position.y=.01;scene.add(gr);
B(72.6,6,.3,0xffffff,0,0,-36.15,0,.95);B(.3,6,72.6,0xffffff,-36.15,0,0,0,.95);
[[72.6,.3,0,36.15],[.3,72.6,36.15,0]].forEach(a=>{const w=B(a[0],6,a[1],0xdfe6ec,a[2],0,a[3],0,.3);w.material.transparent=true;w.material.opacity=.28;w.castShadow=false});
(()=>{const gz=Z(560),pz=X(453);B(.3,6,gz-3+36,0xffffff,pz,0,(-36+gz-3)/2,0,.95);B(.3,6,36-(gz+3),0xffffff,pz,0,(gz+3+36)/2,0,.95);B(.3,1.4,6,0xffffff,pz,4.6,gz,0,.95)})();
[-28,-14,0,14,28].forEach(x=>B(5,1.6,.06,0xa8c0d4,x,2.6,-35.97,0,.2,.1));
for(let p=55;p<=845;p+=66)[65,855].forEach(y=>B(.5,6,.5,0x4ba66a,X(p),0,Z(y)));for(let p=130;p<=790;p+=66)[55,845].forEach(x=>B(.5,6,.5,0x4ba66a,X(x),0,Z(p)));
// рельсы переноса по полу
function rail(x1,z1,x2,z2){const dx=x2-x1,dz=z2-z1,L=Math.hypot(dx,dz),g=new THREE.Group();g.position.set((x1+x2)/2,0,(z1+z2)/2);g.rotation.y=Math.atan2(dx,dz);scene.add(g);
  [-.6,.6].forEach(o=>B(.1,.08,L,0x7b838c,o,.12,0,g,.3,.8));for(let s=-L/2+.5;s<L/2;s+=1){const q=B(1.6,.1,.18,0x8a7a68,0,.02,s,g,.9);q.castShadow=false}}
// 1) отлитые стены: столы -> посты основания
[255,340,425,565,650,735].forEach(py=>rail(X(215),Z(py),X(275),Z(py)));rail(X(275),Z(235),X(275),Z(765));rail(X(275),Z(420),X(300),Z(420));rail(X(275),Z(577),X(300),Z(577));
// 2) готовые блоки: посты основания -> проём в перегородке -> основной склад
rail(X(350),Z(420),X(432),Z(420));rail(X(350),Z(577),X(432),Z(577));rail(X(432),Z(420),X(432),Z(577));rail(X(432),Z(560),X(548),Z(560));rail(X(548),Z(120),X(548),Z(600));
// кран-балка основного цеха
const crane=(()=>{const x1=X(458),x2=X(838),zA=Z(75),zB=Z(845),H=5.6,g=new THREE.Group();scene.add(g);[x1,x2].forEach(x=>B(.3,.3,zB-zA,0xf2c500,x,H-.15,(zA+zB)/2));g.position.set(0,0,Z(300));
  B(x2-x1,.5,.6,0xe07b1a,(x1+x2)/2,H,0,g);[x1,x2].forEach(x=>B(.8,.5,1.6,0x3b3f44,x,H,0,g));const tr=new THREE.Group();tr.position.set((x1+x2)/2,H,0);g.add(tr);B(1.4,.5,1.2,0x3b3f44,0,-.1,0,tr);const rp=B(.06,3.6,.06,0x222222,0,-4.2,0,tr),hk=B(.5,.4,.5,0xf2c500,0,-4.6,0,tr);
  return{g,tr,rp,hk,update(){}}})();
label('Кран-балка','мост 34 м, ход вдоль цеха по рельсам','#e07b1a',X(650),7,Z(120));label('Рельсы: стены → основание','тележка с отлитыми стенами','#7b838c',X(275),1.4,Z(200));label('Рельсы: блоки → склад','через проём в перегородке','#7b838c',X(500),1.4,Z(560));
label('Отливочный цех','слева от перегородки','#e8b32a',X(420),7,Z(60));label('Основной цех','справа от перегородки','#e07b1a',X(490),7,Z(60));

// 1. стойки арматуры
const rebar=DATA.rebar.slice(0,4);
rebar.forEach((r,i)=>{const f=r.t/r.m,py=[473,512,580,640][i],d={t:'Стойка арматуры №'+(i+1),r:[['Арматура',r.n+' мм'],['Остаток',String(r.t).replace('.',',')+' т из '+r.m+',0 т'],['Заполнено',Math.round(f*100)+' %'],['Состояние',f<.25?'Мало — заказать':'Норма']],p:Math.round(f*100)},g=grp(X(100),Z(py),0,d,f<.25?'#d9453b':f<.5?'#e8b32a':'#3fae5a');
 [-2,2].forEach(a=>[-.6,.6].forEach(b=>bx(g,.12,2.6,.12,0x2f62b0,a,0,b)));[0,1,2].forEach(k=>[-.6,.6].forEach(b=>bx(g,4.2,.1,.1,0xe07b1a,0,.6+k*.9,b)));
 [6,5,4].forEach((n,k)=>{for(let j=0;j<Math.ceil(f*n);j++){const c=part(g,new THREE.CylinderGeometry(.07,.07,3.8,10),0x8a96a3,0,.77+k*.9,-.45+j*.15,0,.4,.6);c.rotation.z=Math.PI/2}})});
const minR=Math.min(...rebar.map(r=>Math.round(r.t/r.m*100)));
label('Склад арматуры','мин. остаток '+minR+' %','#d9453b',X(100),3.4,Z(425));

// здание 5000×2500×3070 и приямок 5000×2500×1700
function building(x,z,rot,d,y0,painted){const L=5,W=2.5,H=2.92,t=.14,g=grp(x,z,rot,d,painted?'#e07b1a':'#9aa0a6',y0),O=painted?0xf0a35a:0xbdbab4,DR=painted?0xd98f45:0xa5a29c,wn=[[.29,1.73,1.17,.81],[.29,.47,1.17,.77]];
 bx(g,L,.15,W,0x9c9c9c,0,0,0);[-W/2,W/2-t].forEach(zz=>{part(g,wallGeo(L,H,t,wn.concat([[3.27,.05,1.08,2.67]])),O,-L/2,0,zz,0,.8);wn.forEach(h=>bx(g,h[2]-.06,h[3]-.06,.04,0x59616a,-L/2+h[0]+h[2]/2,h[1],zz+t/2,.5,.5));bx(g,1,2.6,.05,DR,-L/2+3.81,.05,zz+t/2)});
 part(g,wallGeo(W,H,t,[]),O,L/2,0,-W/2,-Math.PI/2,.8);part(g,wallGeo(W,H,t,[]),O,-L/2+t,0,-W/2,-Math.PI/2,.8);bx(g,.05,2.5,2.04,DR,L/2+.02,.15,0);[-.5,.5].forEach(zz=>[1.5,2.2].forEach(y=>bx(g,.07,.7,.8,0x59616a,L/2+.05,y-.35,zz)));bx(g,L+.2,.15,W+.2,painted?0xe8a85a:0xa9a6a0,0,H,0);return g}
function pit(x,z,rot,d,y0,painted){const L=5,W=2.5,H=1.7,t=.15,g=grp(x,z,rot,d,painted?'#222':'#9aa0a6',y0),D=painted?0x1f1f1f:0xaaa8a2,hl=[.35,1.55,2.75,3.95].map(a=>[a,.22,.85,.55]);
 [-W/2,W/2-t].forEach(zz=>part(g,wallGeo(L,H,t,hl),D,-L/2,0,zz,0,.7));part(g,wallGeo(W,H,t,[[.33,.22,.75,.55],[1.42,.22,.75,.55]]),D,L/2,0,-W/2,-Math.PI/2,.7);part(g,wallGeo(W,H,t,[]),D,-L/2+t,0,-W/2,-Math.PI/2,.7);
 bx(g,L-2*t,.08,W-2*t,0xf2f2f2,0,.06,0);[-1,1].forEach(s=>{bx(g,L-2*t,H-.2,.02,0xf2f2f2,0,.1,s*(W/2-t-.01));bx(g,.02,H-.2,W-2*t,0xf2f2f2,s*(L/2-t-.01),.1,0)});return g}
const BD=(n,e)=>({t:e[0],r:[['Заказ',ord(n)],['Габариты','5000×2500×3070 мм'],...e[1]]}),PD=(n,e)=>({t:e[0],r:[['Заказ',ord(n)],['Габариты','5000×2500×1700 мм'],...e[1]]});

// 4. сборка и пол


[[420,20,1],[577,40,0]].forEach(([py,n,b])=>{B(S(48),.5,S(88),0x6b747d,X(326),0,Z(py),0,.5,.4);(window.POSTG=window.POSTG||{})[b?'b':'p']=(b?building:pit)(X(326),Z(py),Math.PI/2,(b?BD:PD)(n+5,[b?'Здание (на посту сборки)':'Приямок (на посту сборки)',[['Этап','Сборка контура, отливка пола']]]),.5,false)});
label('Столы отливки основания','пост здания · пост приямка','#9aa0a6',X(326),4.6,Z(500));
// столы крыш
[].forEach((py,i)=>{const d={t:'Стол крыши №'+(i+1),r:[['Заказ',ord(11+i)],['Габариты','5000×2500×200 мм'],['Статус',i?'Свободен':'Идёт отливка']]},g=grp(X(315),Z(py),0,d,'#8c96a0');bx(g,2.7,.5,5.9,0xb7bec6,0,0,0,.5,.3)});
// 5. хранение, 6. покраска
[134,205,276,347,418,489].forEach((py,i)=>[-14,14].forEach((o,j)=>{const isB=i<3,full=isB?i<2:(i>2&&i<5),x=X(502),z=Z(py+o);const sl=B(5.1,.02,2.6,0xf2c500,x,0,z);sl.castShadow=false;const inn=B(4.9,.03,2.4,dark?0x313840:0xe6e9ec,x,0,z);inn.castShadow=false;
  if(full){const n=50+i*2+j,dt=DATA.plan.slots[n];(window.STG=window.STG||[]).push({i,j,n,isB,x,z,data:dt,co:j==0?callout('','',isB?'#e07b1a':'#222',x,isB?3.6:2.2,Z(py),1):null,g:(isB?building:pit)(x,z,0,(isB?BD:PD)(n,[isB?'Здание на хранении':'Приямок на хранении',[['Этап','Хранение'],['Объект',dt?dt.name+' · '+dt.obj:'—']]]),0,false)})}}));
label('Основной склад блоков','Здания 4 из 6 · приямки 4 из 6 (мест 6 + 6)','#9aa0a6',X(502),4.6,Z(95));
[203,274,345,416,487,558].forEach((py,i)=>[-14,14].forEach((o,j)=>{const p=i>=3,st=p?['Внутри','Снаружи','Заземление','Кабельные полки']:['Внутри','Снаружи','Крыша'],k=(i+j)%st.length,e=[p?'Приямок (покраска)':'Здание (покраска)',[['Идёт',st[k]],['Готово шагов',k+' из '+st.length]]];(window.PZ=window.PZ||[]).push({kind:p?'p':'b',row:i,j,g:(p?pit:building)(X(603),Z(py+o),0,(p?PD:BD)(70+i*2+j,e),0,false)})}));
label('Покраска','6 зданий · 6 приямков','#e07b1a',X(603),4.6,Z(160));



// ---- 2. столы стен: смена 07:00–17:00 ----
const tabs=[],ST={m:420,play:true,spd:10,last:performance.now(),ui:0,card:null},WET=new THREE.Color(0x5e6063),DRY=new THREE.Color(0xbfc0c0);
const T=[['Длинная стена',1],['Длинная стена',1],['2 короткие стены',1],['Длинная стена',2],['Длинная стена',2],['2 короткие стены',2]];
function phase(i,m){const a=600+(5-i)*20;return{a,b:a+20,p1:cl((m-420)/180),p2:cl((m-a)/20),p3:cl((m-720)/300)}}
function opOf(i,m){const ph=phase(i,m);return m<600?['Обвязка арматуры',ph.p1,'#e8b32a']:m<ph.a?['Ждёт бетон',1,'#e8b32a']:m<ph.b?['Заливка бетона',ph.p2,'#4a90d9']:m<1020?['Набор прочности',ph.p3,'#3fae5a']:['Готово',1,'#3fae5a']}
const dimOf=t=>t[0][0]=='Д'?'5000×2920×150 мм':'2×(2500×2920×150 мм)';
function tableRows(i,t,d){const m=ST.m,[op,pr]=opOf(i,m);d.p=Math.round(pr*100);return[['Заказ',ord(10+t[1])],['Отливается',t[0]],['Габариты',t[0][0]=='Д'?'5000×2920×150 мм':'2500×2920×150 мм (×2)'],['Время',fmt(m)],['Операция',op],['Прогресс',d.p+' %']]}
function mkWorker(){const g=new THREE.Group(),P=(geo,c,y)=>{const m=new THREE.Mesh(geo,M(c));m.position.y=y;m.castShadow=true;g.add(m)};P(new THREE.CylinderGeometry(.18,.18,.5,8),0x2f3a4a,.25);P(new THREE.CylinderGeometry(.22,.22,.95,10),0xff7a00,.95);P(new THREE.SphereGeometry(.17,10,8),0xf0c8a0,1.62);P(new THREE.SphereGeometry(.19,10,8,0,Math.PI*2,0,Math.PI/2),0xffd400,1.66);scene.add(g);return g}
[].forEach((py,i)=>{const t=T[i],short=t[0][0]!='Д',cx=X(200),cz=Z(py),d={t:'Стол стен №'+(i+1),p:0},g=grp(cx,cz,0,d,'#e8b32a');d.r=()=>tableRows(i,t,d);
 bx(g,2.7,.5,5.85,0x8d98a3,0,0,0,.45,.35);bx(g,2.9,.1,6.05,0x5b646d,0,0,0,.6,.3);
 const o={i,cx,cz,d,slabs:[],w:[mkWorker(),mkWorker()],lb:label('','','#e8b32a',cx,1.8,cz)};
 (short?[-1.45,1.45]:[0]).forEach(zo=>{const L=short?2.5:5,s={zo,rebar:[]};[-1,1].forEach(k=>{B(.08,.3,L+.16,0x4a5057,k*1.29,.5,zo,g);B(2.66,.3,.08,0x4a5057,0,.5,zo+k*(L/2+.04),g)});
  for(let a=-1.1;a<=1.11;a+=.22){const r=B(.03,.03,L-.1,0x2b2b2b,a,.55,zo,g);r.castShadow=false;r.visible=false;s.rebar.push(r)}
  for(let c=-L/2+.15;c<=L/2-.14;c+=.3){const r=B(2.4,.03,.03,0x2b2b2b,0,.58,zo+c,g);r.castShadow=false;r.visible=false;s.rebar.push(r)}
  s.conc=B(2.5,.22,L,0x5e6063,0,.5,zo,g,.9);s.conc.visible=false;o.slabs.push(s)});tabs.push(o)});
label('6 столов стен','8 стен за день: 4 длинные + 2×2 короткие','#e8b32a',X(200),3.4,Z(215));
// бетономешалка
const truck=new THREE.Group(),tp=(geo,c,x,y,z)=>{const m=new THREE.Mesh(geo,M(c,.6));m.position.set(x,y,z);m.castShadow=true;truck.add(m);return m};
tp(new THREE.BoxGeometry(2.2,.5,6),0x3b3f44,0,.9,0);tp(new THREE.BoxGeometry(2.2,1.8,1.6),0xe8e8e8,0,1.9,-2.2);tp(new THREE.BoxGeometry(3.4,.25,.4),0x8a8f95,2.8,1.6,2).rotation.z=-.15;
[[-1,-2.2],[1,-2.2],[-1,1.4],[1,1.4],[-1,2.4],[1,2.4]].forEach(w=>{tp(new THREE.CylinderGeometry(.5,.5,.35,12),0x111111,w[0]*1.1,.5,w[1]).rotation.z=Math.PI/2});
const gd=new THREE.CylinderGeometry(.95,.95,3.6,16);gd.rotateX(Math.PI/2);const drum=tp(gd,0xdfe2e5,0,2.2,.8),stripe=new THREE.Mesh(new THREE.BoxGeometry(.3,.3,3.4),M(0xe07b1a));stripe.position.y=.95;drum.add(stripe);
const stream=new THREE.Mesh(new THREE.BoxGeometry(.12,.7,.12),M(0x6f7275));stream.position.set(4.3,1,2);truck.add(stream);truck.visible=false;scene.add(truck);
let stops=null;const getStops=()=>stops||(stops=(()=>{const s=[];[5,4,3,2,1,0].forEach((i,k)=>{const o=tabs[i],n=o.slabs.length;o.slabs.forEach((q,j)=>s.push({a:600+k*20+j*20/n,b:600+k*20+(j+1)*20/n,z:o.cz+q.zo-2}))});return s})());
function truckZ(m){const s=getStops(),ZO=Z(900),f=s[0],l=s[s.length-1];if(m<590||m>=732)return null;if(m<f.a)return ZO+(f.z-ZO)*sm((m-590)/(f.a-590));
 for(let k=0;k<s.length;k++){const t=s[k],d=t.b-t.a;if(m>=t.b)continue;if(k>0&&m<t.a+.2*d)return s[k-1].z+(t.z-s[k-1].z)*sm((m-t.a)/(.2*d));return t.z}return l.z+(ZO-l.z)*sm((m-l.b)/12)}
function applySim(m,dt){tabs.forEach(o=>{const ph=phase(o.i,m),n=o.slabs.length;
  o.slabs.forEach((s,j)=>{const pj=n==1?ph.p2:cl(ph.p2*n-j),nv=Math.ceil(ph.p1*s.rebar.length-1e-6),hh=Math.max(.02,pj);s.rebar.forEach((r,k)=>r.visible=k<nv);s.conc.visible=pj>0;s.conc.scale.y=hh;s.conc.position.y=.5+.11*hh;s.conc.material.color.copy(WET).lerp(DRY,ph.p3)});
  const act=m>=420&&m<ph.b,tie=m<600,pour=m>=ph.a&&m<ph.b;
  o.w.forEach((w,wi)=>{w.visible=act;if(!act)return;const side=wi?1:-1,z=(tie||pour)?Math.sin(m*(tie?.12:.35)+o.i*1.3+wi*3)*2.2:(wi?-1:1)*1.2;w.position.set(o.cx+side*1.95,0,o.cz+z);w.scale.y=tie?.65:1})});
 const tz=truckZ(m);truck.visible=tz!==null;if(tz!==null){truck.position.set(tabs[0].cx-4.6,0,tz);const pn=m>=600&&m<720;stream.visible=pn;drum.rotation.z+=dt*(pn?2.5:1.2)}}

// показатели, карточка, управление
const K=[['На постах основания','1 здание · 1 приямок'],['На складе','4 здания · 4 приямка'],['На покраске','6 зданий · 6 приямков']];
function kpi(w,stage,clk){const KK=[['Время',clk],['На столах',stage],['Стен залито',w+' из '+(window.WTOT||8)],['Мин. остаток арматуры',minR+' %']].concat(K);$('top').innerHTML='<span class="demo">'+BADGE+'</span>'+KK.map(k=>'<div class="k"><b>'+k[1]+'</b><span>'+k[0]+'</span></div>').join('')}
function renderCard(){const g=ST.card;if(!g)return;const d=g.d,rows=typeof d.r=='function'?d.r():d.r;$('card').style.setProperty('--c',d.c);$('card').innerHTML='<h3>'+d.t+' <span class="demo">'+BADGE+'</span></h3>'+rows.map(r=>'<div><span>'+r[0]+'</span><span>'+r[1]+'</span></div>').join('')+(d.p?'<div class="bar"><i style="width:'+d.p+'%"></i></div>':'')}
function select(g){if(ST.card)ST.card.ms.forEach(m=>m.material.emissive.setHex(0));ST.card=g;g.ms.forEach(m=>m.material.emissive.setHex(0x2a2a2a));renderCard()}
const ray=new THREE.Raycaster(),mv=new THREE.Vector2();let dn;
ren.domElement.onpointerdown=e=>dn=[e.clientX,e.clientY];
ren.domElement.onpointerup=e=>{if(!dn||Math.hypot(e.clientX-dn[0],e.clientY-dn[1])>5)return;mv.set(e.clientX/innerWidth*2-1,-e.clientY/innerHeight*2+1);ray.setFromCamera(mv,cam);const h=ray.intersectObjects(pick,false)[0];if(h)select(h.object.userData.g)};
$('sl').oninput=e=>{ST.m=+e.target.value};$('sp').onchange=e=>{ST.spd=+e.target.value};$('pl').onclick=e=>{ST.play=!ST.play;e.target.textContent=ST.play?'⏸':'▶'};
function stepSim(){const n=performance.now(),dt=Math.min(.1,(n-ST.last)/1000);ST.last=n;if(ST.play){ST.m+=dt*ST.spd;if(ST.m>1020)ST.m=420}applySim(ST.m,dt);ST.ui+=dt;
 if(ST.ui>.2){ST.ui=0;const m=ST.m;$('sl').value=m;let w=0;tabs.forEach(o=>{if(m>=phase(o.i,m).b)w+=o.slabs.length==2?2:1;const[op,pr,c]=opOf(o.i,m);o.lb.b.textContent='Стол №'+(o.i+1)+' · '+op+' '+Math.round(pr*100)+' %';o.lb.s.textContent=ord(10+T[o.i][1])+' · '+dimOf(T[o.i]);o.lb.e.style.setProperty('--c',c)});
  kpi(w,m<600?'Обвязка':m<720?'Заливка':m<1020?'Сушка':'Готово',fmt(m));renderCard()}}
// ===== график отливочного цеха: 07:45 перенос, 09:30 армирование, 12:00 обед, 13:00 бетон, 14:30 обогрев ===== 
const TB=[],TS=[],POUR=[],vv=(x,y,z)=>new THREE.Vector3(x,y,z),qz=a=>new THREE.Quaternion().setFromAxisAngle(vv(0,0,1),a),qy=a=>new THREE.Quaternion().setFromAxisAngle(vv(0,1,0),a),HEAT=new THREE.Color(0xff6a00),HC=new THREE.Color(0x6b747d);
const PA={x:X(326),z:Z(420),H:2.92},PB={x:X(326),z:Z(577),H:1.7};
function addRebar(g,s,L,w,x0,z0,y){for(let a=-w/2+.1;a<=w/2-.09;a+=.22){const r=B(.03,.03,L-.1,0x2b2b2b,a+x0,y,z0,g);r.castShadow=false;r.visible=false;s.rebar.push(r)}for(let c=-L/2+.15;c<=L/2-.14;c+=.3){const r=B(w-.1,.03,.03,0x2b2b2b,x0,y+.03,z0+c,g);r.castShadow=false;r.visible=false;s.rebar.push(r)}}
function addCure(g,s,L,w,x0,z0){s.conc=B(w,.22,L,0x5e6063,x0,.5,z0,g,.9);s.conc.visible=false;s.heat=B(.06,.06,L,0x6b747d,x0+w/2+.13,.4,z0,g)}
function mkSt(kind,i,cx,cz,short,d){const g=grp(cx,cz,0,d,'#e8b32a'),tl=new THREE.Group();tl.position.set(1.25,.5,0);g.add(tl);const mt=o=>{tl.add(o);o.position.x-=1.25;o.position.y-=.5;return o};
  mt(bx(g,2.7,.5,5.85,0x8d98a3,0,0,0,.45,.35));mt(bx(g,2.9,.1,6.05,0x5b646d,0,0,0,.6,.3));const rc={kind,i,cx,cz,g,tl,d,short,slabs:[],w:[mkWorker(),mkWorker()]};
  (short?[-1.45,1.45]:[0]).forEach(zo=>{const L=short?2.5:5,s={zo,L,cx,cz,rebar:[],rc};[-1,1].forEach(k=>{B(.08,.3,L+.16,0x4a5057,k*1.29-1.25,0,zo,tl);B(2.66,.3,.08,0x4a5057,-1.25,0,zo+k*(L/2+.04),tl)});addRebar(g,s,L,2.5,0,zo,.55);addCure(g,s,L,2.5,0,zo);rc.slabs.push(s)});return rc}
function mkPost(P,d,roof){const g=grp(P.x,P.z,0,d,'#6b747d');bx(g,3.6,.04,6.5,0x6b747d,0,.5,0,.5,.4);const fl={zo:0,L:4.7,cx:P.x,cz:P.z,rebar:[]};addRebar(g,fl,4.7,2.3,0,0,.56);addCure(g,fl,4.7,2.3,0,0);fl.heat.position.x=1.95;
  const rc={kind:'post',i:9,cx:P.x,cz:P.z,g,d,roof,slabs:[fl],w:[mkWorker(),mkWorker()]};fl.rc=rc;TB.push(rc);return rc}
const rcPA=mkPost(PA,{t:'Пост основания: здание',p:0},true),rcPB=mkPost(PB,{t:'Пост основания: приямок',p:0},false);
rcPA.ord=ord(11);rcPA.what='Основание здания';rcPA.dim='5000×2500×3070 мм';rcPB.ord=ord(12);rcPB.what='Основание приямка';rcPB.dim='5000×2500×1700 мм';
[255,340,425,565,650,735].forEach((py,i)=>{const pit=i>2,sh=i%3==2,rc=mkSt('wall',i,X(200),Z(py),sh,{t:'Стол стен №'+(i+1),p:0}),P=pit?PB:PA;rc.ord=ord(pit?12:11);rc.what=sh?'2 короткие стены':'Длинная стена';rc.dim=(sh?'2500':'5000')+'×'+(pit?'1700':'2920')+'×150 мм'+(sh?' (×2)':'');TB.push(rc);
  rc.stack=B(1.4,.8,4.2,0x555b61,rc.cx+2.4,0,rc.cz);
  rc.slabs.forEach((s,j)=>{const m=new THREE.Mesh(new THREE.BoxGeometry(2.5,.22,s.L),M(0xbfc0c0,.9));m.castShadow=m.receiveShadow=true;scene.add(m);const e=sh?[vv(P.x,.5+P.H/2,P.z+(j?1:-1)*2.425),qy(Math.PI/2).multiply(qz(Math.PI/2))]:[vv(P.x+(i%3==0?-1:1)*1.175,.5+P.H/2,P.z),qz(Math.PI/2)];TS.push({m,rc,s,piv:vv(rc.cx+1.25,.5,rc.cz+s.zo),p1:e[0],q1:e[1],sx:P.H/2.5,roof:false})})});
const rr=mkSt('roof',0,X(315),Z(312),false,{t:'Стол крыши №1',p:0});rr.ord=ord(11);rr.what='Крыша здания';rr.dim='5000×2500×200 мм';TB.push(rr);
{const m=new THREE.Mesh(new THREE.BoxGeometry(2.5,.22,5),M(0xbfc0c0,.9));m.castShadow=m.receiveShadow=true;scene.add(m);TS.push({m,rc:rr,s:rr.slabs[0],roof:true,p1:vv(PA.x,.5+2.92+.11,PA.z)})}
const r2=mkSt('roof',1,X(315),Z(662),false,{t:'Стол крыши №2',p:0});r2.ord=ord(12);r2.what='Крыша здания';r2.dim='5000×2500×200 мм';TB.push(r2);
{const m=new THREE.Mesh(new THREE.BoxGeometry(2.5,.22,5),M(0xbfc0c0,.9));m.castShadow=m.receiveShadow=true;scene.add(m);TS.push({m,rc:r2,s:r2.slabs[0],roof:true,p1:vv(PB.x,.5+2.92+.11,PB.z)})}
const WT=TB.filter(r=>r.kind=='wall');
[rcPB.slabs[0],rcPA.slabs[0],rr.slabs[0],...WT[0].slabs,...WT[1].slabs,...WT[2].slabs,...WT[3].slabs,...WT[4].slabs,...WT[5].slabs].forEach((o,k)=>{const a=780+k*90/11,b=a+90/11,r=o.rc;POUR.push({o,a,b,p0:k?a+.45*(b-a):a,x:o.cx-4.6,z:o.cz+o.zo-2});r.pa=Math.min(r.pa==null?1e9:r.pa,a);r.pb=Math.max(r.pb==null?0:r.pb,b)});
TB.forEach(rc=>{rc.d.r=()=>stRows(rc,rc.d)});
function opText(r,m){const a=r.pa,b=r.pb,w=r.kind=='post',rf=r.kind=='roof';if(!r.on)return[rf?'Крыша не нужна (приямок или нет заказа)':'Нет заказа, не задействован',0];
  if(m<465)return[w?'Готовый блок, ждёт смены':rf?'Готовая крыша, ждёт смены':'Готовая стена, ждёт смены',1];
  if(m<510)return[w?'Блок уходит в основной цех':rf?'Крыша ждёт переноса':'Подъём стола, стена уходит на перенос',cl((m-465)/45)];
  if(m<555)return[w?'Приём стен, сборка контура'+(r.roof?' и крыши':''):rf?'Перенос крыши на здание':'Стол опущен, свободен',cl((m-510)/45)];
  if(m<570)return['Ждёт армирования',1];if(m<720)return['Армирование'+(w?' основания':''),cl((m-570)/150)];if(m<780)return['Обед',1];if(m<a)return['Арматура готова, ждёт бетон',1];if(m<b)return['Заливка бетона',cl((m-a)/(b-a))];return['Обогрев, набор прочности',cl((m-870)/150)]}
function stRows(r,d){const m=ST.m,o=opText(r,m);d.p=Math.round(o[1]*100);return[['Заказ',r.ord],['Изделие',r.what],['Габариты',r.dim],['Время',fmt(m)],['Операция',o[0]],['Прогресс',d.p+' %']]}
function along(p,q,u){if(Math.abs(p.x-q.x)<5)return{x:p.x+(q.x-p.x)*u,z:p.z+(q.z-p.z)*u};const A=Math.abs(p.z+24),Bb=Math.abs(q.x-p.x),C=Math.abs(q.z+24),T2=A+Bb+C;let d=u*T2;if(d<A)return{x:p.x,z:p.z+(-24-p.z)*d/A};d-=A;if(d<Bb)return{x:p.x+(q.x-p.x)*d/Bb,z:-24};d-=Bb;return{x:q.x,z:-24+(q.z+24)*d/C}}
function truckPose(m){const s=POUR,f=s[0],l=s[s.length-1],ZO=Z(900);if(m<765||m>=885||!s.length)return null;if(m<f.a)return{x:f.x,z:ZO+(f.z-ZO)*sm((m-765)/(f.a-765))};
  for(let k=0;k<s.length;k++){const t=s[k];if(m>=t.b)continue;const d=t.b-t.a;if(k>0&&m<t.a+.45*d)return along(s[k-1],t,sm((m-t.a)/(.45*d)));return{x:t.x,z:t.z}}return{x:l.x,z:l.z+(ZO-l.z)*sm((m-l.b)/15)}}
function placeWall(p,m){const me=p.m;if(p.roof){const t=sm((m-525)/30);me.position.set(p.rc.cx,.61,p.rc.cz).lerp(p.p1,t);me.position.y+=3*Math.sin(Math.PI*t);me.quaternion.identity();return}
  const th=m<480?1.31*sm((m-465)/15):1.31,q0=qz(-th),p0=vv(-1.25,.11,0).applyQuaternion(q0).add(p.piv);if(m<480){me.quaternion.copy(q0);me.position.copy(p0);me.scale.x=1;return}
  const t=sm((m-480)/45);me.quaternion.copy(q0).slerp(p.q1,t);me.position.copy(p0).lerp(p.p1,t);me.scale.x=1+(p.sx-1)*t}
const PTH=[[[X(326),Z(420)],[X(432),Z(420)],[X(432),Z(560)],[X(548),Z(560)],[X(548),Z(262)],[X(502),Z(262)]],[[X(326),Z(577)],[X(432),Z(577)],[X(432),Z(560)],[X(548),Z(560)],[X(548),Z(475)],[X(502),Z(475)]]];
function placeBlock(g,pts,m){if(!g)return;const u=sm((m-465)/45),ls=[];let L=0;for(let k=1;k<pts.length;k++){const l=Math.hypot(pts[k][0]-pts[k-1][0],pts[k][1]-pts[k-1][1]);ls.push(l);L+=l}let d=u*L,k=0;while(k<ls.length-1&&d>ls[k]){d-=ls[k];k++}const t=ls[k]?d/ls[k]:0,a=pts[k],b=pts[k+1];g.position.set(a[0]+(b[0]-a[0])*t,.5*(1-cl(u*10)),a[1]+(b[1]-a[1])*t);g.rotation.y=Math.PI/2*(1-sm((u-.3)/.3))}
function applySim(m,dt){const th=m<465?0:m<480?1.31*sm((m-465)/15):m<485?1.31:m<500?1.31*(1-sm((m-485)/15)):0,p3=cl((m-870)/150),r=cl((m-570)/150),ht=cl((m-870)/20);
  POUR.forEach(it=>{const o=it.o,pj=cl((m-it.p0)/(it.b-it.p0)),nv=Math.ceil(r*o.rebar.length-1e-6),hh=Math.max(.02,pj);o.rebar.forEach((q,k)=>q.visible=k<nv);o.conc.visible=pj>0;o.conc.scale.y=hh;o.conc.position.y=.5+.11*hh;o.conc.material.color.copy(WET).lerp(DRY,p3);o.conc.material.emissive.setRGB(.3*ht,.1*ht,0);o.heat.material.color.copy(HC).lerp(HEAT,ht)});
  TS.forEach(p=>placeWall(p,m));placeBlock(window.POSTG.b,PTH[0],m);placeBlock(window.POSTG.p,PTH[1],m);
  const sf=m<570?1:m<720?1-cl((m-570)/150):m<870?0:cl((m-870)/120);
  TB.forEach(rc=>{if(rc.kind=='wall'){rc.tl.rotation.z=-th;const f=Math.max(.02,sf);rc.stack.visible=sf>.02;rc.stack.scale.y=f;rc.stack.position.y=.4*f}
    rc.w.forEach((w,wi)=>{let show=false,sc=1,x=rc.cx+(wi?1.95:-1.95),z=rc.cz;
      if(m>=465&&m<570){show=true;z+=Math.sin(m*.08+rc.i+wi*3)*1.4}else if(m>=570&&m<720){show=true;sc=.65;z+=Math.sin(m*.12+rc.i*1.3+wi*3)*2.2}
      else if(m>=780&&m<873){show=true;z+=(m>=rc.pa-5&&m<=rc.pb+3)?Math.sin(m*.35+wi*3)*2.2:(wi?-1:1)*1.2}else if(rc.kind=='wall'&&m>=870&&m<990){show=true;sc=.8;x=rc.cx+2.4+(wi?.7:-.7);z+=Math.sin(m*.1+wi*3)*1.5}
      w.visible=show;if(show){w.position.set(x,0,z);w.scale.y=sc}})});
  const tp=truckPose(m);truck.visible=!!tp;if(tp){truck.position.set(tp.x,0,tp.z);const pn=POUR.some(it=>m>=it.p0&&m<it.b);stream.visible=pn;drum.rotation.z+=dt*(pn?2.5:1.2)}}
function stepSim(){const n=performance.now(),dt=Math.min(.1,(n-ST.last)/1000);ST.last=n;if(ST.play){ST.m+=dt*ST.spd;if(ST.m>1020)ST.m=420}applySim(ST.m,dt);ST.ui+=dt;
  hallSim(ST.m,dt);
  if(ST.ui>.2){ST.ui=0;const m=ST.m;$('sl').value=m;let w=0;POUR.forEach(it=>{if(it.o.rc.kind=='wall'&&m>=it.b)w++});K[1]=['На складе',(DATA.plan.stb+(m>=510?SC.b:0))+' зд. · '+(DATA.plan.stp+(m>=510?SC.p:0))+' приям.'];
    kpi(w,m<465?'До смены':m<555?'Перенос':m<570?'Подготовка':m<720?'Армирование':m<780?'Обед':m<870?'Бетон':m<990?'Обогрев + заготовка':'Обогрев',fmt(m));renderCard()}}
// ===== основной цех: покраска, кровля, приямки (лотки, заземление), отгрузка на трал =====
const CC=c=>new THREE.Color(c),C0=CC(0xbdbab4),CO=CC(0xf0a35a),CD0=CC(0xa5a29c),CDO=CC(0xd98f45),CR0=CC(0xa9a6a0),CK=CC(0x1a1a1a),CP0=CC(0xaaa8a2),CPK=CC(0x1f1f1f),CL0=CC(0xb9b6b0),CLW=CC(0xf2f2f2),SH={x:X(665),zb:-12,y:.9};
function pitFit(g){const tr=[],gr=[],L=5,W=2.5,t=.15;[-1,1].forEach(s=>[.45,.8].forEach(y=>{const o=B(L-2*t-.3,.1,.22,0xb8c2cc,0,y,s*(W/2-t-.2),g,.4,.8);o.castShadow=false;o.visible=false;tr.push(o)}));
  const a=(w,h,d,x,y,z)=>{const o=B(w,h,d,0xc98a5a,x,y,z,g,.35,.8);o.castShadow=false;o.visible=false;gr.push(o)};a(L-2*t-.2,.04,.1,0,.13,-(W/2-t-.1));a(L-2*t-.2,.04,.1,0,.13,W/2-t-.1);a(.1,.04,W-2*t-.2,-(L/2-t-.1),.13,0);a(.1,.04,W-2*t-.2,L/2-t-.1,.13,0);a(.08,.5,.08,L/2-t-.1,.13,0);return[tr,gr]}
const ITM=(window.PZ||[]).map(p=>{const g=p.g,b=p.kind=='b',it={...p,ox:g.position.x,oz:g.position.z,s:b?[420,500,600][p.row]:[420,520,620][p.row-3],w:[],dr:[],rf:[],lv:[],ln:[],tr:[],gr:[],wk:mkWorker(),cloud:new THREE.Mesh(new THREE.SphereGeometry(.22,10,8),new THREE.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:.5}))};
  scene.add(it.cloud);g.ms.forEach(o=>{const c=o.material.color.getHex();if(c==0xbdbab4||c==0xaaa8a2)it.w.push(o);else if(c==0xa5a29c)it.dr.push(o);else if(c==0xa9a6a0)it.rf.push(o);else if(c==0x59616a)it.lv.push(o);else if(c==0xf2f2f2)it.ln.push(o)});
  if(!b){const f=pitFit(g);it.tr=f[0];it.gr=f[1]}it.ord=ord(70+p.row*2+p.j);it.data=DATA.plan.slots[70+p.row*2+p.j]||null;it.co=callout(it.ord,'',b?'#e07b1a':'#222',it.ox,b?3.6:2.2,it.oz,1);g.d.t=b?'Здание (основной цех)':'Приямок (основной цех)';g.d.r=()=>itemRows(it);return it});
const SHP=ITM.filter(i=>i.data&&i.data.st.ship==='в работе'&&itemStage(i,0)[2]==3).slice(0,2);SHP.forEach(i=>i.shp=true);
const TRL=new THREE.Group();(()=>{const P=(w,h,d,c,x,y,z)=>{const o=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),M(c,.6));o.position.set(x,y,z);o.castShadow=o.receiveShadow=true;TRL.add(o);return o};
  P(2.4,2.4,2.2,0x2f62b0,0,1.5,-7.6);P(2.6,.4,1.8,0x333a40,0,.7,-6.2);P(3,.3,12.5,0x555b61,0,.75,0);[-6.9,3.2,4.4,5.6].forEach(z=>[-1,1].forEach(s=>{const w=P(.4,1,1,0x111111,s*1.45,.5,z);w.geometry=new THREE.CylinderGeometry(.5,.5,.4,14);w.rotation.z=Math.PI/2}))})();TRL.visible=false;scene.add(TRL);
function itemStage(it,m){const d=it.data;if(!d)return['',0,-1];const b=it.kind=='b',s=d.st,ok=x=>x==='готово'||x==='не требуется',pr=x=>x==='в работе'?cl(.12+.8*cl((m-420)/420)):0;let k,p=0,nm;
  if(b){const S=[['Покраска изнутри',s.inner],['Покраска снаружи',s.outer],['Защитное покрытие крыши (чёрное)',s.fin]];k=S.findIndex(x=>!ok(x[1]));if(k<0)k=3;else{p=pr(S[k][1]);nm=(S[k][1]==='в работе'?'':'Ждёт: ')+S[k][0]}}
  else{const pd=ok(s.inner)&&ok(s.outer)?'готово':(s.inner==='в работе'||s.outer==='в работе'||s.inner==='готово'||s.outer==='готово')?'в работе':'не начато';
    if(!ok(pd)){k=0;p=pr(pd);nm=(pd==='в работе'?'':'Ждёт: ')+'покраска приямка (изнутри и снаружи)'}
    else if(!ok(s.fin)){if(s.fin==='в работе'){const f=pr(s.fin);k=f<.5?1:2;p=(f%.5)*2;nm=k==1?'Монтаж кабельных лотков':'Монтаж заземления'}else{k=1;p=0;nm='Ждёт: монтаж лотков и заземления'}}else k=3}
  if(k<3)return[nm,p,k];return[it.shp&&m>=915?(m>=975?'Отгружено тралом':'Погрузка на трал'):'Готово, ждёт отгрузки',1,3]}
function itemRows(it){const m=ST.m,st=itemStage(it,m),b=it.kind=='b';it.g.d.p=Math.round(st[1]*100);return[['Заказ',it.ord],['Изделие',it.data?it.data.name+' · '+it.data.obj:''],['Габариты',(it.data&&it.data.dims)||(b?'5000×2500×3070 мм':'5000×2500×1700 мм')],['Работа',st[0]],['Прогресс',it.g.d.p+' %'],['Время',fmt(m)]]}
function loadState(it,k,u,from){const H=it.kind=='b'?3.07:1.7,sx=it.ox,sz=it.oz,dz=SH.zb+(k?3.1:-3),idle=-1.2,pk=H+.5-5.6,hh=y=>y+H+.5-5.6;let x=sx,y=0,z=sz,rot=0,cx,cz,hy;
  if(u<.15){const a=sm(u/.15);cx=from.x+(sx-from.x)*a;cz=from.z+(sz-from.z)*a;hy=idle}else if(u<.25){cx=sx;cz=sz;hy=idle+(pk-idle)*sm((u-.15)/.1)}
  else if(u<.35){y=1.3*sm((u-.25)/.1);cx=sx;cz=sz;hy=hh(y)}else if(u<.55){const a=sm((u-.35)/.2);x=sx+(SH.x-sx)*a;y=1.3;rot=Math.PI/2*a;cx=x;cz=sz;hy=hh(y)}
  else if(u<.75){const a=sm((u-.55)/.2);x=SH.x;z=sz+(dz-sz)*a;y=1.3;rot=Math.PI/2;cx=x;cz=z;hy=hh(y)}else if(u<.85){const a=sm((u-.75)/.1);x=SH.x;z=dz;y=1.3-(1.3-SH.y)*a;rot=Math.PI/2;cx=x;cz=z;hy=hh(y)}
  else{x=SH.x;z=dz;y=SH.y;rot=Math.PI/2;cx=x;cz=z;hy=hh(y)+(idle-hh(y))*sm((u-.85)/.15)}return{cx,cz,hy,x,y,z,rot}}
function craneStep(m){const c=crane,id={x:X(556)+Math.sin(m*.05)*7.3,z:-10+Math.sin(m*.03)*20},n=SHP.length,loc=q=>q?3.1:-3;let cx=id.x,cz=id.z,hy=-1.2;
  if(n&&m>=900&&m<915){const a=sm((m-900)/15);cx=id.x+(SHP[0].ox-id.x)*a;cz=id.z+(SHP[0].oz-id.z)*a}
  else if(n&&m>=915&&m<915+25*n){const k=Math.min(n-1,Math.floor((m-915)/25)),s=loadState(SHP[k],k,cl((m-(915+25*k))/25),k?{x:SH.x,z:SH.zb+loc(k-1)}:{x:SHP[0].ox,z:SHP[0].oz});cx=s.cx;cz=s.cz;hy=s.hy}
  else if(n&&m>=915+25*n&&m<990){const a=sm((m-915-25*n)/(75-25*n)),fz=SH.zb+loc(n-1);cx=SH.x+(id.x-SH.x)*a;cz=fz+(id.z-fz)*a}
  c.g.position.z=cz;c.tr.position.x=cx;c.hk.position.y=hy;const len=-.55-hy;c.rp.scale.y=Math.max(.02,len/3.6);c.rp.position.y=-.35-len/2}
function hallSim(m,dt){let act=0,rdy=0;
  ITM.forEach(it=>{const st=itemStage(it,m),k=st[2],p=st[1],b=it.kind=='b';if(k>=0&&k<3)act++;if(k==3)rdy++;
    if(b){const p2=k<1?0:k==1?p:1,p3=k<2?0:k==2?p:1,gl=k==0?.25+.25*Math.sin(m*.5):0;it.w.forEach(o=>o.material.color.copy(C0).lerp(CO,p2));it.dr.forEach(o=>o.material.color.copy(CD0).lerp(CDO,p2));it.rf.forEach(o=>o.material.color.copy(CR0).lerp(CK,p3));it.lv.forEach(o=>o.material.emissive.setRGB(gl,gl,gl))}
    else{const p1=k<0?0:k==0?p:1,nt=k<1?0:k==1?p:1,ng=k<2?0:k==2?p:1;it.w.forEach(o=>o.material.color.copy(CP0).lerp(CPK,p1));it.ln.forEach(o=>o.material.color.copy(CL0).lerp(CLW,p1));it.tr.forEach((q,i)=>q.visible=i<Math.ceil(nt*it.tr.length-1e-6));it.gr.forEach((q,i)=>q.visible=i<Math.ceil(ng*it.gr.length-1e-6))}
    const w=it.wk,on=k>=0&&k<3&&p>0,ph=Math.sin(m*.25+it.row*2+it.j*3),az=it.oz+(it.j?1.8:-1.8);let pos=[0,0,0],sc=1,col=0xffffff;
    if(b){if(k==0)pos=[it.ox+3.3,0,it.oz];else if(k==1){pos=[it.ox+ph*1.8,0,az];col=0xf0a35a}else{pos=[it.ox+ph*1.6,3.07,it.oz];sc=.8;col=0x222222}}else{if(k==0){pos=[it.ox+ph*1.8,0,az];col=0x2a2a2a}else{pos=[it.ox+ph*1.5,.1,it.oz];col=k==1?0xb8c2cc:0xc98a5a}}
    w.visible=on;it.cloud.visible=on&&(b||k==0);if(on){w.position.set(pos[0],pos[1],pos[2]);w.scale.y=sc;it.cloud.position.set(pos[0],pos[1]+1.3,pos[2]+(pos[2]>it.oz?-.5:.5));it.cloud.material.color.setHex(col);it.cloud.scale.setScalar(.8+.4*Math.abs(Math.sin(m*.8)))}});
  const ZO=Z(900);let trz=null;if(SHP.length&&m>=885&&m<990)trz=m<900?ZO+(SH.zb-ZO)*sm((m-885)/15):m<975?SH.zb:SH.zb+(ZO-SH.zb)*sm((m-975)/15);TRL.visible=trz!=null;if(trz!=null)TRL.position.set(SH.x,0,trz);
  SHP.forEach((it,k)=>{const g=it.g,t0=915+25*k,loc=k?3.1:-3;if(m<t0){g.position.set(it.ox,0,it.oz);g.rotation.y=0;g.visible=true}else if(m<t0+25){const s=loadState(it,k,(m-t0)/25,k?{x:SH.x,z:SH.zb-3}:{x:SHP[0].ox,z:SHP[0].oz});g.position.set(s.x,s.y,s.z);g.rotation.y=s.rot;g.visible=true}else{g.position.set(SH.x,SH.y,(trz==null?SH.zb:trz)+loc);g.rotation.y=Math.PI/2;g.visible=trz!=null}});
  sceneSim(m);craneStep(m);K[2]=['Основной цех',act+' в работе · '+rdy+' готово']}
// ===== сценарии отливки и выноски с номерами заказов =====
function callout(t,s,c,x,y,z,sm2){const l=label(t,s||'',c,x,y,z);l.e.classList.add('co');if(sm2)l.e.classList.add('sm');return l}
const SC={b:0,p:0},PATHS=[null,null],PREVT=DATA.plan.prevT;
const BG=[{b:window.POSTG.b,p:pit(X(326),Z(420),Math.PI/2,PD(9,['Приямок (прошлая смена)',[['Этап','Выгрузка в основной цех']]]),.5,false)},{b:building(X(326),Z(577),Math.PI/2,BD(10,['Здание (прошлая смена)',[['Этап','Выгрузка в основной цех']]]),.5,false),p:window.POSTG.p}];
const CL2={t:[WT[1],WT[4]].map(r=>callout('','','#e8b32a',r.cx,2.3,r.cz)),p:[rcPA,rcPB].map(r=>callout('','','#6b747d',r.cx,4.8,r.cz)),r:[rr,r2].map(r=>callout('','','#9aa0a6',r.cx,1.6,r.cz))},BGC=[callout(ord(9),'','#9aa0a6',0,0,0,1),callout(ord(10),'','#9aa0a6',0,0,0,1)];
function rebuildPour(){POUR.length=0;TB.forEach(r=>{r.pa=1e9;r.pb=0});const L=[];if(r2.on)L.push(r2.slabs[0]);if(rcPB.on)L.push(rcPB.slabs[0]);if(rcPA.on)L.push(rcPA.slabs[0]);if(rr.on)L.push(rr.slabs[0]);WT.forEach(t=>{if(t.on)L.push(...t.slabs)});
  const n=Math.max(1,L.length);L.forEach((o,k)=>{const a=780+k*90/n,b=a+90/n,r=o.rc;POUR.push({o,a,b,p0:k?a+.45*(b-a):a,x:o.cx-4.6,z:o.cz+o.zo-2});r.pa=Math.min(r.pa,a);r.pb=Math.max(r.pb,b)})}
function applyScenario(code){const sc=[0,1].map(i=>code[i]=='b'||code[i]=='p'?code[i]:null);
  [[PA,rcPA,sc[0],ord(11),rr],[PB,rcPB,sc[1],ord(12),r2]].forEach(([P,post,t,od,rf],pi)=>{P.type=t;P.H=t=='b'?2.92:1.7;post.on=t!=null;post.ord=od;post.what=t=='b'?'Основание здания':'Основание приямка';post.dim=t=='b'?'5000×2500×3070 мм':'5000×2500×1700 мм';rf.on=t=='b';
    WT.filter(w=>(w.i>2?1:0)==pi).forEach(w=>{w.on=t!=null;w.ord=od;w.dim=(w.short?'2500':'5000')+'×'+(t=='b'?'2920':'1700')+'×150 мм'+(w.short?' (×2)':'')})});
  TS.forEach(p=>{if(p.roof){const P=p.rc===rr?PA:PB;p.p1.set(P.x,.5+P.H+.11,P.z)}else{const P=p.rc.i>2?PB:PA,sh=p.rc.short,j=p.rc.slabs.indexOf(p.s);p.p1=sh?vv(P.x,.5+P.H/2,P.z+(j?1:-1)*2.425):vv(P.x+(p.rc.i%3==0?-1:1)*1.175,.5+P.H/2,P.z);p.sx=P.H/2.5}});
  TB.forEach(rc=>{if(!rc.on)rc.slabs.forEach(s=>{s.rebar.forEach(q=>q.visible=false);s.conc.visible=false;s.conc.material.emissive.setRGB(0,0,0);s.heat.material.color.copy(HC)})});
  const cnt={b:0,p:0};PREVT.forEach((t,pi)=>{if(!t)return;const idx=cnt[t]++,z=t=='b'?Z(262+idx*28):Z(475+idx*28),y0=pi?Z(577):Z(420);PATHS[pi]=[[X(326),y0],[X(432),y0],[X(432),Z(560)],[X(548),Z(560)],[X(548),z],[X(502),z]]});
  SC.b=cnt.b;SC.p=cnt.p;window.WTOT=WT.filter(w=>w.on).reduce((s,w)=>s+w.slabs.length,0);K[0]=['На постах основания',sc.filter(t=>t=='b').length+' зд. · '+sc.filter(t=>t=='p').length+' приям.'];
  CL2.t.forEach((l,k)=>{const P=k?PB:PA,r=WT[k?4:1];l.off=!r.on;l.b.textContent='Заказ '+r.ord;l.s.textContent=P.type=='b'?'Стены здания':'Стены приямка'});
  CL2.p.forEach((l,k)=>{const P=k?PB:PA,r=k?rcPB:rcPA;l.off=!r.on;l.b.textContent='Заказ '+r.ord;l.s.textContent=P.type=='b'?'Основание здания':'Основание приямка'});
  CL2.r.forEach((l,k)=>{const r=k?r2:rr;l.off=!r.on;l.b.textContent='Заказ '+r.ord;l.s.textContent='Крыша здания'});rebuildPour();renderCard()}
function stgSim(){const S=window.STG||[];S.forEach(s=>{s.g.visible=!!s.data});[0,1,3,4].forEach(i=>{const a=S.find(s=>s.i==i&&s.j==0),b=S.find(s=>s.i==i&&s.j==1);if(!a)return;const o=[a,b].filter(s=>s.data);a.co.off=!o.length;a.co.b.textContent=o.map(s=>s.data.label).join(' · ');a.co.v.set(a.x,a.isB?3.6:2.2,o.length==1?o[0].z:(a.z+b.z)/2)})}
function sceneSim(m){TS.forEach(p=>p.m.visible=p.rc.on);TB.forEach(rc=>{if(!rc.on){rc.w.forEach(w=>w.visible=false);if(rc.stack)rc.stack.visible=false;if(rc.tl&&rc.kind=='wall')rc.tl.rotation.z=0}});
  [PA,PB].forEach((P,pi)=>{['b','p'].forEach(t=>{const g=BG[pi][t],sh=PREVT[pi]===t;g.visible=sh;if(sh)placeBlock(g,PATHS[pi],m)});const g=PREVT[pi]?BG[pi][PREVT[pi]]:null;BGC[pi].off=!g;if(g)BGC[pi].v.set(g.position.x,g.position.y+(PREVT[pi]=='b'?3.6:2.2),g.position.z)});
  {const g0=PREVT[0]?BG[0][PREVT[0]]:null,g1=PREVT[1]?BG[1][PREVT[1]]:null;if(g0&&g1&&PREVT[0]==PREVT[1]&&Math.abs(g0.position.z-g1.position.z)<3&&Math.abs(g0.position.x-g1.position.x)<1){BGC[1].off=true;BGC[0].v.set((g0.position.x+g1.position.x)/2,g0.position.y+(PREVT[0]=='b'?3.6:2.2),(g0.position.z+g1.position.z)/2);BGC[0].b.textContent=ord(9)+' · '+ord(10)}else BGC[0].b.textContent=ord(9)}
  ITM.forEach(it=>{if(!it.data){it.g.visible=false;it.co.off=true;return}const g=it.g,b=it.kind=='b',pt=ITM.find(q=>q.row==it.row&&q.j!=it.j),both=g.visible&&pt.g.visible&&Math.abs(g.position.z-pt.g.position.z)<3&&Math.abs(g.position.x-pt.g.position.x)<1;
    if(it.j==1&&both){it.co.off=true;return}it.co.off=!g.visible;it.co.v.set(both?(g.position.x+pt.g.position.x)/2:g.position.x,g.position.y+(b?3.6:2.2),both?(g.position.z+pt.g.position.z)/2:g.position.z);it.co.b.textContent=both?it.ord+' · '+pt.ord:it.ord});stgSim()}
$('sc').onchange=e=>applyScenario(e.target.value);applyScenario(DATA.scenario||'bp');$('sc').value=DATA.scenario||'bp';
select(rcPA.g);
addEventListener('resize',()=>{cam.aspect=innerWidth/innerHeight;cam.updateProjectionMatrix();ren.setSize(innerWidth,innerHeight)});
(function loop(){requestAnimationFrame(loop);stepSim();ctl.update();ren.render(scene,cam);labels.forEach(l=>{const v=l.v.clone().project(cam);l.e.style.display=(v.z>1||l.off)?'none':'block';l.e.style.left=(v.x*.5+.5)*innerWidth+'px';l.e.style.top=(-v.y*.5+.5)*innerHeight+'px'})})();
