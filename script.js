// Target Wedding Date
const targetDate = new Date("February 7, 2027 00:00:00").getTime();

function updateCountdown() {
    const now = new Date().getTime();
    const difference = targetDate - now;

    if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        // Format numbers with leading zeroes (e.g. 05 instead of 5)
        document.getElementById("days").innerText = days < 10 ? "0" + days : days;
        document.getElementById("hours").innerText = hours < 10 ? "0" + hours : hours;
        document.getElementById("minutes").innerText = minutes < 10 ? "0" + minutes : minutes;
        document.getElementById("seconds").innerText = seconds < 10 ? "0" + seconds : seconds;
    }
}

setInterval(updateCountdown, 1000);
updateCountdown();

// Audio Toggle Functionality
function toggleMusic() {
    const music = document.getElementById("bg-music");
    const btn = document.getElementById("music-btn");
    
    if (music.paused) {
        music.play().then(() => {
            btn.innerText = "⏸ Pause Music";
        }).catch(error => {
            console.log("Autoplay failed:", error);
        });
    } else {
        music.pause();
        btn.innerText = "🎵 Play Music";
    }
}

// RSVP Form Submission Handling
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
            successMsg.style.display = 'block';
        } else {
            alert("Oops! There was a problem submitting your RSVP. Please try again.");
        }
    });
}

// Mobile Hamburger Menu Toggle
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');

if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Automatically close mobile menu when a navigation link is clicked
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
}
