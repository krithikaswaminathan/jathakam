"""Pindayu (BPHS 43.4-15) and Nisargayu (BPHS 43.16-17), with the same haranams as Amsayu
(see app/amsayu.py).

Each planet gives up to its full years (Suriyan 19, Chandran 25, Sevvai 15, Budhan 12, Guru 15,
Sukran 21, Sani 20): all of them at its deep ucham point, half at its deep neecham point, and pro rata
between. The lagna gives the same years as in Amsayu. There are no increases. The haranams are
worked out as shares of each planet's own years. Figures are in days of a 360-day year.

Nisargayu is worked out the same way with the natural years instead (Chandran 1, Sevvai 2, Budhan 9,
Sukran 20, Guru 18, Suriyan 20, Sani 50), following Sarajit Poddar, Health and Longevity, p. 234.
"""

from dataclasses import dataclass, field

from app.amsayu import SEVEN, SOLAR_YEAR_DAYS, YEAR_DAYS, Haranam, apply_haranams, lagna_a_days, last_degree_house
from app.astrology import ChartData

MAX_YEARS = {"Sun": 19, "Moon": 25, "Mars": 15, "Mercury": 12, "Jupiter": 15, "Venus": 21, "Saturn": 20}
NISARGA_YEARS = {"Sun": 20, "Moon": 1, "Mars": 2, "Mercury": 9, "Jupiter": 18, "Venus": 20, "Saturn": 50}
DEEP_UCHAM = {"Sun": 10.0, "Moon": 33.0, "Mars": 298.0, "Mercury": 165.0, "Jupiter": 95.0, "Venus": 357.0, "Saturn": 200.0}


@dataclass
class PindayuRow:
    body: str
    longitude: float
    rasi: int
    degree_in_sign: float
    house: int
    max_years: int | None  # None for the lagna
    share: float | None  # of max_years, 0.5 at deep neecham to 1 at deep ucham
    a_days: int  # the years before the cuts
    haranams: list[Haranam] = field(default_factory=list)
    loss_days: int = 0
    c_days: int = 0

    @property
    def b_days(self) -> int:  # what apply_haranams cuts from; Pindayu has no increases
        return self.a_days


@dataclass
class Pindayu:
    rows: list[PindayuRow]
    a_days: int
    c_days: int
    solar_years: float


def pinda_share(name: str, longitude: float) -> float:
    """1 at the deep ucham point falling evenly to 0.5 at the deep neecham point, either way round."""
    from_ucham = abs((longitude - DEEP_UCHAM[name] + 180) % 360 - 180)  # 0..180
    return 1 - from_ucham / 360


def compute_pindayu(d1: ChartData, lagna_longitude: float, full_years: dict[str, int] = MAX_YEARS) -> Pindayu:
    lagna_days = lagna_a_days(lagna_longitude)
    rows = [PindayuRow("Lagna", lagna_longitude, d1.lagna_rasi, lagna_longitude % 30, 1, None, None,
                       lagna_days, c_days=lagna_days)]
    planets = []
    for name in SEVEN:
        g = d1.grahas[name]
        share = pinda_share(name, g.longitude)
        planets.append(PindayuRow(name, g.longitude, g.rasi, g.degree_in_sign, last_degree_house(d1, name),
                                  full_years[name], share, round(full_years[name] * share * YEAR_DAYS)))
    apply_haranams(planets, d1)
    rows += planets
    c_days = sum(r.c_days for r in rows)
    return Pindayu(rows=rows, a_days=sum(r.a_days for r in rows), c_days=c_days, solar_years=c_days / SOLAR_YEAR_DAYS)


def compute_nisargayu(d1: ChartData, lagna_longitude: float) -> Pindayu:
    return compute_pindayu(d1, lagna_longitude, NISARGA_YEARS)
