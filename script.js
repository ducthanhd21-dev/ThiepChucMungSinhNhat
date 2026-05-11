document.addEventListener('DOMContentLoaded', () => {
    const envelopeWrapper = document.getElementById('envelope-wrapper');
    const mainContent = document.getElementById('main-content');
    const bgDecorations = document.getElementById('bg-decorations');
    const messageTextElement = document.getElementById('typewriter-text');
    const fullText = messageTextElement.innerText;
    
    // Clear text for typewriter effect
    messageTextElement.innerText = '';

    // Generate floating hearts
    function createHeart() {
        const heart = document.createElement('div');
        heart.classList.add('floating-heart');
        heart.innerHTML = '❤';
        heart.style.left = Math.random() * 100 + 'vw';
        heart.style.fontSize = (Math.random() * 20 + 10) + 'px';
        heart.style.animationDuration = (Math.random() * 10 + 5) + 's';
        heart.style.opacity = Math.random();
        bgDecorations.appendChild(heart);

        setTimeout(() => {
            heart.remove();
        }, 15000);
    }

    setInterval(createHeart, 800);

    // Envelope Click Event
    envelopeWrapper.addEventListener('click', () => {
        envelopeWrapper.classList.add('open');
        
        // Burst of confetti
        confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#ff85a2', '#ffb6c1', '#a78bfa', '#ffffff']
        });

        // Hide envelope and show content after delay
        setTimeout(() => {
            envelopeWrapper.style.transition = 'all 1s ease-out';
            envelopeWrapper.style.opacity = '0';
            envelopeWrapper.style.transform = 'translateY(-100px)';
            
            setTimeout(() => {
                envelopeWrapper.style.display = 'none';
                mainContent.classList.add('visible');
                startTypewriter();
            }, 1000);
        }, 1500);
    });

    // Typewriter effect
    function startTypewriter() {
        let i = 0;
        const speed = 50; // ms per character

        function type() {
            if (i < fullText.length) {
                messageTextElement.innerText += fullText.charAt(i);
                i++;
                setTimeout(type, speed);
            }
        }
        type();
    }
});
