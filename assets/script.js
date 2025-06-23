import { loadSongs } from "./Album-image-module.js";
async function getSongs() {
  let a = await fetch("http://127.0.0.1:3000/songs/");
  let response = await a.text();

  let div = document.createElement("div");
  div.innerHTML = response;

  let as = div.getElementsByTagName("a");
  let songs = [];

  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href);
    }
  }
  return songs;
}


async function main() {
  // Function to format time
  function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  }

  // Next and prev function
  function next_prev(cond){
    current_song_idx = (current_song_idx + cond + songs.length) % songs.length;
    audio.src = songs[current_song_idx];
    audio.play();
    GetInfo(document.querySelectorAll(".Card")[current_song_idx]);
  }

  function toggle_play(){
  if (mediaBtn.classList.contains("Media-controls-play")) {
      mediaBtn.classList.remove("Media-controls-play");
      mediaBtn.classList.add("Media-controls-pause");
      audio.play();  
    } else {
      mediaBtn.classList.remove("Media-controls-pause");
      mediaBtn.classList.add("Media-controls-play");
      audio.pause();  
    }
  }

  // Function get's info of song from it's card
  function GetInfo(Card) {
    const song_title = document.getElementById("Now-playing-title");
    const song_artist = document.getElementById("Now-playing-artist");
    const song_img = document.getElementById("Now-playing-img");

    let temp = Card.querySelector(".albumDisplay");
    let style = getComputedStyle(temp);
    const bg = style.backgroundImage;

    song_img.style.backgroundImage = bg;
    
    temp = Card.querySelectorAll("div > span");

    song_title.innerHTML = temp[0].innerHTML;
    song_artist.innerHTML = temp[1].innerHTML;
    
    audio.addEventListener('loadedmetadata', () => {
      document.querySelector(".Total-Duration").innerHTML = formatTime(audio.duration);
    });

  }
  
  let songs = await getSongs();
  await loadSongs(songs);

  let current_song_idx = NaN;
  const audio = new Audio(songs[current_song_idx]);
  audio.volume = 0.5;


  // Selecting song from library
  document.querySelectorAll(".Card").forEach((Card,index) => {
    Card.addEventListener("click", ()=>{
     console.log(`Clicked ${index}`);
     current_song_idx = index;
     audio.src = songs[current_song_idx];
     audio.play();

     if(mediaBtn.classList.contains("Media-controls-play")){
      mediaBtn.classList.remove("Media-controls-play");
      mediaBtn.classList.add("Media-controls-pause");
     }

     GetInfo(Card)
    })
  });


  // Play and pause
  const mediaBtn = document.getElementById("media-btn");

  mediaBtn.addEventListener("click", () => {
    toggle_play();
  });
  // Next song 
  const nextBtn = document.querySelector(".Media-controls-next");
  nextBtn.addEventListener("click", () => {
    next_prev(1);
    if (mediaBtn.classList.contains("Media-controls-play")) {
      mediaBtn.classList.remove("Media-controls-play");
      mediaBtn.classList.add("Media-controls-pause");
    }
  })
  // Prev song 
  const prevBtn = document.querySelector(".Media-controls-prev");
  prevBtn.addEventListener("click", () => {
    next_prev(-1);
    if (mediaBtn.classList.contains("Media-controls-play")) {
      mediaBtn.classList.remove("Media-controls-play");
      mediaBtn.classList.add("Media-controls-pause");
    }
  })


  // Music and all toggle
  document.querySelectorAll(".toggle-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      // Remove selected class from all
      document.querySelectorAll(".toggle-btn").forEach((el) => {
        el.classList.remove("selected");
        el.classList.add("not-selected");
      });
      
      // Add selected to the clicked one
      btn.classList.remove("not-selected");
      btn.classList.add("selected");
    });
  });

  const currentTimeSpan = document.querySelector(".Duration");

  // Update current time as the audio plays and the duration bar
  audio.addEventListener('timeupdate', () => {
    currentTimeSpan.innerHTML = formatTime(audio.currentTime);

    document.getElementById("Seekbar").style.width = `${(audio.currentTime/audio.duration) * 100}%`

    if (audio.duration == audio.currentTime) {
      next_prev(1);
    }

  });

  // Add an event listner to seekbar
  document.querySelector(".Duration-bar").addEventListener("click", (e)=>{
    let durBar = document.querySelector(".Duration-bar");
    let Rect = durBar.getBoundingClientRect();

    const offsetX = e.clientX - Rect.left;
    audio.currentTime = audio.duration * (offsetX / Rect.width);
  });
  
  // Add event listner to volume bar
  document.querySelector(".volume-bar").addEventListener("click", (e)=>{
    let volBar = document.querySelector(".volume-bar");
    let volSeek = document.getElementById("volume-seek");
    let Rect = volBar.getBoundingClientRect();

    const offsetX = e.clientX - Rect.left; // relative to .volume-bar
    let volume = (offsetX / Rect.width);
    volume = Math.min(1, Math.max(0, volume));

    volSeek.style.width = `${volume * 100}%`;

    audio.volume = volume;

  });

  // Add event listner for hamburger
  document.querySelector(".hamburger").addEventListener("click", () => {
  const library = document.querySelector(".library");

  // Toggle logic
    if (library.style.left === '0%' || library.style.left === '0px') {
      library.style.left = '-100%';
    } else {
      library.style.left = '0%';
    }
  });
} 

main();

