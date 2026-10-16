const lessons = [
 {id:"hello",unit:"UNIT 1 · FIRST WORDS",title:"Hello, bestie!",desc:"Aprende a saludar y despedirte en inglés.",tag:"4 min",en:"Hello!",es:"¡Hola!",example:"Hello! How are you? — ¡Hola! ¿Cómo estás?",q:"¿Qué significa “Hello”?",opts:["Adiós","Hola","Gracias"],correct:1,why:"“Hello” significa “Hola”. Es un saludo común y amable.",hint:"Es lo que dices cuando llegas y ves a una amiga."},
 {id:"name",unit:"UNIT 1 · INTRODUCTIONS",title:"What’s your name?",desc:"Preséntate y pregunta el nombre de alguien.",tag:"5 min",en:"My name is Emma.",es:"Mi nombre es Emma.",example:"What's your name? — ¿Cómo te llamas?",q:"Completa: “My ___ is Emma.”",opts:["name","fashion","hello"],correct:0,why:"“My name is…” significa “Mi nombre es…”. También puedes decir “I’m Emma”.",hint:"La palabra significa “nombre”."},
 {id:"please",unit:"UNIT 1 · POLITE GIRL",title:"Please & thank you",desc:"Usa expresiones amables en conversaciones.",tag:"4 min",en:"Thank you!",es:"¡Gracias!",example:"Can I have it, please? — ¿Me lo puedes dar, por favor?",q:"¿Cómo dices “por favor” en inglés?",opts:["Sorry","Please","Thanks"],correct:1,why:"“Please” significa “por favor”. “Thank you” o “thanks” significa “gracias”.",hint:"La dices al pedir algo de manera amable."},
 {id:"fashion",unit:"UNIT 2 · FASHION GIRL",title:"My style, my rules",desc:"Vocabulario básico de ropa y estilo.",tag:"6 min",en:"I like this outfit.",es:"Me gusta este conjunto.",example:"Outfit = conjunto de ropa. “I like your outfit!” — ¡Me gusta tu conjunto!",q:"¿Qué significa “outfit”?",opts:["Canción","Conjunto de ropa","Amiga"],correct:1,why:"“Outfit” es un conjunto de ropa, normalmente pensado como un look completo.",hint:"Es el look completo que eliges para salir."},
 {id:"music",unit:"UNIT 2 · K-POP MOOD",title:"Talk about music",desc:"Cuenta qué música te gusta.",tag:"5 min",en:"I love this song.",es:"Me encanta esta canción.",example:"“I love K-pop” — Me encanta el K-pop.",q:"Completa: “I ___ this song.” (Me encanta esta canción)",opts:["love","name","please"],correct:0,why:"“Love” significa amar o encantar. “I love this song” expresa que te encanta la canción.",hint:"Empieza con la letra L y significa “amar/encantar”."},
 {id:"review",unit:"UNIT 3 · MINI CHECKPOINT",title:"Your first mini quiz",desc:"Repasa lo aprendido y celebra tu progreso.",tag:"7 min",en:"You can do it!",es:"¡Tú puedes hacerlo!",example:"“Keep going!” — ¡Sigue adelante!",q:"¿Cuál es la traducción de “Thank you”?",opts:["Por favor","Lo siento","Gracias"],correct:2,why:"“Thank you” significa “gracias”. ¡Ya conoces varias expresiones útiles!",hint:"Es una expresión para agradecer."}
];
const STORAGE_KEY = "kpopEnglishAcademyProfessional";
const defaultState = {xp:0,done:[],attempts:{},lastScore:null,lastStudy:null};
let state = loadState(), currentLesson = null, answered = false, toastTimer = null;

function loadState(){
 try { const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null"); return saved ? {...defaultState,...saved} : {...defaultState}; }
 catch { return {...defaultState}; }
}
function saveState(){ try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch(e) { console.warn("No se pudo guardar el progreso local.",e); } renderStats(); }
function pctDone(){ return Math.round(state.done.length / lessons.length * 100); }
function renderStats(){
 const done = state.done.length, pct = pctDone();
 setText("xpTop",state.xp); setText("xpStat",state.xp+" XP"); setText("doneStat",done+"/"+lessons.length);
 setText("streakStat",state.lastStudy === new Date().toDateString() ? "¡Hoy!" : (state.lastStudy ? "Sigue así" : "¡Vamos!"));
 setText("accuracyStat",state.lastScore === null ? "—" : state.lastScore+"%");
 setText("sidePct",pct+"% completado"); setWidth("sideBar",pct); setWidth("levelBar",pct);
 setText("starterCount",pct+"% →"); setText("progressPct",pct+"%"); setWidth("progressBar",pct);
 setText("pXP",state.xp); setText("pDone",done);
 setText("pAttempts",Object.values(state.attempts).reduce((a,b)=>a+b,0));
 setText("progressSentence",done===lessons.length ? "¡Completaste todas las lecciones de Starter! Sigue repasando para mantener lo aprendido." : done===0 ? "Completa tu primera lección para empezar tu recorrido." : "¡Buen trabajo! Has dominado "+done+" de "+lessons.length+" lecciones. Sigue practicando.");
 renderBadges();
}
function setText(id,value){const el=document.getElementById(id);if(el)el.textContent=value;}
function setWidth(id,pct){const el=document.getElementById(id);if(el)el.style.width=pct+"%";}
function renderBadges(){
 const badges=[
  {ok:state.done.length>=1,icon:"🌸",name:"First lesson",desc:"Completa tu primera lección"},
  {ok:state.done.length>=3,icon:"✨",name:"Getting confident",desc:"Domina tres lecciones"},
  {ok:state.done.length>=6,icon:"👑",name:"Starter star",desc:"Completa Starter"},
  {ok:state.xp>=60,icon:"💎",name:"XP collector",desc:"Consigue 60 XP"}
 ];
 const el=document.getElementById("badges");
 if(el)el.innerHTML=badges.map(b=>`<div class="achievement-badge ${b.ok?"":"locked"}" title="${b.desc}"><span>${b.icon}</span><b>${b.name}</b></div>`).join("");
}
function lessonCard(l,index){
 const completed=state.done.includes(l.id);
 return `<article class="lesson-card"><div class="lesson-card-top"><span class="lesson-number">${String(index+1).padStart(2,"0")}</span><span class="${completed?"done-mark":"soft-pill"}">${completed?"✓ Dominada":l.tag}</span></div><h3>${l.title}</h3><p>${l.desc}</p><div class="lesson-card-foot"><small>♡ Starter · Inglés básico</small><button class="button ${completed?"button-quiet":"button-primary"}" data-open-lesson="${l.id}">${completed?"Repasar":"Empezar"} →</button></div></article>`;
}
function renderLessons(){
 const home=document.getElementById("homeLessons"),all=document.getElementById("allLessons");
 if(home)home.innerHTML=lessons.slice(0,2).map(lessonCard).join("");
 if(all)all.innerHTML=lessons.map(lessonCard).join("");
}
function showPage(page){
 document.querySelectorAll(".page").forEach(p=>p.classList.add("hidden"));
 const target=document.getElementById(page+"Page");if(target)target.classList.remove("hidden");
 document.querySelectorAll(".nav-item").forEach(n=>n.classList.toggle("active",n.dataset.page===page));
 window.scrollTo({top:0,behavior:"smooth"});
 if(page==="progress")renderStats();
}
function openLesson(id){
 const l=lessons.find(item=>item.id===id);if(!l)return;
 currentLesson=l;answered=false;
 setText("lessonUnit",l.unit);setText("lessonTitle",l.title);setText("lessonDesc",l.desc);
 setText("lessonTag",l.tag);setText("wordEnglish",l.en);setText("wordSpanish",l.es);setText("wordExample",l.example);setText("question",l.q);
 const fb=document.getElementById("feedback");fb.className="feedback hidden";fb.textContent="";
 const mic=document.getElementById("micResult");mic.className="feedback hidden";mic.textContent="";
 document.getElementById("answerArea").innerHTML='<div class="choices">'+l.opts.map((o,i)=>`<button class="choice" data-answer="${i}">${String.fromCharCode(65+i)}. ${o}</button>`).join("")+'</div>';
 document.getElementById("quizActions").innerHTML="";
 showPage("lesson");
}
function checkAnswer(index,button){
 if(answered||!currentLesson)return;
 const fb=document.getElementById("feedback");
 const choices=[...document.querySelectorAll("[data-answer]")];
 state.attempts[currentLesson.id]=(state.attempts[currentLesson.id]||0)+1;
 if(index===currentLesson.correct){
  answered=true;button.classList.add("correct");
  fb.className="feedback good";fb.innerHTML="<b>✨ ¡Correcto, girl!</b> "+escapeHtml(currentLesson.why);
  const firstTime=!state.done.includes(currentLesson.id);
  if(firstTime){state.done.push(currentLesson.id);state.xp+=20;state.lastStudy=new Date().toDateString();}
  state.lastScore=100;saveState();renderLessons();
  document.getElementById("quizActions").innerHTML=`<button class="button button-primary" id="nextLessonButton">${firstTime?"Lección completada · +20 XP":"¡Lo recordaste!"} → ${currentLesson.id==="review"?"Ver progreso":"Siguiente lección"}</button>`;
  document.getElementById("nextLessonButton").addEventListener("click",nextLesson);
  choices.forEach(c=>c.disabled=true);
 }else{
  button.classList.add("wrong");fb.className="feedback bad";
  fb.innerHTML="<b>💗 Casi.</b> Inténtalo otra vez. Lee la pista o escucha la frase y vuelve a elegir.";
  saveState();
 }
}
function nextLesson(){
 const index=lessons.findIndex(l=>l.id===currentLesson.id);
 if(index<lessons.length-1)openLesson(lessons[index+1].id);
 else{showPage("progress");showToast("¡Completaste todas las lecciones Starter! 👑");}
}
function speakCurrent(){
 if(!currentLesson)return;
 if(!("speechSynthesis" in window)){showToast("Este navegador no ofrece audio de voz.");return;}
 window.speechSynthesis.cancel();
 const utterance=new SpeechSynthesisUtterance(currentLesson.en);utterance.lang="en-US";utterance.rate=.82;
 window.speechSynthesis.speak(utterance);
}
function showHint(){
 if(!currentLesson)return;
 const fb=document.getElementById("feedback");fb.className="feedback";fb.innerHTML="<b>💡 Pista:</b> "+escapeHtml(currentLesson.hint);
}
function startMic(){
 const SpeechRecognition=window.SpeechRecognition||window.webkitSpeechRecognition;
 const box=document.getElementById("micResult");box.className="feedback";
 if(!SpeechRecognition){box.textContent="Tu navegador no admite reconocimiento de voz aquí. Prueba Chrome o Edge, preferiblemente desde localhost o HTTPS, y permite el micrófono.";return;}
 const recognition=new SpeechRecognition();recognition.lang="en-US";recognition.interimResults=false;recognition.maxAlternatives=1;
 box.textContent="Te escucho… Di la frase en inglés.";
 recognition.onresult=event=>{
  const said=event.results[0][0].transcript;
  box.innerHTML="<b>He entendido:</b> “"+escapeHtml(said)+"”<br><small>Compárala con la frase de referencia y vuelve a intentarlo si quieres. El reconocimiento puede equivocarse y no mide el acento con precisión.</small>";
 };
 recognition.onerror=event=>{box.textContent="No pude reconocer la voz ("+event.error+"). Revisa el permiso del micrófono e inténtalo de nuevo.";};
 recognition.onend=()=>{};
 try{recognition.start();}catch(e){box.textContent="No se pudo iniciar el micrófono. Espera un momento y vuelve a intentarlo.";}
}
function escapeHtml(value){return String(value).replace(/[&<>"']/g,char=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char]));}
function showToast(message){
 const el=document.getElementById("toast");el.textContent=message;el.classList.remove("hidden");
 clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.add("hidden"),2800);
}
function resetProgress(){
 if(!window.confirm("¿Seguro que quieres borrar tu progreso guardado en este navegador?"))return;
 state={...defaultState,done:[],attempts:{}};saveState();renderLessons();showToast("Tu progreso se ha reiniciado 💗");
}
document.addEventListener("click",event=>{
 const lessonButton=event.target.closest("[data-open-lesson]");
 if(lessonButton){openLesson(lessonButton.dataset.openLesson);return;}
 const nav=event.target.closest("[data-page]");
 if(nav){event.preventDefault();showPage(nav.dataset.page);return;}
 const goto=event.target.closest("[data-goto]");
 if(goto){showPage(goto.dataset.goto);return;}
 const answer=event.target.closest("[data-answer]");
 if(answer){checkAnswer(Number(answer.dataset.answer),answer);}
});
document.getElementById("continueButton").addEventListener("click",()=>openLesson(lessons.find(l=>!state.done.includes(l.id))?.id||lessons[0].id));
document.getElementById("profileButton").addEventListener("click",()=>showPage("progress"));
document.getElementById("backToLessons").addEventListener("click",()=>showPage("lessons"));
document.getElementById("speakBtn").addEventListener("click",speakCurrent);
document.getElementById("speakAgain").addEventListener("click",speakCurrent);
document.getElementById("hintButton").addEventListener("click",showHint);
document.getElementById("micBtn").addEventListener("click",startMic);
document.getElementById("resetButton").addEventListener("click",resetProgress);
renderLessons();renderStats();
