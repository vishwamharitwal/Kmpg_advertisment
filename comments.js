// Short & Punchy Dynamic Review Synthesis for K.M. Advertising & Publicity Services
// Keeps reviews natural, crisp (8-14 words), and non-repetitive

const REVIEW_PARTS = {
    5: {
        // Short Actions & Praises (Part 1)
        action: [
            "Awesome quality and timely work,",
            "Visiting cards print quality bohot premium aayi,",
            "Flex banners ke colors bilkul sharp aur vibrant hain,",
            "Corporate gift hampers ki packaging aur finish superb thi,",
            "Super attractive designs aur great team support,",
            "Urgent printing order deadline se pehle deliver kar diya,",
            "Heavy paper GSM aur velvet touch lamination lajawab hai,",
            "Best printing and advertising service in town,",
            "Great services aur bohot cooperative staff mila,",
            "Outdoor publicity banners ki visibility aur material tough hai,",
            "Wholesale rates par top quality finishing mili,",
            "Brochures aur catalogs ki print clarity ekdum clear hai,",
            "Diwali corporate gifts sabhi clients ko bohot pasand aaye,",
            "3D Acrylic glow signage board bohot elegant lag raha hai,",
            "Laser engraved metal pens aur customized diaries top class hain,"
        ],

        // Short Closing / Wrap (Part 2)
        wrap: [
            "highly recommended!",
            "truly satisfied with K.M. Advertising.",
            "full 5 stars for the work!",
            "will definitely order again.",
            "best printing experience.",
            "definitely recommended for commercial print.",
            "keep up the great work team!",
            "100% reliable and professional service.",
            "super happy with the final result."
        ],

        // Standalone One-Liners (Direct, Crisp & Real)
        shortPunches: [
            "Awesome quality and timely work.",
            "Super attractive and great team support.",
            "Great services! Truly impressed with the quality.",
            "Awesome quality and timely work by K.M. Advertising team.",
            "Super attractive designs and excellent finishing.",
            "Great services, polite staff and genuine pricing.",
            "Best printing quality and fast delivery. 5 stars!",
            "Visiting cards quality is superb, highly recommended.",
            "Urgent banner print time par mil gaya, thank you!",
            "Corporate gifts packaging was top notch and professional.",
            "Very cooperative team and high resolution printing.",
            "Top class flex printing at reasonable rates.",
            "Velvet touch visiting cards look very classy and neat.",
            "Reliable printing press with on-time delivery commitments.",
            "Great print clarity and rich colors on all banners."
        ]
    },
    4: [
        "Print quality is good and delivered on time. Recommended.",
        "Flex printing aur banner quality satisfying thi. Reasonable rates.",
        "Good experience with K.M. Advertising. Clean visiting cards cutting.",
        "Corporate gifts items achhe the, overall packaging satisfying rahi.",
        "Prompt proofs over WhatsApp and timely response from team."
    ],
    3: [
        "Printing quality is decent for general promotional work.",
        "Standard flex material quality, acceptable delivery time.",
        "Basic visiting cards print work was fine."
    ],
    2: [
        "Visiting cards cutting alignment me thoda issue tha, improve karein.",
        "Print colors thode dull the, delivery coordination improve karein."
    ],
    1: [
        "Print quality expectations se kam thi aur delivery me delay hua."
    ]
};

/**
 * Dynamically generates short, punchy (8-14 words) natural reviews.
 * Combines short one-liners and 2-part crisp phrases.
 */
function generateDynamicReviews(rating, count = 2) {
    if (rating !== 5) {
        const pool = REVIEW_PARTS[rating] || [];
        const shuffled = [...pool].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    }

    const { action, wrap, shortPunches } = REVIEW_PARTS[5];
    const results = [];
    const usedCombos = new Set();

    while (results.length < count) {
        let review = "";
        // 50% chance of a crisp 1-liner, 50% chance of a short 2-part phrase
        if (Math.random() < 0.5 && shortPunches.length > 0) {
            review = shortPunches[Math.floor(Math.random() * shortPunches.length)];
        } else {
            const act = action[Math.floor(Math.random() * action.length)];
            const wr = wrap[Math.floor(Math.random() * wrap.length)];
            review = `${act} ${wr}`;
        }

        if (!usedCombos.has(review)) {
            usedCombos.add(review);
            results.push(review);
        }
    }

    return results;
}

// Global exposure
if (typeof window !== 'undefined') {
    window.generateDynamicReviews = generateDynamicReviews;
    window.ALL_COMMENTS = REVIEW_PARTS;
}
if (typeof module !== 'undefined') {
    module.exports = { REVIEW_PARTS, generateDynamicReviews };
}
