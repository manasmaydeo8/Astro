import os
import math
import datetime
from skyfield.api import load, Topos, wgs84
from skyfield.api import Loader

class AstrologyEngine:
    def __init__(self):
        self.data_dir = './skyfield_data'
        if not os.path.exists(os.path.join(self.data_dir, 'de421.bsp')):
            raise FileNotFoundError(
                f"Required ephemeris file 'de421.bsp' not found in {self.data_dir}. "
                "Please run 'python download_data.py' to download it."
            )
        self.load = Loader(self.data_dir)
        self.ts = self.load.timescale()
        self.eph = self.load('de421.bsp')
        
    def get_ayanamsa(self, jd):
        """
        Calculate Lahiri Ayanamsa for a given Julian Date.
        Formula: 22.460148 + 1.396042 * (T) + 0.000307 * (T^2)
        where T is centuries from J2000.0.
        This is a simplified version of the Lahiri formula.
        """
        T = (jd - 2451545.0) / 36525
        # Lahiri fixed at 285 AD roughly. 
        # More accurate Lahiri Ayanamsa formula:
        ayan = 23.85 + (jd - 2441683.5) * (50.27 / 3600 / 365.25)
        return ayan % 360

    def calculate_positions(self, date_obj, time_obj, lat: float, lon: float, tz_offset: float = 5.5):
        """
        Calculate planetary positions using Skyfield.
        """
        # Create datetime object in UTC
        dt_local = datetime.datetime.combine(date_obj, time_obj)
        dt_utc = dt_local - datetime.timedelta(hours=tz_offset)
        
        t = self.ts.from_datetime(dt_utc.replace(tzinfo=datetime.timezone.utc))
        jd = t.tt
        
        ayan = self.get_ayanamsa(jd)
        
        bodies = {
            'Sun': self.eph['sun'],
            'Moon': self.eph['moon'],
            'Mars': self.eph['mars'],
            'Mercury': self.eph['mercury'],
            'Jupiter': self.eph['jupiter_barycenter'],
            'Venus': self.eph['venus'],
            'Saturn': self.eph['saturn_barycenter']
        }
        
        earth = self.eph['earth']
        results = {}
        
        signs = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"]

        for name, body in bodies.items():
            astrometric = earth.at(t).observe(body)
            # Apparent position relative to the true equator and equinox of date
            lat_t, lon_t, dist = astrometric.ecliptic_latlon(t)
            
            # Convert to sidereal
            sidereal_lon = (lon_t.degrees - ayan) % 360
            
            sign_idx = int(sidereal_lon / 30)
            results[name] = {
                "sign": signs[sign_idx],
                "lon": sidereal_lon,
                "deg": sidereal_lon % 30
            }

        # Rahu and Ketu (Approximation for demo if not using complex mean nodes)
        # Using a simplified 18.6 year cycle for Rahu
        rahu_lon = (160.0 - (jd - 2451545.0) * 0.05295) % 360
        sidereal_rahu = (rahu_lon - ayan) % 360
        results['Rahu'] = {
            "sign": signs[int(sidereal_rahu / 30)],
            "lon": sidereal_rahu,
            "deg": sidereal_rahu % 30
        }
        sidereal_ketu = (sidereal_rahu + 180) % 360
        results['Ketu'] = {
            "sign": signs[int(sidereal_ketu / 30)],
            "lon": sidereal_ketu,
            "deg": sidereal_ketu % 30
        }

        # Ascendant (Lagna)
        # 1. Obliquity of the ecliptic
        eps = 23.4392911 * (math.pi / 180) # approx
        
        # 2. Local Sidereal Time (in degrees)
        # Skyfield provides GMST in hours
        gmst = t.gmst
        lst = (gmst + lon / 15.0) % 24  # Local sidereal time in hours
        lst_rad = (lst * 15.0) * (math.pi / 180)
        
        lat_rad = lat * (math.pi / 180)
        
        # 3. Ascendant formula
        # tan(Asc) = -cos(LST) / (sin(LST) * cos(eps) - tan(lat) * sin(eps))
        asc_rad = math.atan2(-math.cos(lst_rad), math.sin(lst_rad) * math.cos(eps) - math.tan(lat_rad) * math.sin(eps))
        asc_deg = (asc_rad * 180 / math.pi) % 360
        
        sidereal_asc = (asc_deg - ayan) % 360
        
        results["Ascendant"] = {
             "sign": signs[int(sidereal_asc / 30)],
             "lon": sidereal_asc,
             "deg": sidereal_asc % 30
        }

        return results

    def generate_chart_svg(self, positions):
        return "<svg>...</svg>"

engine = AstrologyEngine()
