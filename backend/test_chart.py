try:
    from flatlib.datetime import Datetime
    from flatlib.geopos import GeoPos
    from flatlib.chart import Chart
    from flatlib import const
    import datetime

    d = datetime.date(1990, 1, 1)
    t = datetime.time(12, 0)
    lat = 19.0760
    lon = 72.8777
    tz = '+05:30'

    date_str = d.strftime("%Y/%m/%d")
    time_str = t.strftime("%H:%M")
    
    print(f"Testing with date={date_str}, time={time_str}, tz={tz}")
    
    # Try the way it is in engine.py
    try:
        pos = GeoPos(lat, lon)
        chart = Chart(date_str, time_str, pos)
        print("Chart(date_str, time_str, pos) worked!")
    except Exception as e:
        print(f"Chart(date_str, time_str, pos) failed: {e}")

    # Try the standard flatlib way
    try:
        dt = Datetime(date_str, time_str, tz)
        pos = GeoPos(lat, lon)
        chart = Chart(dt, pos)
        print("Chart(dt, pos) worked!")
        sun = chart.get(const.SUN)
        print(f"Sun position: {sun.lon}")
    except Exception as e:
        print(f"Chart(dt, pos) failed: {e}")

except Exception as e:
    print(f"Error during test: {e}")
