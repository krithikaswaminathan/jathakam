"""The Darakaraka and the Upapada Lagna (Jaimini), from the user's notes (Mani, Jaimini Astrology)
with the user's choices. They are related, and marriage proves life changing, when they aspect each
other by rasi drishti, are in a kendra or trikona from each other (1, 4, 5, 7, 9 or 10 apart, the same
rasi included), or Jupiter or Venus is in or aspects the Darakaraka's rasi or the Upapada. They are
adverse, with karmic challenges in marriage but spiritual maturity, when 6/8 or 2/12 apart. A chart
can be both."""

from dataclasses import dataclass

from app.arudha import Arudha
from app.astrology import ChartData
from app.chara_karaka import CharaKaraka
from app.rasi_drishti import aspected_rasis

BENEFICS = ("Jupiter", "Venus")
KENDRA_TRIKONA = (1, 4, 5, 7, 9, 10)
ADVERSE = (2, 6, 8, 12)


@dataclass
class BeneficInfluence:
    planet: str  # Jupiter or Venus
    on: str  # "dk" (the Darakaraka's rasi) or "ul" (the Upapada)
    how: str  # "in" or "aspect"


@dataclass
class DarakarakaUpapada:
    planet: str
    rasi: int
    house: int  # from the D1 lagna
    upapada_rasi: int
    count: int  # from the Darakaraka's rasi (as 1) to the Upapada
    aspect: bool
    kendra_trikona: bool
    benefics: list[BeneficInfluence]
    related: bool
    adverse: bool


def compute_darakaraka_upapada(d1: ChartData, karakas: list[CharaKaraka], upapada: Arudha) -> DarakarakaUpapada:
    dk = karakas[-1]
    count = (upapada.rasi - dk.rasi) % 12 + 1
    aspect = upapada.rasi in aspected_rasis(dk.rasi)
    benefics = []
    for target, rasi in (("dk", dk.rasi), ("ul", upapada.rasi)):
        for planet in BENEFICS:
            if target == "dk" and planet == dk.planet:
                continue  # the Darakaraka does not influence its own rasi
            where = d1.grahas[planet].rasi
            if where == rasi:
                benefics.append(BeneficInfluence(planet, target, "in"))
            elif rasi in aspected_rasis(where):
                benefics.append(BeneficInfluence(planet, target, "aspect"))
    kendra_trikona = count in KENDRA_TRIKONA
    return DarakarakaUpapada(
        planet=dk.planet,
        rasi=dk.rasi,
        house=(dk.rasi - d1.lagna_rasi) % 12 + 1,
        upapada_rasi=upapada.rasi,
        count=count,
        aspect=aspect,
        kendra_trikona=kendra_trikona,
        benefics=benefics,
        related=aspect or kendra_trikona or bool(benefics),
        adverse=count in ADVERSE,
    )
