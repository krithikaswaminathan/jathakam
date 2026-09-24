from datetime import datetime

from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles

from app.astrology import (
    ChartData,
    VARGA_FUNCTIONS,
    build_chart,
    build_varga_chart,
    compute_indu_lagna,
    longitude_to_rasi,
    make_graha_position,
)
from app.constants import RASI_LORDS
from app.dasa import compute_mahadasas, compute_sub_periods
from app.db import SavedChart, delete_chart, get_chart, init_db, list_charts, save_chart
from app.dignity import compute_dignities
from app.ephemeris import compute_ascendant, compute_graha_positions, init_ephemeris, to_julian_day_ut
from app.geocode import search_places
from app.models import (
    BirthRequest,
    ChartOut,
    ChartResponse,
    ChartSummary,
    DasaExpandRequest,
    DasaPeriodOut,
    DignityOut,
    GrahaOut,
    PlaceResult,
    TaraEntryOut,
    YogaOut,
)
from app.pranapada import compute_pranapada_longitude
from app.tara import compute_tara_balam
from app.timezone_utils import compute_utc_offset
from app.upagraha import compute_gulika_longitude, compute_mandi_longitude
from app.yogas import detect_all_yogas

app = FastAPI(title="Namma Jothidam")


@app.on_event("startup")
def startup() -> None:
    init_ephemeris()
    init_db()


@app.middleware("http")
async def no_cache_static_files(request, call_next):
    response = await call_next(request)
    if not request.url.path.startswith("/api"):
        # Forces the browser to revalidate (ETag/Last-Modified) instead of silently
        # reusing a stale cached copy of index.html/chart.js/labels.js/style.css.
        response.headers["Cache-Control"] = "no-cache"
    return response


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


def _build_chart_response(
    chart_id: int, name: str, gender: str, dob, tob, pob_label: str, latitude: float, longitude: float, timezone: str
) -> ChartResponse:
    """Everything shown for a chart, computed from birth details alone. Saved charts
    are recomputed on load (not read back from stored results), so they always
    include every feature added since they were saved."""
    utc_offset = compute_utc_offset(timezone, dob, tob)
    jd_ut = to_julian_day_ut(dob, tob, utc_offset)
    graha_positions = compute_graha_positions(jd_ut)
    graha_longitudes = {n: lon for n, (lon, _speed) in graha_positions.items()}
    graha_speeds = {n: speed for n, (_lon, speed) in graha_positions.items()}
    lagna_longitude = compute_ascendant(jd_ut, latitude, longitude)

    d1 = build_chart(lagna_longitude, graha_longitudes, graha_speeds)
    vargas = {
        varga: build_varga_chart(varga, lagna_longitude, graha_longitudes, graha_speeds)
        for varga in VARGA_FUNCTIONS
    }

    gulika_longitude = compute_gulika_longitude(dob, tob, utc_offset, latitude, longitude)
    gulika = make_graha_position("Gulika", gulika_longitude, longitude_to_rasi(gulika_longitude), d1.lagna_rasi)
    mandi_longitude = compute_mandi_longitude(dob, tob, utc_offset, latitude, longitude)
    mandi = make_graha_position("Mandi", mandi_longitude, longitude_to_rasi(mandi_longitude), d1.lagna_rasi)

    pranapada_longitude = compute_pranapada_longitude(
        dob, tob, utc_offset, latitude, longitude, graha_longitudes["Sun"]
    )
    pranapada = make_graha_position(
        "Pranapada", pranapada_longitude, longitude_to_rasi(pranapada_longitude), d1.lagna_rasi
    )

    indu_lagna_rasi = compute_indu_lagna(d1.lagna_rasi, d1.grahas["Moon"].rasi)
    mahadasas = compute_mahadasas(datetime.combine(dob, tob), graha_longitudes["Moon"])
    tara_entries = compute_tara_balam(d1.grahas["Moon"].nakshatra)

    return ChartResponse(
        id=chart_id,
        name=name,
        gender=gender,
        dob=dob,
        tob=tob,
        pob_label=pob_label,
        d1=_to_chart_out(d1),
        vargas={varga: _to_chart_out(c) for varga, c in vargas.items()},
        gulika=GrahaOut(**vars(gulika)),
        mandi=GrahaOut(**vars(mandi)),
        indu_lagna_rasi=indu_lagna_rasi,
        indu_lagna_lord=RASI_LORDS[indu_lagna_rasi],
        mahadasas=[DasaPeriodOut(lord=p.lord, start=p.start, end=p.end, level=p.level) for p in mahadasas],
        tara_balam=[
            TaraEntryOut(nakshatra=e.nakshatra, count=e.count, category=e.category, quality=e.quality)
            for e in tara_entries
        ],
        yogas=[
            YogaOut(name=y.name, description=y.description, triggered=y.triggered, from_moon=y.from_moon)
            for y in detect_all_yogas(d1)
        ],
        dignities=[DignityOut(**vars(e)) for e in compute_dignities(d1)],
        pranapada=GrahaOut(**vars(pranapada)),
    )


@app.post("/api/chart", response_model=ChartResponse)
def create_chart(req: BirthRequest) -> ChartResponse:
    response = _build_chart_response(
        0, req.name, req.gender, req.dob, req.tob, req.pob_label, req.latitude, req.longitude, req.timezone
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
            utc_offset=compute_utc_offset(req.timezone, req.dob, req.tob),
            chart_json="{}",  # results are recomputed on load; kept only because the column is required
        )
    )
    response.id = record.id
    return response


@app.get("/api/charts", response_model=list[ChartSummary])
def get_charts() -> list[ChartSummary]:
    return [ChartSummary(id=c.id, name=c.name, dob=c.dob, created_at=c.created_at) for c in list_charts()]


@app.get("/api/charts/{chart_id}", response_model=ChartResponse)
def get_chart_by_id(chart_id: int) -> ChartResponse:
    record = get_chart(chart_id)
    if record is None:
        raise HTTPException(status_code=404, detail="Chart not found")
    return _build_chart_response(
        record.id, record.name, record.gender, record.dob, record.tob, record.pob_label,
        record.latitude, record.longitude, record.tz_name,
    )


@app.delete("/api/charts/{chart_id}", status_code=204)
def remove_chart(chart_id: int) -> None:
    if not delete_chart(chart_id):
        raise HTTPException(status_code=404, detail="Chart not found")


@app.post("/api/dasa/expand", response_model=list[DasaPeriodOut])
def expand_dasa(req: DasaExpandRequest) -> list[DasaPeriodOut]:
    children = compute_sub_periods(req.lord, req.start, req.end, req.next_level)
    return [DasaPeriodOut(lord=p.lord, start=p.start, end=p.end, level=p.level) for p in children]


app.mount("/", StaticFiles(directory="static", html=True), name="static")
