from app.astrology import ChartData, GrahaPosition
from app.karakamsa import compute_karakamsa


def _chart(lagna: int, rasis: dict[str, int]) -> ChartData:
    grahas = {}
    for name in ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"]:
        rasi = rasis.get(name, 5)
        grahas[name] = GrahaPosition(name, rasi * 30 + 10.0, rasi, 1, 0, 1, 10.0, "", "", False, False)
    return ChartData(lagna_rasi=lagna, grahas=grahas)


# Padmini: Rishabam lagna; Navamsa lagna Simham.
PADMINI_D1 = _chart(1, {"Sun": 7, "Moon": 2, "Mars": 4, "Mercury": 7, "Jupiter": 4, "Venus": 6, "Saturn": 9, "Rahu": 10, "Ketu": 4})
PADMINI_D9 = _chart(4, {"Sun": 11, "Saturn": 11, "Rahu": 11, "Jupiter": 8, "Moon": 10, "Ketu": 5, "Venus": 2, "Mars": 6, "Mercury": 6})


def _kinds(view):
    return [(r.kind, r.planet) for r in view.readings]


def test_padmini_atmakaraka_in_the_navamsa():
    k = compute_karakamsa(PADMINI_D1, PADMINI_D9, "Sun", "Jupiter")
    assert (k.rasi, k.ak_rasi, k.element, k.ak_dignity) == (11, 7, "water", None)
    assert k.ak_benefics == ["Jupiter", "Venus"] and k.ak_malefics == ["Saturn", "Rahu", "Ketu"]
    assert k.ak_strong and k.ak_weak and k.with_ak == ["Saturn"]


def test_padmini_swamsa_keeps_the_earlier_readings_and_adds_the_new_ones():
    swamsa = compute_karakamsa(PADMINI_D1, PADMINI_D9, "Sun", "Jupiter").views[0]
    assert swamsa.chart == "swamsa" and swamsa.houses[0].planets == ["Sun", "Saturn", "Rahu"]
    kinds = _kinds(swamsa)
    assert ("jupiter", "Jupiter") in kinds and ("career", "Saturn") in kinds and ("career", "Rahu") in kinds
    assert ("career", "Sun") not in kinds  # the Atmakaraka itself gives no work reading
    assert ("influence", "Jupiter") in kinds and ("influence", "Venus") in kinds
    spiritual = next(r for r in swamsa.readings if r.kind == "spiritual")
    assert spiritual.reasons == ["ketu", "jupiter", "pisces"]
    assert any(r.kind == "tenth_amk" and r.how == "in" for r in swamsa.readings)  # Guru, the AmK, in Dhanusu


def test_padmini_karakamsa_in_the_birth_chart():
    karakamsa = compute_karakamsa(PADMINI_D1, PADMINI_D9, "Sun", "Jupiter").views[1]
    assert karakamsa.chart == "karakamsa" and karakamsa.lagna_house == 11  # Meenam from Rishabam
    assert karakamsa.houses[0].planets == []
    assert not any(r.kind == "tenth_amk" for r in karakamsa.readings)  # Guru in Simham neither in nor aspecting Dhanusu


def test_weak_atmakaraka_when_neecham_and_twelfth_from_the_lagna():
    d9 = _chart(0, {"Sun": 6, "Jupiter": 0, "Venus": 0})  # Sun neecham in Thulam; nothing influences it
    k = compute_karakamsa(_chart(7, {"Sun": 0}), d9, "Sun", "Moon")
    assert k.ak_dignity == "neecham" and k.ak_weak
    karakamsa = k.views[1]  # Thulam is the 12th from a Viruchigam lagna
    assert "twelfth" in next(r for r in karakamsa.readings if r.kind == "spiritual").reasons
