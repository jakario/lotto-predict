import os
import requests
import time

def download_image(url, filename):
    try:
        headers = {'User-Agent': 'Mozilla/5.0'}
        response = requests.get(url, stream=True, headers=headers, timeout=20)
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

cards = {
    "1.jpg": "https://upload.wikimedia.org/wikipedia/commons/b/b0/RWS1909_-_01_Magician.jpeg",
    "3.jpg": "https://upload.wikimedia.org/wikipedia/commons/7/70/RWS1909_-_03_Empress.jpeg",
    "10.jpg": "https://upload.wikimedia.org/wikipedia/commons/8/8a/RWS1909_-_10_Wheel_of_Fortune.jpeg",
    "17.jpg": "https://upload.wikimedia.org/wikipedia/commons/4/44/RWS1909_-_17_Star.jpeg",
    "19.jpg": "https://upload.wikimedia.org/wikipedia/commons/1/17/RWS1909_-_19_Sun.jpeg",
    "21.jpg": "https://upload.wikimedia.org/wikipedia/commons/f/ff/RWS1909_-_21_World.jpeg",
    "ace_p.jpg": "https://upload.wikimedia.org/wikipedia/commons/f/fd/RWS1909_-_Pentacles_01.jpeg",
    "king_p.jpg": "https://upload.wikimedia.org/wikipedia/commons/1/1a/RWS1909_-_Pentacles_14.jpeg"
}

print("Starting Final Tarot Download (No Emojis)...")
for filename, url in cards.items():
    filepath = os.path.join(tarot_dir, filename)
    download_image(url, filepath)
    time.sleep(1)

print("\n--- DONE ---")
all_files = [f for f in os.listdir(tarot_dir) if f.lower().endswith('.jpg')]
print(f"Total images found: {len(all_files)}")
print(f"Files: {all_files}")
