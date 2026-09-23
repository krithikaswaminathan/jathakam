# Namma Jothidam

A personal Vedic astrology birth chart (jathakam) calculator: South Indian style rasi chart,
divisional charts (D2/D3/D7/D9/D10/D12), Vimshottari dasa down to Prana level, Tara Balam,
a starter set of yoga/dosha rules, saved locally, with an English/Tamil toggle.

## Setup

Requires Python 3.11 (pyswisseph has no prebuilt wheel for newer Python versions yet).

```bash
brew install python@3.11
python3.11 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
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
- Data is stored locally in `jathakam.db` (SQLite), gitignored.
- Yoga/dosha detection is a small starter set (5 rules); classical cancellation
  conditions are not modeled — see each yoga's description in the app.
- Tara Balam is computed from the birth star only (not two-person compatibility).
