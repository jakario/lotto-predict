import os
import requests
import time

def download(url, name):
    try:
        r = requests.get(url, timeout=15)
        if r.status_code == 200:
            with open(name, 'wb') as f:
                f.write(r.content)
            print(f"OK: {os.path.basename(name)}")
            return True
        else:
            print(f"Error {os.path.basename(name)}: {r.status_code}")
            return False
    except:
        return False

path = r"d:\autopost\personal-agent\lotto-predict\public\tarot"
if not os.path.exists(path):
    os.makedirs(path)

# High-reliability GitHub raw links
base = "https://raw.githubusercontent.com/ekelen/tarot-api/master/static/cards/"
map_cards = {
    "1.jpg": base + "m01.jpg",
    "3.jpg": base + "m03.jpg",
    "10.jpg": base + "m10.jpg",
    "17.jpg": base + "m17.jpg",
    "19.jpg": base + "m19.jpg",
    "21.jpg": base + "m21.jpg",
    "ace_p.jpg": base + "p01.jpg",
    "king_p.jpg": base + "p14.jpg"
}

print("Final Sprint: Downloading all 8 cards...")
for key, url in map_cards.items():
    download(url, os.path.join(path, key))
    time.sleep(0.3)

print("\nVerify count in:", path)
print("Files:", [f for f in os.listdir(path) if f.endswith('.jpg')])
