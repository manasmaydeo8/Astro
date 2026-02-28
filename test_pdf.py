import sys
import os

sys.path.append(os.path.join(os.path.dirname(__file__), 'backend'))
from pdf_generator import generate_kundali_pdf

test_data = {
    "name": "Test User",
    "date": "1990-01-01",
    "time": "12:00",
    "place": "Mumbai",
    "coordinates": {"lat": 19.07, "lon": 72.87},
    "planetary_positions": {
        "Ascendant": {"sign": "Aries", "deg": 15.0},
        "Sun": {"sign": "Aries", "deg": 10.0},
        "Moon": {"sign": "Taurus", "deg": 5.0},
        "Mars": {"sign": "Gemini", "deg": 20.0},
        "Mercury": {"sign": "Cancer", "deg": 25.0},
        "Jupiter": {"sign": "Leo", "deg": 30.0},
        "Venus": {"sign": "Virgo", "deg": 5.0},
        "Saturn": {"sign": "Libra", "deg": 10.0},
        "Rahu": {"sign": "Scorpio", "deg": 15.0},
        "Ketu": {"sign": "Pisces", "deg": 20.0}
    }
}

try:
    buffer = generate_kundali_pdf(test_data)
    pdf_bytes = buffer.read()
    with open('test_output.pdf', 'wb') as f:
        f.write(pdf_bytes)
    if pdf_bytes.startswith(b'%PDF'):
        print(f"SUCCESS: Generated PDF of size {len(pdf_bytes)} bytes.")
    else:
        print("ERROR: Output does not start with %PDF")
except Exception as e:
    import traceback
    traceback.print_exc()
    print(f"ERROR: {e}")
