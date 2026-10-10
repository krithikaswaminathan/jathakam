from app.astrology import ChartData, GrahaPosition
from app.rasi_drishti import aspected_rasis, planets_aspecting


def _chart(lagna_rasi: int, rasis: dict[str, int]) -> ChartData:
    grahas = {}
    for name in ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"]:
        rasi = rasis.get(name, (lagna_rasi + 1) % 12)  # parked in the 2nd
        grahas[name] = GrahaPosition(name, rasi * 30 + 10.0, rasi, (rasi - lagna_rasi) % 12 + 1, 0, 1, 10.0, "", "", False, False)
    return ChartData(lagna_rasi=lagna_rasi, grahas=grahas)

EXPECTED = {
    0: [4, 7, 10], 1: [3, 6, 9], 2: [5, 8, 11], 3: [7, 10, 1], 4: [6, 9, 0], 5: [8, 11, 2],
    6: [10, 1, 4], 7: [9, 0, 3], 8: [11, 2, 5], 9: [1, 4, 7], 10: [0, 3, 6], 11: [2, 5, 8],
}


def test_each_rasi_aspects_as_in_the_table():
    assert {r: aspected_rasis(r) for r in range(12)} == EXPECTED


def test_aspects_are_mutual_and_never_the_rasi_next_door():
    for r in range(12):
        for other in aspected_rasis(r):
            assert r in aspected_rasis(other)
        assert (r + 1) % 12 not in aspected_rasis(r) and (r - 1) % 12 not in aspected_rasis(r)


def test_planets_aspecting_includes_rahu_and_ketu():
    chart = _chart(0, {"Rahu": 4, "Ketu": 10, "Sun": 2})  # Simham and Kumbham aspect Mesham; Mithunam does not
    assert set(planets_aspecting(chart, 0)) == {"Rahu", "Ketu"}
