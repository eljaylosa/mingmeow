// Postcard download, copy, and share (Phase 5A / 5B / 5C)
// Facebook/Messenger/Instagram-specific behavior is added in a later phase.

function getVisiblePostcardFace() {
  const postcard = document.getElementById('postcard');
  if (!postcard) return null;

  const isFlipped = postcard.classList.contains('flipped');
  const selector = isFlipped ? '.postcard-back' : '.postcard-front';
  return postcard.querySelector(selector);
}

// Shared renderer used by both Download and Share, so they always produce
// the same image. Clones the currently visible face (stripping its 3D
// positioning), renders it off-screen at high resolution via html2canvas,
// and resolves with the resulting canvas.
function renderPostcardCanvas() {
  const faceEl = getVisiblePostcardFace();
  if (!faceEl || typeof html2canvas === 'undefined') {
    return Promise.reject(new Error('Postcard face is not available to render'));
  }

  // The front/back faces carry their own 3D positioning (absolute position,
  // and .postcard-back also has a permanent rotateY(180deg) so it sits behind
  // the front face until the parent flips). html2canvas doesn't know about
  // the flip state, so we clone the visible face, strip that positioning
  // inline, and render the clone off-screen instead of the live element.
  const clone = faceEl.cloneNode(true);
  clone.style.position = 'static';
  clone.style.transform = 'none';
  clone.style.inset = 'auto';

  const wrapper = document.createElement('div');
  wrapper.style.position = 'fixed';
  wrapper.style.top = '-9999px';
  wrapper.style.left = '-9999px';
  wrapper.style.width = `${faceEl.offsetWidth}px`;
  wrapper.style.height = `${faceEl.offsetHeight}px`;
  wrapper.appendChild(clone);
  document.body.appendChild(wrapper);

  return html2canvas(clone, {
    scale: 3,
    backgroundColor: null
  }).finally(() => {
    document.body.removeChild(wrapper);
  });
}

function downloadPostcard() {
  renderPostcardCanvas()
    .then((canvas) => {
      const link = document.createElement('a');
      link.download = 'meow-postcard.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    })
    .catch((err) => {
      console.error('Meow Page: could not generate postcard image', err);
    });
}

function getPostcardText() {
  // postcardData is defined in postcard.js and always holds the live values
  const recipient = postcardData.recipient || '';
  const message = postcardData.message || '';
  const sender = postcardData.sender || '';

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
    console.error('Meow Page: Clipboard API not available in this browser');
    showButtonFeedback(button, "CAN'T COPY");
    return;
  }

  navigator.clipboard
    .writeText(text)
    .then(() => {
      showButtonFeedback(button, 'COPIED ✓');
    })
    .catch((err) => {
      console.error('Meow Page: could not copy postcard text', err);
      showButtonFeedback(button, "CAN'T COPY");
    });
}

function canvasToPngFile(canvas) {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error('Could not convert postcard canvas to an image blob'));
        return;
      }
      resolve(new File([blob], 'meow-postcard.png', { type: 'image/png' }));
    }, 'image/png');
  });
}

function sharePostcardImage(button) {
  if (!navigator.share || !navigator.canShare) {
    console.warn('Meow Page: Web Share (file) API not available in this browser');
    showButtonFeedback(button, 'IMAGE SHARING NOT SUPPORTED');
    return;
  }

  renderPostcardCanvas()
    .then((canvas) => {
      console.log('[MeowShare] 1. renderPostcardCanvas() resolved:', canvas, {
        width: canvas.width,
        height: canvas.height
      });
      return canvasToPngFile(canvas);
    })
    .then((file) => {
      console.log('[MeowShare] 2/3. canvasToPngFile() resolved, File created:', {
        name: file.name,
        type: file.type,
        size: file.size
      });

      const canShareFiles = navigator.canShare({ files: [file] });
      console.log('[MeowShare] 4. navigator.canShare({ files: [file] }) =', canShareFiles);

      if (!canShareFiles) {
        showButtonFeedback(button, 'IMAGE SHARING NOT SUPPORTED');
        return;
      }

      const shareData = {
        title: 'A Meow For You 🐱',
        text: getPostcardText(),
        files: [file]
      };
      console.log('[MeowShare] Calling navigator.share() with:', shareData);

      return navigator.share(shareData);
    })
    .then(() => {
      console.log('[MeowShare] navigator.share() resolved successfully');
    })
    .catch((err) => {
      // The user closing/cancelling the native share sheet is expected
      // behavior, not an error — don't show any feedback for it.
      if (err && err.name === 'AbortError') {
        console.log('[MeowShare] navigator.share() aborted by user (AbortError) — treated as normal cancellation');
        return;
      }

      console.error('[MeowShare] 5. navigator.share() rejected:', err, {
        name: err && err.name,
        message: err && err.message
      });
      showButtonFeedback(button, "CAN'T SHARE");
    });
}

function initShare() {
  const sendBtn = document.getElementById('sendBtn');
  const copyBtn = document.getElementById('copyBtn');
  const shareBtn = document.getElementById('shareBtn');

  if (sendBtn) {
    sendBtn.addEventListener('click', downloadPostcard);
  }

  if (copyBtn) {
    copyBtn.addEventListener('click', () => copyPostcard(copyBtn));
  }

  if (shareBtn) {
    shareBtn.addEventListener('click', () => sharePostcardImage(shareBtn));
  }
}

document.addEventListener('DOMContentLoaded', initShare);
