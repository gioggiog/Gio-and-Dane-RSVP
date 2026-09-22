// Ensure DOM is fully loaded before running script
document.addEventListener("DOMContentLoaded", function () {

    // 1. Countdown Timer Implementation
    const weddingDate = new Date("2028-02-07T00:00:00").getTime();

    function updateCountdown() {
        const now = new Date().getTime();
        const distance = weddingDate - now;

        if (isNaN(distance) || distance <= 0) {
            setElementText(["days", "day"], "00");
            setElementText(["hours", "hour"], "00");
            setElementText(["minutes", "mins", "min"], "00");
            setElementText(["seconds", "secs", "sec"], "00");
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        // Flexible update that checks both 'mins' / 'minutes' and 'secs' / 'seconds'
        setElementText(["days", "day"], String(days).padStart(2, '0'));
        setElementText(["hours", "hour"], String(hours).padStart(2, '0'));
        setElementText(["minutes", "mins", "min"], String(minutes).padStart(2, '0'));
        setElementText(["seconds", "secs", "sec"], String(seconds).padStart(2, '0'));
    }

    // Helper function to dynamically match your HTML IDs
    function setElementText(possibleIds, value) {
        for (let id of possibleIds) {
            let el = document.getElementById(id);
            if (el) {
                el.innerText = value;
                break;
            }
        }
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);

    // 2. RSVP Form Submission Handling
    const form = document.getElementById('rsvpForm');
    const successMsg = document.getElementById('rsvpSuccess');

    if (form) {
        form.addEventListener('submit', async function (e) {
            e.preventDefault();
            const data = new FormData(form);
            
            const response = await fetch(form.action, {
                method: 'POST',
                body: data,
                headers: { 'Accept': 'application/json' }
            });

            if (response.ok) {
                form.style.display = 'none';
                if (successMsg) successMsg.style.display = 'block';
            } else {
                alert("Oops! There was a problem submitting your RSVP. Please try again.");
            }
        });
    }

    // 3. Mobile Hamburger Menu Toggle
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        document.querySelectorAll('.nav-menu a').forEach(link => {
            link.addEventListener('click', () => {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }

    // 4. Aesthetic 3D Coverflow Carousel Initialization
    if (document.querySelector('.gallery-slider')) {
        new Swiper('.gallery-slider', {
            effect: 'coverflow',
            grabCursor: true,
            centeredSlides: true,
            slidesPerView: 'auto',
            loop: true,
            autoplay: {
                delay: 3500,
                disableOnInteraction: false,
            },
            coverflowEffect: {
                rotate: 30,
                stretch: 0,
                depth: 100,
                modifier: 1,
                slideShadows: false,
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
        });
    }
});

// 5. Audio Toggle Functionality (Global)
function toggleMusic() {
    const music = document.getElementById("bg-music");
    const btn = document.getElementById("music-btn");
    
    if (music && music.paused) {
        music.play().then(() => {
            if (btn) btn.innerText = "⏸ Pause Music";
        }).catch(error => {
            console.log("Autoplay failed:", error);
        });
    } else if (music) {
        music.pause();
        if (btn) btn.innerText = "🎵 Play Music";
    }
}
