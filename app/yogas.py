from dataclasses import dataclass

from app.astrology import ChartData

MANGAL_HOUSES = {1, 2, 4, 7, 8, 12}
KENDRA_OFFSETS = {0, 3, 6, 9}


@dataclass
class YogaResult:
    name: str
    description: str
    triggered: bool


def check_mangal_dosha(chart: ChartData) -> bool:
    return chart.grahas["Mars"].house in MANGAL_HOUSES


def check_gaja_kesari_yoga(chart: ChartData) -> bool:
    moon_rasi = chart.grahas["Moon"].rasi
    jupiter_rasi = chart.grahas["Jupiter"].rasi
    return ((jupiter_rasi - moon_rasi) % 12) in KENDRA_OFFSETS


def check_budhaditya_yoga(chart: ChartData) -> bool:
    return chart.grahas["Sun"].rasi == chart.grahas["Mercury"].rasi


def check_chandra_mangal_yoga(chart: ChartData) -> bool:
    return chart.grahas["Moon"].rasi == chart.grahas["Mars"].rasi


def check_kemadruma_yoga(chart: ChartData) -> bool:
    moon_rasi = chart.grahas["Moon"].rasi
    second_house = ((moon_rasi + 1 - chart.lagna_rasi) % 12) + 1
    twelfth_house = ((moon_rasi - 1 - chart.lagna_rasi) % 12) + 1
    for name, graha in chart.grahas.items():
        if name == "Moon":
            continue
        if graha.house in (second_house, twelfth_house):
            return False
        if graha.rasi == moon_rasi:
            return False
    return True


YOGA_CHECKS = [
    ("Mangal Dosha", "Mars in a dosha house (1,2,4,7,8,12) from lagna. Classical cancellation rules not modeled.", check_mangal_dosha),
    ("Gaja Kesari Yoga", "Jupiter in a kendra from the Moon.", check_gaja_kesari_yoga),
    ("Budhaditya Yoga", "Sun and Mercury share a rasi.", check_budhaditya_yoga),
    ("Chandra-Mangal Yoga", "Moon and Mars share a rasi.", check_chandra_mangal_yoga),
    ("Kemadruma Yoga (simplified)", "No planet in 2nd/12th from Moon or conjunct Moon's rasi. Classical cancellation conditions not modeled.", check_kemadruma_yoga),
]


def detect_all_yogas(chart: ChartData) -> list[YogaResult]:
    return [YogaResult(name, desc, fn(chart)) for name, desc, fn in YOGA_CHECKS]
