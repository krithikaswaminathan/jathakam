from app.astrology import ChartData, GrahaPosition
from app.chara_karaka import compute_chara_karakas


def _chart(degrees: dict[str, tuple[int, float]]) -> ChartData:
    grahas = {}
    for name in ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"]:
        rasi, deg = degrees.get(name, (0, 0.5))
        grahas[name] = GrahaPosition(name, rasi * 30 + deg, rasi, rasi + 1, 0, 1, deg, "", "", False, False)
    return ChartData(lagna_rasi=0, grahas=grahas)


def test_ranked_by_degree_in_rasi_not_by_rasi():
    chart = _chart({
        "Sun": (0, 5.0), "Moon": (11, 1.0), "Mars": (3, 29.5), "Mercury": (6, 12.25),
        "Jupiter": (2, 12.5), "Venus": (9, 20.0), "Saturn": (1, 2.0), "Rahu": (4, 29.9),
    })
    ks = compute_chara_karakas(chart)
    assert [(k.karaka, k.planet) for k in ks] == [
        ("AK", "Mars"), ("AmK", "Venus"), ("BK", "Jupiter"), ("MK", "Mercury"),
        ("PK", "Sun"), ("GK", "Saturn"), ("DK", "Moon"),
    ]
    assert "Rahu" not in [k.planet for k in ks]  # Rahu is highest but takes no karaka
