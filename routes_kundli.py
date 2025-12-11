# routes_kundli.py — FINAL ASTROSAGE-STYLE KUNDLI ENGINE

from flask import Blueprint, request, jsonify
import swisseph as swe
from timezonefinder import TimezoneFinder
from datetime import datetime
import pytz
import traceback

from place_lookup import get_coordinates   # <-- from your CSV loader

kundli_bp = Blueprint("kundli_bp", __name__)

# ----------------------------------------------------
#  CONSTANTS: Rashi + Nakshatra Names
# ----------------------------------------------------

RASHI_NAMES = [
    "Mesha", "Vrishabha", "Mithuna", "Karka",
    "Simha", "Kanya", "Tula", "Vrischika",
    "Dhanu", "Makara", "Kumbha", "Meena"
]

NAKSHATRA_NAMES = [
    "Ashwini", "Bharani", "Krittika",
    "Rohini", "Mrigashira", "Ardra",
    "Punarvasu", "Pushya", "Ashlesha",
    "Magha", "Purva Phalguni", "Uttara Phalguni",
    "Hasta", "Chitra", "Swati",
    "Vishakha", "Anuradha", "Jyeshtha",
    "Mula", "Purva Ashadha", "Uttara Ashadha",
    "Shravana", "Dhanishta", "Shatabhisha",
    "Purva Bhadrapada", "Uttara Bhadrapada", "Revati",
]


# ----------------------------------------------------
#  HELPER FUNCTIONS
# ----------------------------------------------------

def normalize(a: float) -> float:
    """Normalize angle to [0, 360)."""
    a = a % 360.0
    return float(a if a >= 0 else a + 360)


def rashi_index(lon):
    return int(normalize(lon) // 30)


def deg_in_sign(lon):
    return normalize(lon) % 30


def nakshatra_index(lon):
    seg = 360 / 27
    return int(normalize(lon) // seg)


def nakshatra_pada(lon):
    seg = 360 / 27
    pada_size = seg / 4
    lon = normalize(lon)
    idx = nakshatra_index(lon)
    within = lon - idx * seg
    return int(within // pada_size) + 1


def house_from_sign(planet_sign, lagna_sign):
    return ((planet_sign - lagna_sign + 12) % 12) + 1


# ----------------------------------------------------
#  ROUTE: /api/kundli
# ----------------------------------------------------

@kundli_bp.route("/kundli", methods=["POST"])
def kundli():
    try:
        body = request.get_json() or {}

        dob = body.get("dob")
        tob = body.get("tob")
        place = body.get("place")

        if not dob or not tob or not place:
            return jsonify({"error": "Missing dob/tob/place"}), 400

        # -------------------------------
        #  1. Get coordinates (CSV)
        # -------------------------------
        place_clean = str(place).replace(",India", "").replace(", India", "").strip()
        coords = get_coordinates(place_clean)

        if not coords:
            return jsonify({"error": f"Place not found: {place}"}), 400

        lat, lon = coords

        # -------------------------------
        #  2. Find timezone
        # -------------------------------
        tf = TimezoneFinder()
        tz = tf.timezone_at(lat=lat, lng=lon) or "Asia/Kolkata"

        local_dt = datetime.strptime(f"{dob} {tob}", "%Y-%m-%d %H:%M")
        local_dt = pytz.timezone(tz).localize(local_dt)
        utc_dt = local_dt.astimezone(pytz.utc)

        # -------------------------------
        #  3. Julian day
        # -------------------------------
        jd = swe.julday(
            utc_dt.year, utc_dt.month, utc_dt.day,
            utc_dt.hour + utc_dt.minute/60
        )

        # -------------------------------
        #  4. Houses + Lagna
        # -------------------------------
        cusps, ascmc = swe.houses(jd, lat, lon)
        asc_deg = normalize(ascmc[0])
        lagna_sign = rashi_index(asc_deg)

        # Create house map (sign per house)
        houses = {}
        for h in range(1, 12+1):
            sidx = (lagna_sign + (h - 1)) % 12
            houses[h] = {
                "sign_index": sidx,
                "sign_name": RASHI_NAMES[sidx],
                "cusp": float(cusps[h-1]),
                "planets": []
            }

        # -------------------------------
        #  5. Planets
        # -------------------------------
        planet_map = {
            "Sun": swe.SUN, "Moon": swe.MOON, "Mars": swe.MARS,
            "Mercury": swe.MERCURY, "Jupiter": swe.JUPITER,
            "Venus": swe.VENUS, "Saturn": swe.SATURN,
            "Rahu": swe.TRUE_NODE
        }
        results = {}

        for name, pid in planet_map.items():
            lon_p = normalize(swe.calc_ut(jd, pid)[0][0])

            sign = rashi_index(lon_p)
            degs = deg_in_sign(lon_p)
            nidx = nakshatra_index(lon_p)
            pada = nakshatra_pada(lon_p)
            house_no = house_from_sign(sign, lagna_sign)

            pdata = {
                "longitude": lon_p,
                "sign_index": sign,
                "sign_name": RASHI_NAMES[sign],
                "degree_in_sign": degs,
                "nakshatra_index": nidx,
                "nakshatra_name": NAKSHATRA_NAMES[nidx],
                "pada": pada,
                "house": house_no
            }
            results[name] = pdata
            houses[house_no]["planets"].append(pdata)

        # ---------------------------------
        # KETU = opposite Rahu
        # ---------------------------------
        rlon = results["Rahu"]["longitude"]
        klon = normalize(rlon + 180)

        ks = rashi_index(klon)
        kd = deg_in_sign(klon)
        kn = nakshatra_index(klon)
        kp = nakshatra_pada(klon)
        kh = house_from_sign(ks, lagna_sign)

        ketu_data = {
            "longitude": klon,
            "sign_index": ks,
            "sign_name": RASHI_NAMES[ks],
            "degree_in_sign": kd,
            "nakshatra_index": kn,
            "nakshatra_name": NAKSHATRA_NAMES[kn],
            "pada": kp,
            "house": kh
        }
        results["Ketu"] = ketu_data
        houses[kh]["planets"].append(ketu_data)

        # ---------------------------------
        # ASC details
        # ---------------------------------
        asc_n = nakshatra_index(asc_deg)
        asc_p = nakshatra_pada(asc_deg)

        asc_info = {
            "degree": asc_deg,
            "sign_index": lagna_sign,
            "sign_name": RASHI_NAMES[lagna_sign],
            "nakshatra_index": asc_n,
            "nakshatra_name": NAKSHATRA_NAMES[asc_n],
            "pada": asc_p
        }

        # ---------------------------------
        # FINAL RESPONSE
        # ---------------------------------
        return jsonify({
            "input": {
                "dob": dob, "tob": tob, "place": place,
                "timezone": tz
            },
            "coords": {"lat": lat, "lon": lon},
            "ascendant": asc_info,
            "houses": houses,
            "planets": results,
            "jd": jd
        })


    except Exception as e:
        print("\n\n🔥 ERROR IN KUNDLI ENGINE 🔥")
        traceback.print_exc()
        print("🔥 END ERROR 🔥\n\n")
        return jsonify({"error": str(e)}), 500
