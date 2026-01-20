const btn = document.getElementById("reveal-btn");
    
    btn.addEventListener("click", () => {
      playSound("soundfx/click.mp3");
      playSound("soundfx/fairydust.mp3");
    
      for (let i = 0; i < 10; i++) {
        createRain();
        createRain2();
        createRain3();
        createRain4();
        name();
        cat();
        cat2();
      }
    });
    
    function playSound(src) {
      const sound = new Audio(src);
      sound.play();
    }
    
    function createRain() {
      const drop = document.createElement("div");
      drop.classList.add("rain");
      drop.textContent = "You are so cute 😍";
    
      drop.style.left = Math.random() * window.innerWidth + "px";
      drop.style.animationDuration = Math.random() * 4 + 4 + "s";
    
      document.body.appendChild(drop);
    
      setTimeout(() => drop.remove(), 6000);
    }
     
    function createRain2() {
      const drop = document.createElement("div");
      drop.classList.add("rain");
      drop.textContent = "I miss you so much 🥰";
    
      drop.style.left = Math.random() * window.innerWidth + "px";
      drop.style.animationDuration = Math.random() * 3 + 3 + "s";
    
      document.body.appendChild(drop);
    
      setTimeout(() => drop.remove(), 5000);
    }
    function createRain3() {
      const drop = document.createElement("div");
      drop.classList.add("rain");
      drop.textContent = "Will you be my cute little cat? 💖";
    
      drop.style.left = Math.random() * window.innerWidth + "px";
      drop.style.animationDuration = Math.random() * 2 + 2 + "s";
    
      document.body.appendChild(drop);
    
      setTimeout(() => drop.remove(), 4000);
    }
    function createRain4() {
      const drop = document.createElement("div");
      drop.classList.add("rain");
      drop.textContent = "I really like cats (u) 💖";
    
      drop.style.left = Math.random() * window.innerWidth + "px";
      drop.style.animationDuration = Math.random() * 2 + 2 + "s";
    
      document.body.appendChild(drop);
    
      setTimeout(() => drop.remove(), 4000);
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
    
    function cat() {
      const drop = document.createElement("div");
      drop.classList.add("rain");
    
      // Create the cat image
      const img = document.createElement("img");
      img.src = "img/cat1.jpg"; // <-- replace with your cat image path
      img.style.width = "250px"; // size of the cat
      img.style.height = "250px";
      img.style.objectFit = "cover";
    
      drop.appendChild(img);
    
      // Position randomly horizontally
      drop.style.position = "fixed";
      drop.style.top = "-50px";
      drop.style.left = Math.random() * window.innerWidth + "px";
    
      // Animation duration
      drop.style.animation = `fall ${Math.random() * 1 + 1}s linear forwards`;
    
      document.body.appendChild(drop);
    
      // Remove after animation
      setTimeout(() => drop.remove(), 8000);
    }

    function cat2() {
      const drop = document.createElement("div");
      drop.classList.add("rain");
    
      // Create the cat image
      const img = document.createElement("img");
      img.src = "img/cat2.jpg"; // <-- replace with your cat image path
      img.style.width = "250px"; // size of the cat
      img.style.height = "250px";
      img.style.objectFit = "cover";
    
      drop.appendChild(img);
    
      // Position randomly horizontally
      drop.style.position = "fixed";
      drop.style.top = "-50px";
      drop.style.left = Math.random() * window.innerWidth + "px";
    
      // Animation duration
      drop.style.animation = `fall ${Math.random() * 1 + 1}s linear forwards`;
    
      document.body.appendChild(drop);
    
      // Remove after animation
      setTimeout(() => drop.remove(), 8000);
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

    
    
    

        