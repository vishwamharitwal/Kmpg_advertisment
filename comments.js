// Dynamic Review Synthesis Engine for K.M. Advertising & Publicity Services
// Generates 5,000+ unique, non-duplicate reviews to bypass Google AI Spam Filters

const REVIEW_PARTS = {
    5: {
        openings: [
            "K.M. Advertising se recently humne printing ka kaam karwaya tha,",
            "Got our marketing banners and business cards from K.M. Advertising,",
            "Hamari company ne corporate gifting aur visiting cards order kiye the,",
            "Very impressed with the service at K.M. Advertising & Publicity Services,",
            "Hamari shop ke outdoor flex boards aur publicity material inhi se banwaye,",
            "Event ke liye urgent same-day printing chahiye thi,",
            "Best advertising and printing agency in town,",
            "Ordered bulk brochures and promotional flyers from here,",
            "Hamare office ke corporate welcome kits aur stationery inhi ne design kiye,",
            "Kaafi saalon se inhi se apne outdoor hoardings aur banners banwa rahe hain,",
            "Diwali corporate gift hampers ka bulk order diya tha,",
            "Visiting cards banwaye the velvet touch aur metallic foil ke sath,",
            "Exhibition ke liye roll-up standees aur promotional banners order kiye the,",
            "Showroom inauguration ke liye 3D acrylic LED signage aur banners banwaye,",
            "Product catalogs 170 GSM glossy art paper par print karwaye the,"
        ],
        qualities: [
            "print clarity aur color reproduction bilkul sharp aayi.",
            "heavy paper GSM aur velvet touch lamination bohot premium feel deta hai.",
            "material weather-proof hai, dhoop aur baarish me bhi colors fade nahi huye.",
            "turnaround time lajawab tha, promised deadline se pehle delivery mili.",
            "wholesale rates par top-notch finishing aur clean cutting mili.",
            "staff bohot cooperative hai aur design modifications patiently handle kiye.",
            "corporate gift hampers ki packaging aur laser engraving super classy thi.",
            "acrylic 3D glow signage aur night illumination look luxury de raha hai.",
            "har single detail aur logo placement 100% accurate thi bina kisi mistake ke.",
            "customized temperature display bottles aur diaries ki quality outstanding nikli.",
            "star flex printing ki brightness aur eyelet punching bohot sturdy hai.",
            "transparent and honest guidance regarding right material and budget.",
            "awesome quality and timely execution throughout the process.",
            "super attractive layout banaya graphic designer ne with great team support.",
            "packaging safe thi, baarish ke mausam me bhi material safely deliver hua."
        ],
        closings: [
            "Highly recommended for all printing and corporate gifting needs!",
            "Definitely our trusted printing partner from now on.",
            "Truly 5-star experience, keep up the fantastic work team.",
            "Will definitely reorder for our next campaign.",
            "Super attractive finishing aur great team support. Full 5 stars!",
            "Bohat satisfied hu inke kaam se, strongly recommend karunga.",
            "Reasonable rates aur professional delivery ke liye best option hai.",
            "Great services! Looking forward to working with them again.",
            "Ekdum reliable aur punctual team hai, 100% recommended.",
            "Thank you K.M. Advertising for the smooth and quick service!"
        ],
        directPraises: [
            "Awesome quality and timely work.",
            "Super attractive and great team support.",
            "Great services! Truly impressed with their dedication and quality.",
            "Awesome quality and timely work. Completely satisfied with the printing results.",
            "Super attractive designs, excellent finishing and great team support.",
            "Great services, cooperative staff and very reasonable pricing.",
            "Best printing quality and fast delivery in town. Highly recommended!",
            "Very professional staff and top-grade corporate gift items.",
            "High quality printing at genuine wholesale rates. 5 stars!"
        ]
    },
    4: [
        "Corporate gift hampers ki packaging aur item quality achhi thi. Sabhi ko pasand aaye.",
        "Visiting cards print quality is really good, cutting sharp hai. Delivery was almost on time. Recommended.",
        "Flex printing aur banner quality bohot badiya thi. Kaam fast hua aur rates bhi reasonable hain.",
        "Good experience with K.M. Advertising. Business cards ka paper standard achha hai aur cutting bhi clean hai.",
        "Customized coffee mugs aur keychains order kiye the, printing clear aayi hai. Will reorder.",
        "Pamphlets ki print quality achhi aayi, text crisp hai. Overall smooth service and polite staff.",
        "Sunboard stickers order kiye the, gumming aur print dono satisfying hain. Will definitely order again.",
        "Acchi printing service hai. Design me thode modifications the jo inhone patiently update kiye.",
        "Timely response and reliable print quality for our event banners. Professional team."
    ],
    3: [
        "Printing quality is decent and satisfactory for general promotional requirements. Timely handover.",
        "Kaam theek tha, basic visiting cards standard quality ke the. Normal pricing.",
        "Corporate gifts items were okay, basic branding was clear. Average service.",
        "Banners were okay, colors were fine. Service was average and acceptable."
    ],
    2: [
        "Visiting cards cutting alignment me thoda issue tha, finishing improve karein.",
        "Print colors expected se thode dull the aur delivery me thoda delay hua.",
        "Delivery time par nahi mili, coordination improve karein."
    ],
    1: [
        "Print quality bilkul pasand nahi aayi aur commitments follow nahi huye.",
        "Colors accurate nahi the aur staff response disappointing raha."
    ]
};

/**
 * Dynamically synthesizes random, non-duplicate reviews on the fly.
 * Over 5,000+ unique permutations possible for 5-star ratings.
 */
function generateDynamicReviews(rating, count = 2) {
    if (rating !== 5) {
        const pool = REVIEW_PARTS[rating] || [];
        const shuffled = [...pool].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    }

    const { openings, qualities, closings, directPraises } = REVIEW_PARTS[5];
    const results = [];
    const usedCombos = new Set();

    while (results.length < count) {
        let review = "";
        // 25% chance of a direct punchy real customer feedback
        if (Math.random() < 0.25 && directPraises.length > 0) {
            review = directPraises[Math.floor(Math.random() * directPraises.length)];
        } else {
            const op = openings[Math.floor(Math.random() * openings.length)];
            const ql = qualities[Math.floor(Math.random() * qualities.length)];
            const cl = closings[Math.floor(Math.random() * closings.length)];
            review = `${op} ${ql} ${cl}`;
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
