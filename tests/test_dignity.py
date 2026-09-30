from app.astrology import build_chart
from app.dignity import compute_dignities

SPEEDS = {name: 1.0 for name in ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"]}
# Baseline placement with no planet in an exaltation/debilitation sign
# (everything in Sagittarius, Ketu in Gemini); tests override what they need.
NEUTRAL = {"Sun": 8, "Moon": 8, "Mars": 8, "Mercury": 8, "Jupiter": 8, "Venus": 8, "Saturn": 8, "Rahu": 8, "Ketu": 2}


def chart_with(placements: dict[str, tuple[int, float]]):
    """placements: planet -> (rasi index, degrees into the sign)."""
    positions = {**{p: r * 30 + 5.0 for p, r in NEUTRAL.items()}}
    for planet, (rasi, deg) in placements.items():
        positions[planet] = rasi * 30 + deg
    return build_chart(250.0, positions, SPEEDS)


def by_planet(entries):
    return {e.planet: e for e in entries}


def test_exalted_and_debilitated_are_detected():
    chart = chart_with({"Moon": (1, 5.75), "Saturn": (0, 8.79)})
    result = by_planet(compute_dignities(chart))
    assert result["Moon"].state == "ucham"
    assert result["Saturn"].state == "neecham"


def test_distance_from_deep_degree():
    chart = chart_with({"Moon": (1, 5.75), "Saturn": (0, 8.79)})
    result = by_planet(compute_dignities(chart))
    assert abs(result["Moon"].degrees_from_deep - 2.75) < 1e-6  # deep exaltation 3 deg
    assert abs(result["Saturn"].degrees_from_deep - 11.21) < 1e-6  # deep debilitation 20 deg
    assert result["Moon"].deep_degree == 3.0


def test_every_classical_planet_in_both_signs():
    table = {
        "Sun": (0, 6), "Moon": (1, 7), "Mars": (9, 3), "Mercury": (5, 11),
        "Jupiter": (3, 9), "Venus": (11, 5), "Saturn": (6, 0),
    }
    for planet, (exalt, debil) in table.items():
        up = by_planet(compute_dignities(chart_with({planet: (exalt, 10.0)})))
        down = by_planet(compute_dignities(chart_with({planet: (debil, 10.0)})))
        assert up[planet].state == "ucham", planet
        assert down[planet].state == "neecham", planet


def test_nodes_follow_bphs_convention_without_deep_degree():
    chart = chart_with({"Rahu": (1, 12.0), "Ketu": (7, 12.0)})
    result = by_planet(compute_dignities(chart))
    assert result["Rahu"].state == "ucham"  # Rahu exalted in Taurus
    assert result["Ketu"].state == "ucham"  # Ketu exalted in Scorpio
    assert result["Rahu"].degrees_from_deep == 9.0  # deep point 3deg
    swapped = by_planet(compute_dignities(chart_with({"Rahu": (7, 12.0), "Ketu": (1, 12.0)})))
    assert swapped["Rahu"].state == "neecham"
    assert swapped["Ketu"].state == "neecham"


def test_planets_in_ordinary_signs_are_not_listed():
    chart = chart_with({})
    assert compute_dignities(chart) == []


def test_krithika_chart_has_moon_ucham_and_saturn_neecham_only():
    longitudes = {
        "Sun": 245.59, "Moon": 35.76, "Mars": 310.65, "Mercury": 263.74, "Jupiter": 187.27,
        "Venus": 237.27, "Saturn": 8.79, "Rahu": 322.43, "Ketu": 142.43,
    }
    result = compute_dignities(build_chart(250.0, longitudes, SPEEDS))
    assert {(e.planet, e.state) for e in result} == {("Moon", "ucham"), ("Saturn", "neecham")}


# Paramoccham / paramaneecham padas worked out from the BPHS deep degrees. Five of the seven fall in
# a 2nd or 4th pada and only the Sun and Jupiter in a 1st or 3rd, as the Varaha Mihira article notes.
PARAMOCCHAM_PADAS = {
    "Sun": (0, 3), "Moon": (2, 2), "Mars": (22, 2), "Mercury": (12, 2),
    "Jupiter": (7, 1), "Venus": (26, 4), "Saturn": (14, 4),
    "Rahu": (2, 2), "Ketu": (15, 4),  # Krittika 2 and Vishakha 4, as the user gave
}
PARAMANEECHAM_PADAS = {
    "Sun": (14, 1), "Moon": (15, 4), "Mars": (8, 4), "Mercury": (25, 4),
    "Jupiter": (20, 3), "Venus": (13, 2), "Saturn": (1, 2),
    "Rahu": (15, 4), "Ketu": (2, 2),
}


def test_deep_point_padas():
    from app.constants import DIGNITY
    from app.dignity import deep_point_pada

    for planet, (exalt, debil, deep) in DIGNITY.items():
        assert deep_point_pada(exalt, deep) == PARAMOCCHAM_PADAS[planet], planet
        assert deep_point_pada(debil, deep) == PARAMANEECHAM_PADAS[planet], planet
    seven = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn"]
    assert sum(PARAMOCCHAM_PADAS[p][1] in (2, 4) for p in seven) == 5


def test_parama_lasts_one_degree_ending_at_the_deep_degree():
    # Sun's deep degree is 10: 9.001 to 10.000 is paramoccham, 9.0 and 10.01 are not.
    for deg, expected in [(9.0, False), (9.001, True), (10.0, True), (10.01, False)]:
        sun = by_planet(compute_dignities(chart_with({"Sun": (0, deg)})))["Sun"]
        assert sun.parama is expected, deg
    saturn = by_planet(compute_dignities(chart_with({"Saturn": (0, 19.5)})))["Saturn"]
    assert saturn.state == "neecham" and saturn.parama  # paramaneecham, Mesham 19-20


def test_entry_gives_the_planets_own_pada_and_the_deep_pada():
    moon = by_planet(compute_dignities(chart_with({"Moon": (1, 5.75)})))["Moon"]
    assert (moon.nakshatra, moon.pada) == (2, 3)  # Krittika 3, as in the saved chart
    assert (moon.deep_nakshatra, moon.deep_pada) == (2, 2)  # paramoccham in Krittika 2
    assert not moon.parama


def test_rahu_and_ketu_peak_at_three_degrees():
    rahu = by_planet(compute_dignities(chart_with({"Rahu": (1, 2.5), "Ketu": (7, 2.5)})))
    assert rahu["Rahu"].state == "ucham" and rahu["Rahu"].parama  # paramoccham, Taurus 2-3
    assert (rahu["Rahu"].deep_nakshatra, rahu["Rahu"].deep_pada) == (2, 2)  # Krittika 2
    assert rahu["Ketu"].state == "ucham" and rahu["Ketu"].parama
    assert (rahu["Ketu"].deep_nakshatra, rahu["Ketu"].deep_pada) == (15, 4)  # Vishakha 4
    later = by_planet(compute_dignities(chart_with({"Rahu": (1, 12.0)})))["Rahu"]
    assert not later.parama and (later.nakshatra, later.pada) == (3, 1)  # Rohini 1


def test_reading_page_table_matches_constants():
    import re

    from app.constants import DIGNITY

    js = open("static/labels.js", encoding="utf-8").read()
    block = js[js.index("const DIGNITY_TABLE = {") : js.index("};", js.index("const DIGNITY_TABLE = {"))]
    rows = dict((p, (int(r), None if d == "null" else float(d))) for p, r, d in re.findall(r"(\w+): \[(\d+), (\w+|\d+)\]", block))
    assert rows == {p: (exalt, deep) for p, (exalt, _debil, deep) in DIGNITY.items()}
