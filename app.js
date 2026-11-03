// app.js - DealScout Final Logic (Single Top Search Box + Popular Tags + Method A Days Left Dropdown & Sort Dropdown)

let savedDeals = JSON.parse(localStorage.getItem('dealScoutSaved')) || [];
const recoloredImageCache = {};

// ==========================================================================
// MASTER CATALOG: 32 PRODUCTS WITH PRODUCT-ONLY TAGS, STORES & MAP LINKS
// ==========================================================================
const REAL_PRODUCT_DATABASE = {
    // ---------------- FASHION (1 - 8) ----------------
    "Nike Air Zoom": {
        exactTitle: "Nike Free RN Running Sneakers",
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
// SMART COLOR ENGINE (SUPPORTS DIRECT IMAGE URLS + CANVAS RECOLORING)
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

// ==========================================================================
// SYNC ALL CARDS: ENSURE STORE NAME & PRODUCT-ONLY KEYWORDS ARE SET
// ==========================================================================
function syncAllCardsWithRealStores() {
    document.querySelectorAll('.cat-card').forEach((catEl, i) => {
        catEl.style.animationDelay = `${i * 0.08}s`;
    });

    const cols = document.querySelectorAll('.deal-col');
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

// 0. Light Mode / Dark Mode Theme Switcher
function setupThemeToggle() {
    const savedTheme = localStorage.getItem('dealScoutTheme') || 'light';
    document.documentElement.setAttribute('data-bs-theme', savedTheme);
    updateThemeButtonUI(savedTheme);

    const toggleBtn = document.getElementById('themeToggleBtn');
    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-bs-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-bs-theme', newTheme);
            localStorage.setItem('dealScoutTheme', newTheme);
            updateThemeButtonUI(newTheme);
        });
    }
}

function updateThemeButtonUI(theme) {
    const toggleBtn = document.getElementById('themeToggleBtn');
    if (!toggleBtn) return;
    if (theme === 'dark') {
        toggleBtn.innerHTML = `<i class="bi bi-sun-fill text-warning me-1"></i><span class="d-none d-sm-inline">Light</span>`;
    } else {
        toggleBtn.innerHTML = `<i class="bi bi-moon-stars-fill me-1"></i><span class="d-none d-sm-inline">Dark</span>`;
    }
}

// 1. Real-Time Promotion Countdown Timer, Urgent Alert & Monochrome Expired State on Card
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

        if (days === 0) {
            timer.classList.add('ending-soon');
            timer.innerHTML = `🔥 Ending Soon • ${hours}h : ${mins}m : ${secs}s`;
        } else {
            timer.classList.remove('ending-soon');
            timer.innerHTML = `<i class="bi bi-clock-history me-1 text-warning"></i>${days}d : ${hours}h : ${mins}m : ${secs}s`;
        }
    });
}

// ==========================================================================
// 2. SINGLE TOP SEARCH BOX WITH POPULAR TAGS + LOWER DUAL DROPDOWNS (METHOD A)
// ==========================================================================
function setupFiltersAndSorting() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const dealsContainer = document.getElementById('dealsContainer');
    const categoryShowcase = document.getElementById('categoryShowcaseSection');
    const dealsSectionTitle = document.getElementById('dealsSectionTitle');
    const dealsSectionSubtitle = document.getElementById('dealsSectionSubtitle');

    if (!dealsContainer) return;

    const cols = Array.from(dealsContainer.querySelectorAll('.deal-col'));
    const isHomePage = cols.some(col => col.hasAttribute('data-hot'));

    cols.forEach((col, index) => {
        col.setAttribute('data-original-index', index);
    });

    // A. Upgrade Top Hero Search Area on ALL pages (Remove top dropdown, keep only sleek Search Box + Popular tags)
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
                    <span class="popular-label"><i class="bi bi-fire text-danger me-1"></i>Popular:</span>
                    <button type="button" class="popular-tag-btn" data-tag="shoe">shoe</button>
                    <button type="button" class="popular-tag-btn" data-tag="Lipstick">Lipstick</button>
                    <button type="button" class="popular-tag-btn" data-tag="camera">camera</button>
                </div>
            </div>
        `;
    }

    // B. Create Lower Controls Bar (Left: Result Counter Badge | Right: Method A Days Left Dropdown + Sort By Dropdown)
    const counterDiv = document.createElement('div');
    counterDiv.className = 'deals-ResultAndControls-bar';
    counterDiv.innerHTML = `
        <span id="liveResultCounter" class="badge bg-primary-subtle text-primary border border-primary-subtle px-3 py-2 rounded-pill fw-semibold">
            Loading deals...
        </span>
        <div class="deal-dropdowns-group">
            <div class="control-select-wrapper">
                <i class="bi bi-clock-history control-select-icon text-warning"></i>
                <select id="daysFilterSelect" class="form-select form-select-sm deal-control-select" aria-label="Filter by validity period">
                    <option value="all">All Validity Periods</option>
                    <option value="1">🔥 Ending Today (&lt; 24 Hours)</option>
                    <option value="3">⏳ Up to 3 Days Left</option>
                    <option value="5">📅 Up to 5 Days Left</option>
                    <option value="7">🗓️ Up to 7 Days Left</option>
                    <option value="expired">❌ Expired Deals Only</option>
                </select>
            </div>
            <div class="control-select-wrapper">
                <i class="bi bi-arrow-down-up control-select-icon text-primary"></i>
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

    function filterAndSortCards() {
        syncPopularTagUI();

        const activeFilterBtn = document.querySelector('.filter-btn.active');
        const selectedCategory = activeFilterBtn ? activeFilterBtn.getAttribute('data-filter') : 'all';
        const searchQuery = searchInput ? searchInput.value.toLowerCase().trim() : '';
        const selectedDays = daysFilterSelect ? daysFilterSelect.value : 'all';
        const sortBy = sortSelect ? sortSelect.value : 'default';

        const escapedQuery = searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const searchRegex = new RegExp('\\b' + escapedQuery, 'i');
        const now = new Date().getTime();

        if (isHomePage && categoryShowcase) {
            if (searchQuery !== '') {
                categoryShowcase.classList.add('d-none');
                if (dealsSectionTitle) dealsSectionTitle.innerText = 'Product Search Results';
                if (dealsSectionSubtitle) dealsSectionSubtitle.innerText = `Showing matching products for "${searchInput.value}" across all 32 deals`;
            } else {
                categoryShowcase.classList.remove('d-none');
                if (dealsSectionTitle) {
                    dealsSectionTitle.innerText = (selectedCategory === 'all' && selectedDays === 'all')
                        ? 'Hot Flash Deals Across Stores'
                        : 'Filtered Store Deals';
                }
                if (dealsSectionSubtitle) {
                    dealsSectionSubtitle.innerText = 'Click any item image or "Preview" to view product info and exact Google Maps store location';
                }
            }
        }

        cols.forEach(col => {
            const subcat = (col.getAttribute('data-subcat') || '').toLowerCase();
            const title = (col.getAttribute('data-title') || '').toLowerCase();
            const productKeywords = (col.getAttribute('data-product-keywords') || '').toLowerCase();
            const isHot = col.getAttribute('data-hot') === 'true';

            const expiryEl = col.querySelector('[data-expiry]');
            const expiryTime = expiryEl ? new Date(expiryEl.getAttribute('data-expiry')).getTime() : now;
            const diff = expiryTime - now;
            const daysLeftFloat = diff / (1000 * 60 * 60 * 24);

            // 1. Category Match
            const matchesCategory = (selectedCategory === 'all' || subcat === selectedCategory);

            // 2. Strict Product-Only Search Match
            const matchesSearch = !searchQuery ||
                                  searchRegex.test(title) ||
                                  searchRegex.test(productKeywords);

            // 3. Method A: Validity Period (Days Left) Match
            let matchesDays = true;
            if (selectedDays === 'expired') {
                matchesDays = diff <= 0;
            } else if (selectedDays !== 'all') {
                const maxDays = parseFloat(selectedDays);
                matchesDays = diff > 0 && daysLeftFloat <= maxDays;
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
            return indexA - indexB;
        });

        // Staggered Fade-Up Reveal Animation
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
                counterBadge.innerText = `Showing 4 Featured Hot Deals • Type a product name above to search all ${cols.length} deals`;
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

    // Popular Tag Button Clicks (shoe, Lipstick, camera)
    popularTagBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (!searchInput) return;
            const clickedTag = btn.getAttribute('data-tag') || '';

            // Toggle off if already active
            if (searchInput.value.trim().toLowerCase() === clickedTag.toLowerCase()) {
                searchInput.value = '';
                filterAndSortCards();
                return;
            }

            // If on a category page that doesn't contain this product, jump to Home Page global search
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
            filterAndSortCards();
        });
    });

    if (clearSearchBtn && searchInput) {
        clearSearchBtn.addEventListener('click', () => {
            searchInput.value = '';
            searchInput.focus();
            filterAndSortCards();
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
            filterAndSortCards();
        });
    }

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            filterAndSortCards();
        });
    });

    if (searchInput) searchInput.addEventListener('input', filterAndSortCards);
    if (daysFilterSelect) daysFilterSelect.addEventListener('change', filterAndSortCards);
    if (sortSelect) sortSelect.addEventListener('change', filterAndSortCards);

    // Check if redirected from another page with ?q=tag
    const urlParams = new URLSearchParams(window.location.search);
    const initialQuery = urlParams.get('q');
    if (initialQuery && searchInput) {
        searchInput.value = initialQuery;
    }

    filterAndSortCards();
}

// 3. Smart Savings Tracker & Duplicate Prevention
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

// 4. Interactive Toast Notification
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
// 5. PRODUCT PREVIEW MODAL (SPRING ANIMATION + BLURRED BACKDROP + DIRECT MAP LINKS)
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
                        <!-- Left Column: Main Image + Compact Promotion Details -->
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

                        <!-- Right Column: Title, Price, Selective Color, Spec Info & Larger Google Map -->
                        <div class="col-lg-7 d-flex flex-column">
                            <h5 class="fw-bold mb-1" id="previewTitle">Product Title</h5>
                            <p class="text-muted small mb-2" id="previewStoreSub">Official Store Promotion</p>

                            <!-- Price Block -->
                            <div class="d-flex align-items-baseline flex-wrap gap-2 mb-2 pb-2 border-bottom">
                                <span class="fs-4 fw-bolder text-danger" id="previewPriceNew">0 MMK</span>
                                <span class="price-old small" id="previewPriceOld">0 MMK</span>
                                <span class="savings-pill ms-auto" id="previewSavingsPill">Save 0 MMK</span>
                            </div>

                            <!-- Selective Color Swatches -->
                            <div class="mb-2" id="previewColorBlock">
                                <div class="d-flex align-items-center gap-3">
                                    <div class="small fw-bold">
                                        Color: <span id="selectedColorName" class="text-primary fw-bold">Original</span>
                                    </div>
                                    <div class="color-swatch-list" id="previewColorList"></div>
                                </div>
                            </div>

                            <!-- Informational Size / Specification Row -->
                            <div class="mb-2" id="previewSizeBlock">
                                <div class="p-2 rounded-3 border bg-body-tertiary d-flex flex-wrap align-items-center justify-content-between gap-2">
                                    <span class="small fw-bold text-muted"><i class="bi bi-layers me-1 text-primary"></i>Available Sizes / Spec:</span>
                                    <span class="size-info-tag" id="previewSizeInfoText">Standard</span>
                                </div>
                            </div>

                            <!-- Action Button -->
                            <div class="d-grid my-2">
                                <button type="button" class="btn btn-accent fw-bold py-2" id="previewSaveBtn">
                                    <i class="bi bi-bookmark-plus me-2"></i>Save Deal to Tracker
                                </button>
                            </div>

                            <!-- Store Availability & Expanded Yangon Google Map Embed -->
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
        const card = col.querySelector('.deal-card');
        const imgWrapper = col.querySelector('.deal-img-wrapper');
        const locationEl = col.querySelector('.store-location');

        if (!card || !imgWrapper) return;

        if (!imgWrapper.querySelector('.btn-quick-preview-overlay')) {
            const overlayBtn = document.createElement('button');
            overlayBtn.type = 'button';
            overlayBtn.className = 'btn-quick-preview-overlay';
            overlayBtn.innerHTML = `<i class="bi bi-eye me-1"></i>Preview`;
            overlayBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                openProductPreview(col, false);
            });
            imgWrapper.appendChild(overlayBtn);
        }

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

    // Populate Basic Info
    document.getElementById('previewTitle').innerText = title;
    document.getElementById('previewStoreTag').innerHTML = `<i class="bi bi-shop me-1"></i>${store}`;
    document.getElementById('previewSubcatBadge').innerText = subcat.toUpperCase();
    document.getElementById('previewStoreSub').innerText = fullLocationDisplay;
    document.getElementById('previewDiscountBadge').innerText = isExpired ? 'EXPIRED' : `-${discount}% OFF`;
    document.getElementById('previewValidityText').innerText = validityText;
    document.getElementById('previewTimerBadge').innerHTML = timerText;
    document.getElementById('previewDescription').innerText = catalogEntry ? catalogEntry.description : 'Verified physical outlet promotion in Yangon.';

    document.getElementById('previewPriceNew').innerText = `${finalPrice.toLocaleString()} MMK`;
    document.getElementById('previewPriceOld').innerText = `${originalPrice.toLocaleString()} MMK`;
    document.getElementById('previewSavingsPill').innerText = `Save ${savedAmount.toLocaleString()} MMK`;

    // Single Main Image Setup
    const mainImg = document.getElementById('previewMainImg');
    mainImg.src = defaultImgSrc;
    mainImg.style.filter = 'none';

    if (catalogEntry && catalogEntry.imgFit === 'contain') {
        mainImg.classList.add('img-contain-mode');
    } else {
        mainImg.classList.remove('img-contain-mode');
    }

    // Selective Color Swatches
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

    // Informational Size / Spec Display
    const sizeBlockEl = document.getElementById('previewSizeBlock');
    const sizeInfoTextEl = document.getElementById('previewSizeInfoText');
    if (catalogEntry && catalogEntry.sizeInfo) {
        sizeBlockEl.classList.remove('d-none');
        sizeInfoTextEl.innerText = catalogEntry.sizeInfo;
    } else {
        sizeBlockEl.classList.add('d-none');
    }

    // Modal Save Button
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

    // Store Availability, Exact Map Embed & Direct Short Link (maps.app.goo.gl)
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

document.addEventListener('DOMContentLoaded', () => {
    setupThemeToggle();
    syncAllCardsWithRealStores();
    attachPreviewButtonsToCards();
    setInterval(updateCountdowns, 1000);
    updateCountdowns();
    setupFiltersAndSorting();
    renderSavedDeals();
});
