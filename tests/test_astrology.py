import pytest

from app.astrology import (
    d2_hora,
    d3_drekkana,
    d7_saptamsa,
    d9_navamsa,
    d10_dasamsa,
    d12_dwadasamsa,
    longitude_to_nakshatra_pada,
    longitude_to_rasi,
    whole_sign_houses,
)


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
