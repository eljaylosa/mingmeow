// Postcard state + live preview wiring (Phase 2 & 6D Accessibility)

const postcardData = {
  recipient: "",
  message: "Hello!",
  sender: "",
  cat: "🐱",

  // Local browser preview URL
  stampImage: "",

  // Actual File object for Supabase
  stampFile: null,
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

    // Keep the local preview.
    if (postcardData.stampImage) {
      URL.revokeObjectURL(postcardData.stampImage);
    }

    const imageURL = URL.createObjectURL(file);

    postcardData.stampImage = imageURL;

    // Keep the actual File for Supabase upload.
    postcardData.stampFile = file;

    // Postcard preview
    stampImage.src = imageURL;
    stampBox.classList.add("has-image");

    // Editor preview
    previewImage.src = imageURL;
    previewBox.classList.add("has-image");
  });

  removeStampBtn.addEventListener("click", () => {
    if (postcardData.stampImage) {
      URL.revokeObjectURL(postcardData.stampImage);
    }

    postcardData.stampImage = null;
    postcardData.stampFile = null;

    stampImage.src = "";
    stampBox.classList.remove("has-image");

    previewImage.src = "";
    previewBox.classList.remove("has-image");

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

async function savePostcardToSupabase() {
  const postcardId = crypto.randomUUID().replace(/-/g, "").slice(0, 8);

  let stampImageUrl = null;

  // ----------------------------------------
  // Upload stamp image if one exists
  // ----------------------------------------

  if (postcardData.stampFile) {
    const file = postcardData.stampFile;

    const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";

    const filePath = `${postcardId}.${extension}`;

    const { error: uploadError } = await supabaseClient.storage
      .from("postcard-images")
      .upload(filePath, file, {
        contentType: file.type,
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      console.error("Supabase image upload failed:", uploadError);
      throw uploadError;
    }

    const { data: publicUrlData } = supabaseClient.storage
      .from("postcard-images")
      .getPublicUrl(filePath);

    stampImageUrl = publicUrlData.publicUrl;
  }

  // ----------------------------------------
  // Save postcard data
  // ----------------------------------------

  const { data, error } = await supabaseClient
    .from("postcards")
    .insert({
      id: postcardId,
      recipient: postcardData.recipient || "",
      message: postcardData.message || "Hello!",
      sender: postcardData.sender || "",
      cat: postcardData.cat || "🐱",
      stamp_image: stampImageUrl,
    })
    .select()
    .single();

  if (error) {
    console.error("Supabase postcard save failed:", error);
    throw error;
  }

  return data;
}

document.addEventListener("DOMContentLoaded", initPostcardEditor);

// ill make the cat when clicked a cat sound will trigger
