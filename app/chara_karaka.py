"""Jaimini chara karakas, the seven-karaka system: the seven planets from the Sun to Saturn ranked by
their degree within the rasi, highest first. Rahu and Ketu take no karaka in this system. Degrees
are compared at full precision, so a tie would need the same longitude to a fraction of a second."""

from dataclasses import dataclass

from app.astrology import ChartData

SEVEN_PLANETS = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn"]
KARAKAS = ["AK", "AmK", "BK", "MK", "PK", "GK", "DK"]  # Atmakaraka down to Darakaraka


@dataclass
class CharaKaraka:
    karaka: str
    planet: str
    rasi: int
    degree_in_sign: float


def compute_chara_karakas(d1: ChartData) -> list[CharaKaraka]:
    ranked = sorted(SEVEN_PLANETS, key=lambda p: d1.grahas[p].degree_in_sign, reverse=True)
    return [
        CharaKaraka(karaka, planet, d1.grahas[planet].rasi, d1.grahas[planet].degree_in_sign)
        for karaka, planet in zip(KARAKAS, ranked)
    ]
