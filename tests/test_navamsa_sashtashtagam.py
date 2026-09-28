from app.astrology import ChartData, GrahaPosition
from app.constants import GRAHA_NAMES
from app.navamsa_sashtashtagam import compute_navamsa_sashtashtagam, houses_ruled


def _chart(lagna_rasi: int, rasis: dict[str, int]) -> ChartData:
    grahas = {
        name: GrahaPosition(name, rasi * 30 + 5, rasi, (rasi - lagna_rasi) % 12 + 1, 0, 1, 5.0, "", "", False, False)
        for name, rasi in rasis.items()
    }
    return ChartData(lagna_rasi=lagna_rasi, grahas=grahas)


ALL_ARIES = {name: 0 for name in GRAHA_NAMES}


def test_count_from_d1_rasi_to_d9_rasi():
    d1 = _chart(0, {**ALL_ARIES, "Sun": 8})  # Sun in Dhanus
    for d9_rasi in range(12):
        d9 = _chart(0, {**ALL_ARIES, "Sun": d9_rasi})
        sun = next(e for e in compute_navamsa_sashtashtagam(d1, d9) if e.planet == "Sun")
        assert sun.count == (d9_rasi - 8) % 12 + 1
        assert sun.flagged is (sun.count in (6, 8)), d9_rasi


def test_sun_dhanus_to_rishabam_is_6th():
    # The user's chart: Sun in Dhanus in D1, Rishabam in D9.
    entries = compute_navamsa_sashtashtagam(_chart(8, {**ALL_ARIES, "Sun": 8}), _chart(4, {**ALL_ARIES, "Sun": 1}))
    sun = next(e for e in entries if e.planet == "Sun")
    assert (sun.count, sun.flagged, sun.d1_house) == (6, True, 1)
    assert [e.planet for e in entries if e.flagged] == ["Sun"]


def test_houses_ruled_for_dhanus_lagna():
    assert houses_ruled("Sun", 8) == [9]
    assert houses_ruled("Moon", 8) == [8]
    assert houses_ruled("Mars", 8) == [5, 12]
    assert houses_ruled("Mercury", 8) == [7, 10]
    assert houses_ruled("Jupiter", 8) == [1, 4]
    assert houses_ruled("Venus", 8) == [6, 11]
    assert houses_ruled("Saturn", 8) == [2, 3]
    assert houses_ruled("Rahu", 8) == [] and houses_ruled("Ketu", 8) == []


def test_all_nine_planets_listed():
    entries = compute_navamsa_sashtashtagam(_chart(0, ALL_ARIES), _chart(0, ALL_ARIES))
    assert [e.planet for e in entries] == GRAHA_NAMES
    assert not any(e.flagged for e in entries)
