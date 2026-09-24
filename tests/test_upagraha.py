"""
Integration tests against the real Swiss Ephemeris data files in ephe/.
Mandi needs sunrise/sunset (swe.rise_trans), so it can't be tested as pure math.
"""

import os
from datetime import date, time

import pytest

from app.ephemeris import init_ephemeris
from app.upagraha import compute_mandi_longitude

pytestmark = pytest.mark.skipif(
    not os.path.exists("ephe/sepl_18.se1"),
    reason="Swiss Ephemeris data files not present in ephe/",
)


@pytest.fixture(autouse=True, scope="module")
def _init():
    init_ephemeris("ephe")


def test_known_reference_value():
    # Cross-checked by hand in conversation: Sunday day-birth, Secunderabad.
    # Sunrise 06:41 IST, sunset 17:46 IST, Sunday's day table -> Saturn's 7th of 8
    # segments -> starts 15:00 IST -> ascendant there is 25.590976... deg sidereal.
    lon = compute_mandi_longitude(date(1969, 12, 21), time(7, 25, 0), 5.5, 17.50427, 78.54263)
    assert abs(lon - 25.590976543263974) < 1e-6


def test_result_in_valid_range():
    lon = compute_mandi_longitude(date(1990, 5, 15), time(10, 30, 0), 5.5, 13.0827, 80.2707)
    assert 0 <= lon < 360


def test_deterministic():
    args = (date(1990, 5, 15), time(10, 30, 0), 5.5, 13.0827, 80.2707)
    assert compute_mandi_longitude(*args) == compute_mandi_longitude(*args)


def test_night_birth_before_sunrise_does_not_crash():
    # Birth well before sunrise -> exercises the "previous night" branch
    lon = compute_mandi_longitude(date(1990, 5, 15), time(2, 0, 0), 5.5, 13.0827, 80.2707)
    assert 0 <= lon < 360


def test_night_birth_after_sunset_does_not_crash():
    lon = compute_mandi_longitude(date(1990, 5, 15), time(22, 0, 0), 5.5, 13.0827, 80.2707)
    assert 0 <= lon < 360
