from app.astrology import ChartData, GrahaPosition
from app.constants import GRAHA_NAMES
from app.hidden_dignity import compute_hidden_dignities, hide, moolatrikona_pada


def _chart(padas: dict[str, tuple[int, int]]) -> ChartData:
    grahas = {}
    for name in GRAHA_NAMES:
        nak, pada = padas.get(name, (0, 1))
        index = nak * 4 + pada - 1
        grahas[name] = GrahaPosition(name, index * 10 / 3 + 1, index // 9, 1, nak, pada, 0.0, "", "", False, False)
    return ChartData(lagna_rasi=0, grahas=grahas)


def _find(entries, planet, kind):
    return next(e for e in entries if e.planet == planet and e.kind == kind)


def test_users_sun_example():
    # Sun in Mula 2. Ucham pada Ashwini 3 -> 72 padas -> Magha 1. Neecham pada Swati 1 -> 18 -> Dhanishta 3.
    entries = compute_hidden_dignities(_chart({"Sun": (18, 2)}))
    ucham = _find(entries, "Sun", "ucham")
    assert (ucham.a_nakshatra, ucham.a_pada, ucham.count, ucham.hidden_nakshatra, ucham.hidden_pada) == (0, 3, 72, 9, 1)
    assert ucham.hidden_rasi == 4  # Magha 1 is in Simham
    neecham = _find(entries, "Sun", "neecham")
    assert (neecham.a_nakshatra, neecham.a_pada, neecham.count) == (14, 1, 18)
    assert (neecham.hidden_nakshatra, neecham.hidden_pada) == (22, 3)


def test_moon_next_to_its_ucham_pada():
    # Moon in Krittika 3, ucham pada Krittika 2: 2 padas, so it hides its ucham in Krittika 4.
    ucham = _find(compute_hidden_dignities(_chart({"Moon": (2, 3)})), "Moon", "ucham")
    assert (ucham.count, ucham.hidden_nakshatra, ucham.hidden_pada) == (2, 2, 4)


def test_sitting_on_the_pada_itself_hides_it_there():
    assert hide((0, 3), (0, 3)) == (1, (0, 3))


def test_count_wraps_round_the_zodiac():
    # From Revati 4 (index 107) to Ashwini 1 (index 0) is 2 padas; 2 more from Ashwini 1 is Ashwini 2.
    assert hide((26, 4), (0, 1)) == (2, (0, 2))


def test_moolatrikonam_first_padas():
    assert {p: moolatrikona_pada(p) for p in ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn"]} == {
        "Sun": (9, 1),  # Magha 1, Simham 0deg
        "Moon": (2, 2),  # Krittika 2, just after Rishabam 3deg
        "Mars": (0, 1),  # Ashwini 1
        "Mercury": (12, 2),  # Hasta 2, Kanni 16deg
        "Jupiter": (18, 1),  # Mula 1
        "Venus": (13, 3),  # Chitra 3, Thulam 0deg
        "Saturn": (22, 3),  # Dhanishta 3, Kumbham 0deg
    }


def test_rahu_and_ketu_have_no_moolatrikonam():
    entries = compute_hidden_dignities(_chart({}))
    assert {e.kind for e in entries if e.planet in ("Rahu", "Ketu")} == {"ucham", "neecham"}
    assert len(entries) == 7 * 3 + 2 * 2


def test_reading_page_moolatrikonam_padas_match():
    import re

    js = open("static/labels.js", encoding="utf-8").read()
    block = js[js.index("const MOOLATRIKONA_FIRST_PADA = {") : js.index("};", js.index("const MOOLATRIKONA_FIRST_PADA = {"))]
    rows = {p: (int(n), int(q)) for p, n, q in re.findall(r"(\w+): \[(\d+), (\d)\]", block)}
    assert rows == {p: moolatrikona_pada(p) for p in rows}
    assert len(rows) == 7
