# Namma Jothidam

A personal Vedic astrology birth chart (jathakam) calculator, with an English/Tamil toggle.

- **Birth details**: place-name search (Open-Meteo geocoding) fills in latitude, longitude and
  time zone; 12-hour time picker.
- **Charts**: South Indian style rasi chart (D1) with retrograde marking and Gulika/Mandi placed
  in the grid, plus divisional charts D2, D3, D7, D9, D10, D12 and D60.
- **Under the chart**: Indu Lagna, Pranapada, Tithi/Thithi Soonyam, Mudakku Rasi, Upasana
  Deivam and Kaala Pakai each sit in a collapsed box; click a title to open it.
- **Special lagnas**: Indu Lagna and Pranapada Lagna.
- **Tithi and Thithi Soonyam**: birth tithi, its void (soonya) rasis with their lords, houses
  and occupants, hatched in the D1 grid.
- **Mudakku Rasi**: from the Sun's nakshatra pada, with its rasi and star lords, house and
  occupants, tagged in the D1 grid; flags when it is the lagna, which is said to weaken it.
- **Graha details**: rasi and nakshatra lords, absolute and in-sign degrees, a Pushkara
  Navamsa column, and a Kaala Pakai column with a summary line above the table.
- **Kaala Pakai**: grahas sitting in their Kaala Pakai rasi in the D1 chart, with the rasi,
  house and effect; a planet picker shows any graha's Kaala Pakai rasis.
- **Ucham / Neecham**: planets in exaltation or debilitation, with distance from the deep
  exaltation/debilitation degree.
- **Dasa**: Vimshottari dasa down to Prana level, with the current period highlighted.
- **Tara Balam** from the birth star.
- **Yogas and doshas**: Mangal Dosha, Gaja Kesari, Budhaditya, Chandra-Mangal, Kemadruma
  (simplified), Soorya Chandraadhi and the five Pancha Mahapurusha yogas, each marked Present or
  Not present.
- **Upasana Deivam**: the 11th rasi from Jupiter (for a man) or Venus (for a woman), with its
  temple and deity; any other rasi can be looked up too.
- **Reading**: side-nav pages explaining the method, tables and sources for Pushkara Navamsa,
  Pancha Mahapurusha yogas, Ucham/Neecham, Pranapada, Thithi Soonyam, Mudakku, Soorya Chandraadhi
  Yoga and Kaala Pakai.
- **Saved charts**: stored locally, recomputed on load, and deletable.

## Setup

Requires Python 3.11 (pyswisseph has no prebuilt wheel for newer Python versions yet).

```bash
brew install python@3.11
python3.11 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

Without Homebrew, [uv](https://docs.astral.sh/uv/) can fetch Python 3.11 into your home directory:

```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
uv venv --python 3.11 .venv
uv pip install --python .venv/bin/python -r requirements.txt
```

### Ephemeris data

Download the Swiss Ephemeris files into `ephe/` (one-time, ~1.8MB, not committed to git):

```bash
curl -sfL -o ephe/sepl_18.se1 https://raw.githubusercontent.com/aloistr/swisseph/master/ephe/sepl_18.se1
curl -sfL -o ephe/semo_18.se1 https://raw.githubusercontent.com/aloistr/swisseph/master/ephe/semo_18.se1
```

## Run

```bash
source .venv/bin/activate
uvicorn app.main:app --reload
```

Open http://127.0.0.1:8000 in a browser.

## Test

```bash
source .venv/bin/activate
python -m pytest tests/ -v
```

## Notes

- Ayanamsa: Lahiri. Node: Mean Node (not True Node).
- Houses: whole-sign, from the lagna.
- Gulika is cast from the start of Saturn's day/night segment and Mandi from its middle;
  both are shown because traditions differ on which to use.
- Pranapada uses the BPHS method: Sun + ishta kala from sunrise, plus a correction for the
  Sun's sign type (movable +0°, dual +120°, fixed +240°).
- Thithi Soonyam uses the South Indian panchanga table, the same for both pakshas; sources
  cite no classical text for it.
- Mudakku counts padas from the Sun's pada to the same pada of Moolam, then the same again
  from there; the landing pada's rasi is the Mudakku rasi. Some versions count whole stars from
  Pooradam instead.
- Upasana Deivam: the rasi-to-temple/deity list is the author's own, not from a published
  source. Charts with gender "Other" get no computed rasi; the lookup still works.
- Classical cancellation conditions (for example, Neecha Bhanga and Mangal Dosha
  cancellations) are not modeled. Each yoga's description in the app says what is checked.
- Tara Balam is computed from the birth star only (not two-person compatibility).
- Data is stored locally in `jathakam.db` (SQLite), gitignored.
- Kaala Pakai: the planet-to-rasi table and its effects come from a video, not a written
  source. D1 only, and the whole rasi counts regardless of degree. Ketu has no Kaala Pakai rasi.
  The table is kept in both `app/constants.py` and `static/labels.js`, so change both together.
- Soorya Chandraadhi Yoga: the Sun's house from the lagna (lagna = 1), counted that many rasis
  from Mesha (Mesha = 1), must hold the Moon. D1 only; the rule is the author's own, with no
  written source.
