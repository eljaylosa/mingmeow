// function decodePostcardData() {
//   const hash = window.location.hash.substring(1);

//   if (!hash) {
//     console.warn("Meow Page: no postcard data found");
//     return null;
//   }

//   try {
//     // Base64 → UTF-8 → JSON
//     const binary = atob(hash);

//     const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));

//     const json = new TextDecoder().decode(bytes);

//     return JSON.parse(json);
//   } catch (err) {
//     console.error("Meow Page: invalid postcard link", err);
//     return null;
//   }
// }

// function loadSharedPostcard() {
//   const data = decodePostcardData();

//   if (!data) return;

//   const catEl = document.getElementById("postcardCat");
//   const messageEl = document.getElementById("postcardMessage");
//   const toEl = document.getElementById("postcardTo");
//   const fromEl = document.getElementById("postcardFrom");

//   const stampBox = document.getElementById("postcardStampBox");
//   const stampImage = document.getElementById("postcardStampImage");

//   if (catEl) {
//     catEl.textContent = data.cat || "🐱";
//   }

//   if (messageEl) {
//     messageEl.textContent = data.message || "Hello!";
//   }

//   if (toEl) {
//     toEl.textContent = data.recipient || "";
//   }

//   if (fromEl) {
//     fromEl.textContent = data.sender || "";
//   }

//   // Load uploaded stamp image
//   if (stampImage && stampBox && data.stampImage) {
//     stampImage.src = data.stampImage;
//     stampBox.classList.add("has-image");
//   }
// }

// /* ---------- Card flip ---------- */

// function initCardFlip() {
//   const postcard = document.getElementById("postcard");
//   const flipBtn = document.getElementById("flipBtn");

//   if (!postcard) return;

//   const toggleFlip = () => {
//     postcard.classList.toggle("flipped");
//   };

//   // Clicking the postcard itself
//   postcard.addEventListener("click", (event) => {
//     // Don't flip when clicking the cat
//     if (event.target.closest(".postcard-cat")) return;

//     toggleFlip();
//   });

//   // FLIP button
//   if (flipBtn) {
//     flipBtn.addEventListener("click", (event) => {
//       event.stopPropagation();
//       toggleFlip();
//     });
//   }

//   // Keyboard accessibility
//   postcard.addEventListener("keydown", (event) => {
//     if (event.key === "Enter" || event.key === " ") {
//       event.preventDefault();
//       toggleFlip();
//     }
//   });
// }

// /* ---------- Cat reaction ---------- */

// const catSound = [
//   "assets/sounds/meow1.mp3",
//   "assets/sounds/meow2.mp3",
//   "assets/sounds/meow3.mp3",
//   "assets/sounds/meow4.mp3",
//   "assets/sounds/meow5.mp3",
//   "assets/sounds/meow6.mp3",
// ];

// function playRandomCatSound() {
//   const randomIndex = Math.floor(Math.random() * catSound.length);
//   const audio = new Audio(catSound[randomIndex]);

//   audio.play().catch((error) => {
//     console.warn("Meow Page: could not play cat sound", error);
//   });
// }

// function initCardCatReaction() {
//   const cat = document.getElementById("postcardCat");

//   if (!cat) return;

//   const bounce = (event) => {
//     event.stopPropagation();

//     // Play random cat sound
//     playRandomCatSound();

//     cat.classList.remove("bounce");

//     // Restart animation
//     void cat.offsetWidth;

//     cat.classList.add("bounce");
//   };

//   cat.addEventListener("click", bounce);

//   cat.addEventListener("keydown", (event) => {
//     if (event.key === "Enter" || event.key === " ") {
//       event.preventDefault();
//       bounce(event);
//     }
//   });

//   cat.addEventListener("animationend", () => {
//     cat.classList.remove("bounce");
//   });
// }

// /* ---------- Initialize ---------- */

// document.addEventListener("DOMContentLoaded", () => {
//   loadSharedPostcard();
//   initCardFlip();
//   initCardCatReaction();
// });

// ----------------------------------------
// Load shared postcard from Supabase
// ----------------------------------------

async function loadSharedPostcard() {
  const params = new URLSearchParams(window.location.search);
  const postcardId = params.get("id");

  if (!postcardId) {
    console.warn("Meow Page: no postcard ID found");
    return;
  }

  try {
    const { data, error } = await supabaseClient
      .from("postcards")
      .select("*")
      .eq("id", postcardId)
      .single();

    if (error) {
      console.error("Meow Page: could not load postcard", error);
      return;
    }

    if (!data) {
      console.warn("Meow Page: postcard not found");
      return;
    }

    const postcard = document.getElementById("postcard");

    if (postcard && data.theme) {
      postcard.className = postcard.className
        .replace(/\btheme-[\w-]+\b/g, "")
        .trim();

      postcard.classList.add(`theme-${data.theme}`);
    }

    const catEl = document.getElementById("postcardCat");
    const messageEl = document.getElementById("postcardMessage");
    const toEl = document.getElementById("postcardTo");
    const fromEl = document.getElementById("postcardFrom");

    const stampBox = document.getElementById("postcardStampBox");

    const stampImage = document.getElementById("postcardStampImage");

    // Cat
    if (catEl) {
      catEl.textContent = data.cat || "🐱";
    }

    // Message
    if (messageEl) {
      messageEl.textContent = data.message || "Hello!";
    }

    // Recipient
    if (toEl) {
      toEl.textContent = data.recipient || "";
    }

    // Sender
    if (fromEl) {
      fromEl.textContent = data.sender || "";
    }

    // Stamp image
    if (stampBox && stampImage) {
      if (data.stamp_image) {
        stampImage.src = data.stamp_image;
        stampBox.classList.add("has-image");
      } else {
        stampImage.src = "";
        stampBox.classList.remove("has-image");
      }
    }
  } catch (err) {
    console.error("Meow Page: unexpected error loading postcard", err);
  }
}

// ----------------------------------------
// Card flip
// ----------------------------------------

function initCardFlip() {
  const postcard = document.getElementById("postcard");
  const flipBtn = document.getElementById("flipBtn");

  if (!postcard) return;

  const toggleFlip = () => {
    postcard.classList.toggle("flipped");
  };

  postcard.addEventListener("click", (event) => {
    if (event.target.closest(".postcard-cat")) {
      return;
    }

    toggleFlip();
  });

  if (flipBtn) {
    flipBtn.addEventListener("click", (event) => {
      event.stopPropagation();
      toggleFlip();
    });
  }

  postcard.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      toggleFlip();
    }
  });
}

// ----------------------------------------
// Cat reaction
// ----------------------------------------

const catSound = [
  "assets/sounds/meow1.mp3",
  "assets/sounds/meow2.mp3",
  "assets/sounds/meow3.mp3",
  "assets/sounds/meow4.mp3",
  "assets/sounds/meow5.mp3",
  "assets/sounds/meow6.mp3",
];

function playRandomCatSound() {
  const randomIndex = Math.floor(Math.random() * catSound.length);

  const audio = new Audio(catSound[randomIndex]);

  audio.play().catch((err) => {
    console.warn("Meow sound could not play:", err);
  });
}

function initCardCatReaction() {
  const cat = document.getElementById("postcardCat");

  if (!cat) return;

  const bounce = (event) => {
    event.stopPropagation();

    playRandomCatSound();

    cat.classList.remove("bounce");

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

// ----------------------------------------
// Initialize
// ----------------------------------------

document.addEventListener("DOMContentLoaded", async () => {
  await loadSharedPostcard();

  initCardFlip();
  initCardCatReaction();
});
