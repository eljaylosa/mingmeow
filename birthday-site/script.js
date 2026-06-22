
document.addEventListener('DOMContentLoaded', () => {
    // --- Elements ---
    
    const nameEntrySection = document.getElementById('name-entry');
    const startButton = document.getElementById('start-button');
    const nameInput = document.getElementById('name-input');
    const recipientNameSpan = document.getElementById('recipient-name');

    const flame = document.getElementById('flame');
    const blowButton = document.getElementById('blow-button');
    const heroSection = document.getElementById('hero');
    const celebrationSection = document.getElementById('celebration');
    const interactivesSection = document.getElementById('interactives');
    const themeToggle = document.getElementById('theme-toggle');
    const musicToggle = document.getElementById('music-toggle');
    const bgMusic = document.getElementById('bg-music');
    const volumeSlider = document.getElementById('volume-slider');
    const balloonContainer = document.getElementById('balloon-container');
    const giftBox = document.getElementById('gift-box');
    const giftMessage = document.getElementById('gift-message');
    const envelope = document.getElementById('envelope');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const closeLightbox = document.querySelector('.close-lightbox');
    const galleryItems = document.querySelectorAll('.gallery-item img');

    const blowHint = document.getElementById('blow-hint');
    let candleBlown = false;
    let celebrationStarted = false; // Flag to control microphone detection

    // --- Start Celebration ---
    startButton.addEventListener('click', () => {
        const name = nameInput.value.trim();
        if (name) {
            recipientNameSpan.textContent = name;
            nameEntrySection.classList.remove('active');
            nameEntrySection.classList.add('hidden');
            
            heroSection.classList.remove('hidden');
            heroSection.classList.add('active');
            
            celebrationStarted = true; // Enable mic detection
            initMic(); // Start listening
        } else {
            alert("Please enter a name!");
        }
    });

    // --- Theme Toggle ---
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        document.body.classList.toggle('light-mode');
        const icon = themeToggle.querySelector('i');
        if (document.body.classList.contains('dark-mode')) {
            icon.classList.replace('fa-moon', 'fa-sun');
        } else {
            icon.classList.replace('fa-sun', 'fa-moon');
        }
    });

    // --- Music Controls ---
    musicToggle.addEventListener('click', () => {
        if (bgMusic.paused) {
            bgMusic.play();
            musicToggle.innerHTML = '<i class="fas fa-pause"></i>';
        } else {
            bgMusic.pause();
            musicToggle.innerHTML = '<i class="fas fa-music"></i>';
        }
    });

    volumeSlider.addEventListener('input', (e) => {
        bgMusic.volume = e.target.value;
    });

    // --- Microphone Detection (Web Audio API) ---
    async function initMic() {
        if (!celebrationStarted) return; // Guard clause

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const analyser = audioContext.createAnalyser();
            const microphone = audioContext.createMediaStreamSource(stream);
            microphone.connect(analyser);
            analyser.fftSize = 256;
            const bufferLength = analyser.frequencyBinCount;
            const dataArray = new Uint8Array(bufferLength);

           
           
            function checkVolume() {
                if (candleBlown || !celebrationStarted) return;
                analyser.getByteFrequencyData(dataArray);
                let sum = 0;
                for (let i = 0; i < bufferLength; i++) {
                    sum += dataArray[i];
                }
                let average = sum / bufferLength;
                
                // If volume threshold is met (blowing sound)
                // if not met add a message to the user to blow harder

                if (average > 40) {
                    blowHint.classList.add('hidden');
                    extinguishCandle();
                } 
                else if (average >  15) {
                    blowHint.classList.remove('hidden');
                    blowHint.textContent = "A bit stronger 💨";
                } 
                else {
                    blowHint.classList.remove('hidden');
                    blowHint.textContent = "Blow harder into the mic 🎤💨";
                }

               
                requestAnimationFrame(checkVolume);
            }
            checkVolume();
        } catch (err) {
            console.warn("Microphone access denied or unavailable:", err);
        }
    }

    // --- Candle Extinguish Logic ---
    function extinguishCandle() {
        if (candleBlown) return;
        candleBlown = true;
        flame.classList.add('extinguished');
        
        // Celebration effects
        triggerConfettiNoises();
        triggerConfetti();
        triggerSound();
        
        setTimeout(() => {
            transitionToCelebration();
        }, 1000);
    }

    blowButton.addEventListener('click', extinguishCandle);

    //trigger confetti noises
    function triggerConfettiNoises() {
        const audio = new Audio('assets/confetti.mp3');
        audio.play();
    }

    // will play a sound when the candle is blown
    function triggerSound() {
        const audio = new Audio('assets/happyBirthdaySong.mp3');
        audio.play();
    }

    function triggerConfetti() {
        const duration = 5 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

        function randomInRange(min, max) {
            return Math.random() * (max - min) + min;
        }

        const interval = setInterval(function() {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);
            confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
            confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
        }, 250);
    }

    function transitionToCelebration() {
        heroSection.style.opacity = '0';
        setTimeout(() => {
            heroSection.classList.add('hidden');
            heroSection.classList.remove('active');
            
            celebrationSection.classList.remove('hidden');
            celebrationSection.classList.add('fade-in');
            
            interactivesSection.classList.remove('hidden');
            interactivesSection.classList.add('fade-in');
            
            createBalloons();
        }, 500);
    }

    // --- Floating Balloons ---
    function createBalloons() {
        const colors = ['#ff6b6b', '#feca57', '#48dbfb', '#1dd1a1', '#ff9ff3'];
        for (let i = 0; i < 15; i++) {
            const balloon = document.createElement('div');
            balloon.className = 'balloon';
            balloon.style.left = Math.random() * 100 + 'vw';
            balloon.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            balloon.style.animationDelay = Math.random() * 5 + 's';
            balloonContainer.appendChild(balloon);
        }
    }

    // --- Interactive: Gift Box ---
    giftBox.addEventListener('click', () => {
        giftBox.classList.toggle('open');
        giftMessage.classList.toggle('hidden-content');
    });

    // --- Interactive: Envelope ---
    envelope.addEventListener('click', () => {
        envelope.classList.toggle('open');
    });

    // --- Gallery Lightbox ---
    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            lightbox.style.display = 'flex';
            lightboxImg.src = item.src;
        });
    });

    closeLightbox.addEventListener('click', () => {
        lightbox.style.display = 'none';
    });

    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            lightbox.style.display = 'none';
        }
    });

    // --- Cursor Sparkles ---
    document.addEventListener('mousemove', (e) => {
        const sparkle = document.createElement('div');
        sparkle.className = 'sparkle';
        sparkle.style.left = e.pageX + 'px';
        sparkle.style.top = e.pageY + 'px';
        document.body.appendChild(sparkle);

        setTimeout(() => {
            sparkle.remove();
        }, 1000);
    });
});
