import swisseph as swe

RASI_NAMES = [
    "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
    "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces",
]

NAKSHATRA_NAMES = [
    "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra",
    "Punarvasu", "Pushya", "Ashlesha", "Magha", "Purva Phalguni", "Uttara Phalguni",
    "Hasta", "Chitra", "Swati", "Vishakha", "Anuradha", "Jyeshtha",
    "Mula", "Purva Ashadha", "Uttara Ashadha", "Shravana", "Dhanishta",
    "Shatabhisha", "Purva Bhadrapada", "Uttara Bhadrapada", "Revati",
]

GRAHA_NAMES = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"]

MOVABLE_RASIS = {0, 3, 6, 9}
FIXED_RASIS = {1, 4, 7, 10}
DUAL_RASIS = {2, 5, 8, 11}

# Node: Mean Node, not True Node — matches classical Vedic dasa/yoga conventions
# (smooth retrograde motion vs. True Node's brief prograde loops).
NODE_MODE = swe.MEAN_NODE

EPHEMERIS_FLAGS = swe.FLG_SWIEPH | swe.FLG_SIDEREAL | swe.FLG_SPEED

DASA_ORDER = ["Ketu", "Venus", "Sun", "Moon", "Mars", "Rahu", "Jupiter", "Saturn", "Mercury"]

DASA_YEARS = {
    "Ketu": 7, "Venus": 20, "Sun": 6, "Moon": 10, "Mars": 7,
    "Rahu": 18, "Jupiter": 16, "Saturn": 19, "Mercury": 17,
}

DASA_LEVELS = ["mahadasa", "antardasa", "antaram", "sookshma", "prana"]

TARA_CATEGORIES = [
    "Janma", "Sampat", "Vipat", "Kshema", "Pratyak",
    "Sadhaka", "Vadha", "Mitra", "Ati-Mitra",
]

TARA_QUALITY = {
    "Janma": "neutral", "Sampat": "good", "Vipat": "bad", "Kshema": "good",
    "Pratyak": "bad", "Sadhaka": "good", "Vadha": "bad", "Mitra": "good", "Ati-Mitra": "good",
}
