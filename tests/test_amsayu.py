import os
from datetime import date, time

import pytest

from app.amsayu import compute_amsayu, lagna_a_days, planet_a_days
from app.astrology import ChartData, GrahaPosition, build_chart, build_varga_chart

needs_ephe = pytest.mark.skipif(not os.path.exists("ephe/sepl_18.se1"), reason="Swiss Ephemeris data files not present in ephe/")


def ymd(days):
    return (days // 360, days % 360 // 30, days % 30)


def test_planet_years_from_navamsas():
    # Suriyan 239deg24'06": 14364.1 minutes / 200 = 71.82 navamsas -> 71 mod 12 = 11 years, 0.8205 x 360 = 295 days.
    assert ymd(planet_a_days(239 + 24 / 60 + 6 / 3600)) == (11, 9, 25)


def test_lagna_years_are_longitude_over_thirty():
    assert ymd(lagna_a_days(54 + 22 / 60)) == (1, 9, 22)  # the hand-worked lagna
    assert ymd(lagna_a_days(155.0)) == (5, 2, 0)


def _chart(lagna_rasi: int, placements: dict[str, tuple[float, bool]]) -> ChartData:
    grahas = {}
    for name in ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"]:
        lon, retro = placements.get(name, ((lagna_rasi + 2) * 30 + 15.0, False))  # parked in the 3rd
        rasi = int(lon // 30) % 12
        grahas[name] = GrahaPosition(name, lon, rasi, (rasi - lagna_rasi) % 12 + 1, 0, 1, lon % 30, "", "", retro, False)
    return ChartData(lagna_rasi=lagna_rasi, grahas=grahas)


def _row(result, body):
    return next(r for r in result.rows if r.body == body)


def test_tripling_beats_doubling_and_last_degree_gets_neither():
    # Sani at Thulam 20 (ucham, also own drekkana?) is tripled once; Guru at Simham 29.5 gets nothing.
    chart = _chart(0, {"Saturn": (200.0, False), "Jupiter": (149.5, False), "Sun": (100.0, False)})
    r = compute_amsayu(chart, chart, chart, 5.0)
    sat = _row(r, "Saturn")
    assert sat.increase == "x3" and sat.b_days == 3 * sat.a_days
    jup = _row(r, "Jupiter")
    assert jup.increase is None and jup.increase_reasons == ["last_degree"] and jup.b_days == jup.a_days


def test_one_chakrapata_per_rasi_and_benefics_half():
    # Mesham lagna. Suriyan and Budhan together in Thulam (7th): only the one with more years is cut.
    chart = _chart(0, {"Sun": (186.0, False), "Mercury": (190.0, False), "Venus": (315.0, False)})
    r = compute_amsayu(chart, chart, chart, 5.0)
    cut = [x.body for x in r.rows if any(h.kind == "chakrapata" for h in x.haranams)]
    in_thulam = [_row(r, "Sun"), _row(r, "Mercury")]
    assert sum(1 for x in in_thulam if x.body in cut) == 1
    assert max(in_thulam, key=lambda x: x.b_days).body in cut
    venus = _row(r, "Venus")  # Kumbham, the 11th: benefic loses half of 1/2
    assert [(h.kind, h.share) for h in venus.haranams] == [("chakrapata", 0.25)]


def test_combust_and_enemy_rasi_take_only_the_half():
    # Sevvai in Mithunam (Budhan's rasi, an enemy) and 5 degrees from the Suriyan.
    chart = _chart(0, {"Mars": (65.0, False), "Sun": (60.0, False)})
    r = compute_amsayu(chart, chart, chart, 5.0)
    assert [(h.kind, h.share) for h in _row(r, "Mars").haranams] == [("ashtanga", 0.5)]


def test_vakram_is_not_cut_for_an_enemy_rasi_and_cuts_never_exceed_a():
    chart = _chart(0, {"Mars": (65.0, True), "Saturn": (340.0, False), "Sun": (150.0, False)})  # Sani in Meenam, the 12th
    r = compute_amsayu(chart, chart, chart, 5.0)
    assert not _row(r, "Mars").haranams
    sat = _row(r, "Saturn")
    assert sat.loss_days == sat.a_days and sat.c_days == sat.b_days - sat.a_days


@needs_ephe
def test_padmini_matches_the_on_screen_working():
    from app.ephemeris import compute_ascendant, compute_graha_positions, init_ephemeris, to_julian_day_ut

    init_ephemeris("ephe")
    jd = to_julian_day_ut(date(1932, 12, 14), time(17, 45), 5.5)
    pos = compute_graha_positions(jd)
    lons = {n: l for n, (l, _) in pos.items()}
    speeds = {n: s for n, (_, s) in pos.items()}
    lagna = compute_ascendant(jd, 8.4855, 76.94924)
    d1 = build_chart(lagna, lons, speeds)
    r = compute_amsayu(d1, build_varga_chart("D9", lagna, lons, speeds), build_varga_chart("D3", lagna, lons, speeds), lagna)
    assert ymd(r.a_days) == (59, 9, 21)
    assert ymd(r.b_days) == (80, 2, 10)
    assert ymd(r.c_days) == (74, 10, 19)  # the hand-worked sheet gives 74y 10m 9d with its 1 degree lower lagna
    assert round(r.solar_years, 2) == 73.81
    assert _row(r, "Mercury").haranams == []  # shares Viruchigam with the Suriyan, which takes the cut
    assert _row(r, "Jupiter").increase_reasons == ["last_degree"]


def test_pindayu_share_runs_from_full_at_deep_ucham_to_half_at_deep_neecham():
    from app.pindayu import pinda_share
    assert pinda_share("Sun", 10.0) == 1.0
    assert pinda_share("Sun", 190.0) == 0.5
    assert pinda_share("Sun", 100.0) == pinda_share("Sun", 280.0) == 0.75  # either way round
    assert pinda_share("Venus", 7.0) == pytest.approx(1 - 10 / 360)  # across Mesham 0


def test_pindayu_has_no_increases_and_cuts_its_own_years():
    from app.pindayu import compute_pindayu
    chart = _chart(0, {"Saturn": (340.0, False), "Sun": (150.0, False)})  # Sani in Meenam, the 12th
    sat = _row(compute_pindayu(chart, 5.0), "Saturn")
    assert sat.loss_days == sat.a_days and sat.c_days == 0
