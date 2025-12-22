const mockData = {
    filters: [
        { id: 'all', label: 'All', labelTh: 'ทั้งหมด' },
        { id: 'travel', label: 'Travel', labelTh: 'ท่องเที่ยว', icon: 'fa-plane' },
        { id: 'hospitality', label: 'Hospitality', labelTh: 'โรงแรม', icon: 'fa-hotel' },
        { id: 'goods', label: 'Goods', labelTh: 'สินค้า', icon: 'fa-shopping-bag' },
        { id: 'shopping', label: 'Shopping', labelTh: 'ช้อปปิ้ง', icon: 'fa-tag' },
        { id: ' healthcare', label: 'Healthcare', labelTh: 'สุขภาพ', icon: 'fa-heartbeat' },
        { id: 'dining', label: 'Dining', labelTh: 'อาหาร', icon: 'fa-utensils' }
    ],
    socialLinks: [
        { icon: 'fa-facebook-f', url: '#' },
        { icon: 'fa-twitter', url: '#' },
        { icon: 'fa-instagram', url: '#' },
        { icon: 'fa-linkedin-in', url: '#' }
    ],
    footerSections: [
        { title: 'Quick Links', titleTh: 'ลิงก์ด่วน', links: ['Home', 'Packages', 'My Privilege', 'Contact'] },
        { title: 'Support', titleTh: 'ช่วยเหลือ', links: ['FAQ', 'Terms of Service', 'Privacy Policy', 'Help Center'] },
        { title: 'Legal', titleTh: 'กฎหมาย', links: ['Cookie Policy', 'Disclaimer', 'Copyright'] }
    ],
    packages: [
        {
            id: 1,
            title: 'Stay 2 nights at Wyndham Phuket',
            titleTh: 'พัก 2 คืนที่ วินด์แฮม ภูเก็ต',
            subtitle: 'Kalim Bay beachfront resort',
            subtitleTh: 'รีสอร์ตติดทะเลอ่าวกะหลิม',
            category: 'Hospitality',
            categoryTh: 'โรงแรม',
            image: '../images/hotel-room.png',
            price: 500,
            rating: 4.8,
            reviews: 234,
            isPhysical: false
        },
        {
            id: 2,
            title: 'Santorini Dream Escape',
            titleTh: 'ซานโตรินี ดรีม เอสเคป',
            subtitle: '5-star luxury experience',
            subtitleTh: 'ประสบการณ์หรูหราระดับ 5 ดาว',
            category: 'Travel',
            categoryTh: 'ท่องเที่ยว',
            image: '../images/santorini.png',
            price: 900,
            rating: 4.9,
            reviews: 189,
            isPhysical: false
        },
        {
            id: 3,
            title: 'Mountain Adventure',
            titleTh: 'ผจญภัยในหุบเขา',
            subtitle: 'Trekking & Camping Package',
            subtitleTh: 'แพ็คเกจเดินป่าและกางเต็นท์',
            category: 'Travel',
            categoryTh: 'ท่องเที่ยว',
            image: '../images/mountains.png',
            price: 600,
            rating: 4.7,
            reviews: 156,
            isPhysical: false
        },
        {
            id: 4,
            title: 'Maldives Paradise',
            titleTh: 'สวรรค์แห่งมัลดีฟส์',
            subtitle: 'Overwater Villa Stay',
            subtitleTh: 'พักวิลล่ากลางน้ำ',
            category: 'Travel',
            categoryTh: 'ท่องเที่ยว',
            image: '../images/sunset.png',
            price: 800,
            rating: 4.8,
            reviews: 312,
            isPhysical: false
        },
        {
            id: 5,
            title: 'Mediterranean Castle',
            titleTh: 'ปราสาทเมดิเตอร์เรเนียน',
            subtitle: 'Historic Luxury Stay',
            subtitleTh: 'พักผ่อนหรูหราในสถานที่ประวัติศาสตร์',
            category: 'Hospitality',
            categoryTh: 'โรงแรม',
            image: '../images/castle.png',
            price: 750,
            rating: 4.9,
            reviews: 428,
            isPhysical: false
        },
        {
            id: 6,
            title: 'Premium Travel Set',
            titleTh: 'ชุดอุปกรณ์เดินทางพรีเมียม',
            subtitle: 'Luggage & Accessories',
            subtitleTh: 'กระเป๋าเดินทางและอุปกรณ์เสริม',
            category: 'Goods',
            categoryTh: 'สินค้า',
            image: '../images/travel_set.png',
            price: 300,
            rating: 4.5,
            reviews: 89,
            isPhysical: true
        },
        {
            id: 7,
            title: 'Luxury Spa Package',
            titleTh: 'แพ็คเกจสปาหรู',
            subtitle: 'Full Body Treatment',
            subtitleTh: 'ทรีตเมนต์ทั่วร่างกาย',
            category: 'Healthcare',
            categoryTh: 'สุขภาพ',
            image: '../images/hotel-room.png',
            price: 250,
            rating: 4.8,
            reviews: 145,
            isPhysical: false
        },
        {
            id: 8,
            title: 'Fine Dining Experience',
            titleTh: 'ประสบการณ์อาหารมื้อหรู',
            subtitle: '5-Course Meal for Two',
            subtitleTh: 'อาหาร 5 คอร์สสำหรับ 2 ท่าน',
            category: 'Dining',
            categoryTh: 'อาหาร',
            image: '../images/breakfast.png',
            price: 400,
            rating: 4.9,
            reviews: 276,
            isPhysical: false
        },
        {
            id: 9,
            title: 'Premium Smartwatch',
            titleTh: 'นาฬิกาอัจฉริยะพรีเมียม',
            subtitle: 'Health & Fitness Tracker',
            subtitleTh: 'ติดตามสุขภาพและฟิตเนส',
            category: 'Goods',
            categoryTh: 'สินค้า',
            image: '../images/smart_watch.png',
            price: 450,
            rating: 4.7,
            reviews: 156,
            isPhysical: true
        },
        {
            id: 10,
            title: 'Wireless Earbuds Pro',
            titleTh: 'หูฟังไร้สายโปร',
            subtitle: 'Active Noise Cancelling',
            subtitleTh: 'ตัดเสียงรบกวน',
            category: 'Goods',
            categoryTh: 'สินค้า',
            image: '../images/wireless_earbuds.png',
            price: 350,
            rating: 4.8,
            reviews: 203,
            isPhysical: true
        },
        {
            id: 11,
            title: 'Luxury Leather Wallet',
            titleTh: 'กระเป๋าสตางค์หนังหรู',
            subtitle: 'Genuine Italian Leather',
            subtitleTh: 'หนังอิตาลีแท้',
            category: 'Goods',
            categoryTh: 'สินค้า',
            image: '../images/leather_wallet.png',
            price: 200,
            rating: 4.6,
            reviews: 98,
            isPhysical: true
        },
        {
            id: 12,
            title: 'Designer Sunglasses',
            titleTh: 'แว่นตากันแดดดีไซเนอร์',
            subtitle: 'UV400 Protection',
            subtitleTh: 'ป้องกัน UV400',
            category: 'Goods',
            categoryTh: 'สินค้า',
            image: '../images/designer_sunglasses.png',
            price: 280,
            rating: 4.5,
            reviews: 124,
            isPhysical: true
        }
    ]
};

const packagesData = {
    1: {
        id: 1,
        title: 'Stay 2 nights at Wyndham Phuket',
        titleTh: 'พัก 2 คืนที่ วินด์แฮม ภูเก็ต',
        subtitle: 'Kalim Bay beachfront resort',
        subtitleTh: 'รีสอร์ตติดทะเลอ่าวกะหลิม',
        description: `<p class="mb-4">Experience the ultimate beachfront luxury at Wyndham Grand Phuket Kalim Bay. This stunning 2-night package offers an exceptional opportunity to indulge in world-class hospitality.</p>
        <p class="mb-4">Nestled on the beautiful Kalim Bay, this 5-star resort provides breathtaking ocean views, exceptional dining experiences, and top-tier amenities.</p>
        <p>Your package includes daily breakfast buffet, complimentary airport transfers, access to the infinity pool, and a special Thai spa treatment.</p>`,
        descriptionTh: `<p class="mb-4">สัมผัสประสบการณ์ความหรูหราติดชายหาดที่วินด์แฮม แกรนด์ ภูเก็ต กะหลิม เบย์ แพ็คเกจ 2 คืนนี้มอบโอกาสพิเศษให้คุณได้ดื่มด่ำกับการต้อนรับระดับโลก</p>
        <p class="mb-4">ตั้งอยู่บนอ่าวกะหลิมที่สวยงาม รีสอร์ตระดับ 5 ดาวแห่งนี้มองเห็นวิวทะเลที่น่าทึ่ง มอบประสบการณ์การรับประทานอาหารที่ยอดเยี่ยม และสิ่งอำนวยความสะดวกชั้นนำ</p>
        <p>แพ็คเกจของคุณรวมบุฟเฟต์อาหารเช้าทุกวัน บริการรับส่งสนามบินฟรี การเข้าใช้สระว่ายน้ำอินฟินิตี้ และทรีตเมนต์สปาไทยสุดพิเศษ</p>`,
        images: [
            '../images/hotel-room.png',
            '../images/sunset.png',
            '../images/breakfast.png',
            '../images/hotel-room.png',
            '../images/sunset.png',
        ],
        price: 500,
        currency: 'RDS',
        validUntil: '30 Apr 2024',
        rating: 4.8,
        reviews: 234,
        category: 'Travel',
        categoryTh: 'ท่องเที่ยว',
        website: 'wyndham.com',
        amenities: [
            { icon: 'fa-wifi', label: 'Free WiFi', labelTh: 'ฟรี WiFi' },
            { icon: 'fa-swimming-pool', label: 'Infinity Pool', labelTh: 'สระว่ายน้ำอินฟินิตี้' },
            { icon: 'fa-spa', label: 'Spa & Wellness', labelTh: 'สปาและสุขภาพ' },
            { icon: 'fa-utensils', label: 'Restaurant', labelTh: 'ร้านอาหาร' },
            { icon: 'fa-parking', label: 'Free Parking', labelTh: 'ที่จอดรถฟรี' },
            { icon: 'fa-dumbbell', label: 'Fitness Center', labelTh: 'ฟิตเนส' },
            { icon: 'fa-umbrella-beach', label: 'Private Beach', labelTh: 'ชายหาดส่วนตัว' },
            { icon: 'fa-concierge-bell', label: '24/7 Concierge', labelTh: 'บริการคอนเซียร์จ 24 ชม.' },
        ],
        conditions: [
            'Valid for 2 adults in a Deluxe Ocean View Room',
            'Booking must be made at least 7 days in advance',
            'Subject to availability - blackout dates may apply',
            'Non-transferable and cannot be exchanged for cash',
            'Valid for stay between now and 30 Apr 2024',
            'Check-in: 3:00 PM, Check-out: 11:00 AM',
            'Cancellation must be made 48 hours before arrival',
        ],
        conditionsTh: [
            'ใช้ได้สำหรับผู้ใหญ่ 2 ท่านในห้อง Deluxe Ocean View',
            'ต้องจองล่วงหน้าอย่างน้อย 7 วัน',
            'ขึ้นอยู่กับความพร้อมให้บริการ - อาจมีวันที่งดให้บริการ',
            'ไม่สามารถโอนสิทธิ์และแลกเปลี่ยนเป็นเงินสดได้',
            'ใช้ได้สำหรับการเข้าพักตั้งแต่วันนี้ถึง 30 เมษายน 2024',
            'เช็คอิน: 15:00 น., เช็คเอาท์: 11:00 น.',
            'การยกเลิกต้องทำล่วงหน้า 48 ชั่วโมงก่อนเดินทางมาถึง',
        ],
        redeemSteps: [
            { title: 'Select Your Dates', description: 'Choose your preferred check-in and check-out dates.' },
            { title: 'Verify Points Balance', description: 'Ensure you have enough RDS points in your wallet.' },
            { title: 'Confirm Booking', description: 'Review your booking details and confirm.' },
            { title: 'Receive Voucher', description: 'Your voucher will be sent to your email instantly.' },
            { title: 'Present at Hotel', description: 'Show your QR code at the reception during check-in.' },
        ],
        redeemStepsTh: [
            { title: 'เลือกวันที่', description: 'เลือกวันที่เช็คอินและเช็คเอาท์ที่คุณต้องการ' },
            { title: 'ตรวจสอบคะแนน', description: 'ตรวจสอบให้แน่ใจว่าคุณมีคะแนน RDS เพียงพอในกระเป๋าเงิน' },
            { title: 'ยืนยันการจอง', description: 'ตรวจสอบรายละเอียดการจองและยืนยัน' },
            { title: 'รับวอเชอร์', description: 'วอเชอร์จะถูกส่งไปยังอีเมลของคุณทันที' },
            { title: 'แสดงที่โรงแรม', description: 'แสดง QR code ที่แผนกต้อนรับขณะเช็คอิน' },
        ],
        reviewsData: [
            { name: 'Sarah Johnson', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100', date: '2 weeks ago', rating: 5, comment: 'Absolutely stunning resort! The views are breathtaking.' },
            { name: 'Michael Chen', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100', date: '1 month ago', rating: 5, comment: 'Perfect getaway experience. The infinity pool was the highlight.' },
            { name: 'Emma Williams', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100', date: '1 month ago', rating: 4, comment: 'Beautiful property with excellent amenities.' },
        ]
    }
};

const defaultWalletData = {
    totalPoints: 50000,
    pointsBatches: [
        { id: 1, amount: 20000, source: 'Investment Reward - Gold Tier', earnedDate: '2024-01-15', expiryDate: '2025-06-15', status: 'active' },
        { id: 2, amount: 15000, source: 'Film Production Bonus', earnedDate: '2024-02-20', expiryDate: '2025-08-20', status: 'active' },
        { id: 3, amount: 10000, source: 'Referral Bonus', earnedDate: '2024-03-10', expiryDate: '2025-09-10', status: 'active' },
        { id: 4, amount: 5000, source: 'Limited Time Promotion', earnedDate: '2024-04-01', expiryDate: '2025-05-01', status: 'expiring_soon' },
    ],
    transactions: [
        { type: 'earn', amount: 5000, description: 'Limited Time Promotion', date: '2024-04-01' },
        { type: 'earn', amount: 10000, description: 'Referral Bonus', date: '2024-03-10' },
        { type: 'earn', amount: 15000, description: 'Film Production Bonus', date: '2024-02-20' },
        { type: 'earn', amount: 20000, description: 'Investment Reward - Gold Tier', date: '2024-01-15' },
    ]
};
