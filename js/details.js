let currentPackage = null;
let currentTab = 'details';
let quantity = 1;
let currentImageIndex = 0;
let bookingDate = '';

// ============================================
// RENDER FUNCTIONS - DETAILS SPECIFIC
// ============================================

function renderPackage() {
    if (!currentPackage) return;

    // Update breadcrumb
    const breadcrumbTitle = document.getElementById('breadcrumb-title');
    if (breadcrumbTitle) breadcrumbTitle.textContent = currentLanguage === 'th' && currentPackage.titleTh ? currentPackage.titleTh : currentPackage.title;

    // Update Main Title & Subtitle
    document.getElementById('packageTitle').textContent = currentLanguage === 'th' && currentPackage.titleTh ? currentPackage.titleTh : currentPackage.title;
    document.getElementById('packageSubtitle').textContent = currentLanguage === 'th' && currentPackage.subtitleTh ? currentPackage.subtitleTh : currentPackage.subtitle;


    // Features
    const category = currentLanguage === 'th' && currentPackage.categoryTh ? currentPackage.categoryTh : currentPackage.category;
    const t = translations[currentLanguage];

    const categoryEl = document.getElementById('category');
    if (categoryEl) categoryEl.textContent = category;

    const validUntilEl = document.getElementById('validUntil');
    if (validUntilEl) validUntilEl.textContent = currentPackage.validUntil || '31 Dec 2024';

    // Website & Map Links
    const websiteLink = document.getElementById('websiteLink');
    if (websiteLink && currentPackage.website) {
        websiteLink.href = 'https://' + currentPackage.website;
    }

    // Main Image
    if (!currentPackage.images || !Array.isArray(currentPackage.images)) {
        currentPackage.images = [currentPackage.image || 'https://via.placeholder.com/800x500'];
    }
    const imgEl = document.getElementById('mainImage');
    if (imgEl && currentPackage.images[currentImageIndex]) {
        imgEl.src = currentPackage.images[currentImageIndex];
        imgEl.onerror = function () {
            this.src = 'https://via.placeholder.com/800x500?text=Image+Not+Found';
        };
    }

    // Update Image Counter
    const counterEl = document.getElementById('imageCounter');
    if (counterEl) {
        counterEl.textContent = `${currentImageIndex + 1} / ${currentPackage.images.length}`;
    }

    updatePrice();
    renderStars();
    renderThumbnails();
    renderDetails();
    renderConditions();
    renderRedeem();
    renderReviews();
    updateTabLabels();
}

function updateTabLabels() {
    const isGoods = currentPackage.category === 'Goods' || currentPackage.isPhysical;

    // Update tab buttons
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
        const tab = btn.dataset.tab;
        if (tab === 'details') {
            btn.innerHTML = isGoods
                ? `<i class="fas fa-box mr-2 text-purple-primary"></i>${currentLanguage === 'th' ? 'รายละเอียดสินค้า' : 'Product Details'}`
                : `<i class="fas fa-info-circle mr-2 text-purple-primary"></i>${currentLanguage === 'th' ? 'รายละเอียด' : 'Details'}`;
        } else if (tab === 'conditions') {
            btn.innerHTML = isGoods
                ? `<i class="fas fa-shield-alt mr-2"></i>${currentLanguage === 'th' ? 'ข้อกำหนด' : 'Product Terms'}`
                : `<i class="fas fa-file-contract mr-2"></i>${currentLanguage === 'th' ? 'เงื่อนไข' : 'Conditions'}`;
        } else if (tab === 'redeem') {
            btn.innerHTML = isGoods
                ? `<i class="fas fa-shopping-cart mr-2"></i>${currentLanguage === 'th' ? 'วิธีสั่งซื้อ' : 'How to Order'}`
                : `<i class="fas fa-gift mr-2"></i>${currentLanguage === 'th' ? 'วิธีแลก' : 'How to Redeem'}`;
        }
    });

    // Update reviews section title
    const reviewsTitle = document.querySelector('#reviewsList')?.previousElementSibling?.querySelector('h3');
    if (reviewsTitle) {
        reviewsTitle.textContent = isGoods
            ? (currentLanguage === 'th' ? 'รีวิวสินค้า' : 'Product Reviews')
            : (currentLanguage === 'th' ? 'รีวิวจากผู้เข้าพัก' : 'Guest Reviews');
    }
}

function renderStars() {
    const stars = Array(5).fill(0).map((_, i) =>
        `<i class="fas fa-star ${i < Math.floor(currentPackage.rating) ? 'text-yellow-400' : 'text-white/20'} text-sm"></i>`
    ).join('');

    const elements = ['starRating', 'cardStarRating'];
    elements.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.innerHTML = stars;
    });

    const ratingEls = ['avgRating', 'cardAvgRating'];
    ratingEls.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.textContent = currentPackage.rating;
    });

    const t = translations[currentLanguage];
    const reviewEls = ['reviewCount', 'cardReviewCount'];
    reviewEls.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.textContent = `(${currentPackage.reviews} ${t.reviews_count})`;
    });
}

function renderThumbnails() {
    document.getElementById('thumbnailGallery').innerHTML = currentPackage.images.map((img, idx) => `
        <button onclick="setImage(${idx})" class="flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 ${idx === currentImageIndex ? 'border-purple-primary' : 'border-transparent'} hover:border-purple-primary/50 transition-colors">
            <img src="${img}" alt="Thumbnail ${idx + 1}" class="w-full h-full object-cover">
        </button>
    `).join('');
}

function renderDetails() {
    const t = translations[currentLanguage];
    const description = currentLanguage === 'th' && currentPackage.descriptionTh ? currentPackage.descriptionTh : currentPackage.description;
    const isGoods = currentPackage.category === 'Goods' || currentPackage.isPhysical;

    let contentHtml = `
        <h3 class="text-xl font-semibold mb-4">${isGoods ? (currentLanguage === 'th' ? 'รายละเอียดสินค้า' : 'Product Details') : t.section_details}</h3>
        <div class="text-white/70 leading-relaxed space-y-4">
            ${description || (isGoods ? (currentLanguage === 'th' ? 'สินค้าคุณภาพสูงจากแบรนด์ชั้นนำ พร้อมการรับประกันคุณภาพ' : 'High-quality product from premium brands with quality guarantee.') : '')}
        </div>
    `;

    if (isGoods) {
        // Product Specifications for Goods
        const specs = currentPackage.specifications || [
            { icon: 'fa-box', label: currentLanguage === 'th' ? 'จัดส่งฟรี' : 'Free Shipping', labelTh: 'จัดส่งฟรี' },
            { icon: 'fa-shield-alt', label: currentLanguage === 'th' ? 'รับประกัน 1 ปี' : '1 Year Warranty', labelTh: 'รับประกัน 1 ปี' },
            { icon: 'fa-undo', label: currentLanguage === 'th' ? 'คืนได้ภายใน 30 วัน' : '30 Days Return', labelTh: 'คืนได้ภายใน 30 วัน' },
            { icon: 'fa-check-circle', label: currentLanguage === 'th' ? 'สินค้าแท้ 100%' : '100% Authentic', labelTh: 'สินค้าแท้ 100%' }
        ];

        contentHtml += `
            <h3 class="text-xl font-semibold mt-8 mb-4">${currentLanguage === 'th' ? 'รายละเอียดการจัดส่ง' : 'Shipping Information'}</h3>
            <div class="grid grid-cols-2 gap-4">
                ${specs.map(s => `
                    <div class="flex items-center gap-3 text-white/70">
                        <div class="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-purple-primary">
                            <i class="fas ${s.icon}"></i>
                        </div>
                        <span>${currentLanguage === 'th' && s.labelTh ? s.labelTh : s.label}</span>
                    </div>
                `).join('')}
            </div>
        `;
    } else if (currentPackage.amenities && currentPackage.amenities.length > 0) {
        // Amenities for Hotels/Services
        contentHtml += `
            <h3 class="text-xl font-semibold mt-8 mb-4">${t.section_amenities}</h3>
            <div class="grid grid-cols-2 gap-4">
                ${currentPackage.amenities.map(a => `
                    <div class="flex items-center gap-3 text-white/70">
                        <div class="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-purple-primary">
                            <i class="fas ${a.icon}"></i>
                        </div>
                        <span>${currentLanguage === 'th' && a.labelTh ? a.labelTh : a.label}</span>
                    </div>
                `).join('')}
            </div>
        `;
    }

    document.getElementById('tab-details').innerHTML = contentHtml;
}

function renderConditions() {
    const t = translations[currentLanguage];
    const isGoods = currentPackage.category === 'Goods' || currentPackage.isPhysical;

    let conditions;
    if (isGoods) {
        // Product-specific conditions
        conditions = currentLanguage === 'th' ? [
            'สินค้าแท้ 100% จากแบรนด์โดยตรง',
            'รับประกันคุณภาพสินค้า 1 ปี',
            'จัดส่งฟรีทั่วประเทศ',
            'สามารถคืนสินค้าได้ภายใน 30 วัน หากสินค้ามีปัญหา',
            'ไม่สามารถแลกเปลี่ยนเป็นเงินสดได้',
            'สินค้าพร้อมจัดส่งภายใน 1-3 วันทำการ',
            'ระยะเวลาจัดส่ง 7-14 วันทำการ'
        ] : [
            '100% authentic product from official brand',
            '1-year product quality warranty',
            'Free shipping nationwide',
            'Returns accepted within 30 days if product is defective',
            'Cannot be exchanged for cash',
            'Product ships within 1-3 business days',
            'Delivery time: 7-14 business days'
        ];
    } else {
        // Use package-specific conditions (for hotels/services)
        conditions = currentLanguage === 'th' && currentPackage.conditionsTh ? currentPackage.conditionsTh : currentPackage.conditions;
    }

    const sectionTitle = isGoods
        ? (currentLanguage === 'th' ? 'ข้อกำหนดสินค้า' : 'Product Terms')
        : t.section_conditions;

    document.getElementById('tab-conditions').innerHTML = `
        <h3 class="text-xl font-semibold mb-4">${sectionTitle}</h3>
        <ul class="space-y-3 text-white/70">
            ${conditions.map(c => `
                <li class="flex items-start gap-3">
                    <i class="fas fa-check-circle text-green-400 text-sm mt-1"></i>
                    <span>${c}</span>
                </li>
            `).join('')}
        </ul>
    `;
}

function renderRedeem() {
    const t = translations[currentLanguage];
    const isGoods = currentPackage.category === 'Goods' || currentPackage.isPhysical;

    let steps;
    if (isGoods) {
        // Product ordering steps
        steps = currentLanguage === 'th' ? [
            { title: 'ยืนยันคะแนน', description: 'ตรวจสอบยอดคะแนน RDS ของคุณว่าเพียงพอสำหรับสินค้านี้' },
            { title: 'กรอกที่อยู่จัดส่ง', description: 'กรอกข้อมูลที่อยู่สำหรับจัดส่งสินค้าให้ครบถ้วน' },
            { title: 'ยืนยันการสั่งซื้อ', description: 'ตรวจสอบรายละเอียดและยืนยันการสั่งซื้อ' },
            { title: 'ติดตามสถานะ', description: 'ติดตามสถานะการจัดส่งได้ที่หน้า "คำสั่งของฉัน"' },
            { title: 'รับสินค้า', description: 'สินค้าจะถูกจัดส่งถึงบ้านภายใน 7-14 วันทำการ' }
        ] : [
            { title: 'Verify Points', description: 'Ensure you have enough RDS points for this product.' },
            { title: 'Enter Shipping Address', description: 'Fill in your complete shipping address.' },
            { title: 'Confirm Order', description: 'Review your order details and confirm.' },
            { title: 'Track Your Order', description: 'Track shipping status in "My Orders" section.' },
            { title: 'Receive Product', description: 'Your item will be delivered within 7-14 business days.' }
        ];
    } else {
        // Voucher redemption steps
        steps = currentLanguage === 'th' && currentPackage.redeemStepsTh ? currentPackage.redeemStepsTh : currentPackage.redeemSteps;
    }

    const sectionTitle = isGoods
        ? (currentLanguage === 'th' ? 'วิธีการสั่งซื้อ' : 'How to Order')
        : t.section_redeem;

    document.getElementById('tab-redeem').innerHTML = `
        <h3 class="text-xl font-semibold mb-4">${sectionTitle}</h3>
        <div class="space-y-4">
            ${steps.map((step, idx) => `
                <div class="flex gap-4">
                    <div class="w-10 h-10 rounded-full btn-gradient flex items-center justify-center font-bold flex-shrink-0">${idx + 1}</div>
                    <div>
                        <h4 class="font-semibold mb-1">${step.title}</h4>
                        <p class="text-white/60">${step.description}</p>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

function renderReviews() {
    // Check if reviewsData exists
    const reviews = currentPackage.reviewsData || [];
    const t = translations[currentLanguage];

    const container = document.getElementById('reviewsList');
    if (!container) return;

    container.innerHTML = `
        <h3 class="text-xl font-semibold mb-6 flex items-center gap-2">
            ${t.section_reviews} <span class="text-sm font-normal text-white/50">(${currentPackage.reviews})</span>
        </h3>
        <div class="space-y-6">
            ${reviews.map(r => `
                <div class="border-b border-white/10 pb-6 last:border-0">
                    <div class="flex items-center gap-4 mb-3">
                        <img src="${r.avatar}" alt="${r.name}" class="w-10 h-10 rounded-full object-cover">
                        <div>
                            <h4 class="font-medium">${r.name}</h4>
                            <p class="text-white/50 text-sm">${r.date}</p>
                        </div>
                        <div class="ml-auto flex gap-1">
                            ${Array(r.rating).fill('<i class="fas fa-star text-yellow-400 text-sm"></i>').join('')}
                        </div>
                    </div>
                    <p class="text-white/70">${r.comment}</p>
                </div>
            `).join('')}
        </div>
        <button class="w-full py-3 rounded-xl border border-white/10 hover:border-purple-primary text-white/70 hover:text-white transition-all mt-4 font-medium">
            ${t.view_all_reviews}
        </button>
    `;
}

function renderRelated() {
    // For simplicity using all packages except current one as related, limited to 4
    const related = mockData.packages.filter(p => p.id !== currentPackage.id).slice(0, 4);

    document.getElementById('relatedPackages').innerHTML = related.map(p => {
        const title = currentLanguage === 'th' && p.titleTh ? p.titleTh : p.title;
        return `
            <a href="details.html?id=${p.id}" class="group glass-card rounded-2xl overflow-hidden hover:-translate-y-1 transition-all duration-300">
                <div class="relative overflow-hidden">
                    <img src="${p.image}" alt="${title}" class="w-full h-40 object-cover group-hover:scale-110 transition-transform duration-500">
                </div>
                <div class="p-4">
                    <h3 class="font-semibold mb-2 group-hover:text-purple-primary transition-colors line-clamp-1">${title}</h3>
                    <div class="flex items-center justify-between">
                        <div class="flex items-center gap-1">
                            <i class="fas fa-star text-yellow-400 text-sm"></i>
                            <span class="font-medium">${p.rating}</span>
                        </div>
                        <span class="font-bold">${p.price} RDS</span>
                    </div>
                </div>
            </a>
        `;
    }).join('');
}

// ============================================
// LOGIC HANDLERS
// ============================================

function setImage(idx) {
    currentImageIndex = idx;
    document.getElementById('mainImage').src = currentPackage.images[idx];
    renderThumbnails();
}

function switchTab(tabId) {
    currentTab = tabId;
    document.querySelectorAll('[id^="tab-"]').forEach(el => el.classList.add('hidden'));
    document.getElementById(`tab-${tabId}`).classList.remove('hidden');

    document.querySelectorAll('.tab-btn').forEach(btn => {
        if (btn.getAttribute('onclick').includes(tabId)) {
            btn.classList.add('text-purple-primary', 'border-purple-primary');
            btn.classList.remove('text-white/50', 'border-transparent');
        } else {
            btn.classList.remove('text-purple-primary', 'border-purple-primary');
            btn.classList.add('text-white/50', 'border-transparent');
        }
    });
}

function updateQuantity(change) {
    const newQty = quantity + change;
    if (newQty >= 1) {
        quantity = newQty;
        document.getElementById('quantity').textContent = quantity;
        updatePrice();
    }
}

function updatePrice() {
    const totalPrice = currentPackage.price * quantity;
    const afterBalance = walletData.totalPoints - totalPrice;
    const canAfford = afterBalance >= 0;
    const t = translations[currentLanguage];

    document.getElementById('totalPrice').textContent = totalPrice.toLocaleString();

    const balanceAfterEl = document.getElementById('afterBalance');
    if (balanceAfterEl) {
        balanceAfterEl.textContent = `${t.label_balance_after} ${Math.max(0, afterBalance).toLocaleString()} RDS`;
        balanceAfterEl.className = `text-sm mt-2 ${canAfford ? 'text-green-400' : 'text-red-400'}`;
    }

    const btn = document.getElementById('bookBtn');
    if (btn) {
        const isGoods = currentPackage.category === 'Goods' || currentPackage.isPhysical;
        const buttonText = isGoods
            ? (currentLanguage === 'th' ? 'สั่งซื้อสินค้า' : 'Order Product')
            : t.btn_book;
        const buttonIcon = isGoods ? 'fa-shopping-cart' : 'fa-ticket-alt';

        btn.disabled = !canAfford;
        btn.innerHTML = `<i class="fas ${buttonIcon}"></i> ${canAfford ? buttonText : t.btn_not_enough}`;
        btn.className = `w-full py-4 rounded-xl font-bold text-lg mb-3 transition-all duration-300 flex items-center justify-center gap-2 ${canAfford
            ? 'btn-gradient text-white hover:opacity-90 hover:scale-[1.02] shadow-lg hover:shadow-purple-500/25'
            : 'bg-white/10 text-white/40 cursor-not-allowed'
            }`;
    }
}


function updateBookingDate() {
    bookingDate = document.getElementById('bookingDate').value;
}

function bookPackage() {
    if (currentPackage.category === 'Goods' || currentPackage.isPhysical) {
        const img = document.getElementById('shippingProductImage');
        if (img) img.src = currentPackage.images[0];
        const name = document.getElementById('shippingProductName');
        if (name) name.textContent = currentPackage.title;
        const price = document.getElementById('shippingProductPrice');
        if (price) price.textContent = (currentPackage.price * quantity).toLocaleString() + ' RDS';
        openModal('shippingModal');
        return;
    }

    const totalPrice = currentPackage.price * quantity;

    if (walletData.totalPoints < totalPrice) {
        showToast(currentLanguage === 'th' ? 'คะแนนไม่พอ!' : 'Insufficient points!', 'error');
        return;
    }

    if (!bookingDate) {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        bookingDate = tomorrow.toISOString().split('T')[0];
    }

    const voucherCode = 'CLT-' + Date.now().toString(36).toUpperCase();
    const currentVoucher = {
        title: currentPackage.title,
        code: voucherCode,
        image: currentPackage.images[0],
        date: bookingDate,
        quantity: quantity,
        price: totalPrice,
        bookedAt: new Date().toISOString(),
        used: false
    };

    walletData.totalPoints -= totalPrice;
    walletData.transactions.unshift({
        type: 'spend',
        amount: -totalPrice,
        description: currentPackage.title,
        date: new Date().toISOString().split('T')[0]
    });

    userVouchers.push(currentVoucher);
    localStorage.setItem('walletData', JSON.stringify(walletData));
    localStorage.setItem('userVouchers', JSON.stringify(userVouchers));

    updatePointsDisplay();
    updatePrice();

    const msg = document.getElementById('bookingMessage');
    if (msg) msg.textContent = currentLanguage === 'th'
        ? `สร้างวอเชอร์สำหรับ "${currentPackage.title}" เรียบร้อยแล้ว!`
        : `Your voucher for "${currentPackage.title}" has been generated!`;

    openModal('bookingModal');

    const qrBtn = document.querySelector('#bookingModal button[onclick^="showQRCode"]');
    if (qrBtn) {
        qrBtn.onclick = function () {
            closeModal('bookingModal');
            if (typeof generateQR === 'function') generateQR(currentVoucher);
        };
    }
}

function showQRCode() {
    // Placeholder for inline HTML calls, handled by generateQR via modal button override
    closeModal('bookingModal');
}

function submitShipping(e) {
    e.preventDefault();
    const totalPrice = currentPackage.price * quantity;

    if (walletData.totalPoints < totalPrice) {
        showToast(currentLanguage === 'th' ? 'คะแนนไม่พอ!' : 'Insufficient points!', 'error');
        return;
    }

    walletData.totalPoints -= totalPrice;

    const voucherCode = 'SHP-' + Date.now().toString(36).toUpperCase();
    const orderId = 'ORD-' + Math.floor(Math.random() * 1000000);

    const shippingInfo = {
        firstName: document.getElementById('shipFirstName').value,
        lastName: document.getElementById('shipLastName').value,
        phone: document.getElementById('shipPhone').value,
        address: document.getElementById('shipAddress').value,
        notes: document.getElementById('shipNotes').value
    };

    const currentVoucher = {
        title: currentPackage.title,
        code: voucherCode,
        image: currentPackage.images[0],
        quantity: quantity,
        price: totalPrice,
        orderedAt: new Date().toISOString(),
        isShipped: true,
        status: 'processing',
        orderId: orderId,
        shippingInfo: shippingInfo
    };

    walletData.transactions.unshift({
        type: 'spend',
        amount: -totalPrice,
        description: currentPackage.title + ' (Shipping)',
        date: new Date().toISOString().split('T')[0]
    });

    userVouchers.push(currentVoucher);
    localStorage.setItem('walletData', JSON.stringify(walletData));
    localStorage.setItem('userVouchers', JSON.stringify(userVouchers));

    updatePointsDisplay();
    closeModal('shippingModal');

    document.getElementById('shipOrderId').textContent = orderId;
    document.getElementById('shipOrderItem').textContent = currentPackage.title + ` (x${quantity})`;
    document.getElementById('shipPointsUsed').textContent = totalPrice.toLocaleString();

    const d = new Date(); d.setDate(d.getDate() + 10);
    const dateEl = document.getElementById('shipExpectedDate');
    if (dateEl) dateEl.textContent = d.toLocaleDateString();

    document.getElementById('shipToName').textContent = shippingInfo.firstName + ' ' + shippingInfo.lastName;
    document.getElementById('shipToAddress').textContent = shippingInfo.address;
    document.getElementById('shipToPhone').textContent = shippingInfo.phone;

    openModal('shippingSuccessModal');
}

function viewOrderDetails() {
    closeModal('shippingSuccessModal');
    openProfile();
    setTimeout(() => switchProfileTab('orders'), 100); // Small delay to ensure modal rendering
}

// function switchProfileTab handled by utils.js

// ============================================
// INIT
// ============================================

function initDetails() {
    initWalletData();
    const urlParams = new URLSearchParams(window.location.search);
    const id = parseInt(urlParams.get('id')) || 1;

    // Find package in packagesData or search within mockData.packages
    currentPackage = packagesData[id] || mockData.packages.find(p => p.id === id);

    // Fallback if not detailed data exists, use summary data from mockData
    if (currentPackage && !currentPackage.images) {
        // Normalize data for packages that only have summary info
        currentPackage.images = [currentPackage.image];
        // Add default detailed fields if missing to prevent errors
        if (!currentPackage.amenities) currentPackage.amenities = packagesData[1].amenities;
        if (!currentPackage.conditions) currentPackage.conditions = packagesData[1].conditions;
        if (!currentPackage.conditionsTh) currentPackage.conditionsTh = packagesData[1].conditionsTh;
        if (!currentPackage.redeemSteps) currentPackage.redeemSteps = packagesData[1].redeemSteps;
        if (!currentPackage.redeemStepsTh) currentPackage.redeemStepsTh = packagesData[1].redeemStepsTh;
        if (!currentPackage.reviewsData) currentPackage.reviewsData = packagesData[1].reviewsData;
        if (!currentPackage.description) currentPackage.description = "Experience the ultimate luxury with this exclusive package. Enjoy world-class amenities and unforgettable moments.";
        if (!currentPackage.descriptionTh) currentPackage.descriptionTh = "สัมผัสประสบการณ์ความหรูหราที่สุดกับแพ็คเกจสุดพิเศษนี้ เพลิดเพลินกับสิ่งอำนวยความสะดวกระดับโลกและช่วงเวลาที่น่าจดจำ";
    }

    if (!currentPackage) currentPackage = packagesData[1]; // Absolute fallback

    renderPackage();
    renderRelated();
    renderFooter();
    updatePointsDisplay();
    updateContentLanguage();
}

document.addEventListener('DOMContentLoaded', initDetails);
