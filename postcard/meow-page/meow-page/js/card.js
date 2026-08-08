function decodePostcardData() {
  const hash = window.location.hash.substring(1);

  if (!hash) {
    console.warn("Meow Page: no postcard data found");
    return null;
  }

  try {
    // Base64 → UTF-8 → JSON
    const binary = atob(hash);

    const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));

    const json = new TextDecoder().decode(bytes);

    return JSON.parse(json);
  } catch (err) {
    console.error("Meow Page: invalid postcard link", err);
    return null;
  }
}

function loadSharedPostcard() {
  const data = decodePostcardData();

  if (!data) return;

  const catEl = document.getElementById("postcardCat");
  const messageEl = document.getElementById("postcardMessage");
  const toEl = document.getElementById("postcardTo");
  const fromEl = document.getElementById("postcardFrom");

  if (catEl) {
    catEl.textContent = data.cat || "🐱";
  }

  if (messageEl) {
    messageEl.textContent = data.message || "Hello!";
  }

  if (toEl) {
    toEl.textContent = data.recipient || "";
  }

  if (fromEl) {
    fromEl.textContent = data.sender || "";
  }
}

/* ---------- Card flip ---------- */

function initCardFlip() {
  const postcard = document.getElementById("postcard");
  const flipBtn = document.getElementById("flipBtn");

  if (!postcard) return;

  const toggleFlip = () => {
    postcard.classList.toggle("flipped");
  };

  // Clicking the postcard itself
  postcard.addEventListener("click", (event) => {
    // Don't flip when clicking the cat
    if (event.target.closest(".postcard-cat")) return;

    toggleFlip();
  });

  // FLIP button
  if (flipBtn) {
    flipBtn.addEventListener("click", (event) => {
      event.stopPropagation();
      toggleFlip();
    });
  }

  // Keyboard accessibility
  postcard.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      toggleFlip();
    }
  });
}

/* ---------- Cat reaction ---------- */

function initCardCatReaction() {
  const cat = document.getElementById("postcardCat");

  if (!cat) return;

  const bounce = (event) => {
    event.stopPropagation();

    cat.classList.remove("bounce");

    // Restart animation
    void cat.offsetWidth;

    cat.classList.add("bounce");
  };

  cat.addEventListener("click", bounce);

  cat.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      bounce(event);
    }
  });

  cat.addEventListener("animationend", () => {
    cat.classList.remove("bounce");
  });
}

/* ---------- Initialize ---------- */

document.addEventListener("DOMContentLoaded", () => {
  loadSharedPostcard();
  initCardFlip();
  initCardCatReaction();
});
