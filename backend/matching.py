# from flatlib.const import MOON
MOON = 'Moon'

import math

class MatchmakingEngine:
    def __init__(self):
        # Nakshatras List
        self.nakshatras = [
            "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashirsha", "Ardra", 
            "Punarvasu", "Pushya", "Ashlesha", "Magha", "Purva Phalguni", "Uttara Phalguni", 
            "Hasta", "Chitra", "Swati", "Vishakha", "Anuradha", "Jyeshtha", 
            "Mula", "Purva Ashadha", "Uttara Ashadha", "Shravana", "Dhanishtha", 
            "Shatabhisha", "Purva Bhadrapada", "Uttara Bhadrapada", "Revati"
        ]
        
    def get_nakshatra(self, moon_lon):
        """
        Returns (Nakshatra Index 1-27, Nakshatra Name, Pada 1-4)
        Each Nakshatra is 13°20' (13.3333 degrees)
        """
        one_star = 13.3333333333
        nak_index = int(moon_lon / one_star)
        
        # Portion traversed within the nakshatra
        rem_deg = moon_lon % one_star
        pada = int(rem_deg / (3.3333333333)) + 1
        
        return nak_index + 1, self.nakshatras[nak_index % 27], pada

    def calculate_guna_milan(self, boy_moon_lon, girl_moon_lon):
        """
        Simplified Guna Milan Calculation.
        In a real production app, this would implement the full Ashtakoot logic.
        For now, we simulate the score based on Nakshatra compatibility logic or randomization for demo
        BUT let's try to do a basic logic based on Nakshatra distance.
        """
        boy_nak, boy_name, boy_pada = self.get_nakshatra(boy_moon_lon)
        girl_nak, girl_name, girl_pada = self.get_nakshatra(girl_moon_lon)
        
        # Full logic is complex, implementing a simplified version for prototype
        # 1. Varna (1 point)
        # 2. Vashya (2 points)
        # 3. Tara (3 points)
        # 4. Yoni (4 points)
        # 5. Graha Maitri (5 points)
        # 6. Gana (6 points)
        # 7. Bhakoot (7 points)
        # 8. Nadi (8 points)
        # Total = 36
        
        # Mocking the calculation for stability in this demo 
        # but using the nakshatras to make it deterministic.
        
        distance = abs(boy_nak - girl_nak)
        score = 0
        
        if distance == 0: score = 28 # Same nakshatra, usually good but Nadi dosha risk.
        elif distance % 9 == 0: score = 32 # Trikona
        elif distance % 4 == 0: score = 18
        elif distance % 7 == 0: score = 10 # Bad match often
        else: score = 24 # Average
        
        # Normalize/Add randomness for demo variability if strictly determinstic is too boring
        # But let's stick to deterministic based on positions.
        
        final_score = score + (1 if boy_pada == girl_pada else 0)
        final_score = min(36, max(0, final_score))
        
        verdict = "Average"
        if final_score > 28: verdict = "Excellent"
        elif final_score > 18: verdict = "Good"
        elif final_score < 10: verdict = "Poor"
        
        return {
            "score": final_score,
            "total": 36,
            "verdict": verdict,
            "boy_info": {"nakshatra": boy_name, "pada": boy_pada},
            "girl_info": {"nakshatra": girl_name, "pada": girl_pada}
        }

matcher = MatchmakingEngine()
