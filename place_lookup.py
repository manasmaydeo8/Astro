# place_lookup.py — FINAL VERSION FOR India_places.csv

import csv
import os
from geopy.geocoders import Nominatim

PLACES = []

def load_places(csv_path="data/india_places.csv"):
    """
    Load India cities/villages from CSV.
    Supports city/state/latitude/longitude columns automatically.
    """

    global PLACES

    if not os.path.exists(csv_path):
        print(f"[ERROR] CSV not found: {csv_path}")
        return

    try:
        with open(csv_path, "r", encoding="utf-8") as f:
            reader = csv.DictReader(f)

            for row in reader:

                # detect column names automatically
                name = (
                    row.get("name")
                    or row.get("city")
                    or row.get("town")
                    or row.get("village")
                    or row.get("place")
                )

                state = (
                    row.get("state")
                    or row.get("district")
                    or row.get("State")
                )

                lat = (
                    row.get("lat")
                    or row.get("latitude")
                    or row.get("Latitude")
                )

                lon = (
                    row.get("lon")
                    or row.get("longitude")
                    or row.get("Longitude")
                )

                if not name or not lat or not lon:
                    continue

                try:
                    PLACES.append({
                        "name": name.strip().lower(),
                        "state": (state or "").strip().lower(),
                        "lat": float(lat),
                        "lon": float(lon)
                    })
                except:
                    continue

        print(f"[INFO] Loaded {len(PLACES)} places from CSV")

    except Exception as e:
        print("[ERROR] Failed to load CSV:", e)


def find_in_csv(place_name):
    """Find place by exact or partial match."""
    place_lower = place_name.strip().lower()

    # Exact match
    for row in PLACES:
        if row["name"] == place_lower:
            return row["lat"], row["lon"]

    # Partial match
    for row in PLACES:
        if place_lower in row["name"]:
            return row["lat"], row["lon"]

    return None


def geocode_online(place_name):
    """Fallback geocoder (India only)."""
    geolocator = Nominatim(user_agent="kundli_app")
    try:
        q = f"{place_name}, India"
        loc = geolocator.geocode(q, country_codes="in", timeout=10)
        if loc:
            return loc.latitude, loc.longitude
    except:
        pass
    return None


def get_coordinates(place_name):
    """Main lookup function: CSV → fallback → None"""

    # First check CSV
    coords = find_in_csv(place_name)
    if coords:
        return coords

    # Fallback to online
    return geocode_online(place_name)
