document.addEventListener("DOMContentLoaded", () => {
    // GSAP Intro Animation with Welcome Screen
    const tl = gsap.timeline();

    // 1. Animate Welcome Screen
    tl.to(".welcome-logo", {
        opacity: 1,
        scale: 1,
        duration: 0.8,
        ease: "back.out(1.5)"
    })
        .to(".welcome-text", {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power3.out"
        }, "-=0.4")
        // 2. Hold for a moment, then fade out the whole welcome screen
        .to(".welcome-screen", {
            opacity: 0,
            duration: 0.6,
            delay: 1.2,
            ease: "power2.inOut",
            onComplete: () => {
                document.getElementById('welcome-screen').style.display = 'none';
                document.body.style.overflow = 'auto'; // Restore scrolling if needed
            }
        })
        // 3. Animate Main Card In
        .to(".card", {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out"
        }, "-=0.2")
        // 4. Animate Stars
        .from(".stars i", {
            opacity: 0,
            scale: 0.5,
            duration: 0.5,
            stagger: 0.1,
            ease: "back.out(1.7)"
        }, "-=0.4");

    // Removing chip GSAP animation to fix visibility issues
    gsap.set(".chip", { opacity: 1, y: 0 });

    // Rating Logic
    const stars = document.querySelectorAll('.stars i');
    const ratingText = document.getElementById('rating-text');
    let currentRating = 0; // Starts empty

    const ratingDescriptions = {
        1: "Poor",
        2: "Fair",
        3: "Good",
        4: "Very Good",
        5: "Excellent"
    };

    stars.forEach(star => {
        star.addEventListener('mouseover', function () {
            const val = parseInt(this.getAttribute('data-value'));
            highlightStars(val);
        });

        star.addEventListener('mouseout', function () {
            highlightStars(currentRating);
        });

        star.addEventListener('click', function () {
            const newRating = parseInt(this.getAttribute('data-value'));
            if (currentRating !== newRating) {
                currentRating = newRating;
                highlightStars(currentRating);
                ratingText.textContent = ratingDescriptions[currentRating];
                renderChips(currentRating);

                if (currentRating === 5 && typeof confetti === 'function') {
                    confetti({
                        particleCount: 150,
                        spread: 80,
                        origin: { y: 0.6 },
                        colors: ['#9DCBE4', '#D5E4F4', '#1E6B94', '#FFD700', '#ffffff'] // Sky & Ice blue + Gold confetti
                    });
                }
            }
        });
    });

    function highlightStars(val) {
        stars.forEach(star => {
            const starVal = parseInt(star.getAttribute('data-value'));
            if (starVal <= val) {
                star.classList.add('active');
            } else {
                star.classList.remove('active');
            }
        });
    }

    // Carousel Logic
    const carouselCard = document.getElementById('carousel-card');
    const carouselText = document.getElementById('carousel-text');
    const carouselControls = document.getElementById('carousel-controls');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const carouselDots = document.getElementById('carousel-dots');

    let currentMessageIndex = 0;
    let currentChipsList = [];
    let selectedMessage = "";

    function getPromptsForRating(rating, count = 1) {
        const pool = (window.ALL_COMMENTS && window.ALL_COMMENTS[rating]) || (typeof ALL_COMMENTS !== 'undefined' ? ALL_COMMENTS[rating] : []) || [];
        if (!pool.length) return [""];

        let used = [];
        try {
            used = JSON.parse(localStorage.getItem('gram_used_reviews') || '[]');
        } catch (e) {
            used = [];
        }

        let available = pool.filter(msg => !used.includes(msg));
        if (available.length < count) {
            available = [...pool];
            try {
                localStorage.setItem('gram_used_reviews', JSON.stringify([]));
            } catch (e) { }
        }

        // Shuffle
        const shuffled = [...available];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }

        // 1 curated comment first, 1 blank card next for custom writing
        return [...shuffled.slice(0, count), ""];
    }

    function markReviewUsed(msg) {
        if (!msg) return;
        try {
            let used = JSON.parse(localStorage.getItem('gram_used_reviews') || '[]');
            if (!used.includes(msg)) {
                used.push(msg);
                localStorage.setItem('gram_used_reviews', JSON.stringify(used));
            }
        } catch (e) { }
    }

    function updateCarousel() {
        if (currentChipsList.length === 0) return;

        carouselText.value = currentChipsList[currentMessageIndex];
        selectedMessage = carouselText.value.trim();

        if (currentChipsList[currentMessageIndex] === "") {
            carouselText.placeholder = "Write your review here...";
        } else {
            carouselText.placeholder = "";
        }

        // Update dots
        const dots = carouselDots.querySelectorAll('.dot');
        dots.forEach((dot, index) => {
            if (index === currentMessageIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });

        // Update buttons state
        prevBtn.disabled = currentMessageIndex === 0;
        nextBtn.disabled = currentMessageIndex === currentChipsList.length - 1;

        checkSubmitState();
    }

    // Allow typing in the textarea
    carouselText.addEventListener('input', () => {
        selectedMessage = carouselText.value.trim();
        currentChipsList[currentMessageIndex] = carouselText.value;
        checkSubmitState();
    });

    // Focus textarea when card is clicked
    carouselCard.addEventListener('click', () => {
        carouselText.focus();
    });

    prevBtn.addEventListener('click', () => {
        if (currentMessageIndex > 0) {
            currentMessageIndex--;
            updateCarousel();
        }
    });

    nextBtn.addEventListener('click', () => {
        if (currentMessageIndex < currentChipsList.length - 1) {
            currentMessageIndex++;
            updateCarousel();
        }
    });

    function renderChips(rating) {
        currentMessageIndex = 0;
        selectedMessage = "";
        checkSubmitState();

        if (rating === 0) {
            carouselText.value = "";
            carouselText.placeholder = "Please select a star rating first";
            carouselControls.style.display = "none";
            return;
        }

        currentChipsList = getPromptsForRating(rating, 1);

        if (currentChipsList.length > 0) {
            carouselControls.style.display = "flex";
            carouselText.placeholder = "Write your review here...";

            // Create dots
            carouselDots.innerHTML = '';
            currentChipsList.forEach((_, index) => {
                const dot = document.createElement('div');
                dot.className = 'dot';
                if (index === 0) dot.classList.add('active');
                carouselDots.appendChild(dot);
            });

            updateCarousel();
        } else {
            carouselControls.style.display = "none";
            carouselText.value = "";
            carouselText.placeholder = "No messages available";
        }
    }

    // Submit Logic
    const submitBtn = document.getElementById('submit-btn');

    // Exact Google Review link provided by user
    const GOOGLE_REVIEW_URL = "https://g.page/r/CfBwzW-LSEE0EBM/review";

    const WHATSAPP_NUMBER = "918290911347";

    function checkSubmitState() {
        if (currentRating > 0 && selectedMessage !== "") {
            submitBtn.removeAttribute('disabled');
            if (currentRating <= 2) {
                submitBtn.innerHTML = '<i class="fa-brands fa-whatsapp"></i> Share Feedback';
            } else {
                submitBtn.innerHTML = '<i class="fa-regular fa-copy"></i> Copy & Post on Google';
            }
        } else {
            submitBtn.setAttribute('disabled', 'true');
            submitBtn.innerHTML = '<i class="fa-regular fa-copy"></i> Copy & Post on Google';
        }
    }

    // Modal Logic
    const reviewModal = document.getElementById('review-modal');
    const modalOkBtn = document.getElementById('modal-ok-btn');

    if (modalOkBtn) {
        modalOkBtn.addEventListener('click', () => {
            window.location.href = GOOGLE_REVIEW_URL;
        });
    }

    submitBtn.addEventListener('click', () => {
        if (submitBtn.disabled) return;
        markReviewUsed(selectedMessage);

        if (currentRating <= 2) {
            // WhatsApp Redirection
            let message = selectedMessage;
            let whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
            window.location.href = whatsappUrl;
        } else {
            // Copy to clipboard for Google Review
            navigator.clipboard.writeText(selectedMessage).then(() => {
                // Open instruction modal
                if (reviewModal) {
                    reviewModal.classList.add('active');
                }
            }).catch(err => {
                console.error('Failed to copy text: ', err);
                // Open modal even if clipboard write had permission issues
                if (reviewModal) {
                    reviewModal.classList.add('active');
                }
            });
        }
    });
});
