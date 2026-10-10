from app.astrology import ChartData, GrahaPosition
from app.upapada import compute_upapada


def _chart(lagna_rasi: int, rasis: dict[str, int]) -> ChartData:
    grahas = {}
    for name in ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"]:
        rasi = rasis.get(name, (lagna_rasi + 1) % 12)  # parked in the 2nd
        grahas[name] = GrahaPosition(name, rasi * 30 + 10.0, rasi, (rasi - lagna_rasi) % 12 + 1, 0, 1, 10.0, "", "", False, False)
    return ChartData(lagna_rasi=lagna_rasi, grahas=grahas)


def test_padmini_upapada_is_dhanusu_with_no_exception():
    # Rishabam lagna: 12th Mesham, Sevvai in Simham is 5, 5 from Simham is Dhanusu.
    u = compute_upapada(_chart(1, {"Mars": 4, "Jupiter": 4, "Saturn": 9}))
    assert (u.twelfth, u.twelfth_lord, u.count, u.landing, u.exception, u.rasi, u.house) == (0, "Mars", 5, 8, None, 8, 8)
    assert u.lord == "Jupiter" and u.lord_sits_in == 4
    assert u.second == 9 and "Saturn" in u.second_planets


def test_seventh_from_the_twelfth_moves_on_to_the_tenth_and_viruchigam_is_sevvai():
    # Dhanusu lagna: 12th Viruchigam (Sevvai), Sevvai in Kumbham is 4, 4 from Kumbham is Rishabam,
    # the 7th from Viruchigam, so the 10th from Rishabam, Kumbham.
    u = compute_upapada(_chart(8, {"Mars": 10, "Rahu": 10, "Saturn": 0}))
    assert (u.twelfth_lord, u.count, u.landing, u.exception, u.rasi, u.house) == ("Mars", 4, 1, "seventh", 10, 3)
    assert u.lord == "Saturn" and u.planets == ["Mars", "Rahu"]


def test_landing_on_the_twelfth_itself_moves_on_to_the_tenth():
    # Mesham lagna: 12th Meenam (Guru). Guru in Meenam counts 1 and lands on Meenam itself.
    u = compute_upapada(_chart(0, {"Jupiter": 11}))
    assert (u.count, u.landing, u.exception, u.rasi) == (1, 11, "twelfth", 8)
