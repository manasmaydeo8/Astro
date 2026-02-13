from engine import engine
import datetime

def test_engine():
    try:
        print("Testing AstrologyEngine...")
        date_obj = datetime.date.today()
        time_obj = datetime.time(12, 0)
        lat = 19.0760 # Mumbai
        lon = 72.8777
        
        positions = engine.calculate_positions(date_obj, time_obj, lat, lon)
        print("Planetary Positions calculated successfully:")
        for planet, details in positions.items():
            print(f"{planet}: {details['sign']} {details['deg']:.2f}°")
        print("\nVerification SUCCESSFUL!")
    except Exception as e:
        print(f"\nVerification FAILED: {e}")

if __name__ == "__main__":
    test_engine()
