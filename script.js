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

    function getPromptsForRating(rating, count = 2) {
        // Dynamic sentence mixing engine to prevent Google AI duplicate spam detection
        if (typeof window.generateDynamicReviews === 'function') {
            const dynamicPrompts = window.generateDynamicReviews(rating, count);
            return [...dynamicPrompts, ""];
        }

        const pool = (window.ALL_COMMENTS && window.ALL_COMMENTS[rating]) || (typeof ALL_COMMENTS !== 'undefined' ? ALL_COMMENTS[rating] : []) || [];
        if (!pool.length) return [""];

        let used = [];
        try {
            used = JSON.parse(localStorage.getItem('km_used_reviews') || '[]');
        } catch (e) {
            used = [];
        }

        let available = pool.filter(msg => !used.includes(msg));
        if (available.length < count) {
            available = [...pool];
            try {
                localStorage.setItem('km_used_reviews', JSON.stringify([]));
            } catch (e) { }
        }

        const shuffled = [...available];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }

        return [...shuffled.slice(0, count), ""];
    }

    function markReviewUsed(msg) {
        if (!msg) return;
        try {
            let used = JSON.parse(localStorage.getItem('km_used_reviews') || '[]');
            if (!used.includes(msg)) {
                used.push(msg);
                localStorage.setItem('km_used_reviews', JSON.stringify(used));
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

    // Submit Logic & Soft Gating
    const submitBtn = document.getElementById('submit-btn');
    const secondaryGoogleWrap = document.getElementById('secondary-google-wrap');
    const secondaryGoogleBtn = document.getElementById('secondary-google-btn');
    const helperText = document.getElementById('helper-text');

    // Exact Google Review link provided by user
    const GOOGLE_REVIEW_URL = "https://g.page/r/CfBwzW-LSEE0EBM/review";
    const WHATSAPP_NUMBER = "918740064577";

    function checkSubmitState() {
        if (currentRating > 0 && selectedMessage !== "") {
            submitBtn.removeAttribute('disabled');
            if (currentRating <= 2) {
                submitBtn.innerHTML = '<i class="fa-brands fa-whatsapp"></i> Chat on WhatsApp (Instant Support)';
                if (secondaryGoogleWrap) secondaryGoogleWrap.style.display = 'block';
                if (helperText) helperText.textContent = "Owner se direct support paayein, ya neeche Google par continue karein";
            } else {
                submitBtn.innerHTML = '<i class="fa-regular fa-copy"></i> Copy & Post on Google';
                if (secondaryGoogleWrap) secondaryGoogleWrap.style.display = 'none';
                if (helperText) helperText.textContent = "Review copy ho jayega, bas Google review page par paste kar dein";
            }
        } else {
            submitBtn.setAttribute('disabled', 'true');
            submitBtn.innerHTML = '<i class="fa-regular fa-copy"></i> Copy & Post on Google';
            if (secondaryGoogleWrap) secondaryGoogleWrap.style.display = 'none';
            if (helperText) helperText.textContent = "Review copy ho jayega, bas Google review page par paste kar dein";
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

    function copyAndProceedToGoogle(textToCopy) {
        markReviewUsed(textToCopy);
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(textToCopy).then(() => {
                if (reviewModal) reviewModal.classList.add('active');
            }).catch(() => {
                if (reviewModal) reviewModal.classList.add('active');
            });
        } else {
            const tempTextArea = document.createElement('textarea');
            tempTextArea.value = textToCopy;
            document.body.appendChild(tempTextArea);
            tempTextArea.select();
            try {
                document.execCommand('copy');
            } catch (e) { }
            document.body.removeChild(tempTextArea);
            if (reviewModal) reviewModal.classList.add('active');
        }
    }

    // Secondary Google Button (Soft Gating Policy Compliance)
    if (secondaryGoogleBtn) {
        secondaryGoogleBtn.addEventListener('click', () => {
            copyAndProceedToGoogle(selectedMessage);
        });
    }

    submitBtn.addEventListener('click', () => {
        if (submitBtn.disabled) return;

        if (currentRating <= 2) {
            // WhatsApp Redirection
            markReviewUsed(selectedMessage);
            let message = `Customer Feedback: ${selectedMessage}`;
            let whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
            window.location.href = whatsappUrl;
        } else {
            // Copy to clipboard for Google Review
            copyAndProceedToGoogle(selectedMessage);
        }
    });
});
