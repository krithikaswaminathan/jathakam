"""Amsayu (BPHS 43.18-22), as worked out with the user against a hand-worked chart.

All figures are kept in days of a 360-day year (30-day months), the Chandramanam reckoning.

A  Original years. A planet gives its navamsa count from Mesham (longitude in minutes / 200),
   with multiples of 12 removed: the whole part is years and the fraction x 360 is days.
   The lagna gives one year per rasi crossed and the part of a rasi pro rata (longitude / 30).
B  A after the increases, applied once and never to the lagna or to a planet 29deg or more into
   its rasi: tripled in its ucham rasi or vakram; otherwise doubled in its own house, vargottamam,
   or its own house in the navamsa or drekkana.
C  B less the haranams, each worked out as a share of the planet's A and capped at A:
   Chakrapata for houses 7-12 (whole rasis from the lagna, a planet 29deg+ counted in the next
   house): malefics lose 1/6, 1/5, 1/4, 1/3, 1/2, all; benefics half that. Only one planet per
   rasi takes it, the one with the most years (BPHS 43.10-11). Ashtanga: half for a combust
   Chandran, Sevvai or Guru. Shatru Kshetra: a third in an enemy's rasi, not when vakram. Only
   the half applies when a planet is both combust and in an enemy's rasi (BPHS 43.22).
Souramanam  C in solar years: C's days / 365.2654.
"""

from dataclasses import dataclass, field

from app.astrology import ChartData
from app.constants import RASI_LORDS

SEVEN = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn"]
UCHAM_RASI = {"Sun": 0, "Moon": 1, "Mars": 9, "Mercury": 5, "Jupiter": 3, "Venus": 11, "Saturn": 6}
OWN_RASIS = {
    "Sun": {4}, "Moon": {3}, "Mars": {0, 7}, "Mercury": {2, 5},
    "Jupiter": {8, 11}, "Venus": {1, 6}, "Saturn": {9, 10},
}
# Natural enemies (naisargika shatru).
ENEMIES = {
    "Sun": {"Venus", "Saturn"}, "Moon": set(), "Mars": {"Mercury"}, "Mercury": {"Moon"},
    "Jupiter": {"Mercury", "Venus"}, "Venus": {"Sun", "Moon"}, "Saturn": {"Sun", "Moon", "Mars"},
}
MALEFICS = {"Sun", "Mars", "Saturn"}  # Chandran, Budhan, Guru and Sukran are benefics here
CHAKRAPATA_SHARE = {7: 1 / 6, 8: 1 / 5, 9: 1 / 4, 10: 1 / 3, 11: 1 / 2, 12: 1.0}
# Combustion limits from the Suriyan. Budhan, Sukran and Sani are exempt from Ashtanga.
COMBUST_ORB = {"Moon": 12.0, "Mars": 17.0, "Jupiter": 11.0}
LAST_DEGREE = 29.0
YEAR_DAYS = 360
SOLAR_YEAR_DAYS = 365.2654


@dataclass
class Haranam:
    kind: str  # "chakrapata", "ashtanga" or "shatru"
    share: float  # of the planet's A
    house: int | None = None  # for chakrapata


@dataclass
class AmsayuRow:
    body: str  # "Lagna" or a planet
    longitude: float
    rasi: int
    degree_in_sign: float
    house: int  # whole-rasi house from the lagna, after the last-degree move
    a_days: int
    increase: str | None  # "x3" or "x2", or None
    increase_reasons: list[str]  # e.g. ["ucham"], ["own_house", "own_drekkana"], ["last_degree"]
    b_days: int
    haranams: list[Haranam] = field(default_factory=list)
    loss_days: int = 0
    c_days: int = 0


@dataclass
class Amsayu:
    rows: list[AmsayuRow]
    a_days: int
    b_days: int
    c_days: int
    solar_years: float  # C in Souramanam years


def planet_a_days(longitude: float) -> int:
    navamsas = longitude * 60 / 200
    whole = int(navamsas)
    return (whole % 12) * YEAR_DAYS + round((navamsas - whole) * YEAR_DAYS)


def lagna_a_days(longitude: float) -> int:
    return round(longitude / 30 * YEAR_DAYS)


def last_degree_house(d1: ChartData, name: str) -> int:
    """Whole-rasi house from the lagna, with a planet 29deg or more into its rasi counted in the next."""
    g = d1.grahas[name]
    house = (g.rasi - d1.lagna_rasi) % 12 + 1
    return house % 12 + 1 if g.degree_in_sign >= LAST_DEGREE else house


def apply_haranams(planets: list, d1: ChartData) -> None:
    """Fill haranams, loss_days and c_days on each row. A row needs body, rasi, house, a_days (what
    the shares are taken of) and b_days (the years before the cuts). Shared by Amsayu and Pindayu."""
    sun = d1.grahas["Sun"].longitude
    # Chakrapata: one planet per rasi in houses 7-12, the one with the most years.
    by_rasi: dict[int, list] = {}
    for row in planets:
        if row.house in CHAKRAPATA_SHARE:
            by_rasi.setdefault(row.rasi, []).append(row)
    takers = {max(rows_here, key=lambda r: r.b_days).body for rows_here in by_rasi.values()}

    for row in planets:
        g = d1.grahas[row.body]
        if row.body in takers:
            share = CHAKRAPATA_SHARE[row.house] * (1 if row.body in MALEFICS else 0.5)
            row.haranams.append(Haranam("chakrapata", share, row.house))
        combust = row.body in COMBUST_ORB and abs((g.longitude - sun + 180) % 360 - 180) <= COMBUST_ORB[row.body]
        enemy = RASI_LORDS[row.rasi] in ENEMIES[row.body] and not g.retrograde
        if combust:
            row.haranams.append(Haranam("ashtanga", 0.5))  # only the half, even in an enemy's rasi
        elif enemy:
            row.haranams.append(Haranam("shatru", 1 / 3))
        share = min(sum(h.share for h in row.haranams), 1.0)
        row.loss_days = round(row.a_days * share)
        row.c_days = max(row.b_days - row.loss_days, 0)


def compute_amsayu(d1: ChartData, d9: ChartData, d3: ChartData, lagna_longitude: float) -> Amsayu:
    lagna_days = lagna_a_days(lagna_longitude)
    rows = [AmsayuRow("Lagna", lagna_longitude, d1.lagna_rasi, lagna_longitude % 30, 1,
                      lagna_days, None, [], lagna_days, c_days=lagna_days)]

    planets: list[AmsayuRow] = []
    for name in SEVEN:
        g = d1.grahas[name]
        a = planet_a_days(g.longitude)
        last = g.degree_in_sign >= LAST_DEGREE
        if last:
            increase, reasons = None, ["last_degree"]
        elif g.rasi == UCHAM_RASI[name] or g.retrograde:
            increase = "x3"
            reasons = (["ucham"] if g.rasi == UCHAM_RASI[name] else []) + (["vakram"] if g.retrograde else [])
        else:
            reasons = [reason for reason, holds in [
                ("own_house", g.rasi in OWN_RASIS[name]),
                ("vargottamam", g.rasi == d9.grahas[name].rasi),
                ("own_navamsa", d9.grahas[name].rasi in OWN_RASIS[name]),
                ("own_drekkana", d3.grahas[name].rasi in OWN_RASIS[name]),
            ] if holds]
            increase = "x2" if reasons else None
        b = a * {"x3": 3, "x2": 2, None: 1}[increase]
        planets.append(AmsayuRow(name, g.longitude, g.rasi, g.degree_in_sign, last_degree_house(d1, name),
                                 a, increase, reasons, b))

    apply_haranams(planets, d1)

    rows += planets
    c_days = sum(r.c_days for r in rows)
    return Amsayu(
        rows=rows,
        a_days=sum(r.a_days for r in rows),
        b_days=sum(r.b_days for r in rows),
        c_days=c_days,
        solar_years=c_days / SOLAR_YEAR_DAYS,
    )
