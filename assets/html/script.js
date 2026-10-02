const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];

const checks = [
  "Matriculator definido con problema, entradas, imágenes, procesamiento, salidas y límite humano",
  "Comparación de Python, JavaScript/Node.js, R, C++, PHP y Java",
  "Google Trends: CSV web + YouTube del proyecto integrados en la web",
  "Gráfico de Trends generado dentro del HTML",
  "Matriz de decisión completada y revisada",
  "Lenguaje principal de aplicación justificado",
  "Lenguaje principal de IA justificado",
  "Descarte razonado de alternativas",
  "Diagrama de flujo general de 6–10 etapas",
  "Diagrama antes de integrar/entrenar",
  "Diagrama después de entrenar/integrar",
  "Pseudocódigo de 20–50 líneas en notebook y reflejado en la web",
  "HTML, XML, JSON, Markdown y CSV explicados",
  "Preguntas adicionales incorporadas al README",
  "Fuentes con título, entidad, URL y fecha de consulta",
  "Evidencias de IA: prompts, cambios, uso y reflexión"
];

function showToast(text){
  const t=$("#toast");
  t.textContent=text;
  t.classList.add("show");
  clearTimeout(window._toast);
  window._toast=setTimeout(()=>t.classList.remove("show"),1800);
}

function updateProgress(){
  const done=checks.reduce((n,_,i)=>n+(localStorage.getItem("ra1v2-check-"+i)==="1"?1:0),0);
  const pct=Math.round(done/checks.length*100);
  $("#checkLabel").textContent=`${done} de ${checks.length} tareas`;
  $("#checkPct").textContent=pct+"%";
  $("#checkBar").style.width=pct+"%";
  $("#heroPct").textContent=pct+"%";
  $("#heroProgress").style.width=pct+"%";
}

function renderChecks(){
  $("#checklist").innerHTML=checks.map((text,i)=>{
    const done=localStorage.getItem("ra1v2-check-"+i)==="1";
    return `<div class="check ${done?"done":""}">
      <input type="checkbox" id="chk-${i}" ${done?"checked":""}>
      <label for="chk-${i}">${text}</label>
    </div>`;
  }).join("");

  $$("#checklist input").forEach((el,i)=>{
    el.addEventListener("change",()=>{
      localStorage.setItem("ra1v2-check-"+i,el.checked?"1":"0");
      el.closest(".check").classList.toggle("done",el.checked);
      updateProgress();
      showToast("Checklist actualizado");
    });
  });
  updateProgress();
}
renderChecks();

$$("[data-target]").forEach(btn=>{
  btn.addEventListener("click",()=>{
    const el=document.getElementById(btn.dataset.target);
    if(el)el.scrollIntoView({behavior:"smooth"});
    $$("#navlinks button").forEach(x=>x.classList.remove("active"));
    btn.classList.add("active");
  });
});

document.addEventListener("scroll",()=>{
  const ids=["inicio","aplicacion","lenguajes","arquitectura","datos","extras","entrega"];
  let current="inicio";
  for(const id of ids){
    const el=document.getElementById(id);
    if(el && window.scrollY>=el.offsetTop-120) current=id;
  }
  $$("#navlinks button").forEach(btn=>btn.classList.toggle("active",btn.dataset.target===current));
});

$("#print").addEventListener("click",()=>window.print());
$("#reset").addEventListener("click",()=>{
  checks.forEach((_,i)=>localStorage.removeItem("ra1v2-check-"+i));
  renderChecks();
  showToast("Checklist reiniciado");
});
$("#backtop").addEventListener("click",()=>window.scrollTo({top:0,behavior:"smooth"}));

$("#appTabs").addEventListener("click",e=>{
  const btn=e.target.closest("button[data-app]");
  if(!btn)return;
  $$("#appTabs button").forEach(b=>b.classList.remove("active"));
  btn.classList.add("active");
  $("#appAula").style.display=btn.dataset.app==="aula"?"grid":"none";
  $("#appMatri").style.display=btn.dataset.app==="matri"?"grid":"none";
});
$("#appMatri").style.display="grid";
$("#appAula").style.display="none";

const languages=["Python","JavaScript / Node.js","R","C++","PHP","Java"];
const criteria=[
  ["Facilidad de aprendizaje",1.0],
  ["Legibilidad",1.0],
  ["Mantenimiento",1.0],
  ["Integración web / APIs / BD",1.0],
  ["Trabajo con datos",1.0],
  ["Análisis estadístico",0.8],
  ["Bibliotecas y modelos IA",1.2],
  ["Modelos preentrenados",1.0],
  ["Rendimiento / despliegue",1.0],
  ["Interfaz web",0.8]
];
const exampleScores=[
  [9,9,7,5,8,8],
  [9,8,8,6,8,8],
  [9,9,8,7,7,8],
  [9,8,8,8,7,9],
  [9,8,7,7,8,8],
  [9,8,8,9,6,9],
  [10,9,8,8,4,8],
  [10,9,8,8,4,8],
  [8,9,7,10,7,9],
  [7,10,5,6,10,8]
];

function renderMatrix(){
  const head=`<thead><tr><th>Criterio</th><th>Peso</th>${languages.map(x=>`<th>${x}</th>`).join("")}</tr></thead>`;
  const body=criteria.map((c,i)=>{
    return `<tr>
      <td><strong>${c[0]}</strong></td>
      <td><input data-weight="${i}" type="number" min="0" max="5" step="0.1" value="${c[1]}"></td>
      ${languages.map((l,j)=>`<td><input data-score="${i}-${j}" type="number" min="1" max="10" value="${exampleScores[i][j]}"></td>`).join("")}
    </tr>`;
  }).join("");
  const foot=`<tfoot><tr><td><strong>Puntuación ponderada</strong></td><td>—</td>${languages.map((l,j)=>`<td id="total-${j}">0</td>`).join("")}</tr></tfoot>`;
  $("#matrix").innerHTML=head+"<tbody>"+body+"</tbody>"+foot;
  updateMatrix();
}
function updateMatrix(){
  const totals=languages.map(()=>0);
  criteria.forEach((_,i)=>{
    const w=Number(document.querySelector(`[data-weight="${i}"]`)?.value||0);
    languages.forEach((_,j)=>{
      const s=Number(document.querySelector(`[data-score="${i}-${j}"]`)?.value||0);
      totals[j]+=w*s;
    });
  });
  totals.forEach((v,j)=>$("#total-"+j).textContent=v.toFixed(1));
}
renderMatrix();
$("#matrix").addEventListener("input",updateMatrix);

// Último dato disponible en los CSV incluidos en el ZIP: 2026-09.
let trendData=[
  ["Python",20,63],["JavaScript",10,22],["R",3,19],["C++",4,11],["PHP",3,4],["Java",10,65]
];

function parseTrendCSV(text){
  const rows=text.trim().split(/\r?\n/).filter(Boolean).map(r=>r.split(",").map(x=>x.trim()));
  if(rows.length<2)return null;
  const headers=rows[0].map(x=>x.toLowerCase());
  const iL=headers.indexOf("lenguaje"), iW=headers.indexOf("web"), iY=headers.indexOf("youtube");
  if(iL<0||iW<0||iY<0)return null;
  return rows.slice(1).map(r=>[r[iL],Number(r[iW])||0,Number(r[iY])||0]);
}

function drawTrend(){
  const canvas=$("#trendChart");
  const box=canvas.parentElement.getBoundingClientRect();
  const dpr=window.devicePixelRatio||1;
  const W=Math.max(300,box.width-4), H=Math.max(220,box.height-4);
  canvas.width=W*dpr;canvas.height=H*dpr;
  const ctx=canvas.getContext("2d");
  ctx.scale(dpr,dpr);
  ctx.clearRect(0,0,W,H);

  const pad={l:40,r:16,t:20,b:48};
  const iw=W-pad.l-pad.r, ih=H-pad.t-pad.b;

  ctx.strokeStyle="#e1e9eb";ctx.lineWidth=1;ctx.fillStyle="#7b8d95";ctx.font="10px system-ui";
  for(let y=0;y<=100;y+=20){
    const py=pad.t+ih-(y/100)*ih;
    ctx.beginPath();ctx.moveTo(pad.l,py);ctx.lineTo(W-pad.r,py);ctx.stroke();
    ctx.fillText(String(y),10,py+3);
  }

  const n=Math.max(1,trendData.length-1);
  const x=i=>pad.l+(i/n)*iw;
  const plot=(idx,color,offset)=>{
    ctx.strokeStyle=color;ctx.lineWidth=2.6;ctx.beginPath();
    trendData.forEach((r,i)=>{
      const val=Math.max(0,Math.min(100,Number(r[idx])));
      const py=pad.t+ih-(val/100)*ih+offset;
      i?ctx.lineTo(x(i),py):ctx.moveTo(x(i),py);
    });
    ctx.stroke();
    trendData.forEach((r,i)=>{
      const val=Math.max(0,Math.min(100,Number(r[idx])));
      const py=pad.t+ih-(val/100)*ih+offset;
      ctx.fillStyle=color;ctx.beginPath();ctx.arc(x(i),py,4,0,Math.PI*2);ctx.fill();
    });
  };

  plot(1,getComputedStyle(document.documentElement).getPropertyValue("--green").trim(),0);
  plot(2,getComputedStyle(document.documentElement).getPropertyValue("--blue").trim(),3);

  ctx.fillStyle="#42606a";ctx.font="10px system-ui";ctx.textAlign="center";
  trendData.forEach((r,i)=>ctx.fillText(r[0],x(i),H-16));
  ctx.textAlign="left";
}
drawTrend();
window.addEventListener("resize",drawTrend);

$("#csvFile").addEventListener("change",async e=>{
  const file=e.target.files?.[0];
  if(!file)return;
  const text=await file.text();
  const parsed=parseTrendCSV(text);
  if(!parsed){showToast("CSV no válido");return}
  trendData=parsed;
  $("#csvData").textContent=text.slice(0,1200);
  drawTrend();
  showToast("CSV cargado en el gráfico");
});

$("#mobileMenu").addEventListener("click",()=>{
  const nav=$("#navlinks");
  const visible=nav.style.display==="flex";
  nav.style.display=visible?"none":"flex";
  if(!visible){
    nav.style.position="absolute";
    nav.style.top="67px";
    nav.style.left="12px";
    nav.style.right="12px";
    nav.style.padding="10px";
    nav.style.background="rgba(255,255,255,.98)";
    nav.style.border="1px solid var(--line)";
    nav.style.borderRadius="14px";
    nav.style.boxShadow="var(--shadow)";
  }
});