from dataclasses import dataclass

from app.astrology import ChartData, longitude_to_nakshatra_pada
from app.constants import DIGNITY

# Paramoccham and paramaneecham last one degree, ending at the deep degree: for the Sun
# (deep 10deg) from just past 9deg up to 10deg. Varaha Mihira, "Reflections on Uccha and
# Neecha of Grahas" (Thoughts on Jyotish, 2016), after BPHS 3.49-50.
PARAMA_SPAN = 1.0


@dataclass
class DignityEntry:
    planet: str
    state: str  # "ucham" (exalted) or "neecham" (debilitated)
    rasi: int
    degree_in_sign: float
    deep_degree: float | None
    degrees_from_deep: float | None
    nakshatra: int  # where the planet sits
    pada: int
    parama: bool  # inside the one-degree paramoccham / paramaneecham span
    deep_nakshatra: int | None  # the pada of the deep point in this rasi
    deep_pada: int | None


def deep_point_pada(rasi: int, deep_degree: float) -> tuple[int, int]:
    """The nakshatra pada holding the deep degree, taken just below it (the span ends there)."""
    return longitude_to_nakshatra_pada(rasi * 30 + deep_degree - 1e-6)


def in_parama(degree_in_sign: float, deep_degree: float) -> bool:
    return deep_degree - PARAMA_SPAN < degree_in_sign <= deep_degree


def compute_dignities(chart: ChartData) -> list[DignityEntry]:
    """Planets in their exaltation or debilitation sign (D1, sign-based), with the
    paramoccham / paramaneecham check. Neecha Bhanga is not modeled."""
    entries = []
    for planet, (exalt_rasi, debil_rasi, deep) in DIGNITY.items():
        graha = chart.grahas[planet]
        if graha.rasi == exalt_rasi:
            state = "ucham"
        elif graha.rasi == debil_rasi:
            state = "neecham"
        else:
            continue
        distance = abs(graha.degree_in_sign - deep) if deep is not None else None
        deep_nak, deep_pada = deep_point_pada(graha.rasi, deep) if deep is not None else (None, None)
        entries.append(
            DignityEntry(
                planet=planet,
                state=state,
                rasi=graha.rasi,
                degree_in_sign=graha.degree_in_sign,
                deep_degree=deep,
                degrees_from_deep=distance,
                nakshatra=graha.nakshatra,
                pada=graha.pada,
                parama=deep is not None and in_parama(graha.degree_in_sign, deep),
                deep_nakshatra=deep_nak,
                deep_pada=deep_pada,
            )
        )
    return entries
