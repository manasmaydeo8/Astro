try:
    from flatlib.datetime import Datetime
    from flatlib.geopos import GeoPos
    from flatlib.chart import Chart
    from flatlib import const
    print("Flatlib imports successful")
except ImportError as e:
    print(f"Flatlib import failed: {e}")

try:
    from geopy.geocoders import Nominatim
    print("Geopy imports successful")
except ImportError as e:
    print(f"Geopy import failed: {e}")
