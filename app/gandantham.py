"""Gandantham: the junction padas where a water sign ends and a fire sign begins.

Out of the 108 padas of the Kaala Purusha chart these are the 1st, 36th, 37th, 72nd, 73rd and
108th (Ashwini 1, Ayilyam 4, Magam 1, Kettai 4, Moolam 1, Revathi 4). The same pattern is also
counted from a chart's own lagna pada (as the 1st). Planets in either set at birth are listed, and
so are the passes of slow transit planets over them.
"""

from dataclasses import dataclass, field
from datetime import datetime

from app.astrology import ChartData
from app.constants import GRAHA_NAMES
from app.navamsa_sashtashtagam import NavamsaPoint, transit_windows

PADAS = 108
PADA_SPAN = 360 / PADAS
NUMBERS = [1, 36, 37, 72, 73, 108]  # pada numbers, counted from Ashwini 1 or from the lagna pada
TRANSIT_PLANETS = ["Jupiter", "Saturn", "Rahu", "Ketu"]


@dataclass
class GandanthamPada:
    number: int  # 1, 36, 37, 72, 73 or 108
    nakshatra: int
    pada: int
    rasi: int
    planets: list[str]  # birth-chart planets sitting in it, with "Lagna" where the lagna is


@dataclass
class GandanthamTransit:
    planet: str
    source: str  # "fixed" (Kaala Purusha) or "lagna"
    number: int
    nakshatra: int
    pada: int
    rasi: int
    start: datetime  # UTC
    end: datetime


@dataclass
class Gandantham:
    lagna_nakshatra: int
    lagna_pada: int
    fixed: list[GandanthamPada]
    lagna: list[GandanthamPada]
    transits: list[GandanthamTransit] = field(default_factory=list)


def pada_index(longitude: float) -> int:
    return int((longitude % 360) // PADA_SPAN)


def _padas(first_index: int, chart: ChartData, lagna_index: int | None = None) -> list[GandanthamPada]:
    """With lagna_index, the lagna is checked like a planet (used for the fixed Kaala Purusha set)."""
    at = {name: g.nakshatra * 4 + g.pada - 1 for name, g in chart.grahas.items() if name in GRAHA_NAMES}
    out = []
    for number in NUMBERS:
        index = (first_index + number - 1) % PADAS
        planets = (["Lagna"] if lagna_index == index else []) + [name for name in GRAHA_NAMES if at[name] == index]
        out.append(GandanthamPada(number, index // 4, index % 4 + 1, index // 9, planets))
    return out


def compute_gandantham(
    chart: ChartData, lagna_longitude: float, start: datetime | None = None, end: datetime | None = None
) -> Gandantham:
    """With start and end, also every pass of Jupiter, Saturn, Rahu and Ketu over both sets."""
    lagna_index = pada_index(lagna_longitude)
    # The lagna is marked wherever it is: in the fixed six when it falls in one, and always on
    # no. 1 of the set counted from itself.
    result = Gandantham(
        lagna_index // 4, lagna_index % 4 + 1, _padas(0, chart, lagna_index), _padas(lagna_index, chart, lagna_index)
    )
    if start is None or end is None:
        return result
    for source, padas in (("fixed", result.fixed), ("lagna", result.lagna)):
        for p in padas:
            index = p.nakshatra * 4 + p.pada - 1
            point = NavamsaPoint(p.nakshatra, p.pada, index * PADA_SPAN, (index + 1) * PADA_SPAN)
            for planet in TRANSIT_PLANETS:
                for w in transit_windows(planet, point, start, end):
                    result.transits.append(
                        GandanthamTransit(planet, source, p.number, p.nakshatra, p.pada, p.rasi, w.start, w.end)
                    )
    result.transits.sort(key=lambda t: t.start)
    return result
