const btn = document.getElementById("reveal-btn");
    
    btn.addEventListener("click", () => {
      playSound("soundfx/click.mp3");
      playSound("soundfx/fairydust.mp3");
    
      for (let i = 0; i < 1; i++) {
        createRain();
        name();
        cat();
      }
    });
    
    function playSound(src) {
      const sound = new Audio(src);
      sound.play();
    }

    const messages = [
      "You are so cute 😍",
      "Will you be my cute little Cat? 🐱",
      "I adore you! 🥰",
      "I miss you! 😘",
      "Your smile makes my day ☀️",
      "Valorant na kaya? 🎮",
      "Eto namimiss na naman ikaw! 💕",
      "Ah hihi hi hi hi! 😄",
      "Hala ang cute naman ng nag-kiclick! 🥺",
      "Dahan dahan lang pag click, mahuhulog ako sayu! 😳",
      "Cute naman ng mga click mo! 🥰",
      "Miss q na yung click nang click! 😘",
      "Sige click lang! Cute ka naman e 😍",
      "HAHAHAH! Ang cute mo mag click! 😄",
      "Click mo pa ako! 🥺",
      "Select a song for best experience! 🎵"
    ]
    
    function createRain() {
      const drop = document.createElement("div");
      drop.classList.add("rain");

      drop.style.fontSize = Math.random() * 20 + 15 + "px";
      drop.style.fontWeight = Math.random() > 0.5 ? "bold" : "normal";
      drop.style.color = `hsl(${Math.random() * 360}, 70%, 60%)`;
      drop.style.fontFamily= Math.random() > 0.5 ? "Comic Sans MS, cursive, sans-serif" : "Arial, sans-serif, Helvetica";
    
      drop.textContent = messages[Math.floor(Math.random() * messages.length)];
      drop.style.left = Math.random() * window.innerWidth + "px";
      drop.style.animationDuration = Math.random() * 5 + 5 + "s";
    
      document.body.appendChild(drop);
    
      setTimeout(() => drop.remove(), 10000);
    }
     
    function name() {
      const drop = document.createElement("div");
      drop.classList.add("rain");
      drop.textContent = "AJ💖";
    
      drop.style.left = Math.random() * window.innerWidth + "px";
      drop.style.animationDuration = Math.random() * 1 + 1 + "s";
    
      document.body.appendChild(drop);
    
      setTimeout(() => drop.remove(), 4000);
    }

    const catImages = [
      "img/cat1.jpg",
      "img/cat2.jpg",
      "img/cat3.jpg",
      "img/cat4.jpg"
    ];
    
    function cat() {
      const drop = document.createElement("div");
      drop.classList.add("rain");
    
      // create image element
      const img = document.createElement("img");
    
      // random cat image
      img.src = catImages[Math.floor(Math.random() * catImages.length)];
      img.style.width = "150px";
      img.style.height = "150x";
      img.style.objectFit = "cover";
      img.style.borderRadius = Math.random() > 0.5 ? "50%" : "10%"; 
    
      drop.appendChild(img);
    
      // position
      drop.style.position = "fixed";
      drop.style.top = "-260px";
      drop.style.left = Math.random() * (window.innerWidth - 250) + "px";
    
      // animation
      drop.style.animation = `fall ${Math.random() * 1 + 1}s linear forwards`;
    
      document.body.appendChild(drop);
    
      // cleanup
      setTimeout(() => drop.remove(), 5000);
    }

    // SONG FUNCTION 
    const showSong = document.getElementById("showSong");
    const songContainer = document.getElementById("songContainer");
    const closeSongs = document.getElementById("closeSongs");

    songContainer.style.display = "none"; // hide initially

    // Now Playing elements
    const currentTitle = document.getElementById("currentTitle");
    const currentArtist = document.getElementById("currentArtist");
    const record = document.querySelector(".record");

    // Toggle songs container
    showSong.addEventListener("click", () => {
      if (songContainer.style.display === "none") {
        songContainer.style.display = "flex";
      } else {
        songContainer.style.display = "none";
      }
    });

    // Close button
    closeSongs.addEventListener("click", () => {
      songContainer.style.display = "none";
    });

    // Song cards logic
    const songCards = document.querySelectorAll(".song-card");

    songCards.forEach(card => {
      const audio = card.querySelector(".audio-player");
      audio.src = card.dataset.src;
    
      const title = card.dataset.title;
      const artist = card.dataset.artist;
    
      card.addEventListener("click", (e) => {
        if (e.target.tagName === "AUDIO" || e.target.id === "closeSongs") return;
    
        // Pause other audios
        songCards.forEach(c => {
          if (c !== card) {
            const otherAudio = c.querySelector(".audio-player");
            otherAudio.pause();
          }
        });
    
        // Play/pause toggle
        if (audio.paused) {
          audio.play();
        } else {
          audio.pause();
        }
    
        // Update Now Playing text
        currentTitle.textContent = title;
        currentArtist.textContent = artist;
      });
    
      // Add event listeners for play/pause to control spinning
      audio.addEventListener("play", () => {
        record.classList.add("playing");
      });
    
      audio.addEventListener("pause", () => {
        record.classList.remove("playing");
      });
    
      audio.addEventListener("ended", () => {
        record.classList.remove("playing");
        currentTitle.textContent = "No song playing";
        currentArtist.textContent = "...";
      });
    });

    songCards.forEach(card => {
      const audio = card.querySelector(".audio-player");
      audio.src = card.dataset.src;
    
      const title = card.dataset.title;
      const artist = card.dataset.artist;
    
      const slider = card.querySelector(".slider");
      const playBtn = card.querySelector(".play-btn");
      const timeLabel = card.querySelector(".time");
      const player = card.querySelector(".custom-player");
    
      card.addEventListener("click", (e) => {
        if (e.target.tagName === "AUDIO" || e.target.classList.contains("slider") || e.target.id === "closeSongs") return;
    
        // Pause other audios and hide their custom players
        songCards.forEach(c => {
          const otherAudio = c.querySelector(".audio-player");
          const otherPlayer = c.querySelector(".custom-player");
          if (c !== card) {
            otherAudio.pause();
            otherPlayer.classList.remove("active");
          }
        });
    
        // Show this card's player
        player.classList.add("active");
    
        // Update Now Playing
        currentTitle.textContent = title;
        currentArtist.textContent = artist;
      });
    
      // Play/pause button
      playBtn.addEventListener("click", () => {
        if (audio.paused) audio.play();
        else audio.pause();
      });
    
      // Sync slider with audio
      audio.addEventListener("timeupdate", () => {
        slider.value = (audio.currentTime / audio.duration) * 100 || 0;
        const format = (s) => {
          const m = Math.floor(s / 60);
          const sec = Math.floor(s % 60);
          return `${m}:${sec < 10 ? "0" + sec : sec}`;
        };
        timeLabel.textContent = `${format(audio.currentTime)} / ${format(audio.duration) || "0:00"}`;
      });
    
      // Seek using slider
      slider.addEventListener("input", () => {
        audio.currentTime = (slider.value / 100) * audio.duration;
      });
    
      // Record animation control
      audio.addEventListener("play", () => record.classList.add("playing"));
      audio.addEventListener("pause", () => record.classList.remove("playing"));
      audio.addEventListener("ended", () => {
        record.classList.remove("playing");
        currentTitle.textContent = "No song playing";
        currentArtist.textContent = "...";
        player.classList.remove("active"); // hide player when song ends
      });
    });

    const searchInput = document.getElementById("searchInput");
    const dropdown = document.querySelector(".dropdownmenu");
    const filterLinks = document.querySelectorAll(".dropdown-content a");
    
    let currentFilter = "all";
    
    /* Toggle dropdown */
    document.querySelector(".dropbtn").addEventListener("click", () => {
      dropdown.classList.toggle("active");
    });
    
    /* Filter click */
    filterLinks.forEach(link => {
      link.addEventListener("click", e => {
        e.preventDefault();
        currentFilter = link.dataset.filter;
        dropdown.classList.remove("active");
        filterSongs();
      });
    });
    
    /* Search input */
    searchInput.addEventListener("input", filterSongs);
    
    function filterSongs() {
      const searchValue = searchInput.value.toLowerCase();
    
      songCards.forEach(card => {
        const title = card.dataset.title?.toLowerCase() || "";
        const artist = card.dataset.artist?.toLowerCase() || "";
        const type = card.dataset.type?.toLowerCase() || "";
    
        const matchesSearch =
          title.includes(searchValue) || artist.includes(searchValue);
    
        const matchesFilter =
          currentFilter === "all" || type === currentFilter;
    
        card.style.display =
          matchesSearch && matchesFilter ? "block" : "none";
      });
    }
    
    /* Close dropdown when clicking outside */
    document.addEventListener("click", e => {
      if (!dropdown.contains(e.target)) {
        dropdown.classList.remove("active");
      }
    });

    /* ================= BACKGROUND SLIDESHOW ================= */
const bgImages = document.querySelectorAll(".bg-image");
let currentBg = 0;

setInterval(() => {
  bgImages[currentBg].classList.remove("active");
  currentBg = (currentBg + 1) % bgImages.length;
  bgImages[currentBg].classList.add("active");
}, 6000);

/* ================= FLOATING HEARTS ================= */
setInterval(() => {
  const heart = document.createElement("div");
  heart.className = "heart";
  heart.textContent = ["💖", "💗", "💕", "💞"][Math.floor(Math.random() * 4)];
  heart.style.left = Math.random() * 100 + "vw";
  heart.style.animationDuration = Math.random() * 3 + 4 + "s";

  document.body.appendChild(heart);
  setTimeout(() => heart.remove(), 7000);
}, 800);

const RevealDetails = document.getElementById("detailsReveal");
const RevealBtn = document.getElementById("revealbtn");
const closeBtn = document.getElementById("btnClose");

RevealDetails.style.display = "none"; // hide initially

RevealBtn.addEventListener("click", () => {
  if (RevealDetails.style.display === "none") {
    RevealDetails.style.display = "block";
  } else {
    RevealDetails.style.display = "none";
  }
});

closeBtn.addEventListener("click", () => {
  RevealDetails.style.display = "none";
});

    
    
    

        