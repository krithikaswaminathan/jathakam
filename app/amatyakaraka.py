"""The Amatyakaraka (Jaimini): the chara karaka with the second highest degree in its rasi, read for
career. From the user's notes (Mani, Jaimini Astrology), with houses counted from the D1 lagna:
the readings for its house groups, and whether it is related to the Atmakaraka (rasi drishti, the
same rasi, or a kendra or trikona from it), which aligns the career with the soul's purpose."""

from dataclasses import dataclass

from app.astrology import ChartData
from app.chara_karaka import CharaKaraka
from app.rasi_drishti import aspected_rasis

HOUSE_GROUPS = {
    "kendra": (1, 4, 7, 10),
    "trikona": (1, 5, 9),
    "upachaya": (3, 6, 10, 11),
    "dusthana": (6, 8, 12),
}
KENDRA_TRIKONA = (1, 4, 5, 7, 9, 10)  # counted from one to the other; the reverse count is in it too


@dataclass
class Amatyakaraka:
    planet: str
    rasi: int
    house: int  # from the D1 lagna
    groups: list[str]  # every house group the house falls in
    atmakaraka: str
    ak_rasi: int
    ak_house: int
    count: int  # from the Atmakaraka's rasi (as 1) to the Amatyakaraka's
    aspect: bool  # by rasi drishti
    same_rasi: bool
    kendra_trikona: bool  # count in 1, 4, 5, 7, 9, 10 but not the same rasi
    related: bool


def compute_amatyakaraka(d1: ChartData, karakas: list[CharaKaraka]) -> Amatyakaraka:
    ak, amk = karakas[0], karakas[1]
    house = (amk.rasi - d1.lagna_rasi) % 12 + 1
    count = (amk.rasi - ak.rasi) % 12 + 1
    aspect = amk.rasi in aspected_rasis(ak.rasi)
    same_rasi = count == 1
    kendra_trikona = count in KENDRA_TRIKONA and not same_rasi
    return Amatyakaraka(
        planet=amk.planet,
        rasi=amk.rasi,
        house=house,
        groups=[g for g, houses in HOUSE_GROUPS.items() if house in houses],
        atmakaraka=ak.planet,
        ak_rasi=ak.rasi,
        ak_house=(ak.rasi - d1.lagna_rasi) % 12 + 1,
        count=count,
        aspect=aspect,
        same_rasi=same_rasi,
        kendra_trikona=kendra_trikona,
        related=aspect or same_rasi or kendra_trikona,
    )
