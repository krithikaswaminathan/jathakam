import os
from datetime import date, time

import pytest
from fastapi.testclient import TestClient

import app.db as db
from app.ephemeris import init_ephemeris
from app.main import app

pytestmark = pytest.mark.skipif(
    not os.path.exists("ephe/sepl_18.se1"),
    reason="Swiss Ephemeris data files not present in ephe/",
)

BIRTH = {
    "name": "Krithika", "gender": "Female", "dob": "1969-12-21", "tob": "07:25:00",
    "pob_label": "Secunderabad, Telangana, India", "latitude": 17.50427, "longitude": 78.54263,
    "timezone": "Asia/Kolkata",
}


@pytest.fixture()
def client(tmp_path):
    # No `with` block, so the app's startup hook (which opens the real jathakam.db) never runs.
    init_ephemeris("ephe")
    db._engine = None
    db.init_db(str(tmp_path / "api_test.db"))
    yield TestClient(app)
    db._engine = None


def test_old_saved_charts_load_with_all_current_features(client):
    # A row saved by an older version: only birth details, no stored results at all.
    old = db.save_chart(
        db.SavedChart(
            name="Old", gender="Female", dob=date(1969, 12, 21), tob=time(7, 25), pob_label="Secunderabad",
            latitude=17.50427, longitude=78.54263, tz_name="Asia/Kolkata", utc_offset=5.5,
            chart_json='{"d1": {"stale": true}}',
        )
    )
    body = client.get(f"/api/charts/{old.id}").json()
    assert {(e["planet"], e["state"]) for e in body["dignities"]} == {("Moon", "ucham"), ("Saturn", "neecham")}
    assert len(body["yogas"]) == 10
    assert "gulika" in body and "mandi" in body
    assert body["pranapada"]["rasi"] == 7  # Scorpio


def test_create_then_load_matches(client):
    created = client.post("/api/chart", json=BIRTH).json()
    loaded = client.get(f"/api/charts/{created['id']}").json()
    assert created["d1"] == loaded["d1"]
    assert created["dignities"] == loaded["dignities"]


def test_delete_chart(client):
    chart_id = client.post("/api/chart", json=BIRTH).json()["id"]
    assert len(client.get("/api/charts").json()) == 1
    assert client.delete(f"/api/charts/{chart_id}").status_code == 204
    assert client.get("/api/charts").json() == []
    assert client.get(f"/api/charts/{chart_id}").status_code == 404


def test_delete_missing_chart_is_404(client):
    assert client.delete("/api/charts/999").status_code == 404
