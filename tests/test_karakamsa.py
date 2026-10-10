from app.astrology import ChartData, GrahaPosition
from app.karakamsa import compute_karakamsa


def _chart(rasis: dict[str, int]) -> ChartData:
    grahas = {}
    for name in ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"]:
        rasi = rasis.get(name, 5)
        grahas[name] = GrahaPosition(name, rasi * 30 + 10.0, rasi, 1, 0, 1, 10.0, "", "", False, False)
    return ChartData(lagna_rasi=0, grahas=grahas)


def test_karakamsa_is_the_atmakaraka_navamsa_rasi_and_houses_count_from_it():
    d1 = _chart({"Sun": 7})
    d9 = _chart({"Sun": 11, "Saturn": 11, "Rahu": 11, "Jupiter": 8, "Moon": 10, "Ketu": 5})  # Padmini's D9
    k = compute_karakamsa(d1, d9, "Sun")
    assert (k.rasi, k.ak_rasi) == (11, 7)
    assert k.houses[0].planets == ["Sun", "Saturn", "Rahu"] and k.houses[11].rasi == 10 and k.houses[11].planets == ["Moon"]
    # Jupiter in the 10th is a kendra; Sani and Rahu give work; the Sun is the AK, so gives none.
    assert [(r.kind, r.planet, r.house) for r in k.readings] == [("jupiter", "Jupiter", 10), ("career", "Saturn", 1), ("career", "Rahu", 1)]


def test_ketu_in_the_second_or_third_and_venus_in_the_twelfth():
    d9 = _chart({"Moon": 0, "Ketu": 2, "Venus": 11, "Jupiter": 1})  # Moon AK in Mesham
    k = compute_karakamsa(_chart({}), d9, "Moon")
    assert [(r.kind, r.house) for r in k.readings] == [("ketu", 3), ("venus12", 12)]
