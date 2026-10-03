from datetime import date, datetime, time

from pydantic import BaseModel


class BirthRequest(BaseModel):
    name: str
    gender: str
    dob: date
    tob: time
    pob_label: str
    latitude: float
    longitude: float
    timezone: str  # IANA name, from the resolved place (e.g. "Asia/Kolkata")


class PlaceResult(BaseModel):
    label: str
    latitude: float
    longitude: float
    timezone: str


class GrahaOut(BaseModel):
    name: str
    longitude: float
    rasi: int
    house: int
    nakshatra: int
    pada: int
    degree_in_sign: float
    rasi_lord: str
    star_lord: str
    retrograde: bool
    pushkara_navamsa: bool


class ChartOut(BaseModel):
    lagna_rasi: int
    grahas: dict[str, GrahaOut]
    houses: dict[int, list[str]]


class DasaPeriodOut(BaseModel):
    lord: str
    start: datetime
    end: datetime
    level: str


class TaraEntryOut(BaseModel):
    nakshatra: int
    count: int
    category: str
    quality: str


class YogaOut(BaseModel):
    name: str
    description: str
    triggered: bool
    from_moon: bool = False


class DignityOut(BaseModel):
    planet: str
    state: str
    rasi: int
    degree_in_sign: float
    deep_degree: float | None
    degrees_from_deep: float | None
    nakshatra: int = 0
    pada: int = 1
    parama: bool = False
    deep_nakshatra: int | None = None
    deep_pada: int | None = None


class SoonyaRasiOut(BaseModel):
    rasi: int
    lord: str
    house: int
    planets: list[str]


class TithiOut(BaseModel):
    number: int
    paksha: str
    paksha_tithi: int
    progress: float
    soonya_rasis: list[SoonyaRasiOut]


class MudakkuOut(BaseModel):
    sun_nakshatra: int
    sun_pada: int
    count: int
    nakshatra: int
    pada: int
    star_lord: str
    rasi: int
    rasi_lord: str
    house: int
    planets: list[str]
    is_lagna: bool


class UpasanaOut(BaseModel):
    planet: str
    planet_rasi: int
    rasi: int


class KaalaPakaiOut(BaseModel):
    planet: str
    rasi: int
    house: int


class PeyarchiOut(BaseModel):
    planet: str
    when: datetime  # in the chart's time zone
    rasi: int
    kind: str
    moon_rasi: int
    count: int
    moorthi: str
    in_effect_at_start: bool


class DrekkanaLordOut(BaseModel):
    planet: str
    rasi: int
    degree_in_sign: float
    drekkana: int
    drekkana_rasi: int
    controller: str
    controller_rasi: int
    count: int
    weakened: bool


class NavamsaPointOut(BaseModel):
    nakshatra: int
    pada: int
    start: float
    end: float


class TransitWindowOut(BaseModel):
    start: datetime  # in the chart's time zone
    end: datetime


class SashtashtagamOut(BaseModel):
    planet: str
    d1_rasi: int
    d1_house: int
    d9_rasi: int
    count: int
    flagged: bool
    houses_ruled: list[int]
    point: NavamsaPointOut | None = None
    transits: list[TransitWindowOut] = []


class NodeTransitOut(BaseModel):
    node: str
    start: datetime  # in the chart's time zone
    end: datetime


class HiddenDignityOut(BaseModel):
    planet: str
    kind: str
    a_nakshatra: int
    a_pada: int
    b_nakshatra: int
    b_pada: int
    count: int
    hidden_nakshatra: int
    hidden_pada: int
    hidden_rasi: int
    house: int = 1
    transits: list[NodeTransitOut] = []


class CareerCadreOut(BaseModel):
    planet: str
    d1_rasi: int
    degree_in_sign: float
    d12_rasi: int
    count: int
    cadre: str


class GandanthamPadaOut(BaseModel):
    number: int
    nakshatra: int
    pada: int
    rasi: int
    planets: list[str]


class GandanthamTransitOut(BaseModel):
    planet: str
    source: str
    number: int
    nakshatra: int
    pada: int
    rasi: int
    start: datetime  # in the chart's time zone
    end: datetime


class GandanthamOut(BaseModel):
    lagna_nakshatra: int
    lagna_pada: int
    fixed: list[GandanthamPadaOut]
    lagna: list[GandanthamPadaOut]
    transits: list[GandanthamTransitOut]


class ChartResponse(BaseModel):
    id: int
    name: str
    gender: str
    dob: date
    tob: time
    pob_label: str
    d1: ChartOut
    vargas: dict[str, ChartOut]
    gulika: GrahaOut
    lagna: GrahaOut | None = None  # the ascendant itself, for the Graha Details table
    mandi: GrahaOut
    indu_lagna_rasi: int
    indu_lagna_lord: str
    mahadasas: list[DasaPeriodOut]
    tara_balam: list[TaraEntryOut]
    yogas: list[YogaOut]
    dignities: list[DignityOut] = []
    pranapada: GrahaOut | None = None
    tithi: TithiOut | None = None
    mudakku: MudakkuOut | None = None
    upasana: UpasanaOut | None = None
    kaala_pakai: list[KaalaPakaiOut] = []
    peyarchis: list[PeyarchiOut] = []
    drekkana_lords: list[DrekkanaLordOut] = []
    navamsa_sashtashtagam: list[SashtashtagamOut] = []
    hidden_dignities: list[HiddenDignityOut] = []
    career_cadres: list[CareerCadreOut] = []
    gandantham: GandanthamOut | None = None


class DasaExpandRequest(BaseModel):
    lord: str
    start: datetime
    end: datetime
    next_level: str


class ChartSummary(BaseModel):
    id: int
    name: str
    dob: date
    created_at: datetime


class PrasannamResponse(BaseModel):
    when: datetime  # the moment cast, in the requested time zone
    latitude: float
    longitude: float
    timezone: str
    lagna_longitude: float
    d1: ChartOut
