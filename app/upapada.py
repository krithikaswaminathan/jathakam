"""Upapada Lagna (Jaimini), the arudha of the 12th house, as confirmed with the user.

Count from the 12th house (as 1) to the rasi its lord sits in, then the same number again from the
lord's rasi (as 1). If that lands on the 12th house itself or the 7th from it, the Upapada is the
10th rasi from where it landed. Kumbham is taken as ruled by Sani and Viruchigam by Sevvai, so every
rasi has one lord (RASI_LORDS).
"""

from dataclasses import dataclass

from app.astrology import ChartData
from app.constants import RASI_LORDS
from app.rasi_drishti import planets_aspecting


@dataclass
class Upapada:
    twelfth: int  # rasi of the 12th house
    twelfth_lord: str
    lord_rasi: int
    count: int  # from the 12th (as 1) to the lord's rasi
    landing: int  # the same count again from the lord's rasi
    exception: str | None  # "twelfth" or "seventh" when the landing was moved on 10 rasis, else None
    rasi: int  # the Upapada Lagna
    house: int  # its house from the lagna
    planets: list[str]
    aspected_by: list[str]  # by Jaimini rasi drishti
    lord: str
    lord_sits_in: int  # rasi of the Upapada's lord
    second: int  # the 2nd rasi from the Upapada
    second_planets: list[str]
    second_aspected_by: list[str]
    second_lord: str
    second_lord_rasi: int


def compute_upapada(d1: ChartData) -> Upapada:
    def planets_in(rasi: int) -> list[str]:
        return [name for name, g in d1.grahas.items() if g.rasi == rasi]

    twelfth = (d1.lagna_rasi + 11) % 12
    twelfth_lord = RASI_LORDS[twelfth]
    lord_rasi = d1.grahas[twelfth_lord].rasi
    count = (lord_rasi - twelfth) % 12 + 1
    landing = (lord_rasi + count - 1) % 12
    exception = "twelfth" if landing == twelfth else "seventh" if landing == (twelfth + 6) % 12 else None
    rasi = (landing + 9) % 12 if exception else landing
    second = (rasi + 1) % 12
    return Upapada(
        twelfth=twelfth,
        twelfth_lord=twelfth_lord,
        lord_rasi=lord_rasi,
        count=count,
        landing=landing,
        exception=exception,
        rasi=rasi,
        house=(rasi - d1.lagna_rasi) % 12 + 1,
        planets=planets_in(rasi),
        aspected_by=planets_aspecting(d1, rasi),
        lord=RASI_LORDS[rasi],
        lord_sits_in=d1.grahas[RASI_LORDS[rasi]].rasi,
        second=second,
        second_planets=planets_in(second),
        second_aspected_by=planets_aspecting(d1, second),
        second_lord=RASI_LORDS[second],
        second_lord_rasi=d1.grahas[RASI_LORDS[second]].rasi,
    )
