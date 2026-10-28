// Ensure DOM is fully loaded before running script
document.addEventListener("DOMContentLoaded", function () {

    // 0. Scroll reveal (fade up)
    (function initReveal() {
        const root = document.documentElement;
        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (reduce || !('IntersectionObserver' in window)) { root.classList.remove('js'); return; }

        // [selector, stagger step in seconds, max steps]
        const groups = [
            ['.hero-content > *', 0.15, 8],
            ['.story-container > h2', 0, 0],
            ['.story-box', 0.08, 3],
            ['.timeline-header', 0, 0],
            ['.timeline-item', 0.05, 2],
            ['#entourage .section-title', 0, 0],
            ['.attire-palette', 0, 0],
            ['.attire-card', 0.1, 1],
            ['.attire-note', 0, 0],
            ['.entourage-row', 0, 0],
            ['.gold-divider-line', 0, 0],
            ['.tables-grid .table-card', 0.06, 4],
            ['.gallery-container .section-title', 0, 0],
            ['.gallery-slider', 0.1, 1],
            ['.rsvp-card', 0, 0],
            ['.section-divider', 0, 0]
        ];

        const targets = [];
        groups.forEach(([sel, step, max]) => {
            document.querySelectorAll(sel).forEach((el, i) => {
                el.classList.add('reveal');
                if (step) el.style.setProperty('--d', (Math.min(i, max) * step).toFixed(2) + 's');
                targets.push(el);
            });
        });

        const io = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    io.unobserve(entry.target);   // animate once
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });

        targets.forEach(el => io.observe(el));
        root.classList.add('reveal-ready');
    })();

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

    // 2. RSVP Form
    const form = document.getElementById('rsvpForm');
    const successBox = document.getElementById('rsvpSuccess');

    if (form) {
        const guestsField = document.getElementById('guestsField');
        const guestInput = document.getElementById('guestCount');
        const errorBox = document.getElementById('rsvpError');
        const submitBtn = form.querySelector('.rsvp-submit');
        const nameInput = document.getElementById('rsvpName');
        const choices = form.querySelector('.rsvp-choices');

        const showError = (msg) => { errorBox.textContent = msg; errorBox.hidden = false; };
        const clearError = () => { errorBox.hidden = true; };

        // Show the guest counter only when attending
        form.querySelectorAll('input[name="attendance"]').forEach(radio => {
            radio.addEventListener('change', () => {
                const attending = form.querySelector('input[name="attendance"]:checked').value === 'Joyfully Accepts';
                guestsField.hidden = !attending;
                guestInput.disabled = !attending;   // disabled fields are not submitted
                choices.classList.remove('invalid');
                clearError();
            });
        });

        // Guest stepper (1-5)
        form.querySelectorAll('.step-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const next = (parseInt(guestInput.value, 10) || 1) + Number(btn.dataset.step);
                guestInput.value = Math.min(5, Math.max(1, next));
            });
        });

        nameInput.addEventListener('input', () => nameInput.closest('.rsvp-field').classList.remove('invalid'));

        form.addEventListener('submit', async function (e) {
            e.preventDefault();
            clearError();

            // Validation with friendly messages
            const name = nameInput.value.trim();
            const picked = form.querySelector('input[name="attendance"]:checked');
            if (!name) {
                nameInput.closest('.rsvp-field').classList.add('invalid');
                showError('Please enter your full name.');
                nameInput.focus();
                return;
            }
            if (!picked) {
                choices.classList.add('invalid');
                showError('Please let us know if you can make it.');
                return;
            }

            submitBtn.classList.add('loading');
            submitBtn.disabled = true;
            submitBtn.querySelector('.btn-label').textContent = 'Sending...';

            try {
                const response = await fetch(form.action, {
                    method: 'POST',
                    body: new FormData(form),
                    headers: { 'Accept': 'application/json' }
                });
                if (!response.ok) throw new Error('Request failed');

                const attending = picked.value === 'Joyfully Accepts';
                const firstName = name.split(' ')[0];
                document.getElementById('successTitle').textContent = `Thank you, ${firstName}!`;
                document.getElementById('successText').textContent = attending
                    ? 'Your RSVP is in. We can\'t wait to celebrate with you!'
                    : 'Your response is received. You\'ll be missed, and we\'re grateful you let us know.';
                form.hidden = true;
                form.style.display = 'none';
                successBox.hidden = false;
                successBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
            } catch (err) {
                showError('Your RSVP didn\'t go through. Check your connection and try again.');
                submitBtn.classList.remove('loading');
                submitBtn.disabled = false;
                submitBtn.querySelector('.btn-label').textContent = 'Send my RSVP';
            }
        });
    }

    // 3. Mobile hamburger menu (RSVP stays visible outside the menu)
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');

    if (navToggle && navMenu) {
        const setMenu = (open) => {
            navToggle.classList.toggle('active', open);
            navMenu.classList.toggle('active', open);
            navToggle.setAttribute('aria-expanded', String(open));
            navToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
        };

        navToggle.addEventListener('click', () => setMenu(!navMenu.classList.contains('active')));
        navMenu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenu(false)));
        document.querySelector('.navbar .rsvp-btn')?.addEventListener('click', () => setMenu(false));
        document.addEventListener('click', (e) => { if (!e.target.closest('.navbar')) setMenu(false); });
        document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });
    }

    // 4. Gallery carousel (3D coverflow, responsive)
    if (document.querySelector('.gallery-slider') && typeof Swiper !== 'undefined') {
        new Swiper('.gallery-slider', {
            effect: 'coverflow',
            grabCursor: true,
            centeredSlides: true,
            slidesPerView: 'auto',
            loop: true,
            speed: 700,
            autoplay: { delay: 3500, disableOnInteraction: false, pauseOnMouseEnter: true },
            coverflowEffect: { rotate: 20, stretch: 0, depth: 120, modifier: 1, scale: 0.92, slideShadows: false },
            breakpoints: {
                700: { coverflowEffect: { rotate: 28, stretch: 0, depth: 140, modifier: 1, scale: 0.9, slideShadows: false } }
            },
            keyboard: { enabled: true },
            pagination: { el: '.gallery-slider .swiper-pagination', clickable: true },
            navigation: { nextEl: '.gallery-slider .swiper-button-next', prevEl: '.gallery-slider .swiper-button-prev' },
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

// Table Guest List Data
const tableData = {
    1: {
        title: "Immediate Family",
        guests: ["Mama (Groom)", "Papa (Groom)", "Mama (Bride)", "Papa (Bride)", "Lola"]
    },
    2: {
        title: "Principal Sponsors",
        guests: ["Mr. Montefolka", "Mrs. Montefolka", "Mr. Yap", "Mrs. Yap", "Capt. Bubbles", "Capt's Partner", "Tita Cathy", "Tito JP", "Tiyo Ben", "Mi Chona"]
    },
    3: {
        title: "Groom's Relatives",
        guests: ["Tiyo Meo", "Te Gigi", "Te Cecil", "Kuya Tata", "Kuya Junjun", "Te Jenimmar"]
    },
    4: {
        title: "Bride's Uncles & Aunts",
        guests: ["Auntie Vicky", "Uncle Jun", "Uncle Andoy", "Uncle Edgar", "Auntie BB", "Uncle Lito", "Auntie Sonia", "Auntie Gaya", "Uncle Dodong"]
    },
    5: {
        title: "Bride's Relatives",
        guests: ["Epay", "Khem", "Jrebb", "Angelie", "Bryce", "Ate Yan", "Chanisse", "Chelsea", "Chantal", "Loeng & Clark"]
    },
    6: {
        title: "Groom's Fam&Friends",
        guests: ["Jharyd", "Jade", "Kyle", "Carla", "Xavier", "Exekiel", "Jerson", "Mark", "Mark's GF"]
    },
    7: {
        title: "Groom's Fam&Friends A",
        guests: ["Ate (Groom)", "Kuya Mikel", "Tintin", "Edel", "Edel's GF", "Esoy", "Nash", "Brandon", "Brad's Fiancee"]
    },
    8: {
        title: "Groom's Friends B",
        guests: ["Helbert", "Ella", "Kent", "Eghan", "Johan", "Edmund", "Joshua", "Vhryl", "Thomas", "Rex", "Scott", "Mikee"]
    },
    9: {
        title: "Bride's Friends A",
        guests: ["Kuya John2 & Wife", "Kuya Enting & Wife", "BB, BB1, BB2, BB3", "Mico", "Carlo", "Jamjam", "Anson", "Ondong", "Ate MK", "Mommy Nancy"]
    },
    10: {
        title: "Bride's Friends B",
        guests: ["Shania", "Irish", "Hannah", "Kern", "Monet", "Catz", "Ebie", "Sabin", "Krizzanta & Xavi", "Duday", "Timay", "Cooper"]
    }
};

function openTableModal(tableNum) {
    const data = tableData[tableNum];
    if (!data) return;

    document.getElementById("modalTableNumber").innerText = `TABLE ${String(tableNum).padStart(2, '0')}`;
    document.getElementById("modalTableName").innerText = data.title;

    const listContainer = document.getElementById("modalGuestList");
    listContainer.innerHTML = "";

    data.guests.forEach((guest, index) => {
        const li = document.createElement("li");
        li.innerText = guest;
        // Stagger list animation delay for each guest name
        li.style.transitionDelay = `${0.1 + index * 0.04}s`;
        listContainer.appendChild(li);
    });

    document.getElementById("tableModal").classList.add("active");
}

function closeTableModal(event) {
    if (event.target.id === "tableModal") {
        document.getElementById("tableModal").classList.remove("active");
    }
}

function closeTableModalDirect() {
    document.getElementById("tableModal").classList.remove("active");
}
