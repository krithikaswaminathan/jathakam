"""Karakamsa (Jaimini), from the user's notes (Mani, Jaimini Astrology) with the user's choices.

The rasi the Atmakaraka occupies in the Navamsa is read two ways: as the lagna in the Navamsa (the
Swamsa, the soul's inner nature) and as the lagna in the birth chart (the Karakamsa, its outer
expression). The same readings are checked in both, counted from that rasi. A planet influences a
rasi when it is in it or aspects it by rasi drishti. Benefics are Jupiter and Venus; malefics the
Sun, Mars, Saturn, Rahu and Ketu. The Atmakaraka's own state is read in the Navamsa: its element,
its strength and the planets with it.
"""

from dataclasses import dataclass, field

from app.amsayu import OWN_RASIS, UCHAM_RASI
from app.astrology import ChartData
from app.constants import RASI_ELEMENTS
from app.rasi_drishti import aspected_rasis

CAREER_PLANETS = ["Sun", "Venus", "Saturn", "Mars", "Rahu"]  # the ones the notes give a field for
INFLUENCE_PLANETS = ["Jupiter", "Mars", "Venus"]  # each gives the soul's journey a theme
WITH_AK_PLANETS = ["Jupiter", "Saturn", "Venus"]
BENEFICS = ["Jupiter", "Venus"]
MALEFICS = ["Sun", "Mars", "Saturn", "Rahu", "Ketu"]
KENDRAS = (1, 4, 7, 10)
MEENAM = 11


def influencing(chart: ChartData, rasi: int, planets: list[str], exclude: str = "") -> list[str]:
    """Those of `planets` in `rasi` or aspecting it by rasi drishti."""
    return [p for p in planets if p != exclude and (chart.grahas[p].rasi == rasi or rasi in aspected_rasis(chart.grahas[p].rasi))]


@dataclass
class KarakamsaHouse:
    house: int  # from the Swamsa or Karakamsa (1 = that rasi itself)
    rasi: int
    planets: list[str]


@dataclass
class KarakamsaReading:
    kind: str  # "ketu", "venus12", "jupiter", "career", "influence", "spiritual", "tenth_amk", "seventh_benefic" or "seventh_malefic"
    planet: str = ""
    house: int = 0
    how: str = ""  # tenth_amk: "in" or "aspect"
    planets: list[str] = field(default_factory=list)  # seventh_*: the planets influencing it
    reasons: list[str] = field(default_factory=list)  # spiritual: "ketu", "jupiter", "pisces", "twelfth"


@dataclass
class KarakamsaView:
    chart: str  # "swamsa" (the Navamsa) or "karakamsa" (the birth chart)
    lagna_house: int  # the rasi's house from that chart's lagna
    houses: list[KarakamsaHouse]
    readings: list[KarakamsaReading]


@dataclass
class Karakamsa:
    atmakaraka: str
    ak_rasi: int  # in the birth chart
    rasi: int  # the Atmakaraka's Navamsa rasi
    element: str  # "fire", "earth", "air" or "water"
    ak_dignity: str | None  # "ucham", "own" or "neecham" in the Navamsa
    ak_benefics: list[str]  # influencing the Atmakaraka's rasi in the Navamsa
    ak_malefics: list[str]
    ak_strong: bool
    ak_weak: bool
    with_ak: list[str]  # Jupiter, Saturn or Venus with the Atmakaraka in the Navamsa
    views: list[KarakamsaView]


def _view(name: str, chart: ChartData, rasi: int, atmakaraka: str, amatyakaraka: str) -> KarakamsaView:
    house_of = {p: (g.rasi - rasi) % 12 + 1 for p, g in chart.grahas.items()}
    houses = [KarakamsaHouse(h, (rasi + h - 1) % 12, [p for p, n in house_of.items() if n == h]) for h in range(1, 13)]
    lagna_house = (rasi - chart.lagna_rasi) % 12 + 1
    readings = []
    if house_of["Ketu"] in (2, 3):
        readings.append(KarakamsaReading("ketu", "Ketu", house_of["Ketu"]))
    if house_of["Venus"] == 12:
        readings.append(KarakamsaReading("venus12", "Venus", 12))
    if house_of["Jupiter"] in KENDRAS:
        readings.append(KarakamsaReading("jupiter", "Jupiter", house_of["Jupiter"]))
    for planet in CAREER_PLANETS:
        if planet != atmakaraka and house_of[planet] == 1:
            readings.append(KarakamsaReading("career", planet, 1))
    for planet in influencing(chart, rasi, INFLUENCE_PLANETS, exclude=atmakaraka):
        readings.append(KarakamsaReading("influence", planet))
    reasons = [p.lower() for p in influencing(chart, rasi, ["Ketu", "Jupiter"], exclude=atmakaraka)]
    reasons += ["pisces"] if rasi == MEENAM else []
    reasons += ["twelfth"] if lagna_house == 12 else []
    if reasons:
        readings.append(KarakamsaReading("spiritual", reasons=reasons))
    tenth = (rasi + 9) % 12
    amk_rasi = chart.grahas[amatyakaraka].rasi
    if amk_rasi == tenth:
        readings.append(KarakamsaReading("tenth_amk", amatyakaraka, 10, "in"))
    elif tenth in aspected_rasis(amk_rasi):
        readings.append(KarakamsaReading("tenth_amk", amatyakaraka, 10, "aspect"))
    seventh = (rasi + 6) % 12
    for kind, group in (("seventh_benefic", BENEFICS), ("seventh_malefic", MALEFICS)):
        planets = influencing(chart, seventh, group)
        if planets:
            readings.append(KarakamsaReading(kind, house=7, planets=planets))
    return KarakamsaView(name, lagna_house, houses, readings)


def compute_karakamsa(d1: ChartData, d9: ChartData, atmakaraka: str, amatyakaraka: str) -> Karakamsa:
    rasi = d9.grahas[atmakaraka].rasi
    dignity = (
        "ucham" if rasi == UCHAM_RASI[atmakaraka]
        else "neecham" if rasi == (UCHAM_RASI[atmakaraka] + 6) % 12
        else "own" if rasi in OWN_RASIS[atmakaraka]
        else None
    )
    benefics = influencing(d9, rasi, BENEFICS, exclude=atmakaraka)
    malefics = influencing(d9, rasi, MALEFICS, exclude=atmakaraka)
    return Karakamsa(
        atmakaraka=atmakaraka,
        ak_rasi=d1.grahas[atmakaraka].rasi,
        rasi=rasi,
        element=RASI_ELEMENTS[rasi],
        ak_dignity=dignity,
        ak_benefics=benefics,
        ak_malefics=malefics,
        ak_strong=dignity in ("ucham", "own") or bool(benefics),
        ak_weak=dignity == "neecham" or bool(malefics),
        with_ak=[p for p in WITH_AK_PLANETS if p != atmakaraka and d9.grahas[p].rasi == rasi],
        views=[_view("swamsa", d9, rasi, atmakaraka, amatyakaraka), _view("karakamsa", d1, rasi, atmakaraka, amatyakaraka)],
    )
