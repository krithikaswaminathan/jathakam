"""Dwadasamsa career cadres (the user's method).

For each of the nine planets, count from its D1 rasi (X, as 1) to its D12 rasi (Y).
1, 4, 7, 10 is Cadre A (effort, physical work), 2, 5, 8, 11 is Cadre B (knowledge work)
and 3, 6, 9, 12 is Cadre C (service and volunteer work). Since a rasi's first dwadasamsa
falls in the rasi itself, the count is also which 2deg30' part of its rasi the planet is in.
"""

from dataclasses import dataclass

from app.astrology import ChartData
from app.constants import GRAHA_NAMES

CADRES = {1: "A", 4: "A", 7: "A", 10: "A", 2: "B", 5: "B", 8: "B", 11: "B", 3: "C", 6: "C", 9: "C", 12: "C"}


@dataclass
class CareerCadre:
    planet: str
    d1_rasi: int
    degree_in_sign: float
    d12_rasi: int
    count: int
    cadre: str


def compute_career_cadres(d1: ChartData, d12: ChartData) -> list[CareerCadre]:
    entries = []
    for name in GRAHA_NAMES:
        g = d1.grahas[name]
        d12_rasi = d12.grahas[name].rasi
        count = (d12_rasi - g.rasi) % 12 + 1
        entries.append(CareerCadre(name, g.rasi, g.degree_in_sign, d12_rasi, count, CADRES[count]))
    return entries
