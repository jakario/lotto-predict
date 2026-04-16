import os
import requests

def download(url, name):
    try:
        headers = {'User-Agent': 'Mozilla/5.0'}
        r = requests.get(url, stream=True, headers=headers, timeout=20)
        if r.status_code == 200:
            with open(name, 'wb') as f:
                for chunk in r.iter_content(1024):
                    f.write(chunk)
            print(f"DONE: {os.path.basename(name)}")
            return True
        else:
            print(f"FAIL {os.path.basename(name)}: {r.status_code}")
            return False
    except Exception as e:
        print(f"ERROR: {e}")
        return False

path = r"d:\autopost\personal-agent\lotto-predict\public\tarot"
missing_cards = {
    "19.jpg": "https://upload.wikimedia.org/wikipedia/commons/e/e1/RWS1909_-_19_Sun.jpeg",
    "ace_p.jpg": "https://upload.wikimedia.org/wikipedia/commons/a/a9/RWS1909_-_Pentacles_01.jpeg",
    "king_p.jpg": "https://upload.wikimedia.org/wikipedia/commons/e/ed/RWS1909_-_Pentacles_14.jpeg"
}

print("Downloading the last 3 cards...")
for key, url in missing_cards.items():
    download(url, os.path.join(path, key))

print("\nFinal Scan of:", path)
print("All JPGs:", [f for f in os.listdir(path) if f.lower().endswith('.jpg')])
