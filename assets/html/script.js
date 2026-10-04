const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

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

function showToast(message) {
  const toast = $("#toast");
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(window.__toastTimer);
  window.__toastTimer = setTimeout(() => toast.classList.remove("show"), 1800);
}

function storageGet(key, fallback = null) {
  try { return localStorage.getItem(key) ?? fallback; }
  catch { return fallback; }
}

function storageSet(key, value) {
  try { localStorage.setItem(key, value); return true; }
  catch { return false; }
}


function updateProgress() {
  const done = checks.reduce((count, _, i) => count + (storageGet(`ra1v2-check-${i}`) === "1" ? 1 : 0), 0);
  const pct = Math.round((done / checks.length) * 100);
  const values = {
    "#checkLabel": `${done} de ${checks.length} tareas`,
    "#checkPct": `${pct}%`,
    "#heroPct": `${pct}%`
  };
  Object.entries(values).forEach(([selector, value]) => {
    const el = $(selector);
    if (el) el.textContent = value;
  });
  ["#checkBar", "#heroProgress"].forEach(selector => {
    const el = $(selector);
    if (el) el.style.width = `${pct}%`;
  });
}

function renderChecks() {
  const list = $("#checklist");
  if (!list) return;
  list.innerHTML = checks.map((label, i) => {
    const done = storageGet(`ra1v2-check-${i}`) === "1";
    return `<div class="check ${done ? "done" : ""}">
      <input type="checkbox" id="chk-${i}" ${done ? "checked" : ""}>
      <label for="chk-${i}">${label}</label>
    </div>`;
  }).join("");

  $$("input[type=checkbox]", list).forEach((input, i) => {
    input.addEventListener("change", () => {
      storageSet(`ra1v2-check-${i}`, input.checked ? "1" : "0");
      input.closest(".check")?.classList.toggle("done", input.checked);
      updateProgress();
      showToast("Checklist actualizado");
    });
  });
  updateProgress();
}

function setupNavigation() {
  $$('[data-target]').forEach(button => {
    button.addEventListener("click", () => {
      const target = document.getElementById(button.dataset.target);
      if (target) target.scrollIntoView({ behavior: "smooth" });
      $$("#navlinks button").forEach(item => item.classList.remove("active"));
      button.classList.add("active");
      $("#navlinks")?.classList.remove("open");
    });
  });

  const ids = ["inicio", "aplicacion", "lenguajes", "arquitectura", "datos", "extras"];
  const updateActive = () => {
    let current = "inicio";
    for (const id of ids) {
      const section = document.getElementById(id);
      if (section && window.scrollY >= section.offsetTop - 130) current = id;
    }
    $$("#navlinks button").forEach(button => button.classList.toggle("active", button.dataset.target === current));
  };
  document.addEventListener("scroll", updateActive, { passive: true });
  updateActive();
}

function setupMobileMenu() {
  const button = $("#mobileMenu");
  const nav = $("#navlinks");
  if (!button || !nav) return;
  button.setAttribute("aria-expanded", "false");
  button.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    button.setAttribute("aria-expanded", String(open));
  });
}

const languages = ["Python", "JavaScript / Node.js", "R", "C++", "PHP", "Java"];
const criteria = [
  ["Facilidad de aprendizaje", 1.0], ["Legibilidad", 1.0], ["Mantenimiento", 1.0],
  ["Integración web / APIs / BD", 1.0], ["Trabajo con datos", 1.0], ["Análisis estadístico", 0.8],
  ["Bibliotecas y modelos IA", 1.2], ["Modelos preentrenados", 1.0],
  ["Rendimiento / despliegue", 1.0], ["Interfaz web", 0.8]
];
const exampleScores = [
  [9,9,7,5,8,8], [9,8,8,6,8,8], [9,9,8,7,7,8], [9,8,8,8,7,9],
  [9,8,7,7,8,8], [9,8,8,9,6,9], [10,9,8,8,4,8], [10,9,8,8,4,8],
  [8,9,7,10,7,9], [7,10,5,6,10,8]
];

function renderMatrix() {
  const matrix = $("#matrix");
  if (!matrix) return;
  const head = `<thead><tr><th>Criterio</th><th>Peso</th>${languages.map(name => `<th>${name}</th>`).join("")}</tr></thead>`;
  const body = criteria.map((criterion, i) => `<tr>
    <td><strong>${criterion[0]}</strong></td>
    <td><input data-weight="${i}" type="number" min="0" max="5" step="0.1" value="${criterion[1]}" aria-label="Peso ${criterion[0]}"></td>
    ${languages.map((name, j) => `<td><input data-score="${i}-${j}" type="number" min="1" max="10" step="1" value="${exampleScores[i][j]}" aria-label="Puntuación ${name} en ${criterion[0]}"></td>`).join("")}
  </tr>`).join("");
  const foot = `<tfoot><tr><td><strong>Puntuación ponderada</strong></td><td>—</td>${languages.map((_, j) => `<td id="total-${j}">0</td>`).join("")}</tr></tfoot>`;
  matrix.innerHTML = `${head}<tbody>${body}</tbody>${foot}`;
  updateMatrix();
  matrix.addEventListener("input", updateMatrix);
}

function updateMatrix() {
  const matrix = $("#matrix");
  if (!matrix) return;
  const totals = languages.map(() => 0);
  criteria.forEach((_, i) => {
    const weight = Number($(`[data-weight="${i}"]`, matrix)?.value || 0);
    languages.forEach((_, j) => {
      const score = Number($(`[data-score="${i}-${j}"]`, matrix)?.value || 0);
      totals[j] += weight * score;
    });
  });
  totals.forEach((value, j) => {
    const cell = $(`#total-${j}`, matrix);
    if (cell) cell.textContent = value.toFixed(1);
  });
}

function latestRowsFromTrendData() {
  const data = window.__TREND_DATA__ || {};
  const web = data.web || [];
  const youtube = data.youtube || [];
  const webLast = web.at(-1) || {};
  const ytLast = youtube.at(-1) || {};
  return languages.map(language => [
    language,
    Number(webLast[language.replace(" / Node.js", "")] ?? 0),
    Number(ytLast[language.replace(" / Node.js", "")] ?? 0)
  ]);
}

let trendLatest = latestRowsFromTrendData();
let selectedTrendLanguage = "Python";

function parseCSVLine(line) {
  const cells = [];
  let current = "";
  let quoted = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (quoted && line[i + 1] === '"') { current += '"'; i++; }
      else quoted = !quoted;
    } else if (char === "," && !quoted) {
      cells.push(current.trim()); current = "";
    } else current += char;
  }
  cells.push(current.trim());
  return cells;
}

function parseTrendCSV(text) {
  const lines = text.replace(/^\uFEFF/, "").trim().split(/\r?\n/).filter(Boolean);
  if (lines.length < 2) return null;
  const headers = parseCSVLine(lines[0]).map(value => value.toLowerCase());
  const iL = headers.indexOf("lenguaje"), iW = headers.indexOf("web"), iY = headers.indexOf("youtube");
  if (iL < 0 || iW < 0 || iY < 0) return null;
  const parsed = lines.slice(1).map(line => {
    const row = parseCSVLine(line);
    const web = Number(row[iW]), youtube = Number(row[iY]);
    if (!row[iL] || !Number.isFinite(web) || !Number.isFinite(youtube)) return null;
    return [row[iL], Math.max(0, Math.min(100, web)), Math.max(0, Math.min(100, youtube))];
  }).filter(Boolean);
  return parsed.length ? parsed : null;
}

function prepareCanvas(canvas, minWidth = 320, minHeight = 220) {
  if (!canvas) return null;
  const box = canvas.parentElement.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;
  const width = Math.max(minWidth, box.width - 4);
  const height = Math.max(minHeight, box.height - 4);
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  const ctx = canvas.getContext("2d");
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, width, height);
  return { ctx, width, height };
}

function drawGrid(ctx, width, height, pad) {
  const plotHeight = height - pad.t - pad.b;
  ctx.strokeStyle = "#e1e9eb";
  ctx.lineWidth = 1;
  ctx.fillStyle = "#7b8d95";
  ctx.font = "10px system-ui";
  for (let value = 0; value <= 100; value += 20) {
    const y = pad.t + plotHeight - (value / 100) * plotHeight;
    ctx.beginPath(); ctx.moveTo(pad.l, y); ctx.lineTo(width - pad.r, y); ctx.stroke();
    ctx.fillText(String(value), 8, y + 3);
  }
}

function drawLatestTrend() {
  const canvas = $("#trendChart");
  const prepared = prepareCanvas(canvas);
  if (!prepared) return;
  const { ctx, width: W, height: H } = prepared;
  const pad = { l: 34, r: 12, t: 20, b: 52 };
  const iw = W - pad.l - pad.r, ih = H - pad.t - pad.b;
  drawGrid(ctx, W, H, pad);

  const groupWidth = iw / Math.max(1, trendLatest.length);
  const barWidth = Math.min(22, groupWidth / 3);
  trendLatest.forEach((row, i) => {
    const center = pad.l + groupWidth * i + groupWidth / 2;
    [
      { value: row[1], color: getCSS("--green"), x: center - barWidth - 2 },
      { value: row[2], color: getCSS("--blue"), x: center + 2 }
    ].forEach(bar => {
      const h = (bar.value / 100) * ih;
      ctx.fillStyle = bar.color;
      ctx.fillRect(bar.x, pad.t + ih - h, barWidth, h);
      ctx.fillStyle = "#42606a";
      ctx.font = "9px system-ui";
      ctx.textAlign = "center";
      ctx.fillText(String(bar.value), bar.x + barWidth / 2, pad.t + ih - h - 5);
    });
    ctx.fillStyle = "#42606a";
    ctx.font = "9px system-ui";
    ctx.textAlign = "center";
    ctx.fillText(row[0].replace(" / Node.js", " JS"), center, H - 14);
  });
  ctx.textAlign = "left";
}

function getHistory(language) {
  const key = language === "JavaScript / Node.js" ? "JavaScript" : language;
  const web = window.__TREND_DATA__?.web || [];
  const youtube = window.__TREND_DATA__?.youtube || [];
  const ytMap = new Map(youtube.map(row => [row.Time, Number(row[key]) || 0]));
  return web.filter(row => ytMap.has(row.Time)).map(row => ({
    date: row.Time,
    web: Number(row[key]) || 0,
    youtube: ytMap.get(row.Time)
  }));
}

function drawHistoryTrend() {
  const canvas = $("#trendHistoryChart");
  const prepared = prepareCanvas(canvas, 320, 220);
  if (!prepared) return;
  const { ctx, width: W, height: H } = prepared;
  const data = getHistory(selectedTrendLanguage);
  if (!data.length) return;
  const pad = { l: 36, r: 14, t: 18, b: 35 };
  const iw = W - pad.l - pad.r, ih = H - pad.t - pad.b;
  drawGrid(ctx, W, H, pad);
  const x = i => pad.l + (i / Math.max(1, data.length - 1)) * iw;
  const plot = (field, color) => {
    ctx.strokeStyle = color; ctx.lineWidth = 2.2; ctx.beginPath();
    data.forEach((row, i) => {
      const y = pad.t + ih - (Math.max(0, Math.min(100, row[field])) / 100) * ih;
      i ? ctx.lineTo(x(i), y) : ctx.moveTo(x(i), y);
    });
    ctx.stroke();
  };
  plot("web", getCSS("--green"));
  plot("youtube", getCSS("--blue"));
  ctx.fillStyle = "#667c85"; ctx.font = "9px system-ui"; ctx.textAlign = "center";
  [0, Math.floor(data.length / 2), data.length - 1].forEach(i => {
    const label = data[i].date.slice(0, 7);
    ctx.fillText(label, x(i), H - 12);
  });
  ctx.textAlign = "left";
}

function getCSS(name) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

function setupTrends() {
  const selector = $("#trendLanguage");
  if (selector) {
    selector.innerHTML = languages.map(language => `<option value="${language}">${language}</option>`).join("");
    selector.value = selectedTrendLanguage;
    selector.addEventListener("change", () => {
      selectedTrendLanguage = selector.value;
      drawHistoryTrend();
    });
  }
  drawLatestTrend();
  drawHistoryTrend();

  const fileInput = $("#csvFile");
  if (fileInput) {
    fileInput.addEventListener("change", async event => {
      const file = event.target.files?.[0];
      if (!file) return;
      const text = await file.text();
      const parsed = parseTrendCSV(text);
      if (!parsed) { showToast("CSV no válido: usa lenguaje,web,youtube"); return; }
      trendLatest = parsed;
      const dataBox = $("#csvData");
      if (dataBox) dataBox.textContent = parsed.map(row => row.join(",")).join("\n");
      drawLatestTrend();
      showToast("CSV cargado en el gráfico");
    });
  }
  window.addEventListener("resize", () => { drawLatestTrend(); drawHistoryTrend(); });
}


function setupBackToTop() {
  $("#backtop")?.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
}

function setupDiagramZoom() {
  const modal = $("#diagramModal");
  const image = $("#diagramModalImage");
  const title = $("#diagramModalTitle");
  const close = () => {
    if (!modal) return;
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
    if (image) { image.src = ""; image.alt = ""; }
  };
  $$(".diagram-zoom").forEach(button => {
    button.addEventListener("click", () => {
      if (!modal || !image) return;
      image.src = button.dataset.diagram || "";
      image.alt = button.querySelector("img")?.alt || "Diagrama ampliado";
      if (title) title.textContent = button.dataset.title || "Vista ampliada";
      modal.classList.add("open");
      modal.setAttribute("aria-hidden", "false");
      document.body.classList.add("modal-open");
      $("#closeDiagram")?.focus();
    });
  });
  $("#closeDiagram")?.addEventListener("click", close);
  $$('[data-close-diagram]').forEach(el => el.addEventListener("click", close));
  document.addEventListener("keydown", event => { if (event.key === "Escape" && modal?.classList.contains("open")) close(); });
}


document.addEventListener("DOMContentLoaded", () => {
  renderChecks();
  setupNavigation();
  setupMobileMenu();
  renderMatrix();
  setupTrends();
  setupBackToTop();
  setupDiagramZoom();
});
