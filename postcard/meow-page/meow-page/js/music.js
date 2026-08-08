
// =========================================================
// Meow Page — Floating Music Player
// =========================================================

function initMusicPlayer() {
  const floatingMusic = document.getElementById("floatingMusic");
  const musicBubble = document.getElementById("musicBubble");
  const musicCard = document.getElementById("musicCard");
  const dragHandle = document.getElementById("musicDragHandle");

  const audio = document.getElementById("meowMusic");
  const playBtn = document.getElementById("musicPlayBtn");
  const progress = document.getElementById("musicProgress");
  const currentTimeEl = document.getElementById("musicCurrentTime");
  const durationEl = document.getElementById("musicDuration");
  const volumeBtn = document.getElementById("musicVolumeBtn");
  const minimizeBtn = document.getElementById("musicMinimize");

  if (
    !floatingMusic ||
    !musicBubble ||
    !musicCard ||
    !dragHandle ||
    !audio ||
    !playBtn ||
    !progress ||
    !currentTimeEl ||
    !durationEl ||
    !volumeBtn ||
    !minimizeBtn
  ) {
    return;
  }

  // =======================================================
  // TIME
  // =======================================================

  function formatTime(seconds) {
    if (!Number.isFinite(seconds)) {
      return "0:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    return `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;
  }

  // =======================================================
  // PLAY / PAUSE
  // =======================================================

  function updatePlayButton() {
    if (audio.paused) {
      playBtn.textContent = "▶";
      playBtn.setAttribute("aria-label", "Play music");
      floatingMusic.classList.remove("playing");
    } else {
      playBtn.textContent = "❚❚";
      playBtn.setAttribute("aria-label", "Pause music");
      floatingMusic.classList.add("playing");
    }
  }

  playBtn.addEventListener("click", (event) => {
    event.stopPropagation();

    if (audio.paused) {
      audio.play().catch((error) => {
        console.error(
          "Meow Page: could not play music",
          error
        );
      });
    } else {
      audio.pause();
    }
  });

  // =======================================================
  // DEFAULT PLAYER POSITION
  // =======================================================

  function resetPlayerPosition() {
    // Remove any dragged position.
    floatingMusic.style.left = "";
    floatingMusic.style.top = "";

    // Let CSS control the default position.
    floatingMusic.style.right = "";
    floatingMusic.style.bottom = "";
  }

  // =======================================================
  // COLLAPSE / EXPAND
  // =======================================================

  function collapsePlayer() {
    // Reset the player position BEFORE collapsing.
    // This guarantees that the next opening starts
    // from the default bottom-right location.
    resetPlayerPosition();

    floatingMusic.classList.add("collapsed");

    musicBubble.setAttribute(
      "aria-label",
      "Open music player"
    );
  }

  function expandPlayer() {
    // Always reset before opening.
    // No saved position is restored.
    resetPlayerPosition();

    floatingMusic.classList.remove("collapsed");

    musicBubble.setAttribute(
      "aria-label",
      "Close music player"
    );
  }

  // =======================================================
  // MUSIC BUBBLE
  // =======================================================

  musicBubble.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();

    expandPlayer();
  });

  // =======================================================
  // X / MINIMIZE BUTTON
  // =======================================================

  // Prevent the X from triggering drag on mobile.
  minimizeBtn.addEventListener("pointerdown", (event) => {
    event.stopPropagation();
  });

  minimizeBtn.addEventListener("touchstart", (event) => {
    event.stopPropagation();
  }, { passive: true });

  minimizeBtn.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();

    collapsePlayer();
  });

  // =======================================================
  // PROGRESS
  // =======================================================

  audio.addEventListener("loadedmetadata", () => {
    durationEl.textContent =
      formatTime(audio.duration);
  });

  audio.addEventListener("timeupdate", () => {
    if (!audio.duration) {
      return;
    }

    const percentage =
      (audio.currentTime / audio.duration) * 100;

    progress.value = percentage;

    currentTimeEl.textContent =
      formatTime(audio.currentTime);
  });

  progress.addEventListener("input", (event) => {
    event.stopPropagation();

    if (!audio.duration) {
      return;
    }

    audio.currentTime =
      (Number(progress.value) / 100) *
      audio.duration;
  });

  // =======================================================
  // VOLUME
  // =======================================================

  volumeBtn.addEventListener("click", (event) => {
    event.stopPropagation();

    audio.muted = !audio.muted;

    volumeBtn.textContent =
      audio.muted ? "🔇" : "🔊";

    volumeBtn.setAttribute(
      "aria-label",
      audio.muted
        ? "Unmute music"
        : "Mute music"
    );
  });

  // =======================================================
  // AUDIO STATE
  // =======================================================

  audio.addEventListener("play", updatePlayButton);
  audio.addEventListener("pause", updatePlayButton);

  audio.addEventListener("ended", () => {
    progress.value = 0;

    currentTimeEl.textContent = "0:00";

    updatePlayButton();
  });

  // =======================================================
  // DRAGGING
  // =======================================================

  let isDragging = false;

  let startX = 0;
  let startY = 0;

  let startLeft = 0;
  let startTop = 0;

  function isInteractiveElement(target) {
    return target.closest(
      "button, input, a"
    );
  }

  function startDrag(event) {
    // Do not drag while collapsed.
    if (
      floatingMusic.classList.contains("collapsed")
    ) {
      return;
    }

    // Do not drag buttons or inputs.
    if (isInteractiveElement(event.target)) {
      return;
    }

    // Mouse: only left click.
    if (
      event.type === "mousedown" &&
      event.button !== 0
    ) {
      return;
    }

    const point =
      event.touches
        ? event.touches[0]
        : event;

    const rect =
      floatingMusic.getBoundingClientRect();

    startX = point.clientX;
    startY = point.clientY;

    startLeft = rect.left;
    startTop = rect.top;

    isDragging = true;

    // Convert CSS right/bottom positioning
    // into left/top while dragging.
    floatingMusic.style.left =
      `${startLeft}px`;

    floatingMusic.style.top =
      `${startTop}px`;

    floatingMusic.style.right = "auto";
    floatingMusic.style.bottom = "auto";

    document.body.style.userSelect = "none";

    event.preventDefault();
  }

  function drag(event) {
    if (!isDragging) {
      return;
    }

    const point =
      event.touches
        ? event.touches[0]
        : event;

    const deltaX =
      point.clientX - startX;

    const deltaY =
      point.clientY - startY;

    const playerWidth =
      floatingMusic.offsetWidth;

    const playerHeight =
      floatingMusic.offsetHeight;

    const padding = 8;

    const maxLeft = Math.max(
      padding,
      window.innerWidth -
        playerWidth -
        padding
    );

    const maxTop = Math.max(
      padding,
      window.innerHeight -
        playerHeight -
        padding
    );

    const newLeft = Math.min(
      Math.max(
        padding,
        startLeft + deltaX
      ),
      maxLeft
    );

    const newTop = Math.min(
      Math.max(
        padding,
        startTop + deltaY
      ),
      maxTop
    );

    floatingMusic.style.left =
      `${newLeft}px`;

    floatingMusic.style.top =
      `${newTop}px`;

    event.preventDefault();
  }

  function stopDrag() {
    if (!isDragging) {
      return;
    }

    isDragging = false;

    document.body.style.userSelect = "";
  }

  // -------------------------------------------------------
  // Mouse
  // -------------------------------------------------------

  dragHandle.addEventListener(
    "mousedown",
    startDrag
  );

  document.addEventListener(
    "mousemove",
    drag
  );

  document.addEventListener(
    "mouseup",
    stopDrag
  );

  // -------------------------------------------------------
  // Touch
  // -------------------------------------------------------

  dragHandle.addEventListener(
    "touchstart",
    startDrag,
    { passive: false }
  );

  document.addEventListener(
    "touchmove",
    drag,
    { passive: false }
  );

  document.addEventListener(
    "touchend",
    stopDrag
  );

  document.addEventListener(
    "touchcancel",
    stopDrag
  );

  // =======================================================
  // INITIAL STATE
  // =======================================================

  // Start collapsed.
  floatingMusic.classList.add("collapsed");

  // Always start at CSS bottom-right.
  resetPlayerPosition();

  updatePlayButton();
}

document.addEventListener(
  "DOMContentLoaded",
  initMusicPlayer
);

