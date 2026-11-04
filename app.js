// app.js - DealScout Final Competition Version
// Includes: Strict Gmail Password Matching + Clear Saved Deals on Logout + Seasonal Above Hot Deals + Search Auto-Scroll to Category

let savedDeals = JSON.parse(localStorage.getItem('dealScoutSaved')) || [];
const recoloredImageCache = {};

// ==========================================================================
// 0. PREDEFINED ADMIN ACCOUNTS (2 ADMINS) & 21 CUSTOMERS ANALYTICS DATA
// ==========================================================================
const ADMIN_ACCOUNTS = [
    { username: "admin1", password: "admin123" },
    { username: "admin2", password: "admin456" }
];

const DEFAULT_ANALYTICS_DATA = {
    october2026: {
        totalSaveDeals: 44,
        customers: [
            { email: "kyawzayar99@gmail.com", password: "kz2026!ygn", loginCount: 3, saveCount: 4, lastLogin: "2026-10-31 08:42 PM" },
            { email: "suhtet.ygn@gmail.com", password: "suhtet8899", loginCount: 2, saveCount: 3, lastLogin: "2026-10-30 04:15 PM" },
            { email: "thura.aung@gmail.com", password: "thura4567", loginCount: 1, saveCount: 2, lastLogin: "2026-10-29 11:30 AM" },
            { email: "maythu.beauty@gmail.com", password: "maythu2026", loginCount: 3, saveCount: 3, lastLogin: "2026-10-28 06:50 PM" },
            { email: "linnhtet.it@gmail.com", password: "linn9090#", loginCount: 2, saveCount: 2, lastLogin: "2026-10-27 09:20 AM" },
            { email: "aungmin.khant@gmail.com", password: "amk778899", loginCount: 1, saveCount: 1, lastLogin: "2026-10-26 03:12 PM" },
            { email: "hninwai.lwin@gmail.com", password: "hninwai123", loginCount: 3, saveCount: 4, lastLogin: "2026-10-25 07:05 PM" },
            { email: "minkhant.dev@gmail.com", password: "mkdev2026!", loginCount: 2, saveCount: 2, lastLogin: "2026-10-24 01:40 PM" },
            { email: "ei.mon.kyaw@gmail.com", password: "eimon5566", loginCount: 1, saveCount: 1, lastLogin: "2026-10-23 10:15 AM" },
            { email: "zawye.htet@gmail.com", password: "zawye3344", loginCount: 3, saveCount: 3, lastLogin: "2026-10-22 05:25 PM" },
            { email: "phyo.thiri@gmail.com", password: "phyo9900!", loginCount: 2, saveCount: 2, lastLogin: "2026-10-21 08:10 PM" },
            { email: "kaung.myat@gmail.com", password: "kaung1122", loginCount: 1, saveCount: 1, lastLogin: "2026-10-20 02:55 PM" },
            { email: "myat.noe.wai@gmail.com", password: "myatnoe77", loginCount: 2, saveCount: 3, lastLogin: "2026-10-19 06:30 PM" },
            { email: "waiyan.oo@gmail.com", password: "waiyan888", loginCount: 3, saveCount: 2, lastLogin: "2026-10-18 11:45 AM" },
            { email: "shwe.yamin@gmail.com", password: "shwe2026@", loginCount: 1, saveCount: 2, lastLogin: "2026-10-16 04:05 PM" },
            { email: "hein.htet.z@gmail.com", password: "heinhtet9", loginCount: 2, saveCount: 1, lastLogin: "2026-10-14 09:50 AM" },
            { email: "yu.ya.mon@gmail.com", password: "yuyamon55", loginCount: 3, saveCount: 3, lastLogin: "2026-10-12 07:20 PM" },
            { email: "nyan.linn@gmail.com", password: "nyanlin44", loginCount: 1, saveCount: 1, lastLogin: "2026-10-10 03:35 PM" },
            { email: "chit.su.wai@gmail.com", password: "chitsu321", loginCount: 2, saveCount: 2, lastLogin: "2026-10-08 01:15 PM" },
            { email: "paing.soe@gmail.com", password: "paing6543", loginCount: 1, saveCount: 1, lastLogin: "2026-10-05 10:40 AM" },
            { email: "khin.myat.noe@gmail.com", password: "khinmyat1", loginCount: 2, saveCount: 1, lastLogin: "2026-10-02 05:18 PM" }
        ],
        admins: [
            { username: "admin1", password: "admin123", loginCount: 28, lastLogin: "2026-10-31 09:10 PM" },
            { username: "admin2", password: "admin456", loginCount: 22, lastLogin: "2026-10-30 03:40 PM" }
        ]
    },
    november2026: {
        totalSaveDeals: 0,
        customers: [],
        admins: []
    }
};

function getAnalyticsData() {
    const raw = localStorage.getItem('dealScoutAnalyticsV2');
    if (!raw) {
        localStorage.setItem('dealScoutAnalyticsV2', JSON.stringify(DEFAULT_ANALYTICS_DATA));
        return JSON.parse(JSON.stringify(DEFAULT_ANALYTICS_DATA));
    }
    return JSON.parse(raw);
}

function saveAnalyticsData(data) {
    localStorage.setItem('dealScoutAnalyticsV2', JSON.stringify(data));
}

function getCurrentSession() {
    const raw = localStorage.getItem('dealScoutActiveSession');
    return raw ? JSON.parse(raw) : null;
}

function getCustomerPreferredCategories() {
    const session = getCurrentSession();
    return (session && session.role === 'customer' && Array.isArray(session.preferredCategories))
        ? session.preferredCategories
        : [];
}

function formatNowDateTime() {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const d = String(now.getDate()).padStart(2, '0');
    let hrs = now.getHours();
    const mins = String(now.getMinutes()).padStart(2, '0');
    const secs = String(now.getSeconds()).padStart(2, '0');
    const ampm = hrs >= 12 ? 'PM' : 'AM';
    hrs = hrs % 12 || 12;
    return `${y}-${m}-${d} ${String(hrs).padStart(2, '0')}:${mins}:${secs} ${ampm}`;
}

// Strict Customer Gmail & Password Verification + Recording
function verifyAndRecordCustomerLogin(email, password) {
    const data = getAnalyticsData();
    const nowStr = formatNowDateTime();
    const lowerEmail = email.toLowerCase();

    const existingNov = data.november2026.customers.find(c => c.email.toLowerCase() === lowerEmail);
    const existingOct = data.october2026.customers.find(c => c.email.toLowerCase() === lowerEmail);
    const registeredAccount = existingNov || existingOct;

    // If this Gmail has logged in before, require the exact same password!
    if (registeredAccount && registeredAccount.password !== password) {
        return {
            success: false,
            message: "Incorrect password for this Gmail account! Please enter your registered password."
        };
    }

    if (existingNov) {
        existingNov.loginCount += 1;
        existingNov.lastLogin = nowStr;
    } else {
        data.november2026.customers.unshift({
            email: lowerEmail,
            password: password,
            loginCount: 1,
            saveCount: 0,
            lastLogin: nowStr
        });
    }

    saveAnalyticsData(data);
    return { success: true };
}

function recordAdminLogin(username, password) {
    const data = getAnalyticsData();
    const nowStr = formatNowDateTime();
    let existing = data.november2026.admins.find(a => a.username.toLowerCase() === username.toLowerCase());
    if (existing) {
        existing.loginCount += 1;
        existing.password = password;
        existing.lastLogin = nowStr;
    } else {
        data.november2026.admins.unshift({
            username: username,
            password: password,
            loginCount: 1,
            lastLogin: nowStr
        });
    }
    saveAnalyticsData(data);
}

function incrementCustomerSaveCount() {
    const session = getCurrentSession();
    const data = getAnalyticsData();
    data.november2026.totalSaveDeals = (data.november2026.totalSaveDeals || 0) + 1;

    if (session && session.role === 'customer') {
        const cust = data.november2026.customers.find(c => c.email.toLowerCase() === session.identifier.toLowerCase());
        if (cust) {
            cust.saveCount = (cust.saveCount || 0) + 1;
        }
    }
    saveAnalyticsData(data);
}

// ==========================================================================
// 1. MASTER CATALOG: 32 PRODUCTS WITH NOV 5 COMPETITION EXPIRY TIMERS
// ==========================================================================
const REAL_PRODUCT_DATABASE = {
    // ---------------- FASHION (1 - 8) ----------------
    "Nike Air Zoom": {
        exactTitle: "Nike Free RN Running Sneakers",
        mainCat: "fashion",
        expiry: "2026-11-07T22:00:00",
        validText: "Valid until: Nov 7, 2026",
        productKeywords: "shoe shoes sneaker sneakers footwear running nike",
        mainImg: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=700&q=80",
        store: "Light-Sneakers Shop",
        location: "No.57, Mingalar St & Pannchan St Corner, Sanchaung, Yangon",
        locationFull: "Light-Sneakers Shop - No.57, Mingalar St & Pannchan St Corner, Sanchaung, Yangon",
        mapLink: "https://maps.app.goo.gl/dYFPQQ5WZbpi1N5J7",
        mapQuery: "Light-Sneakers Shop, 57 Mingalar Street, Sanchaung Township, Yangon",
        colors: [
            { name: "Crimson Red", hex: "#DC2626", mode: "original" },
            { name: "Stealth Black", hex: "#1E293B", mode: "nike-black" }
        ],
        sizeInfo: "EU 40, EU 41, EU 42, EU 43",
        description: "Engineered breathable mesh upper with lightweight flexible sole for running and everyday wear."
    },
    "Adidas": {
        exactTitle: "Adidas EQT Bask ADV Sneakers",
        mainCat: "fashion",
        expiry: "2026-11-09T21:00:00",
        validText: "Valid until: Nov 9, 2026",
        productKeywords: "shoe shoes sneaker sneakers footwear adidas eqt",
        mainImg: "https://images.unsplash.com/photo-1518002171953-a080ee817e1f?auto=format&fit=crop&w=700&q=80",
        store: "Orchid Fashion Boutique",
        location: "No.10, Kwin Kyaung 1st St, Ahlone, Yangon",
        locationFull: "Orchid Fashion Boutique — No.10, Kwin Kyaung 1st St, Ahlone, Yangon",
        mapLink: "https://maps.app.goo.gl/jAnxfoWfLAkEZugx6",
        mapQuery: "Orchid Fashion Boutique, No.10 Kwin Kyaung 1st St, Ahlone, Yangon",
        colors: [],
        sizeInfo: "EU 40, EU 41, EU 42, EU 43",
        description: "Basketball-inspired Adidas EQT Bask ADV knit sneakers with sculpted PU midsole and rubber outsole."
    },
    "Linen Casual Shirt": {
        exactTitle: "Cotton Casual Button-Down Shirt",
        mainCat: "fashion",
        expiry: "2026-11-05T23:00:00",
        validText: "Valid until: Nov 5, 2026",
        productKeywords: "clothing clothes shirt shirts cotton casual top apparel",
        mainImg: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=700&q=80",
        store: "Fashmob",
        location: "Golden Link Condo, Link Street, Bahan, Yangon",
        locationFull: "Fashmob — Golden Link Condo, Link Street, Bahan, Yangon",
        mapLink: "https://maps.app.goo.gl/wE77fbgpVLR81dvAA",
        mapQuery: "Fashmob, Golden Link Condo, Link Street, Bahan, Yangon",
        colors: [
            { name: "Sky Blue", hex: "#93C5FD", mode: "original" },
            { name: "Sage Olive", hex: "#65A30D", mode: "shirt-olive" }
        ],
        sizeInfo: "S, M, L, XL",
        description: "Lightweight, breathable cotton weave shirt designed for everyday comfort in Yangon weather."
    },
    "Denim Jacket": {
        exactTitle: "Classic Fit Denim Jacket",
        mainCat: "fashion",
        expiry: "2026-11-11T22:00:00",
        validText: "Valid until: Nov 11, 2026",
        productKeywords: "clothing clothes jacket jackets denim coat outerwear apparel",
        mainImg: "https://images.unsplash.com/photo-1551537482-f2075a1d41f2?auto=format&fit=crop&w=700&q=80",
        store: "Nang Closet",
        location: "No.9, Wai Zayan Dar Street & Aung Thukha Street corner, Thingangyun",
        locationFull: "Nang Closet - No.9, Wai Zayan Dar Street & Aung Thukha Street corner, Thingangyun",
        mapLink: "https://maps.app.goo.gl/Fd93D7cTnF2KAsFD9",
        mapQuery: "Nang Closet, Wai Zayantar Road & Aung Thukha Street, Thingangyun, Yangon",
        colors: [],
        sizeInfo: "M, L, XL",
        description: "Authentic classic-fit denim trucker jacket with metal button closures and chest flap pockets."
    },
    "Crossbody Bag": {
        exactTitle: "Classic Leather Crossbody Bag",
        mainCat: "fashion",
        expiry: "2026-11-08T20:00:00",
        validText: "Valid until: Nov 8, 2026",
        productKeywords: "bag bags handbag leather crossbody purse",
        mainImg: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=700&q=80",
        store: "The Classy Branded Collection",
        location: "Sedona Hotel Court, Kabar Aye Pagoda Rd, Yangon",
        locationFull: "The Classy Branded Collection - Sedona Hotel Court, Kabar Aye Pagoda Rd, Yangon",
        mapLink: "https://maps.app.goo.gl/caZJtXd1cBAzzKUg8",
        mapQuery: "Sedona Hotel Yangon, Kabar Aye Pagoda Rd, Yangon",
        colors: [],
        sizeInfo: "One Size (Adjustable Strap)",
        description: "Handcrafted genuine leather crossbody bag with adjustable strap and brass buckle closure."
    },
    "Everyday Tote Bag": {
        exactTitle: "Structured Everyday Tote Bag",
        mainCat: "fashion",
        expiry: "2026-11-01T11:00:00",
        validText: "Valid until: Nov 1, 2026",
        productKeywords: "bag bags tote handbag shoulder purse",
        mainImg: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=700&q=80",
        store: "MSTY Branded Bags",
        location: "GaMonePwint Mall (E1-07), Mingalar Taung Nyunt, Yangon",
        locationFull: "MSTY Branded Bags - GaMonePwint Mall (E1-07), Mingalar Taung Nyunt, Yangon",
        mapLink: "https://maps.app.goo.gl/R53MiunCe77893Sp8",
        mapQuery: "Ga Mone Pwint Mall, Mingalar Taung Nyunt, Yangon",
        colors: [],
        sizeInfo: "Standard Large (Fits 14\" Laptop)",
        description: "Spacious structured everyday tote bag designed to carry daily essentials with ease."
    },
    "Pendant Necklace": {
        exactTitle: "18K Gold Layered Pendant Necklace",
        mainCat: "fashion",
        expiry: "2026-11-05T23:00:00",
        validText: "Valid until: Nov 5, 2026",
        productKeywords: "jewelry necklace pendant gold chain accessory",
        mainImg: "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&w=700&q=80",
        store: "Fancy House Jewelry",
        location: "No.29 Padonmar St, Yangon",
        locationFull: "Fancy House Jewelry - No.29 Padonmar St, Yangon",
        mapLink: "https://maps.app.goo.gl/FgFtVFUdS8q5vth19",
        mapQuery: "29 Padonmar Street, Sanchaung, Yangon",
        colors: [],
        sizeInfo: "45cm Chain (Adjustable)",
        description: "Hypoallergenic 18K gold-plated pendant necklace with boutique gift box included."
    },
    "Aviator Shades": {
        exactTitle: "Retro Round Frame UV400 Sunglasses",
        mainCat: "fashion",
        expiry: "2026-11-12T20:00:00",
        validText: "Valid until: Nov 12, 2026",
        productKeywords: "sunglasses shades eyewear glasses uv400",
        mainImg: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=700&q=80",
        store: "Grand Optics",
        location: "No.1136, Thu Mingalar Road, 6th Ward, South Okkalapa, Yangon",
        locationFull: "Grand Optics - No.1136, Thu Mingalar Road, 6th Ward, South Okkalapa, Yangon",
        mapLink: "https://maps.app.goo.gl/M55LpFrHBTfD7SJP6",
        mapQuery: "Grand Optics, 1136 Thu Mingalar Road, South Okkalapa, Yangon",
        colors: [],
        sizeInfo: "Standard Adult Fit (52mm Lens)",
        description: "100% UV400 polarized lenses in a lightweight tortoiseshell frame with protective case."
    },

    // ---------------- ELECTRONICS (9 - 16) ----------------
    "Galaxy S24": {
        exactTitle: "Samsung Galaxy S25 Ultra 5G (256GB)",
        mainCat: "electronics",
        expiry: "2026-11-08T21:00:00",
        validText: "Valid until: Nov 8, 2026",
        productKeywords: "phone phones smartphone mobile samsung galaxy s25 ultra 5g",
        mainImg: "https://media.extra.com/s/aurora/100506854_800/SAMSUNG-Galaxy-S26-Ultra%2C-5G%2C-256-GB%2C-Black?locale=en-GB,en-*,*&$Listing-Product-2x$",
        imgFit: "contain",
        store: "Samsung Experience Store",
        location: "No. 192 Kabar Aye Pagoda Rd, Yangon 11081",
        locationFull: "Samsung Experience Store - No. 192 Kabar Aye Pagoda Rd, Yangon 11081",
        mapLink: "https://maps.app.goo.gl/rz8qrEfRg3Ht6dPZA",
        mapQuery: "Samsung Experience Store, 192 Kabar Aye Pagoda Rd, Yangon",
        colors: [
            {
                name: "Titanium Black",
                hex: "#1E293B",
                imgUrl: "https://media.extra.com/s/aurora/100506854_800/SAMSUNG-Galaxy-S26-Ultra%2C-5G%2C-256-GB%2C-Black?locale=en-GB,en-*,*&$Listing-Product-2x$"
            },
            {
                name: "Titanium White",
                hex: "#F8FAFC",
                imgUrl: "https://cdn.shopify.com/s/files/1/0327/9585/2937/files/sm-s948_galaxys26ultra_front_white_251120_sm-s948_galaxys26ultra_front_white_251120_4bpfFmg.jpg?v=1773482865"
            }
        ],
        sizeInfo: "12GB RAM / 256GB Storage",
        description: "Official 1-Year Samsung Myanmar Warranty unit with built-in S-Pen and 200MP Pro-Grade camera."
    },
    "Redmi Note": {
        exactTitle: "Redmi Note 14 Pro 5G",
        mainCat: "electronics",
        expiry: "2026-11-05T23:00:00",
        validText: "Valid until: Nov 5, 2026",
        productKeywords: "phone phones smartphone mobile xiaomi redmi note 14 pro 5g",
        mainImg: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQish_5Z_wjHWWXAEHaFngCoHXGI5Tsegt_9TX6HOlY03MUdDMTGIilswM&s=10",
        imgFit: "contain",
        store: "Anycall Mobile",
        location: "Floor, No (192), Room, Myanmar Plaza Second, 2 Kabar Aye Pagoda Rd, Yangon 11201",
        locationFull: "Anycall Mobile - Floor, No (192), Room, Myanmar Plaza Second, 2 Kabar Aye Pagoda Rd, Yangon 11201",
        mapLink: "https://maps.app.goo.gl/Zscog1RjbJszf6n16",
        mapQuery: "Anycall Mobile, Myanmar Plaza, 192 Kabar Aye Pagoda Rd, Yangon",
        colors: [
            {
                name: "Midnight Black",
                hex: "#1E293B",
                imgUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQish_5Z_wjHWWXAEHaFngCoHXGI5Tsegt_9TX6HOlY03MUdDMTGIilswM&s=10"
            },
            {
                name: "Porcelain White",
                hex: "#F8FAFC",
                imgUrl: "https://ict.com.mm/cdn/shop/files/redmi-note-14-pro-5g-porcelain-white_jpg.webp?v=1780291423&width=720"
            }
        ],
        sizeInfo: "8GB RAM / 256GB Storage",
        description: "120Hz AMOLED display smartphone with triple rear camera system and fast charger in box."
    },
    "ASUS TUF Gaming": {
        exactTitle: "ASUS TUF Gaming F15 (RTX 4060)",
        mainCat: "electronics",
        expiry: "2026-11-10T22:00:00",
        validText: "Valid until: Nov 10, 2026",
        productKeywords: "laptop laptops notebook computer gaming asus tuf f15 rtx",
        mainImg: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=700&q=80",
        store: "MTC-Computer Sales & Services",
        location: "No.161, 38th Street (Middle Block), Kyauktada, Yangon",
        locationFull: "MTC-Computer Sales & Services - No.161, 38th Street (Middle Block), Kyauktada, Yangon",
        mapLink: "https://maps.app.goo.gl/Vf3sF6KhVftsd9JKA",
        mapQuery: "MTC-Computer Sales & Services, 161 38th Street, Kyauktada, Yangon",
        colors: [],
        sizeInfo: "15.6\" FHD 144Hz • 16GB RAM • 512GB SSD",
        description: "Intel Core i7 gaming laptop with NVIDIA GeForce RTX 4060 GPU and 2-Year Official Warranty."
    },
    "Dell Inspiron": {
        exactTitle: "Dell Inspiron 15 Core i7 Laptop",
        mainCat: "electronics",
        expiry: "2026-11-02T14:00:00",
        validText: "Valid until: Nov 2, 2026",
        productKeywords: "laptop laptops notebook computer dell inspiron core i7",
        mainImg: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=700&q=80",
        store: "IT Kingdom",
        location: "Bo Gyoke Aung San Rd, Yangon",
        locationFull: "IT Kingdom - Bo Gyoke Aung San Rd, Yangon",
        mapLink: "https://maps.app.goo.gl/rxCB6HhhdPRSsjDVA",
        mapQuery: "IT Kingdom, Bogyoke Aung San Road, Yangon",
        colors: [],
        sizeInfo: "15.6\" FHD • Core i7 • 16GB RAM • 512GB SSD",
        description: "Sleek silver productivity laptop with Full HD anti-glare display and fast NVMe SSD storage."
    },
    "iPad Air": {
        exactTitle: "Apple iPad Air Wi-Fi (128GB)",
        mainCat: "electronics",
        expiry: "2026-11-11T21:00:00",
        validText: "Valid until: Nov 11, 2026",
        productKeywords: "tablet tablets ipad apple air wifi",
        mainImg: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=700&q=80",
        store: "UNiQUE IT & Mobile Center 3",
        location: "No.171, U Chit Maung Road, Bahan, Yangon",
        locationFull: "UNiQUE IT & Mobile Center 3 - No.171, U Chit Maung Road, Bahan, Yangon",
        mapLink: "https://maps.app.goo.gl/1XvFHosP5FJg5xFJ9",
        mapQuery: "UNiQUE IT & Mobile Center, 171 U Chit Maung Road, Bahan, Yangon",
        colors: [],
        sizeInfo: "10.9-inch Liquid Retina • 128GB Wi-Fi",
        description: "Official Apple Warranty unit featuring Liquid Retina display and Touch ID."
    },
    "Sony": {
        exactTitle: "Sony Wireless Noise Canceling Headphones",
        mainCat: "electronics",
        expiry: "2026-11-09T20:00:00",
        validText: "Valid until: Nov 9, 2026",
        productKeywords: "headphone headphones headset audio wireless sony",
        mainImg: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=700&q=80",
        store: "REMAX Brand Shop Seikanthar",
        location: "No-354/Mahabandula Street/between Seikanthar & MM, 39th St, Yangon 11182",
        locationFull: "REMAX Brand Shop Seikanthar - No-354/Mahabandula Street/between Seikanthar & MM, 39th St, Yangon 11182",
        mapLink: "https://maps.app.goo.gl/WPH4vRy1AwDypoE48",
        mapQuery: "REMAX Brand Shop Seikanthar, 354 Maha Bandula Road, Yangon",
        colors: [],
        sizeInfo: "Over-Ear Bluetooth 5.2 (30-Hr Battery)",
        description: "Active noise cancelation wireless headphones with plush earcups and travel case."
    },
    "JBL Pure Bass": {
        exactTitle: "Wireless Pure Bass On-Ear Headset",
        mainCat: "electronics",
        expiry: "2026-11-05T23:00:00",
        validText: "Valid until: Nov 5, 2026",
        productKeywords: "headphone headphones headset audio wireless bass",
        mainImg: "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=700&q=80",
        store: "Gadgets Corne",
        location: "Corner Of Bagaya St, and Pyay Rd, Yangon 11111",
        locationFull: "Gadgets Corne - Corner Of Bagaya St, and Pyay Rd, Yangon 11111",
        mapLink: "https://maps.app.goo.gl/b6fLZvSCb3co6grS6",
        mapQuery: "Corner Of Bagaya St and Pyay Rd, Sanchaung, Yangon",
        colors: [],
        sizeInfo: "Foldable On-Ear Wireless",
        description: "Lightweight foldable Bluetooth headset featuring deep bass sound and built-in microphone."
    },
    "Canon EOS": {
        exactTitle: "Canon EOS Digital Camera & Lens Kit",
        mainCat: "electronics",
        expiry: "2026-11-07T23:00:00",
        validText: "Valid until: Nov 7, 2026",
        productKeywords: "camera cameras digital canon eos lens photography",
        mainImg: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=700&q=80",
        store: "CameraShopGallery",
        location: "No.182/202, 34th Street, Kyauktada, Yangon",
        locationFull: "CameraShopGallery - No.182/202, 34th Street, Kyauktada, Yangon",
        mapLink: "https://maps.app.goo.gl/3LUzva6oAPKuu161A",
        mapQuery: "CameraShopGallery, 182 34th Street, Kyauktada, Yangon",
        colors: [],
        sizeInfo: "24.2MP Body + 18-55mm Kit Lens",
        description: "Complete Canon camera kit with zoom lens, free 64GB SD memory card, and camera bag."
    },

    // ---------------- BEAUTY (17 - 24) ----------------
    "Velvet Lipstick": {
        exactTitle: "Matte Velvet Lipstick Trio Set",
        mainCat: "beauty",
        expiry: "2026-11-11T22:00:00",
        validText: "Valid until: Nov 11, 2026",
        productKeywords: "cosmetics makeup lipstick lip matte velvet",
        mainImg: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=700&q=80",
        store: "M&M Cosmetic House",
        location: "No. 22, Pan Chann Street, Sanchaung",
        locationFull: "M&M Cosmetic House - No. 22, Pan Chann Street, Sanchaung",
        mapLink: "https://maps.app.goo.gl/zeLMQwzQeT5iP6RB7",
        mapQuery: "M&M Cosmetic House, 22 Pan Chan Street, Sanchaung, Yangon",
        colors: [],
        sizeInfo: "3 x 3.5g Full-Size Lipsticks",
        description: "Richly pigmented, long-wearing matte lipstick trio in signature red, rose, and coral shades."
    },
    "Foundation": {
        exactTitle: "Pro Makeup Brush & Eyeshadow Palette Combo",
        mainCat: "beauty",
        expiry: "2026-11-08T21:00:00",
        validText: "Valid until: Nov 8, 2026",
        productKeywords: "cosmetics makeup brush eyeshadow palette combo",
        mainImg: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=700&q=80",
        store: "K-Beauty House",
        location: "No. 108, Bogyoke Aung San Rd, Corner of Yae Kyaw Rd, Pazundaung",
        locationFull: "K-Beauty House - No. 108, Bogyoke Aung San Rd, Corner of Yae Kyaw Rd, Pazundaung",
        mapLink: "https://maps.app.goo.gl/wYpPGiXUqawEoDrLA",
        mapQuery: "K-Beauty House, 108 Bogyoke Aung San Road, Pazundaung, Yangon",
        colors: [],
        sizeInfo: "12-Shade Palette + 5 Brushes",
        description: "Complete daily makeup essentials bundle with soft synthetic brushes and contouring palette."
    },
    "Glow Skincare": {
        exactTitle: "Hydrating Glow Skincare Full Bundle",
        mainCat: "beauty",
        expiry: "2026-11-05T23:00:00",
        validText: "Valid until: Nov 5, 2026",
        productKeywords: "skincare skin hydrating glow bundle cream cleanser toner",
        mainImg: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=700&q=80",
        store: "Beauty Diary",
        location: "Kamaryut Township, Insein Road, Ward 1, Yangon",
        locationFull: "Beauty Diary - Kamaryut Township, Insein Road, Ward 1, Yangon",
        mapLink: "https://maps.app.goo.gl/NYTAjC1w6a8o6nRc7",
        mapQuery: "Beauty Diary, Insein Road, Ward 1, Kamayut, Yangon",
        colors: [],
        sizeInfo: "4-Piece Full Set (Toner, Serum, Cream, Cleanser)",
        description: "Dermatologically tested hydrating skincare bundle for daily moisture barrier care."
    },
    "COSRX": {
        exactTitle: "Advanced Repair Facial Dropper Serum",
        mainCat: "beauty",
        expiry: "2026-11-07T22:00:00",
        validText: "Valid until: Nov 7, 2026",
        productKeywords: "skincare skin facial serum dropper repair essence",
        mainImg: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=700&q=80",
        store: "The Face Shop",
        location: "11131 Pyay Rd, Yangon",
        locationFull: "The Face Shop - 11131 Pyay Rd, Yangon",
        mapLink: "https://maps.app.goo.gl/rY7YoFGuec4BjpabA",
        mapQuery: "The Face Shop, Pyay Road, Yangon",
        colors: [],
        sizeInfo: "50ml Full-Size Dropper Bottle",
        description: "Intensive skin barrier repair essence and dropper serum formulated for glowing hydration."
    },
    "Eau De Parfum": {
        exactTitle: "Luxury Floral Eau De Parfum (100ml)",
        mainCat: "beauty",
        expiry: "2026-11-01T09:00:00",
        validText: "Valid until: Nov 1, 2026",
        productKeywords: "perfume perfumes fragrance floral parfum scent",
        mainImg: "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=700&q=80",
        store: "30K Perfumes",
        location: "Shwe Bontha, Middle Street, Yangon",
        locationFull: "30K Perfumes - Shwe Bontha, Middle Street, Yangon",
        mapLink: "https://maps.app.goo.gl/pQzUcc55BzHGBQE39",
        mapQuery: "30K Perfumes, Shwe Bontha Street, Pabedan, Yangon",
        colors: [],
        sizeInfo: "100ml Eau De Parfum Spray",
        description: "100% Authentic floral eau de parfum with long-lasting jasmine and warm amber notes."
    },
    "Keratin Hair Spa": {
        exactTitle: "Keratin Hair Spa & Salon Blowout Package",
        mainCat: "beauty",
        expiry: "2026-11-09T20:00:00",
        validText: "Valid until: Nov 9, 2026",
        productKeywords: "hair keratin spa blowout treatment package",
        mainImg: "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=700&q=80",
        store: "V-47 Hair Salon",
        location: "Building 4, No. 4C-411 (03-04), Times City, Kamayut, Yangon",
        locationFull: "V-47 Hair Salon - Building 4, No. 4C-411 (03-04), Times City, Kamayut, Yangon",
        mapLink: "https://maps.app.goo.gl/X4ZcApFHRTjCSwqm6",
        mapQuery: "V-47 Hair Salon, Times City, Kamayut, Yangon",
        colors: [],
        sizeInfo: "90-Minute Full Salon Session",
        description: "Includes deep keratin hair mask, relaxing scalp massage, wash, and professional blowout styling."
    },
    "Hair Styling": {
        exactTitle: "Professional Salon Hair Styling & Care Kit",
        mainCat: "beauty",
        expiry: "2026-11-10T21:00:00",
        validText: "Valid until: Nov 10, 2026",
        productKeywords: "hair styling care kit dryer brush",
        mainImg: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=700&q=80",
        store: "Hair Republic Salon",
        location: "No. 135, 1st Floor, Inya Road, Bahan, Yangon",
        locationFull: "Hair Republic Salon - No. 135, 1st Floor, Inya Road, Bahan, Yangon",
        mapLink: "https://maps.app.goo.gl/jnPRJZ9wdwba4D959",
        mapQuery: "Hair Republic Salon, 135 Inya Road, Bahan, Yangon",
        colors: [],
        sizeInfo: "Complete Salon Styling Set",
        description: "Professional heat styling and hair care kit available at Hair Republic Salon Bahan branch."
    },
    "Gel Nail Art": {
        exactTitle: "Gel Nail Art & Luxury Spa Manicure",
        mainCat: "beauty",
        expiry: "2026-11-05T23:00:00",
        validText: "Valid until: Nov 5, 2026",
        productKeywords: "nail nails gel manicure pedicure polish art",
        mainImg: "https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=700&q=80",
        store: "Luna Studio",
        location: "No. 53-C, 2nd Shwe Taung Kyar St, Golden Valley, Bahan, Yangon",
        locationFull: "Luna Studio - No. 53-C, 2nd Shwe Taung Kyar St, Golden Valley, Bahan, Yangon",
        mapLink: "https://maps.app.goo.gl/HbUrUpL9M9SrmABC8",
        mapQuery: "Luna Studio, 53-C 2nd Shwe Taung Kyar Street, Bahan, Yangon",
        colors: [],
        sizeInfo: "60-Minute Manicure + Custom Gel Art",
        description: "Includes cuticle care, custom gel polish art, hand scrub, and hydrating treatment."
    },

    // ---------------- HOME & LIVING (25 - 32) ----------------
    "Nordic Accent Armchair": {
        exactTitle: "Minimalist Nordic Accent Armchair",
        mainCat: "home",
        expiry: "2026-11-08T20:00:00",
        validText: "Valid until: Nov 8, 2026",
        productKeywords: "furniture armchair chair sofa seat nordic",
        mainImg: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=700&q=80",
        store: "Sweety Home Living Mall",
        location: "No. 296/A-12, Ayeyar Wun Road, Thaketa, Yangon",
        locationFull: "Sweety Home Living Mall - No. 296/A-12, Ayeyar Wun Road, Thaketa, Yangon",
        mapLink: "https://maps.app.goo.gl/zt2SxHRHMV4rojZK7",
        mapQuery: "Sweety Home Living Mall, 296 Ayeyar Wun Road, Thaketa, Yangon",
        colors: [],
        sizeInfo: "W 75cm x D 80cm x H 85cm",
        description: "Solid ash wood frame armchair with high-density foam cushioning for modern living rooms."
    },
    "Office Desk Chair": {
        exactTitle: "Ergonomic Swivel Office Desk Chair",
        mainCat: "home",
        expiry: "2026-11-07T20:00:00",
        validText: "Valid until: Nov 7, 2026",
        productKeywords: "furniture chair desk office swivel ergonomic seat",
        mainImg: "https://images.unsplash.com/photo-1580480055273-228ff5388ef8?auto=format&fit=crop&w=700&q=80",
        store: "Crown Furniture",
        location: "No. 195, Anawrahta Rd, Corner of 13th St, Lanmadaw, Yangon",
        locationFull: "Crown Furniture - No. 195, Anawrahta Rd, Corner of 13th St, Lanmadaw, Yangon",
        mapLink: "https://maps.app.goo.gl/CvT8xKoFbyncc7jJ9",
        mapQuery: "Crown Furniture, 195 Anawrahta Road, Lanmadaw, Yangon",
        colors: [],
        sizeInfo: "Adjustable Height (110cm – 120cm)",
        description: "Adjustable height and lumbar support ergonomic office chair with 360-degree smooth caster wheels."
    },
    "Pendant Lamp": {
        exactTitle: "Modern Warm LED Dining Pendant Lamp",
        mainCat: "home",
        expiry: "2026-11-05T23:00:00",
        validText: "Valid until: Nov 5, 2026",
        productKeywords: "decor lamp lighting light led pendant ceiling",
        mainImg: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=700&q=80",
        store: "PRO 1 Global Home Center",
        location: "No. 5, Upper Pazundaung Rd, Mingalar Taung Nyunt, Yangon",
        locationFull: "PRO 1 Global Home Center - No. 5, Upper Pazundaung Rd, Mingalar Taung Nyunt, Yangon",
        mapLink: "https://maps.app.goo.gl/mYQbhaJySJHvfRKB7",
        mapQuery: "PRO 1 Global Home Center, 5 Upper Pazundaung Road, Mingalar Taung Nyunt, Yangon",
        colors: [],
        sizeInfo: "35cm Diameter (Adjustable Cord)",
        description: "Energy-saving warm LED dining and living room pendant light fixture."
    },
    "Cotton Bedsheet Set": {
        exactTitle: "Luxury 1000-Thread Cotton Bedsheet Set",
        mainCat: "home",
        expiry: "2026-11-12T22:00:00",
        validText: "Valid until: Nov 12, 2026",
        productKeywords: "bedding bedsheet bed cotton pillow sheet duvet",
        mainImg: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=700&q=80",
        store: "Sweety Home – Kyaik Ka San",
        location: "No. 2A1/16G, East Race Course Road, Tamwe, Yangon",
        locationFull: "Sweety Home – Kyaik Ka San, No. 2A1/16G, East Race Course Road, Tamwe, Yangon",
        mapLink: "https://maps.app.goo.gl/6cmKYuQV4aJmEpRC9",
        mapQuery: "Sweety Home Living Mall, East Race Course Road, Tamwe, Yangon",
        colors: [],
        sizeInfo: "Queen & King Size (4-Piece Set)",
        description: "100% combed cotton bedsheet set including fitted sheet, duvet cover, and 2 pillowcases."
    },
    "Air Fryer": {
        exactTitle: "Pro High-Speed Kitchen Blender (1.5L)",
        mainCat: "home",
        expiry: "2026-11-11T20:00:00",
        validText: "Valid until: Nov 11, 2026",
        productKeywords: "kitchenware kitchen blender mixer juicer appliance",
        mainImg: "https://images.unsplash.com/photo-1570222094114-d054a817e56b?auto=format&fit=crop&w=700&q=80",
        store: "Lock & Lock Official",
        location: "Shop 205, 2nd Floor, Myanmar Plaza, Kabar Aye Pagoda Rd, Bahan",
        locationFull: "Lock & Lock Official - Shop 205, 2nd Floor, Myanmar Plaza, Kabar Aye Pagoda Rd, Bahan",
        mapLink: "https://maps.app.goo.gl/86Jec8vSSszLmeTS9",
        mapQuery: "Lock & Lock, Myanmar Plaza, Kabar Aye Pagoda Road, Bahan, Yangon",
        colors: [],
        sizeInfo: "1.5L Glass Jar • 1000W Copper Motor",
        description: "Heavy-duty stainless steel 6-blade kitchen blender for smoothies, ice crushing, and food prep."
    },
    "Non-Stick Cookware": {
        exactTitle: "6-Piece Non-Stick Granite Cookware Set",
        mainCat: "home",
        expiry: "2026-11-01T12:00:00",
        validText: "Valid until: Nov 1, 2026",
        productKeywords: "kitchenware kitchen cookware pan pot granite cooking",
        mainImg: "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?auto=format&fit=crop&w=700&q=80",
        store: "Mike Mike Steel",
        location: "No. 141, Ground Floor, Lanmadaw Plaza, Lanmadaw, Yangon",
        locationFull: "Mike Mike Steel - No. 141, Ground Floor, Lanmadaw Plaza, Lanmadaw, Yangon",
        mapLink: "https://maps.app.goo.gl/3yr7wiqNrgwQpDi38",
        mapQuery: "Mike Mike Steel, Lanmadaw Plaza, Lanmadaw, Yangon",
        colors: [],
        sizeInfo: "6-Piece Set (Pans, Pots & Glass Lids)",
        description: "PFOA-free non-stick induction cookware set with heat-resistant handles and tempered glass lids."
    },
    "Robot Vacuum": {
        exactTitle: "Smart Robot Vacuum & Floor Mop Cleaner",
        mainCat: "home",
        expiry: "2026-11-10T21:00:00",
        validText: "Valid until: Nov 10, 2026",
        productKeywords: "cleaning vacuum robot mop cleaner floor",
        mainImg: "https://images.unsplash.com/photo-1558317374-067fb5f30001?auto=format&fit=crop&w=700&q=80",
        store: "Hako Myanmar",
        location: "No. 17, Kyauk Myaung Street, Tamwe, Yangon",
        locationFull: "Hako Myanmar - No. 17, Kyauk Myaung Street, Tamwe, Yangon",
        mapLink: "https://maps.app.goo.gl/quwqUobV3fCzsVQQ9",
        mapQuery: "Hako Myanmar, 17 Kyauk Myaung Street, Tamwe, Yangon",
        colors: [],
        sizeInfo: "Auto-Charging Dock Included",
        description: "Automatic smart navigation robot vacuum with strong suction power and low-noise operation."
    },
    "Deep Cleaning Kit": {
        exactTitle: "Eco-Friendly Deep Home Cleaning Kit",
        mainCat: "home",
        expiry: "2026-11-05T23:00:00",
        validText: "Valid until: Nov 5, 2026",
        productKeywords: "cleaning spray brush detergent cloth kit",
        mainImg: "https://images.unsplash.com/photo-1585421514284-efb74c2b69ba?auto=format&fit=crop&w=700&q=80",
        store: "Urban Focus Cleaning Service Myanmar",
        location: "3rd Floor, No. 25, 10th Street, Lanmadaw",
        locationFull: "Urban Focus Cleaning Service Myanmar - 3rd Floor, No. 25, 10th Street, Lanmadaw",
        mapLink: "https://maps.app.goo.gl/mBZbWgYsuCDZMszs6",
        mapQuery: "Urban Focus Cleaning Service Myanmar, 25 10th Street, Lanmadaw, Yangon",
        colors: [],
        sizeInfo: "5-Piece Household Cleaning Bundle",
        description: "Complete household cleaning bundle with multi-surface eco sprays, gloves, and microfiber cloths."
    }
};

// ==========================================================================
// 2. SEASONAL DISCOUNT MAPPING & 8 FEATURED HOT DEALS
// ==========================================================================
const SEASONAL_DEALS_MAPPING = {
    thadingyut: {
        label: "Thadingyut",
        badgeText: "Thadingyut Special",
        products: [
            "18K Gold Layered Pendant Necklace",
            "Samsung Galaxy S25 Ultra 5G (256GB)",
            "Hydrating Glow Skincare Full Bundle",
            "Modern Warm LED Dining Pendant Lamp"
        ]
    },
    christmas: {
        label: "Christmas",
        badgeText: "Christmas Deal",
        products: [
            "Classic Fit Denim Jacket",
            "Apple iPad Air Wi-Fi (128GB)",
            "Matte Velvet Lipstick Trio Set",
            "Minimalist Nordic Accent Armchair"
        ]
    },
    newyear: {
        label: "New Year",
        badgeText: "New Year Offer",
        products: [
            "Nike Free RN Running Sneakers",
            "Sony Wireless Noise Canceling Headphones",
            "Keratin Hair Spa & Salon Blowout Package",
            "Pro High-Speed Kitchen Blender (1.5L)"
        ]
    },
    monsoon: {
        label: "MonSoon Season",
        badgeText: "MonSoon Promo",
        products: [
            "Adidas EQT Bask ADV Sneakers",
            "Redmi Note 14 Pro 5G",
            "Advanced Repair Facial Dropper Serum",
            "Smart Robot Vacuum & Floor Mop Cleaner"
        ]
    }
};

const EIGHT_HOT_DEAL_TITLES = [
    "Nike Free RN Running Sneakers",
    "18K Gold Layered Pendant Necklace",
    "Sony Wireless Noise Canceling Headphones",
    "Redmi Note 14 Pro 5G",
    "Hydrating Glow Skincare Full Bundle",
    "Matte Velvet Lipstick Trio Set",
    "Minimalist Nordic Accent Armchair",
    "Smart Robot Vacuum & Floor Mop Cleaner"
];

function getSeasonBadgeForProduct(exactTitle) {
    const lower = (exactTitle || '').toLowerCase();
    for (const [seasonKey, info] of Object.entries(SEASONAL_DEALS_MAPPING)) {
        if (info.products.some(p => p.toLowerCase() === lower)) {
            return { key: seasonKey, badgeText: info.badgeText };
        }
    }
    return null;
}

function injectSeasonBadgeIntoCardBody(colEl, badgeText) {
    const oldImgBadge = colEl.querySelector('.deal-img-wrapper .badge-season-tag');
    if (oldImgBadge) oldImgBadge.remove();

    let bodyWrap = colEl.querySelector('.season-body-badge-wrap');
    if (!bodyWrap) {
        bodyWrap = document.createElement('div');
        bodyWrap.className = 'season-body-badge-wrap';
        const validSmall = colEl.querySelector('small.text-muted');
        if (validSmall && validSmall.parentNode) {
            validSmall.parentNode.insertBefore(bodyWrap, validSmall.nextSibling);
        }
    }
    bodyWrap.innerHTML = `<span class="badge-season-tag"><i class="bi bi-stars"></i>${badgeText}</span>`;
}

function reorderBrowseByCategoryCards() {
    const prefCats = getCustomerPreferredCategories();
    const catSectionRow = document.querySelector('#categoryShowcaseSection .row.g-4');
    if (!catSectionRow) return;

    const catCols = Array.from(catSectionRow.children);
    catCols.forEach((col, i) => {
        if (!col.hasAttribute('data-orig-cat-idx')) {
            col.setAttribute('data-orig-cat-idx', String(i));
            const linkHref = (col.querySelector('a')?.getAttribute('href') || '').toLowerCase();
            let catKey = 'other';
            if (linkHref.includes('fashion')) catKey = 'fashion';
            else if (linkHref.includes('electronics')) catKey = 'electronics';
            else if (linkHref.includes('beauty')) catKey = 'beauty';
            else if (linkHref.includes('home')) catKey = 'home';
            col.setAttribute('data-cat-key', catKey);
        }
    });

    catCols.sort((a, b) => {
        const origA = parseInt(a.getAttribute('data-orig-cat-idx') || '0');
        const origB = parseInt(b.getAttribute('data-orig-cat-idx') || '0');
        if (prefCats.length > 0) {
            const keyA = a.getAttribute('data-cat-key') || '';
            const keyB = b.getAttribute('data-cat-key') || '';
            const rankA = prefCats.indexOf(keyA);
            const rankB = prefCats.indexOf(keyB);
            const isPrefA = rankA !== -1;
            const isPrefB = rankB !== -1;
            if (isPrefA && !isPrefB) return -1;
            if (!isPrefA && isPrefB) return 1;
            if (isPrefA && isPrefB && rankA !== rankB) return rankA - rankB;
        }
        return origA - origB;
    });

    catCols.forEach(col => catSectionRow.appendChild(col));
}

// ==========================================================================
// 3. HOME PAGE 5-SLIDE HERO CAROUSEL & SEASONAL SECTION (PLACED ABOVE HOT DEALS!)
// ==========================================================================
let heroSlideInterval = null;
let currentHeroSlideIndex = 0;
let currentActiveSeasonKey = 'thadingyut';

function setupHomeHeroSliderAndSeasonalSection() {
    const dealsContainer = document.getElementById('dealsContainer');
    const dealsSection = document.getElementById('dealsSection');
    if (!dealsContainer || !dealsSection) return;

    const allDealCols = Array.from(dealsContainer.querySelectorAll('.deal-col'));
    const isHomePage = allDealCols.some(col => col.hasAttribute('data-hot'));

    const subtitleEl = document.getElementById('dealsSectionSubtitle');
    if (subtitleEl) subtitleEl.remove();

    if (!isHomePage) return;

    const heroTimerEl = document.querySelector('.flash-timer-box [data-expiry]');
    if (heroTimerEl) {
        heroTimerEl.setAttribute('data-expiry', '2026-11-10T23:59:59');
    }

    const heroBanner = document.querySelector('.hero-banner');
    if (heroBanner && !document.getElementById('heroSliderStage')) {
        const originalRow = heroBanner.querySelector('.row.align-items-center');
        if (originalRow) {
            const sliderStage = document.createElement('div');
            sliderStage.id = 'heroSliderStage';
            sliderStage.className = 'hero-slider-stage';

            const slide1 = document.createElement('div');
            slide1.className = 'hero-slide-pane active';
            slide1.setAttribute('data-slide-idx', '0');
            originalRow.classList.add('w-100', 'm-0');
            slide1.appendChild(originalRow);
            sliderStage.appendChild(slide1);

            const seasonalSlidesData = [
                {
                    seasonKey: "thadingyut",
                    badge: "THADINGYUT FESTIVAL OF LIGHTS",
                    title: "Celebrate Thadingyut with Exclusive Festival Store Deals",
                    desc: "Light up your festival season with verified Yangon store promotions on gold jewelry, flagship smartphones, glowing skincare bundles, and warm home lighting.",
                    btnText: "Explore Thadingyut Deals",
                    imgUrl: "https://img.magnific.com/premium-vector/vector-illustration-tourists-partying_1316704-19661.jpg?semt=ais_hybrid&w=740&q=80"
                },
                {
                    seasonKey: "monsoon",
                    badge: "MONSOON SEASON MEGA OFFER",
                    title: "Splash Into Savings with MonSoon Season Deals",
                    desc: "Beat the rainy weather with special in-store promotions on street sneakers, smartphones, facial repair serums, and smart home robot cleaners.",
                    btnText: "Explore MonSoon Deals",
                    imgUrl: "https://static.vecteezy.com/system/resources/previews/007/822/226/non_2x/monsoon-sale-offer-banner-template-header-with-paper-cut-clouds-and-colorful-umbrella-on-dark-background-thunder-sky-raindrops-illustration-vector.jpg"
                },
                {
                    seasonKey: "christmas",
                    badge: "CHRISTMAS SEASON CELEBRATION",
                    title: "Unwrap Joy with Festive Christmas Store Discounts",
                    desc: "Find the perfect holiday gifts across Yangon outlets with limited-time deals on denim jackets, Apple iPads, velvet lipsticks, and Nordic armchairs.",
                    btnText: "Explore Christmas Deals",
                    imgUrl: "https://img.magnific.com/free-vector/christmas-season-celebration-horizontal-banner-template_23-2149895855.jpg?semt=ais_hybrid&w=740&q=80"
                },
                {
                    seasonKey: "newyear",
                    badge: "NEW YEAR SPECIAL PROMOTION",
                    title: "Kickstart the New Year with Unbeatable Store Deals",
                    desc: "Upgrade your lifestyle for the New Year with special savings on running shoes, wireless headphones, salon hair spa packages, and kitchen blenders.",
                    btnText: "Explore New Year Deals",
                    imgUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQA3uvmh28MzpRukE-ARl5WDWW9s6RKefMlQ1NK3TH3sp0PTw7DbR0BVcY&s=10"
                }
            ];

            seasonalSlidesData.forEach((sData, idx) => {
                const slidePane = document.createElement('div');
                slidePane.className = 'hero-slide-pane';
                slidePane.setAttribute('data-slide-idx', String(idx + 1));
                slidePane.innerHTML = `
                    <div class="row align-items-center g-4 w-100 m-0">
                        <div class="col-lg-6">
                            <span class="badge bg-warning text-dark fw-bold mb-3 px-3 py-2 rounded-pill">
                                ${sData.badge}
                            </span>
                            <h1 class="display-6 fw-bold mb-3">${sData.title}</h1>
                            <p class="lead opacity-75 mb-4" style="font-size: 1rem;">
                                ${sData.desc}
                            </p>
                            <button type="button" class="btn btn-hero-blue btn-lg fw-bold px-4 py-2 hero-season-jump-btn" data-target-season="${sData.seasonKey}">
                                ${sData.btnText} <i class="bi bi-arrow-down-circle ms-2"></i>
                            </button>
                        </div>
                        <div class="col-lg-6">
                            <div class="seasonal-banner-img-frame">
                                <img src="${sData.imgUrl}" alt="${sData.title}">
                            </div>
                        </div>
                    </div>
                `;
                sliderStage.appendChild(slidePane);
            });

            const navBar = document.createElement('div');
            navBar.className = 'hero-slider-nav';
            navBar.innerHTML = `
                <button type="button" class="hero-slide-dot active" data-go-slide="0">Main Finder</button>
                <button type="button" class="hero-slide-dot" data-go-slide="1">Thadingyut</button>
                <button type="button" class="hero-slide-dot" data-go-slide="2">MonSoon Season</button>
                <button type="button" class="hero-slide-dot" data-go-slide="3">Christmas</button>
                <button type="button" class="hero-slide-dot" data-go-slide="4">New Year</button>
            `;

            heroBanner.innerHTML = '';
            heroBanner.appendChild(sliderStage);
            heroBanner.appendChild(navBar);

            const slides = Array.from(heroBanner.querySelectorAll('.hero-slide-pane'));
            const dots = Array.from(heroBanner.querySelectorAll('.hero-slide-dot'));

            function showHeroSlide(index) {
                currentHeroSlideIndex = (index + slides.length) % slides.length;
                slides.forEach((sl, i) => sl.classList.toggle('active', i === currentHeroSlideIndex));
                dots.forEach((dt, i) => dt.classList.toggle('active', i === currentHeroSlideIndex));
            }

            function startHeroAutoSlide() {
                if (heroSlideInterval) clearInterval(heroSlideInterval);
                heroSlideInterval = setInterval(() => {
                    const sInput = document.getElementById('searchInput');
                    if (sInput && (document.activeElement === sInput || sInput.value.trim() !== '')) {
                        return;
                    }
                    showHeroSlide(currentHeroSlideIndex + 1);
                }, 5000);
            }

            dots.forEach(dot => {
                dot.addEventListener('click', () => {
                    const targetIdx = parseInt(dot.getAttribute('data-go-slide'));
                    showHeroSlide(targetIdx);
                    startHeroAutoSlide();
                });
            });

            heroBanner.querySelectorAll('.hero-season-jump-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    const targetSeason = btn.getAttribute('data-target-season');
                    activateSeasonalTab(targetSeason, true);
                });
            });

            startHeroAutoSlide();
        }
    }

    // B. Build "Seasonal Discount" Section and place it BEFORE #dealsSection (Hot Flash Deals Across Stores)
    if (!document.getElementById('seasonalDiscountSection')) {
        const seasonalSec = document.createElement('section');
        seasonalSec.id = 'seasonalDiscountSection';
        seasonalSec.className = 'container my-5 seasonal-section-wrapper';
        seasonalSec.innerHTML = `
            <div class="d-flex flex-wrap justify-content-between align-items-center mb-3 gap-3">
                <div>
                    <h3 class="fw-bold mb-0">Seasonal Discount</h3>
                </div>
                <div class="d-flex flex-wrap gap-2" id="seasonalFilterBtnsGroup">
                    <button type="button" class="seasonal-filter-btn active" data-season="thadingyut">Thadingyut</button>
                    <button type="button" class="seasonal-filter-btn" data-season="christmas">Christmas</button>
                    <button type="button" class="seasonal-filter-btn" data-season="newyear">New Year</button>
                    <button type="button" class="seasonal-filter-btn" data-season="monsoon">MonSoon Season</button>
                </div>
            </div>
            <div class="d-flex justify-content-between align-items-center mb-3">
                <span id="seasonalResultCounter" class="badge bg-primary-subtle text-primary border border-primary-subtle px-3 py-2 rounded-pill fw-semibold">
                    Showing 4 Thadingyut Seasonal Deals • Click any festival tab on the right to explore all 16 seasonal deals
                </span>
            </div>
            <div class="row g-4" id="seasonalDealsContainer"></div>
        `;

        // SWAPPED ORDER: Insert Seasonal Discount BEFORE Hot Flash Deals Across Stores (#dealsSection)
        dealsSection.parentNode.insertBefore(seasonalSec, dealsSection);

        const seasonalContainer = document.getElementById('seasonalDealsContainer');
        let sOrigIdx = 0;

        for (const [seasonKey, seasonInfo] of Object.entries(SEASONAL_DEALS_MAPPING)) {
            seasonInfo.products.forEach(prodTitle => {
                const sourceCol = allDealCols.find(
                    c => (c.getAttribute('data-title') || '').toLowerCase() === prodTitle.toLowerCase()
                );
                if (sourceCol) {
                    const clonedCol = sourceCol.cloneNode(true);
                    clonedCol.removeAttribute('data-hot');
                    clonedCol.removeAttribute('data-preview-bound');
                    clonedCol.setAttribute('data-season-cat', seasonKey);
                    clonedCol.setAttribute('data-season-orig-idx', String(sOrigIdx++));

                    injectSeasonBadgeIntoCardBody(clonedCol, seasonInfo.badgeText);
                    seasonalContainer.appendChild(clonedCol);
                }
            });
        }

        document.querySelectorAll('.seasonal-filter-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const seasonKey = btn.getAttribute('data-season');
                activateSeasonalTab(seasonKey, false);
            });
        });

        activateSeasonalTab('thadingyut', false);
    }
}

function activateSeasonalTab(seasonKey, scrollSmooth = false) {
    currentActiveSeasonKey = seasonKey;
    const seasonalBtns = document.querySelectorAll('.seasonal-filter-btn');
    const seasonalContainer = document.getElementById('seasonalDealsContainer');
    const seasonalCounter = document.getElementById('seasonalResultCounter');
    if (!seasonalContainer) return;

    seasonalBtns.forEach(b => {
        b.classList.toggle('active', b.getAttribute('data-season') === seasonKey);
    });

    const seasonObj = SEASONAL_DEALS_MAPPING[seasonKey] || SEASONAL_DEALS_MAPPING.thadingyut;
    const prefCats = getCustomerPreferredCategories();

    if (seasonalCounter) {
        seasonalCounter.innerText = `Showing 4 ${seasonObj.label} Seasonal Deals • Click any festival tab on the right to explore all 16 seasonal deals`;
    }

    const seasonalCols = Array.from(seasonalContainer.querySelectorAll('.deal-col'));
    seasonalCols.forEach(col => {
        col.style.display = col.getAttribute('data-season-cat') === seasonKey ? '' : 'none';
    });

    const visibleSeasonalCols = seasonalCols.filter(col => col.style.display !== 'none');

    visibleSeasonalCols.sort((a, b) => {
        const origA = parseInt(a.getAttribute('data-season-orig-idx') || '0');
        const origB = parseInt(b.getAttribute('data-season-orig-idx') || '0');

        if (prefCats.length > 0) {
            const catA = (a.getAttribute('data-main-cat') || a.getAttribute('data-subcat') || '').toLowerCase();
            const catB = (b.getAttribute('data-main-cat') || b.getAttribute('data-subcat') || '').toLowerCase();
            const rankA = prefCats.indexOf(catA);
            const rankB = prefCats.indexOf(catB);
            const isPrefA = rankA !== -1;
            const isPrefB = rankB !== -1;

            if (isPrefA && !isPrefB) return -1;
            if (!isPrefA && isPrefB) return 1;
            if (isPrefA && isPrefB && rankA !== rankB) return rankA - rankB;
        }
        return origA - origB;
    });

    visibleSeasonalCols.forEach((col, idx) => {
        col.classList.remove('card-reveal-anim');
        void col.offsetWidth;
        col.style.animationDelay = `${idx * 0.06}s`;
        col.classList.add('card-reveal-anim');
        seasonalContainer.appendChild(col);
    });

    if (scrollSmooth) {
        const secEl = document.getElementById('seasonalDiscountSection');
        if (secEl) {
            secEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }
}

// ==========================================================================
// 4. FORCED LOGIN GATE (STRICT GMAIL PASSWORD VERIFICATION + CLEAR SAVED ON LOGOUT)
// ==========================================================================
function setupForcedAuthGate() {
    if (!document.getElementById('authGateOverlay')) {
        const overlayHtml = `
        <div id="authGateOverlay" class="d-none">
            <div class="auth-glass-card">
                <div id="authLoginStep">
                    <div class="text-center mb-3">
                        <div class="d-inline-flex align-items-center justify-content-center bg-primary bg-opacity-10 text-primary rounded-circle mb-2" style="width:52px;height:52px;">
                            <i class="bi bi-tag-fill fs-4 text-warning"></i>
                        </div>
                        <h4 class="fw-bold mb-1">Welcome to Deal<span class="text-warning">Scout</span></h4>
                        <p class="text-muted small mb-0">Please sign in as Customer or Admin to access store deals</p>
                    </div>

                    <div class="auth-role-tabs">
                        <button type="button" class="auth-role-btn active" id="tabCustomerBtn">
                            <i class="bi bi-person-heart me-1"></i>Customer Login
                        </button>
                        <button type="button" class="auth-role-btn" id="tabAdminBtn">
                            <i class="bi bi-shield-lock me-1"></i>Admin Login
                        </button>
                    </div>

                    <div id="authErrorAlert" class="alert alert-danger py-2 px-3 small d-none mb-3"></div>

                    <form id="customerLoginForm">
                        <div class="mb-3">
                            <label class="form-label small fw-bold">Gmail Address</label>
                            <div class="input-group">
                                <span class="input-group-text"><i class="bi bi-envelope-at text-primary"></i></span>
                                <input type="email" id="custEmailInput" class="form-control" placeholder="example@gmail.com" required>
                            </div>
                        </div>
                        <div class="mb-3">
                            <label class="form-label small fw-bold">Password</label>
                            <div class="input-group">
                                <span class="input-group-text"><i class="bi bi-key text-primary"></i></span>
                                <input type="password" id="custPassInput" class="form-control" placeholder="Enter your password" required>
                                <button type="button" class="btn-eye-input rounded-end" data-target="custPassInput" title="Show/Hide Password">
                                    <i class="bi bi-eye"></i>
                                </button>
                            </div>
                        </div>
                        <button type="submit" class="btn btn-accent w-100 py-2 fw-bold">
                            <i class="bi bi-box-arrow-in-right me-1"></i>Continue as Customer
                        </button>
                    </form>

                    <form id="adminLoginForm" class="d-none">
                        <div class="mb-3">
                            <label class="form-label small fw-bold">Admin Username</label>
                            <div class="input-group">
                                <span class="input-group-text"><i class="bi bi-person-badge text-warning"></i></span>
                                <input type="text" id="adminUserInput" class="form-control" placeholder="Enter admin username" required>
                            </div>
                        </div>
                        <div class="mb-3">
                            <label class="form-label small fw-bold">Admin Password</label>
                            <div class="input-group">
                                <span class="input-group-text"><i class="bi bi-lock text-warning"></i></span>
                                <input type="password" id="adminPassInput" class="form-control" placeholder="Enter admin password" required>
                                <button type="button" class="btn-eye-input rounded-end" data-target="adminPassInput" title="Show/Hide Password">
                                    <i class="bi bi-eye"></i>
                                </button>
                            </div>
                        </div>
                        <button type="submit" class="btn btn-primary w-100 py-2 fw-bold">
                            <i class="bi bi-shield-check me-1"></i>Login as Admin
                        </button>
                    </form>
                </div>

                <div id="authCategoryStep" class="d-none">
                    <div class="text-center mb-3">
                        <span class="badge bg-warning text-dark fw-bold px-3 py-1 rounded-pill mb-2">PERSONALIZE YOUR FEED</span>
                        <h4 class="fw-bold mb-1">Choose Your Favorite Categories</h4>
                        <p class="text-muted small mb-0">Select one or more product categories you want to see first!</p>
                    </div>

                    <div id="prefErrorAlert" class="alert alert-warning py-2 px-3 small d-none mb-3">
                        Please select at least 1 category to continue.
                    </div>

                    <div class="pref-cat-grid mb-3">
                        <div class="pref-cat-item" data-cat="fashion">
                            <div class="pref-cat-check"><i class="bi bi-check-lg"></i></div>
                            <i class="bi bi-handbag fs-2 text-primary d-block mb-1"></i>
                            <div class="fw-bold small">Fashion</div>
                            <small class="text-muted" style="font-size:0.72rem;">Shoes, Shirts, Bags</small>
                        </div>
                        <div class="pref-cat-item" data-cat="electronics">
                            <div class="pref-cat-check"><i class="bi bi-check-lg"></i></div>
                            <i class="bi bi-laptop fs-2 text-primary d-block mb-1"></i>
                            <div class="fw-bold small">Electronics</div>
                            <small class="text-muted" style="font-size:0.72rem;">Phones, Laptops, Audio</small>
                        </div>
                        <div class="pref-cat-item" data-cat="beauty">
                            <div class="pref-cat-check"><i class="bi bi-check-lg"></i></div>
                            <i class="bi bi-stars fs-2 text-primary d-block mb-1"></i>
                            <div class="fw-bold small">Beauty</div>
                            <small class="text-muted" style="font-size:0.72rem;">Cosmetics, Skincare, Salon</small>
                        </div>
                        <div class="pref-cat-item" data-cat="home">
                            <div class="pref-cat-check"><i class="bi bi-check-lg"></i></div>
                            <i class="bi bi-house-heart fs-2 text-primary d-block mb-1"></i>
                            <div class="fw-bold small">Home & Living</div>
                            <small class="text-muted" style="font-size:0.72rem;">Furniture, Kitchen, Decor</small>
                        </div>
                    </div>

                    <button type="button" id="confirmCatPrefBtn" class="btn btn-accent w-100 py-2 fw-bold">
                        <i class="bi bi-stars me-1"></i>Show My Selected Deals First
                    </button>
                </div>
            </div>
        </div>
        `;
        document.body.insertAdjacentHTML('beforeend', overlayHtml);
    }

    document.querySelectorAll('.btn-eye-input').forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.getAttribute('data-target');
            const inputEl = document.getElementById(targetId);
            const iconEl = btn.querySelector('i');
            if (!inputEl) return;
            if (inputEl.type === 'password') {
                inputEl.type = 'text';
                iconEl.className = 'bi bi-eye-slash text-primary';
            } else {
                inputEl.type = 'password';
                iconEl.className = 'bi bi-eye';
            }
        });
    });

    const overlayEl = document.getElementById('authGateOverlay');
    const loginStepEl = document.getElementById('authLoginStep');
    const catStepEl = document.getElementById('authCategoryStep');
    const tabCustBtn = document.getElementById('tabCustomerBtn');
    const tabAdminBtn = document.getElementById('tabAdminBtn');
    const custForm = document.getElementById('customerLoginForm');
    const adminForm = document.getElementById('adminLoginForm');
    const errAlert = document.getElementById('authErrorAlert');

    tabCustBtn.addEventListener('click', () => {
        tabCustBtn.classList.add('active');
        tabAdminBtn.classList.remove('active');
        custForm.classList.remove('d-none');
        adminForm.classList.add('d-none');
        errAlert.classList.add('d-none');
    });

    tabAdminBtn.addEventListener('click', () => {
        tabAdminBtn.classList.add('active');
        tabCustBtn.classList.remove('active');
        adminForm.classList.remove('d-none');
        custForm.classList.add('d-none');
        errAlert.classList.add('d-none');
    });

    let pendingCustomer = null;

    custForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('custEmailInput').value.trim();
        const pass = document.getElementById('custPassInput').value.trim();

        if (!email.toLowerCase().endsWith('@gmail.com')) {
            errAlert.innerText = 'Please enter a valid @gmail.com address for Customer Login.';
            errAlert.classList.remove('d-none');
            return;
        }
        if (pass.length < 3) {
            errAlert.innerText = 'Password must be at least 3 characters.';
            errAlert.classList.remove('d-none');
            return;
        }

        // Verify password matches if this Gmail has logged in before
        const verifyResult = verifyAndRecordCustomerLogin(email, pass);
        if (!verifyResult.success) {
            errAlert.innerText = verifyResult.message;
            errAlert.classList.remove('d-none');
            return;
        }

        errAlert.classList.add('d-none');
        pendingCustomer = { email, pass };

        loginStepEl.classList.add('d-none');
        catStepEl.classList.remove('d-none');
    });

    const prefItems = document.querySelectorAll('.pref-cat-item');
    prefItems.forEach(item => {
        item.addEventListener('click', () => {
            item.classList.toggle('selected');
            document.getElementById('prefErrorAlert').classList.add('d-none');
        });
    });

    document.getElementById('confirmCatPrefBtn').addEventListener('click', () => {
        const selectedCats = Array.from(document.querySelectorAll('.pref-cat-item.selected'))
            .map(el => el.getAttribute('data-cat'));

        if (selectedCats.length === 0) {
            document.getElementById('prefErrorAlert').classList.remove('d-none');
            return;
        }

        const sessionObj = {
            role: 'customer',
            identifier: pendingCustomer ? pendingCustomer.email : (getCurrentSession()?.identifier || 'customer@gmail.com'),
            preferredCategories: selectedCats,
            loginTime: formatNowDateTime()
        };
        localStorage.setItem('dealScoutActiveSession', JSON.stringify(sessionObj));

        overlayEl.classList.add('d-none');
        document.body.classList.remove('auth-locked');
        updateNavbarAuthAndLinks();
        reorderBrowseByCategoryCards();
        if (typeof window.triggerDealScoutFilterUpdate === 'function') {
            window.triggerDealScoutFilterUpdate();
        }
        activateSeasonalTab(currentActiveSeasonKey, false);
        showToastNotification(`Welcome! Prioritizing ${selectedCats.join(', ').toUpperCase()} deals first across all sections.`, 'success');
    });

    adminForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('adminUserInput').value.trim();
        const pass = document.getElementById('adminPassInput').value.trim();

        const validAdmin = ADMIN_ACCOUNTS.find(
            a => a.username.toLowerCase() === username.toLowerCase() && a.password === pass
        );

        if (!validAdmin) {
            errAlert.innerText = 'Invalid Admin credentials!';
            errAlert.classList.remove('d-none');
            return;
        }

        errAlert.classList.add('d-none');
        recordAdminLogin(validAdmin.username, pass);

        const sessionObj = {
            role: 'admin',
            identifier: validAdmin.username,
            preferredCategories: [],
            loginTime: formatNowDateTime()
        };
        localStorage.setItem('dealScoutActiveSession', JSON.stringify(sessionObj));

        overlayEl.classList.add('d-none');
        document.body.classList.remove('auth-locked');
        updateNavbarAuthAndLinks();
        reorderBrowseByCategoryCards();
        if (typeof window.triggerDealScoutFilterUpdate === 'function') {
            window.triggerDealScoutFilterUpdate();
        }
        activateSeasonalTab(currentActiveSeasonKey, false);
        showToastNotification(`Logged in as Admin (${validAdmin.username})!`, 'success');
    });

    const currentSession = getCurrentSession();
    if (!currentSession) {
        overlayEl.classList.remove('d-none');
        document.body.classList.add('auth-locked');
    } else {
        overlayEl.classList.add('d-none');
        document.body.classList.remove('auth-locked');
        reorderBrowseByCategoryCards();
    }
}

// Clear Savings Tracker completely when logging out!
function triggerLogoutAndShowLogin() {
    localStorage.removeItem('dealScoutActiveSession');

    // Clear all saved deals from Savings Tracker on Logout
    savedDeals = [];
    localStorage.removeItem('dealScoutSaved');
    renderSavedDeals();

    closeCustomPageViews();
    const overlayEl = document.getElementById('authGateOverlay');
    const loginStepEl = document.getElementById('authLoginStep');
    const catStepEl = document.getElementById('authCategoryStep');
    const errAlert = document.getElementById('authErrorAlert');

    if (overlayEl) {
        loginStepEl.classList.remove('d-none');
        catStepEl.classList.add('d-none');
        if (errAlert) errAlert.classList.add('d-none');
        document.querySelectorAll('.pref-cat-item').forEach(i => i.classList.remove('selected'));
        document.getElementById('custEmailInput').value = '';
        document.getElementById('custPassInput').value = '';
        document.getElementById('adminUserInput').value = '';
        document.getElementById('adminPassInput').value = '';
        overlayEl.classList.remove('d-none');
        document.body.classList.add('auth-locked');
    }
}

function openCategoryPreferenceModalAgain() {
    const session = getCurrentSession();
    if (!session || session.role !== 'customer') return;
    const overlayEl = document.getElementById('authGateOverlay');
    const loginStepEl = document.getElementById('authLoginStep');
    const catStepEl = document.getElementById('authCategoryStep');

    loginStepEl.classList.add('d-none');
    catStepEl.classList.remove('d-none');

    document.querySelectorAll('.pref-cat-item').forEach(item => {
        const cat = item.getAttribute('data-cat');
        item.classList.toggle('selected', (session.preferredCategories || []).includes(cat));
    });

    overlayEl.classList.remove('d-none');
    document.body.classList.add('auth-locked');
}

// ==========================================================================
// 5. UNIFIED 3-LINE HAMBURGER MENU IN NAVBAR ("Product Status")
// ==========================================================================
function toggleSiteTheme() {
    const currentTheme = document.documentElement.getAttribute('data-bs-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-bs-theme', newTheme);
    localStorage.setItem('dealScoutTheme', newTheme);
    updateNavbarAuthAndLinks();
}

function setupThemeToggle() {
    const savedTheme = localStorage.getItem('dealScoutTheme') || 'light';
    document.documentElement.setAttribute('data-bs-theme', savedTheme);
}

function updateNavbarAuthAndLinks() {
    const session = getCurrentSession();
    const navUl = document.querySelector('.navbar-nav');
    const rightControls = document.querySelector('.navbar-dealscout .d-flex.align-items-center');
    const currentTheme = document.documentElement.getAttribute('data-bs-theme') || 'light';

    if (navUl) {
        navUl.querySelectorAll('a[href]').forEach(a => {
            a.addEventListener('click', () => {
                closeCustomPageViews();
            });
        });
    }

    if (rightControls) {
        let menuWrapper = document.getElementById('navUnifiedMenuWrapper');
        if (!menuWrapper) {
            menuWrapper = document.createElement('div');
            menuWrapper.id = 'navUnifiedMenuWrapper';
            menuWrapper.className = 'dropdown';
            rightControls.appendChild(menuWrapper);
        }

        const isAdmin = session && session.role === 'admin';
        const userLabel = session
            ? (isAdmin ? `Admin: ${session.identifier}` : session.identifier)
            : 'Guest User';

        const themeItemLabel = currentTheme === 'dark'
            ? `<i class="bi bi-sun-fill text-warning fs-6"></i><span>Switch to Light Mode</span>`
            : `<i class="bi bi-moon-stars-fill text-primary fs-6"></i><span>Switch to Dark Mode</span>`;

        const adminMenuItemHtml = isAdmin
            ? `<li><a class="dropdown-item" id="menuAdminPanelBtn"><i class="bi bi-shield-lock-fill text-warning fs-6"></i><span>Admin Panel</span></a></li>`
            : '';

        menuWrapper.innerHTML = `
            <button class="btn-nav-menu-lines" type="button" data-bs-toggle="dropdown" aria-expanded="false" title="Menu">
                <i class="bi bi-list"></i>
            </button>
            <ul class="dropdown-menu dropdown-menu-end unified-nav-dropdown">
                <li class="px-3 py-2 border-bottom mb-1">
                    <div class="small text-muted" style="font-size:0.72rem;">SIGNED IN AS</div>
                    <div class="fw-bold small text-truncate" style="max-width: 195px;">${userLabel}</div>
                </li>
                <li>
                    <a class="dropdown-item" id="menuProductStatsBtn">
                        <i class="bi bi-bar-chart-fill text-primary fs-6"></i><span>Product Status</span>
                    </a>
                </li>
                ${adminMenuItemHtml}
                <li>
                    <a class="dropdown-item" id="menuThemeToggleBtn">
                        ${themeItemLabel}
                    </a>
                </li>
                <li><hr class="dropdown-divider my-1"></li>
                <li>
                    <a class="dropdown-item text-danger" id="menuLogoutBtn">
                        <i class="bi bi-box-arrow-right fs-6"></i><span>Logout</span>
                    </a>
                </li>
            </ul>
        `;

        document.getElementById('menuProductStatsBtn')?.addEventListener('click', (e) => {
            e.preventDefault();
            showProductStatsPageView();
        });

        document.getElementById('menuAdminPanelBtn')?.addEventListener('click', (e) => {
            e.preventDefault();
            showAdminDashboardPageView();
        });

        document.getElementById('menuThemeToggleBtn')?.addEventListener('click', (e) => {
            e.preventDefault();
            toggleSiteTheme();
        });

        document.getElementById('menuLogoutBtn')?.addEventListener('click', (e) => {
            e.preventDefault();
            triggerLogoutAndShowLogin();
        });
    }
}

// ==========================================================================
// 6. PAGE VIEW 1: PRODUCT STATUS BAR CHART PAGE
// ==========================================================================
const MONTHLY_PRODUCT_STATS = {
    october2026: {
        label: "October 2026 (Previous Month Data)",
        totalProducts: 52,
        categories: [
            { name: "Fashion", count: 16, color: "#FF5A1F" },
            { name: "Electronics", count: 14, color: "#2563EB" },
            { name: "Beauty", count: 12, color: "#EC4899" },
            { name: "Home & Living", count: 10, color: "#16A34A" }
        ],
        breakdown: {
            "Fashion (16 Items)": [
                { item: "Clothing (Shirts & Jackets)", count: 5, unit: "Items", color: "#FF5A1F" },
                { item: "Shoes & Sneakers", count: 4, unit: "Pairs", color: "#FF5A1F" },
                { item: "Bags & Backpacks", count: 3, unit: "Items", color: "#FF5A1F" },
                { item: "Jewelry & Accessories", count: 2, unit: "Items", color: "#FF5A1F" },
                { item: "Sunglasses & Eyewear", count: 2, unit: "Pairs", color: "#FF5A1F" }
            ],
            "Electronics (14 Items)": [
                { item: "Smartphones", count: 4, unit: "Units", color: "#2563EB" },
                { item: "Laptops & Notebooks", count: 3, unit: "Units", color: "#2563EB" },
                { item: "Tablets", count: 2, unit: "Units", color: "#2563EB" },
                { item: "Wireless Headphones", count: 3, unit: "Units", color: "#2563EB" },
                { item: "Digital Cameras", count: 2, unit: "Units", color: "#2563EB" }
            ],
            "Beauty (12 Items)": [
                { item: "Cosmetics & Lipstick Sets", count: 4, unit: "Sets", color: "#EC4899" },
                { item: "Skincare Bundles", count: 3, unit: "Sets", color: "#EC4899" },
                { item: "Perfumes & Fragrances", count: 2, unit: "Bottles", color: "#EC4899" },
                { item: "Hair & Styling Packages", count: 2, unit: "Packages", color: "#EC4899" },
                { item: "Nail Salon Packages", count: 1, unit: "Package", color: "#EC4899" }
            ],
            "Home & Living (10 Items)": [
                { item: "Furniture & Chairs", count: 3, unit: "Units", color: "#16A34A" },
                { item: "Home Lighting & Decor", count: 2, unit: "Units", color: "#16A34A" },
                { item: "Bedding Sets", count: 2, unit: "Sets", color: "#16A34A" },
                { item: "Kitchenware & Appliances", count: 2, unit: "Sets", color: "#16A34A" },
                { item: "Cleaning Essentials", count: 1, unit: "Set", color: "#16A34A" }
            ]
        }
    },
    november2026: {
        label: "November 2026 (Current Month - Live Tracking)",
        totalProducts: 32,
        categories: [
            { name: "Fashion", count: 8, color: "#FF5A1F" },
            { name: "Electronics", count: 8, color: "#2563EB" },
            { name: "Beauty", count: 8, color: "#EC4899" },
            { name: "Home & Living", count: 8, color: "#16A34A" }
        ],
        breakdown: {
            "Fashion (8 Items)": [
                { item: "Clothing (Shirt & Denim Jacket)", count: 2, unit: "Items", color: "#FF5A1F" },
                { item: "Shoes (Nike & Adidas Sneakers)", count: 2, unit: "Pairs", color: "#FF5A1F" },
                { item: "Bags (Crossbody & Tote Bag)", count: 2, unit: "Items", color: "#FF5A1F" },
                { item: "Jewelry (Pendant Necklace)", count: 1, unit: "Item", color: "#FF5A1F" },
                { item: "Sunglasses (UV400 Shades)", count: 1, unit: "Pair", color: "#FF5A1F" }
            ],
            "Electronics (8 Items)": [
                { item: "Phones (Samsung S25 & Redmi 14)", count: 2, unit: "Units", color: "#2563EB" },
                { item: "Laptops (ASUS TUF & Dell Inspiron)", count: 2, unit: "Units", color: "#2563EB" },
                { item: "Tablets (Apple iPad Air)", count: 1, unit: "Unit", color: "#2563EB" },
                { item: "Headphones (Sony & Pure Bass)", count: 2, unit: "Units", color: "#2563EB" },
                { item: "Cameras (Canon EOS Kit)", count: 1, unit: "Unit", color: "#2563EB" }
            ],
            "Beauty (8 Items)": [
                { item: "Cosmetics (Lipstick & Palette)", count: 2, unit: "Sets", color: "#EC4899" },
                { item: "Skincare (Glow Bundle & Serum)", count: 2, unit: "Sets", color: "#EC4899" },
                { item: "Perfumes (Floral Eau De Parfum)", count: 1, unit: "Bottle", color: "#EC4899" },
                { item: "Hair & Styling (Spa & Care Kit)", count: 2, unit: "Packages", color: "#EC4899" },
                { item: "Nail Salons (Gel Nail Manicure)", count: 1, unit: "Package", color: "#EC4899" }
            ],
            "Home & Living (8 Items)": [
                { item: "Furniture (Armchair & Desk Chair)", count: 2, unit: "Units", color: "#16A34A" },
                { item: "Decor (LED Pendant Lamp)", count: 1, unit: "Unit", color: "#16A34A" },
                { item: "Bedding (Cotton Bedsheet Set)", count: 1, unit: "Set", color: "#16A34A" },
                { item: "Kitchenware (Blender & Cookware)", count: 2, unit: "Sets", color: "#16A34A" },
                { item: "Cleaning (Robot Vacuum & Kit)", count: 2, unit: "Sets", color: "#16A34A" }
            ]
        }
    }
};

function hideDefaultStoreSections() {
    document.querySelectorAll('header, section, main').forEach(el => {
        if (el.id !== 'customDynamicPageContainer') {
            el.classList.add('d-none');
        }
    });
    document.querySelectorAll('.navbar-nav .nav-link').forEach(l => l.classList.remove('active'));
}

function closeCustomPageViews() {
    const customContainer = document.getElementById('customDynamicPageContainer');
    if (customContainer) customContainer.classList.add('d-none');
    document.querySelectorAll('header, section, main').forEach(el => {
        if (el.id !== 'customDynamicPageContainer') {
            el.classList.remove('d-none');
        }
    });
}

function getOrCreateCustomPageContainer() {
    let container = document.getElementById('customDynamicPageContainer');
    if (!container) {
        container = document.createElement('main');
        container.id = 'customDynamicPageContainer';
        container.className = 'container my-4';
        const footer = document.querySelector('footer');
        if (footer) {
            footer.parentNode.insertBefore(container, footer);
        } else {
            document.body.appendChild(container);
        }
    }
    container.classList.remove('d-none');
    return container;
}

function showProductStatsPageView(selectedMonthKey = 'november2026') {
    hideDefaultStoreSections();

    const container = getOrCreateCustomPageContainer();
    const monthData = MONTHLY_PRODUCT_STATS[selectedMonthKey];
    const maxCatCount = 20;

    const vBarsHtml = monthData.categories.map(c => {
        const heightPct = Math.round((c.count / maxCatCount) * 100);
        return `
            <div class="v-bar-col">
                <div class="v-bar-val">${c.count} Items</div>
                <div class="v-bar-fill" style="height: ${heightPct}%; background: ${c.color};"></div>
                <div class="small fw-bold mt-2 text-center">${c.name}</div>
            </div>
        `;
    }).join('');

    let breakdownCardsHtml = '';
    for (const [groupTitle, items] of Object.entries(monthData.breakdown)) {
        const rowsHtml = items.map(it => {
            const widthPct = Math.min(100, Math.round((it.count / 6) * 100));
            return `
                <div class="h-bar-row">
                    <div class="d-flex justify-content-between small fw-bold mb-1">
                        <span>${it.item}</span>
                        <span class="text-primary">${it.count} ${it.unit}</span>
                    </div>
                    <div class="h-bar-track">
                        <div class="h-bar-fill" style="width: ${widthPct}%; background: ${it.color};"></div>
                    </div>
                </div>
            `;
        }).join('');

        breakdownCardsHtml += `
            <div class="col-md-6">
                <div class="analytics-panel-card h-100">
                    <h6 class="fw-bold mb-3 pb-2 border-bottom">${groupTitle}</h6>
                    ${rowsHtml}
                </div>
            </div>
        `;
    }

    container.innerHTML = `
        <div class="hero-banner shadow-sm py-4 px-4 mb-4">
            <div class="d-flex flex-wrap justify-content-between align-items-center gap-3">
                <div>
                    <span class="badge bg-warning text-dark fw-bold mb-2">MONTHLY PRODUCT STATUS</span>
                    <h2 class="fw-bold mb-1">Product Status & Monthly Count (Bar Chart)</h2>
                    <p class="mb-0 opacity-75 small">Compare total discounted products posted across Fashion, Electronics, Beauty, and Home & Living.</p>
                </div>
                <button type="button" class="btn btn-light fw-bold" onclick="closeCustomPageViews()">
                    <i class="bi bi-arrow-left me-1"></i>Back to Deals
                </button>
            </div>
        </div>

        <div class="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
            <div class="d-flex flex-wrap gap-2">
                <button type="button" class="month-switch-btn ${selectedMonthKey === 'october2026' ? 'active' : ''}" id="btnStatsOct">
                    October 2026 (Previous Month Data)
                </button>
                <button type="button" class="month-switch-btn ${selectedMonthKey === 'november2026' ? 'active' : ''}" id="btnStatsNov">
                    November 2026 (Current Month - Live Tracking)
                </button>
            </div>
            <span class="badge bg-primary-subtle text-primary border px-3 py-2 rounded-pill fs-6">
                Total Products in ${selectedMonthKey === 'october2026' ? 'October' : 'November'}: <strong>${monthData.totalProducts} Items</strong>
            </span>
        </div>

        <div class="analytics-panel-card mb-4">
            <h5 class="fw-bold mb-1">Main Category Product Status — ${monthData.label}</h5>
            <p class="text-muted small mb-3">Visual bar chart comparing total products in each of the 4 main departments</p>
            <div class="v-chart-stage">
                ${vBarsHtml}
            </div>
        </div>

        <h5 class="fw-bold mb-3">Detailed Product Count by Item Type (Bar Chart)</h5>
        <div class="row g-4">
            ${breakdownCardsHtml}
        </div>
    `;

    document.getElementById('btnStatsOct').addEventListener('click', () => showProductStatsPageView('october2026'));
    document.getElementById('btnStatsNov').addEventListener('click', () => showProductStatsPageView('november2026'));
}

// ==========================================================================
// 7. PAGE VIEW 2: ADMIN-ONLY DASHBOARD (ENCRYPTED CUSTOMER PASSWORDS)
// ==========================================================================
function showAdminDashboardPageView(selectedMonthKey = 'november2026') {
    const session = getCurrentSession();
    if (!session || session.role !== 'admin') {
        showToastNotification('Access Denied! Admin privileges required.', 'danger');
        return;
    }

    hideDefaultStoreSections();

    const container = getOrCreateCustomPageContainer();
    const allAnalytics = getAnalyticsData();
    const monthObj = allAnalytics[selectedMonthKey];

    const customerLoginSum = monthObj.customers.reduce((acc, c) => acc + (c.loginCount || 0), 0);
    const adminLoginSum = monthObj.admins.reduce((acc, a) => acc + (a.loginCount || 0), 0);
    const totalLoginSum = customerLoginSum + adminLoginSum;
    const totalSaveSum = monthObj.totalSaveDeals || 0;

    const custRowsHtml = monthObj.customers.length === 0
        ? `<tr><td colspan="6" class="text-center text-muted py-4">No customer logins recorded yet in November 2026. Log out and sign in as a Customer to test live tracking!</td></tr>`
        : monthObj.customers.map((c, idx) => `
            <tr>
                <td class="fw-bold">${idx + 1}</td>
                <td><i class="bi bi-envelope-fill text-primary me-1"></i>${c.email}</td>
                <td>
                    <div class="table-pass-wrap text-muted" title="Encrypted for Customer Security">
                        <i class="bi bi-lock-fill text-secondary small"></i>
                        <span class="pass-mask-text">••••••••</span>
                    </div>
                </td>
                <td><span class="badge bg-primary-subtle text-primary border px-2 py-1">${c.loginCount} times</span></td>
                <td><span class="badge bg-success-subtle text-success border px-2 py-1">${c.saveCount} deals</span></td>
                <td class="small text-muted">${c.lastLogin}</td>
            </tr>
        `).join('');

    const adminRowsHtml = monthObj.admins.length === 0
        ? `<tr><td colspan="5" class="text-center text-muted py-4">No admin logins recorded yet for this period.</td></tr>`
        : monthObj.admins.map((a, idx) => `
            <tr>
                <td class="fw-bold">${idx + 1}</td>
                <td><span class="badge bg-warning text-dark">${a.username}</span></td>
                <td>
                    <div class="table-pass-wrap">
                        <span class="pass-mask-text">••••••••</span>
                        <button type="button" class="btn-table-eye" data-real-pass="${a.password}" title="Show/Hide Admin Password">
                            <i class="bi bi-eye"></i>
                        </button>
                    </div>
                </td>
                <td><span class="badge bg-info-subtle text-info border px-2 py-1">${a.loginCount} times</span></td>
                <td class="small text-muted">${a.lastLogin}</td>
            </tr>
        `).join('');

    container.innerHTML = `
        <div class="hero-banner shadow-sm py-4 px-4 mb-4">
            <div class="d-flex flex-wrap justify-content-between align-items-center gap-3">
                <div>
                    <span class="badge bg-warning text-dark fw-bold mb-2">ADMIN-ONLY EXCLUSIVE DASHBOARD</span>
                    <h2 class="fw-bold mb-1">Monthly Login & Save Deal Analytics</h2>
                    <p class="mb-0 opacity-75 small">Monitor customer engagement, timestamps, and total saved deals across October & November 2026.</p>
                </div>
                <button type="button" class="btn btn-light fw-bold" onclick="closeCustomPageViews()">
                    <i class="bi bi-arrow-left me-1"></i>Back to Storefront
                </button>
            </div>
        </div>

        <div class="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
            <div class="d-flex flex-wrap gap-2">
                <button type="button" class="month-switch-btn ${selectedMonthKey === 'october2026' ? 'active' : ''}" id="btnAdminOct">
                    October 2026 (Previous Month Data)
                </button>
                <button type="button" class="month-switch-btn ${selectedMonthKey === 'november2026' ? 'active' : ''}" id="btnAdminNov">
                    November 2026 (Current Month - Live Tracking)
                </button>
            </div>
        </div>

        <div class="row g-3 mb-4 align-items-stretch">
            <div class="col-sm-6 col-lg-3">
                <div class="kpi-stat-card h-100">
                    <div class="kpi-icon-box bg-primary-subtle text-primary"><i class="bi bi-people-fill"></i></div>
                    <div>
                        <div class="text-muted small fw-semibold">Customer Login Count</div>
                        <div class="fs-3 fw-bolder">${customerLoginSum}</div>
                    </div>
                </div>
            </div>
            <div class="col-sm-6 col-lg-3">
                <div class="kpi-stat-card h-100">
                    <div class="kpi-icon-box bg-warning-subtle text-warning"><i class="bi bi-shield-check"></i></div>
                    <div>
                        <div class="text-muted small fw-semibold">Admin Login Count</div>
                        <div class="fs-3 fw-bolder">${adminLoginSum}</div>
                    </div>
                </div>
            </div>
            <div class="col-sm-6 col-lg-3">
                <div class="kpi-stat-card h-100">
                    <div class="kpi-icon-box bg-info-subtle text-info"><i class="bi bi-box-arrow-in-right"></i></div>
                    <div>
                        <div class="text-muted small fw-semibold">Total Monthly Logins</div>
                        <div class="fs-3 fw-bolder">${totalLoginSum}</div>
                    </div>
                </div>
            </div>
            <div class="col-sm-6 col-lg-3">
                <div class="kpi-stat-card h-100">
                    <div class="kpi-icon-box bg-success-subtle text-success"><i class="bi bi-bookmark-heart-fill"></i></div>
                    <div>
                        <div class="text-muted small fw-semibold">Total Save Deal Count</div>
                        <div class="fs-3 fw-bolder text-success">${totalSaveSum}</div>
                    </div>
                </div>
            </div>
        </div>

        <div class="analytics-panel-card mb-4">
            <div class="d-flex justify-content-between align-items-center mb-3">
                <div>
                    <h5 class="fw-bold mb-0">Customer Login & Save Deal Records (${monthObj.customers.length} Customers)</h5>
                    <small class="text-muted"><i class="bi bi-shield-lock-fill text-success me-1"></i>Customer passwords are encrypted and hidden to protect customer security</small>
                </div>
            </div>
            <div class="table-responsive">
                <table class="table table-hover align-middle mb-0">
                    <thead class="table-light">
                        <tr>
                            <th>#</th>
                            <th>Customer Gmail</th>
                            <th>Password</th>
                            <th>Login Count</th>
                            <th>Save Deal Count</th>
                            <th>Date & Time</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${custRowsHtml}
                    </tbody>
                </table>
            </div>
        </div>

        <div class="analytics-panel-card">
            <div class="d-flex justify-content-between align-items-center mb-3">
                <div>
                    <h5 class="fw-bold mb-0">Admin Login Activity Records</h5>
                    <small class="text-muted">Displays Admin Username, Password, Login Count, and Last Login Date & Time</small>
                </div>
            </div>
            <div class="table-responsive">
                <table class="table table-hover align-middle mb-0">
                    <thead class="table-light">
                        <tr>
                            <th>#</th>
                            <th>Admin Username</th>
                            <th>Password</th>
                            <th>Login Count</th>
                            <th>Date & Time</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${adminRowsHtml}
                    </tbody>
                </table>
            </div>
        </div>
    `;

    container.querySelectorAll('.btn-table-eye').forEach(btn => {
        btn.addEventListener('click', () => {
            const wrap = btn.closest('.table-pass-wrap');
            const textSpan = wrap.querySelector('.pass-mask-text');
            const iconEl = btn.querySelector('i');
            const realPass = btn.getAttribute('data-real-pass') || '';

            if (textSpan.innerText === '••••••••') {
                textSpan.innerText = realPass;
                iconEl.className = 'bi bi-eye-slash text-primary';
            } else {
                textSpan.innerText = '••••••••';
                iconEl.className = 'bi bi-eye';
            }
        });
    });

    document.getElementById('btnAdminOct').addEventListener('click', () => showAdminDashboardPageView('october2026'));
    document.getElementById('btnAdminNov').addEventListener('click', () => showAdminDashboardPageView('november2026'));
}

// ==========================================================================
// 8. SMART COLOR ENGINE & PRODUCT CATALOG MATCHER
// ==========================================================================
function rgbToHsl(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;
    if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h *= 60;
    }
    return [h, s, l];
}

function hslToRgb(h, s, l) {
    h /= 360;
    let r, g, b;
    if (s === 0) {
        r = g = b = l;
    } else {
        const hue2rgb = (p, q, t) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        };
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
    }
    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

function applySmartProductColor(mainImgEl, originalUrl, colorObj) {
    mainImgEl.style.filter = 'none';

    if (colorObj && colorObj.imgUrl) {
        mainImgEl.src = colorObj.imgUrl;
        return;
    }

    const mode = colorObj ? colorObj.mode : 'original';

    if (!mode || mode === 'original') {
        mainImgEl.src = originalUrl;
        return;
    }

    if (mode === 'nike-black') {
        mainImgEl.src = originalUrl;
        mainImgEl.style.filter = 'grayscale(100%) contrast(1.15)';
        return;
    }

    const cacheKey = `${originalUrl}__${mode}`;
    if (recoloredImageCache[cacheKey]) {
        mainImgEl.src = recoloredImageCache[cacheKey];
        return;
    }

    const tempImg = new Image();
    tempImg.crossOrigin = 'anonymous';
    tempImg.onload = function () {
        const canvas = document.createElement('canvas');
        const w = tempImg.naturalWidth;
        const h = tempImg.naturalHeight;
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(tempImg, 0, 0);

        const imgData = ctx.getImageData(0, 0, w, h);
        const data = imgData.data;

        for (let i = 0; i < data.length; i += 4) {
            const r = data[i], g = data[i + 1], b = data[i + 2];
            const [hue, sat, lum] = rgbToHsl(r, g, b);

            if (mode === 'shirt-olive') {
                if (hue >= 170 && hue <= 260 && sat > 0.12 && lum > 0.15 && lum < 0.88) {
                    const [nr, ng, nb] = hslToRgb(88, Math.min(0.42, sat * 1.15), lum * 0.92);
                    data[i] = nr; data[i + 1] = ng; data[i + 2] = nb;
                }
            }
        }

        ctx.putImageData(imgData, 0, 0);
        const resultDataUrl = canvas.toDataURL('image/jpeg', 0.92);
        recoloredImageCache[cacheKey] = resultDataUrl;
        mainImgEl.src = resultDataUrl;
    };
    tempImg.src = originalUrl;
}

function findProductCatalogEntry(title) {
    const lower = title.toLowerCase();
    for (const key in REAL_PRODUCT_DATABASE) {
        if (lower.includes(key.toLowerCase()) || REAL_PRODUCT_DATABASE[key].exactTitle.toLowerCase() === lower) {
            return REAL_PRODUCT_DATABASE[key];
        }
    }
    if (lower.includes("nike") || lower.includes("pegasus")) return REAL_PRODUCT_DATABASE["Nike Air Zoom"];
    if (lower.includes("adidas") || lower.includes("eqt")) return REAL_PRODUCT_DATABASE["Adidas"];
    if (lower.includes("shirt")) return REAL_PRODUCT_DATABASE["Linen Casual Shirt"];
    if (lower.includes("denim") || lower.includes("jacket")) return REAL_PRODUCT_DATABASE["Denim Jacket"];
    if (lower.includes("crossbody")) return REAL_PRODUCT_DATABASE["Crossbody Bag"];
    if (lower.includes("tote")) return REAL_PRODUCT_DATABASE["Everyday Tote Bag"];
    if (lower.includes("necklace") || lower.includes("pendant")) return REAL_PRODUCT_DATABASE["Pendant Necklace"];
    if (lower.includes("shades") || lower.includes("sunglasses")) return REAL_PRODUCT_DATABASE["Aviator Shades"];
    if (lower.includes("samsung") || lower.includes("s24") || lower.includes("s25") || lower.includes("ultra")) return REAL_PRODUCT_DATABASE["Galaxy S24"];
    if (lower.includes("redmi")) return REAL_PRODUCT_DATABASE["Redmi Note"];
    if (lower.includes("asus") || lower.includes("tuf")) return REAL_PRODUCT_DATABASE["ASUS TUF Gaming"];
    if (lower.includes("dell")) return REAL_PRODUCT_DATABASE["Dell Inspiron"];
    if (lower.includes("ipad")) return REAL_PRODUCT_DATABASE["iPad Air"];
    if (lower.includes("sony")) return REAL_PRODUCT_DATABASE["Sony"];
    if (lower.includes("jbl") || lower.includes("pure bass")) return REAL_PRODUCT_DATABASE["JBL Pure Bass"];
    if (lower.includes("canon")) return REAL_PRODUCT_DATABASE["Canon EOS"];
    if (lower.includes("lipstick")) return REAL_PRODUCT_DATABASE["Velvet Lipstick"];
    if (lower.includes("foundation") || lower.includes("palette") || lower.includes("brush")) return REAL_PRODUCT_DATABASE["Foundation"];
    if (lower.includes("skincare") || lower.includes("hydrating")) return REAL_PRODUCT_DATABASE["Glow Skincare"];
    if (lower.includes("snail") || lower.includes("cosrx") || lower.includes("serum")) return REAL_PRODUCT_DATABASE["COSRX"];
    if (lower.includes("parfum") || lower.includes("perfume")) return REAL_PRODUCT_DATABASE["Eau De Parfum"];
    if (lower.includes("keratin")) return REAL_PRODUCT_DATABASE["Keratin Hair Spa"];
    if (lower.includes("iron") || lower.includes("styling")) return REAL_PRODUCT_DATABASE["Hair Styling"];
    if (lower.includes("nail")) return REAL_PRODUCT_DATABASE["Gel Nail Art"];
    if (lower.includes("armchair") || lower.includes("nordic")) return REAL_PRODUCT_DATABASE["Nordic Accent Armchair"];
    if (lower.includes("office") || lower.includes("mesh") || lower.includes("swivel")) return REAL_PRODUCT_DATABASE["Office Desk Chair"];
    if (lower.includes("lamp")) return REAL_PRODUCT_DATABASE["Pendant Lamp"];
    if (lower.includes("bedsheet")) return REAL_PRODUCT_DATABASE["Cotton Bedsheet Set"];
    if (lower.includes("fryer") || lower.includes("cooker") || lower.includes("blender")) return REAL_PRODUCT_DATABASE["Air Fryer"];
    if (lower.includes("cookware")) return REAL_PRODUCT_DATABASE["Non-Stick Cookware"];
    if (lower.includes("vacuum")) return REAL_PRODUCT_DATABASE["Robot Vacuum"];
    if (lower.includes("cleaning")) return REAL_PRODUCT_DATABASE["Deep Cleaning Kit"];
    return null;
}

function syncAllCardsWithRealStores() {
    document.querySelectorAll('.cat-card').forEach((catEl, i) => {
        catEl.style.animationDelay = `${i * 0.08}s`;
    });

    const cols = document.querySelectorAll('.deal-col');
    const isHomePage = Array.from(cols).some(col => col.hasAttribute('data-hot'));

    cols.forEach(col => {
        const rawTitle = col.getAttribute('data-title') || col.querySelector('h6')?.innerText || '';
        const entry = findProductCatalogEntry(rawTitle);
        if (!entry) return;

        col.setAttribute('data-title', entry.exactTitle);
        col.setAttribute('data-store', entry.store);
        col.setAttribute('data-location', entry.locationFull || `${entry.store} - ${entry.location}`);
        col.setAttribute('data-map-query', entry.mapQuery);
        col.setAttribute('data-map-link', entry.mapLink);
        col.setAttribute('data-product-keywords', entry.productKeywords || '');
        col.setAttribute('data-main-cat', entry.mainCat || '');

        if (entry.expiry) {
            const timerSpan = col.querySelector('[data-expiry]');
            if (timerSpan) timerSpan.setAttribute('data-expiry', entry.expiry);
        }
        if (entry.validText) {
            const validSmall = col.querySelector('small.text-muted');
            if (validSmall) validSmall.innerText = entry.validText;
        }

        if (isHomePage && !col.hasAttribute('data-season-cat')) {
            const isOneOfEightHot = EIGHT_HOT_DEAL_TITLES.some(
                t => t.toLowerCase() === entry.exactTitle.toLowerCase()
            );
            col.setAttribute('data-hot', isOneOfEightHot ? 'true' : 'false');
        }

        const seasonMatch = getSeasonBadgeForProduct(entry.exactTitle);
        if (seasonMatch) {
            injectSeasonBadgeIntoCardBody(col, seasonMatch.badgeText);
        }

        const titleEl = col.querySelector('h6');
        if (titleEl) titleEl.innerText = entry.exactTitle;

        const imgEl = col.querySelector('.deal-img-wrapper img');
        if (imgEl && entry.mainImg) {
            imgEl.src = entry.mainImg;
            if (entry.imgFit === 'contain') {
                imgEl.classList.add('img-contain-mode');
            } else {
                imgEl.classList.remove('img-contain-mode');
            }
        }

        let storeTagEl = col.querySelector('.store-tag');
        const locationEl = col.querySelector('.store-location');
        if (!storeTagEl && locationEl && locationEl.parentNode) {
            const topRow = document.createElement('div');
            topRow.className = 'd-flex justify-content-between align-items-center mb-1';
            storeTagEl = document.createElement('span');
            storeTagEl.className = 'store-tag';
            topRow.appendChild(storeTagEl);
            locationEl.parentNode.insertBefore(topRow, locationEl);
        }
        if (storeTagEl) {
            storeTagEl.innerHTML = `<i class="bi bi-shop me-1"></i>${entry.store}`;
        }

        if (locationEl) {
            const fullLocationDisplay = entry.locationFull || `${entry.store} - ${entry.location}`;
            locationEl.innerHTML = `<i class="bi bi-geo-alt-fill text-danger me-1"></i><span class="fw-semibold">${fullLocationDisplay}</span>`;
        }

        const saveBtn = col.querySelector('.save-deal-btn');
        if (saveBtn) {
            const onclickAttr = saveBtn.getAttribute('onclick') || '';
            const match = onclickAttr.match(/addSavedDeal\('([^']+)',\s*'([^']+)',\s*(\d+),\s*(\d+)\)/);
            if (match) {
                const origP = match[3];
                const finalP = match[4];
                saveBtn.setAttribute('onclick', `addSavedDeal('${entry.exactTitle}', '${entry.store}', ${origP}, ${finalP})`);
            }
        }
    });
}

// Countdown Timers
function updateCountdowns() {
    const timers = document.querySelectorAll('[data-expiry]');
    const now = new Date().getTime();

    timers.forEach(timer => {
        const expiryTime = new Date(timer.getAttribute('data-expiry')).getTime();
        const diff = expiryTime - now;
        const card = timer.closest('.deal-card');

        if (diff <= 0) {
            timer.innerHTML = `<i class="bi bi-x-circle me-1"></i>Deal Expired`;
            timer.classList.add('expired');
            timer.classList.remove('ending-soon');

            if (card) {
                card.classList.add('deal-expired');

                const imgWrapper = card.querySelector('.deal-img-wrapper');
                if (imgWrapper && !imgWrapper.querySelector('.expired-stamp-overlay')) {
                    const stamp = document.createElement('div');
                    stamp.className = 'expired-stamp-overlay';
                    stamp.innerHTML = `<span>Deal Expired</span>`;
                    imgWrapper.appendChild(stamp);
                }

                const actionBtn = card.querySelector('.save-deal-btn');
                if (actionBtn) {
                    actionBtn.disabled = true;
                    actionBtn.innerHTML = `<i class="bi bi-slash-circle me-1"></i>Expired`;
                    actionBtn.className = 'btn btn-sm btn-secondary save-deal-btn';
                }
            }
            return;
        }

        if (card && card.classList.contains('deal-expired')) {
            card.classList.remove('deal-expired');
            const stamp = card.querySelector('.expired-stamp-overlay');
            if (stamp) stamp.remove();
            syncSaveButtons();
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const secs = Math.floor((diff % (1000 * 60)) / 1000);

        if (days === 0 || timer.getAttribute('data-expiry') === '2026-11-05T23:00:00') {
            const totalHoursLeft = Math.floor(diff / (1000 * 60 * 60));
            timer.classList.add('ending-soon');
            timer.innerHTML = `Ending Soon • ${totalHoursLeft}h : ${mins}m : ${secs}s`;
        } else {
            timer.classList.remove('ending-soon');
            timer.innerHTML = `<i class="bi bi-clock-history me-1 text-warning"></i>${days}d : ${hours}h : ${mins}m : ${secs}s`;
        }
    });
}

// ==========================================================================
// 9. SEARCH, FILTER & AUTO-SCROLL TO HOT FLASH DEALS CATEGORY TAB ON SEARCH
// ==========================================================================
let searchScrollTimeout = null;

function setupFiltersAndSorting() {
    const filterButtons = document.querySelectorAll('#dealsSection .filter-btn, .filter-bar-box .filter-btn');
    const dealsContainer = document.getElementById('dealsContainer');
    const dealsSection = document.getElementById('dealsSection');
    const dealsSectionTitle = document.getElementById('dealsSectionTitle');

    if (!dealsContainer) return;

    const cols = Array.from(dealsContainer.querySelectorAll('.deal-col'));
    const isHomePage = cols.some(col => col.hasAttribute('data-hot'));

    cols.forEach((col, index) => {
        col.setAttribute('data-original-index', index);
    });

    const heroRightCol = document.querySelector('.hero-banner .col-lg-5');
    if (heroRightCol) {
        const finderHeading = isHomePage
            ? `<h5 class="fw-bold mb-2"><i class="bi bi-search me-2 text-primary"></i>Quick Deal Finder (All 32 Deals)</h5>`
            : `<h6 class="fw-bold mb-2"><i class="bi bi-search me-2 text-primary"></i>Quick Product Search</h6>`;

        heroRightCol.innerHTML = `
            <div class="finder-box p-3 p-md-4 rounded-4 shadow">
                ${finderHeading}
                <div class="modern-search-input-wrap">
                    <i class="bi bi-search modern-search-icon"></i>
                    <input type="text" id="searchInput" class="form-control" placeholder="Search product name...">
                    <button type="button" id="clearSearchBtn" class="search-clear-btn d-none" title="Clear search">
                        <i class="bi bi-x-lg"></i>
                    </button>
                </div>
                <div class="popular-tags-row">
                    <span class="popular-label">Popular:</span>
                    <button type="button" class="popular-tag-btn" data-tag="shoe">shoe</button>
                    <button type="button" class="popular-tag-btn" data-tag="Lipstick">Lipstick</button>
                    <button type="button" class="popular-tag-btn" data-tag="camera">camera</button>
                </div>
            </div>
        `;
    }

    const prefBannerDiv = document.createElement('div');
    prefBannerDiv.id = 'customerPrefBanner';
    prefBannerDiv.className = 'personalized-pref-bar d-none d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3';
    dealsContainer.parentNode.insertBefore(prefBannerDiv, dealsContainer);

    const counterDiv = document.createElement('div');
    counterDiv.className = 'deals-ResultAndControls-bar';
    counterDiv.innerHTML = `
        <span id="liveResultCounter" class="badge bg-primary-subtle text-primary border border-primary-subtle px-3 py-2 rounded-pill fw-semibold">
            Loading deals...
        </span>
        <div class="deal-dropdowns-group">
            <div class="control-select-wrapper">
                <select id="daysFilterSelect" class="form-select form-select-sm deal-control-select" aria-label="Filter by validity period">
                    <option value="all">All Validity Periods</option>
                    <option value="1">Ending Today (&lt; 24 Hours)</option>
                    <option value="3">Up to 3 Days Left</option>
                    <option value="5">Up to 5 Days Left</option>
                    <option value="7">Up to 7 Days Left</option>
                    <option value="expired">Expired Deals Only</option>
                </select>
            </div>
            <div class="control-select-wrapper">
                <select id="sortSelect" class="form-select form-select-sm deal-control-select" aria-label="Sort deals">
                    <option value="default">Sort By: Featured Deals</option>
                    <option value="discount-desc">Highest Discount (%)</option>
                    <option value="ending-soon">Ending Soonest (Expiry Alert)</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                </select>
            </div>
        </div>
    `;
    dealsContainer.parentNode.insertBefore(counterDiv, dealsContainer);

    const searchInput = document.getElementById('searchInput');
    const clearSearchBtn = document.getElementById('clearSearchBtn');
    const popularTagBtns = document.querySelectorAll('.popular-tag-btn');
    const daysFilterSelect = document.getElementById('daysFilterSelect');
    const sortSelect = document.getElementById('sortSelect');

    const emptyStateEl = document.createElement('div');
    emptyStateEl.id = 'noDealsMessage';
    emptyStateEl.className = 'col-12 text-center py-5 d-none';
    emptyStateEl.innerHTML = `
        <div class="empty-state-box p-5 rounded-4 shadow-sm mx-auto" style="max-width: 480px;">
            <i class="bi bi-search-heart display-4 text-muted mb-3 d-block"></i>
            <h5 class="fw-bold mb-2">No matching products found</h5>
            <p class="text-muted small mb-4">We couldn't find any products matching your search or validity filter criteria.</p>
            <button class="btn btn-accent px-4" id="resetFilterBtn">
                <i class="bi bi-arrow-counterclockwise me-1"></i>Reset All Filters
            </button>
        </div>
    `;
    dealsContainer.parentNode.insertBefore(emptyStateEl, dealsContainer.nextSibling);

    function syncPopularTagUI() {
        const currentVal = searchInput ? searchInput.value.trim().toLowerCase() : '';
        if (clearSearchBtn) {
            clearSearchBtn.classList.toggle('d-none', currentVal === '');
        }
        popularTagBtns.forEach(btn => {
            const tagVal = (btn.getAttribute('data-tag') || '').toLowerCase();
            btn.classList.toggle('active', currentVal !== '' && currentVal === tagVal);
        });
    }

    function scrollToHotFlashDealsSection() {
        const targetEl = dealsSection || dealsContainer;
        if (targetEl) {
            targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    function filterAndSortCards(triggeredBySearchInput = false, immediateScroll = false) {
        syncPopularTagUI();

        const prefCats = getCustomerPreferredCategories();

        if (isHomePage && prefCats.length > 0) {
            prefBannerDiv.classList.remove('d-none');
            const prettyNames = prefCats.map(c => c === 'home' ? 'Home & Living' : c.charAt(0).toUpperCase() + c.slice(1)).join(', ');
            prefBannerDiv.innerHTML = `
                <div class="small fw-semibold">
                    Personalized Feed: Prioritizing <strong>${prettyNames}</strong> first in Hot Flash Deals & Seasonal Discounts!
                </div>
                <button type="button" class="btn btn-sm btn-outline-primary py-0 px-2 small fw-semibold" id="changePrefCatsBtn">
                    <i class="bi bi-sliders me-1"></i>Change Interests
                </button>
            `;
            document.getElementById('changePrefCatsBtn')?.addEventListener('click', openCategoryPreferenceModalAgain);
        } else {
            prefBannerDiv.classList.add('d-none');
        }

        const searchQuery = searchInput ? searchInput.value.toLowerCase().trim() : '';
        const escapedQuery = searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const searchRegex = new RegExp('\\b' + escapedQuery, 'i');

        // Auto-switch Category Tab under Hot Flash Deals Across Stores when searching (e.g. "shoe" -> Fashion (8))
        if (isHomePage && triggeredBySearchInput) {
            if (searchQuery !== '') {
                const matchedCol = cols.find(col => {
                    const t = (col.getAttribute('data-title') || '').toLowerCase();
                    const pk = (col.getAttribute('data-product-keywords') || '').toLowerCase();
                    return searchRegex.test(t) || searchRegex.test(pk);
                });
                if (matchedCol) {
                    const matchedCat = (matchedCol.getAttribute('data-main-cat') || matchedCol.getAttribute('data-subcat') || 'all').toLowerCase();
                    const targetBtn = document.querySelector(`#dealsSection .filter-btn[data-filter="${matchedCat}"]`);
                    if (targetBtn) {
                        filterButtons.forEach(b => b.classList.remove('active'));
                        targetBtn.classList.add('active');
                    }

                    // Auto-scroll to Hot Flash Deals Across Stores section so user sees the matched category & products!
                    if (immediateScroll) {
                        scrollToHotFlashDealsSection();
                    } else {
                        if (searchScrollTimeout) clearTimeout(searchScrollTimeout);
                        searchScrollTimeout = setTimeout(() => {
                            scrollToHotFlashDealsSection();
                        }, 380);
                    }
                }
            } else {
                if (searchScrollTimeout) clearTimeout(searchScrollTimeout);
                const allBtn = document.querySelector('#dealsSection .filter-btn[data-filter="all"]');
                if (allBtn) {
                    filterButtons.forEach(b => b.classList.remove('active'));
                    allBtn.classList.add('active');
                }
            }
        }

        const activeFilterBtn = document.querySelector('#dealsSection .filter-btn.active, .filter-bar-box .filter-btn.active');
        const selectedCategory = activeFilterBtn ? activeFilterBtn.getAttribute('data-filter') : 'all';
        const selectedDays = daysFilterSelect ? daysFilterSelect.value : 'all';
        const sortBy = sortSelect ? sortSelect.value : 'default';
        const now = new Date().getTime();

        if (isHomePage && dealsSectionTitle) {
            dealsSectionTitle.innerText = 'Hot Flash Deals Across Stores';
        }

        cols.forEach(col => {
            const subcat = (col.getAttribute('data-subcat') || '').toLowerCase();
            const mainCat = (col.getAttribute('data-main-cat') || subcat).toLowerCase();
            const title = (col.getAttribute('data-title') || '').toLowerCase();
            const productKeywords = (col.getAttribute('data-product-keywords') || '').toLowerCase();
            const isHot = col.getAttribute('data-hot') === 'true';

            const expiryEl = col.querySelector('[data-expiry]');
            const expiryAttr = expiryEl ? expiryEl.getAttribute('data-expiry') : '';
            const expiryTime = expiryAttr ? new Date(expiryAttr).getTime() : now;
            const diff = expiryTime - now;
            const daysLeftFloat = diff / (1000 * 60 * 60 * 24);

            const matchesCategory = (selectedCategory === 'all' || subcat === selectedCategory || mainCat === selectedCategory);
            const matchesSearch = !searchQuery ||
                                  searchRegex.test(title) ||
                                  searchRegex.test(productKeywords);

            let matchesDays = true;
            if (selectedDays === 'expired') {
                matchesDays = diff <= 0;
            } else if (selectedDays === '1') {
                matchesDays = diff > 0 && (daysLeftFloat <= 1 || expiryAttr === '2026-11-05T23:00:00');
            } else if (selectedDays !== 'all') {
                const maxDays = parseFloat(selectedDays);
                matchesDays = diff > 0 && daysLeftFloat <= maxDays + 0.5;
            }

            if (isHomePage && !searchQuery && selectedCategory === 'all' && selectedDays === 'all') {
                col.style.display = isHot ? '' : 'none';
            } else {
                col.style.display = (matchesCategory && matchesSearch && matchesDays) ? '' : 'none';
            }
        });

        const visibleCols = cols.filter(col => col.style.display !== 'none');

        visibleCols.sort((a, b) => {
            const indexA = parseInt(a.getAttribute('data-original-index'));
            const indexB = parseInt(b.getAttribute('data-original-index'));
            const priceA = parseFloat(a.getAttribute('data-price'));
            const priceB = parseFloat(b.getAttribute('data-price'));
            const discountA = parseFloat(a.getAttribute('data-discount'));
            const discountB = parseFloat(b.getAttribute('data-discount'));
            const expiryA = new Date(a.querySelector('[data-expiry]').getAttribute('data-expiry')).getTime();
            const expiryB = new Date(b.querySelector('[data-expiry]').getAttribute('data-expiry')).getTime();

            if (sortBy === 'discount-desc') return discountB - discountA;
            if (sortBy === 'price-asc') return priceA - priceB;
            if (sortBy === 'price-desc') return priceB - priceA;
            if (sortBy === 'ending-soon') return expiryA - expiryB;

            if (prefCats.length > 0) {
                const catA = (a.getAttribute('data-main-cat') || a.getAttribute('data-subcat') || '').toLowerCase();
                const catB = (b.getAttribute('data-main-cat') || b.getAttribute('data-subcat') || '').toLowerCase();
                const prefRankA = prefCats.indexOf(catA);
                const prefRankB = prefCats.indexOf(catB);
                const isPrefA = prefRankA !== -1;
                const isPrefB = prefRankB !== -1;

                if (isPrefA && !isPrefB) return -1;
                if (!isPrefA && isPrefB) return 1;
                if (isPrefA && isPrefB && prefRankA !== prefRankB) return prefRankA - prefRankB;
            }

            return indexA - indexB;
        });

        visibleCols.forEach((col, idx) => {
            col.classList.remove('card-reveal-anim');
            void col.offsetWidth;
            col.style.animationDelay = `${idx * 0.06}s`;
            col.classList.add('card-reveal-anim');
            dealsContainer.appendChild(col);
        });

        const counterBadge = document.getElementById('liveResultCounter');
        if (counterBadge) {
            if (isHomePage && !searchQuery && selectedCategory === 'all' && selectedDays === 'all') {
                counterBadge.innerText = `Showing 8 Featured Hot Deals • Type a product name above to search all ${cols.length} deals`;
            } else {
                counterBadge.innerText = `Showing ${visibleCols.length} of ${cols.length} matching deals`;
            }
        }

        if (visibleCols.length === 0) {
            emptyStateEl.classList.remove('d-none');
        } else {
            emptyStateEl.classList.add('d-none');
        }
    }

    window.triggerDealScoutFilterUpdate = () => filterAndSortCards(false, false);

    popularTagBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (!searchInput) return;
            const clickedTag = btn.getAttribute('data-tag') || '';

            if (searchInput.value.trim().toLowerCase() === clickedTag.toLowerCase()) {
                searchInput.value = '';
                filterAndSortCards(true, false);
                return;
            }

            const testRegex = new RegExp('\\b' + clickedTag, 'i');
            const hasMatchOnCurrentPage = cols.some(col => {
                const t = (col.getAttribute('data-title') || '').toLowerCase();
                const pk = (col.getAttribute('data-product-keywords') || '').toLowerCase();
                return testRegex.test(t) || testRegex.test(pk);
            });

            if (!hasMatchOnCurrentPage && !isHomePage) {
                window.location.href = `index.html?q=${encodeURIComponent(clickedTag)}`;
                return;
            }

            searchInput.value = clickedTag;
            filterAndSortCards(true, true);
        });
    });

    if (clearSearchBtn && searchInput) {
        clearSearchBtn.addEventListener('click', () => {
            searchInput.value = '';
            searchInput.focus();
            filterAndSortCards(true, false);
        });
    }

    const resetBtn = document.getElementById('resetFilterBtn');
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            const allBtn = document.querySelector('.filter-btn[data-filter="all"]');
            if (allBtn) allBtn.classList.add('active');
            if (searchInput) searchInput.value = '';
            if (daysFilterSelect) daysFilterSelect.value = 'all';
            if (sortSelect) sortSelect.value = 'default';
            filterAndSortCards(false, false);
        });
    }

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // If user clicks "All Hot Deals" while search box has text, clear search box so all 8 Hot Deals appear
            if (btn.getAttribute('data-filter') === 'all' && searchInput && searchInput.value.trim() !== '') {
                searchInput.value = '';
            }
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            filterAndSortCards(false, false);
        });
    });

    if (searchInput) {
        searchInput.addEventListener('input', () => filterAndSortCards(true, false));
        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                filterAndSortCards(true, true);
            }
        });
    }
    if (daysFilterSelect) daysFilterSelect.addEventListener('change', () => filterAndSortCards(false, false));
    if (sortSelect) sortSelect.addEventListener('change', () => filterAndSortCards(false, false));

    const urlParams = new URLSearchParams(window.location.search);
    const initialQuery = urlParams.get('q');
    if (initialQuery && searchInput) {
        searchInput.value = initialQuery;
        setTimeout(() => filterAndSortCards(true, true), 150);
    } else {
        filterAndSortCards(false, false);
    }
}

// ==========================================================================
// 10. SMART SAVINGS TRACKER
// ==========================================================================
function syncSaveButtons() {
    const buttons = document.querySelectorAll('.save-deal-btn');
    buttons.forEach(btn => {
        const card = btn.closest('.deal-card');
        if (card && card.classList.contains('deal-expired')) return;
        if (btn.innerText.includes('Expired')) return;

        const onclickAttr = btn.getAttribute('onclick') || '';
        const match = onclickAttr.match(/addSavedDeal\('([^']+)'/);
        if (!match) return;

        const dealTitle = match[1];
        const isAlreadySaved = savedDeals.some(item => item.title === dealTitle);

        if (isAlreadySaved) {
            btn.innerHTML = `✓ Saved`;
            btn.classList.remove('btn-accent');
            btn.classList.add('btn-success');
            btn.disabled = true;
        } else {
            btn.innerHTML = `<i class="bi bi-bookmark-plus me-1"></i>Save Deal`;
            btn.classList.remove('btn-success');
            btn.classList.add('btn-accent');
            btn.disabled = false;
        }
    });
}

function renderSavedDeals() {
    const listEl = document.getElementById('savedDealsList');
    const countBadge = document.getElementById('savedCountBadge');
    const totalOriginalEl = document.getElementById('totalOriginalPrice');
    const totalFinalEl = document.getElementById('totalFinalPrice');
    const totalSavedEl = document.getElementById('totalSavedAmount');

    if (countBadge) countBadge.innerText = savedDeals.length;
    syncSaveButtons();

    if (!listEl) return;

    if (savedDeals.length === 0) {
        listEl.innerHTML = `
            <div class="text-center my-5 text-muted">
                <i class="bi bi-bookmark-heart display-5 d-block mb-2 opacity-50"></i>
                <p class="small mb-0">No deals saved yet.<br>Click "Save Deal" on any item to calculate your savings!</p>
            </div>
        `;
        totalOriginalEl.innerText = '0 MMK';
        totalFinalEl.innerText = '0 MMK';
        totalSavedEl.innerText = '0 MMK';
        return;
    }

    let totalOriginal = 0;
    let totalFinal = 0;

    const itemsHtml = savedDeals.map((item, idx) => {
        totalOriginal += item.originalPrice;
        totalFinal += item.finalPrice;
        const saved = item.originalPrice - item.finalPrice;
        return `
            <div class="d-flex justify-content-between align-items-center border-bottom py-2">
                <div>
                    <h6 class="mb-0 fw-bold small">${item.title}</h6>
                    <small class="text-muted d-block">${item.store}</small>
                    <small class="text-success fw-semibold">Save ${saved.toLocaleString()} MMK</small>
                </div>
                <div class="text-end ms-2">
                    <div class="fw-bold small">${item.finalPrice.toLocaleString()} MMK</div>
                    <button class="btn btn-sm text-danger p-0 small" onclick="removeSavedDeal(${idx})">
                        <i class="bi bi-trash"></i> Remove
                    </button>
                </div>
            </div>
        `;
    }).join('');

    listEl.innerHTML = `
        <div class="d-flex justify-content-between align-items-center mb-2 pb-2 border-bottom">
            <span class="small fw-bold text-muted">Saved Deals (${savedDeals.length})</span>
            <button class="btn btn-sm btn-outline-danger py-0 px-2 small" onclick="clearAllSavedDeals()">
                <i class="bi bi-trash3 me-1"></i>Clear All
            </button>
        </div>
        ${itemsHtml}
    `;

    const totalSaved = totalOriginal - totalFinal;
    totalOriginalEl.innerText = totalOriginal.toLocaleString() + ' MMK';
    totalFinalEl.innerText = totalFinal.toLocaleString() + ' MMK';
    totalSavedEl.innerText = totalSaved.toLocaleString() + ' MMK';
}

function addSavedDeal(title, store, originalPrice, finalPrice) {
    if (savedDeals.some(item => item.title === title)) return;

    savedDeals.push({ title, store, originalPrice, finalPrice });
    localStorage.setItem('dealScoutSaved', JSON.stringify(savedDeals));
    incrementCustomerSaveCount();
    renderSavedDeals();
    showToastNotification(`Added to Savings Tracker! (${title})`, 'success');
}

function removeSavedDeal(index) {
    const removed = savedDeals[index];
    savedDeals.splice(index, 1);
    localStorage.setItem('dealScoutSaved', JSON.stringify(savedDeals));
    renderSavedDeals();
    if (removed) showToastNotification(`Removed "${removed.title}"`, 'danger');
}

function clearAllSavedDeals() {
    savedDeals = [];
    localStorage.setItem('dealScoutSaved', JSON.stringify(savedDeals));
    renderSavedDeals();
    showToastNotification('Cleared all saved deals!', 'danger');
}

function showToastNotification(message, type = 'success') {
    let toastContainer = document.getElementById('dealScoutToastContainer');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.id = 'dealScoutToastContainer';
        toastContainer.className = 'position-fixed bottom-0 end-0 p-3';
        toastContainer.style.zIndex = '1090';
        document.body.appendChild(toastContainer);
    }

    const toastEl = document.createElement('div');
    const bgClass = type === 'success' ? 'bg-success' : 'bg-danger';
    toastEl.className = `toast align-items-center text-white ${bgClass} border-0 show shadow-lg mb-2`;
    toastEl.innerHTML = `
        <div class="d-flex">
            <div class="toast-body fw-semibold small">
                <i class="bi bi-check-circle-fill me-2"></i>${message}
            </div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" onclick="this.closest('.toast').remove()"></button>
        </div>
    `;

    toastContainer.appendChild(toastEl);
    setTimeout(() => {
        toastEl.remove();
    }, 2800);
}

// ==========================================================================
// 11. PRODUCT PREVIEW MODAL (INCLUDES SEASONAL OFFER BADGE IN PREVIEW)
// ==========================================================================
function buildProductPreviewModal() {
    if (document.getElementById('productPreviewModal')) return;

    const modalHtml = `
    <div class="modal fade" id="productPreviewModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content preview-modal-content shadow-lg">
                <div class="modal-header border-bottom py-2 px-3">
                    <div class="d-flex flex-wrap align-items-center gap-2">
                        <span class="badge bg-warning text-dark fw-bold" id="previewDiscountBadge">-30% OFF</span>
                        <span class="store-tag" id="previewStoreTag"><i class="bi bi-shop me-1"></i>STORE</span>
                        <span class="badge bg-secondary-subtle text-secondary border" id="previewSubcatBadge">Category</span>
                    </div>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="row g-3 align-items-start">
                        <div class="col-lg-5">
                            <div class="preview-main-img-box">
                                <img id="previewMainImg" src="" alt="Product Preview">
                                <span class="badge-timer" id="previewTimerBadge">Loading...</span>
                            </div>
                            <div class="mt-2 p-3 rounded-3 border bg-body-tertiary small">
                                <div class="fw-bold mb-1"><i class="bi bi-info-circle-fill text-primary me-1"></i>Promotion Details</div>
                                <p class="text-muted mb-2" style="font-size: 0.82rem; line-height: 1.45;" id="previewDescription"></p>
                                <div class="d-flex flex-wrap gap-3 text-muted pt-2 border-top" style="font-size: 0.78rem;">
                                    <span><i class="bi bi-patch-check-fill text-success me-1"></i>Verified Outlet</span>
                                    <span><i class="bi bi-calendar-event text-warning me-1"></i><span id="previewValidityText"></span></span>
                                </div>
                            </div>
                        </div>

                        <div class="col-lg-7 d-flex flex-column">
                            <h5 class="fw-bold mb-1" id="previewTitle">Product Title</h5>
                            <p class="text-muted small mb-2" id="previewStoreSub">Official Store Promotion</p>

                            <div id="previewSeasonBadgeWrap" class="d-none"></div>

                            <div class="d-flex align-items-baseline flex-wrap gap-2 mb-2 pb-2 border-bottom">
                                <span class="fs-4 fw-bolder text-danger" id="previewPriceNew">0 MMK</span>
                                <span class="price-old small" id="previewPriceOld">0 MMK</span>
                                <span class="savings-pill ms-auto" id="previewSavingsPill">Save 0 MMK</span>
                            </div>

                            <div class="mb-2" id="previewColorBlock">
                                <div class="d-flex align-items-center gap-3">
                                    <div class="small fw-bold">
                                        Color: <span id="selectedColorName" class="text-primary fw-bold">Original</span>
                                    </div>
                                    <div class="color-swatch-list" id="previewColorList"></div>
                                </div>
                            </div>

                            <div class="mb-2" id="previewSizeBlock">
                                <div class="p-2 rounded-3 border bg-body-tertiary d-flex flex-wrap align-items-center justify-content-between gap-2">
                                    <span class="small fw-bold text-muted"><i class="bi bi-layers me-1 text-primary"></i>Available Sizes / Spec:</span>
                                    <span class="size-info-tag" id="previewSizeInfoText">Standard</span>
                                </div>
                            </div>

                            <div class="d-grid my-2">
                                <button type="button" class="btn btn-accent fw-bold py-2" id="previewSaveBtn">
                                    <i class="bi bi-bookmark-plus me-2"></i>Save Deal to Tracker
                                </button>
                            </div>

                            <div class="store-availability-box mt-1" id="previewMapSection">
                                <div class="d-flex justify-content-between align-items-center gap-2">
                                    <div>
                                        <h6 class="fw-bold mb-0 small"><i class="bi bi-geo-alt-fill text-danger me-1"></i>Store Availability & Exact Map</h6>
                                        <small class="text-success fw-semibold" style="font-size: 0.76rem;"><i class="bi bi-check-circle-fill me-1"></i>In stock at branch • Open 9:30 AM – 8:30 PM</small>
                                    </div>
                                    <a id="previewGoogleMapsLink" href="#" target="_blank" rel="noopener" class="btn btn-sm btn-outline-primary fw-semibold py-1 px-2 flex-shrink-0" style="font-size: 0.76rem;">
                                        <i class="bi bi-map me-1"></i>Open Map
                                    </a>
                                </div>
                                <div class="text-muted fw-semibold mt-1" style="font-size: 0.78rem;" id="previewFullAddress">Yangon</div>
                                <iframe id="previewGoogleMapFrame" class="store-map-frame" loading="lazy" referrerpolicy="no-referrer-when-downgrade" src=""></iframe>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHtml);
}

function attachPreviewButtonsToCards() {
    buildProductPreviewModal();

    const cols = document.querySelectorAll('.deal-col');
    cols.forEach(col => {
        if (col.getAttribute('data-preview-bound') === 'true') return;
        col.setAttribute('data-preview-bound', 'true');

        const card = col.querySelector('.deal-card');
        const imgWrapper = col.querySelector('.deal-img-wrapper');
        const locationEl = col.querySelector('.store-location');

        if (!card || !imgWrapper) return;

        let overlayBtn = imgWrapper.querySelector('.btn-quick-preview-overlay');
        if (!overlayBtn) {
            overlayBtn = document.createElement('button');
            overlayBtn.type = 'button';
            overlayBtn.className = 'btn-quick-preview-overlay';
            overlayBtn.innerHTML = `<i class="bi bi-eye me-1"></i>Preview`;
            imgWrapper.appendChild(overlayBtn);
        }
        overlayBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            openProductPreview(col, false);
        });

        imgWrapper.addEventListener('click', () => openProductPreview(col, false));

        if (locationEl) {
            locationEl.setAttribute('title', 'Click to view store on Google Maps');
            if (!locationEl.innerHTML.includes('Map')) {
                locationEl.innerHTML += ` <span class="badge bg-danger-subtle text-danger border border-danger-subtle ms-1" style="font-size:0.68rem;">Map</span>`;
            }
            locationEl.addEventListener('click', (e) => {
                e.stopPropagation();
                openProductPreview(col, true);
            });
        }
    });
}

function openProductPreview(col, scrollToMap = false) {
    const card = col.querySelector('.deal-card');
    const isExpired = card.classList.contains('deal-expired');

    const rawTitle = col.getAttribute('data-title') || col.querySelector('h6')?.innerText || 'Deal Item';
    const catalogEntry = findProductCatalogEntry(rawTitle);

    const title = catalogEntry ? catalogEntry.exactTitle : rawTitle;
    const store = catalogEntry ? catalogEntry.store : (col.getAttribute('data-store') || 'Official Outlet');
    const location = catalogEntry ? catalogEntry.location : (col.getAttribute('data-location') || 'Yangon, Myanmar');
    const fullLocationDisplay = catalogEntry && catalogEntry.locationFull ? catalogEntry.locationFull : `${store} - ${location}`;
    const mapQueryStr = catalogEntry ? catalogEntry.mapQuery : `${store}, ${location}`;
    const directMapLink = catalogEntry && catalogEntry.mapLink ? catalogEntry.mapLink : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQueryStr)}`;

    const subcat = col.getAttribute('data-subcat') || 'Featured';
    const finalPrice = parseFloat(col.getAttribute('data-price') || '0');
    const discount = col.getAttribute('data-discount') || '20';
    const defaultImgSrc = catalogEntry ? catalogEntry.mainImg : (col.querySelector('.deal-img-wrapper img')?.getAttribute('src') || '');
    const validityText = col.querySelector('small.text-muted')?.innerText || 'Limited Time Offer';
    const timerText = col.querySelector('.badge-timer')?.innerHTML || '';

    let originalPrice = finalPrice;
    const saveBtn = col.querySelector('.save-deal-btn');
    const onclickAttr = saveBtn ? (saveBtn.getAttribute('onclick') || '') : '';
    const match = onclickAttr.match(/addSavedDeal\('([^']+)',\s*'([^']+)',\s*(\d+),\s*(\d+)\)/);
    let saveTitle = title;
    let saveStore = store;

    if (match) {
        saveTitle = match[1];
        saveStore = match[2];
        originalPrice = parseFloat(match[3]);
    }

    const savedAmount = Math.max(0, originalPrice - finalPrice);

    document.getElementById('previewTitle').innerText = title;
    document.getElementById('previewStoreTag').innerHTML = `<i class="bi bi-shop me-1"></i>${store}`;
    document.getElementById('previewSubcatBadge').innerText = subcat.toUpperCase();
    document.getElementById('previewStoreSub').innerText = fullLocationDisplay;
    document.getElementById('previewDiscountBadge').innerText = isExpired ? 'EXPIRED' : `-${discount}% OFF`;
    document.getElementById('previewValidityText').innerText = validityText;
    document.getElementById('previewTimerBadge').innerHTML = timerText;
    document.getElementById('previewDescription').innerText = catalogEntry ? catalogEntry.description : 'Verified physical outlet promotion in Yangon.';

    const previewSeasonWrap = document.getElementById('previewSeasonBadgeWrap');
    const seasonMatch = getSeasonBadgeForProduct(title);
    if (previewSeasonWrap) {
        if (seasonMatch) {
            previewSeasonWrap.classList.remove('d-none');
            previewSeasonWrap.innerHTML = `<span class="badge-season-tag"><i class="bi bi-stars"></i>${seasonMatch.badgeText}</span>`;
        } else {
            previewSeasonWrap.classList.add('d-none');
            previewSeasonWrap.innerHTML = '';
        }
    }

    document.getElementById('previewPriceNew').innerText = `${finalPrice.toLocaleString()} MMK`;
    document.getElementById('previewPriceOld').innerText = `${originalPrice.toLocaleString()} MMK`;
    document.getElementById('previewSavingsPill').innerText = `Save ${savedAmount.toLocaleString()} MMK`;

    const mainImg = document.getElementById('previewMainImg');
    mainImg.src = defaultImgSrc;
    mainImg.style.filter = 'none';

    if (catalogEntry && catalogEntry.imgFit === 'contain') {
        mainImg.classList.add('img-contain-mode');
    } else {
        mainImg.classList.remove('img-contain-mode');
    }

    const colorBlockEl = document.getElementById('previewColorBlock');
    const selectedColorNameEl = document.getElementById('selectedColorName');
    const colorListEl = document.getElementById('previewColorList');
    const colors = (catalogEntry && catalogEntry.colors) ? catalogEntry.colors : [];

    if (colors.length > 0) {
        colorBlockEl.classList.remove('d-none');
        selectedColorNameEl.innerText = colors[0].name;
        applySmartProductColor(mainImg, defaultImgSrc, colors[0]);

        colorListEl.innerHTML = colors.map((c, idx) => `
            <div class="color-swatch ${idx === 0 ? 'active' : ''}" 
                 style="background-color: ${c.hex};" 
                 data-idx="${idx}"
                 title="${c.name}"></div>
        `).join('');

        colorListEl.querySelectorAll('.color-swatch').forEach(swatch => {
            swatch.addEventListener('click', () => {
                colorListEl.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('active'));
                swatch.classList.add('active');
                const idx = parseInt(swatch.getAttribute('data-idx'));
                const chosenColor = colors[idx];
                selectedColorNameEl.innerText = chosenColor.name;
                applySmartProductColor(mainImg, defaultImgSrc, chosenColor);
            });
        });
    } else {
        colorBlockEl.classList.add('d-none');
    }

    const sizeBlockEl = document.getElementById('previewSizeBlock');
    const sizeInfoTextEl = document.getElementById('previewSizeInfoText');
    if (catalogEntry && catalogEntry.sizeInfo) {
        sizeBlockEl.classList.remove('d-none');
        sizeInfoTextEl.innerText = catalogEntry.sizeInfo;
    } else {
        sizeBlockEl.classList.add('d-none');
    }

    const modalSaveBtn = document.getElementById('previewSaveBtn');
    const alreadySaved = savedDeals.some(item => item.title === saveTitle);

    if (isExpired) {
        modalSaveBtn.disabled = true;
        modalSaveBtn.className = 'btn btn-secondary fw-bold py-2';
        modalSaveBtn.innerHTML = `<i class="bi bi-slash-circle me-2"></i>Promotion Expired`;
    } else if (alreadySaved) {
        modalSaveBtn.disabled = true;
        modalSaveBtn.className = 'btn btn-success fw-bold py-2';
        modalSaveBtn.innerHTML = `✓ Already Saved in Tracker`;
    } else {
        modalSaveBtn.disabled = false;
        modalSaveBtn.className = 'btn btn-accent fw-bold py-2';
        modalSaveBtn.innerHTML = `<i class="bi bi-bookmark-plus me-2"></i>Save Deal to Tracker (Save ${savedAmount.toLocaleString()} MMK)`;
        modalSaveBtn.onclick = () => {
            addSavedDeal(saveTitle, saveStore, originalPrice, finalPrice);
            modalSaveBtn.disabled = true;
            modalSaveBtn.className = 'btn btn-success fw-bold py-2';
            modalSaveBtn.innerHTML = `✓ Saved to Tracker`;
        };
    }

    document.getElementById('previewFullAddress').innerText = fullLocationDisplay;
    const encodedMapQuery = encodeURIComponent(mapQueryStr);
    document.getElementById('previewGoogleMapFrame').src = `https://maps.google.com/maps?q=${encodedMapQuery}&t=&z=17&ie=UTF8&iwloc=&output=embed`;
    document.getElementById('previewGoogleMapsLink').href = directMapLink;

    const modalEl = document.getElementById('productPreviewModal');
    const bsModal = bootstrap.Modal.getOrCreateInstance(modalEl);
    bsModal.show();

    if (scrollToMap) {
        setTimeout(() => {
            document.getElementById('previewMapSection')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 350);
    }
}

// ==========================================================================
// 12. DYNAMIC CROSS-NAVIGATION MEGA FOOTER & DEEP-LINK SUBCATEGORY ROUTER
// ==========================================================================
function setupCrossNavFooterAndDeepLinks() {
    const footerEl = document.querySelector('footer');
    if (footerEl) {
        footerEl.className = 'dealscout-mega-footer pt-5 pb-4 mt-5';
        footerEl.innerHTML = `
            <div class="container">
                <div class="row g-4 justify-content-between">
                    <div class="col-lg-3 col-md-12 mb-2 mb-lg-0">
                        <a class="navbar-brand fs-3 d-inline-block mb-2 text-white text-decoration-none fw-bolder" href="index.html">
                            <i class="bi bi-tag-fill me-2 text-warning"></i>Deal<span style="color:#FF5A1F;">Scout</span>
                        </a>
                        <p class="footer-brand-desc mb-3">
                            Compare verified Yangon physical store discounts, track real-time promotion timers, and locate exact outlets on Google Maps.
                        </p>
                        <div class="small fw-bold text-uppercase text-white-50 mb-2" style="font-size:0.74rem; letter-spacing:0.6px;">
                            Follow DealScout
                        </div>
                        <div class="footer-social-list">
                            <a href="https://www.facebook.com" target="_blank" rel="noopener" class="footer-social-btn" title="Facebook">
                                <i class="bi bi-facebook"></i>
                            </a>
                            <a href="https://www.instagram.com" target="_blank" rel="noopener" class="footer-social-btn" title="Instagram">
                                <i class="bi bi-instagram"></i>
                            </a>
                            <a href="https://www.tiktok.com" target="_blank" rel="noopener" class="footer-social-btn" title="TikTok">
                                <i class="bi bi-tiktok"></i>
                            </a>
                            <a href="https://x.com" target="_blank" rel="noopener" class="footer-social-btn" title="X (Twitter)">
                                <i class="bi bi-twitter-x"></i>
                            </a>
                            <a href="https://www.youtube.com" target="_blank" rel="noopener" class="footer-social-btn" title="YouTube">
                                <i class="bi bi-youtube"></i>
                            </a>
                            <a href="https://telegram.org" target="_blank" rel="noopener" class="footer-social-btn" title="Telegram">
                                <i class="bi bi-telegram"></i>
                            </a>
                        </div>
                    </div>

                    <div class="col-lg-9 col-md-12">
                        <div class="row row-cols-2 row-cols-sm-3 row-cols-md-5 g-3">
                            <div class="col">
                                <a href="fashion.html" class="footer-main-nav-btn">
                                    <span>Fashion</span>
                                    <i class="bi bi-arrow-up-right small"></i>
                                </a>
                                <ul class="footer-subnav-list">
                                    <li><a href="fashion.html?subcat=clothing" class="footer-subnav-link" data-page="fashion.html" data-subcat="clothing">Clothing</a></li>
                                    <li><a href="fashion.html?subcat=shoes" class="footer-subnav-link" data-page="fashion.html" data-subcat="shoes">Shoes</a></li>
                                    <li><a href="fashion.html?subcat=bags" class="footer-subnav-link" data-page="fashion.html" data-subcat="bags">Bags</a></li>
                                    <li><a href="fashion.html?subcat=jewelry" class="footer-subnav-link" data-page="fashion.html" data-subcat="jewelry">Jewelry</a></li>
                                    <li><a href="fashion.html?subcat=sunglasses" class="footer-subnav-link" data-page="fashion.html" data-subcat="sunglasses">Sunglasses</a></li>
                                </ul>
                            </div>

                            <div class="col">
                                <a href="electronics.html" class="footer-main-nav-btn">
                                    <span>Electronics</span>
                                    <i class="bi bi-arrow-up-right small"></i>
                                </a>
                                <ul class="footer-subnav-list">
                                    <li><a href="electronics.html?subcat=phones" class="footer-subnav-link" data-page="electronics.html" data-subcat="phones">Phones</a></li>
                                    <li><a href="electronics.html?subcat=laptops" class="footer-subnav-link" data-page="electronics.html" data-subcat="laptops">Laptops</a></li>
                                    <li><a href="electronics.html?subcat=tablets" class="footer-subnav-link" data-page="electronics.html" data-subcat="tablets">Tablets</a></li>
                                    <li><a href="electronics.html?subcat=headphones" class="footer-subnav-link" data-page="electronics.html" data-subcat="headphones">Headphones</a></li>
                                    <li><a href="electronics.html?subcat=cameras" class="footer-subnav-link" data-page="electronics.html" data-subcat="cameras">Cameras</a></li>
                                </ul>
                            </div>

                            <div class="col">
                                <a href="beauty.html" class="footer-main-nav-btn">
                                    <span>Beauty</span>
                                    <i class="bi bi-arrow-up-right small"></i>
                                </a>
                                <ul class="footer-subnav-list">
                                    <li><a href="beauty.html?subcat=cosmetics" class="footer-subnav-link" data-page="beauty.html" data-subcat="cosmetics">Cosmetics</a></li>
                                    <li><a href="beauty.html?subcat=skincare" class="footer-subnav-link" data-page="beauty.html" data-subcat="skincare">Skincare</a></li>
                                    <li><a href="beauty.html?subcat=perfumes" class="footer-subnav-link" data-page="beauty.html" data-subcat="perfumes">Perfumes</a></li>
                                    <li><a href="beauty.html?subcat=hair" class="footer-subnav-link" data-page="beauty.html" data-subcat="hair">Hair & Styling</a></li>
                                    <li><a href="beauty.html?subcat=nails" class="footer-subnav-link" data-page="beauty.html" data-subcat="nails">Nail Salons</a></li>
                                </ul>
                            </div>

                            <div class="col">
                                <a href="home-living.html" class="footer-main-nav-btn">
                                    <span>Home & Living</span>
                                    <i class="bi bi-arrow-up-right small"></i>
                                </a>
                                <ul class="footer-subnav-list">
                                    <li><a href="home-living.html?subcat=furniture" class="footer-subnav-link" data-page="home-living.html" data-subcat="furniture">Furniture</a></li>
                                    <li><a href="home-living.html?subcat=decor" class="footer-subnav-link" data-page="home-living.html" data-subcat="decor">Decor</a></li>
                                    <li><a href="home-living.html?subcat=bedding" class="footer-subnav-link" data-page="home-living.html" data-subcat="bedding">Bedding</a></li>
                                    <li><a href="home-living.html?subcat=kitchenware" class="footer-subnav-link" data-page="home-living.html" data-subcat="kitchenware">Kitchenware</a></li>
                                    <li><a href="home-living.html?subcat=cleaning" class="footer-subnav-link" data-page="home-living.html" data-subcat="cleaning">Cleaning</a></li>
                                </ul>
                            </div>

                            <div class="col">
                                <a href="index.html?season=thadingyut" class="footer-main-nav-btn footer-season-main-link" data-season="thadingyut">
                                    <span>Seasonal</span>
                                    <i class="bi bi-arrow-up-right small"></i>
                                </a>
                                <ul class="footer-subnav-list">
                                    <li><a href="index.html?season=thadingyut" class="footer-subnav-link footer-season-sub-link" data-season="thadingyut">Thadingyut</a></li>
                                    <li><a href="index.html?season=christmas" class="footer-subnav-link footer-season-sub-link" data-season="christmas">Christmas</a></li>
                                    <li><a href="index.html?season=newyear" class="footer-subnav-link footer-season-sub-link" data-season="newyear">New Year</a></li>
                                    <li><a href="index.html?season=monsoon" class="footer-subnav-link footer-season-sub-link" data-season="monsoon">MonSoon Season</a></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="footer-bottom-bar d-flex flex-wrap justify-content-between align-items-center gap-2 text-secondary small">
                    <div>© 2026 <strong>DealScout</strong> • All 32 Verified Yangon Store Promotions</div>
                    <div>© 2026 <strong>DealScout</strong> • All rights reserved.</div>
                </div>
            </div>
        `;

        footerEl.querySelectorAll('.footer-subnav-link[data-subcat]').forEach(link => {
            link.addEventListener('click', (e) => {
                const targetPage = link.getAttribute('data-page');
                const subcatKey = link.getAttribute('data-subcat');
                const currentPath = window.location.pathname.split('/').pop() || 'index.html';

                if (currentPath.toLowerCase() === targetPage.toLowerCase()) {
                    e.preventDefault();
                    closeCustomPageViews();
                    const filterBtn = document.querySelector(`.filter-btn[data-filter="${subcatKey}"]`);
                    if (filterBtn) {
                        filterBtn.click();
                        document.querySelector('.filter-bar-box, #dealsContainer')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                }
            });
        });

        footerEl.querySelectorAll('.footer-season-main-link, .footer-season-sub-link').forEach(link => {
            link.addEventListener('click', (e) => {
                const seasonKey = link.getAttribute('data-season');
                if (document.getElementById('seasonalDiscountSection')) {
                    e.preventDefault();
                    closeCustomPageViews();
                    activateSeasonalTab(seasonKey, true);
                }
            });
        });
    }

    const urlParams = new URLSearchParams(window.location.search);
    const targetSubcat = urlParams.get('subcat');
    const targetSeason = urlParams.get('season');

    if (targetSubcat) {
        setTimeout(() => {
            closeCustomPageViews();
            const filterBtn = document.querySelector(`.filter-btn[data-filter="${targetSubcat.toLowerCase()}"]`);
            if (filterBtn) {
                filterBtn.click();
                document.querySelector('.filter-bar-box, #dealsContainer')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }, 180);
    }

    if (targetSeason && document.getElementById('seasonalDiscountSection')) {
        setTimeout(() => {
            closeCustomPageViews();
            activateSeasonalTab(targetSeason.toLowerCase(), true);
        }, 200);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    setupThemeToggle();
    syncAllCardsWithRealStores();
    setupFiltersAndSorting();
    setupHomeHeroSliderAndSeasonalSection();
    setupForcedAuthGate();
    updateNavbarAuthAndLinks();
    attachPreviewButtonsToCards();
    setupCrossNavFooterAndDeepLinks();
    setInterval(updateCountdowns, 1000);
    updateCountdowns();
    renderSavedDeals();
});
