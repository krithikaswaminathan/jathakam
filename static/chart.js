const DASA_LEVEL_ORDER = ["mahadasa", "antardasa", "antaram", "sookshma", "prana"];

const GRID_POSITIONS = [
  { rasi: 11, row: 1, col: 1 }, { rasi: 0, row: 1, col: 2 }, { rasi: 1, row: 1, col: 3 }, { rasi: 2, row: 1, col: 4 },
  { rasi: 10, row: 2, col: 1 }, { rasi: 3, row: 2, col: 4 },
  { rasi: 9, row: 3, col: 1 }, { rasi: 4, row: 3, col: 4 },
  { rasi: 8, row: 4, col: 1 }, { rasi: 7, row: 4, col: 2 }, { rasi: 6, row: 4, col: 3 }, { rasi: 5, row: 4, col: 4 },
];

let state = {
  lang: "en",
  chart: null,
  varga: "D1",
  selectedPlace: null, // { label, latitude, longitude, timezone }
};

function L() {
  return LABELS[state.lang];
}

function nextDasaLevel(level) {
  const idx = DASA_LEVEL_ORDER.indexOf(level);
  return idx >= 0 && idx < DASA_LEVEL_ORDER.length - 1 ? DASA_LEVEL_ORDER[idx + 1] : null;
}

function fmtDate(iso) {
  return iso.slice(0, 10);
}

// --- Language ---

function applyLanguage() {
  const labels = L();
  document.getElementById("pageTitle").textContent = labels.ui.title;
  document.getElementById("pageTagline").textContent = labels.ui.tagline;
  document.getElementById("lblFormTitle").textContent = labels.ui.newChart;
  document.getElementById("lblName").textContent = labels.ui.name;
  document.getElementById("lblGender").textContent = labels.ui.gender;
  document.getElementById("optMale").textContent = labels.ui.male;
  document.getElementById("optFemale").textContent = labels.ui.female;
  document.getElementById("optOther").textContent = labels.ui.other;
  document.getElementById("lblDob").textContent = labels.ui.dob;
  document.getElementById("lblTob").textContent = labels.ui.tob;
  document.getElementById("lblPob").textContent = labels.ui.pob;
  document.getElementById("pob").placeholder = labels.ui.pobPlaceholder;
  document.getElementById("btnCalculate").textContent = labels.ui.calculate;
  document.getElementById("lblSavedCharts").textContent = labels.ui.savedCharts;
  document.getElementById("lblChartTab").textContent = labels.ui.chartTab;
  document.getElementById("lblDasaTab").textContent = labels.ui.dasaTab;
  document.getElementById("lblYogaTab").textContent = labels.ui.yogaTab;
  document.getElementById("lblTaraTab").textContent = labels.ui.taraTab;

  renderSavedList(state.savedCharts || []);
  if (state.chart) renderAll();
}

// --- Saved charts ---

async function loadSavedCharts() {
  const res = await fetch("/api/charts");
  state.savedCharts = await res.json();
  renderSavedList(state.savedCharts);
}

function renderSavedList(list) {
  const ul = document.getElementById("savedList");
  ul.innerHTML = "";
  for (const c of list) {
    const li = document.createElement("li");
    const span = document.createElement("span");
    span.textContent = `${c.name} — ${c.dob}`;
    const btn = document.createElement("button");
    btn.textContent = L().ui.loadChart;
    btn.onclick = () => loadChart(c.id);
    li.append(span, btn);
    ul.appendChild(li);
  }
}

async function loadChart(id) {
  const res = await fetch(`/api/charts/${id}`);
  state.chart = await res.json();
  state.varga = "D1";
  document.getElementById("resultSection").classList.remove("hidden");
  renderAll();
}

// --- Place of Birth search ---

let pobSearchTimer = null;

const pobInput = document.getElementById("pob");
const pobResultsEl = document.getElementById("pobResults");

pobInput.addEventListener("input", () => {
  state.selectedPlace = null; // typing invalidates any prior selection
  const query = pobInput.value.trim();
  clearTimeout(pobSearchTimer);
  if (query.length < 2) {
    pobResultsEl.classList.add("hidden");
    pobResultsEl.innerHTML = "";
    return;
  }
  pobSearchTimer = setTimeout(() => runPobSearch(query), 300);
});

document.addEventListener("click", (e) => {
  if (!e.target.closest(".pob-field")) {
    pobResultsEl.classList.add("hidden");
  }
});

async function runPobSearch(query) {
  const res = await fetch(`/api/geocode?query=${encodeURIComponent(query)}`);
  const places = await res.json();
  pobResultsEl.innerHTML = "";
  if (places.length === 0) {
    const li = document.createElement("li");
    li.className = "pob-no-results";
    li.textContent = L().ui.pobNoResults;
    pobResultsEl.appendChild(li);
  } else {
    for (const place of places) {
      const li = document.createElement("li");
      li.textContent = place.label;
      li.addEventListener("click", () => {
        state.selectedPlace = place;
        pobInput.value = place.label;
        pobResultsEl.classList.add("hidden");
      });
      pobResultsEl.appendChild(li);
    }
  }
  pobResultsEl.classList.remove("hidden");
}

// --- Form ---

document.getElementById("birthForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!state.selectedPlace) {
    alert(L().ui.pobSelectPrompt);
    return;
  }
  const body = {
    name: document.getElementById("name").value,
    gender: document.getElementById("gender").value,
    dob: document.getElementById("dob").value,
    tob: document.getElementById("tob").value,
    pob_label: state.selectedPlace.label,
    latitude: state.selectedPlace.latitude,
    longitude: state.selectedPlace.longitude,
    timezone: state.selectedPlace.timezone,
  };
  const res = await fetch("/api/chart", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    alert("Error computing chart: " + (await res.text()));
    return;
  }
  state.chart = await res.json();
  state.varga = "D1";
  document.getElementById("resultSection").classList.remove("hidden");
  renderAll();
  loadSavedCharts();
});

document.getElementById("langToggle").addEventListener("change", (e) => {
  state.lang = e.target.value;
  applyLanguage();
});

// --- Tabs ---

document.querySelectorAll(".tab-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".tab-btn").forEach((b) => b.classList.remove("active"));
    document.querySelectorAll(".tab-panel").forEach((p) => p.classList.remove("active"));
    btn.classList.add("active");
    document.getElementById(btn.dataset.tab).classList.add("active");
  });
});

// --- Rendering ---

function renderAll() {
  renderVargaSelect();
  renderGrid();
  renderDasaTable();
  renderYogas();
  renderTaraBalam();
}

function renderVargaSelect() {
  const select = document.getElementById("vargaSelect");
  select.innerHTML = "";
  const options = ["D1", ...Object.keys(state.chart.vargas)];
  for (const v of options) {
    const opt = document.createElement("option");
    opt.value = v;
    opt.textContent = L().vargas[v] || v;
    select.appendChild(opt);
  }
  select.value = state.varga;
  select.onchange = () => {
    state.varga = select.value;
    renderGrid();
  };
}

function chartOutFor(varga) {
  return varga === "D1" ? state.chart.d1 : state.chart.vargas[varga];
}

function renderGrid() {
  const grid = document.getElementById("chartGrid");
  grid.innerHTML = "";
  const chart = chartOutFor(state.varga);
  const labels = L();

  const rasiToPlanets = {};
  for (const [name, g] of Object.entries(chart.grahas)) {
    (rasiToPlanets[g.rasi] = rasiToPlanets[g.rasi] || []).push(name);
  }

  for (const pos of GRID_POSITIONS) {
    const cell = document.createElement("div");
    cell.className = "grid-cell";
    if (pos.rasi === chart.lagna_rasi) cell.classList.add("lagna");
    cell.style.gridRow = pos.row;
    cell.style.gridColumn = pos.col;

    const nameDiv = document.createElement("div");
    nameDiv.className = "rasi-name";
    nameDiv.textContent = labels.rasi[pos.rasi];
    cell.appendChild(nameDiv);

    const planetsDiv = document.createElement("div");
    planetsDiv.className = "planets";
    for (const p of rasiToPlanets[pos.rasi] || []) {
      const span = document.createElement("span");
      span.textContent = labels.planetAbbr[p];
      planetsDiv.appendChild(span);
    }
    cell.appendChild(planetsDiv);
    grid.appendChild(cell);
  }

  const center = document.createElement("div");
  center.className = "grid-center";
  center.textContent = labels.vargas[state.varga] || state.varga;
  grid.appendChild(center);
}

function renderDasaTable() {
  const tbody = document.getElementById("dasaBody");
  tbody.innerHTML = "";
  for (const period of state.chart.mahadasas) {
    tbody.appendChild(makeDasaRow(period, 0));
  }
}

function makeDasaRow(period, depth) {
  const tr = document.createElement("tr");
  tr.className = depth === 0 ? "expandable" : `expandable child-row depth-${depth}`;
  tr.dataset.expanded = "false";

  const lordTd = document.createElement("td");
  lordTd.textContent = "  ".repeat(depth) + (L().dasaLords[period.lord] || period.lord);
  const startTd = document.createElement("td");
  startTd.textContent = fmtDate(period.start);
  const endTd = document.createElement("td");
  endTd.textContent = fmtDate(period.end);
  tr.append(lordTd, startTd, endTd);

  const next = nextDasaLevel(period.level);
  if (next) {
    tr.addEventListener("click", async () => {
      if (tr.dataset.expanded === "true") {
        collapseChildren(tr);
        tr.dataset.expanded = "false";
        return;
      }
      const res = await fetch("/api/dasa/expand", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lord: period.lord, start: period.start, end: period.end, next_level: next }),
      });
      const children = await res.json();
      let anchor = tr;
      for (const child of children) {
        const childRow = makeDasaRow(child, depth + 1);
        childRow.dataset.parentDepth = depth;
        anchor.after(childRow);
        anchor = childRow;
      }
      tr.dataset.expanded = "true";
    });
  }
  return tr;
}

function collapseChildren(parentRow) {
  let next = parentRow.nextElementSibling;
  while (next && Number(next.className.match(/depth-(\d+)/)?.[1] || 0) > 0) {
    const toRemove = next;
    next = next.nextElementSibling;
    toRemove.remove();
  }
}

function renderYogas() {
  const ul = document.getElementById("yogaList");
  ul.innerHTML = "";
  const labels = L();
  for (const y of state.chart.yogas) {
    const li = document.createElement("li");
    if (y.triggered) li.classList.add("triggered");
    const title = document.createElement("strong");
    title.textContent = labels.yogas[y.name] || y.name;
    const desc = document.createElement("div");
    desc.textContent = y.description;
    li.append(title, desc);
    ul.appendChild(li);
  }
  if (state.chart.yogas.every((y) => !y.triggered)) {
    const note = document.createElement("li");
    note.textContent = labels.ui.noYogas;
    ul.appendChild(note);
  }
}

function renderTaraBalam() {
  const tbody = document.getElementById("taraBody");
  tbody.innerHTML = "";
  const labels = L();
  for (const t of state.chart.tara_balam) {
    const tr = document.createElement("tr");
    const c1 = document.createElement("td");
    c1.textContent = t.count;
    const c2 = document.createElement("td");
    c2.textContent = labels.nakshatra[t.nakshatra];
    const c3 = document.createElement("td");
    c3.textContent = labels.taraCategories[t.category];
    const c4 = document.createElement("td");
    c4.textContent = t.quality;
    c4.className = "quality-" + t.quality;
    tr.append(c1, c2, c3, c4);
    tbody.appendChild(tr);
  }
}

// --- Init ---

applyLanguage();
loadSavedCharts();
