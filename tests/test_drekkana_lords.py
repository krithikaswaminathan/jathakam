from app.astrology import ChartData, GrahaPosition
from app.drekkana_lords import compute_drekkana_lords, drekkana_number

# Everything in Aries at 5deg unless a test moves it.
PARKED = {name: (0, 5.0) for name in ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"]}


def _chart(positions: dict[str, tuple[int, float]]) -> ChartData:
    grahas = {
        name: GrahaPosition(name, rasi * 30 + deg, rasi, rasi + 1, 0, 1, deg, "", "", False, False)
        for name, (rasi, deg) in {**PARKED, **positions}.items()
    }
    return ChartData(lagna_rasi=0, grahas=grahas)


def _entry(chart: ChartData, planet: str):
    return next(e for e in compute_drekkana_lords(chart) if e.planet == planet)


def test_boundaries_are_the_users():
    assert [drekkana_number(d) for d in (0.0, 9.99, 10.0, 10.004)] == [1, 1, 1, 1]
    assert [drekkana_number(d) for d in (10.01, 15.0, 20.0)] == [2, 2, 2]
    assert [drekkana_number(d) for d in (20.01, 29.99)] == [3, 3]


def test_saturn_in_rishabam_controllers():
    # The user's example: Venus, then Mercury (Kanni, 5th), then Saturn (Makaram, 9th).
    for degree, drekkana, rasi, controller in [(5.0, 1, 1, "Venus"), (15.0, 2, 5, "Mercury"), (25.0, 3, 9, "Saturn")]:
        e = _entry(_chart({"Saturn": (1, degree)}), "Saturn")
        assert (e.drekkana, e.drekkana_rasi, e.controller) == (drekkana, rasi, controller)


def test_controller_6th_or_8th_weakens():
    # Saturn at 15deg in Rishabam is controlled by Mercury; 6th is Thulam, 8th is Dhanus.
    for mercury_rasi in range(12):
        e = _entry(_chart({"Saturn": (1, 15.0), "Mercury": (mercury_rasi, 5.0)}), "Saturn")
        assert e.count == (mercury_rasi - 1) % 12 + 1
        assert e.weakened is (mercury_rasi in (6, 8)), mercury_rasi


def test_own_controller_is_never_weakened():
    e = _entry(_chart({"Saturn": (1, 25.0)}), "Saturn")
    assert (e.controller, e.count, e.weakened) == ("Saturn", 1, False)


def test_only_the_seven_planets_are_checked():
    assert [e.planet for e in compute_drekkana_lords(_chart({}))] == [
        "Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn",
    ]
