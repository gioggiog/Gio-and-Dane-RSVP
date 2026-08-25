// Target Wedding Date (Year, Month Index 0-11, Day, Hour, Minute)
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
        music.play();
        btn.innerText = "⏸ Pause Music";
    } else {
        music.pause();
        btn.innerText = "🎵 Play Music";
    }
}