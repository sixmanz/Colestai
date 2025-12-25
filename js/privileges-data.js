// ============================================
// PRIVILEGES DATA - Investor Privileges System
// Redesigned with 4 Main Categories
// ============================================

// Main Categories (Primary Tabs)
const mainCategories = [
    {
        id: 'flipsid',
        label: 'FLIPS ID',
        labelTh: 'FLIPS ID',
        icon: 'fa-crown',
        color: 'from-blue-600 to-indigo-600',
        description: 'All Rewards Hub',
        descriptionTh: 'ศูนย์รวมของรางวัลทั้งหมด',
        coinType: 'flips',
        coinName: 'Flips Coins',
        coinIcon: '../images/flips_token.png'
    },
    {
        id: 'colestai',
        label: 'Colestai',
        labelTh: 'Colestai',
        icon: 'fa-film',
        color: 'from-amber-500 to-orange-500',
        description: 'Movie Rewards',
        descriptionTh: 'ของรางวัลหนัง',
        coinType: 'flips',
        coinName: 'Flips Coins',
        coinIcon: '../images/flips_token.png'
    },
    {
        id: 'ctrlg',
        label: 'CTRL G',
        labelTh: 'CTRL G',
        icon: 'fa-gamepad',
        color: 'from-purple-500 to-pink-500',
        description: 'Gaming Rewards',
        descriptionTh: 'ของรางวัลเกมส์',
        coinType: 'team',  // Multiple team coins
        coinName: 'Team Coins',
        coinIcon: '../images/ctrlg_token.png'
    },
    {
        id: 'tbf',
        label: 'TBF',
        labelTh: 'TBF',
        icon: 'fa-ship',
        color: 'from-cyan-500 to-blue-500',
        description: 'Boat Rewards',
        descriptionTh: 'ของรางวัลเรือ',
        coinType: 'tbf',
        coinName: 'TBF Coins',
        coinIcon: '../images/flips_token.png'  // Will use flips icon for now
    }
];

// Game Teams (for CTRL G section)
const gameTeams = [
    {
        id: 'phoenix',
        name: 'Phoenix Rising',
        nameTh: 'ฟีนิกซ์ ไรซิ่ง',
        color: 'from-red-500 to-orange-500',
        icon: 'fa-fire',
        coinName: 'Phoenix Coins',
        coinBalance: 2500
    },
    {
        id: 'shadow',
        name: 'Shadow Wolves',
        nameTh: 'ชาโดว์ วูล์ฟ',
        color: 'from-gray-600 to-gray-800',
        icon: 'fa-moon',
        coinName: 'Shadow Coins',
        coinBalance: 1800
    },
    {
        id: 'thunder',
        name: 'Thunder Strike',
        nameTh: 'ธันเดอร์ สไตรค์',
        color: 'from-yellow-400 to-amber-500',
        icon: 'fa-bolt',
        coinName: 'Thunder Coins',
        coinBalance: 3200
    },
    {
        id: 'dragon',
        name: 'Dragon Force',
        nameTh: 'ดราก้อน ฟอร์ซ',
        color: 'from-green-500 to-emerald-600',
        icon: 'fa-dragon',
        coinName: 'Dragon Coins',
        coinBalance: 1500
    }
];

// Movies for Colestai section
const movies = [
    {
        id: 'the-last-horizon',
        name: 'The Last Horizon',
        nameTh: 'ขอบฟ้าสุดท้าย',
        year: 2024,
        poster: '../images/privilege_movie_premiere.png',
        genre: 'Sci-Fi / Action'
    },
    {
        id: 'eternal-flame',
        name: 'Eternal Flame',
        nameTh: 'เปลวไฟนิรันดร์',
        year: 2025,
        poster: '../images/privilege_screening.png',
        genre: 'Drama / Romance'
    },
    {
        id: 'shadow-realm',
        name: 'Shadow Realm',
        nameTh: 'อาณาจักรเงามืด',
        year: 2024,
        poster: '../images/privilege_bts_vip.png',
        genre: 'Fantasy / Adventure'
    }
];

// Sub-Categories for Privileges
const privilegeCategories = [
    // All Privileges
    {
        id: 'all',
        label: 'All Privileges',
        labelTh: 'ทั้งหมด',
        icon: 'fa-layer-group',
        color: 'from-primary to-secondary',
        description: 'View all available privileges',
        descriptionTh: 'ดูสิทธิพิเศษทั้งหมด',
        mainCategory: 'all'
    },

    // Colestai (Movie) Sub-Categories
    {
        id: 'movie-tickets',
        label: 'Movie Tickets',
        labelTh: 'บัตรชมภาพยนตร์',
        icon: 'fa-ticket-alt',
        color: 'from-red-500 to-orange-500',
        description: 'Exclusive movie screening tickets',
        descriptionTh: 'บัตรชมภาพยนตร์พิเศษ',
        mainCategory: 'colestai'
    },
    {
        id: 'meet-greet',
        label: 'Meet & Greet',
        labelTh: 'พบทีมผู้สร้าง',
        icon: 'fa-users',
        color: 'from-blue-500 to-cyan-500',
        description: 'Meet producers, directors & actors',
        descriptionTh: 'พบโปรดิวเซอร์ ผู้กำกับ นักแสดง',
        mainCategory: 'colestai'
    },
    {
        id: 'credits',
        label: 'Movie Credits',
        labelTh: 'เครดิตท้ายหนัง',
        icon: 'fa-film',
        color: 'from-yellow-500 to-amber-500',
        description: 'Your name in movie credits',
        descriptionTh: 'ชื่อของคุณในเครดิตท้ายภาพยนตร์',
        mainCategory: 'colestai'
    },
    {
        id: 'merchandise',
        label: 'Merchandise',
        labelTh: 'สินค้าที่ระลึก',
        icon: 'fa-gift',
        color: 'from-green-500 to-emerald-500',
        description: 'Exclusive merchandise & collectibles',
        descriptionTh: 'สินค้าที่ระลึกพิเศษ',
        mainCategory: 'colestai'
    },
    {
        id: 'behind-scenes',
        label: 'Behind the Scenes',
        labelTh: 'เบื้องหลัง',
        icon: 'fa-camera',
        color: 'from-primary to-primary-light',
        description: 'Set visits & behind the scenes access',
        descriptionTh: 'เข้าชมกองถ่ายและเบื้องหลัง',
        mainCategory: 'colestai'
    },

    // CTRL G (Game) Sub-Categories
    {
        id: 'game-items',
        label: 'In-Game Items',
        labelTh: 'ไอเทมในเกม',
        icon: 'fa-gem',
        color: 'from-purple-500 to-indigo-500',
        description: 'Exclusive in-game items',
        descriptionTh: 'ไอเทมในเกมพิเศษ',
        mainCategory: 'ctrlg'
    },
    {
        id: 'game-credits',
        label: 'Game Credits',
        labelTh: 'เครดิตในเกม',
        icon: 'fa-coins',
        color: 'from-yellow-400 to-orange-400',
        description: 'Your name in game credits',
        descriptionTh: 'ชื่อของคุณในเครดิตเกม',
        mainCategory: 'ctrlg'
    },
    {
        id: 'game-meet-greet',
        label: 'Meet Developers',
        labelTh: 'พบนักพัฒนา',
        icon: 'fa-laptop-code',
        color: 'from-cyan-500 to-blue-500',
        description: 'Meet game developers',
        descriptionTh: 'พบปะทีมพัฒนาเกม',
        mainCategory: 'ctrlg'
    },
    {
        id: 'game-merchandise',
        label: 'Game Merchandise',
        labelTh: 'สินค้าเกม',
        icon: 'fa-tshirt',
        color: 'from-pink-500 to-rose-500',
        description: 'Exclusive game merchandise',
        descriptionTh: 'สินค้าที่ระลึกจากเกม',
        mainCategory: 'ctrlg'
    },
    {
        id: 'early-access',
        label: 'Early Access',
        labelTh: 'เข้าถึงก่อน',
        icon: 'fa-rocket',
        color: 'from-green-400 to-teal-500',
        description: 'Early access to games',
        descriptionTh: 'เข้าเล่นเกมก่อนเปิดตัว',
        mainCategory: 'ctrlg'
    },

    // TBF (Boat) Sub-Categories
    {
        id: 'boat-passes',
        label: 'Boat Passes',
        labelTh: 'บัตรล่องเรือ',
        icon: 'fa-ticket-alt',
        color: 'from-cyan-500 to-blue-500',
        description: 'Exclusive yacht and boat passes',
        descriptionTh: 'บัตรล่องเรือยอร์ชพิเศษ',
        mainCategory: 'tbf'
    },
    {
        id: 'boat-events',
        label: 'Yacht Events',
        labelTh: 'อีเว้นท์บนเรือ',
        icon: 'fa-glass-cheers',
        color: 'from-blue-600 to-indigo-600',
        description: 'Exclusive yacht parties and events',
        descriptionTh: 'ปาร์ตี้และอีเว้นท์บนเรือยอร์ช',
        mainCategory: 'tbf'
    },
    {
        id: 'boat-tours',
        label: 'Luxury Tours',
        labelTh: 'ทัวร์หรู',
        icon: 'fa-map-marked-alt',
        color: 'from-teal-500 to-cyan-500',
        description: 'Premium yacht tour packages',
        descriptionTh: 'แพ็คเกจทัวร์ยอร์ชหรู',
        mainCategory: 'tbf'
    },
    {
        id: 'boat-merchandise',
        label: 'Marine Merchandise',
        labelTh: 'สินค้าทะเล',
        icon: 'fa-anchor',
        color: 'from-slate-500 to-slate-700',
        description: 'Exclusive marine collectibles',
        descriptionTh: 'สินค้าสะสมธีมทะเล',
        mainCategory: 'tbf'
    }
];

const privilegePackages = [
    // =============================================
    // COLESTAI (MOVIE) PRIVILEGES
    // =============================================

    // Movie: The Last Horizon
    {
        id: 101,
        title: 'Premiere Night VIP - The Last Horizon',
        titleTh: 'บัตร VIP รอบปฐมทัศน์ - ขอบฟ้าสุดท้าย',
        subtitle: 'Exclusive premiere screening',
        subtitleTh: 'ชมภาพยนตร์รอบปฐมทัศน์สุดพิเศษ',
        category: 'movie-tickets',
        categoryLabel: 'Movie Tickets',
        categoryLabelTh: 'บัตรชมภาพยนตร์',
        image: '../images/privilege_movie_premiere.png',
        price: 500,
        rating: 4.9,
        reviews: 156,
        isPhysical: false,
        tier: 'gold',
        movieId: 'the-last-horizon',
        movieName: 'The Last Horizon',
        movieNameTh: 'ขอบฟ้าสุดท้าย',
        eventDate: '2024-06-15',
        venue: 'Major Cineplex Paragon',
        description: 'Experience the premiere night with VIP seating, welcome drinks, and exclusive meet & greet opportunity.',
        descriptionTh: 'สัมผัสประสบการณ์รอบปฐมทัศน์พร้อมที่นั่ง VIP เครื่องดื่มต้อนรับ และโอกาสพบปะทีมนักแสดง',
        conditions: ['Valid for 1 person', 'Non-transferable', 'Must present QR code at venue'],
        conditionsTh: ['ใช้ได้ 1 ท่าน', 'ไม่สามารถโอนสิทธิ์ได้', 'ต้องแสดง QR code ที่สถานที่']
    },
    {
        id: 102,
        title: 'Director Meet & Greet - The Last Horizon',
        titleTh: 'พบปะผู้กำกับ - ขอบฟ้าสุดท้าย',
        subtitle: 'Exclusive session with the director',
        subtitleTh: 'พบปะผู้กำกับแบบเอ็กซ์คลูซีฟ',
        category: 'meet-greet',
        categoryLabel: 'Meet & Greet',
        categoryLabelTh: 'พบทีมผู้สร้าง',
        image: '../images/privilege_meet_director.png',
        price: 1500,
        rating: 4.9,
        reviews: 32,
        isPhysical: false,
        tier: 'gold',
        movieId: 'the-last-horizon',
        movieName: 'The Last Horizon',
        movieNameTh: 'ขอบฟ้าสุดท้าย',
        eventDate: '2024-07-20',
        venue: 'FLIPS Studio Bangkok',
        description: 'A once-in-a-lifetime opportunity to meet the director and discuss filmmaking.',
        descriptionTh: 'โอกาสครั้งหนึ่งในชีวิตที่จะพบผู้กำกับและพูดคุยเรื่องการสร้างภาพยนตร์',
        conditions: ['Limited to 20 participants', 'Photo opportunity included', 'Light refreshments provided'],
        conditionsTh: ['จำกัด 20 ท่าน', 'รวมถ่ายรูปร่วมกัน', 'มีอาหารว่างบริการ']
    },
    {
        id: 103,
        title: 'Special Thanks Credit - The Last Horizon',
        titleTh: 'เครดิต Special Thanks - ขอบฟ้าสุดท้าย',
        subtitle: 'Your name in Special Thanks section',
        subtitleTh: 'ชื่อของคุณในส่วน Special Thanks',
        category: 'credits',
        categoryLabel: 'Movie Credits',
        categoryLabelTh: 'เครดิตท้ายหนัง',
        image: '../images/privilege_credits.png',
        price: 1000,
        rating: 4.8,
        reviews: 234,
        isPhysical: false,
        tier: 'silver',
        movieId: 'the-last-horizon',
        movieName: 'The Last Horizon',
        movieNameTh: 'ขอบฟ้าสุดท้าย',
        description: 'Have your name appear in the Special Thanks section of the movie credits.',
        descriptionTh: 'ชื่อของคุณจะปรากฏในส่วน Special Thanks ของเครดิตท้ายภาพยนตร์',
        conditions: ['Name as registered', 'Permanent credit', 'Certificate provided'],
        conditionsTh: ['ใช้ชื่อตามที่ลงทะเบียน', 'เครดิตถาวร', 'ได้รับใบประกาศนียบัตร']
    },

    // Movie: Eternal Flame
    {
        id: 104,
        title: 'Premiere Night VIP - Eternal Flame',
        titleTh: 'บัตร VIP รอบปฐมทัศน์ - เปลวไฟนิรันดร์',
        subtitle: 'Exclusive premiere screening',
        subtitleTh: 'ชมภาพยนตร์รอบปฐมทัศน์สุดพิเศษ',
        category: 'movie-tickets',
        categoryLabel: 'Movie Tickets',
        categoryLabelTh: 'บัตรชมภาพยนตร์',
        image: '../images/privilege_screening.png',
        price: 600,
        rating: 4.8,
        reviews: 89,
        isPhysical: false,
        tier: 'gold',
        movieId: 'eternal-flame',
        movieName: 'Eternal Flame',
        movieNameTh: 'เปลวไฟนิรันดร์',
        eventDate: '2025-02-14',
        venue: 'SF World Cinema',
        description: 'Romantic premiere night with special Valentine atmosphere.',
        descriptionTh: 'รอบปฐมทัศน์พิเศษบรรยากาศวาเลนไทน์',
        conditions: ['Valid for 2 persons', 'Couple seating', 'Rose & chocolate included'],
        conditionsTh: ['ใช้ได้ 2 ท่าน', 'ที่นั่งคู่รัก', 'รวมดอกกุหลาบและช็อกโกแลต']
    },
    {
        id: 105,
        title: 'Cast Photo Session - Eternal Flame',
        titleTh: 'ถ่ายรูปกับนักแสดง - เปลวไฟนิรันดร์',
        subtitle: 'Photo with main cast members',
        subtitleTh: 'ถ่ายรูปกับนักแสดงนำ',
        category: 'meet-greet',
        categoryLabel: 'Meet & Greet',
        categoryLabelTh: 'พบทีมผู้สร้าง',
        image: '../images/privilege_meet_cast.png',
        price: 800,
        rating: 4.8,
        reviews: 67,
        isPhysical: false,
        tier: 'silver',
        movieId: 'eternal-flame',
        movieName: 'Eternal Flame',
        movieNameTh: 'เปลวไฟนิรันดร์',
        eventDate: '2025-03-10',
        venue: 'FLIPS Studio Bangkok',
        description: 'Get your photo taken with the main cast members.',
        descriptionTh: 'ถ่ายรูปกับนักแสดงนำของภาพยนตร์',
        conditions: ['1 photo per person', 'Digital copy provided', 'Meeting at designated time'],
        conditionsTh: ['1 รูปต่อท่าน', 'ได้รับไฟล์ดิจิตอล', 'นัดพบตามเวลาที่กำหนด']
    },

    // Movie: Shadow Realm
    {
        id: 106,
        title: 'VIP World Premiere - Shadow Realm',
        titleTh: 'World Premiere VIP - อาณาจักรเงามืด',
        subtitle: 'World premiere exclusive access',
        subtitleTh: 'เข้าร่วม World Premiere สุดพิเศษ',
        category: 'movie-tickets',
        categoryLabel: 'Movie Tickets',
        categoryLabelTh: 'บัตรชมภาพยนตร์',
        image: '../images/privilege_bts_vip.png',
        price: 2000,
        rating: 5.0,
        reviews: 45,
        isPhysical: false,
        tier: 'gold',
        movieId: 'shadow-realm',
        movieName: 'Shadow Realm',
        movieNameTh: 'อาณาจักรเงามืด',
        eventDate: '2024-12-20',
        venue: 'Paragon Cineplex',
        description: 'World premiere with red carpet access and after party.',
        descriptionTh: 'World Premiere พร้อม red carpet และปาร์ตี้หลังหนัง',
        conditions: ['Red carpet access', 'After party included', 'Gift bag included'],
        conditionsTh: ['เดิน red carpet', 'รวม after party', 'รวมถุงของขวัญ']
    },
    {
        id: 107,
        title: 'Set Visit Pass - Shadow Realm',
        titleTh: 'บัตรเยี่ยมชมกองถ่าย - อาณาจักรเงามืด',
        subtitle: 'Full day set visit experience',
        subtitleTh: 'เยี่ยมชมกองถ่ายเต็มวัน',
        category: 'behind-scenes',
        categoryLabel: 'Behind the Scenes',
        categoryLabelTh: 'เบื้องหลัง',
        image: '../images/privilege_bts_set.png',
        price: 2500,
        rating: 5.0,
        reviews: 23,
        isPhysical: false,
        tier: 'gold',
        movieId: 'shadow-realm',
        movieName: 'Shadow Realm',
        movieNameTh: 'อาณาจักรเงามืด',
        eventDate: '2024-09-15',
        venue: 'FLIPS Film Studios',
        description: 'Exclusive access to visit the movie set during production.',
        descriptionTh: 'สิทธิ์พิเศษในการเยี่ยมชมกองถ่ายระหว่างการผลิต',
        conditions: ['NDA required', 'No personal photography', 'Lunch provided'],
        conditionsTh: ['ต้องเซ็นสัญญารักษาความลับ', 'ห้ามถ่ายรูปส่วนตัว', 'รวมอาหารกลางวัน']
    },

    // Movie Merchandise
    {
        id: 108,
        title: 'Movie Poster Collection',
        titleTh: 'คอลเลคชั่นโปสเตอร์',
        subtitle: 'Signed limited edition posters',
        subtitleTh: 'โปสเตอร์ลิมิเต็ดพร้อมลายเซ็น',
        category: 'merchandise',
        categoryLabel: 'Merchandise',
        categoryLabelTh: 'สินค้าที่ระลึก',
        image: '../images/privilege_merch_poster.png',
        price: 400,
        rating: 4.7,
        reviews: 156,
        isPhysical: true,
        tier: 'silver',
        description: 'Set of 3 limited edition movie posters signed by the cast.',
        descriptionTh: 'ชุดโปสเตอร์ลิมิเต็ด 3 แบบพร้อมลายเซ็นนักแสดง',
        conditions: ['Ships within 7 days', 'Certificate of authenticity', 'Protective tube packaging'],
        conditionsTh: ['จัดส่งภายใน 7 วัน', 'ใบรับรองความแท้', 'บรรจุในหลอดป้องกัน']
    },
    {
        id: 109,
        title: 'Premium Merchandise Box',
        titleTh: 'กล่องสินค้าพรีเมียม',
        subtitle: 'Complete collector box set',
        subtitleTh: 'ชุดกล่องสะสมครบเซ็ต',
        category: 'merchandise',
        categoryLabel: 'Merchandise',
        categoryLabelTh: 'สินค้าที่ระลึก',
        image: '../images/privilege_merch_premium.png',
        price: 1500,
        rating: 5.0,
        reviews: 34,
        isPhysical: true,
        tier: 'gold',
        description: 'Complete box set with T-shirt, poster, art book, and exclusive items.',
        descriptionTh: 'กล่องครบเซ็ตพร้อมเสื้อยืด โปสเตอร์ อาร์ตบุ๊ค และของพิเศษ',
        conditions: ['All items included', 'Premium packaging', 'Numbered collector edition'],
        conditionsTh: ['รวมสินค้าทั้งหมด', 'บรรจุภัณฑ์พรีเมียม', 'เวอร์ชั่นสะสมมีหมายเลข']
    },

    // =============================================
    // CTRL G (GAME) PRIVILEGES
    // =============================================

    // Team Phoenix Rising
    {
        id: 201,
        title: 'Phoenix Rising Jersey',
        titleTh: 'เสื้อทีม Phoenix Rising',
        subtitle: 'Official team jersey',
        subtitleTh: 'เสื้อทีมแท้',
        category: 'game-merchandise',
        categoryLabel: 'Game Merchandise',
        categoryLabelTh: 'สินค้าเกม',
        image: '../images/privilege_merch_tshirt.png',
        price: 500,
        rating: 4.9,
        reviews: 234,
        isPhysical: true,
        tier: 'silver',
        teamId: 'phoenix',
        teamName: 'Phoenix Rising',
        teamNameTh: 'ฟีนิกซ์ ไรซิ่ง',
        coinType: 'phoenix',
        description: 'Official Phoenix Rising team jersey worn by pro players.',
        descriptionTh: 'เสื้อทีม Phoenix Rising ของแท้ที่นักแข่งมืออาชีพสวมใส่',
        conditions: ['Sizes available: S-XXL', 'Authentic merchandise', 'Ships in 5-7 days'],
        conditionsTh: ['มีไซส์ S-XXL', 'ของแท้', 'จัดส่งภายใน 5-7 วัน']
    },
    {
        id: 202,
        title: 'Meet Phoenix Rising Team',
        titleTh: 'พบทีม Phoenix Rising',
        subtitle: 'Meet the pro players',
        subtitleTh: 'พบนักแข่งมืออาชีพ',
        category: 'game-meet-greet',
        categoryLabel: 'Meet Developers',
        categoryLabelTh: 'พบนักพัฒนา',
        image: '../images/privilege_game_qa.png',
        price: 1000,
        rating: 5.0,
        reviews: 56,
        isPhysical: false,
        tier: 'gold',
        teamId: 'phoenix',
        teamName: 'Phoenix Rising',
        teamNameTh: 'ฟีนิกซ์ ไรซิ่ง',
        coinType: 'phoenix',
        eventDate: '2025-01-20',
        venue: 'FLIPS Gaming Arena',
        description: 'Exclusive meet and greet with Phoenix Rising esports team.',
        descriptionTh: 'พบปะทีม Phoenix Rising แบบเอ็กซ์คลูซีฟ',
        conditions: ['Limited to 30 fans', 'Photo session included', 'Signed merchandise'],
        conditionsTh: ['จำกัด 30 คน', 'รวมถ่ายรูป', 'รวมเซ็นของที่ระลึก']
    },
    {
        id: 203,
        title: 'Phoenix In-Game Bundle',
        titleTh: 'ชุดไอเทม Phoenix',
        subtitle: 'Exclusive in-game items',
        subtitleTh: 'ไอเทมพิเศษในเกม',
        category: 'game-items',
        categoryLabel: 'In-Game Items',
        categoryLabelTh: 'ไอเทมในเกม',
        image: '../images/privilege_game_character.png',
        price: 300,
        rating: 4.8,
        reviews: 189,
        isPhysical: false,
        tier: 'silver',
        teamId: 'phoenix',
        teamName: 'Phoenix Rising',
        teamNameTh: 'ฟีนิกซ์ ไรซิ่ง',
        coinType: 'phoenix',
        description: 'Phoenix-themed weapon skins and character outfit.',
        descriptionTh: 'สกินอาวุธและชุดตัวละครธีม Phoenix',
        conditions: ['Account binding required', 'Permanent unlock', 'Cross-platform'],
        conditionsTh: ['ต้องผูกบัญชี', 'ปลดล็อคถาวร', 'ใช้ได้ทุกแพลตฟอร์ม']
    },

    // Team Shadow Wolves
    {
        id: 204,
        title: 'Shadow Wolves Jersey',
        titleTh: 'เสื้อทีม Shadow Wolves',
        subtitle: 'Official team jersey',
        subtitleTh: 'เสื้อทีมแท้',
        category: 'game-merchandise',
        categoryLabel: 'Game Merchandise',
        categoryLabelTh: 'สินค้าเกม',
        image: '../images/privilege_merch_tshirt.png',
        price: 500,
        rating: 4.9,
        reviews: 178,
        isPhysical: true,
        tier: 'silver',
        teamId: 'shadow',
        teamName: 'Shadow Wolves',
        teamNameTh: 'ชาโดว์ วูล์ฟ',
        coinType: 'shadow',
        description: 'Official Shadow Wolves team jersey with metallic print.',
        descriptionTh: 'เสื้อทีม Shadow Wolves พิมพ์เมทัลลิก',
        conditions: ['Sizes available: S-XXL', 'Authentic merchandise', 'Ships in 5-7 days'],
        conditionsTh: ['มีไซส์ S-XXL', 'ของแท้', 'จัดส่งภายใน 5-7 วัน']
    },
    {
        id: 205,
        title: 'Shadow Wolves In-Game Bundle',
        titleTh: 'ชุดไอเทม Shadow Wolves',
        subtitle: 'Dark-themed items',
        subtitleTh: 'ไอเทมธีมดาร์ก',
        category: 'game-items',
        categoryLabel: 'In-Game Items',
        categoryLabelTh: 'ไอเทมในเกม',
        image: '../images/privilege_game_weapon.png',
        price: 350,
        rating: 4.9,
        reviews: 156,
        isPhysical: false,
        tier: 'silver',
        teamId: 'shadow',
        teamName: 'Shadow Wolves',
        teamNameTh: 'ชาโดว์ วูล์ฟ',
        coinType: 'shadow',
        description: 'Dark wolf-themed weapon skins with special effects.',
        descriptionTh: 'สกินอาวุธธีมหมาป่าดำพร้อมเอฟเฟกต์พิเศษ',
        conditions: ['Account binding required', 'Glowing effects', 'Permanent unlock'],
        conditionsTh: ['ต้องผูกบัญชี', 'เอฟเฟกต์เรืองแสง', 'ปลดล็อคถาวร']
    },

    // Team Thunder Strike
    {
        id: 206,
        title: 'Thunder Strike Jersey',
        titleTh: 'เสื้อทีม Thunder Strike',
        subtitle: 'Official team jersey',
        subtitleTh: 'เสื้อทีมแท้',
        category: 'game-merchandise',
        categoryLabel: 'Game Merchandise',
        categoryLabelTh: 'สินค้าเกม',
        image: '../images/privilege_merch_tshirt.png',
        price: 500,
        rating: 4.8,
        reviews: 145,
        isPhysical: true,
        tier: 'silver',
        teamId: 'thunder',
        teamName: 'Thunder Strike',
        teamNameTh: 'ธันเดอร์ สไตรค์',
        coinType: 'thunder',
        description: 'Official Thunder Strike jersey with lightning design.',
        descriptionTh: 'เสื้อทีม Thunder Strike ลายฟ้าผ่า',
        conditions: ['Sizes available: S-XXL', 'Authentic merchandise', 'Ships in 5-7 days'],
        conditionsTh: ['มีไซส์ S-XXL', 'ของแท้', 'จัดส่งภายใน 5-7 วัน']
    },
    {
        id: 207,
        title: 'Thunder Strike VIP Seat',
        titleTh: 'ที่นั่ง VIP Thunder Strike',
        subtitle: 'Watch live tournament',
        subtitleTh: 'ชมแข่งสดที่นั่ง VIP',
        category: 'game-meet-greet',
        categoryLabel: 'Meet Developers',
        categoryLabelTh: 'พบนักพัฒนา',
        image: '../images/privilege_game_studio.png',
        price: 800,
        rating: 4.9,
        reviews: 89,
        isPhysical: false,
        tier: 'gold',
        teamId: 'thunder',
        teamName: 'Thunder Strike',
        teamNameTh: 'ธันเดอร์ สไตรค์',
        coinType: 'thunder',
        eventDate: '2025-02-15',
        venue: 'FLIPS Gaming Arena',
        description: 'VIP seating at Thunder Strike tournament with backstage access.',
        descriptionTh: 'ที่นั่ง VIP ชมการแข่งขันพร้อมเข้าห้องเตรียมตัว',
        conditions: ['Front row seat', 'Backstage access', 'Meet players after match'],
        conditionsTh: ['ที่นั่งแถวหน้า', 'เข้าเบื้องหลัง', 'พบนักแข่งหลังจบ']
    },

    // Team Dragon Force
    {
        id: 208,
        title: 'Dragon Force Jersey',
        titleTh: 'เสื้อทีม Dragon Force',
        subtitle: 'Official team jersey',
        subtitleTh: 'เสื้อทีมแท้',
        category: 'game-merchandise',
        categoryLabel: 'Game Merchandise',
        categoryLabelTh: 'สินค้าเกม',
        image: '../images/privilege_merch_tshirt.png',
        price: 500,
        rating: 4.8,
        reviews: 123,
        isPhysical: true,
        tier: 'silver',
        teamId: 'dragon',
        teamName: 'Dragon Force',
        teamNameTh: 'ดราก้อน ฟอร์ซ',
        coinType: 'dragon',
        description: 'Official Dragon Force jersey with dragon embroidery.',
        descriptionTh: 'เสื้อทีม Dragon Force ปักลายมังกร',
        conditions: ['Sizes available: S-XXL', 'Authentic merchandise', 'Ships in 5-7 days'],
        conditionsTh: ['มีไซส์ S-XXL', 'ของแท้', 'จัดส่งภายใน 5-7 วัน']
    },
    {
        id: 209,
        title: 'Dragon Force Figurine',
        titleTh: 'ฟิกเกอร์ Dragon Force',
        subtitle: 'Limited edition collectible',
        subtitleTh: 'ของสะสมลิมิเต็ด',
        category: 'game-merchandise',
        categoryLabel: 'Game Merchandise',
        categoryLabelTh: 'สินค้าเกม',
        image: '../images/privilege_game_figurine.png',
        price: 1200,
        rating: 5.0,
        reviews: 67,
        isPhysical: true,
        tier: 'gold',
        teamId: 'dragon',
        teamName: 'Dragon Force',
        teamNameTh: 'ดราก้อน ฟอร์ซ',
        coinType: 'dragon',
        description: 'Limited edition Dragon Force mascot figurine.',
        descriptionTh: 'ฟิกเกอร์มาสคอต Dragon Force ลิมิเต็ด',
        conditions: ['Numbered edition', 'Certificate included', 'Premium box'],
        conditionsTh: ['มีหมายเลขกำกับ', 'รวมใบรับรอง', 'กล่องพรีเมียม']
    },

    // General Game Privileges
    {
        id: 210,
        title: 'Closed Beta Access',
        titleTh: 'เข้าถึง Closed Beta',
        subtitle: 'Play before everyone else',
        subtitleTh: 'เล่นก่อนใครๆ',
        category: 'early-access',
        categoryLabel: 'Early Access',
        categoryLabelTh: 'เข้าถึงก่อน',
        image: '../images/privilege_game_beta.png',
        price: 400,
        rating: 4.9,
        reviews: 256,
        isPhysical: false,
        tier: 'silver',
        gameName: 'Project Nova',
        gameNameTh: 'โปรเจค โนวา',
        eventDate: '2025-01-15',
        description: 'Get exclusive access to closed beta testing before public launch.',
        descriptionTh: 'เข้าถึง Closed Beta ก่อนเปิดให้สาธารณะ',
        conditions: ['2-week early access', 'Beta tester badge', 'Feedback channel'],
        conditionsTh: ['เข้าถึงก่อน 2 สัปดาห์', 'แบดจ์ผู้ทดสอบ', 'ช่องทางแจ้งข้อเสนอแนะ']
    },
    {
        id: 211,
        title: 'Game Credits - Supporter',
        titleTh: 'เครดิต Supporter',
        subtitle: 'Your name in game credits',
        subtitleTh: 'ชื่อของคุณในเครดิตเกม',
        category: 'game-credits',
        categoryLabel: 'Game Credits',
        categoryLabelTh: 'เครดิตในเกม',
        image: '../images/privilege_game_credits.png',
        price: 500,
        rating: 4.7,
        reviews: 89,
        isPhysical: false,
        tier: 'silver',
        description: 'Have your name displayed in the game credits as a Supporter.',
        descriptionTh: 'ชื่อของคุณจะปรากฏในเครดิตเกมในฐานะ Supporter',
        conditions: ['Permanent credit', 'Name as registered', 'Digital certificate'],
        conditionsTh: ['เครดิตถาวร', 'ใช้ชื่อตามที่ลงทะเบียน', 'ใบประกาศดิจิตอล']
    },

    // =============================================
    // TBF (BOAT) PRIVILEGES - ALL BOAT THEMED
    // =============================================

    // Boat Passes
    {
        id: 301,
        title: 'Sunset Yacht Cruise',
        titleTh: 'ล่องเรือยอร์ชชมพระอาทิตย์ตก',
        subtitle: '3-hour luxury sunset cruise',
        subtitleTh: 'ล่องเรือหรู 3 ชั่วโมงชมพระอาทิตย์ตก',
        category: 'boat-passes',
        categoryLabel: 'Boat Passes',
        categoryLabelTh: 'บัตรล่องเรือ',
        image: '../images/sunset.png',
        price: 800,
        rating: 4.9,
        reviews: 156,
        isPhysical: false,
        tier: 'silver',
        coinType: 'tbf',
        eventDate: '2025-01-20',
        venue: 'Ocean Marina Pattaya',
        description: 'Romantic sunset cruise on a luxury yacht with champagne, canapés, and city skyline views.',
        descriptionTh: 'ล่องเรือยอร์ชหรูชมพระอาทิตย์ตกพร้อมแชมเปญ ขนมปังและวิวเมือง',
        conditions: ['Valid for 2 persons', 'Champagne included', 'Weather dependent'],
        conditionsTh: ['ใช้ได้ 2 ท่าน', 'รวมแชมเปญ', 'ขึ้นอยู่กับสภาพอากาศ']
    },

    // Yacht Events
    {
        id: 302,
        title: 'VIP Yacht Party',
        titleTh: 'ปาร์ตี้ VIP บนเรือยอร์ช',
        subtitle: 'Exclusive mega yacht party experience',
        subtitleTh: 'ปาร์ตี้สุดหรูบน Mega Yacht',
        category: 'boat-events',
        categoryLabel: 'Yacht Events',
        categoryLabelTh: 'อีเว้นท์บนเรือ',
        image: '../images/santorini.png',
        price: 2000,
        rating: 5.0,
        reviews: 45,
        isPhysical: false,
        tier: 'gold',
        coinType: 'tbf',
        eventDate: '2025-02-28',
        venue: 'Royal Phuket Marina',
        description: 'Exclusive VIP party on a mega yacht with DJ, gourmet dinner, fireworks, and open bar.',
        descriptionTh: 'ปาร์ตี้ VIP บน Mega Yacht พร้อม DJ อาหารหรู พลุ และเครื่องดื่มไม่อั้น',
        conditions: ['Formal dress code', 'Full dinner included', 'Champagne service'],
        conditionsTh: ['แต่งกายสุภาพ', 'รวมอาหารค่ำ', 'บริการแชมเปญ']
    },
    {
        id: 303,
        title: 'Private Dinner Cruise',
        titleTh: 'ดินเนอร์ครูซส่วนตัว',
        subtitle: 'Gourmet 5-course dining on the sea',
        subtitleTh: 'อาหารค่ำ 5 คอร์สบนทะเล',
        category: 'boat-events',
        categoryLabel: 'Yacht Events',
        categoryLabelTh: 'อีเว้นท์บนเรือ',
        image: '../images/sunset.png',
        price: 3000,
        rating: 5.0,
        reviews: 23,
        isPhysical: false,
        tier: 'gold',
        coinType: 'tbf',
        eventDate: '2025-04-10',
        venue: 'Chaophraya River, Bangkok',
        description: '5-course gourmet dinner cruise with wine pairing and city skyline views.',
        descriptionTh: 'ดินเนอร์ 5 คอร์สบนเรือพร้อมไวน์คู่อาหารและวิวเมืองยามค่ำ',
        conditions: ['Valid for 2 persons', 'Wine pairing included', 'Formal attire required'],
        conditionsTh: ['ใช้ได้ 2 ท่าน', 'รวมไวน์คู่อาหาร', 'แต่งกายสุภาพ']
    },

    // Luxury Tours
    {
        id: 304,
        title: 'Island Hopping VIP Tour',
        titleTh: 'ทัวร์เกาะ VIP',
        subtitle: 'Full day private island adventure',
        subtitleTh: 'เที่ยวเกาะส่วนตัวเต็มวัน',
        category: 'boat-tours',
        categoryLabel: 'Luxury Tours',
        categoryLabelTh: 'ทัวร์หรู',
        image: '../images/santorini.png',
        price: 1500,
        rating: 4.8,
        reviews: 89,
        isPhysical: false,
        tier: 'gold',
        coinType: 'tbf',
        eventDate: '2025-03-15',
        venue: '4 Islands, Krabi',
        description: 'Private island hopping tour with snorkeling, kayaking, and beach BBQ lunch.',
        descriptionTh: 'ทัวร์เกาะส่วนตัว ดำน้ำ พายเรือคายัค และบาร์บีคิวริมหาด',
        conditions: ['Full day tour', 'Lunch included', 'Snorkeling gear provided'],
        conditionsTh: ['ทัวร์เต็มวัน', 'รวมอาหารกลางวัน', 'รวมอุปกรณ์ดำน้ำ']
    },
    {
        id: 305,
        title: 'Deep Sea Fishing Trip',
        titleTh: 'ทริปตกปลาทะเลลึก',
        subtitle: 'Luxury sport fishing adventure',
        subtitleTh: 'ผจญภัยตกปลากีฬาบนเรือหรู',
        category: 'boat-tours',
        categoryLabel: 'Luxury Tours',
        categoryLabelTh: 'ทัวร์หรู',
        image: '../images/santorini.png',
        price: 1800,
        rating: 4.7,
        reviews: 67,
        isPhysical: false,
        tier: 'silver',
        coinType: 'tbf',
        eventDate: '2025-05-20',
        venue: 'Gulf of Thailand',
        description: 'Deep sea fishing trip with experienced captain, all equipment, and onboard chef.',
        descriptionTh: 'ทริปตกปลาทะเลลึกพร้อมกัปตันมืออาชีพ อุปกรณ์ครบ และเชฟบนเรือ',
        conditions: ['Half day trip', 'All equipment provided', 'Chef cooks your catch'],
        conditionsTh: ['ทริปครึ่งวัน', 'รวมอุปกรณ์ทั้งหมด', 'เชฟปรุงปลาให้บนเรือ']
    },
    {
        id: 306,
        title: 'Scuba Diving Boat Trip',
        titleTh: 'ทริปดำน้ำลึก',
        subtitle: 'Premium diving experience',
        subtitleTh: 'ประสบการณ์ดำน้ำลึกพรีเมียม',
        category: 'boat-tours',
        categoryLabel: 'Luxury Tours',
        categoryLabelTh: 'ทัวร์หรู',
        image: '../images/santorini.png',
        price: 2200,
        rating: 4.9,
        reviews: 54,
        isPhysical: false,
        tier: 'gold',
        coinType: 'tbf',
        eventDate: '2025-06-10',
        venue: 'Similan Islands',
        description: 'Full day scuba diving trip to Similan Islands with 3 dive spots and lunch.',
        descriptionTh: 'ทริปดำน้ำเต็มวันที่หมู่เกาะสิมิลัน 3 จุดดำน้ำพร้อมอาหารกลางวัน',
        conditions: ['Certification required', '3 dive spots', 'Equipment included'],
        conditionsTh: ['ต้องมีใบรับรอง', '3 จุดดำน้ำ', 'รวมอุปกรณ์']
    },

    // Marine Merchandise
    {
        id: 307,
        title: 'TBF Captain Cap',
        titleTh: 'หมวกกัปตัน TBF',
        subtitle: 'Official yacht club style cap',
        subtitleTh: 'หมวกสไตล์ยอร์ชคลับของแท้',
        category: 'boat-merchandise',
        categoryLabel: 'Marine Merchandise',
        categoryLabelTh: 'สินค้าทะเล',
        image: '../images/sunset.png',
        price: 350,
        rating: 4.6,
        reviews: 189,
        isPhysical: true,
        tier: 'bronze',
        coinType: 'tbf',
        description: 'Premium navy blue captain cap with gold TBF embroidery.',
        descriptionTh: 'หมวกกัปตันสีกรมท่าปักโลโก้ TBF ทอง',
        conditions: ['One size fits all', 'Adjustable strap', 'Ships in 3-5 days'],
        conditionsTh: ['ไซส์เดียว', 'สายปรับได้', 'จัดส่งภายใน 3-5 วัน']
    },
    {
        id: 308,
        title: 'TBF Nautical Watch',
        titleTh: 'นาฬิกาทะเล TBF',
        subtitle: 'Limited edition dive watch',
        subtitleTh: 'นาฬิกาดำน้ำลิมิเต็ดอิดิชั่น',
        category: 'boat-merchandise',
        categoryLabel: 'Marine Merchandise',
        categoryLabelTh: 'สินค้าทะเล',
        image: '../images/santorini.png',
        price: 2500,
        rating: 5.0,
        reviews: 34,
        isPhysical: true,
        tier: 'gold',
        coinType: 'tbf',
        description: 'Water-resistant nautical watch with compass and TBF branding.',
        descriptionTh: 'นาฬิกากันน้ำพร้อมเข็มทิศและโลโก้ TBF',
        conditions: ['Water resistant 200m', 'Stainless steel', 'Numbered edition'],
        conditionsTh: ['กันน้ำ 200 เมตร', 'สแตนเลสสตีล', 'มีหมายเลขกำกับ']
    },
    {
        id: 309,
        title: 'TBF Polo Shirt',
        titleTh: 'เสื้อโปโลยอร์ช TBF',
        subtitle: 'Premium yacht club polo',
        subtitleTh: 'เสื้อโปโลสไตล์ยอร์ชคลับ',
        category: 'boat-merchandise',
        categoryLabel: 'Marine Merchandise',
        categoryLabelTh: 'สินค้าทะเล',
        image: '../images/santorini.png',
        price: 450,
        rating: 4.8,
        reviews: 98,
        isPhysical: true,
        tier: 'silver',
        coinType: 'tbf',
        description: 'Navy blue polo shirt with gold TBF anchor emblem.',
        descriptionTh: 'เสื้อโปโลสีกรมท่าปักตราสมอ TBF ทอง',
        conditions: ['Sizes S-XXL', 'Premium cotton', 'Ships in 5-7 days'],
        conditionsTh: ['ไซส์ S-XXL', 'ผ้าคอตตอนพรีเมียม', 'จัดส่งภายใน 5-7 วัน']
    },
    {
        id: 310,
        title: 'Marine Sunglasses',
        titleTh: 'แว่นกันแดดสำหรับเรือ',
        subtitle: 'Polarized sailing sunglasses',
        subtitleTh: 'แว่นโพลาไรซ์สำหรับลงเรือ',
        category: 'boat-merchandise',
        categoryLabel: 'Marine Merchandise',
        categoryLabelTh: 'สินค้าทะเล',
        image: '../images/santorini.png',
        price: 800,
        rating: 4.7,
        reviews: 76,
        isPhysical: true,
        tier: 'silver',
        coinType: 'tbf',
        description: 'Premium polarized sunglasses designed for sailing and water activities.',
        descriptionTh: 'แว่นกันแดดโพลาไรซ์พรีเมียมออกแบบสำหรับลงเรือและกิจกรรมทางน้ำ',
        conditions: ['Floating frame', 'Salt water resistant', 'Includes case'],
        conditionsTh: ['กรอบลอยน้ำได้', 'ทนน้ำเค็ม', 'รวมกล่องใส่']
    },
    {
        id: 311,
        title: 'TBF Duffel Bag',
        titleTh: 'กระเป๋าเรือ TBF',
        subtitle: 'Waterproof sailing bag',
        subtitleTh: 'กระเป๋ากันน้ำสำหรับลงเรือ',
        category: 'boat-merchandise',
        categoryLabel: 'Marine Merchandise',
        categoryLabelTh: 'สินค้าทะเล',
        image: '../images/sunset.png',
        price: 650,
        rating: 4.9,
        reviews: 112,
        isPhysical: true,
        tier: 'silver',
        coinType: 'tbf',
        description: 'Large waterproof duffel bag with TBF logo, perfect for sailing trips.',
        descriptionTh: 'กระเป๋าดัฟเฟิลกันน้ำขนาดใหญ่พร้อมโลโก้ TBF สำหรับทริปล่องเรือ',
        conditions: ['50L capacity', 'Fully waterproof', 'Ships in 3-5 days'],
        conditionsTh: ['ความจุ 50 ลิตร', 'กันน้ำ 100%', 'จัดส่งภายใน 3-5 วัน']
    },
    {
        id: 312,
        title: 'Captain Experience Day',
        titleTh: 'วันประสบการณ์กัปตัน',
        subtitle: 'Learn to sail a yacht',
        subtitleTh: 'เรียนขับเรือยอร์ช',
        category: 'boat-passes',
        categoryLabel: 'Boat Passes',
        categoryLabelTh: 'บัตรล่องเรือ',
        image: '../images/sunset.png',
        price: 1200,
        rating: 4.8,
        reviews: 45,
        isPhysical: false,
        tier: 'gold',
        coinType: 'tbf',
        eventDate: '2025-02-15',
        venue: 'Ocean Marina Yacht Club',
        description: 'Full day captain experience - learn to steer, navigate, and dock a yacht.',
        conditions: ['Full day course', 'Certified instructor', 'Lunch included'],
        conditionsTh: ['คอร์สเต็มวัน', 'ครูฝึกมีใบรับรอง', 'รวมอาหารกลางวัน']
    }
];

// Default coin values for initialization (used in utils.js initWalletData)
const defaultTeamCoins = {
    phoenix: 2500,
    shadow: 1800,
    thunder: 3200,
    dragon: 1500
};
const defaultTbfCoins = 1500;

// Helper function to get mainCategory from category id
function getMainCategoryFromCategory(categoryId) {
    const category = privilegeCategories.find(c => c.id === categoryId);
    return category ? category.mainCategory : 'colestai';
}

// Calculate category counts with mainCategory support
function getCategoryCounts(mainCategoryFilter = null) {
    const counts = {};
    const packages = typeof getActivePackages === 'function' ? getActivePackages() : privilegePackages;

    privilegeCategories.forEach(cat => {
        if (cat.id === 'all') {
            if (mainCategoryFilter && mainCategoryFilter !== 'all' && mainCategoryFilter !== 'flipsid') {
                // Count only packages in this main category
                counts[cat.id] = packages.filter(p => {
                    const pMainCat = getMainCategoryFromCategory(p.category);
                    return pMainCat === mainCategoryFilter;
                }).length;
            } else {
                counts[cat.id] = packages.length;
            }
        } else {
            counts[cat.id] = packages.filter(p => p.category === cat.id).length;
        }
    });
    return counts;
}

// Get team coin balance
function getTeamCoinBalance(teamId) {
    return walletData.teamCoins[teamId] || 0;
}

// Get coin balance by category
function getCoinBalanceByCategory(mainCategoryId) {
    switch (mainCategoryId) {
        case 'flipsid':
        case 'colestai':
            return { balance: walletData.totalPoints, name: 'Flips Coins', icon: '../images/flips_token.png' };
        case 'ctrlg':
            return {
                balance: Object.values(walletData.teamCoins).reduce((a, b) => a + b, 0),
                name: 'Team Coins',
                icon: '../images/ctrlg_token.png',
                teams: gameTeams.map(t => ({ ...t, balance: walletData.teamCoins[t.id] || 0 }))
            };
        case 'tbf':
            return { balance: walletData.tbfCoins, name: 'TBF Coins', icon: '../images/flips_token.png' };
        default:
            return { balance: walletData.totalPoints, name: 'Flips Coins', icon: '../images/flips_token.png' };
    }
}
