"""Jaimini rasi drishti. A movable rasi aspects every fixed rasi except the one next to it (the 5th,
8th and 11th from it), a fixed rasi every movable rasi except the one next to it (the 3rd, 6th and
9th), and a dual rasi the other three duals (the 4th, 7th and 10th). Every aspect is mutual, and every
planet in a rasi, Rahu and Ketu included, aspects what its rasi aspects."""

from dataclasses import dataclass

from app.astrology import ChartData
from app.constants import FIXED_RASIS, MOVABLE_RASIS


def aspected_rasis(rasi: int) -> list[int]:
    counts = (5, 8, 11) if rasi in MOVABLE_RASIS else (3, 6, 9) if rasi in FIXED_RASIS else (4, 7, 10)
    return [(rasi + c - 1) % 12 for c in counts]


def planets_aspecting(d1: ChartData, rasi: int) -> list[str]:
    """Planets in the rasis that aspect `rasi`, in chart order."""
    aspecting = set(aspected_rasis(rasi))  # mutual, so the rasis it aspects are the ones aspecting it
    return [name for name, g in d1.grahas.items() if g.rasi in aspecting]


@dataclass
class RasiDrishti:
    rasi: int
    house: int
    planets: list[str]
    aspects: list[int]
    aspected_by: list[str]


def compute_rasi_drishti(d1: ChartData) -> list[RasiDrishti]:
    return [
        RasiDrishti(
            rasi=rasi,
            house=(rasi - d1.lagna_rasi) % 12 + 1,
            planets=[name for name, g in d1.grahas.items() if g.rasi == rasi],
            aspects=aspected_rasis(rasi),
            aspected_by=planets_aspecting(d1, rasi),
        )
        for rasi in range(12)
    ]
