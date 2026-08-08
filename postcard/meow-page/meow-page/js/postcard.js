// Postcard state + live preview wiring (Phase 2)

const postcardData = {
  recipient: '',
  message: 'Hello!',
  sender: '',
  cat: '🐱'
};

function updatePostcardPreview() {
  const catEl = document.getElementById('postcardCat');
  const toEl = document.getElementById('postcardTo');
  const messageEl = document.getElementById('postcardMessage');
  const fromEl = document.getElementById('postcardFrom');

  if (!catEl) return; // not on this page

  catEl.textContent = postcardData.cat;
  toEl.textContent = postcardData.recipient;
  messageEl.textContent = postcardData.message || 'Hello!';
  fromEl.textContent = postcardData.sender;
}

function initPostcardEditor() {
  const recipientInput = document.getElementById('recipientInput');
  const messageInput = document.getElementById('messageInput');
  const senderInput = document.getElementById('senderInput');
  const catOptions = document.querySelectorAll('.cat-option');

  if (!recipientInput) return; // not on the create page

  recipientInput.addEventListener('input', () => {
    postcardData.recipient = recipientInput.value;
    updatePostcardPreview();
  });

  messageInput.addEventListener('input', () => {
    postcardData.message = messageInput.value;
    updatePostcardPreview();
  });

  senderInput.addEventListener('input', () => {
    postcardData.sender = senderInput.value;
    updatePostcardPreview();
  });

  catOptions.forEach((btn) => {
    btn.addEventListener('click', () => {
      postcardData.cat = btn.dataset.cat;

      catOptions.forEach((b) => b.classList.remove('selected'));
      btn.classList.add('selected');

      updatePostcardPreview();
    });
  });

  // Mark the default cat as selected on load
  catOptions[0].classList.add('selected');

  updatePostcardPreview();
  initPostcardFlip();
  initCatReaction();
}

function initPostcardFlip() {
  const postcard = document.getElementById('postcard');
  if (!postcard) return;

  postcard.addEventListener('click', () => {
    postcard.classList.toggle('flipped');
  });
}

function initCatReaction() {
  const postcardCat = document.getElementById('postcardCat');
  if (!postcardCat) return;

  postcardCat.addEventListener('click', (event) => {
    // Don't let a cat click also trigger the postcard flip
    event.stopPropagation();

    postcardCat.classList.remove('bounce');
    // restart the animation even if clicked rapidly
    void postcardCat.offsetWidth;
    postcardCat.classList.add('bounce');
  });

  postcardCat.addEventListener('animationend', () => {
    postcardCat.classList.remove('bounce');
  });
}

document.addEventListener('DOMContentLoaded', initPostcardEditor);
