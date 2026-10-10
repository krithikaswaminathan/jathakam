from app.amatyakaraka import compute_amatyakaraka
from app.astrology import ChartData
from app.chara_karaka import CharaKaraka


def _amk(lagna: int, ak: tuple[str, int], amk: tuple[str, int]):
    karakas = [CharaKaraka("AK", ak[0], ak[1], 29.0), CharaKaraka("AmK", amk[0], amk[1], 28.0)]
    return compute_amatyakaraka(ChartData(lagna_rasi=lagna, grahas={}), karakas)


def test_krithika_amatyakaraka_in_the_lagna_not_related_to_the_atmakaraka():
    # Dhanusu lagna: AK Sukran in Viruchigam, AmK Budhan in Dhanusu, the 2nd from it.
    a = _amk(8, ("Venus", 7), ("Mercury", 8))
    assert (a.planet, a.house, a.groups, a.count) == ("Mercury", 1, ["kendra", "trikona"], 2)
    assert not (a.aspect or a.same_rasi or a.kendra_trikona or a.related)


def test_padmini_amatyakaraka_in_a_kendra_from_the_atmakaraka():
    # Rishabam lagna: AK Suriyan in Viruchigam, AmK Guru in Simham, the 10th from it.
    a = _amk(1, ("Sun", 7), ("Jupiter", 4))
    assert (a.house, a.groups, a.count, a.kendra_trikona, a.related) == (4, ["kendra"], 10, True, True)


def test_related_by_rasi_drishti_or_the_same_rasi_and_tenth_house_groups():
    a = _amk(0, ("Sun", 0), ("Moon", 4))  # Mesham aspects Simham (also the 5th, a trikona)
    assert a.aspect and a.related
    a = _amk(0, ("Sun", 3), ("Moon", 3))  # together in Kadagam
    assert a.same_rasi and not a.kendra_trikona and a.related
    assert _amk(0, ("Sun", 0), ("Moon", 9)).groups == ["kendra", "upachaya"]  # the 10th house
    assert _amk(0, ("Sun", 0), ("Moon", 5)).groups == ["upachaya", "dusthana"]  # the 6th house
