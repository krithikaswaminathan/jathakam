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
  upasanaRasi: "", // rasi index picked in the Upasana Deivam box, as a string
  kaalaPakaiPlanet: "", // planet picked in the Kaala Pakai box
  peyarchiPlanet: "", // planet filter on the Peyarchi tab; "" = all
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
  document.getElementById("lblUpasana").textContent = labels.ui.upasana;
  document.getElementById("lblUpasanaRasi").textContent = labels.ui.colRasi;
  document.getElementById("lblKaalaPakai").textContent = labels.ui.kaalaPakai;
  document.getElementById("lblKaalaPakaiPlanet").textContent = labels.ui.colPlanet;
  document.getElementById("kaalaPakaiHint").textContent = labels.ui.kaalaPakaiHint;
  document.getElementById("thKaalaPakai").textContent = labels.ui.colKaalaPakai;
  document.getElementById("lblPeyarchiTab").textContent = labels.ui.peyarchiTab;
  document.getElementById("lblPeyarchiFilter").textContent = labels.ui.colPlanet;
  document.getElementById("thPyPlanet").textContent = labels.ui.colPlanet;
  document.getElementById("thPyEnters").textContent = labels.ui.colEnters;
  document.getElementById("thPyWhen").textContent = labels.ui.colWhen;
  document.getElementById("thPyMoon").textContent = labels.ui.colMoonThen;
  document.getElementById("thPyCount").textContent = labels.ui.colCount;
  document.getElementById("thPyMoorthi").textContent = labels.ui.colMoorthi;
  document.getElementById("lblDrekkanaTab").textContent = labels.ui.drekkanaTab;
  document.getElementById("thDkPlanet").textContent = labels.ui.colPlanet;
  document.getElementById("thDkRasi").textContent = labels.ui.colRasi;
  document.getElementById("thDkDeg").textContent = labels.ui.colDegInSign;
  document.getElementById("thDkDrekkana").textContent = labels.ui.colDrekkana;
  document.getElementById("thDkController").textContent = labels.ui.colController;
  document.getElementById("thDkControllerIn").textContent = labels.ui.colControllerIn;
  document.getElementById("thDkCount").textContent = labels.ui.colFromPlanet;
  document.getElementById("thDkResult").textContent = labels.ui.colResult;
  document.getElementById("drekkanaNote").textContent = labels.ui.drekkanaNote;
  document.getElementById("lblSashtashtagamTab").textContent = labels.ui.sashtashtagamTab;
  document.getElementById("thSsPlanet").textContent = labels.ui.colPlanet;
  document.getElementById("thSsD1Rasi").textContent = labels.ui.colD1Rasi;
  document.getElementById("thSsD1House").textContent = labels.ui.colD1House;
  document.getElementById("thSsD9Rasi").textContent = labels.ui.colD9Rasi;
  document.getElementById("thSsCount").textContent = labels.ui.colCount;
  document.getElementById("thSsRules").textContent = labels.ui.colAathipathyam;
  document.getElementById("thSsResult").textContent = labels.ui.colResult;
  document.getElementById("sashtashtagamNote").textContent = labels.ui.sashtashtagamNote;
  document.getElementById("induLagnaHint").textContent = labels.ui.induLagnaHint;
  document.getElementById("lblReading").textContent = labels.ui.reading;
  document.getElementById("lblBack").textContent = labels.ui.back;
  document.getElementById("lblTopHome").textContent = labels.ui.topHome;
  document.getElementById("lblTopPariharam").textContent = labels.ui.topPariharam;
  document.getElementById("lblPariharamTitle").textContent = labels.ui.topPariharam;
  if (!document.getElementById("pariharamSection").classList.contains("hidden")) renderPariharam();
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
  state.upasanaRasi = state.chart.upasana ? String(state.chart.upasana.rasi) : "";
  state.kaalaPakaiPlanet = state.chart.kaala_pakai.length ? state.chart.kaala_pakai[0].planet : "";
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
  state.upasanaRasi = state.chart.upasana ? String(state.chart.upasana.rasi) : "";
  state.kaalaPakaiPlanet = state.chart.kaala_pakai.length ? state.chart.kaala_pakai[0].planet : "";
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
  document.getElementById("pariharamSection").classList.add("hidden");
  setTopTab("home");
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

// --- Top tabs: Jathakam (the chart and reading pages) and Pariharam ---

function setTopTab(page) {
  document.querySelectorAll(".top-tab").forEach((b) => b.classList.toggle("active", b.dataset.page === page));
}

document.querySelectorAll(".top-tab").forEach((btn) => {
  btn.addEventListener("click", () => (btn.dataset.page === "pariharam" ? showPariharamPage() : showHomePage()));
});

function showPariharamPage() {
  for (const id of ["formSection", "savedSection", "resultSection", "readingSection"]) {
    document.getElementById(id).classList.add("hidden");
  }
  document.querySelectorAll(".side-nav-topic").forEach((b) => b.classList.remove("active"));
  document.getElementById("pariharamSection").classList.remove("hidden");
  setTopTab("pariharam");
  renderPariharam();
}

function showHomePage() {
  document.getElementById("pariharamSection").classList.add("hidden");
  hideReadingPage();
  setTopTab("home");
}

function renderPariharam() {
  const container = document.getElementById("pariharamContent");
  container.innerHTML = "";
  for (const p of PARIHARAMS) {
    const block = document.createElement("div");
    block.className = "pariharam-block";
    const title = document.createElement("h3");
    title.textContent = p.title[state.lang];
    const intro = document.createElement("p");
    intro.textContent = p.intro[state.lang];
    const ol = document.createElement("ol");
    ol.className = "pariharam-names";
    for (const name of p.names) {
      const li = document.createElement("li");
      li.textContent = name[state.lang];
      ol.appendChild(li);
    }
    block.append(title, intro, ol);
    container.appendChild(block);
  }
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
  renderUpasana();
  renderKaalaPakai();
  renderDasaTable();
  renderYogas();
  renderTaraBalam();
  renderGrahaDetails();
  renderDignity();
  renderPeyarchi();
  renderDrekkanaLords();
  renderSashtashtagam();
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

function renderUpasana() {
  const labels = L();
  const select = document.getElementById("upasanaRasi");
  select.innerHTML = "";
  const blank = document.createElement("option");
  blank.value = "";
  blank.textContent = labels.ui.upasanaPick;
  select.appendChild(blank);
  labels.rasi.forEach((name, i) => {
    const opt = document.createElement("option");
    opt.value = String(i);
    opt.textContent = name;
    select.appendChild(opt);
  });
  select.value = state.upasanaRasi;

  const u = state.chart.upasana;
  document.getElementById("upasanaCalc").textContent = u
    ? labels.ui.upasanaCalc
        .replace("{planet}", labels.planets[u.planet])
        .replace("{from}", labels.rasi[u.planet_rasi])
        .replace("{rasi}", labels.rasi[u.rasi])
    : labels.ui.upasanaNoGender;
  document.getElementById("upasanaHint").textContent = labels.ui.upasanaHint;

  const show = () => {
    document.getElementById("upasanaValue").textContent =
      state.upasanaRasi === "" ? "" : UPASANA_DEIVAM[Number(state.upasanaRasi)][state.lang];
  };
  select.onchange = () => {
    state.upasanaRasi = select.value;
    show();
  };
  show();
}

function renderKaalaPakai() {
  const labels = L();
  const value = document.getElementById("kaalaPakaiValue");
  value.innerHTML = "";
  const entries = state.chart.kaala_pakai;
  if (entries.length === 0) value.textContent = labels.ui.kaalaPakaiNone;
  for (const e of entries) {
    const div = document.createElement("div");
    div.className = "kaala-pakai-entry";
    const head = document.createElement("span");
    head.className = "info-label";
    head.textContent = `${labels.planets[e.planet]}: ${labels.rasi[e.rasi]} \u00B7 ${labels.ui.houseWord} ${e.house}`;
    const effect = document.createElement("div");
    effect.className = "info-hint";
    effect.textContent = KAALA_PAKAI[e.planet].effect[state.lang];
    div.append(head, effect);
    value.appendChild(div);
  }

  const select = document.getElementById("kaalaPakaiPlanet");
  select.innerHTML = "";
  const blank = document.createElement("option");
  blank.value = "";
  blank.textContent = labels.ui.kaalaPakaiPick;
  select.appendChild(blank);
  for (const planet of Object.keys(KAALA_PAKAI)) {
    const opt = document.createElement("option");
    opt.value = planet;
    opt.textContent = labels.planets[planet];
    select.appendChild(opt);
  }
  select.value = state.kaalaPakaiPlanet;

  const show = () => {
    const k = KAALA_PAKAI[state.kaalaPakaiPlanet];
    document.getElementById("kaalaPakaiLookup").textContent = k
      ? `${labels.ui.kaalaPakaiRasis}: ${k.rasis.map((r) => labels.rasi[r]).join(", ")}`
      : "";
    document.getElementById("kaalaPakaiEffect").textContent = k ? k.effect[state.lang] : "";
  };
  select.onchange = () => {
    state.kaalaPakaiPlanet = select.value;
    show();
  };
  show();
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

// The worked count shown under yogas whose rule is a count, so it can be checked by eye.
function yogaWorking(name, triggered) {
  const labels = L();
  const d1 = state.chart.d1;
  if (name === "Soorya Chandraadhi Yoga") {
    const sunHouse = d1.grahas.Sun.house;
    return [
      labels.ui.sooryaChandraadhiCalc
        .replaceAll("{house}", sunHouse)
        .replace("{target}", labels.rasi[sunHouse - 1])
        .replace("{moon}", labels.rasi[d1.grahas.Moon.rasi]),
    ];
  }
  if (name === "Jeevanam Yoga") {
    const n = d1.grahas.Moon.rasi + 1;
    const planets = d1.houses[n].map((p) => labels.planets[p]).join(", ");
    const lines = [
      labels.ui.jeevanamCalc
        .replaceAll("{n}", n)
        .replace("{moon}", labels.rasi[d1.grahas.Moon.rasi])
        .replace("{target}", labels.rasi[(d1.lagna_rasi + n - 1) % 12])
        .replace("{planets}", planets || labels.ui.noneWord),
    ];
    if (triggered) lines.push(labels.ui.jeevanamEarning.replace("{planets}", planets));
    return lines;
  }
  return [];
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
    for (const line of yogaWorking(y.name, y.triggered)) {
      const calc = document.createElement("div");
      calc.className = "yoga-moon-note";
      calc.textContent = line;
      li.appendChild(calc);
    }
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

  const kaalaPakai = state.chart.kaala_pakai;
  document.getElementById("kaalaPakaiSummary").textContent = kaalaPakai.length
    ? `${labels.ui.kaalaPakai}: ` +
      kaalaPakai.map((e) => `${labels.planets[e.planet]} (${labels.rasi[e.rasi]})`).join("  \u00B7  ")
    : labels.ui.kaalaPakaiNone;
  const inKaalaPakai = new Set(kaalaPakai.map((e) => e.planet));

  const rows = [...Object.values(state.chart.d1.grahas), state.chart.gulika, state.chart.mandi];
  for (const g of rows) {
    const tr = document.createElement("tr");
    if (inKaalaPakai.has(g.name)) tr.className = "kaala-pakai";
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
      inKaalaPakai.has(g.name) ? labels.ui.kaalaPakaiYes : "–",
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

// Rahu and Ketu change rasi together, so a Rahu peyarchi is shown as both.
function peyarchiPlanetName(planet) {
  return planet === "Rahu" ? L().ui.rahuKetu : L().planets[planet];
}

function peyarchiRasiName(p) {
  const rasi = L().rasi;
  return p.planet === "Rahu" ? `${rasi[p.rasi]} / ${rasi[(p.rasi + 6) % 12]}` : rasi[p.rasi];
}

// The peyarchi of each planet that is running now: its latest one that has started.
function currentPeyarchis() {
  const now = new Date();
  const current = new Map();
  for (const p of state.chart.peyarchis) {
    if (new Date(p.when) <= now) current.set(p.planet, p);
  }
  return current;
}

function renderPeyarchi() {
  const labels = L();
  const peyarchis = state.chart.peyarchis;
  const current = currentPeyarchis();

  document.getElementById("peyarchiSummary").textContent = current.size
    ? `${labels.ui.peyarchiNow}: ` +
      [...current.values()].map((p) => `${peyarchiPlanetName(p.planet)} ${peyarchiRasiName(p)} \u2013 ${labels.moorthi[p.moorthi]}`).join("  \u00B7  ")
    : "";
  document.getElementById("peyarchiNote").textContent =
    labels.ui.peyarchiNote.replace("{janma}", labels.rasi[state.chart.d1.grahas.Moon.rasi]);

  const select = document.getElementById("peyarchiFilter");
  select.innerHTML = "";
  for (const planet of ["", "Saturn", "Jupiter", "Rahu"]) {
    const opt = document.createElement("option");
    opt.value = planet;
    opt.textContent = planet ? peyarchiPlanetName(planet) : labels.ui.peyarchiAll;
    select.appendChild(opt);
  }
  select.value = state.peyarchiPlanet;
  select.onchange = () => {
    state.peyarchiPlanet = select.value;
    renderPeyarchi();
  };

  const tbody = document.getElementById("peyarchiBody");
  tbody.innerHTML = "";
  const currentSet = new Set(current.values());
  for (const p of peyarchis) {
    if (state.peyarchiPlanet && p.planet !== state.peyarchiPlanet) continue;
    const tr = document.createElement("tr");
    if (currentSet.has(p)) tr.className = "current-period";
    const kind = p.kind === "retrograde" ? ` ${labels.ui.peyarchiRetro}` : p.kind === "re-entry" ? ` ${labels.ui.peyarchiReentry}` : "";
    const cells = [
      [peyarchiPlanetName(p.planet)],
      [peyarchiRasiName(p) + kind],
      [p.when.slice(0, 16).replace("T", " "), p.in_effect_at_start ? labels.ui.peyarchiCarried : ""],
      [labels.rasi[p.moon_rasi]],
      [String(p.count)],
      [labels.moorthi[p.moorthi], labels.moorthiResult[p.moorthi]],
    ];
    cells.forEach(([main, sub], i) => {
      const td = document.createElement("td");
      td.textContent = main;
      if (sub) {
        const span = document.createElement("span");
        span.className = "peyarchi-sub";
        span.textContent = sub;
        td.appendChild(span);
      }
      if (i === 5) td.className = `moorthi-${p.moorthi}`;
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  }
}

function renderDrekkanaLords() {
  const labels = L();
  const entries = state.chart.drekkana_lords;
  const weak = entries.filter((e) => e.weakened);
  document.getElementById("drekkanaSummary").textContent = weak.length
    ? `${labels.ui.drekkanaSummary}: ` +
      weak.map((e) => `${labels.planets[e.planet]} (${labels.planets[e.controller]} ${e.count})`).join("  \u00B7  ")
    : labels.ui.drekkanaNone;
  const pariharam = document.getElementById("drekkanaPariharam");
  pariharam.textContent = labels.ui.drekkanaPariharam;
  pariharam.classList.toggle("hidden", weak.length === 0);

  const tbody = document.getElementById("drekkanaBody");
  tbody.innerHTML = "";
  for (const e of entries) {
    const tr = document.createElement("tr");
    if (e.weakened) tr.className = "drekkana-weak";
    const result = e.weakened
      ? labels.ui.drekkanaWeak.replace("{n}", e.count)
      : e.controller === e.planet ? labels.ui.drekkanaOwn : labels.ui.drekkanaOk;
    const cells = [
      labels.planets[e.planet],
      labels.rasi[e.rasi],
      formatDMS(e.degree_in_sign),
      `${labels.ui.drekkanaOrdinal[e.drekkana - 1]} (${labels.rasi[e.drekkana_rasi]})`,
      labels.planets[e.controller],
      labels.rasi[e.controller_rasi],
      String(e.count),
      result,
    ];
    for (const value of cells) {
      const td = document.createElement("td");
      td.textContent = value;
      tr.appendChild(td);
    }
    tbody.appendChild(tr);
  }
}

// "9: father, fortune, dharma" for each house a planet rules; Rahu and Ketu get the house they sit in.
function aathipathyamLines(e) {
  const labels = L();
  if (e.houses_ruled.length === 0) {
    return [labels.ui.sashtashtagamNoLordship.replace("{house}", e.d1_house)];
  }
  return e.houses_ruled.map((h) => `${h}: ${labels.ui.houseMeanings[h - 1]}`);
}

function renderSashtashtagam() {
  const labels = L();
  const entries = state.chart.navamsa_sashtashtagam;
  const flagged = entries.filter((e) => e.flagged);
  document.getElementById("sashtashtagamSummary").textContent = flagged.length
    ? `${labels.ui.sashtashtagamSummary}: ` +
      flagged
        .map((e) => {
          const next = upcomingWindows(e)[0];
          const nextText = next
            ? ` \u2013 ${pointText(e, labels.ui.sashtashtagamNextShort).replace("{when}", fmtWindow(next))}`
            : "";
          return `${labels.planets[e.planet]} (${aathipathyamLines(e).join("; ")})${nextText}`;
        })
        .join("  \u00B7  ")
    : labels.ui.sashtashtagamNone;
  const pariharam = document.getElementById("sashtashtagamPariharam");
  pariharam.textContent = labels.ui.drekkanaPariharam;
  pariharam.classList.toggle("hidden", flagged.length === 0);

  const tbody = document.getElementById("sashtashtagamBody");
  tbody.innerHTML = "";
  for (const e of entries) {
    const tr = document.createElement("tr");
    if (e.flagged) tr.className = "sashtashtagam-flag";
    const cells = [
      labels.planets[e.planet],
      labels.rasi[e.d1_rasi],
      String(e.d1_house),
      labels.rasi[e.d9_rasi],
      String(e.count),
      aathipathyamLines(e),
      e.flagged ? labels.ui.sashtashtagamWeak.replace("{n}", e.count) : labels.ui.sashtashtagamOk,
    ];
    for (const value of cells) {
      const td = document.createElement("td");
      if (Array.isArray(value)) {
        for (const line of value) {
          const span = document.createElement("span");
          span.className = "house-line";
          span.textContent = line;
          td.appendChild(span);
        }
      } else {
        td.textContent = value;
      }
      tr.appendChild(td);
    }
    tbody.appendChild(tr);
  }
  renderSashtashtagamTiming(flagged);
}

function fmtDateTime(iso) {
  return iso.slice(0, 16).replace("T", " ");
}

function fmtWindow(w) {
  return `${fmtDateTime(w.start)} \u2192 ${fmtDateTime(w.end)}`;
}

function fmtDegMin(deg) {
  const whole = Math.floor(deg + 1e-9);
  const minutes = Math.round((deg - whole) * 60);
  return `${whole}\u00B0${String(minutes).padStart(2, "0")}'`;
}

// Fills {planet} {star} {pada} {rasi} {from} {to} for a flagged planet's navamsa point.
function pointText(e, template) {
  const labels = L();
  const p = e.point;
  const rasi = Math.floor(p.start / 30);
  return template
    .replaceAll("{planet}", labels.planets[e.planet])
    .replace("{star}", labels.nakshatra[p.nakshatra])
    .replace("{pada}", p.pada)
    .replace("{rasi}", labels.rasi[rasi])
    .replace("{from}", fmtDegMin(p.start - rasi * 30))
    .replace("{to}", fmtDegMin(p.end - rasi * 30));
}

// Periods not yet over, soonest first.
function upcomingWindows(e) {
  const now = new Date();
  return e.transits.filter((w) => new Date(w.end) >= now);
}

function renderSashtashtagamTiming(flagged) {
  const labels = L();
  const container = document.getElementById("sashtashtagamTiming");
  container.innerHTML = "";
  if (flagged.length === 0) return;

  const title = document.createElement("h3");
  title.className = "timing-title";
  title.textContent = labels.ui.sashtashtagamTimingTitle;
  container.appendChild(title);

  const now = new Date();
  const windowLine = (w) => {
    const li = document.createElement("li");
    const running = new Date(w.start) <= now && now <= new Date(w.end);
    li.textContent = fmtWindow(w) + (running ? ` (${labels.ui.sashtashtagamNowTag})` : "");
    if (running) li.className = "timing-now";
    return li;
  };

  for (const e of flagged) {
    const block = document.createElement("div");
    block.className = "timing-block";
    const intro = document.createElement("div");
    intro.className = "timing-intro";
    if (e.transits.length === 0) {
      intro.textContent = pointText(e, labels.ui.sashtashtagamNoTransit);
      block.appendChild(intro);
      container.appendChild(block);
      continue;
    }
    intro.textContent = pointText(e, labels.ui.sashtashtagamTimingIntro);
    block.appendChild(intro);

    const upcoming = upcomingWindows(e);
    const next = document.createElement("div");
    next.className = "info-label";
    next.textContent = labels.ui.sashtashtagamUpcoming;
    block.appendChild(next);
    const ul = document.createElement("ul");
    ul.className = "timing-list";
    if (upcoming.length === 0) {
      const li = document.createElement("li");
      li.textContent = labels.ui.sashtashtagamNoneLeft;
      ul.appendChild(li);
    }
    for (const w of upcoming.slice(0, 3)) ul.appendChild(windowLine(w));
    block.appendChild(ul);

    const all = document.createElement("details");
    all.className = "timing-all";
    const summary = document.createElement("summary");
    summary.textContent = labels.ui.sashtashtagamAllPeriods.replace("{n}", e.transits.length);
    all.appendChild(summary);
    const allList = document.createElement("ul");
    allList.className = "timing-list";
    for (const w of e.transits) allList.appendChild(windowLine(w));
    all.appendChild(allList);
    block.appendChild(all);
    container.appendChild(block);
  }
}

// --- Init ---

populateTobMinutes();
applyLanguage();
loadSavedCharts();
