// Postcard state + live preview wiring (Phase 2 & 6D Accessibility)

const postcardData = {
  recipient: "",
  message: "Hello!",
  sender: "",
  cat: "🐱",
  stampImage: "",
};

function initStampImageUpload() {
  const stampInput = document.getElementById("stampImageInput");
  const removeStampBtn = document.getElementById("removeStampImage");

  const stampBox = document.getElementById("postcardStampBox");
  const stampImage = document.getElementById("postcardStampImage");

  const previewBox = document.getElementById("stampUploadPreview");
  const previewImage = document.getElementById("stampPreviewImage");

  if (
    !stampInput ||
    !removeStampBtn ||
    !stampBox ||
    !stampImage ||
    !previewBox ||
    !previewImage
  ) {
    return;
  }

  stampInput.addEventListener("change", () => {
    const file = stampInput.files[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please choose an image file.");
      stampInput.value = "";
      return;
    }

    const reader = new FileReader();

    reader.onload = (event) => {
      const imageData = event.target.result;

      // Store the actual image data so it can be included
      // in the shareable postcard link.
      postcardData.stampImage = imageData;

      // Show image on postcard
      stampImage.src = imageData;
      stampBox.classList.add("has-image");

      // Show image in editor preview
      previewImage.src = imageData;
      previewBox.classList.add("has-image");
    };

    reader.readAsDataURL(file);
  });

  removeStampBtn.addEventListener("click", () => {
    postcardData.stampImage = "";

    // Reset postcard stamp
    stampImage.src = "";
    stampBox.classList.remove("has-image");

    // Reset editor preview
    previewImage.src = "";
    previewBox.classList.remove("has-image");

    // Reset file input
    stampInput.value = "";
  });
}

function updatePostcardPreview() {
  const catEl = document.getElementById("postcardCat");
  const toEl = document.getElementById("postcardTo");
  const messageEl = document.getElementById("postcardMessage");
  const fromEl = document.getElementById("postcardFrom");

  if (!catEl) return; // not on this page

  catEl.textContent = postcardData.cat;
  toEl.textContent = postcardData.recipient;
  messageEl.textContent = postcardData.message || "Hello!";
  fromEl.textContent = postcardData.sender;
}

function initPostcardEditor() {
  const recipientInput = document.getElementById("recipientInput");
  const messageInput = document.getElementById("messageInput");
  const senderInput = document.getElementById("senderInput");
  const catOptions = document.querySelectorAll(".cat-option");

  if (!recipientInput) return; // not on the create page

  recipientInput.addEventListener("input", () => {
    postcardData.recipient = recipientInput.value;
    updatePostcardPreview();
  });

  messageInput.addEventListener("input", () => {
    postcardData.message = messageInput.value;
    updatePostcardPreview();
  });

  senderInput.addEventListener("input", () => {
    postcardData.sender = senderInput.value;
    updatePostcardPreview();
  });

  catOptions.forEach((btn) => {
    btn.addEventListener("click", () => {
      postcardData.cat = btn.dataset.cat;

      catOptions.forEach((b) => b.classList.remove("selected"));
      btn.classList.add("selected");

      updatePostcardPreview();
    });

    btn.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        btn.click();
      }
    });
  });

  // Mark the default cat as selected on load
  catOptions[0].classList.add("selected");

  updatePostcardPreview();
  initPostcardFlip();
  initCatReaction();
  initStampImageUpload();
}

function initPostcardFlip() {
  const postcard = document.getElementById("postcard");
  if (!postcard) return;

  const toggleFlip = () => {
    postcard.classList.toggle("flipped");
  };

  postcard.addEventListener("click", toggleFlip);

  postcard.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggleFlip();
    }
  });
}

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
  audio.play();
}

function initCatReaction() {
  const postcardCat = document.getElementById("postcardCat");
  if (!postcardCat) return;

  const triggerBounce = (event) => {
    event.stopPropagation();

    // Play random cat sound
    playRandomCatSound();

    // Restart bounce animation
    postcardCat.classList.remove("bounce");

    // Restart the animation even if clicked rapidly
    void postcardCat.offsetWidth;

    postcardCat.classList.add("bounce");
  };

  postcardCat.addEventListener("click", triggerBounce);

  postcardCat.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      triggerBounce(e);
    }
  });

  postcardCat.addEventListener("animationend", () => {
    postcardCat.classList.remove("bounce");
  });
}

document.addEventListener("DOMContentLoaded", initPostcardEditor);

// ill make the cat when clicked a cat sound will trigger
