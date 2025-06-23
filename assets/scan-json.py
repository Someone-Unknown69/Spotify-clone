import os
import json

current_dir = os.path.dirname(__file__)
print(current_dir)
ASSETS_DIR = "songs"
OUTPUT_FILE = "songs.json"

def scan_and_save():
    # Scan for .mp3 files
    try:
        files = os.listdir(ASSETS_DIR)
        mp3_files = [
            f"/songs/{file}"
            for file in files
            if file.lower().endswith(".mp3")
        ]

        # Save to local songs.json
        with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
            json.dump(mp3_files, f, indent=2)
        
        print(f"Saved {len(mp3_files)} files to {OUTPUT_FILE}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    scan_and_save()
