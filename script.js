document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Particles (with error checking)
    try {
        if (typeof particlesJS !== 'undefined') {
            particlesJS('particles-js', {
                "particles": {
                    "number": { "value": 50, "density": { "enable": true, "value_area": 800 } },
                    "color": { "value": "#ffffff" },
                    "opacity": { "value": 0.4, "random": true },
                    "size": { "value": 2, "random": true },
                    "line_linked": { "enable": false },
                    "move": { "enable": true, "speed": 1, "direction": "none", "random": true, "straight": false, "out_mode": "out" }
                }
            });
        }
    } catch (e) { console.error("Particles error:", e); }

    // 2. Music Control
    const musicBtn = document.getElementById('music-btn');
    const music = document.getElementById('bg-music');
    const musicIcon = document.getElementById('music-icon');
    let isPlaying = false;

    musicBtn.addEventListener('click', () => {
        if (isPlaying) {
            music.pause();
            musicIcon.innerText = '🔇';
        } else {
            music.play();
            musicIcon.innerText = '🎵';
        }
        isPlaying = !isPlaying;
    });

    const showStage = (stageId) => {
        // Reset all stages
        document.querySelectorAll('.stage').forEach(s => {
            s.classList.remove('active');
            s.style.display = 'none'; // Explicitly hide
        });
        const nextStage = document.getElementById(stageId);
        nextStage.style.display = 'flex'; // Explicitly show
        // Use a small timeout to allow display change before opacity animation
        setTimeout(() => {
            nextStage.classList.add('active');
        }, 50);
        return nextStage;
    };

    // --- STAGE 1: INTRO ---
    if (typeof Typed !== 'undefined') {
        new Typed('#typed-intro', {
            strings: ['Chúc mừng sinh nhật mẹ ❤️'],
            typeSpeed: 60,
            showCursor: false,
            onComplete: () => {
                const btn = document.getElementById('start-btn');
                btn.style.display = 'block';
                gsap.to(btn, { opacity: 1, y: -10, duration: 1, delay: 0.5 });
            }
        });
    } else {
        // Fallback if Typed.js fails
        document.getElementById('typed-intro').innerText = 'Chúc mừng sinh nhật mẹ ❤️';
        const btn = document.getElementById('start-btn');
        btn.style.display = 'block';
        btn.style.opacity = '1';
    }

    document.getElementById('start-btn').addEventListener('click', (e) => {
        e.preventDefault();
        if (!isPlaying) {
            music.play().catch(err => console.log("Auto-play blocked"));
            isPlaying = true;
            musicIcon.innerText = '🎵';
        }
        showStage('stage-timeline');
        initMemorySlider();
    });

    // --- STAGE 2: SEQUENTIAL SLIDER (10 Photos) ---
    let currentMemoryIndex = 0;
    const memoryCards = document.querySelectorAll('#memory-slider .memory-card');
    const nextBtn = document.getElementById('next-memory-btn');
    const memorySlider = document.getElementById('memory-slider');
    const memoryGrid = document.getElementById('memory-grid');
    const gridInner = document.getElementById('collage-grid-inner');

    function initMemorySlider() {
        // Ensure first card is active
        memoryCards.forEach(c => c.classList.remove('active-card'));
        memoryCards[0].classList.add('active-card');
        gsap.fromTo(memoryCards[0], { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, duration: 1 });
    }

    nextBtn.addEventListener('click', () => {
        if (currentMemoryIndex < memoryCards.length - 1) {
            const currentCard = memoryCards[currentMemoryIndex];
            currentMemoryIndex++;
            const nextCard = memoryCards[currentMemoryIndex];

            gsap.to(currentCard, { 
                opacity: 0, 
                scale: 0.9,
                duration: 0.4, 
                onComplete: () => {
                    currentCard.classList.remove('active-card');
                    nextCard.classList.add('active-card');
                    gsap.fromTo(nextCard, 
                        { opacity: 0, scale: 1.1 }, 
                        { opacity: 1, scale: 1, duration: 0.5 }
                    );
                }
            });
            
            if (currentMemoryIndex === memoryCards.length - 1) {
                nextBtn.innerText = "Xem tất cả kỷ niệm ❤️";
            }
        } else {
            showMemoryGrid();
        }
    });

    function showMemoryGrid() {
        gridInner.innerHTML = '';
        memoryCards.forEach((card, idx) => {
            const imgSrc = card.querySelector('img').getAttribute('src');
            const item = document.createElement('div');
            item.className = 'grid-item';
            const rot = (Math.random() * 12 - 6).toFixed(1);
            item.style.setProperty('--rot', `${rot}deg`);
            item.innerHTML = `<img src="${imgSrc}" alt="Kỷ niệm ${idx + 1}">`;
            gridInner.appendChild(item);
        });

        gsap.to(memorySlider, { opacity: 0, duration: 0.6, onComplete: () => {
            memorySlider.style.display = 'none';
            memoryGrid.classList.remove('hidden-substage');
            memoryGrid.style.display = 'flex';
            
            gsap.from('#memory-grid .collage-title', { opacity: 0, y: -20, duration: 1 });
            gsap.from('.grid-item', { 
                opacity: 0, 
                scale: 0.3, 
                stagger: 0.1, 
                duration: 0.8, 
                ease: "power2.out" 
            });
        }});
    }

    // --- STAGE 3: PEAK ---
    document.getElementById('to-peak-btn').addEventListener('click', () => {
        showStage('stage-peak');
        const tl = gsap.timeline();
        tl.to('#peak-1', { opacity: 1, duration: 1.5, delay: 0.5 })
          .to('#peak-2', { opacity: 1, duration: 1, delay: 0.8 })
          .to('#peak-3', { opacity: 1, duration: 2, delay: 0.8 })
          .call(() => {
              setTimeout(() => {
                  showStage('stage-cake');
              }, 3500);
          });
    });

    // --- STAGE 4: CAKE ---
    const candle = document.getElementById('candle');
    const flame = document.getElementById('flame');
    
    candle.addEventListener('click', () => {
        flame.style.display = 'none';
        confetti({
            particleCount: 250,
            spread: 100,
            origin: { y: 0.6 },
            colors: ['#ff85a2', '#ffd700', '#ffffff', '#a78bfa']
        });

        setTimeout(() => {
            showStage('stage-ending');
            gsap.from('.ending-content > *', { opacity: 0, y: 30, stagger: 0.6, duration: 1.5 });
        }, 2000);
    });

    // Date logic
    const d = new Date();
    const dateEl = document.getElementById('current-date');
    if (dateEl) dateEl.innerText = d.toLocaleDateString('vi-VN', { day: 'numeric', month: 'long', year: 'numeric' });
});
