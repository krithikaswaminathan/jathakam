"""Where each planet hides its ucham, neecham and moolatrikonam (the user's method).

A is the planet's pada for that state in the Kaala Purusha chart: its paramoccham pada, its
paramaneecham pada, or the first pada of its moolatrikonam. B is the pada the planet sits in.
C is the number of padas from A to B, counting both. Counting C padas again from B (as 1)
lands on the hidden pada. Rahu and Ketu have no moolatrikonam here.

When transit Rahu or Ketu passes over a hidden pada, it causes tension in the hiding planet's
karakathvam and in the bhavam (house from the lagna) that the pada falls in.
"""

from dataclasses import dataclass, field
from datetime import datetime

from app.astrology import ChartData
from app.constants import DIGNITY, GRAHA_NAMES
from app.dignity import deep_point_pada
from app.navamsa_sashtashtagam import NavamsaPoint, transit_windows

PADAS = 108
PADA_SPAN = 360 / PADAS

# Moolatrikonam (BPHS): planet -> (rasi, starting degree). A is the first pada of the range.
MOOLATRIKONA_START = {
    "Sun": (4, 0.0),  # Simham 0-20
    "Moon": (1, 3.0),  # Rishabam after 3
    "Mars": (0, 0.0),  # Mesham 0-12
    "Mercury": (5, 16.0),  # Kanni 16-20
    "Jupiter": (8, 0.0),  # Dhanus 0-10
    "Venus": (6, 0.0),  # Thulam 0-15
    "Saturn": (10, 0.0),  # Kumbham 0-20
}


@dataclass
class NodeTransit:
    node: str  # "Rahu" or "Ketu"
    start: datetime  # UTC
    end: datetime


@dataclass
class HiddenDignity:
    planet: str
    kind: str  # "ucham", "neecham" or "moolatrikonam"
    a_nakshatra: int
    a_pada: int
    b_nakshatra: int
    b_pada: int
    count: int  # C
    hidden_nakshatra: int
    hidden_pada: int
    hidden_rasi: int
    house: int  # the bhavam, counted from the lagna
    transits: list[NodeTransit] = field(default_factory=list)  # only when a window is asked for


def _index(nakshatra: int, pada: int) -> int:
    return nakshatra * 4 + pada - 1


def _from_index(index: int) -> tuple[int, int]:
    return index // 4, index % 4 + 1


def moolatrikona_pada(planet: str) -> tuple[int, int]:
    rasi, start = MOOLATRIKONA_START[planet]
    return _from_index(int((rasi * 30 + start + 1e-6) // PADA_SPAN))


def hide(a: tuple[int, int], b: tuple[int, int]) -> tuple[int, tuple[int, int]]:
    """C (from A to B, both counted) and the pada C padas on from B (B counted as 1)."""
    ai, bi = _index(*a), _index(*b)
    count = (bi - ai) % PADAS + 1
    return count, _from_index((bi + count - 1) % PADAS)


def node_transits(nakshatra: int, pada: int, start: datetime, end: datetime) -> list[NodeTransit]:
    """Every stretch between start and end when transit Rahu or Ketu is in this pada, by start."""
    index = _index(nakshatra, pada)
    point = NavamsaPoint(nakshatra, pada, index * PADA_SPAN, (index + 1) * PADA_SPAN)
    found = [NodeTransit(node, w.start, w.end) for node in ("Rahu", "Ketu") for w in transit_windows(node, point, start, end)]
    return sorted(found, key=lambda t: t.start)


def compute_hidden_dignities(
    chart: ChartData, start: datetime | None = None, end: datetime | None = None
) -> list[HiddenDignity]:
    """With start and end, each hidden pada also gets the Rahu and Ketu transits over it."""
    entries = []
    for planet in GRAHA_NAMES:
        g = chart.grahas[planet]
        exalt, debil, deep = DIGNITY[planet]
        sources = [("ucham", deep_point_pada(exalt, deep)), ("neecham", deep_point_pada(debil, deep))]
        if planet in MOOLATRIKONA_START:
            sources.append(("moolatrikonam", moolatrikona_pada(planet)))
        for kind, a in sources:
            count, (nak, pada) = hide(a, (g.nakshatra, g.pada))
            rasi = _index(nak, pada) // 9
            entries.append(
                HiddenDignity(
                    planet, kind, a[0], a[1], g.nakshatra, g.pada, count, nak, pada, rasi,
                    house=(rasi - chart.lagna_rasi) % 12 + 1,
                    transits=node_transits(nak, pada, start, end) if start is not None and end is not None else [],
                )
            )
    return entries
