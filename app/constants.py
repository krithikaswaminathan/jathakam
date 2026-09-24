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

# Classical rasi rulers, index 0=Aries..11=Pisces. Rahu/Ketu rule no sign classically.
RASI_LORDS = [
    "Mars", "Venus", "Mercury", "Moon", "Sun", "Mercury",
    "Venus", "Mars", "Jupiter", "Saturn", "Saturn", "Jupiter",
]

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

# Mandi/Gulika: which of the 8 day (or night) segments belongs to Saturn, by weekday
# (Sunday=0..Saturday=6). Day table decreases 7->1 across the week; the night table
# is derived from the classical "5th weekday forward" rule and comes out equally
# clean (3,2,1,7,6,5,4) — see app/upagraha.py for the full derivation/sources.
SATURN_DAY_SEGMENT = {0: 7, 1: 6, 2: 5, 3: 4, 4: 3, 5: 2, 6: 1}
SATURN_NIGHT_SEGMENT = {0: 3, 1: 2, 2: 1, 3: 7, 4: 6, 5: 5, 6: 4}

# Indu Lagna: Kala (numeric value) of each of the 7 classical grahas; Rahu/Ketu
# aren't used. Cross-checked against two independent sources before use.
INDU_KALA = {"Sun": 30, "Moon": 16, "Mars": 6, "Mercury": 8, "Jupiter": 10, "Venus": 12, "Saturn": 1}
