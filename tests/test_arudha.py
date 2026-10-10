from app.astrology import ChartData, GrahaPosition
from app.arudha import compute_arudha_lagna, compute_upapada


def _chart(lagna_rasi: int, rasis: dict[str, int]) -> ChartData:
    grahas = {}
    for name in ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"]:
        rasi = rasis.get(name, (lagna_rasi + 1) % 12)  # parked in the 2nd
        grahas[name] = GrahaPosition(name, rasi * 30 + 10.0, rasi, (rasi - lagna_rasi) % 12 + 1, 0, 1, 10.0, "", "", False, False)
    return ChartData(lagna_rasi=lagna_rasi, grahas=grahas)


def test_padmini_upapada_is_dhanusu_with_no_exception():
    # Rishabam lagna: 12th Mesham, Sevvai in Simham is 5, 5 from Simham is Dhanusu.
    u = compute_upapada(_chart(1, {"Mars": 4, "Jupiter": 4, "Saturn": 9}))
    assert (u.bhava_rasi, u.bhava_lord, u.count, u.landing, u.exception, u.rasi, u.house) == (0, "Mars", 5, 8, None, 8, 8)
    assert u.lord == "Jupiter" and u.lord_sits_in == 4
    assert u.second == 9 and "Saturn" in u.second_planets


def test_seventh_from_the_twelfth_moves_on_to_the_tenth_and_viruchigam_is_sevvai():
    # Dhanusu lagna: 12th Viruchigam (Sevvai), Sevvai in Kumbham is 4, 4 from Kumbham is Rishabam,
    # the 7th from Viruchigam, so the 10th from Rishabam, Kumbham.
    u = compute_upapada(_chart(8, {"Mars": 10, "Rahu": 10, "Saturn": 0}))
    assert (u.bhava_lord, u.count, u.landing, u.exception, u.rasi, u.house) == ("Mars", 4, 1, "seventh", 10, 3)
    assert u.lord == "Saturn" and u.planets == ["Mars", "Rahu"]


def test_landing_on_the_twelfth_itself_moves_on_to_the_tenth():
    # Mesham lagna: 12th Meenam (Guru). Guru in Meenam counts 1 and lands on Meenam itself.
    u = compute_upapada(_chart(0, {"Jupiter": 11}))
    assert (u.count, u.landing, u.exception, u.rasi) == (1, 11, "same", 8)


def test_arudha_lagna_counts_from_the_lagna():
    # Krithika: Dhanusu lagna, Guru in Thulam is 11, 11 from Thulam is Simham, the 9th.
    a = compute_arudha_lagna(_chart(8, {"Jupiter": 6, "Ketu": 4}))
    assert (a.bhava, a.bhava_rasi, a.bhava_lord, a.count, a.landing, a.exception, a.rasi, a.house) == (1, 8, "Jupiter", 11, 4, None, 4, 9)
    assert a.planets == ["Ketu"]
    # Padmini: Rishabam lagna, Sukran in Thulam is 6, 6 from Thulam is Meenam, the 11th.
    a = compute_arudha_lagna(_chart(1, {"Venus": 6}))
    assert (a.count, a.rasi, a.house) == (6, 11, 11)


def test_arudha_lagna_exceptions():
    # Mesham lagna with Sevvai in Mesham lands on the lagna itself: the 10th from it, Magaram.
    assert (lambda a: (a.exception, a.rasi))(compute_arudha_lagna(_chart(0, {"Mars": 0}))) == ("same", 9)
    # Sevvai in Kadagam is 4, 4 from Kadagam is Thulam, the 7th: the 10th from Thulam, Kadagam.
    assert (lambda a: (a.exception, a.rasi))(compute_arudha_lagna(_chart(0, {"Mars": 3}))) == ("seventh", 3)
