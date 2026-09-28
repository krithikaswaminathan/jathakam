"""Navamsa Sashtashtagam: a planet whose D9 rasi is 6th or 8th from its D1 rasi.

Counted from the planet's D1 rasi (= 1) to its navamsa rasi. None of the nine being 6th or
8th is a big plus; a planet that is brings issues related to it and to the houses it rules
(its aathipathyam) in D1. The rule is the user's own.
"""

from dataclasses import dataclass

from app.astrology import ChartData, house_of_rasi
from app.constants import GRAHA_NAMES, RASI_LORDS

SASHTASHTAGAM_COUNTS = {6, 8}


@dataclass
class SashtashtagamEntry:
    planet: str
    d1_rasi: int
    d1_house: int
    d9_rasi: int
    count: int  # the D9 rasi counted from the D1 rasi, D1 rasi = 1
    flagged: bool
    houses_ruled: list[int]  # D1 houses whose rasi this planet lords; none for Rahu and Ketu


def houses_ruled(planet: str, lagna_rasi: int) -> list[int]:
    return sorted(house_of_rasi(rasi, lagna_rasi) for rasi in range(12) if RASI_LORDS[rasi] == planet)


def compute_navamsa_sashtashtagam(d1: ChartData, d9: ChartData) -> list[SashtashtagamEntry]:
    entries = []
    for name in GRAHA_NAMES:
        g = d1.grahas[name]
        d9_rasi = d9.grahas[name].rasi
        count = (d9_rasi - g.rasi) % 12 + 1
        entries.append(
            SashtashtagamEntry(
                planet=name,
                d1_rasi=g.rasi,
                d1_house=g.house,
                d9_rasi=d9_rasi,
                count=count,
                flagged=count in SASHTASHTAGAM_COUNTS,
                houses_ruled=houses_ruled(name, d1.lagna_rasi),
            )
        )
    return entries
