import os
from datetime import date, datetime, timedelta, timezone

import pytest

from app.astrology import ChartData, GrahaPosition
from app.constants import GRAHA_NAMES
from app.gandantham import compute_gandantham

IST = timezone(timedelta(hours=5, minutes=30))
SPAN = 10 / 3


def _chart(padas: dict[str, int]) -> ChartData:
    grahas = {}
    for name in GRAHA_NAMES:
        index = padas.get(name, 50)  # park everyone in Hasta 3 unless moved
        grahas[name] = GrahaPosition(name, index * SPAN + 1, index // 9, 1, index // 4, index % 4 + 1, 1.0, "", "", False, False)
    return ChartData(lagna_rasi=0, grahas=grahas)


def test_fixed_padas_are_the_six_junctions():
    g = compute_gandantham(_chart({}), 0.5)
    assert [(p.number, p.nakshatra, p.pada) for p in g.fixed] == [
        (1, 0, 1), (36, 8, 4), (37, 9, 1), (72, 17, 4), (73, 18, 1), (108, 26, 4),
    ]  # Ashwini 1, Ayilyam 4, Magam 1, Kettai 4, Moolam 1, Revathi 4
    assert [p.rasi for p in g.fixed] == [0, 3, 4, 7, 8, 11]


def test_lagna_set_counts_from_the_lagna_pada():
    # The user's lagna, Dhanus 14deg50' (254.83), is Pooradam 1, pada no. 77.
    g = compute_gandantham(_chart({}), 254.83)
    assert (g.lagna_nakshatra, g.lagna_pada) == (19, 1)
    assert [(p.number, p.nakshatra, p.pada) for p in g.lagna] == [
        (1, 19, 1), (36, 0, 4), (37, 1, 1), (72, 9, 4), (73, 10, 1), (108, 18, 4),
    ]  # Pooradam 1, Ashwini 4, Bharani 1, Magam 4, Pooram 1, Moolam 4


def test_birth_planets_in_the_padas():
    # Venus in Kettai 4 (index 71), as in the user's chart.
    g = compute_gandantham(_chart({"Venus": 71}), 254.83)
    assert [p.planets for p in g.fixed if p.planets] == [["Venus"]]
    assert not any(n != "Lagna" for p in g.lagna for n in p.planets)  # no planets, only the lagna on no. 1


@pytest.mark.skipif(not os.path.exists("ephe/sepl_18.se1"), reason="Swiss Ephemeris data files not present in ephe/")
def test_slow_planet_transits_2026_to_2030():
    from app.ephemeris import init_ephemeris

    init_ephemeris("ephe")
    g = compute_gandantham(_chart({}), 254.83, datetime(2026, 1, 1, tzinfo=IST), datetime(2031, 1, 1, tzinfo=IST))
    assert {t.planet for t in g.transits} == {"Jupiter", "Saturn", "Rahu", "Ketu"}
    fixed = [t for t in g.transits if t.source == "fixed"]
    lagna = [t for t in g.transits if t.source == "lagna"]
    assert len(fixed) == 14 and len(lagna) == 11
    rahu_lagna = [(t.start.astimezone(IST).date(), t.nakshatra, t.pada) for t in lagna if t.planet == "Rahu"]
    assert rahu_lagna == [(date(2029, 3, 2), 19, 1), (date(2029, 5, 4), 18, 4)]  # over the lagna pada itself
    assert g.transits == sorted(g.transits, key=lambda t: t.start)


def test_lagna_is_checked_against_the_fixed_padas():
    # A lagna in Moolam 1 (Dhanus 1deg, index 72) is in the fixed pada no. 73.
    g = compute_gandantham(_chart({}), 241.0)
    assert [p.planets for p in g.fixed if p.number == 73] == [["Lagna"]]
    assert [p.number for p in g.lagna if "Lagna" in p.planets] == [1]  # always no. 1 of its own set
    # The user's lagna, Pooradam 1, is not a Gandantham pada, though it is still no. 1 of its own set.
    mine = compute_gandantham(_chart({}), 254.83)
    assert not any("Lagna" in p.planets for p in mine.fixed)
    assert mine.lagna[0].planets == ["Lagna"]


def test_lagna_on_a_junction_gives_the_same_six_padas():
    # Susheela's lagna is in Magam 1 (fixed no. 37), so her lagna-based six are the fixed six.
    g = compute_gandantham(_chart({}), 121.0)
    assert [p.planets for p in g.fixed if p.number == 37] == [["Lagna"]]
    assert {(p.nakshatra, p.pada) for p in g.lagna} == {(p.nakshatra, p.pada) for p in g.fixed}
