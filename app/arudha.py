"""Jaimini arudhas (padas), as confirmed with the user: the Arudha Lagna (pada of the 1st house) and
the Upapada Lagna (pada of the 12th).

Count from the house's rasi (as 1) to the rasi its lord sits in, then the same number again from the
lord's rasi (as 1). If that lands on the house itself or the 7th from it, the arudha is the 10th rasi
from where it landed. Kumbham is taken as ruled by Sani and Viruchigam by Sevvai, so every rasi has
one lord (RASI_LORDS).
"""

from dataclasses import dataclass

from app.astrology import ChartData
from app.constants import RASI_LORDS
from app.rasi_drishti import planets_aspecting


@dataclass
class Arudha:
    bhava: int  # the house whose arudha this is, 1 for the Arudha Lagna, 12 for the Upapada
    bhava_rasi: int
    bhava_lord: str
    lord_rasi: int
    count: int  # from the house (as 1) to its lord's rasi
    landing: int  # the same count again from the lord's rasi
    exception: str | None  # "same" or "seventh" when the landing was moved on 10 rasis, else None
    rasi: int  # the arudha
    house: int  # its house from the lagna
    planets: list[str]
    aspected_by: list[str]  # by Jaimini rasi drishti
    lord: str
    lord_sits_in: int  # rasi of the arudha's lord
    second: int  # the 2nd rasi from the arudha
    second_planets: list[str]
    second_aspected_by: list[str]
    second_lord: str
    second_lord_rasi: int


def compute_arudha(d1: ChartData, bhava: int) -> Arudha:
    def planets_in(rasi: int) -> list[str]:
        return [name for name, g in d1.grahas.items() if g.rasi == rasi]

    bhava_rasi = (d1.lagna_rasi + bhava - 1) % 12
    bhava_lord = RASI_LORDS[bhava_rasi]
    lord_rasi = d1.grahas[bhava_lord].rasi
    count = (lord_rasi - bhava_rasi) % 12 + 1
    landing = (lord_rasi + count - 1) % 12
    exception = "same" if landing == bhava_rasi else "seventh" if landing == (bhava_rasi + 6) % 12 else None
    rasi = (landing + 9) % 12 if exception else landing
    second = (rasi + 1) % 12
    return Arudha(
        bhava=bhava,
        bhava_rasi=bhava_rasi,
        bhava_lord=bhava_lord,
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


def compute_arudha_lagna(d1: ChartData) -> Arudha:
    return compute_arudha(d1, 1)


def compute_upapada(d1: ChartData) -> Arudha:
    return compute_arudha(d1, 12)
