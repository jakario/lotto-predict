import os
import requests
import time

def download_image(url, filename):
    try:
        headers = {'User-Agent': 'Mozilla/5.0'}
        response = requests.get(url, stream=True, headers=headers, timeout=15)
        if response.status_code == 200:
            with open(filename, 'wb') as f:
                for chunk in response.iter_content(1024):
                    f.write(chunk)
            print(f"Success: {os.path.basename(filename)}")
            return True
        else:
            print(f"Failed {os.path.basename(filename)}: {response.status_code}")
            return False
    except Exception as e:
        print(f"Error {os.path.basename(filename)}: {e}")
        return False

tarot_dir = r"d:\autopost\personal-agent\lotto-predict\public\tarot"
if not os.path.exists(tarot_dir):
    os.makedirs(tarot_dir)

# Reliable GitHub Raw URLs
base_url = "https://raw.githubusercontent.com/ekelen/tarot-api/master/static/cards/"
cards = {
    "19.jpg": base_url + "m19.jpg",
    "10.jpg": base_url + "m10.jpg",
    "3.jpg": base_url + "m03.jpg",
    "1.jpg": base_url + "m01.jpg",
    "21.jpg": base_url + "m21.jpg",
    "17.jpg": base_url + "m17.jpg",
    "ace_p.jpg": base_url + "p01.jpg",
    "king_p.jpg": base_url + "p14.jpg"
}

print("Retrying Tarot Image Download (High Reliability Source)...")
for filename, url in cards.items():
    filepath = os.path.join(tarot_dir, filename)
    download_image(url, filepath)
    time.sleep(0.5) # Small gap

print("Process finished. Checking files...")
count = len([f for f in os.listdir(tarot_dir) if f.endswith('.jpg')])
print(f"Total JPG files in tarot folder: {count}")
