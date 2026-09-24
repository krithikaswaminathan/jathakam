from app.astrology import build_chart
from app.yogas import detect_all_yogas

SPEEDS = {name: 1.0 for name in ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"]}


def make_chart(lagna_rasi: int, rasis: dict[str, int]):
    """Build a chart with each named graha at 10 degrees into the given rasi."""
    longitudes = {name: rasi * 30 + 10.0 for name, rasi in rasis.items()}
    return build_chart(lagna_rasi * 30 + 10.0, longitudes, SPEEDS)


BASE = {"Sun": 1, "Moon": 1, "Mars": 1, "Mercury": 1, "Jupiter": 1, "Venus": 1, "Saturn": 1, "Rahu": 1, "Ketu": 7}


def yoga(chart, name):
    return next(y for y in detect_all_yogas(chart) if y.name == name)


def test_hamsa_exalted_in_kendra():
    # Jupiter in Cancer (exalted, rasi 3) in the 1st house of a Cancer lagna
    chart = make_chart(3, {**BASE, "Jupiter": 3})
    assert yoga(chart, "Hamsa Yoga").triggered is True


def test_hamsa_own_sign_in_kendra():
    # Jupiter in Sagittarius (own, rasi 8), Virgo lagna (5) -> Sagittarius is the 4th house
    chart = make_chart(5, {**BASE, "Jupiter": 8})
    assert chart.grahas["Jupiter"].house == 4
    assert yoga(chart, "Hamsa Yoga").triggered is True


def test_no_yoga_when_dignified_but_not_in_kendra():
    # Jupiter exalted in Cancer but in the 2nd house (Gemini lagna)
    chart = make_chart(2, {**BASE, "Jupiter": 3})
    assert chart.grahas["Jupiter"].house == 2
    assert yoga(chart, "Hamsa Yoga").triggered is False


def test_no_yoga_when_in_kendra_but_not_dignified():
    # Jupiter in Aries (neither own nor exalted) in the 1st house of an Aries lagna
    chart = make_chart(0, {**BASE, "Jupiter": 0})
    assert yoga(chart, "Hamsa Yoga").triggered is False


def test_each_planet_forms_its_own_yoga():
    cases = {
        "Ruchaka Yoga": ("Mars", 9),  # exalted in Capricorn, Capricorn lagna -> 1st house
        "Bhadra Yoga": ("Mercury", 5),  # Virgo (own and exalted), Virgo lagna
        "Malavya Yoga": ("Venus", 11),  # exalted in Pisces, Pisces lagna
        "Sasa Yoga": ("Saturn", 6),  # exalted in Libra, Libra lagna
    }
    for yoga_name, (planet, rasi) in cases.items():
        chart = make_chart(rasi, {**BASE, planet: rasi})
        assert yoga(chart, yoga_name).triggered is True, yoga_name


def test_from_moon_only_is_flagged_separately_not_triggered():
    # Mars in Scorpio (own) is the 8th house from an Aries lagna (not a kendra),
    # but Scorpio is the 4th from a Leo Moon (a kendra).
    chart = make_chart(0, {**BASE, "Mars": 7, "Moon": 4})
    result = yoga(chart, "Ruchaka Yoga")
    assert result.triggered is False
    assert result.from_moon is True


def test_from_moon_flag_not_set_when_formed_from_lagna():
    chart = make_chart(9, {**BASE, "Mars": 9, "Moon": 9})
    result = yoga(chart, "Ruchaka Yoga")
    assert result.triggered is True
    assert result.from_moon is False


def test_krithika_chart_forms_none():
    # Sagittarius lagna, Moon in Taurus; positions from the verified real chart
    longitudes = {
        "Sun": 245.59, "Moon": 35.76, "Mars": 310.65, "Mercury": 263.74, "Jupiter": 187.27,
        "Venus": 237.27, "Saturn": 8.79, "Rahu": 322.43, "Ketu": 142.43,
    }
    chart = build_chart(250.0, longitudes, SPEEDS)
    names = {"Ruchaka Yoga", "Bhadra Yoga", "Hamsa Yoga", "Malavya Yoga", "Sasa Yoga"}
    for y in detect_all_yogas(chart):
        if y.name in names:
            assert y.triggered is False and y.from_moon is False, y.name
