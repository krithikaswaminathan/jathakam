from app.arudha import compute_upapada
from app.astrology import ChartData, GrahaPosition
from app.chara_karaka import compute_chara_karakas
from app.darakaraka import compute_darakaraka_upapada


def _chart(lagna: int, at: dict[str, tuple[int, float]]) -> ChartData:
    grahas = {}
    for name in ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"]:
        rasi, deg = at.get(name, ((lagna + 1) % 12, 15.0))
        grahas[name] = GrahaPosition(name, rasi * 30 + deg, rasi, (rasi - lagna) % 12 + 1, 0, 1, deg, "", "", False, False)
    return ChartData(lagna_rasi=lagna, grahas=grahas)


def _dk(chart):
    return compute_darakaraka_upapada(chart, compute_chara_karakas(chart), compute_upapada(chart))


def test_krithika_guru_aspecting_the_upapada_makes_it_related():
    # Dhanusu lagna. DK Suriyan in Dhanusu (lowest degree), UL Kumbham, the 3rd from it: no aspect,
    # no kendra or trikona, not adverse, but Guru in Thulam aspects Kumbham.
    chart = _chart(8, {"Sun": (8, 5.5), "Mercury": (8, 23.7), "Venus": (7, 27.3), "Mars": (10, 10.6), "Rahu": (10, 1.0),
                       "Saturn": (0, 8.8), "Jupiter": (6, 7.3), "Moon": (1, 5.8), "Ketu": (4, 1.0)})
    d = _dk(chart)
    assert (d.planet, d.upapada_rasi, d.count, d.aspect, d.kendra_trikona, d.adverse) == ("Sun", 10, 3, False, False, False)
    assert [(b.planet, b.on, b.how) for b in d.benefics] == [("Jupiter", "ul", "aspect")] and d.related


def test_padmini_two_twelve_is_adverse_and_guru_aspects_the_darakaraka():
    # Rishabam lagna. DK Sani in Magaram, UL Dhanusu, the 12th from it. Guru in Simham aspects Magaram.
    chart = _chart(1, {"Saturn": (9, 9.2), "Mars": (4, 20.1), "Jupiter": (4, 29.4), "Venus": (6, 28.6), "Sun": (7, 29.4),
                       "Mercury": (7, 11.4), "Moon": (2, 15.1)})
    d = _dk(chart)
    assert (d.planet, d.upapada_rasi, d.count, d.adverse) == ("Saturn", 8, 12, True)
    assert [(b.planet, b.on) for b in d.benefics] == [("Jupiter", "dk")] and d.related


def test_venus_as_darakaraka_does_not_count_for_its_own_rasi():
    chart = _chart(0, {"Venus": (3, 0.5)})  # Venus lowest, so the DK, in Kadagam
    assert all(not (b.planet == "Venus" and b.on == "dk") for b in _dk(chart).benefics)
