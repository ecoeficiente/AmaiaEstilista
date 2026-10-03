import os
import re
import json

def test_site():
    print("=== RUNNING VERIFICATION SUITE ===")
    errors = []

    # 1. Check files existence
    expected_files = [
        "index.html",
        "eu/index.html",
        "hasiera/index.html",
        "assets/css/style.css",
        "assets/js/main.js",
        "assets/img/logo-dark-192.png",
        "assets/img/favicon-32x32.png",
        "assets/img/apple-touch-icon.png",
        "favicon.png",
        "robots.txt",
        "sitemap.xml"
    ]
    for f in expected_files:
        path = os.path.join(r"c:\Dev\AmaiaEstilista", f)
        if not os.path.exists(path):
            errors.append(f"Missing file: {f}")
        else:
            size = os.path.getsize(path)
            if size == 0:
                errors.append(f"Empty file: {f}")
            else:
                print(f"[OK] File exists: {f} ({size} bytes)")

    # 2. Check JSON-LD schema validity
    for page_path in ["index.html", "eu/index.html"]:
        full_path = os.path.join(r"c:\Dev\AmaiaEstilista", page_path)
        with open(full_path, "r", encoding="utf-8") as f:
            content = f.read()
        
        matches = re.findall(r'<script type="application/ld\+json">(.*?)</script>', content, re.DOTALL)
        if not matches:
            errors.append(f"No JSON-LD schema in {page_path}")
        else:
            for m in matches:
                try:
                    data = json.loads(m.strip())
                    print(f"[OK] Valid JSON-LD schema in {page_path}: @type = {data.get('@type')}, name = {data.get('name')}")
                    assert data.get("telephone") == "+34697189305"
                    assert data.get("geo", {}).get("latitude") == 43.3238162
                    assert data.get("geo", {}).get("longitude") == -1.9311865
                    assert len(data.get("openingHoursSpecification", [])) == 5
                except Exception as e:
                    errors.append(f"Invalid JSON-LD in {page_path}: {e}")

    # 3. Check factual prices consistency
    expected_prices_es = {
        "Caballero": "13",
        "Bebé": "5",
        "Niño": "9",
        "Niña": "9 – 16",
        "Corte y Marcado": "27 – 30",
        "Marcado": "14 – 17",
        "Color": "23 – 25",
        "Mechas plata": "18 – 25",
        "Mechas peine": "7",
        "Recogido": "35",
        "Keratina": "50 – 100"
    }

    with open(r"c:\Dev\AmaiaEstilista\index.html", "r", encoding="utf-8") as f:
        es_html = f.read()

    for item, price in expected_prices_es.items():
        if item not in es_html:
            errors.append(f"Missing item in ES: {item}")
        if price not in es_html:
            errors.append(f"Missing price {price} for {item} in ES")
        else:
            print(f"[OK] ES Price verified: {item} -> {price} €")

    expected_prices_eu = {
        "Gizona": "13",
        "Umea": "5",
        "Mutila": "9",
        "Neska": "9 – 16",
        "Moztu eta orraztu": "27 – 30",
        "Orraztu": "14 – 17",
        "Tindatu / Kolorea": "23 – 25",
        "Zilarrezko metxak": "18 – 25",
        "Orrazi-metxak": "7",
        "Bildutakoak / Orrazkera": "35",
        "Keratina": "50 – 100"
    }

    with open(r"c:\Dev\AmaiaEstilista\eu\index.html", "r", encoding="utf-8") as f:
        eu_html = f.read()

    for item, price in expected_prices_eu.items():
        if item not in eu_html:
            errors.append(f"Missing item in EU: {item}")
        if price not in eu_html:
            errors.append(f"Missing price {price} for {item} in EU")
        else:
            print(f"[OK] EU Price verified: {item} -> {price} €")

    # 4. Check links
    phone_clean = "697 18 93 05"
    tel_link = "tel:+34697189305"
    wa_link = "https://wa.me/34697189305"
    maps_link = "https://www.google.com/maps/place/Amaia+Estilista/@43.3238052,-1.9315959,19.5z"

    for name, html in [("ES", es_html), ("EU", eu_html)]:
        if phone_clean not in html:
            errors.append(f"Missing clean phone {phone_clean} in {name}")
        if tel_link not in html:
            errors.append(f"Missing tel link {tel_link} in {name}")
        if wa_link not in html:
            errors.append(f"Missing WhatsApp link in {name}")
        if maps_link not in html:
            errors.append(f"Missing Google Maps link in {name}")
        print(f"[OK] Contact links verified in {name}")

    # 5. Check CSS file syntax / structure
    with open(r"c:\Dev\AmaiaEstilista\assets\css\style.css", "r", encoding="utf-8") as f:
        css = f.read()
    assert ":root" in css
    assert "@media (max-width: 768px)" in css
    assert "@media (prefers-reduced-motion: reduce)" in css
    print("[OK] CSS structure verified")

    # 6. Check JS logic
    with open(r"c:\Dev\AmaiaEstilista\assets\js\main.js", "r", encoding="utf-8") as f:
        js = f.read()
    assert "SCHEDULE" in js
    assert "initScheduleStatus" in js
    print("[OK] JS logic verified")

    if errors:
        print("\nERRORS FOUND:")
        for e in errors:
            print("  -", e)
        raise SystemExit(1)
    else:
        print("\nALL VERIFICATIONS PASSED SUCCESSFULLY!")

if __name__ == "__main__":
    test_site()
