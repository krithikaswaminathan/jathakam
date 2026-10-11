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
  pariharamTopic: 0, // index into PARIHARAMS shown on the Pariharam page
  gandPlanet: "", // planet filter on the Gandantham tab; "" = all
  hiddenPlanet: "", // planet filter on the Hidden Ucham / Neecham tab; "" = all
  prasannam: { place: null, chart: null }, // place: { latitude, longitude, timezone, label }; label null = device location
  peyarchiPlanet: "", // planet filter on the Peyarchi tab; "" = all
  // Ayul Nirnayam: view is "calc" or a key of AYUL_TOPICS; result is the last /api/ayul response;
  // strong is the pick ("lagna", "sun" or "moon"); methods are the ones shown, in order.
  ayul: { view: "calc", result: null, strong: null, methods: [] },
  // Jaimini Sutras: view is a key of JAIMINI_VIEWS; result is the last /api/jaimini response,
  // which every view reads.
  jaimini: { view: "arudha", result: null },
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
  document.getElementById("thDgPada").textContent = labels.ui.colPada;
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
  document.getElementById("lblPariharamNav").textContent = labels.ui.topPariharam;
  if (!document.getElementById("pariharamSection").classList.contains("hidden")) renderPariharam();
  document.getElementById("lblTopPrasannam").textContent = labels.ui.topPrasannam;
  document.getElementById("lblPrasannamTitle").textContent = labels.ui.topPrasannam;
  document.getElementById("lblPrasTime").textContent = labels.ui.prasTime;
  document.getElementById("lblPrasPlace").textContent = labels.ui.prasPlace;
  document.getElementById("prasNow").textContent = labels.ui.prasNow;
  document.getElementById("prasUseLocation").textContent = labels.ui.prasUseLocation;
  document.getElementById("prasChangePlace").textContent = labels.ui.prasChangePlace;
  document.getElementById("prasPlaceInput").placeholder = labels.ui.prasPlaceholder;
  document.getElementById("lblChandraNadi").textContent = labels.ui.chandraNadi;
  document.getElementById("thPrPlanet").textContent = labels.ui.colPlanet;
  document.getElementById("thPrRasi").textContent = labels.ui.colRasi;
  document.getElementById("thPrDeg").textContent = labels.ui.colDegInSign;
  document.getElementById("thPrStar").textContent = labels.ui.colStar;
  document.getElementById("thPrPada").textContent = labels.ui.colPada;
  if (state.prasannam.chart) renderPrasannam();
  CHART_PICKERS.forEach((p) => p.applyLanguage());
  applyAyulLanguage();
  applyJaiminiLanguage();
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
  CHART_PICKERS.forEach((p) => p.populate());
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
  if (!res.ok) {
    // e.g. deleted in another tab: say so and refresh the list instead of breaking the page
    alert(L().ui.chartMissing);
    await loadSavedCharts();
    return;
  }
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
  document.getElementById("ayulSection").classList.add("hidden");
  document.getElementById("jaiminiSection").classList.add("hidden");
  document.getElementById("pariharamSection").classList.add("hidden");
  document.getElementById("prasannamSection").classList.add("hidden");
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
  btn.addEventListener("click", () => showPage(btn.dataset.page));
});

const PAGE_SECTIONS = ["formSection", "savedSection", "resultSection", "readingSection", "pariharamSection", "prasannamSection", "ayulSection", "jaiminiSection"];

// "home" is the birth-chart page (with the Reading side nav); the others replace it.
function showPage(page) {
  setTopTab(page);
  document.getElementById("sideNav").classList.toggle("hidden", page !== "home");
  document.getElementById("pariharamNav").classList.toggle("hidden", page !== "pariharam");
  document.getElementById("ayulNav").classList.toggle("hidden", page !== "ayul");
  document.getElementById("jaiminiNav").classList.toggle("hidden", page !== "jaimini");
  if (page === "home") {
    document.getElementById("pariharamSection").classList.add("hidden");
    document.getElementById("prasannamSection").classList.add("hidden");
    document.getElementById("ayulSection").classList.add("hidden");
    document.getElementById("jaiminiSection").classList.add("hidden");
    hideReadingPage();
    return;
  }
  for (const id of PAGE_SECTIONS) document.getElementById(id).classList.add("hidden");
  document.querySelectorAll(".side-nav-topic").forEach((b) => b.classList.remove("active"));
  if (page === "pariharam") {
    document.getElementById("pariharamSection").classList.remove("hidden");
    renderPariharam();
  } else if (page === "prasannam") {
    document.getElementById("prasannamSection").classList.remove("hidden");
    startPrasannam();
  } else if (page === "ayul") {
    document.getElementById("ayulSection").classList.remove("hidden");
    renderAyul();
  } else if (page === "jaimini") {
    document.getElementById("jaiminiSection").classList.remove("hidden");
    renderJaimini();
  }
}

// --- Prasannam: the chart for this moment where you are, and the Moon's position (Chandra Nadi) ---

function setPrasStatus(text) {
  document.getElementById("prasStatus").textContent = text;
}

function startPrasannam() {
  if (state.prasannam.place) castPrasannam();
  else locatePrasannam();
}

function locatePrasannam() {
  const labels = L();
  if (!navigator.geolocation) {
    showPrasSearch();
    return;
  }
  setPrasStatus(labels.ui.prasLocating);
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      state.prasannam.place = {
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        label: null,
      };
      document.getElementById("prasSearch").classList.add("hidden");
      castPrasannam();
    },
    () => showPrasSearch(),
    { timeout: 15000, maximumAge: 10 * 60 * 1000 }
  );
}

function showPrasSearch() {
  setPrasStatus(state.prasannam.place ? "" : L().ui.prasDenied);
  document.getElementById("prasSearch").classList.remove("hidden");
  document.getElementById("prasPlaceInput").focus();
}

async function castPrasannam() {
  const labels = L();
  const place = state.prasannam.place;
  setPrasStatus(labels.ui.prasCasting);
  const params = new URLSearchParams({ latitude: place.latitude, longitude: place.longitude, timezone: place.timezone });
  const res = await fetch(`/api/prasannam?${params}`);
  if (!res.ok) {
    setPrasStatus(labels.ui.prasError + (await res.text()));
    return;
  }
  state.prasannam.chart = await res.json();
  setPrasStatus("");
  renderPrasannam();
}

function renderPrasannam() {
  const labels = L();
  const chart = state.prasannam.chart;
  const place = state.prasannam.place;
  document.getElementById("prasResult").classList.remove("hidden");
  document.getElementById("prasTime").textContent = `${fmtDateTime(chart.when)}:${chart.when.slice(17, 19)} (UTC${chart.when.slice(19)})`;
  document.getElementById("prasPlace").textContent =
    place.label ||
    labels.ui.prasMyLocation.replace("{lat}", place.latitude.toFixed(4)).replace("{lon}", place.longitude.toFixed(4));

  const moon = chart.d1.grahas.Moon;
  document.getElementById("chandraNadiMain").textContent =
    `${labels.nakshatra[moon.nakshatra]} ${labels.ui.padaWord} ${moon.pada} \u00B7 ${labels.rasi[moon.rasi]} ${formatDMS(moon.degree_in_sign)}`;
  const rows = [
    [labels.ui.prasMoonRasi, `${labels.rasi[moon.rasi]} (${labels.planets[moon.rasi_lord]})`],
    [labels.ui.prasMoonStar, `${labels.nakshatra[moon.nakshatra]} (${labels.planets[moon.star_lord]})`],
    [labels.ui.prasMoonPada, String(moon.pada)],
    [labels.ui.prasMoonDegree, formatDMS(moon.degree_in_sign)],
    [labels.ui.prasMoonAbs, formatDMS(moon.longitude)],
    [labels.ui.lagna, `${labels.rasi[chart.d1.lagna_rasi]} ${formatDMS(chart.lagna_longitude % 30)}`],
  ];
  const body = document.getElementById("chandraNadiBody");
  body.innerHTML = "";
  for (const [k, v] of rows) {
    const tr = document.createElement("tr");
    for (const text of [k, v]) {
      const td = document.createElement("td");
      td.textContent = text;
      tr.appendChild(td);
    }
    body.appendChild(tr);
  }

  drawGrid(document.getElementById("prasGrid"), chart.d1, { centerLabel: labels.ui.topPrasannam });

  const tbody = document.getElementById("prasBody");
  tbody.innerHTML = "";
  for (const g of Object.values(chart.d1.grahas)) {
    const tr = document.createElement("tr");
    const isRetrogradeEligible = g.retrograde && !NODES_NOT_MARKED_RETROGRADE.has(g.name);
    for (const text of [
      labels.planets[g.name] + (isRetrogradeEligible ? " (R)" : ""),
      labels.rasi[g.rasi],
      formatDMS(g.degree_in_sign),
      labels.nakshatra[g.nakshatra],
      String(g.pada),
    ]) {
      const td = document.createElement("td");
      td.textContent = text;
      tr.appendChild(td);
    }
    tbody.appendChild(tr);
  }
}

document.getElementById("prasNow").addEventListener("click", () => startPrasannam());
document.getElementById("prasUseLocation").addEventListener("click", () => {
  state.prasannam.place = null;
  locatePrasannam();
});
document.getElementById("prasChangePlace").addEventListener("click", showPrasSearch);

let prasSearchTimer = null;
document.getElementById("prasPlaceInput").addEventListener("input", (e) => {
  clearTimeout(prasSearchTimer);
  const query = e.target.value.trim();
  const list = document.getElementById("prasPlaceResults");
  if (query.length < 2) {
    list.classList.add("hidden");
    return;
  }
  prasSearchTimer = setTimeout(async () => {
    const res = await fetch(`/api/geocode?query=${encodeURIComponent(query)}`);
    const places = res.ok ? await res.json() : [];
    list.innerHTML = "";
    if (places.length === 0) {
      const li = document.createElement("li");
      li.className = "pob-no-results";
      li.textContent = L().ui.pobNoResults;
      list.appendChild(li);
    }
    for (const p of places) {
      const li = document.createElement("li");
      li.textContent = p.label;
      li.addEventListener("click", () => {
        state.prasannam.place = { latitude: p.latitude, longitude: p.longitude, timezone: p.timezone, label: p.label };
        list.classList.add("hidden");
        document.getElementById("prasSearch").classList.add("hidden");
        e.target.value = "";
        castPrasannam();
      });
      list.appendChild(li);
    }
    list.classList.remove("hidden");
  }, 300);
});

// The Pariharam page: its own side nav of pariharams, and the one picked. The names to
// recite are shown in English and Tamil together, whatever the language setting.
function renderPariharam() {
  const nav = document.getElementById("pariharamNavList");
  nav.innerHTML = "";
  PARIHARAMS.forEach((p, i) => {
    const li = document.createElement("li");
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "pariharam-topic" + (i === state.pariharamTopic ? " active" : "");
    btn.textContent = p.title[state.lang];
    btn.addEventListener("click", () => {
      state.pariharamTopic = i;
      renderPariharam();
    });
    li.appendChild(btn);
    nav.appendChild(li);
  });

  const p = PARIHARAMS[state.pariharamTopic];
  document.getElementById("lblPariharamTitle").textContent = p.title[state.lang];
  const container = document.getElementById("pariharamContent");
  container.innerHTML = "";
  const intro = document.createElement("p");
  intro.className = "pariharam-intro";
  intro.textContent = p.intro[state.lang];
  container.appendChild(intro);
  if (p.table) {
    container.appendChild(readingTable(p.tableHeader, p.table));
    return;
  }
  const ol = document.createElement("ol");
  ol.className = "pariharam-names";
  for (const name of p.names) {
    const li = document.createElement("li");
    const en = document.createElement("span");
    en.className = "pariharam-name-en";
    en.textContent = name.en;
    const ta = document.createElement("span");
    ta.className = "pariharam-name-ta";
    ta.lang = "ta";
    ta.textContent = name.ta;
    li.append(en, ta);
    ol.appendChild(li);
  }
  container.appendChild(ol);
}

// --- "Whose chart" picker: a saved chart, or birth details typed in and not saved. Shared by the
// calculators on the Ayul Nirnayam and Jaimini Sutras pages; each keeps its own in CHART_PICKERS.

const CHART_PICKERS = [];

function createChartPicker(host) {
  const group = `chartSource${CHART_PICKERS.length}`;
  host.classList.add("picker");
  host.innerHTML = `
    <fieldset class="picker-choice">
      <legend data-label="chartSource"></legend>
      <label><input type="radio" name="${group}" value="saved" checked /> <span data-label="chartSourceSaved"></span></label>
      <label><input type="radio" name="${group}" value="new" /> <span data-label="chartSourceNew"></span></label>
    </fieldset>
    <div class="picker-fields picker-saved">
      <label><span data-label="chartSourceChart"></span><select class="picker-chart"></select></label>
    </div>
    <div class="picker-fields picker-new hidden">
      <label><span data-label="name"></span><input type="text" class="picker-name" /></label>
      <label><span data-label="dob"></span><input type="date" class="picker-dob" /></label>
      <label><span data-label="tob"></span>
        <div class="tob-group">
          <select class="picker-hour" aria-label="Hour"></select>
          <span class="tob-colon">:</span>
          <select class="picker-minute" aria-label="Minute"></select>
          <select class="picker-ampm" aria-label="AM or PM"><option value="AM">AM</option><option value="PM">PM</option></select>
        </div>
      </label>
      <label class="pob-field picker-pob">
        <span data-label="pob"></span>
        <input type="text" class="picker-place" autocomplete="off" />
        <ul class="pob-results hidden"></ul>
      </label>
    </div>`;
  const q = (selector) => host.querySelector(selector);
  const picker = { place: null };
  for (let h = 1; h <= 12; h++) q(".picker-hour").add(new Option(String(h), String(h), h === 12, h === 12));
  for (let m = 0; m < 60; m++) q(".picker-minute").add(new Option(String(m).padStart(2, "0"), String(m)));

  picker.isNew = () => host.querySelector(`input[name="${group}"]:checked`).value === "new";
  host.querySelectorAll(`input[name="${group}"]`).forEach((radio) => {
    radio.addEventListener("change", () => {
      q(".picker-saved").classList.toggle("hidden", picker.isNew());
      q(".picker-new").classList.toggle("hidden", !picker.isNew());
    });
  });

  const placeInput = q(".picker-place");
  const placeList = q(".pob-results");
  let searchTimer = null;
  placeInput.addEventListener("input", () => {
    picker.place = null;
    clearTimeout(searchTimer);
    const query = placeInput.value.trim();
    if (query.length < 2) {
      placeList.classList.add("hidden");
      return;
    }
    searchTimer = setTimeout(async () => {
      const res = await fetch(`/api/geocode?query=${encodeURIComponent(query)}`);
      const places = res.ok ? await res.json() : [];
      placeList.innerHTML = "";
      if (places.length === 0) {
        const li = document.createElement("li");
        li.className = "pob-no-results";
        li.textContent = L().ui.pobNoResults;
        placeList.appendChild(li);
      }
      for (const p of places) {
        const li = document.createElement("li");
        li.textContent = p.label;
        li.addEventListener("click", () => {
          picker.place = p;
          placeInput.value = p.label;
          placeList.classList.add("hidden");
        });
        placeList.appendChild(li);
      }
      placeList.classList.remove("hidden");
    }, 300);
  });
  document.addEventListener("click", (e) => {
    if (!q(".picker-pob").contains(e.target)) placeList.classList.add("hidden");
  });

  picker.populate = () => {
    const select = q(".picker-chart");
    const keep = select.value;
    select.innerHTML = "";
    const charts = state.savedCharts || [];
    if (charts.length === 0) select.add(new Option(L().ui.noSavedCharts, ""));
    for (const c of charts) select.add(new Option(`${c.name} — ${c.dob}`, String(c.id)));
    if (charts.some((c) => String(c.id) === keep)) select.value = keep;
  };

  picker.applyLanguage = () => {
    const ui = L().ui;
    host.querySelectorAll("[data-label]").forEach((el) => { el.textContent = ui[el.dataset.label]; });
    placeInput.placeholder = ui.pobPlaceholder;
    picker.populate();
  };

  // GETs `${base}/{id}` for a saved chart, or POSTs the typed-in birth details to `base`. Returns
  // the Response, or a message to show if something is missing.
  picker.fetch = async (base) => {
    const ui = L().ui;
    if (!picker.isNew()) {
      const id = q(".picker-chart").value;
      return id ? fetch(`${base}/${id}`) : ui.noSavedCharts;
    }
    const dob = q(".picker-dob").value;
    if (!dob || !picker.place) return ui.needBirthDetails;
    let hour = parseInt(q(".picker-hour").value, 10) % 12;
    if (q(".picker-ampm").value === "PM") hour += 12;
    const minute = parseInt(q(".picker-minute").value, 10);
    const p = picker.place;
    return fetch(base, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: q(".picker-name").value.trim(),
        dob,
        tob: `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}:00`,
        pob_label: p.label,
        latitude: p.latitude,
        longitude: p.longitude,
        timezone: p.timezone,
      }),
    });
  };

  CHART_PICKERS.push(picker);
  return picker;
}

const ayulPicker = createChartPicker(document.getElementById("ayulPicker"));
const jaiminiPicker = createChartPicker(document.getElementById("jaiminiPicker"));

// --- Ayul Nirnayam: its own side nav (the calculator, then a page on each method) ---

const AYUL_STRONG_METHODS = { lagna: ["amsayu"], sun: ["pindayu"], moon: ["nisargayu"] };
const AYUL_METHODS = ["amsayu", "pindayu", "nisargayu"];
const AYUL_METHOD_LABEL = { amsayu: "ayulAmsayu", pindayu: "ayulPindayu", nisargayu: "ayulNisargayu" };

function applyAyulLanguage() {
  const ui = L().ui;
  const set = (id, text) => { document.getElementById(id).textContent = text; };
  set("lblTopAyul", ui.topAyul);
  set("lblAyulNav", ui.topAyul);
  set("ayulIntro", ui.ayulIntro);
  set("lblAyulStrong", ui.ayulStrong);
  set("lblAyulStrongLagna", ui.ayulStrongLagna);
  set("lblAyulStrongSun", ui.ayulStrongSun);
  set("lblAyulStrongMoon", ui.ayulStrongMoon);
  set("ayulCalculate", ui.calculateShort);
  if (!document.getElementById("ayulSection").classList.contains("hidden")) renderAyul();
}

function renderAyul() {
  const ui = L().ui;
  const nav = document.getElementById("ayulNavList");
  nav.innerHTML = "";
  for (const [key, title] of [["calc", ui.ayulCalcNav], ...Object.entries(AYUL_TOPICS).map(([k, t]) => [k, t.title[state.lang]])]) {
    const li = document.createElement("li");
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "pariharam-topic" + (key === state.ayul.view ? " active" : "");
    btn.textContent = title;
    btn.addEventListener("click", () => {
      state.ayul.view = key;
      renderAyul();
    });
    li.appendChild(btn);
    nav.appendChild(li);
  }

  const isCalc = state.ayul.view === "calc";
  document.getElementById("ayulCalc").classList.toggle("hidden", !isCalc);
  const topicEl = document.getElementById("ayulTopic");
  topicEl.classList.toggle("hidden", isCalc);
  if (isCalc) {
    document.getElementById("ayulTitle").textContent = ui.topAyul;
    renderAyulResult();
  } else {
    const topic = AYUL_TOPICS[state.ayul.view];
    document.getElementById("ayulTitle").textContent = topic.title[state.lang];
    topicEl.innerHTML = "";
    renderTopicBody(topicEl, topic);
  }
}

document.getElementById("ayulForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const ui = L().ui;
  const status = document.getElementById("ayulStatus");
  status.textContent = ui.workingOut;
  const res = await ayulPicker.fetch("/api/ayul");
  if (typeof res === "string") {
    status.textContent = res;
    return;
  }
  if (!res.ok) {
    status.textContent = ui.workingError + (await res.text());
    return;
  }
  status.textContent = "";
  state.ayul.result = await res.json();
  state.ayul.strong = document.querySelector('input[name="ayulStrong"]:checked').value;
  state.ayul.methods = [...AYUL_STRONG_METHODS[state.ayul.strong]];
  renderAyulResult();
});

// Days of 360-day years (30-day months) as years, months and days.
function ayulYmd(days, long = false) {
  return L().ui[long ? "ayulYmdLong" : "ayulYmd"]
    .replace("{y}", Math.floor(days / 360))
    .replace("{m}", Math.floor((days % 360) / 30))
    .replace("{d}", days % 30);
}

// Souramanam years as years, months and days of the solar year.
function solarYmd(years) {
  const y = Math.floor(years);
  const monthsFull = (years - y) * 12;
  let m = Math.floor(monthsFull);
  let d = Math.round((monthsFull - m) * 30.4375);
  if (d >= 30) { d = 0; m += 1; }
  return L().ui.ayulYmdLong.replace("{y}", y + (m >= 12 ? 1 : 0)).replace("{m}", m % 12).replace("{d}", d);
}

function shareFraction(share) {
  if (share >= 0.9999) return state.lang === "ta" ? "முழுவதும்" : "all";
  const n = Math.round(1 / share);
  return Math.abs(1 / n - share) < 1e-6 ? `1/${n}` : share.toFixed(3);
}

function ayulPlace(row) {
  const labels = L();
  return `${labels.rasi[row.rasi]} ${formatDMS(row.degree_in_sign)}${row.retrograde ? " (R)" : ""}`;
}

function ayulBodyName(row) {
  return row.body === "Lagna" ? L().ui.lagna : L().planets[row.body];
}

function haranamText(row) {
  const ui = L().ui;
  if (!row.haranams.length) return "–";
  const parts = row.haranams.map((h) =>
    ui.ayulHaranam[h.kind].replace("{f}", shareFraction(h.share)).replace("{h}", h.house ? ORDINAL[state.lang](h.house) : "")
  );
  return `${parts.join(", ")} · ${ui.ayulLess.replace("{loss}", ayulYmd(row.loss_days))}`;
}

function ayulTable(headers, rows, total) {
  const wrap = document.createElement("div");
  wrap.className = "ayul-table-wrap";
  const table = document.createElement("table");
  table.className = "ayul-table";
  const head = document.createElement("tr");
  for (const h of headers) {
    const th = document.createElement("th");
    th.textContent = h;
    head.appendChild(th);
  }
  table.appendChild(head);
  for (const cells of [...rows, total]) {
    const tr = document.createElement("tr");
    if (cells === total) tr.className = "ayul-total";
    cells.forEach(([text, cls]) => {
      const td = document.createElement("td");
      td.textContent = text;
      if (cls) td.className = cls;
      tr.appendChild(td);
    });
    table.appendChild(tr);
  }
  wrap.appendChild(table);
  return wrap;
}

function amsayuBlock(a) {
  const ui = L().ui;
  const rows = a.rows.map((r) => {
    let increase = "–";
    if (r.increase) increase = `${r.increase.replace("x", "×")} ${r.increase_reasons.map((k) => ui.ayulReason[k]).join(", ")}`;
    else if (r.increase_reasons.length) increase = r.increase_reasons.map((k) => ui.ayulReason[k]).join(", ");
    return [
      [ayulBodyName(r)], [ayulPlace(r)], [String(r.house)], [ayulYmd(r.a_days)], [increase, "ayul-why"],
      [ayulYmd(r.b_days)], [haranamText(r), "ayul-why"], [ayulYmd(r.c_days), "ayul-c"],
    ];
  });
  const total = [[ui.totalWord], [""], [""], [ayulYmd(a.a_days)], [""], [ayulYmd(a.b_days)], [""], [ayulYmd(a.c_days)]];
  return ayulTable(
    [ui.colPlanet, ui.colPosition, ui.colHouse, ui.colAOriginal, ui.colIncrease, ui.colB, ui.colHaranams, ui.colC], rows, total
  );
}

function pindayuBlock(p) {
  const ui = L().ui;
  const rows = p.rows.map((r) => [
    [ayulBodyName(r)], [ayulPlace(r)], [String(r.house)],
    [r.share == null ? "–" : ui.ayulShareOf.replace("{share}", r.share.toFixed(3)).replace("{max}", r.max_years)],
    [ayulYmd(r.a_days)], [haranamText(r), "ayul-why"], [ayulYmd(r.c_days), "ayul-c"],
  ]);
  const total = [[ui.totalWord], [""], [""], [""], [ayulYmd(p.a_days)], [""], [ayulYmd(p.c_days)]];
  return ayulTable([ui.colPlanet, ui.colPosition, ui.colHouse, ui.colShare, ui.colYears, ui.colHaranams, ui.colAfterHaranams], rows, total);
}

function ayulMethodSection(method) {
  const ui = L().ui;
  const data = state.ayul.result[method];
  const name = ui[AYUL_METHOD_LABEL[method]];
  const section = document.createElement("div");
  const h3 = document.createElement("h3");
  h3.className = "timing-title";
  h3.textContent = name;
  section.appendChild(h3);

  const box = document.createElement("div");
  box.className = "ayul-result-box";
  const lead = document.createElement("div");
  lead.textContent = ui.ayulComesTo.replace("{method}", name);
  const big = document.createElement("div");
  big.className = "ayul-big";
  big.textContent = solarYmd(data.solar_years);
  const steps = document.createElement("div");
  steps.className = "ayul-steps";
  steps.textContent = ui.ayulSteps
    .replace("{c}", ayulYmd(data.c_days, true))
    .replace("{days}", data.c_days.toLocaleString("en-IN"))
    .replace("{solar}", data.solar_years.toFixed(2));
  box.append(lead, big, steps);
  section.appendChild(box);
  section.appendChild(method === "amsayu" ? amsayuBlock(data) : pindayuBlock(data));
  return section;
}

function renderAyulResult() {
  const container = document.getElementById("ayulResult");
  const r = state.ayul.result;
  container.classList.toggle("hidden", !r);
  container.innerHTML = "";
  if (!r) return;
  const labels = L();
  const ui = labels.ui;

  const head = document.createElement("div");
  head.className = "yoga-summary";
  const who = [r.name, r.dob, r.tob.slice(0, 5), r.pob_label].filter(Boolean).join(" · ");
  head.textContent = `${who} · ${ui.lagna} ${labels.rasi[r.lagna_rasi]} ${formatDMS(r.lagna_degree)}`;
  container.appendChild(head);

  for (const method of state.ayul.methods) container.appendChild(ayulMethodSection(method));
  const others = AYUL_METHODS.filter((m) => !state.ayul.methods.includes(m));
  if (others.length) {
    const p = document.createElement("p");
    p.className = "ayul-other";
    others.forEach((other, i) => {
      if (i) p.append(" \u00B7 ");
      const btn = document.createElement("button");
      btn.type = "button";
      btn.textContent = ui.ayulCompare.replace("{method}", ui[AYUL_METHOD_LABEL[other]]);
      btn.addEventListener("click", () => {
        state.ayul.methods.push(other);
        renderAyulResult();
      });
      p.appendChild(btn);
    });
    container.appendChild(p);
  }

  const note = document.createElement("p");
  note.className = "reading-note";
  note.textContent = ui.ayulNote;
  container.appendChild(note);
}

// --- Jaimini Sutras: its own side nav of calculators, all reading one /api/jaimini result ---

const JAIMINI_VIEWS = {
  arudha: { title: "alTitle", intro: ["alIntro", "alMethod"], render: () => renderArudhaResult("arudha_lagna") },
  upapada: { title: "upapadaTitle", intro: ["upapadaIntro", "upapadaMethod", "ulDkRule"], render: () => renderArudhaResult("upapada") },
  karaka: { title: "karakaTitle", intro: ["karakaIntro", "karakaRules"], render: () => renderKarakaResult() },
  amatya: { title: "amkTitle", intro: ["amkIntro", "amkRel"], render: () => renderAmatyakarakaResult() },
  karakamsa: { title: "kkTitle", intro: ["kkIntro", "kkHow"], render: () => renderKarakamsaResult() },
  drishti: { title: "drishtiTitle", intro: ["drishtiIntro", "drishtiRules"], render: () => renderDrishtiResult() },
};

function applyJaiminiLanguage() {
  const ui = L().ui;
  document.getElementById("lblTopJaimini").textContent = ui.topJaimini;
  document.getElementById("lblJaiminiNav").textContent = ui.topJaimini;
  document.getElementById("jaiminiCalculate").textContent = ui.calculateShort;
  if (!document.getElementById("jaiminiSection").classList.contains("hidden")) renderJaimini();
}

function renderJaimini() {
  const ui = L().ui;
  const nav = document.getElementById("jaiminiNavList");
  nav.innerHTML = "";
  for (const [key, view] of Object.entries(JAIMINI_VIEWS)) {
    const li = document.createElement("li");
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "pariharam-topic" + (key === state.jaimini.view ? " active" : "");
    btn.textContent = ui[view.title];
    btn.addEventListener("click", () => {
      state.jaimini.view = key;
      renderJaimini();
    });
    li.appendChild(btn);
    nav.appendChild(li);
  }
  const view = JAIMINI_VIEWS[state.jaimini.view];
  document.getElementById("jaiminiTitle").textContent = ui[view.title];
  const intro = document.getElementById("jaiminiIntro");
  intro.innerHTML = "";
  for (const key of view.intro) {
    const p = document.createElement("p");
    p.className = "calc-intro";
    p.textContent = ui[key];
    intro.appendChild(p);
  }
  view.render();
}

document.getElementById("jaiminiForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const ui = L().ui;
  const status = document.getElementById("jaiminiStatus");
  status.textContent = ui.workingOut;
  const res = await jaiminiPicker.fetch("/api/jaimini");
  if (typeof res === "string") {
    status.textContent = res;
    return;
  }
  if (!res.ok) {
    status.textContent = ui.workingError + (await res.text());
    return;
  }
  status.textContent = "";
  state.jaimini.result = await res.json();
  JAIMINI_VIEWS[state.jaimini.view].render();
});

function simpleTable(className, rows, header) {
  const table = document.createElement("table");
  table.className = className;
  if (header) {
    const tr = document.createElement("tr");
    for (const text of header) {
      const th = document.createElement("th");
      th.textContent = text;
      tr.appendChild(th);
    }
    table.appendChild(tr);
  }
  for (const cells of rows) {
    const tr = document.createElement("tr");
    for (const text of cells) {
      const td = document.createElement("td");
      td.textContent = text;
      tr.appendChild(td);
    }
    table.appendChild(tr);
  }
  return table;
}

function fillTemplate(template, values) {
  return Object.entries(values).reduce((t, [k, v]) => t.replaceAll(`{${k}}`, v), template);
}

function noneText() {
  const word = L().ui.noneWord;
  return word.charAt(0).toUpperCase() + word.slice(1);
}

// The chart line at the top of a Jaimini result: who, when, where and the lagna.
function jaiminiHead(r) {
  const labels = L();
  const head = document.createElement("div");
  head.className = "yoga-summary";
  const who = [r.name, r.dob, r.tob.slice(0, 5), r.pob_label].filter(Boolean).join(" \u00B7 ");
  head.textContent = `${who} \u00B7 ${labels.ui.lagna} ${labels.rasi[r.lagna_rasi]} ${formatDMS(r.lagna_degree)}`;
  return head;
}

// The label keys for each arudha. Only the Upapada also shows the 2nd rasi from it.
const ARUDHA_TEXT = {
  arudha_lagna: { step1: "alStep1", none: "alStepNone", same: "alStepSame", seventh: "alStepSeventh", is: "alIs", title: "alTitle", planets: "alRowPlanets", second: false },
  upapada: { step1: "ulStep1", none: "ulStepNone", same: "ulStepTwelfth", seventh: "ulStepSeventh", is: "ulIs", title: "upapadaTitle", planets: "ulRowPlanets", second: true },
};

function renderArudhaResult(kind) {
  const container = document.getElementById("jaiminiResult");
  const chart = state.jaimini.result;
  container.classList.toggle("hidden", !chart);
  container.innerHTML = "";
  if (!chart) return;
  const r = chart[kind];
  const text = ARUDHA_TEXT[kind];
  const labels = L();
  const ui = labels.ui;
  const rasi = (i) => labels.rasi[i];
  const planet = (p) => labels.planets[p];
  const fill = fillTemplate;
  const planetList = (names) => (names.length ? names.map(planet).join(", ") : noneText());
  const house = (rasiIndex) => ORDINAL[state.lang]((rasiIndex - chart.lagna_rasi + 12) % 12 + 1);
  const where = Object.fromEntries(chart.rasi_drishti.flatMap((d) => d.planets.map((p) => [p, d.rasi])));
  const aspectedBy = (names) =>
    names.length ? names.map((p) => fill(ui.ulAspectedFrom, { planet: planet(p), rasi: rasi(where[p]) })).join(", ") : noneText();

  container.appendChild(jaiminiHead(chart));

  const box = document.createElement("div");
  box.className = "ayul-result-box";
  const big = document.createElement("div");
  big.className = "ul-summary";
  big.textContent = fill(ui[text.is], { rasi: rasi(r.rasi), ord: ORDINAL[state.lang](r.house) });
  box.appendChild(big);
  // Both arudha pages say whether the Arudha Lagna and the Upapada aspect each other.
  const alUl = fill(chart.arudha_upapada_aspect ? ui.alUlYes : ui.alUlNo, {
    al: `${ui.alTitle} (${rasi(chart.arudha_lagna.rasi)})`,
    ul: `${ui.upapadaTitle} (${rasi(chart.upapada.rasi)})`,
  });
  if (chart.arudha_upapada_aspect) {
    const note = document.createElement("div");
    note.className = "ul-aspect-note";
    note.textContent = alUl;
    box.appendChild(note);
  }
  // The Upapada page also reads the Darakaraka with the Upapada.
  const dk = chart.darakaraka_upapada;
  const dkLines = [];
  if (text.second) {
    if (dk.related) {
      const reasons = [];
      if (dk.aspect) reasons.push(ui.dkHow.aspect);
      if (dk.kendra_trikona) reasons.push(fill(ui.dkHow.kt, { ord: ORDINAL[state.lang](dk.count) }));
      for (const b of dk.benefics) {
        const key = (b.how === "in" ? "in" : "aspect") + (b.on === "dk" ? "Dk" : "Ul");
        reasons.push(fill(ui.dkHow[key], { planet: planet(b.planet) }));
      }
      dkLines.push(["good", fill(ui.dkRelated, { how: reasons.join(ui.dkHow.joiner) })]);
    }
    if (dk.adverse) dkLines.push(["adverse", fill(ui.dkAdverse, { pair: [2, 12].includes(dk.count) ? "2/12" : "6/8" })]);
    for (const [cls, line] of dkLines) {
      const note = document.createElement("div");
      note.className = "ul-aspect-note" + (cls === "adverse" ? " adverse" : "");
      note.textContent = line;
      box.appendChild(note);
    }
  }
  container.appendChild(box);

  const last = ui[{ same: text.same, seventh: text.seventh }[r.exception] || text.none];
  const steps = [
    fill(ui[text.step1], { rasi: rasi(r.bhava_rasi), lord: planet(r.bhava_lord) }),
    fill(ui.ulStep2, { lord: planet(r.bhava_lord), rasi: rasi(r.lord_rasi), from: rasi(r.bhava_rasi), n: r.count }),
    fill(ui.ulStep3, { n: r.count, rasi: rasi(r.lord_rasi), landing: rasi(r.landing) }),
    fill(last, { landing: rasi(r.landing), ul: rasi(r.rasi) }),
  ];
  container.appendChild(simpleTable("ul-steps", steps.map((s, i) => [String(i + 1), s]), [ui.ulStepCol, ui.ulWorkingCol]));

  const lordIn = (lord, at) => fill(ui.ulLordIn, { lord: planet(lord), rasi: rasi(at), ord: house(at) });
  const rows = [
    [ui[text.title], `${rasi(r.rasi)} (${house(r.rasi)})`],
    [ui[text.planets], planetList(r.planets)],
    [ui.ulRowAspectedBy, aspectedBy(r.aspected_by)],
    [ui.ulRowLord, lordIn(r.lord, r.lord_sits_in)],
    [ui.alUlRow, alUl],
  ];
  if (text.second) {
    rows.push(
      [ui.ulRowSecond, `${rasi(r.second)} (${house(r.second)})`],
      [ui.ulRowSecondPlanets, planetList(r.second_planets)],
      [ui.ulRowAspectedBy, aspectedBy(r.second_aspected_by)],
      [ui.ulRowLord, lordIn(r.second_lord, r.second_lord_rasi)],
      [ui.dkRowDk, lordIn(dk.planet, dk.rasi)],
      [ui.dkRowRelation, dkLines.length ? dkLines.map(([, line]) => line).join(" ") : ui.dkNone],
    );
  }
  container.appendChild(simpleTable("ul-details", rows));
}

// Chara karakas: the karakas and what they signify are shown before any chart is picked; a chart
// adds the planet holding each one, its rasi and its degree in the rasi.
const KARAKA_ORDER = ["AK", "AmK", "BK", "MK", "PK", "GK", "DK"];

function renderKarakaResult() {
  const container = document.getElementById("jaiminiResult");
  container.classList.remove("hidden");
  container.innerHTML = "";
  const labels = L();
  const ui = labels.ui;
  const chart = state.jaimini.result;
  let table;
  if (!chart) {
    const rows = KARAKA_ORDER.map((k) => [ui.karakaNames[k], ui.karakaMeanings[k]]);
    table = simpleTable("drishti-table", rows, [ui.colKaraka, ui.colSignifies]);
  } else {
    container.appendChild(jaiminiHead(chart));
    const rows = chart.chara_karakas.map((k) => [
      ui.karakaNames[k.karaka], labels.planets[k.planet], labels.rasi[k.rasi], formatDMS(k.degree_in_sign), ui.karakaMeanings[k.karaka],
    ]);
    table = simpleTable("drishti-table", rows, [ui.colKaraka, ui.colPlanet, ui.colRasi, ui.colDegInRasi, ui.colSignifies]);
  }
  const wrap = document.createElement("div");
  wrap.className = "table-wrap";
  wrap.appendChild(table);
  container.appendChild(wrap);
}

// Amatyakaraka: the readings for each planet and house group are shown before any chart is picked;
// a chart adds its Amatyakaraka, the readings that apply and its link with the Atmakaraka.
const AMK_PLANETS = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn"];
const AMK_GROUPS = ["kendra", "trikona", "upachaya", "dusthana"];

function renderAmatyakarakaResult() {
  const container = document.getElementById("jaiminiResult");
  container.classList.remove("hidden");
  container.innerHTML = "";
  const labels = L();
  const ui = labels.ui;
  const planet = (p) => labels.planets[p];
  const chart = state.jaimini.result;
  const addTable = (rows, header, className = "drishti-table") => {
    const wrap = document.createElement("div");
    wrap.className = "table-wrap";
    wrap.appendChild(simpleTable(className, rows, header));
    container.appendChild(wrap);
  };

  if (!chart) {
    addTable(AMK_PLANETS.map((p) => [planet(p), ui.amkPlanet[p]]), [ui.colPlanet, ui.colAsAmk]);
    addTable(AMK_GROUPS.map((g) => [ui.amkGroupName[g], ui.amkGroupReading[g]]), [ui.colHouses, ui.colReading]);
    return;
  }

  const a = chart.amatyakaraka;
  const place = (p, rasi, house) => fillTemplate(ui.ulLordIn, { lord: planet(p), rasi: labels.rasi[rasi], ord: ORDINAL[state.lang](house) });
  const how = a.aspect ? ui.amkHow.aspect : a.same_rasi ? ui.amkHow.same : fillTemplate(ui.amkHow.kt, { ord: ORDINAL[state.lang](a.count) });
  const relation = a.related ? fillTemplate(ui.amkRelated, { how }) : ui.amkNotRelated;
  container.appendChild(jaiminiHead(chart));
  const box = document.createElement("div");
  box.className = "ayul-result-box";
  const big = document.createElement("div");
  big.className = "ul-summary";
  big.textContent = fillTemplate(ui.amkIs, { planet: planet(a.planet), rasi: labels.rasi[a.rasi], ord: ORDINAL[state.lang](a.house) });
  box.appendChild(big);
  if (a.related) {
    const note = document.createElement("div");
    note.className = "ul-aspect-note";
    note.textContent = relation;
    box.appendChild(note);
  }
  container.appendChild(box);

  const houseText = a.groups.map((g) => `${ui.amkGroupName[g]}. ${ui.amkGroupReading[g]}`).join(" ") || "\u2013";
  addTable([
    [ui.amkRowAk, place(a.atmakaraka, a.ak_rasi, a.ak_house)],
    [ui.amkRowAmk, place(a.planet, a.rasi, a.house)],
    [ui.amkRowCareer, ui.amkPlanet[a.planet]],
    [ui.amkRowHouse, houseText],
    [ui.amkRowRelation, relation],
  ], null, "ul-details");
}

// Karakamsa: the conditions and readings are listed before any chart is picked; a chart adds the
// Atmakaraka's state in the Navamsa, then the Swamsa (Navamsa) and Karakamsa (birth chart) views,
// each with the readings that apply and the twelve houses counted from the rasi.
const KK_CAREER = ["Sun", "Venus", "Saturn", "Mars", "Rahu"];
const KK_STATIC = ["fire", "earth", "air", "water", "strong", "weak", "withJupiter", "withSaturn", "withVenus",
  "ketu", "venus12", "jupiter", "career", "influenceJupiter", "influenceMars", "influenceVenus", "spiritual",
  "tenthAmk", "seventhBenefic", "seventhMalefic"];

function renderKarakamsaResult() {
  const container = document.getElementById("jaiminiResult");
  container.classList.remove("hidden");
  container.innerHTML = "";
  const labels = L();
  const ui = labels.ui;
  const planet = (p) => labels.planets[p];
  // "Jupiter, Venus and Ketu" in English; Tamil lists with commas.
  const planetList = (ps) => {
    const names = ps.map(planet);
    return state.lang === "en" && names.length > 1 ? `${names.slice(0, -1).join(", ")} and ${names[names.length - 1]}` : names.join(", ");
  };
  const rasi = (i) => labels.rasi[i];
  const fill = fillTemplate;
  const chart = state.jaimini.result;
  const addTable = (rows, header) => {
    const wrap = document.createElement("div");
    wrap.className = "table-wrap";
    wrap.appendChild(simpleTable("drishti-table", rows, header));
    container.appendChild(wrap);
  };
  const addHeading = (text) => {
    const h3 = document.createElement("h3");
    h3.className = "timing-title";
    h3.textContent = text;
    container.appendChild(h3);
  };
  const addList = (lines) => {
    if (!lines.length) {
      const p = document.createElement("p");
      p.className = "calc-intro";
      p.textContent = ui.kkNoReadings;
      container.appendChild(p);
      return;
    }
    const ul = document.createElement("ul");
    ul.className = "kk-readings";
    for (const line of lines) {
      const li = document.createElement("li");
      li.textContent = line;
      ul.appendChild(li);
    }
    container.appendChild(ul);
  };

  if (!chart) {
    const rows = [];
    for (const key of KK_STATIC) {
      if (key === "career") {
        for (const p of KK_CAREER) rows.push([fill(ui.kkCond.career, { planet: planet(p) }), fill(ui.kkRead.career, { field: ui.kkFields[p] })]);
      } else {
        rows.push([ui.kkCond[key], ui.kkRead[key]]);
      }
    }
    addTable(rows, [ui.colCondition, ui.colReading]);
    const note = document.createElement("p");
    note.className = "reading-note";
    note.textContent = ui.kkCondNote;
    container.appendChild(note);
    return;
  }

  const k = chart.karakamsa;
  container.appendChild(jaiminiHead(chart));
  const box = document.createElement("div");
  box.className = "ayul-result-box";
  const big = document.createElement("div");
  big.className = "ul-summary";
  big.textContent = fill(ui.kkIs, { rasi: rasi(k.rasi) });
  box.appendChild(big);
  container.appendChild(box);
  const steps = [
    fill(ui.kkStep1, { planet: planet(k.atmakaraka), rasi: rasi(k.ak_rasi) }),
    fill(ui.kkStep2, { planet: planet(k.atmakaraka), rasi: rasi(k.rasi) }),
  ];
  container.appendChild(simpleTable("ul-steps", steps.map((s, i) => [String(i + 1), s]), [ui.ulStepCol, ui.ulWorkingCol]));

  // The Atmakaraka in the Navamsa: element, strength, planets with it.
  addHeading(ui.kkAkTitle);
  const akLines = [`${fill(ui.kkWhat.element, { element: ui.kkElements[k.element] })} ${ui.kkRead[k.element]}`];
  const why = (dignityOk, group) => {
    const parts = [];
    if (dignityOk) parts.push(ui.kkWhy[k.ak_dignity]);
    if (group.length) parts.push(fill(ui.kkWhy.influenced, { planets: planetList(group) }));
    return parts.join(ui.kkWhy.joiner);
  };
  if (k.ak_strong) akLines.push(`${fill(ui.kkWhat.strong, { why: why(["ucham", "own"].includes(k.ak_dignity), k.ak_benefics) })} ${ui.kkRead.strong}`);
  if (k.ak_weak) akLines.push(`${fill(ui.kkWhat.weak, { why: why(k.ak_dignity === "neecham", k.ak_malefics) })} ${ui.kkRead.weak}`);
  for (const p of k.with_ak) akLines.push(`${fill(ui.kkWhat.withAk, { planet: planet(p) })} ${ui.kkRead["with" + p]}`);
  addList(akLines);

  for (const v of k.views) {
    const view = ui.kkViewName[v.chart];
    addHeading(ui.kkViewTitle[v.chart]);
    const where = document.createElement("p");
    where.className = "calc-intro";
    where.textContent = fill(ui.kkLagnaHouse, { rasi: rasi(k.rasi), ord: ORDINAL[state.lang](v.lagna_house) });
    container.appendChild(where);
    const lines = v.readings.map((r) => {
      const ord = ORDINAL[state.lang](r.house);
      switch (r.kind) {
        case "career":
          return `${fill(ui.kkWhat.career, { planet: planet(r.planet), view })} ${fill(ui.kkRead.career, { field: ui.kkFields[r.planet] })}`;
        case "influence":
          return `${fill(ui.kkWhat.influence, { planet: planet(r.planet), view })} ${ui.kkRead["influence" + r.planet]}`;
        case "spiritual": {
          const sp = ui.kkSpiritual;
          const influencers = r.reasons.filter((x) => x === "ketu" || x === "jupiter").map((x) => (x === "ketu" ? "Ketu" : "Jupiter"));
          const parts = [];
          if (influencers.length) parts.push(fill(sp.influenced, { planets: planetList(influencers), view }));
          if (r.reasons.includes("pisces")) parts.push(fill(sp.pisces, { meenam: rasi(11), view }));
          if (r.reasons.includes("twelfth")) parts.push(fill(sp.twelfth, { view }));
          return `${fill(sp.sentence, { view, parts: parts.join(sp.joiner) })} ${ui.kkRead.spiritual}`;
        }
        case "tenth_amk":
          return `${fill(r.how === "in" ? ui.kkWhat.tenthAmkIn : ui.kkWhat.tenthAmkAspect, { planet: planet(r.planet), view })} ${ui.kkRead.tenthAmk}`;
        case "seventh_benefic":
        case "seventh_malefic":
          return `${fill(ui.kkWhat.seventh, { planets: planetList(r.planets), view })} ${ui.kkRead[r.kind === "seventh_benefic" ? "seventhBenefic" : "seventhMalefic"]}`;
        default:
          return `${fill(ui.kkWhat[r.kind], { ord, view })} ${ui.kkRead[r.kind]}`;
      }
    });
    addList(lines);
    addTable(v.houses.map((h) => [
      ORDINAL[state.lang](h.house) + (h.house === 12 ? ` (${ui.kkMoksha})` : ""),
      rasi(h.rasi),
      h.planets.length ? planetList(h.planets) : "–",
    ]), [ui.kkColHouse, ui.colRasi, ui.kkColPlanets]);
  }
}

// Rasi drishti: the table of which rasi aspects which is shown before any chart is picked (it is
// the same for every chart); a chart adds its house, the planets in each rasi and those aspecting it.
const JAIMINI_ASPECTS = (rasi) => {
  const counts = [0, 3, 6, 9].includes(rasi) ? [5, 8, 11] : [1, 4, 7, 10].includes(rasi) ? [3, 6, 9] : [4, 7, 10];
  return counts.map((c) => (rasi + c - 1) % 12);
};

function renderDrishtiResult() {
  const container = document.getElementById("jaiminiResult");
  container.classList.remove("hidden");
  container.innerHTML = "";
  const labels = L();
  const ui = labels.ui;
  const chart = state.jaimini.result;
  const planets = (names) => (names.length ? names.map((p) => labels.planets[p]).join(", ") : "\u2013");
  const aspectsText = (list) => list.map((i) => labels.rasi[i]).join(", ");
  if (!chart) {
    const rows = [...Array(12).keys()].map((i) => [labels.rasi[i], aspectsText(JAIMINI_ASPECTS(i))]);
    container.appendChild(simpleTable("drishti-table", rows, [ui.colRasi, ui.colAspects]));
    return;
  }
  container.appendChild(jaiminiHead(chart));
  const rows = chart.rasi_drishti.map((d) => [
    `${labels.rasi[d.rasi]} (${ORDINAL[state.lang](d.house)})`, planets(d.planets), aspectsText(d.aspects), planets(d.aspected_by),
  ]);
  const wrap = document.createElement("div");
  wrap.className = "table-wrap";
  wrap.appendChild(simpleTable("drishti-table", rows, [ui.colRasi, ui.colPlanetsIn, ui.colAspects, ui.colAspectedBy]));
  container.appendChild(wrap);
}

function readingTable(header, rows) {
  const table = document.createElement("table");
  table.className = "reading-table";
  if (header) {
    const headRow = document.createElement("tr");
    for (const col of header) {
      const th = document.createElement("th");
      th.textContent = col[state.lang];
      headRow.appendChild(th);
    }
    table.appendChild(headRow);
  }
  for (const row of rows) {
    const tr = document.createElement("tr");
    for (const col of row) {
      const td = document.createElement("td");
      td.textContent = col[state.lang];
      tr.appendChild(td);
    }
    table.appendChild(tr);
  }
  return table;
}

function renderReadingPage(topicKey) {
  const topic = READING_TOPICS[topicKey];
  const container = document.getElementById("readingContent");
  container.innerHTML = "";
  if (!topic) return;
  document.getElementById("readingTitle").textContent = topic.title[state.lang];
  renderTopicBody(container, topic);
}

// The text, tables, note and sources of a reading topic (also used for the Ayul Nirnayam pages).
function renderTopicBody(container, topic) {
  const intro = document.createElement("p");
  intro.textContent = topic.intro[state.lang];
  container.appendChild(intro);

  if (topic.table) container.appendChild(readingTable(topic.tableHeader, topic.table));

  // Optional further sections, each with a heading, text and its own table.
  for (const section of topic.sections || []) {
    const heading = document.createElement("h3");
    heading.className = "reading-subhead";
    heading.textContent = section.heading[state.lang];
    container.appendChild(heading);
    if (section.text) {
      const p = document.createElement("p");
      p.textContent = section.text[state.lang];
      container.appendChild(p);
    }
    if (section.table) container.appendChild(readingTable(section.tableHeader, section.table));
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
  renderHiddenDignity();
  renderCareerCadres();
  renderGandantham();
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
    const pariharam = kaalaPakaiPariharamText(state.lang, e.planet);
    if (pariharam) {
      const line = document.createElement("div");
      line.className = "kaala-pakai-pariharam";
      line.textContent = pariharam;
      div.appendChild(line);
    }
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
    document.getElementById("kaalaPakaiPariharamLine").textContent = k ? kaalaPakaiPariharamText(state.lang, state.kaalaPakaiPlanet) : "";
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
  const chart = chartOutFor(state.varga);
  const isD1 = state.varga === "D1";
  // Thithi Soonyam is sign-based and read from the D1 chart only
  const soonyaRasis = new Set(isD1 && state.chart.tithi ? state.chart.tithi.soonya_rasis.map((r) => r.rasi) : []);
  document.getElementById("soonyamLegend").classList.toggle("hidden", soonyaRasis.size === 0);
  drawGrid(document.getElementById("chartGrid"), chart, {
    // Gulika/Mandi are only computed for D1, not per-varga
    extraPlanets: isD1 ? [state.chart.gulika, state.chart.mandi] : [],
    soonyaRasis,
    mudakkuRasi: isD1 && state.chart.mudakku ? state.chart.mudakku.rasi : null,
    centerLabel: L().vargas[state.varga] || state.varga,
    pushkara: isD1,
  });
  const anyPushkara = isD1 && [...Object.values(chart.grahas), state.chart.gulika, state.chart.mandi].some(
    (g) => pushkaraGrade([g.nakshatra, g.pada])
  );
  document.getElementById("pushkaraLegend").classList.toggle("hidden", !anyPushkara);
  document.getElementById("pushkaraLegendText").textContent = L().ui.pushkaraLegend;
}

// Draws a South Indian chart into `grid`: used for the birth chart and the Prasannam chart.
function drawGrid(grid, chart, { extraPlanets = [], soonyaRasis = new Set(), mudakkuRasi = null, centerLabel = "", pushkara = false } = {}) {
  grid.innerHTML = "";
  const labels = L();

  const rasiToPlanets = {};
  for (const g of [...Object.values(chart.grahas), ...extraPlanets]) {
    (rasiToPlanets[g.rasi] = rasiToPlanets[g.rasi] || []).push(g);
  }

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
    if (mudakkuRasi === pos.rasi) {
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
      const grade = pushkara ? pushkaraGrade([g.nakshatra, g.pada]) : null;
      if (grade) {
        const tag = document.createElement("span");
        tag.className = "pushkara-tag" + (grade === "Present" ? " present" : "");
        tag.textContent = gradeText(state.lang, grade);
        span.appendChild(tag);
      }
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
  const label = document.createElement("div");
  label.textContent = centerLabel;
  center.append(ganeshaImg, label);
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

// For the Mahadasa of a planet sitting in an A, B or C Pushkara pada, a tag saying whether the dasa works.
function pushkaraDasaNote(lord) {
  const g = state.chart.d1.grahas[lord];
  const p = [g.nakshatra, g.pada];
  if (!isCountedPushkara(p)) return null;
  const works = pushkaraDasaWorks(lord, p);
  const tag = document.createElement("span");
  tag.className = "pushkara-dasa-tag" + (works ? "" : " fails");
  tag.textContent = (works ? L().ui.pushkaraDasaTag : L().ui.pushkaraDasaTagFails).replace("{grade}", pushkaraGrade(p));
  return tag;
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
  const pushkaraNote = depth === 0 ? pushkaraDasaNote(period.lord) : null;
  if (pushkaraNote) lordTd.appendChild(pushkaraNote);
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
    c4.textContent = labels.quality[t.quality];
    c4.className = "quality-" + t.quality;
    tr.append(c1, c2, c3, c4);
    tbody.appendChild(tr);
  }
  renderPushkaraQuality();
}

// The nine Pushkara padas that count (6th, 8th or 9th in their rasi), naming this chart's
// planets (and Gulika/Mandi) that sit in each.
function renderPushkaraQuality() {
  const labels = L();
  document.getElementById("lblPushkaraQuality").textContent = labels.ui.pushkaraQualityTitle;
  document.getElementById("pushkaraQualityIntro").textContent = labels.ui.pushkaraQualityIntro;
  document.getElementById("thPqRasi").textContent = labels.ui.colRasi;
  document.getElementById("thPqPada").textContent = labels.ui.colPushkaraPada;
  document.getElementById("thPqQuality").textContent = labels.ui.colStarLord;
  document.getElementById("thPqPlanets").textContent = labels.ui.colPlanetsHere;
  document.getElementById("thPqGrade").textContent = labels.ui.colGrade;

  const bodies = [...Object.values(state.chart.d1.grahas), state.chart.gulika, state.chart.mandi];
  const tbody = document.getElementById("pushkaraQualityBody");
  tbody.innerHTML = "";
  for (const p of COUNTED_PUSHKARA_PADAS) {
    const [nak, pada] = p;
    const here = bodies.filter((g) => g.nakshatra === nak && g.pada === pada).map((g) => labels.planets[g.name]);
    const tr = document.createElement("tr");
    if (here.length) tr.className = "current-period";
    for (const text of [
      labels.rasi[Math.floor(padaIndex(p) / 9)],
      `${labels.nakshatra[nak]} ${pada}` + (isVargottamaPada(p) ? ` (${labels.ui.vargottamaWord})` : ""),
      labels.planets[STAR_LORD_CYCLE[nak % 9]],
      pushkaraGrade(p),
      here.join(", ") || "\u2013",
    ]) {
      const td = document.createElement("td");
      td.textContent = text;
      tr.appendChild(td);
    }
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

  const rows = [state.chart.lagna, ...Object.values(state.chart.d1.grahas), state.chart.gulika, state.chart.mandi].filter(Boolean);
  for (const g of rows) {
    const tr = document.createElement("tr");
    if (inKaalaPakai.has(g.name)) tr.className = "kaala-pakai";
    if (g.name === "Lagna") tr.classList.add("lagna-row");
    const isRetrogradeEligible = g.retrograde && !NODES_NOT_MARKED_RETROGRADE.has(g.name);
    const cells = [
      (g.name === "Lagna" ? labels.ui.lagna : labels.planets[g.name] || g.name) + (isRetrogradeEligible ? " (R)" : ""),
      labels.rasi[g.rasi],
      labels.planets[g.rasi_lord] || g.rasi_lord,
      formatDMS(g.longitude),
      formatDMS(g.degree_in_sign),
      labels.nakshatra[g.nakshatra],
      g.pada,
      labels.planets[g.star_lord] || g.star_lord,
      pushkaraGrade([g.nakshatra, g.pada])
        ? `${gradeText(state.lang, pushkaraGrade([g.nakshatra, g.pada]))} \u00B7 ${labels.nakshatra[g.nakshatra]} ${g.pada}` +
          (isVargottamaPada([g.nakshatra, g.pada]) ? ` (${labels.ui.vargottamaWord})` : "") +
          (isCountedPushkara([g.nakshatra, g.pada]) && DASA_PLANETS.includes(g.name)
            ? ` \u00B7 ${pushkaraDasaWorks(g.name, [g.nakshatra, g.pada]) ? labels.ui.pushkaraDasaWorks : labels.ui.pushkaraDasaFails}`
            : "")
        : "–",
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

function dignityStateText(e) {
  const ui = L().ui;
  if (e.state === "ucham") return e.parama ? ui.dignityParamoccham : ui.dignityUcham;
  return e.parama ? ui.dignityParamaneecham : ui.dignityNeecham;
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
    .map((e) => `${labels.planets[e.planet] || e.planet} ${dignityStateText(e)}`)
    .join("  \u00B7  ");
  table.classList.remove("hidden");
  for (const e of entries) {
    const tr = document.createElement("tr");
    tr.className = (e.state === "ucham" ? "dignity-ucham" : "dignity-neecham") + (e.parama ? " dignity-parama" : "");
    const cells = [
      labels.planets[e.planet] || e.planet,
      dignityStateText(e),
      labels.rasi[e.rasi],
      formatDMS(e.degree_in_sign),
      `${labels.nakshatra[e.nakshatra]} ${e.pada}`,
      e.deep_degree === null
        ? "\u2013"
        : `${formatDMS(e.deep_degree)} \u00B7 ${labels.nakshatra[e.deep_nakshatra]} ${e.deep_pada}`,
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

// Where each planet hides its ucham, neecham and moolatrikonam, and every pass of transit Rahu or
// Ketu over those padas up to 2030, laid out like the Moorthy tab.
function renderHiddenDignity() {
  const labels = L();
  const ui = labels.ui;
  const entries = state.chart.hidden_dignities;
  const pada = (nak, p) => `${labels.nakshatra[nak]} ${p}`;
  const hiddenAt = (e) => `${pada(e.hidden_nakshatra, e.hidden_pada)} \u00B7 ${labels.rasi[e.hidden_rasi]}`;
  const setText = (id, text) => (document.getElementById(id).textContent = text);

  setText("lblHiddenTab", ui.hiddenTab);
  setText("lblHiddenWhere", ui.hiddenWhereTitle);
  setText("lblHiddenTransits", ui.hiddenTransitsTitle);
  setText("lblHiddenFilter", ui.colPlanet);
  setText("thHwPlanet", ui.colPlanet);
  setText("thHwSits", ui.colSitsIn);
  // Each hidden column says how its cells read: pada, rasi, bhavam.
  for (const [id, kind] of [["thHwUcham", "ucham"], ["thHwNeecham", "neecham"], ["thHwMt", "moolatrikonam"]]) {
    const th = document.getElementById(id);
    th.textContent = labels.hiddenKind[kind];
    const key = document.createElement("span");
    key.className = "th-key";
    key.textContent = ui.hiddenCellKey;
    th.appendChild(key);
  }
  for (const [id, key] of [["thHtPlanet", "colPlanet"], ["thHtPada", "colHiddenIn"],
    ["thHtNode", "colNode"], ["thHtTension", "colTensionIn"]]) {
    setText(id, ui[key]);
  }
  setText("hiddenNote", ui.hiddenNote);
  setText("thHtWhen", ui.colDates);
  setText("thHtPariharam", ui.colPariharam);

  // Where each planet hides them: one row per planet.
  const whereBody = document.getElementById("hiddenWhereBody");
  whereBody.innerHTML = "";
  for (const planet of DASA_PLANETS) {
    const mine = entries.filter((e) => e.planet === planet);
    if (!mine.length) continue;
    const cell = (kind) => {
      const e = mine.find((x) => x.kind === kind);
      return e ? `${hiddenAt(e)} \u00B7 ${ORDINAL[state.lang](e.house)}` : "\u2013";
    };
    const tr = document.createElement("tr");
    for (const text of [labels.planets[planet], pada(mine[0].b_nakshatra, mine[0].b_pada), cell("ucham"), cell("neecham"), cell("moolatrikonam")]) {
      const td = document.createElement("td");
      td.textContent = text;
      tr.appendChild(td);
    }
    whereBody.appendChild(tr);
  }

  // Every Rahu or Ketu pass, by date, with the running one highlighted.
  const now = new Date();
  const passes = entries
    .flatMap((e) => e.transits.map((t) => ({ e, t })))
    .sort((x, y) => new Date(x.t.start) - new Date(y.t.start));
  const running = passes.filter(({ t }) => new Date(t.start) <= now && now <= new Date(t.end));
  const next = passes.find(({ t }) => new Date(t.start) > now);
  const line = ({ e, t }) =>
    ui.hiddenSummaryLine
      .replace("{node}", labels.planets[t.node])
      .replace("{pada}", pada(e.hidden_nakshatra, e.hidden_pada))
      .replace("{planet}", labels.planets[e.planet])
      .replace("{kind}", labels.hiddenKind[e.kind].toLowerCase());
  setText(
    "hiddenSummary",
    running.length
      ? `${ui.peyarchiNow}: ` + running.map(line).join("  \u00B7  ")
      : next
        ? `${ui.hiddenNext}, ${fmtDate(next.t.start)}: ${line(next)}`
        : ui.hiddenNoTransits
  );

  const select = document.getElementById("hiddenFilter");
  select.innerHTML = "";
  for (const planet of ["", ...DASA_PLANETS]) {
    const opt = document.createElement("option");
    opt.value = planet;
    opt.textContent = planet ? labels.planets[planet] : ui.peyarchiAll;
    select.appendChild(opt);
  }
  select.value = state.hiddenPlanet;
  select.onchange = () => {
    state.hiddenPlanet = select.value;
    renderHiddenDignity();
  };

  const tbody = document.getElementById("hiddenTransitBody");
  tbody.innerHTML = "";
  for (const pass of passes) {
    const { e, t } = pass;
    if (state.hiddenPlanet && e.planet !== state.hiddenPlanet) continue;
    const tr = document.createElement("tr");
    if (running.includes(pass)) tr.className = "current-period";
    const tension = [
      ui.tensionKaraka.replace("{planet}", labels.planets[e.planet]).replace("{karakas}", labels.karakathvam[e.planet]),
      ui.tensionBhavam.replace("{house}", ORDINAL[state.lang](e.house)).replace("{meaning}", ui.houseMeanings[e.house - 1]),
    ];
    const cells = [
      [labels.planets[e.planet], labels.hiddenKind[e.kind]],
      [hiddenAt(e), `${ORDINAL[state.lang](e.house)} ${ui.bhavamWord}`],
      [labels.planets[t.node]],
      [`${fmtDate(t.start)} \u2192`, fmtDate(t.end)],
      tension,
      [RASI_PARIHARAM[e.hidden_rasi][state.lang], rasiGender(state.lang, e.hidden_rasi)],
    ];
    for (const [main, sub] of cells) {
      const td = document.createElement("td");
      td.textContent = main;
      if (sub) {
        const span = document.createElement("span");
        span.className = "peyarchi-sub";
        span.textContent = sub;
        td.appendChild(span);
      }
      tr.appendChild(td);
    }
    tbody.appendChild(tr);
  }
  if (!passes.length) {
    const tr = document.createElement("tr");
    const td = document.createElement("td");
    td.colSpan = 6;
    td.textContent = ui.hiddenNoTransits;
    tr.appendChild(td);
    tbody.appendChild(tr);
  }
}

// Gandantham: the six junction padas, the same six counted from the lagna, planets in them at
// birth, and every pass of Guru, Sani, Rahu and Ketu over them up to 2030 (laid out like Moorthy).
function renderGandantham() {
  const labels = L();
  const ui = labels.ui;
  const g = state.chart.gandantham;
  const setText = (id, text) => (document.getElementById(id).textContent = text);
  const pada = (nak, p) => `${labels.nakshatra[nak]} ${p}`;
  setText("lblGandTab", ui.gandanthamTab);
  setText("lblGandFixed", ui.gandFixedTitle);
  setText("lblGandLagna", ui.gandLagnaTitle.replace("{pada}", pada(g.lagna_nakshatra, g.lagna_pada)));
  setText("lblGandTransit", ui.gandTransitTitle);
  setText("lblGandFilter", ui.colPlanet);
  setText("gandNote", ui.gandNote);
  for (const [id, key] of [["thGtPlanet", "colPlanet"], ["thGtSet", "colSet"], ["thGtPada", "colPada"], ["thGtRasi", "colRasi"], ["thGtWhen", "colDates"]]) {
    setText(id, ui[key]);
  }

  // The lagna is always no. 1 of its own set, so it only counts as Gandantham when it is in a fixed pada.
  const lagnaInGandantham = g.fixed.some((p) => p.planets.includes("Lagna"));
  const counts = (p) => p.planets.some((n) => n !== "Lagna") || (p.planets.includes("Lagna") && lagnaInGandantham);
  const fillPadas = (tableId, bodyId, padas) => {
    const head = document.querySelector(`#${tableId} thead tr`).children;
    [ui.colNo, ui.colPada, ui.colRasi, ui.colPlanetsHere].forEach((text, i) => (head[i].textContent = text));
    const tbody = document.getElementById(bodyId);
    tbody.innerHTML = "";
    for (const p of padas) {
      const tr = document.createElement("tr");
      if (counts(p)) tr.className = "current-period";
      const names = p.planets.map((n) => (n === "Lagna" ? ui.lagna : labels.planets[n]));
      for (const text of [String(p.number), pada(p.nakshatra, p.pada), labels.rasi[p.rasi], names.join(", ") || "\u2013"]) {
        const td = document.createElement("td");
        td.textContent = text;
        tr.appendChild(td);
      }
      tbody.appendChild(tr);
    }
  };
  fillPadas("gandFixedTable", "gandFixedBody", g.fixed);
  fillPadas("gandLagnaTable", "gandLagnaBody", g.lagna);

  // Summary: planets at birth, then the running or next pass.
  const atBirth = [...g.fixed, ...g.lagna].flatMap((p) =>
    p.planets.filter((n) => n !== "Lagna" || lagnaInGandantham).map((n) => ui.gandAtPada.replace("{planet}", n === "Lagna" ? ui.lagna : labels.planets[n]).replace("{pada}", pada(p.nakshatra, p.pada)))
  );
  // A pada in both sets (when the lagna sits on a junction) is one crossing, so merge those rows.
  const passes = [];
  for (const t of g.transits) {
    const same = passes.find((x) => x.planet === t.planet && x.start === t.start && x.nakshatra === t.nakshatra && x.pada === t.pada);
    if (same) same.labels.push([t.source, t.number]);
    else passes.push({ ...t, labels: [[t.source, t.number]] });
  }
  const now = new Date();
  const running = passes.filter((t) => new Date(t.start) <= now && now <= new Date(t.end));
  const next = passes.find((t) => new Date(t.start) > now);
  const line = (t) => ui.gandTransitLine.replace("{planet}", labels.planets[t.planet]).replace("{pada}", pada(t.nakshatra, t.pada));
  const parts = [atBirth.length ? ui.gandSummaryBirth.replace("{list}", [...new Set(atBirth)].join(", ")) : ui.gandSummaryNone];
  if (running.length) parts.push(`${ui.peyarchiNow}: ${running.map(line).join(", ")}`);
  else if (next) parts.push(`${ui.hiddenNext}, ${fmtDate(next.start)}: ${line(next)}`);
  setText("gandSummary", parts.join("  \u00B7  "));

  const select = document.getElementById("gandFilter");
  select.innerHTML = "";
  for (const planet of ["", "Jupiter", "Saturn", "Rahu", "Ketu"]) {
    const opt = document.createElement("option");
    opt.value = planet;
    opt.textContent = planet ? labels.planets[planet] : ui.peyarchiAll;
    select.appendChild(opt);
  }
  select.value = state.gandPlanet;
  select.onchange = () => {
    state.gandPlanet = select.value;
    renderGandantham();
  };

  const tbody = document.getElementById("gandTransitBody");
  tbody.innerHTML = "";
  for (const t of passes) {
    if (state.gandPlanet && t.planet !== state.gandPlanet) continue;
    const tr = document.createElement("tr");
    if (running.includes(t)) tr.className = "current-period";
    for (const text of [
      labels.planets[t.planet],
      t.labels.map(([source, number]) => `${source === "fixed" ? ui.gandFixed : ui.gandLagna} \u00B7 ${number}`).join(", "),
      pada(t.nakshatra, t.pada),
      labels.rasi[t.rasi],
      `${fmtDate(t.start)} \u2192 ${fmtDate(t.end)}`,
    ]) {
      const td = document.createElement("td");
      td.textContent = text;
      tr.appendChild(td);
    }
    tbody.appendChild(tr);
  }
  if (!passes.length) {
    const tr = document.createElement("tr");
    const td = document.createElement("td");
    td.colSpan = 5;
    td.textContent = ui.gandNoTransits;
    tr.appendChild(td);
    tbody.appendChild(tr);
  }
}

// Dvadasamsham: each planet's career cadre from its D1 rasi counted to its D12 rasi.
function renderCareerCadres() {
  const labels = L();
  const ui = labels.ui;
  const entries = state.chart.career_cadres;
  const setText = (id, text) => (document.getElementById(id).textContent = text);
  setText("lblCareerTab", ui.careerTab);
  for (const [id, key] of [["thCrPlanet", "colPlanet"], ["thCrD1", "colD1RasiX"], ["thCrD12", "colD12Rasi"],
    ["thCrCount", "colCount"], ["thCrCadre", "colCadre"], ["thCrWork", "colWork"]]) {
    setText(id, ui[key]);
  }
  setText("careerNote", ui.careerNote);
  const tally = (cadre) => entries.filter((e) => e.cadre === cadre).length;
  setText("careerSummary", ui.careerSummary.replace("{a}", tally("A")).replace("{b}", tally("B")).replace("{c}", tally("C")));

  const tbody = document.getElementById("careerBody");
  tbody.innerHTML = "";
  for (const e of entries) {
    const tr = document.createElement("tr");
    tr.className = `cadre-${e.cadre}`;
    for (const text of [
      labels.planets[e.planet],
      `${labels.rasi[e.d1_rasi]} ${formatDMS(e.degree_in_sign)}`,
      labels.rasi[e.d12_rasi],
      String(e.count),
      `${e.cadre}, ${labels.cadreName[e.cadre]}`,
      labels.cadreWork[e.cadre],
    ]) {
      const td = document.createElement("td");
      td.textContent = text;
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
