// Postcard download, copy, and share (Phase 5A / 5B / 5C)
// Facebook/Messenger/Instagram-specific behavior is added in a later phase.

function getVisiblePostcardFace() {
  const postcard = document.getElementById("postcard");
  if (!postcard) return null;

  const isFlipped = postcard.classList.contains("flipped");
  const selector = isFlipped ? ".postcard-back" : ".postcard-front";
  return postcard.querySelector(selector);
}

// Shared renderer used by both Download and Share, so they always produce
// the same image. Clones the currently visible face (stripping its 3D
// positioning), renders it off-screen at high resolution via html2canvas,
// and resolves with the resulting canvas.
function renderPostcardCanvas() {
  const postcard = document.getElementById("postcard");

  if (!postcard || typeof html2canvas === "undefined") {
    return Promise.reject(new Error("Postcard is not available to render"));
  }

  const faceEl = getVisiblePostcardFace();

  if (!faceEl) {
    return Promise.reject(
      new Error("Postcard face is not available to render")
    );
  }

  // ----------------------------------------
  // Clone the postcard face
  // ----------------------------------------

  const clone = faceEl.cloneNode(true);

  // Remove 3D positioning from the cloned face
  clone.style.position = "static";
  clone.style.transform = "none";
  clone.style.inset = "auto";

  // ----------------------------------------
  // Preserve the active theme
  // ----------------------------------------

  const themeClass = Array.from(postcard.classList).find((className) =>
    className.startsWith("theme-")
  );

  // Create a wrapper that carries the theme.
  // This is important because many theme styles
  // depend on .postcard.theme-xxxx selectors.
  const wrapper = document.createElement("div");

  wrapper.className = "postcard";

  if (themeClass) {
    wrapper.classList.add(themeClass);
  }

  wrapper.style.position = "fixed";
  wrapper.style.top = "-9999px";
  wrapper.style.left = "-9999px";
  wrapper.style.width = `${faceEl.offsetWidth}px`;
  wrapper.style.height = `${faceEl.offsetHeight}px`;
  wrapper.style.overflow = "visible";

  // Preserve the same face class
  if (faceEl.classList.contains("postcard-front")) {
    wrapper.classList.add("rendering-front");
  }

  if (faceEl.classList.contains("postcard-back")) {
    wrapper.classList.add("rendering-back");
  }

  wrapper.appendChild(clone);
  document.body.appendChild(wrapper);

  // ----------------------------------------
  // Render
  // ----------------------------------------

  return html2canvas(wrapper, {
    scale: 3,
    backgroundColor: null,
    useCORS: true,
    allowTaint: false,
  }).finally(() => {
    document.body.removeChild(wrapper);
  });
}

function downloadPostcard() {
  renderPostcardCanvas()
    .then((canvas) => {
      const link = document.createElement("a");
      link.download = "meow-postcard.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    })
    .catch((err) => {
      console.error("Meow Page: could not generate postcard image", err);
    });
}

function getPostcardText() {
  // postcardData is defined in postcard.js and always holds the live values
  const recipient = postcardData.recipient || "";
  const message = postcardData.message || "";
  const sender = postcardData.sender || "";

  return `To: ${recipient}\n\n${message}\n\nFrom: ${sender}`;
}

function showButtonFeedback(button, tempText, delay = 1500) {
  const originalText = button.textContent;
  button.textContent = tempText;
  button.disabled = true;

  setTimeout(() => {
    button.textContent = originalText;
    button.disabled = false;
  }, delay);
}

function copyPostcard(button) {
  const text = getPostcardText();

  if (!navigator.clipboard || !navigator.clipboard.writeText) {
    console.error("Meow Page: Clipboard API not available in this browser");
    showButtonFeedback(button, "CAN'T COPY");
    return;
  }

  navigator.clipboard
    .writeText(text)
    .then(() => {
      showButtonFeedback(button, "COPIED ✓");
    })
    .catch((err) => {
      console.error("Meow Page: could not copy postcard text", err);
      showButtonFeedback(button, "CAN'T COPY");
    });
}

function canvasToPngFile(canvas) {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error("Could not convert postcard canvas to an image blob"));
        return;
      }
      resolve(new File([blob], "meow-postcard.png", { type: "image/png" }));
    }, "image/png");
  });
}

// Detects whether the primary input is a mouse/trackpad (desktop-like)
// rather than touch. Deliberately avoids user-agent sniffing — this uses
// the standard capability-based media features instead, so it stays
// accurate even on devices with mixed input (e.g. a touchscreen laptop
// with a mouse still reads as desktop-like, which is what matters here:
// Windows' native file-share picker is unreliable regardless of touch).
function isDesktopEnvironment() {
  return (
    typeof window.matchMedia === "function" &&
    window.matchMedia("(hover: hover) and (pointer: fine)").matches
  );
}

function showShareHint(message, duration = 2500) {
  const hint = document.getElementById("shareHint");
  if (!hint) return;

  hint.textContent = message;
  hint.classList.add("visible");

  setTimeout(() => {
    hint.classList.remove("visible");
  }, duration);
}

// Desktop fallback: native file sharing can't be trusted to actually
// succeed on Windows (navigator.share() resolves as soon as the OS picker
// opens, not once a share completes), so instead we generate the same
// postcard PNG and download it directly, then tell the person it's ready
// to attach/share manually.
function shareViaDesktopDownload(button) {
  renderPostcardCanvas()
    .then((canvas) => {
      const link = document.createElement("a");
      link.download = "meow-postcard.png";
      link.href = canvas.toDataURL("image/png");
      link.click();

      showButtonFeedback(button, "DOWNLOADED ✓", 10000);
      showShareHint(
        "Your postcard is saved — attach it anywhere you'd like to share it! 💌"
      );
    })
    .catch((err) => {
      console.error(
        "Meow Page: could not generate postcard image for desktop share",
        err
      );
      showButtonFeedback(button, "CAN'T SHARE");
    });
}

function sharePostcardImage(button) {
  if (isDesktopEnvironment()) {
    shareViaDesktopDownload(button);
    return;
  }

  if (!navigator.share || !navigator.canShare) {
    console.warn(
      "Meow Page: Web Share (file) API not available in this browser"
    );
    showButtonFeedback(button, "IMAGE SHARING NOT SUPPORTED");
    return;
  }

  renderPostcardCanvas()
    .then(canvasToPngFile)
    .then((file) => {
      if (!navigator.canShare({ files: [file] })) {
        showButtonFeedback(button, "IMAGE SHARING NOT SUPPORTED");
        return;
      }

      return navigator.share({
        title: "A Meow For You 🐱",
        text: getPostcardText(),
        files: [file],
      });
    })
    .catch((err) => {
      // The user closing/cancelling the native share sheet is expected
      // behavior, not an error — don't show any feedback for it.
      if (err && err.name === "AbortError") return;

      console.error("Meow Page: could not share postcard image", err);
      showButtonFeedback(button, "CAN'T SHARE");
    });
}

// function generatePostcardLink(button) {
//   const data = {
//     recipient: postcardData.recipient || "",
//     message: postcardData.message || "Hello!",
//     sender: postcardData.sender || "",
//     cat: postcardData.cat || "🐱",
//     stampImage: postcardData.stampImage || null,
//   };

//   try {
//     // JSON → UTF-8 → Base64
//     const json = JSON.stringify(data);

//     const bytes = new TextEncoder().encode(json);

//     const binary = Array.from(bytes)
//       .map((byte) => String.fromCharCode(byte))
//       .join("");

//     const encodedData = btoa(binary);

//     // /create and /card are siblings
//     const cardUrl = new URL("./card", window.location.href);

//     cardUrl.hash = encodedData;

//     const shareUrl = cardUrl.href;

//     navigator.clipboard
//       .writeText(shareUrl)
//       .then(() => {
//         showButtonFeedback(button, "LINK COPIED ✓", 2000);

//         showShareHint("Your postcard link is ready! 🔗💌", 3000);
//       })
//       .catch((err) => {
//         console.error("Meow Page: could not copy postcard link", err);

//         showButtonFeedback(button, "CAN'T COPY");
//       });
//   } catch (err) {
//     console.error("Meow Page: could not generate postcard link", err);

//     showButtonFeedback(button, "CAN'T CREATE LINK");
//   }
// }

async function generatePostcardLink(button) {
  try {
    showButtonFeedback(button, "CREATING...", 30000);

    console.log("1. Starting postcard save...");

    const postcard = await savePostcardToSupabase();

    console.log("2. Supabase postcard saved:", postcard);

    const cardUrl = new URL("./card.html", window.location.href);

    cardUrl.searchParams.set("id", postcard.id);

    const shareUrl = cardUrl.href;

    console.log("3. Generated URL:", shareUrl);

    await navigator.clipboard.writeText(shareUrl);

    console.log("4. Link copied!");

    showButtonFeedback(button, "LINK COPIED ✓", 2000);
    showShareHint("Your postcard link is ready! 🔗💌", 3000);
  } catch (err) {
    console.error("❌ CREATE LINK FAILED:", err);
    console.error("Error message:", err?.message);
    console.error("Error details:", err);

    showButtonFeedback(button, "CAN'T CREATE LINK", 2500);
  }
}

function initShare() {
  const sendBtn = document.getElementById("sendBtn");
  const copyBtn = document.getElementById("copyBtn");
  const shareBtn = document.getElementById("shareBtn");
  const getlinkBtn = document.getElementById("getlinkBtn");

  if (sendBtn) {
    sendBtn.addEventListener("click", downloadPostcard);
  }

  if (copyBtn) {
    copyBtn.addEventListener("click", () => copyPostcard(copyBtn));
  }

  if (shareBtn) {
    shareBtn.addEventListener("click", () => sharePostcardImage(shareBtn));
  }

  if (getlinkBtn) {
    getlinkBtn.addEventListener("click", () => {
      generatePostcardLink(getlinkBtn);
    });
  }
}

document.addEventListener("DOMContentLoaded", initShare);
