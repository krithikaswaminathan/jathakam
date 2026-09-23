import json
from datetime import datetime

from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles

from app.astrology import ChartData, VARGA_FUNCTIONS, build_chart, build_varga_chart
from app.dasa import compute_mahadasas, compute_sub_periods
from app.db import SavedChart, get_chart, init_db, list_charts, save_chart
from app.ephemeris import compute_ascendant, compute_graha_longitudes, init_ephemeris, to_julian_day_ut
from app.geocode import search_places
from app.models import (
    BirthRequest,
    ChartOut,
    ChartResponse,
    ChartSummary,
    DasaExpandRequest,
    DasaPeriodOut,
    GrahaOut,
    PlaceResult,
    TaraEntryOut,
    YogaOut,
)
from app.tara import compute_tara_balam
from app.timezone_utils import compute_utc_offset
from app.yogas import detect_all_yogas

app = FastAPI(title="Namma Jothidam")


@app.on_event("startup")
def startup() -> None:
    init_ephemeris()
    init_db()


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


def _to_chart_out(chart: ChartData) -> ChartOut:
    return ChartOut(
        lagna_rasi=chart.lagna_rasi,
        grahas={name: GrahaOut(**vars(g)) for name, g in chart.grahas.items()},
        houses=chart.houses,
    )


@app.get("/api/geocode", response_model=list[PlaceResult])
async def geocode(query: str) -> list[PlaceResult]:
    if len(query.strip()) < 2:
        return []
    results = await search_places(query)
    return [PlaceResult(**r) for r in results]


@app.post("/api/chart", response_model=ChartResponse)
def create_chart(req: BirthRequest) -> ChartResponse:
    utc_offset = compute_utc_offset(req.timezone, req.dob, req.tob)
    jd_ut = to_julian_day_ut(req.dob, req.tob, utc_offset)
    graha_longitudes = compute_graha_longitudes(jd_ut)
    lagna_longitude = compute_ascendant(jd_ut, req.latitude, req.longitude)

    d1 = build_chart(lagna_longitude, graha_longitudes)
    vargas = {varga: build_varga_chart(varga, lagna_longitude, graha_longitudes) for varga in VARGA_FUNCTIONS}

    birth_dt = datetime.combine(req.dob, req.tob)
    mahadasas = compute_mahadasas(birth_dt, graha_longitudes["Moon"])

    tara_entries = compute_tara_balam(d1.grahas["Moon"].nakshatra)
    yoga_results = detect_all_yogas(d1)

    d1_out = _to_chart_out(d1)
    vargas_out = {varga: _to_chart_out(c) for varga, c in vargas.items()}
    mahadasas_out = [DasaPeriodOut(lord=p.lord, start=p.start, end=p.end, level=p.level) for p in mahadasas]
    tara_out = [TaraEntryOut(nakshatra=e.nakshatra, count=e.count, category=e.category, quality=e.quality) for e in tara_entries]
    yogas_out = [YogaOut(name=y.name, description=y.description, triggered=y.triggered) for y in yoga_results]

    chart_json = json.dumps(
        {
            "d1": d1_out.model_dump(),
            "vargas": {k: v.model_dump() for k, v in vargas_out.items()},
            "mahadasas": [p.model_dump(mode="json") for p in mahadasas_out],
            "tara_balam": [t.model_dump() for t in tara_out],
            "yogas": [y.model_dump() for y in yogas_out],
        }
    )

    record = save_chart(
        SavedChart(
            name=req.name,
            gender=req.gender,
            dob=req.dob,
            tob=req.tob,
            pob_label=req.pob_label,
            latitude=req.latitude,
            longitude=req.longitude,
            tz_name=req.timezone,
            utc_offset=utc_offset,
            chart_json=chart_json,
        )
    )

    return ChartResponse(
        id=record.id,
        name=req.name,
        gender=req.gender,
        dob=req.dob,
        tob=req.tob,
        pob_label=req.pob_label,
        d1=d1_out,
        vargas=vargas_out,
        mahadasas=mahadasas_out,
        tara_balam=tara_out,
        yogas=yogas_out,
    )


@app.get("/api/charts", response_model=list[ChartSummary])
def get_charts() -> list[ChartSummary]:
    return [ChartSummary(id=c.id, name=c.name, dob=c.dob, created_at=c.created_at) for c in list_charts()]


@app.get("/api/charts/{chart_id}", response_model=ChartResponse)
def get_chart_by_id(chart_id: int) -> ChartResponse:
    record = get_chart(chart_id)
    if record is None:
        raise HTTPException(status_code=404, detail="Chart not found")
    data = json.loads(record.chart_json)
    return ChartResponse(
        id=record.id,
        name=record.name,
        gender=record.gender,
        dob=record.dob,
        tob=record.tob,
        pob_label=record.pob_label,
        d1=ChartOut(**data["d1"]),
        vargas={k: ChartOut(**v) for k, v in data["vargas"].items()},
        mahadasas=[DasaPeriodOut(**p) for p in data["mahadasas"]],
        tara_balam=[TaraEntryOut(**t) for t in data["tara_balam"]],
        yogas=[YogaOut(**y) for y in data["yogas"]],
    )


@app.post("/api/dasa/expand", response_model=list[DasaPeriodOut])
def expand_dasa(req: DasaExpandRequest) -> list[DasaPeriodOut]:
    children = compute_sub_periods(req.lord, req.start, req.end, req.next_level)
    return [DasaPeriodOut(lord=p.lord, start=p.start, end=p.end, level=p.level) for p in children]


app.mount("/", StaticFiles(directory="static", html=True), name="static")
