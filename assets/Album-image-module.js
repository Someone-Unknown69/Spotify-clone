// Dynamically import the music-metadata ES module
const { parseBlob } = await import(
  "https://cdn.jsdelivr.net/npm/music-metadata@11.0.0/+esm"
);

function truncateText(text, maxLength = 40) {
  if (!text) return "Unknown";
  if (text.length <= maxLength) return text;

  const lastSpace = text.lastIndexOf(" ", maxLength);
  const cutPoint = lastSpace > 0 ? lastSpace : maxLength;

  return text.slice(0, cutPoint).trim() + "…";
}

export async function loadSongs(songs) {
  try {
    const container = document.querySelector(".Card-container");

    for (const song of songs) {
      try {
        const response = await fetch(song);
        if (!response.ok) throw new Error("MP3 file not found or blocked.");

        const blob = await response.blob();
        const { common } = await parseBlob(blob);

        const card = document.createElement("div");
        card.classList.add("Card");

        const album_art = document.createElement("div");
        album_art.classList.add("albumDisplay");
        card.append(album_art);

        const titleSpan = document.createElement("span");
        titleSpan.innerHTML = truncateText(common.title);
        const song_info = document.createElement("div")
        song_info.append(titleSpan);
        // card.append(titleSpan);

        const artistSpan = document.createElement("span");
        artistSpan.innerHTML = truncateText(common.artist);
        song_info.append(artistSpan);
        card.append(song_info);
        container.append(card);

        // Only use the FIRST image (avoid looping if not needed)
        if (common.picture?.[0]) {
          const pic = common.picture[0];
          const base64 = arrayBufferToBase64(pic.data);
          album_art.style.backgroundImage = `url(data:${pic.format};base64,${base64})`;
        } else {
          album_art.innerHTML = "<p>No album art</p>";
        }

      } catch (err) {
        console.error("Song error:", err);
      }
    }
  } catch (err) {
    console.error("Loading songs.json failed:", err);
  }
}

// Helper to convert ArrayBuffer to base64 safely
function arrayBufferToBase64(buffer) {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.length;

  // Avoid giant arguments in String.fromCharCode
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }

  return btoa(binary);
}
