import pytest

from app.astrology import (
    compute_indu_lagna,
    d2_hora,
    d3_drekkana,
    d7_saptamsa,
    d9_navamsa,
    d10_dasamsa,
    d12_dwadasamsa,
    d60_shashtiamsa,
    longitude_to_nakshatra_pada,
    longitude_to_rasi,
    make_graha_position,
    nakshatra_lord,
    whole_sign_houses,
)
from app.constants import DASA_ORDER, RASI_LORDS


def test_longitude_to_rasi_boundaries():
    assert longitude_to_rasi(0) == 0
    assert longitude_to_rasi(29.999) == 0
    assert longitude_to_rasi(30) == 1
    assert longitude_to_rasi(359.999) == 11
    assert longitude_to_rasi(360) == 0


def test_nakshatra_pada_boundaries():
    # Ashwini spans 0 - 13.3333..., pada = 3.3333... each
    assert longitude_to_nakshatra_pada(0) == (0, 1)
    assert longitude_to_nakshatra_pada(3.3333) == (0, 1)
    assert longitude_to_nakshatra_pada(3.34) == (0, 2)
    assert longitude_to_nakshatra_pada(13.3333) == (0, 4)
    assert longitude_to_nakshatra_pada(13.34) == (1, 1)


def test_whole_sign_houses_wraparound():
    for lagna in range(12):
        houses = whole_sign_houses(lagna)
        assert houses[1] == lagna
        assert houses[12] == (lagna - 1) % 12
        assert sorted(houses.values()) == list(range(12))


def test_d9_navamsa_aries_zero():
    # 0 deg Aries (movable, starts at self) -> part 0 -> Aries
    assert d9_navamsa(0.0) == 0


def test_d9_navamsa_fixed_sign_starts_at_ninth():
    # Taurus (fixed sign, index 1) starts navamsa count from its 9th sign (index 9, Capricorn).
    # 1 deg into Taurus (longitude 31.0) is part 0 of the 9 navamsa divisions -> Capricorn itself.
    assert d9_navamsa(31.0) == 9


def test_d2_hora_only_cancer_or_leo():
    for lon in [0, 10, 20, 30, 45, 100, 200, 300, 359]:
        assert d2_hora(lon) in (3, 4)


def test_d3_drekkana_trine_scheme():
    assert d3_drekkana(0.0) == 0  # part 0 -> same sign
    assert d3_drekkana(11.0) == 4  # part 1 (10-20deg) -> 5th sign (index 0+4=4)
    assert d3_drekkana(21.0) == 8  # part 2 (20-30deg) -> 9th sign (index 0+8=8)


def test_d7_saptamsa_odd_even_start():
    assert d7_saptamsa(0.0) == 0  # Aries (odd sign) starts at itself
    assert d7_saptamsa(30.0) == 7  # Taurus (even sign) starts at its 7th sign (index 1+6=7, Scorpio)


def test_d10_dasamsa_odd_even_start():
    assert d10_dasamsa(0.0) == 0  # Aries odd sign starts at itself
    assert d10_dasamsa(30.0) == 9  # Taurus even sign starts at its 9th (index1+8=9)


def test_d12_dwadasamsa_uniform():
    assert d12_dwadasamsa(0.0) == 0
    assert d12_dwadasamsa(2.5) == 1
    assert d12_dwadasamsa(30.0) == 1


def test_d60_shashtiamsa_uniform_no_reversal():
    # Each 0.5deg division counts forward from the sign itself, no odd/even flip
    assert d60_shashtiamsa(0.0) == 0  # Aries, part 0 -> Aries
    assert d60_shashtiamsa(0.4) == 0  # still part 0 (< 0.5deg)
    assert d60_shashtiamsa(0.5) == 1  # part 1 -> Taurus
    assert d60_shashtiamsa(29.9) == 11  # last part (59) of Aries -> Pisces
    assert d60_shashtiamsa(30.0) == 1  # Taurus, part 0 -> Taurus itself
    assert d60_shashtiamsa(30.5) == 2  # Taurus, part 1 -> Gemini


def test_d60_shashtiamsa_covers_all_60_parts_per_sign():
    seen_signs = {d60_shashtiamsa(part * 0.5 + 0.01) for part in range(60)}
    assert seen_signs == set(range(12))


def test_nakshatra_lord_cycles_dasa_order():
    for i in range(27):
        assert nakshatra_lord(i) == DASA_ORDER[i % 9]
    # spot checks against known lordships
    assert nakshatra_lord(0) == "Ketu"  # Ashwini
    assert nakshatra_lord(8) == "Mercury"  # Ashlesha, end of first 9-cycle
    assert nakshatra_lord(26) == "Mercury"  # Revati, end of third 9-cycle


def test_rasi_lords_table_shape():
    assert len(RASI_LORDS) == 12
    assert RASI_LORDS[0] == "Mars"  # Aries
    assert RASI_LORDS[3] == "Moon"  # Cancer
    assert RASI_LORDS[4] == "Sun"  # Leo
    assert RASI_LORDS[9] == "Saturn"  # Capricorn
    # every sign is ruled by one of the 7 classical grahas, never Rahu/Ketu
    assert set(RASI_LORDS) == {"Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn"}


def test_make_graha_position_computes_lordships_and_degree_in_sign():
    # 40 deg = 10 deg into Taurus (rasi 1); Taurus lord is Venus
    pos = make_graha_position("Mars", 40.0, longitude_to_rasi(40.0), lagna_rasi=0)
    assert pos.rasi == 1
    assert pos.rasi_lord == "Venus"
    assert abs(pos.degree_in_sign - 10.0) < 1e-9
    assert pos.star_lord == nakshatra_lord(pos.nakshatra)
    assert pos.retrograde is False


def test_make_graha_position_retrograde_flag():
    direct = make_graha_position("Mercury", 40.0, longitude_to_rasi(40.0), lagna_rasi=0, retrograde=False)
    retro = make_graha_position("Mercury", 40.0, longitude_to_rasi(40.0), lagna_rasi=0, retrograde=True)
    assert direct.retrograde is False
    assert retro.retrograde is True


def test_compute_indu_lagna_known_example():
    # Cross-checked by hand in conversation: Lagna=Sagittarius(8), Moon=Taurus(1)
    # -> 9th from Lagna=Leo(Sun,30), 9th from Moon=Capricorn(Saturn,1) -> sum=31
    # -> remainder=7 -> 7 signs forward from Taurus (inclusive) = Scorpio(7)
    assert compute_indu_lagna(lagna_rasi=8, moon_rasi=1) == 7


def test_compute_indu_lagna_remainder_zero_wraps_to_twelve():
    # Lagna=Leo(4): 9th from it is Aries(0), lord Mars (Kala 6).
    # Moon=Pisces(11): 9th from it is Scorpio(7), lord Mars (Kala 6).
    # Sum = 12 -> remainder 0 -> wraps to 12 -> counting 12 signs forward from
    # Moon's own sign (inclusive) wraps all the way around to Aquarius (10).
    assert compute_indu_lagna(lagna_rasi=4, moon_rasi=11) == 10
