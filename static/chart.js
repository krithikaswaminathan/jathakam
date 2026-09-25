const DASA_LEVEL_ORDER = ["mahadasa", "antardasa", "antaram", "sookshma", "prana"];

const GRID_POSITIONS = [
  { rasi: 11, row: 1, col: 1 }, { rasi: 0, row: 1, col: 2 }, { rasi: 1, row: 1, col: 3 }, { rasi: 2, row: 1, col: 4 },
  { rasi: 10, row: 2, col: 1 }, { rasi: 3, row: 2, col: 4 },
  { rasi: 9, row: 3, col: 1 }, { rasi: 4, row: 3, col: 4 },
  { rasi: 8, row: 4, col: 1 }, { rasi: 7, row: 4, col: 2 }, { rasi: 6, row: 4, col: 3 }, { rasi: 5, row: 4, col: 4 },
];

// Rahu/Ketu (nodes) are essentially always retrograde by nature (Mean Node),
// so marking them "(R)" would be noise, not information — classical charts
// only mark it for the 5 planets where it's a noteworthy, temporary state.
const NODES_NOT_MARKED_RETROGRADE = new Set(["Rahu", "Ketu"]);
const UPAGRAHA_NAMES = new Set(["Gulika", "Mandi"]);
// Inauspicious combinations: shown in a warning colour when present, not the green used for yogas.
const INAUSPICIOUS_YOGAS = new Set(["Mangal Dosha", "Kemadruma Yoga (simplified)"]);

let state = {
  lang: "en",
  chart: null,
  varga: "D1",
  selectedPlace: null, // { label, latitude, longitude, timezone }
  readingTopic: "pushkaraNavamsa",
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

function formatDMS(deg) {
  let d = Math.floor(deg);
  let mFull = (deg - d) * 60;
  let m = Math.floor(mFull);
  let s = Math.round((mFull - m) * 60);
  if (s === 60) { s = 0; m += 1; }
  if (m === 60) { m = 0; d += 1; }
  return `${d}°${String(m).padStart(2, "0")}'${String(s).padStart(2, "0")}"`;
}

function readTob24Hour() {
  const hour12 = parseInt(document.getElementById("tobHour").value, 10);
  const minute = parseInt(document.getElementById("tobMinute").value, 10);
  const ampm = document.getElementById("tobAmPm").value;
  let hour24 = hour12 % 12;
  if (ampm === "PM") hour24 += 12;
  return `${String(hour24).padStart(2, "0")}:${String(minute).padStart(2, "0")}:00`;
}

function populateTobMinutes() {
  const select = document.getElementById("tobMinute");
  for (let m = 0; m < 60; m++) {
    const opt = document.createElement("option");
    opt.value = String(m);
    opt.textContent = String(m).padStart(2, "0");
    select.appendChild(opt);
  }
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
  document.getElementById("lblDetailsTab").textContent = labels.ui.detailsTab;
  document.getElementById("thPlanet").textContent = labels.ui.colPlanet;
  document.getElementById("thRasi").textContent = labels.ui.colRasi;
  document.getElementById("thRasiLord").textContent = labels.ui.colRasiLord;
  document.getElementById("thAbsDeg").textContent = labels.ui.colAbsDeg;
  document.getElementById("thDegInSign").textContent = labels.ui.colDegInSign;
  document.getElementById("thStar").textContent = labels.ui.colStar;
  document.getElementById("thPada").textContent = labels.ui.colPada;
  document.getElementById("thStarLord").textContent = labels.ui.colStarLord;
  document.getElementById("thPushkara").textContent = labels.ui.colPushkara;
  document.getElementById("lblPranapada").textContent = labels.ui.pranapada;
  document.getElementById("pranapadaHint").textContent = labels.ui.pranapadaHint;
  document.getElementById("lblDignityTab").textContent = labels.ui.dignityTab;
  document.getElementById("thDgPlanet").textContent = labels.ui.colPlanet;
  document.getElementById("thDgState").textContent = labels.ui.colState;
  document.getElementById("thDgRasi").textContent = labels.ui.colRasi;
  document.getElementById("thDgDeg").textContent = labels.ui.colDegInSign;
  document.getElementById("thDgDeep").textContent = labels.ui.colDeep;
  document.getElementById("thDgDist").textContent = labels.ui.colDistance;
  document.getElementById("dignityNote").textContent = labels.ui.dignityNote;
  document.getElementById("lblInduLagna").textContent = labels.ui.induLagna;
  document.getElementById("lblTithi").textContent = labels.ui.tithi;
  document.getElementById("lblTithiBox").textContent = labels.ui.tithiBox;
  document.getElementById("lblSoonyam").textContent = labels.ui.soonyam;
  document.getElementById("soonyamHint").textContent = labels.ui.soonyamHint;
  document.getElementById("soonyamLegendText").textContent = labels.ui.soonyamLegend;
  document.getElementById("lblMudakku").textContent = labels.ui.mudakku;
  document.getElementById("mudakkuHint").textContent = labels.ui.mudakkuHint;
  document.getElementById("induLagnaHint").textContent = labels.ui.induLagnaHint;
  document.getElementById("lblReading").textContent = labels.ui.reading;
  document.getElementById("lblBack").textContent = labels.ui.back;
  document.querySelectorAll(".side-nav-topic").forEach((btn) => {
    btn.textContent = READING_TOPICS[btn.dataset.topic].title[state.lang];
  });
  if (!document.getElementById("readingSection").classList.contains("hidden")) {
    renderReadingPage(state.readingTopic);
  }

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
    const del = document.createElement("button");
    del.textContent = L().ui.deleteChart;
    del.className = "delete-btn";
    del.onclick = () => deleteSavedChart(c);
    const actions = document.createElement("span");
    actions.className = "saved-actions";
    actions.append(btn, del);
    li.append(span, actions);
    ul.appendChild(li);
  }
}

async function deleteSavedChart(c) {
  if (!window.confirm(`${c.name} \u2014 ${c.dob}\n\n${L().ui.deleteConfirm}`)) return;
  const res = await fetch(`/api/charts/${c.id}`, { method: "DELETE" });
  if (!res.ok && res.status !== 404) {
    alert("Could not delete chart: " + (await res.text()));
    return;
  }
  if (state.chart && state.chart.id === c.id) {
    state.chart = null;
    document.getElementById("resultSection").classList.add("hidden");
  }
  await loadSavedCharts();
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
    tob: readTob24Hour(),
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

// --- Reading / side nav ---
// The side nav is just a compact row list; clicking a row opens that topic as
// its own full-width page in the main content area, replacing the chart/form
// view (not squeezed into the narrow sidebar).

for (const key of Object.keys(READING_TOPICS)) {
  const li = document.createElement("li");
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "side-nav-topic";
  btn.dataset.topic = key;
  btn.addEventListener("click", () => {
    document.querySelectorAll(".side-nav-topic").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    state.readingTopic = key;
    showReadingPage(key);
  });
  li.appendChild(btn);
  document.getElementById("sideNavList").appendChild(li);
}

document.getElementById("readingBack").addEventListener("click", hideReadingPage);

function showReadingPage(topicKey) {
  document.getElementById("formSection").classList.add("hidden");
  document.getElementById("savedSection").classList.add("hidden");
  document.getElementById("resultSection").classList.add("hidden");
  document.getElementById("readingSection").classList.remove("hidden");
  renderReadingPage(topicKey);
}

function hideReadingPage() {
  document.getElementById("readingSection").classList.add("hidden");
  document.querySelectorAll(".side-nav-topic").forEach((b) => b.classList.remove("active"));
  document.getElementById("formSection").classList.remove("hidden");
  document.getElementById("savedSection").classList.remove("hidden");
  if (state.chart) document.getElementById("resultSection").classList.remove("hidden");
}

function renderReadingPage(topicKey) {
  const topic = READING_TOPICS[topicKey];
  const container = document.getElementById("readingContent");
  container.innerHTML = "";
  if (!topic) return;

  document.getElementById("readingTitle").textContent = topic.title[state.lang];

  const intro = document.createElement("p");
  intro.textContent = topic.intro[state.lang];
  container.appendChild(intro);

  if (topic.table) {
    const table = document.createElement("table");
    table.className = "reading-table";
    if (topic.tableHeader) {
      const headRow = document.createElement("tr");
      for (const col of topic.tableHeader) {
        const th = document.createElement("th");
        th.textContent = col[state.lang];
        headRow.appendChild(th);
      }
      table.appendChild(headRow);
    }
    for (const row of topic.table) {
      const tr = document.createElement("tr");
      for (const col of row) {
        const td = document.createElement("td");
        td.textContent = col[state.lang];
        tr.appendChild(td);
      }
      table.appendChild(tr);
    }
    container.appendChild(table);
  }

  if (topic.note) {
    const note = document.createElement("p");
    note.className = "reading-note";
    note.textContent = topic.note[state.lang];
    container.appendChild(note);
  }

  if (topic.sources && topic.sources.length) {
    const sourcesLabel = document.createElement("div");
    sourcesLabel.className = "reading-sources-label";
    sourcesLabel.textContent = L().ui.sources;
    container.appendChild(sourcesLabel);

    const ul = document.createElement("ul");
    ul.className = "reading-sources";
    for (const src of topic.sources) {
      const li = document.createElement("li");
      const a = document.createElement("a");
      a.href = src.url;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      a.textContent = src.title;
      li.appendChild(a);
      ul.appendChild(li);
    }
    container.appendChild(ul);
  }
}

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
  renderInduLagna();
  renderPranapada();
  renderTithi();
  renderMudakku();
  renderDasaTable();
  renderYogas();
  renderTaraBalam();
  renderGrahaDetails();
  renderDignity();
}

function renderPranapada() {
  const labels = L();
  const p = state.chart.pranapada;
  document.getElementById("pranapadaBox").classList.toggle("hidden", !p);
  if (!p) return;
  document.getElementById("pranapadaValue").textContent =
    `${labels.rasi[p.rasi]} ${formatDMS(p.degree_in_sign)} \u00B7 ${labels.nakshatra[p.nakshatra]} \u00B7 ${labels.ui.houseWord} ${p.house}`;
}

function tithiName(t) {
  const labels = L();
  if (t.paksha_tithi === 15) return t.paksha === "shukla" ? labels.pournami : labels.amavasai;
  return `${labels.paksha[t.paksha]} ${labels.tithiNames[t.paksha_tithi - 1]}`;
}

function renderTithi() {
  const labels = L();
  const t = state.chart.tithi;
  document.getElementById("tithiBox").classList.toggle("hidden", !t);
  if (!t) return;
  document.getElementById("tithiValue").textContent = tithiName(t);
  document.getElementById("soonyamValue").textContent = t.soonya_rasis.length
    ? t.soonya_rasis
        .map((r) => {
          const lord = labels.planets[r.lord] || r.lord;
          const planets = r.planets.map((p) => labels.planets[p] || p).join(", ");
          return `${labels.rasi[r.rasi]} (${lord}) \u00B7 ${labels.ui.houseWord} ${r.house}` + (planets ? ` \u00B7 ${planets}` : "");
        })
        .join("; ")
    : labels.ui.soonyamNone;
}

function renderMudakku() {
  const labels = L();
  const m = state.chart.mudakku;
  document.getElementById("mudakkuBox").classList.toggle("hidden", !m);
  if (!m) return;
  const planet = (p) => labels.planets[p] || p;
  const planets = m.planets.map(planet).join(", ");
  document.getElementById("mudakkuValue").textContent =
    `${labels.rasi[m.rasi]} (${planet(m.rasi_lord)}) \u00B7 ${labels.nakshatra[m.nakshatra]} ${labels.ui.padaWord} ${m.pada} (${labels.ui.starLordWord} ${planet(m.star_lord)}) \u00B7 ${labels.ui.houseWord} ${m.house}` +
    (planets ? ` \u00B7 ${planets}` : "");
  document.getElementById("mudakkuLagnaNote").textContent = m.is_lagna ? labels.ui.mudakkuLagna : "";
}

function renderInduLagna() {
  const labels = L();
  const rasiName = labels.rasi[state.chart.indu_lagna_rasi];
  const lordName = labels.planets[state.chart.indu_lagna_lord] || state.chart.indu_lagna_lord;
  document.getElementById("induLagnaValue").textContent = `${rasiName} (${lordName})`;
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
    (rasiToPlanets[g.rasi] = rasiToPlanets[g.rasi] || []).push(g);
  }
  if (state.varga === "D1") {
    // Gulika/Mandi are only computed for D1, not per-varga
    for (const upagraha of [state.chart.gulika, state.chart.mandi]) {
      (rasiToPlanets[upagraha.rasi] = rasiToPlanets[upagraha.rasi] || []).push(upagraha);
    }
  }

  // Thithi Soonyam is sign-based and read from the D1 chart only
  const soonyaRasis = new Set(
    state.varga === "D1" && state.chart.tithi ? state.chart.tithi.soonya_rasis.map((r) => r.rasi) : []
  );
  document.getElementById("soonyamLegend").classList.toggle("hidden", soonyaRasis.size === 0);

  for (const pos of GRID_POSITIONS) {
    const cell = document.createElement("div");
    cell.className = "grid-cell";
    if (pos.rasi === chart.lagna_rasi) cell.classList.add("lagna");
    if (soonyaRasis.has(pos.rasi)) cell.classList.add("soonyam");
    cell.style.gridRow = pos.row;
    cell.style.gridColumn = pos.col;

    const nameDiv = document.createElement("div");
    nameDiv.className = "rasi-name";
    nameDiv.textContent = labels.rasi[pos.rasi];
    cell.appendChild(nameDiv);
    if (state.varga === "D1" && state.chart.mudakku && state.chart.mudakku.rasi === pos.rasi) {
      const tag = document.createElement("div");
      tag.className = "mudakku-tag";
      tag.textContent = labels.ui.mudakkuTag;
      cell.appendChild(tag);
    }

    const planetsDiv = document.createElement("div");
    planetsDiv.className = "planets";
    for (const g of rasiToPlanets[pos.rasi] || []) {
      const span = document.createElement("span");
      const isRetrogradeEligible = g.retrograde && !NODES_NOT_MARKED_RETROGRADE.has(g.name);
      span.textContent = (labels.planetAbbr[g.name] || g.name) + (isRetrogradeEligible ? " (R)" : "");
      if (UPAGRAHA_NAMES.has(g.name)) span.classList.add("upagraha");
      planetsDiv.appendChild(span);
    }
    cell.appendChild(planetsDiv);
    grid.appendChild(cell);
  }

  const center = document.createElement("div");
  center.className = "grid-center";
  const ganeshaImg = document.createElement("img");
  ganeshaImg.src = "ganesha.svg";
  ganeshaImg.alt = "";
  ganeshaImg.className = "ganesha-icon";
  const vargaLabel = document.createElement("div");
  vargaLabel.textContent = labels.vargas[state.varga] || state.varga;
  center.append(ganeshaImg, vargaLabel);
  grid.appendChild(center);
}

function isCurrentPeriod(period) {
  const now = new Date();
  return now >= new Date(period.start) && now < new Date(period.end);
}

async function fetchDasaChildren(period, nextLevel) {
  const res = await fetch("/api/dasa/expand", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ lord: period.lord, start: period.start, end: period.end, next_level: nextLevel }),
  });
  return res.json();
}

async function expandRow(tr, period, depth) {
  const next = nextDasaLevel(period.level);
  if (!next || tr.dataset.expanded === "true") return [];
  const children = await fetchDasaChildren(period, next);
  let anchor = tr;
  const childRows = [];
  for (const child of children) {
    const childRow = makeDasaRow(child, depth + 1);
    childRow.dataset.parentDepth = depth;
    anchor.after(childRow);
    anchor = childRow;
    childRows.push({ row: childRow, period: child });
  }
  tr.dataset.expanded = "true";
  return childRows;
}

function renderDasaTable() {
  const tbody = document.getElementById("dasaBody");
  tbody.innerHTML = "";
  const rows = [];
  for (const period of state.chart.mahadasas) {
    const tr = makeDasaRow(period, 0);
    tbody.appendChild(tr);
    rows.push({ row: tr, period });
  }
  autoExpandCurrentChain(rows, 0);
}

// Reveals the currently-active Mahadasa -> Antardasa -> Antaram (Pratyantardasa)
// chain automatically, so the periods that matter right now don't require clicking.
async function autoExpandCurrentChain(rows, depth) {
  if (depth >= 2) return; // stop after Antaram (mahadasa=0, antardasa=1, antaram=2)
  const current = rows.find(({ period }) => isCurrentPeriod(period));
  if (!current) return;
  current.row.classList.add("current-period");
  const childRows = await expandRow(current.row, current.period, depth);
  await autoExpandCurrentChain(childRows, depth + 1);
}

function makeDasaRow(period, depth) {
  const tr = document.createElement("tr");
  tr.className = depth === 0 ? "expandable" : `expandable child-row depth-${depth}`;
  tr.dataset.expanded = "false";
  if (depth > 0) tr.style.setProperty("--dasa-depth", depth);
  if (isCurrentPeriod(period)) tr.classList.add("current-period");

  const lordTd = document.createElement("td");
  const lordSpan = document.createElement("span");
  lordSpan.textContent = L().dasaLords[period.lord] || period.lord;
  const levelSpan = document.createElement("span");
  levelSpan.className = "dasa-level-tag";
  levelSpan.textContent = L().dasaLevels[period.level] || period.level;
  lordTd.append(lordSpan, levelSpan);
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
      await expandRow(tr, period, depth);
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
  const present = [];
  for (const y of state.chart.yogas) {
    const displayName = labels.yogas[y.name] || y.name;
    const li = document.createElement("li");
    if (y.triggered) {
      li.classList.add(INAUSPICIOUS_YOGAS.has(y.name) ? "triggered-warning" : "triggered");
      present.push(displayName);
    }
    const head = document.createElement("div");
    head.className = "yoga-head";
    const title = document.createElement("strong");
    title.textContent = displayName;
    const tag = document.createElement("span");
    tag.className = "yoga-tag " + (y.triggered ? "yoga-tag-present" : "yoga-tag-absent");
    tag.textContent = y.triggered ? labels.ui.yogaPresent : labels.ui.yogaAbsent;
    head.append(title, tag);
    const desc = document.createElement("div");
    desc.className = "yoga-desc";
    desc.textContent = y.description;
    li.append(head, desc);
    if (y.from_moon) {
      const moonNote = document.createElement("div");
      moonNote.className = "yoga-moon-note";
      moonNote.textContent = labels.ui.yogaFromMoon;
      li.appendChild(moonNote);
    }
    ul.appendChild(li);
  }
  document.getElementById("yogaSummary").textContent = present.length
    ? `${labels.ui.yogaSummary}: ${present.join(", ")}`
    : labels.ui.noYogas;
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

function renderGrahaDetails() {
  const tbody = document.getElementById("detailsBody");
  tbody.innerHTML = "";
  const labels = L();

  const rows = [...Object.values(state.chart.d1.grahas), state.chart.gulika, state.chart.mandi];
  for (const g of rows) {
    const tr = document.createElement("tr");
    const isRetrogradeEligible = g.retrograde && !NODES_NOT_MARKED_RETROGRADE.has(g.name);
    const cells = [
      (labels.planets[g.name] || g.name) + (isRetrogradeEligible ? " (R)" : ""),
      labels.rasi[g.rasi],
      labels.planets[g.rasi_lord] || g.rasi_lord,
      formatDMS(g.longitude),
      formatDMS(g.degree_in_sign),
      labels.nakshatra[g.nakshatra],
      g.pada,
      labels.planets[g.star_lord] || g.star_lord,
      g.pushkara_navamsa ? "✓" : "–",
    ];
    for (const value of cells) {
      const td = document.createElement("td");
      td.textContent = value;
      tr.appendChild(td);
    }
    tbody.appendChild(tr);
  }
}

function renderDignity() {
  const labels = L();
  const entries = state.chart.dignities || [];
  const table = document.getElementById("dignityTable");
  const tbody = document.getElementById("dignityBody");
  tbody.innerHTML = "";
  const summary = document.getElementById("dignitySummary");
  if (entries.length === 0) {
    summary.textContent = labels.ui.dignityNone;
    table.classList.add("hidden");
    return;
  }
  summary.textContent = entries
    .map((e) => `${labels.planets[e.planet] || e.planet}: ${e.state === "ucham" ? labels.ui.dignityUcham : labels.ui.dignityNeecham}`)
    .join("  \u00B7  ");
  table.classList.remove("hidden");
  for (const e of entries) {
    const tr = document.createElement("tr");
    tr.className = e.state === "ucham" ? "dignity-ucham" : "dignity-neecham";
    const cells = [
      labels.planets[e.planet] || e.planet,
      e.state === "ucham" ? labels.ui.dignityUcham : labels.ui.dignityNeecham,
      labels.rasi[e.rasi],
      formatDMS(e.degree_in_sign),
      e.deep_degree === null ? "\u2013" : formatDMS(e.deep_degree),
      e.degrees_from_deep === null ? "\u2013" : formatDMS(e.degrees_from_deep),
    ];
    for (const value of cells) {
      const td = document.createElement("td");
      td.textContent = value;
      tr.appendChild(td);
    }
    tbody.appendChild(tr);
  }
}

// --- Init ---

populateTobMinutes();
applyLanguage();
loadSavedCharts();
