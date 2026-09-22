from dataclasses import dataclass, field

from app.constants import DUAL_RASIS, FIXED_RASIS, GRAHA_NAMES, MOVABLE_RASIS

NAKSHATRA_SPAN = 360 / 27
PADA_SPAN = NAKSHATRA_SPAN / 4


@dataclass
class GrahaPosition:
    name: str
    longitude: float
    rasi: int
    house: int
    nakshatra: int
    pada: int


@dataclass
class ChartData:
    lagna_rasi: int
    grahas: dict[str, GrahaPosition] = field(default_factory=dict)
    houses: dict[int, list[str]] = field(default_factory=dict)


def longitude_to_rasi(longitude: float) -> int:
    return int(longitude // 30) % 12


def longitude_to_nakshatra_pada(longitude: float) -> tuple[int, int]:
    nak = int(longitude // NAKSHATRA_SPAN) % 27
    within = longitude % NAKSHATRA_SPAN
    pada = int(within // PADA_SPAN) + 1
    return nak, pada


def whole_sign_houses(lagna_rasi: int) -> dict[int, int]:
    return {house: (lagna_rasi + house - 1) % 12 for house in range(1, 13)}


def house_of_rasi(rasi: int, lagna_rasi: int) -> int:
    return ((rasi - lagna_rasi) % 12) + 1


def build_chart(lagna_longitude: float, graha_longitudes: dict[str, float]) -> ChartData:
    lagna_rasi = longitude_to_rasi(lagna_longitude)
    houses: dict[int, list[str]] = {h: [] for h in range(1, 13)}
    grahas: dict[str, GrahaPosition] = {}
    for name in GRAHA_NAMES:
        longitude = graha_longitudes[name]
        rasi = longitude_to_rasi(longitude)
        nak, pada = longitude_to_nakshatra_pada(longitude)
        house = house_of_rasi(rasi, lagna_rasi)
        grahas[name] = GrahaPosition(name, longitude, rasi, house, nak, pada)
        houses[house].append(name)
    return ChartData(lagna_rasi=lagna_rasi, grahas=grahas, houses=houses)


# --- Divisional charts (varga) ---
# Each varga has its own classical (Parashari) starting-sign rule; formulas
# are not interchangeable across vargas, so each gets an explicit function.

def _part_index(longitude: float, n: int) -> int:
    return int((longitude % 30) // (30 / n))


def d2_hora(longitude: float) -> int:
    rasi = longitude_to_rasi(longitude)
    part = _part_index(longitude, 2)
    odd_sign = rasi % 2 == 0  # rasi index 0 = Aries = odd sign (1st)
    if odd_sign:
        return 4 if part == 0 else 3  # Leo : Cancer
    return 3 if part == 0 else 4  # Cancer : Leo


def d3_drekkana(longitude: float) -> int:
    rasi = longitude_to_rasi(longitude)
    part = _part_index(longitude, 3)
    return (rasi + part * 4) % 12


def d7_saptamsa(longitude: float) -> int:
    rasi = longitude_to_rasi(longitude)
    part = _part_index(longitude, 7)
    odd_sign = rasi % 2 == 0
    start = rasi if odd_sign else (rasi + 6) % 12
    return (start + part) % 12


def d9_navamsa(longitude: float) -> int:
    rasi = longitude_to_rasi(longitude)
    part = _part_index(longitude, 9)
    if rasi in MOVABLE_RASIS:
        start = rasi
    elif rasi in FIXED_RASIS:
        start = (rasi + 8) % 12
    else:
        start = (rasi + 4) % 12
    return (start + part) % 12


def d10_dasamsa(longitude: float) -> int:
    rasi = longitude_to_rasi(longitude)
    part = _part_index(longitude, 10)
    odd_sign = rasi % 2 == 0
    start = rasi if odd_sign else (rasi + 8) % 12
    return (start + part) % 12


def d12_dwadasamsa(longitude: float) -> int:
    rasi = longitude_to_rasi(longitude)
    part = _part_index(longitude, 12)
    return (rasi + part) % 12


VARGA_FUNCTIONS = {
    "D2": d2_hora,
    "D3": d3_drekkana,
    "D7": d7_saptamsa,
    "D9": d9_navamsa,
    "D10": d10_dasamsa,
    "D12": d12_dwadasamsa,
}


def build_varga_chart(varga: str, lagna_longitude: float, graha_longitudes: dict[str, float]) -> ChartData:
    fn = VARGA_FUNCTIONS[varga]
    lagna_rasi = fn(lagna_longitude)
    houses: dict[int, list[str]] = {h: [] for h in range(1, 13)}
    grahas: dict[str, GrahaPosition] = {}
    for name in GRAHA_NAMES:
        longitude = graha_longitudes[name]
        rasi = fn(longitude)
        nak, pada = longitude_to_nakshatra_pada(longitude)
        house = house_of_rasi(rasi, lagna_rasi)
        grahas[name] = GrahaPosition(name, longitude, rasi, house, nak, pada)
        houses[house].append(name)
    return ChartData(lagna_rasi=lagna_rasi, grahas=grahas, houses=houses)
