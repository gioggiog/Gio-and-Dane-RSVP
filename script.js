// Target Wedding Date
const targetDate = new Date("January 11, 2027 10:00:00").getTime();

function updateCountdown() {
    const now = new Date().getTime();
    const difference = targetDate - now;

    if (difference > 0) {
        document.getElementById("days").innerText = Math.floor(difference / (1000 * 60 * 60 * 24));
        document.getElementById("hours").innerText = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        document.getElementById("minutes").innerText = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        document.getElementById("seconds").innerText = Math.floor((difference % (1000 * 60)) / 1000);
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
