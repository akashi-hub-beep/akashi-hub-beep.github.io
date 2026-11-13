/* Learning Hub: главная обучения, каталог, курс, урок. Данные — learn-data.js.
   Подключается к роутеру через Learn.render(kind, arg) → {title, html}. */
(function(){
"use strict";
var C=window.COURSES||[],G=window.LCATS||[];
var PASSP=70,XP=20,LET="абвгдежз";/* проходной балл проверки, %; XP за первое прохождение урока */
var ST=null;/* состояние открытого урока: {id, a:{номер вопроса: выбранный вариант}, xp} */
var $=function(id){return document.getElementById(id)};
function has(a){return Array.isArray(a)&&a.length>0}
var esc=function(s){return String(s).replace(/[&<>"']/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]})};
var rt=function(s){return esc(s).replace(/`([^`]+)`/g,"<code>$1</code>")};
function pl(n,a,b,c){var m=n%100,k=n%10;return n+" "+(m>10&&m<20?c:k===1?a:k>1&&k<5?b:c)}
function flat(c){var a=[];c.modules.forEach(function(m,mi){m.lessons.forEach(function(l,li){a.push({c:c,m:m,mi:mi,l:l,n:li+1})})});return a}
function course(id){return C.filter(function(c){return c.id===id})[0]}
function find(id){var r;C.forEach(function(c){flat(c).forEach(function(x){if(x.l.id===id)r=x})});return r}
function mins(c){return flat(c).reduce(function(s,x){return s+x.l.min},0)}
function H(){return window.LearnHost||null}
function isDone(id){var h=H();return!!(h&&h.isDone(id))}
function prog(c){var a=flat(c),d=a.filter(function(x){return isDone(x.l.id)}).length;return{d:d,n:a.length,p:a.length?Math.round(d/a.length*100):0}}
function bar(p,label){return'<div class="bar" role="progressbar" aria-label="'+esc(label)+'" aria-valuemin="0" aria-valuemax="100" aria-valuenow="'+p+'"><i style="width:'+p+'%"></i></div>'}
function ccard(c){var p=prog(c),fin=p.n>0&&p.d===p.n;return'<a class="sub" href="#course='+c.id+'"><span class="ic">'+esc(c.ic)+'</span><h3>'+esc(c.title)+'</h3><p>'+esc(c.desc)+'</p><div class="mt"><span>'+pl(c.modules.length,"модуль","модуля","модулей")+" · "+pl(p.n,"урок","урока","уроков")+"</span><span>"+esc(c.level)+'</span></div><div class="mt"><span class="'+(fin?"acc":"")+'">'+(fin?"✓ Курс пройден":"Пройдено "+p.d+" из "+p.n)+"</span><span>"+p.p+"%</span></div>"+bar(p.p,"Прогресс курса «"+c.title+"»")+"</a>"}
function hub(cat){
 var g=G.filter(function(x){return x.id===cat})[0],list=C.filter(function(c){return!g||c.cat===g.id});
 var chips='<a class="btn" href="#learn" aria-current="'+!g+'">Все курсы</a>'+G.map(function(x){var n=C.filter(function(c){return c.cat===x.id}).length;return n?'<a class="btn" href="#learn='+x.id+'" aria-current="'+(g===x)+'">'+esc(x.name)+" ("+n+")</a>":""}).join("");
 return{title:"Обучение — upyourself",html:'<a class="crumb" href="#top">← на главную</a><h1 class="qt"><span class="acc">//</span> Обучение</h1><p class="lead">Изучение → понимание → практика → закрепление → проверка. Выбирайте курс, проходите уроки по порядку, а знания проверяйте в тестах.</p>'+
 '<div class="grid2"><a class="card lsn" href="#lang"><b>Иностранные языки</b><p class="xs">Английский, японский, корейский: составляйте предложения и разбирайте каждое слово.</p></a><a class="card lsn" href="#subjects"><b>Тесты по предметам</b><p class="xs">Проверьте, что вы уже знаете: обычный режим, практика и экзамен.</p></a></div>'+
 '<h2 class="ttl" style="margin-top:36px"><small>01</small>Категории</h2><div class="cats">'+chips+'</div>'+
 '<h2 class="ttl"><small>02</small>Курсы</h2>'+(list.length?'<div class="cat">'+list.map(ccard).join("")+"</div>":'<div class="empty"><b>Пока пусто</b>В этой категории ещё нет курсов.</div>')}}
function coursePage(c){var all=flat(c),p=prog(c),nx=all.filter(function(x){return!isDone(x.l.id)})[0],cta="";
 if(all.length)cta=!nx?'<span class="pillb acc">✓ Курс пройден</span><a class="btn" href="#lesson='+all[0].l.id+'">Повторить с первого урока</a>':p.d===0?'<a class="btn p" href="#lesson='+nx.l.id+'">Начать с первого урока →</a>':'<a class="btn p" href="#lesson='+nx.l.id+'">Продолжить: '+esc(nx.l.title)+" →</a>";
 else cta='<div class="empty"><b>Уроки скоро появятся</b></div>';
 return{title:c.title+" — upyourself",html:'<a class="crumb" href="#learn">← обучение</a><h1 class="qt"><span class="acc">'+esc(c.ic)+"</span> "+esc(c.title)+'</h1><p class="lead">'+esc(c.desc)+'</p><p><span class="pillb">'+esc(c.level)+'</span><span class="pillb">'+pl(c.modules.length,"модуль","модуля","модулей")+'</span><span class="pillb">'+pl(all.length,"урок","урока","уроков")+'</span><span class="pillb">≈ '+mins(c)+' мин</span></p>'+
 '<div class="lprog"><p class="xs">Пройдено <b>'+p.d+"</b> из "+p.n+" · "+p.p+"%</p>"+bar(p.p,"Прогресс курса")+'</div><div class="ctl">'+cta+"</div>"+
 c.modules.map(function(m,mi){return'<h2 class="ttl" style="margin-top:34px"><small>'+("0"+(mi+1)).slice(-2)+"</small>"+esc(m.title)+'</h2><div class="grid2">'+m.lessons.map(function(l,li){var d=isDone(l.id);return'<a class="card lsn" href="#lesson='+l.id+'"><b>'+(d?'<span class="acc" aria-label="пройден">✓</span> ':"")+esc(l.title)+'</b><p class="xs">Урок '+(li+1)+" · "+l.min+' мин</p><p class="xs">'+esc(l.goal)+"</p></a>"}).join("")+"</div>"}).join("")}}

/* ---- блоки урока ---- */
function secT(t){return'<h2 class="ttl" style="margin-top:30px">'+t+"</h2>"}
function det(title,inner){return'<details class="hit"><summary>'+title+'</summary><div style="margin-top:10px">'+inner+"</div></details>"}
function imgs(l){if(!has(l.images))return"";return l.images.map(function(m){var alt=m.alt||"";return'<figure class="lfig"><img src="'+esc(m.src)+'" alt="'+esc(alt)+'" loading="lazy">'+(m.cap?"<figcaption>"+rt(m.cap)+"</figcaption>":"")+'<span class="lalt" hidden>Изображение не загрузилось: '+esc(alt)+"</span></figure>"}).join("")}
function tasksH(l){if(!has(l.tasks))return"";return secT("Задания")+'<p class="xs" style="margin-top:8px">Сначала ответьте сами, потом откройте ответ.</p><ol class="ltask">'+l.tasks.map(function(t){return"<li><p>"+rt(t.q)+"</p>"+(t.hint?det("Подсказка","<p>"+rt(t.hint)+"</p>"):"")+det("Показать ответ","<p>"+rt(t.a)+"</p>")+"</li>"}).join("")+"</ol>"}
function practH(l){var p=l.practice;if(!p||!p.task)return"";return secT("Практика")+'<div class="card" style="margin-top:14px"><p>'+rt(p.task)+"</p>"+(p.starter?'<div class="lbl" style="margin-top:16px">Заготовка</div><pre class="lcode"><code>'+esc(p.starter)+"</code></pre>":"")+(p.hint?det("Подсказка","<p>"+rt(p.hint)+"</p>"):"")+(p.solution?det("Показать решение",'<pre class="lcode" style="margin-top:0"><code>'+esc(p.solution)+"</code></pre>"+(p.out?'<div class="lbl" style="margin-top:14px">Результат в консоли</div><pre class="lcode lout"><code>'+esc(p.out)+"</code></pre>":"")):"")+"</div>"}
function summH(l){if(!has(l.summary))return"";return secT("Итоги урока")+'<ul class="lsum">'+l.summary.map(function(t){return"<li>"+rt(t)+"</li>"}).join("")+"</ul>"}
/* проверка */
function expl(q,oi){return(oi===q.a?'<b class="acc">✓ Верно.</b> ':'<b style="color:var(--bad)">✗ Неверно.</b> Правильный ответ: <b>'+rt(q.o[q.a])+"</b>. ")+rt(q.w||"")}
function qH(q,qi){var a=ST.a[qi],lk=a!==undefined;return'<fieldset class="lq" id="lh-q'+qi+'"><legend>'+(qi+1)+". "+rt(q.q)+'</legend><div class="opts">'+q.o.map(function(t,oi){var cl="opt";if(lk){if(oi===q.a)cl+=" ok";else if(oi===a)cl+=" no"}return'<label class="'+cl+'"><input type="radio" name="lhq'+qi+'" value="'+oi+'" data-lh="pick" data-q="'+qi+'"'+(lk?" disabled":"")+(a===oi?" checked":"")+'><span class="lt">'+LET.charAt(oi)+"</span><span>"+rt(t)+"</span></label>"}).join("")+'</div><div class="expl" id="lh-e'+qi+'" aria-live="polite">'+(lk?expl(q,a):"")+"</div></fieldset>"}
function checkH(l){if(!has(l.check))return"";return secT("Проверка")+'<p class="xs" style="margin-top:8px">Выберите ответ в каждом вопросе. Чтобы завершить урок, нужно набрать не менее '+PASSP+"%.</p><div id=\"lh-check\">"+l.check.map(qH).join("")+'</div><div id="lh-res" aria-live="polite"></div>'}
function answered(l){return l.check.every(function(_,i){return ST.a[i]!==undefined})}
function score(l){var s=0;l.check.forEach(function(q,i){if(ST.a[i]===q.a)s++});return s}
function passed(l){return!has(l.check)||(answered(l)&&score(l)*100>=PASSP*l.check.length)}
function finH(x){var l=x.l,h=H();if(!h)return"";var d=h.get(l.id);
 if(d){var all=flat(x.c),cd=prog(x.c).d===all.length;return'<div class="expl lres"><b class="acc">✓ Урок пройден</b>'+(ST&&ST.xp?" · +"+ST.xp+" XP":"")+(d.best!=null?" · результат проверки: "+d.best+"%":"")+(cd?"<br>🎓 Вы прошли весь курс «"+esc(x.c.title)+"»!":"")+"</div>"}
 var ok=passed(l);return'<div class="ctl"><button type="button" class="btn p" data-lh="done"'+(ok?"":" disabled")+">Завершить урок · +"+XP+" XP</button></div>"+(ok?"":'<p class="xs" style="margin-top:10px">Кнопка станет доступна после успешной проверки.</p>')}
function fin(){var x=ST&&find(ST.id),b=$("lh-fin");if(x&&b)b.innerHTML=finH(x)}
function res(){var x=find(ST.id),l=x.l,box=$("lh-res");if(!box)return;
 if(!answered(l)){box.innerHTML="";fin();return}
 var s=score(l),n=l.check.length,ok=passed(l);
 box.innerHTML='<div class="expl lres"><b class="'+(ok?"acc":"")+'">Результат: '+s+" из "+n+" ("+Math.round(s/n*100)+"%).</b> "+(ok?"Проверка пройдена.":"Нужно не менее "+PASSP+"%. Перечитайте теорию и попробуйте ещё раз.")+(ok?"":'<p class="ctl"><button type="button" class="btn" data-lh="retry">Пройти заново</button></p>')+"</div>";fin()}
function pick(qi,oi){var x=find(ST.id),q=x&&x.l.check&&x.l.check[qi];if(!q||ST.a[qi]!==undefined)return;ST.a[qi]=oi;
 [].forEach.call($("lh-q"+qi).querySelectorAll("label.opt"),function(lb,k){lb.querySelector("input").disabled=true;if(k===q.a)lb.classList.add("ok");else if(k===oi)lb.classList.add("no")});
 $("lh-e"+qi).innerHTML=expl(q,oi);res()}
function retry(){var x=find(ST.id);ST.a={};$("lh-check").innerHTML=x.l.check.map(qH).join("");$("lh-res").innerHTML="";fin();var i=$("lh-check").querySelector("input");if(i){i.focus({preventScroll:true});$("lh-check").scrollIntoView({block:"start"})}}
function finish(){var h=H(),x=ST&&find(ST.id);if(!h||!x||!passed(x.l))return;var l=x.l,r=h.complete(l.id,has(l.check)?Math.round(score(l)/l.check.length*100):null,XP);ST.xp=r&&r.xp||0;fin()}

function lessonPage(x){var all=flat(x.c),i=all.indexOf(find(x.l.id)),p=all[i-1],n=all[i+1],l=x.l;ST={id:l.id,a:{},xp:0};
 return{title:l.title+" — "+x.c.title,html:'<a class="crumb" href="#course='+x.c.id+'">← '+esc(x.c.title)+'</a><p class="qc">Модуль '+(x.mi+1)+": "+esc(x.m.title)+" · урок "+x.n+" · "+l.min+' мин</p><h1 class="qt">'+esc(l.title)+'</h1>'+
 '<div class="card" style="margin-top:18px"><div class="lbl">Цель урока</div><p>'+esc(l.goal)+"</p></div>"+
 secT("Теория")+l.text.map(function(t){return'<p class="lp">'+rt(t)+"</p>"}).join("")+imgs(l)+
 (l.code?secT("Пример")+'<pre class="lcode"><code>'+esc(l.code)+"</code></pre>"+(l.out?'<div class="lbl" style="margin-top:14px">Результат в консоли</div><pre class="lcode lout"><code>'+esc(l.out)+"</code></pre>":""):"")+
 tasksH(l)+practH(l)+summH(l)+checkH(l)+'<div id="lh-fin" style="margin-top:26px">'+finH(x)+"</div>"+
 '<div class="lnav">'+(p?'<a class="btn" href="#lesson='+p.l.id+'">← '+esc(p.l.title)+"</a>":"")+'<a class="btn" href="#course='+x.c.id+'">К списку уроков</a>'+(n?'<a class="btn p" href="#lesson='+n.l.id+'">'+esc(n.l.title)+" →</a>":"")+"</div>"}}

/* ---- события (делегирование: v-learn перерисовывается роутером) ---- */
document.addEventListener("change",function(e){var t=e.target;if(ST&&t.matches&&t.matches('input[data-lh="pick"]')&&t.closest("#v-learn"))pick(+t.dataset.q,+t.value)});
document.addEventListener("click",function(e){var b=e.target.closest&&e.target.closest("[data-lh]");if(!b||!ST||b.disabled||!b.closest("#v-learn"))return;var a=b.dataset.lh;if(a==="retry")retry();else if(a==="done")finish()});
document.addEventListener("error",function(e){var t=e.target;if(t&&t.tagName==="IMG"&&t.closest){var f=t.closest(".lfig");if(f){t.hidden=true;var a=f.querySelector(".lalt");if(a)a.hidden=false}}},true);

/* ---- проверка данных (для автора курсов) ---- */
function validate(){var p=[],seen={},idRe=/^[A-Za-z0-9-]+$/;
 C.forEach(function(c){var w=(c.id||"?")+": ";
  if(!c.id||!idRe.test(c.id))p.push(w+"id курса должен состоять из латиницы, цифр и дефиса");
  if(!G.some(function(g){return g.id===c.cat}))p.push(w+"неизвестная категория «"+c.cat+"»");
  if(!has(c.modules))p.push(w+"нет модулей");
  (c.modules||[]).forEach(function(m){if(!has(m.lessons))p.push(w+"модуль «"+m.title+"» без уроков");(m.lessons||[]).forEach(function(l){var u=w+(l.id||"?")+": ";
   if(!l.id||!idRe.test(l.id))p.push(u+"id урока должен состоять из латиницы, цифр и дефиса");else if(seen[l.id])p.push(u+"id урока повторяется");seen[l.id]=1;
   if(!l.title)p.push(u+"нет title");if(!(l.min>0))p.push(u+"min должно быть числом больше 0");if(!l.goal)p.push(u+"нет goal");if(!has(l.text))p.push(u+"нет text");
   (l.images||[]).forEach(function(m,k){if(!m.src)p.push(u+"images["+k+"]: нет src");if(!m.alt)p.push(u+"images["+k+"]: нет alt (описание для экранных читалок)")});
   (l.tasks||[]).forEach(function(t,k){if(!t.q||!t.a)p.push(u+"tasks["+k+"]: нужны q и a")});
   if(l.practice&&(!l.practice.task||!l.practice.solution))p.push(u+"practice: нужны task и solution");
   (l.check||[]).forEach(function(q,k){var v=u+"check["+k+"]: ";if(!q.q)p.push(v+"нет q");if(!Array.isArray(q.o)||q.o.length<2||q.o.length>LET.length)p.push(v+"o — массив из 2–"+LET.length+" вариантов");else if(!(q.a>=0&&q.a<q.o.length&&q.a%1===0))p.push(v+"a должно быть индексом варианта в o")});
   if(l.summary!==undefined&&!has(l.summary))p.push(u+"summary должен быть непустым массивом")})})});
 return p}
var bad=validate();if(bad.length&&window.console)console.warn("Learn: проблемы в learn-data.js:\n"+bad.join("\n"));

window.Learn={validate:validate,render:function(k,a){
 if(k==="course"){var c=course(a);if(c)return coursePage(c)}
 if(k==="lesson"){var x=find(a);if(x)return lessonPage(x)}
 return hub(k==="learn"?a:"")}};
})();
