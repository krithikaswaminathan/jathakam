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


class ChartResponse(BaseModel):
    id: int
    name: str
    gender: str
    dob: date
    tob: time
    pob_label: str
    d1: ChartOut
    vargas: dict[str, ChartOut]
    mahadasas: list[DasaPeriodOut]
    tara_balam: list[TaraEntryOut]
    yogas: list[YogaOut]


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
