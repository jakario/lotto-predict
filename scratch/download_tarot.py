import os
import requests

def download_image(url, filename):
    try:
        headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'}
        response = requests.get(url, stream=True, headers=headers, timeout=10)
        if response.status_code == 200:
            with open(filename, 'wb') as f:
                for chunk in response.iter_content(1024):
                    f.write(chunk)
            print(f"Downloaded: {filename}")
        else:
            print(f"Failed to download {filename}: {response.status_code}")
    except Exception as e:
        print(f"Error downloading {filename}: {e}")

# Base path
tarot_dir = r"d:\autopost\personal-agent\lotto-predict\public\tarot"

# List of cards to download
cards = {
    "19.jpg": "https://upload.wikimedia.org/wikipedia/commons/9/94/RWS_Tarot_19_Sun.jpg",
    "10.jpg": "https://upload.wikimedia.org/wikipedia/commons/3/3c/RWS_Tarot_10_Wheel_of_Fortune.jpg",
    "3.jpg": "https://upload.wikimedia.org/wikipedia/commons/d/d2/RWS_Tarot_03_Empress.jpg",
    "1.jpg": "https://upload.wikimedia.org/wikipedia/commons/d/de/RWS_Tarot_01_Magician.jpg",
    "21.jpg": "https://upload.wikimedia.org/wikipedia/commons/f/ff/RWS_Tarot_21_World.jpg",
    "17.jpg": "https://upload.wikimedia.org/wikipedia/commons/d/db/RWS_Tarot_17_Star.jpg",
    "ace_p.jpg": "https://upload.wikimedia.org/wikipedia/commons/f/fd/Pents01.jpg",
    "king_p.jpg": "https://upload.wikimedia.org/wikipedia/commons/1/1c/Pents14.jpg"
}

print("Starting Tarot Image Download...")
for filename, url in cards.items():
    filepath = os.path.join(tarot_dir, filename)
    download_image(url, filepath)

print("Download complete!")
