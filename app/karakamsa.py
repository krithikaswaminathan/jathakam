"""Karakamsa Lagna (Jaimini): the rasi the Atmakaraka occupies in the Navamsa. Houses are counted
from it in the Navamsa, the 12th being the house of moksha. The readings are from the user's notes
(Mani, Jaimini Astrology): Ketu in the 2nd or 3rd, Venus in the 12th, Jupiter in a kendra, and the
line of work from the planets in the Karakamsa other than the Atmakaraka itself (user's choice)."""

from dataclasses import dataclass

from app.astrology import ChartData

CAREER_PLANETS = ["Sun", "Venus", "Saturn", "Mars", "Rahu"]  # the ones the notes give a field for
KENDRAS = (1, 4, 7, 10)


@dataclass
class KarakamsaHouse:
    house: int  # from the Karakamsa (1 = the Karakamsa itself)
    rasi: int
    planets: list[str]  # in the Navamsa


@dataclass
class KarakamsaReading:
    kind: str  # "ketu", "venus12", "jupiter" or "career"
    planet: str
    house: int


@dataclass
class Karakamsa:
    atmakaraka: str
    ak_rasi: int  # in the rasi chart
    rasi: int  # the Karakamsa Lagna, the Atmakaraka's Navamsa rasi
    houses: list[KarakamsaHouse]
    readings: list[KarakamsaReading]


def compute_karakamsa(d1: ChartData, d9: ChartData, atmakaraka: str) -> Karakamsa:
    rasi = d9.grahas[atmakaraka].rasi
    house_of = {name: (g.rasi - rasi) % 12 + 1 for name, g in d9.grahas.items()}
    houses = [
        KarakamsaHouse(h, (rasi + h - 1) % 12, [name for name, n in house_of.items() if n == h])
        for h in range(1, 13)
    ]
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
    return Karakamsa(atmakaraka, d1.grahas[atmakaraka].rasi, rasi, houses, readings)
