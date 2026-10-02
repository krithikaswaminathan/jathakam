from app.astrology import build_chart, build_varga_chart
from app.constants import GRAHA_NAMES
from app.dwadasamsa_career import CADRES, compute_career_cadres

SPEEDS = {name: 1.0 for name in GRAHA_NAMES}


def _charts(longitudes: dict[str, float]):
    lons = {name: longitudes.get(name, 5.0) for name in GRAHA_NAMES}
    return build_chart(250.0, lons, SPEEDS), build_varga_chart("D12", 250.0, lons, SPEEDS)


def test_cadre_table():
    assert [c for c, cadre in CADRES.items() if cadre == "A"] == [1, 4, 7, 10]
    assert [c for c, cadre in CADRES.items() if cadre == "B"] == [2, 5, 8, 11]
    assert [c for c, cadre in CADRES.items() if cadre == "C"] == [3, 6, 9, 12]


def test_count_is_the_two_and_a_half_degree_part_of_the_rasi():
    # Saturn at Mesham 8deg47' is in the 4th part (7deg30'-10deg): D12 Kadagam, count 4, Cadre A.
    for rasi in range(12):
        for deg in (0.5, 3.0, 8.79, 14.9, 29.9):
            d1, d12 = _charts({"Saturn": rasi * 30 + deg})
            sat = next(e for e in compute_career_cadres(d1, d12) if e.planet == "Saturn")
            assert sat.count == int(deg // 2.5) + 1, (rasi, deg)
            assert sat.d12_rasi == (rasi + sat.count - 1) % 12


def test_users_chart_values():
    d1, d12 = _charts({
        "Sun": 245.59, "Moon": 35.76, "Mars": 310.65, "Mercury": 263.74, "Jupiter": 187.27,
        "Venus": 237.27, "Saturn": 8.79, "Rahu": 322.43, "Ketu": 142.43,
    })
    cadres = {e.planet: (e.count, e.cadre) for e in compute_career_cadres(d1, d12)}
    assert cadres == {
        "Sun": (3, "C"), "Moon": (3, "C"), "Mars": (5, "B"), "Mercury": (10, "A"), "Jupiter": (3, "C"),
        "Venus": (11, "B"), "Saturn": (4, "A"), "Rahu": (9, "C"), "Ketu": (9, "C"),
    }
