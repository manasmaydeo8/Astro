import io
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors

def generate_kundali_pdf(data):
    buffer = io.BytesIO()
    c = canvas.Canvas(buffer, pagesize=A4)
    width, height = A4

    # Title
    c.setFont("Helvetica-Bold", 20)
    c.drawCentredString(width / 2.0, height - 50, "Janma Kundali")

    # User Details
    c.setFont("Helvetica", 12)
    c.drawString(50, height - 100, f"Name: {data.get('name', 'Unknown')}")
    c.drawString(50, height - 120, f"Date: {data.get('date', 'Unknown')}")
    c.drawString(300, height - 120, f"Time: {data.get('time', 'Unknown')}")
    
    place_str = data.get('place', 'Unknown')
    coords = data.get('coordinates', {})
    lat = coords.get('lat', 0.0)
    lon = coords.get('lon', 0.0)
    c.drawString(50, height - 140, f"Place: {place_str} ({lat:.2f} N, {lon:.2f} E)")

    # Draw North Indian Chart
    chart_size = 250
    chart_x = (width - chart_size) / 2
    chart_y = height - 420

    # Draw lines
    c.setLineWidth(1)
    c.setStrokeColor(colors.black)
    
    # Outer box
    c.rect(chart_x, chart_y, chart_size, chart_size)
    
    # Diagonals
    c.line(chart_x, chart_y, chart_x + chart_size, chart_y + chart_size)
    c.line(chart_x, chart_y + chart_size, chart_x + chart_size, chart_y)
    
    # Inner diamond
    c.line(chart_x + chart_size/2, chart_y, chart_x + chart_size, chart_y + chart_size/2)
    c.line(chart_x + chart_size, chart_y + chart_size/2, chart_x + chart_size/2, chart_y + chart_size)
    c.line(chart_x + chart_size/2, chart_y + chart_size, chart_x, chart_y + chart_size/2)
    c.line(chart_x, chart_y + chart_size/2, chart_x + chart_size/2, chart_y)

    # Calculate Houses
    planetary_positions = data.get('planetary_positions', {})
    ascendant_sign = planetary_positions.get('Ascendant', {}).get('sign')
    
    signs = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"]
    asc_index = signs.index(ascendant_sign) if ascendant_sign in signs else 0
    
    def get_house(planet_sign):
        if not planet_sign or planet_sign not in signs: return -1
        p_index = signs.index(planet_sign)
        return (p_index - asc_index + 12) % 12 + 1
        
    house_planets = {i: [] for i in range(1, 13)}
    
    short_names = {
        "Sun": "Su", "Moon": "Mo", "Mars": "Ma", "Mercury": "Me",
        "Jupiter": "Ju", "Venus": "Ve", "Saturn": "Sa", "Rahu": "Ra", "Ketu": "Ke"
    }

    for planet, details in planetary_positions.items():
        if planet == 'Ascendant': continue
        h = get_house(details.get('sign'))
        if h != -1:
            house_planets[h].append(short_names.get(planet, planet[:2]))

    # ReportLab bottom-up drawing: Y is inverted from the react viewBox SVG
    # React: Y=0 is top. ReportLab: Y=0 is bottom.
    
    house_config = {
        1: {'x': 50, 'y': 20}, # Top diamond 
        2: {'x': 25, 'y': 10}, 
        3: {'x': 10, 'y': 20},
        4: {'x': 25, 'y': 50}, # Left diamond
        5: {'x': 10, 'y': 80},
        6: {'x': 25, 'y': 90},
        7: {'x': 50, 'y': 80}, # Bottom diamond
        8: {'x': 75, 'y': 90},
        9: {'x': 90, 'y': 80},
        10: {'x': 75, 'y': 50}, # Right diamond
        11: {'x': 90, 'y': 20},
        12: {'x': 75, 'y': 10}
    }

    for h, cfg in house_config.items():
        # Invert Y for reportlab
        px = chart_x + (cfg['x'] / 100.0) * chart_size
        py = chart_y + ((100 - cfg['y']) / 100.0) * chart_size
        
        # Draw sign number (Small)
        sign_num = ((asc_index + h - 1) % 12) + 1
        c.setFont("Helvetica", 8)
        c.setFillColor(colors.darkgray)
        # Adjust Y slightly so it doesn't overlap planets
        c.drawCentredString(px, py + 10, str(sign_num))
        
        # Draw planets
        planets_str = " ".join(house_planets[h])
        c.setFont("Helvetica-Bold", 10)
        c.setFillColor(colors.black)
        c.drawCentredString(px, py, planets_str)

    # Planets Table
    table_y = chart_y - 40
    c.setFont("Helvetica-Bold", 12)
    c.drawString(50, table_y, "Planetary Positions")
    
    table_y -= 25
    c.setFont("Helvetica-Bold", 10)
    c.drawString(50, table_y, "Planet")
    c.drawString(150, table_y, "Sign")
    c.drawString(250, table_y, "Degree")
    
    c.setFont("Helvetica", 10)
    table_y -= 20
    for planet, details in planetary_positions.items():
        c.drawString(50, table_y, planet)
        c.drawString(150, table_y, details.get('sign', ''))
        c.drawString(250, table_y, f"{details.get('deg', 0):.2f}°")
        table_y -= 15

    # Predictions
    table_y -= 20
    c.setFont("Helvetica-Bold", 12)
    c.drawString(50, table_y, "Basic Astrological Reading")
    
    table_y -= 20
    c.setFont("Helvetica", 10)
    moon_sign = planetary_positions.get('Moon', {}).get('sign')
    c.drawString(50, table_y, f"• Your Ascendant (Lagna) is {ascendant_sign}.")
    table_y -= 15
    c.drawString(50, table_y, f"• Your Moon Sign (Rashi) is {moon_sign}.")
    
    c.save()
    buffer.seek(0)
    return buffer
