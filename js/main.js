let currentFilter = 'all';
let displayedPackages = 8;
let pendingShippingPackage = null;

// ============================================
// RENDER FUNCTIONS
// ============================================

function renderHero() {
    // Static text is handled by updateContentLanguage and data-i18n
    updatePointsDisplay();
}

function renderFilterTabs() {
    const container = document.getElementById('filterTabs');
    if (!container) return;

    container.innerHTML = mockData.filters.map(f => `
        <button 
            onclick="setFilter('${f.id}')"
            class="px-6 py-2 rounded-full border transition-all duration-300 whitespace-nowrap flex items-center gap-2
            ${currentFilter === f.id ? 'bg-white text-black border-white' : 'bg-transparent text-white/70 border-white/20 hover:border-white/50 hover:text-white'}"
        >
            ${f.icon ? `<i class="fas ${f.icon}"></i>` : ''}
            ${currentLanguage === 'th' ? f.labelTh : f.label}
        </button>
    `).join('');
}

function renderPackages() {
    const container = document.getElementById('packagesGrid');
    if (!container) return;

    let filtered = mockData.packages;
    if (currentFilter !== 'all') {
        filtered = filtered.filter(p => p.category.toLowerCase() === currentFilter.toLowerCase());
    }

    const showing = filtered.slice(0, displayedPackages);

    if (filtered.length === 0) {
        container.innerHTML = `
            <div class="col-span-full text-center py-12">
                <div class="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i class="fas fa-search text-2xl text-white/30"></i>
                </div>
                <h3 class="text-xl font-medium mb-2">${currentLanguage === 'th' ? 'ไม่พบแพ็คเกจ' : 'No packages found'}</h3>
                <p class="text-white/50">${currentLanguage === 'th' ? 'ลองเปลี่ยนคำค้นหาหรือตัวกรองดูนะครับ' : 'Try adjusting your search or filter to find what you need.'}</p>
                <button onclick="setFilter('all'); document.getElementById('searchInput').value = ''; renderPackages();" class="mt-4 text-purple-primary hover:text-white transition-colors">
                    ${currentLanguage === 'th' ? 'ดูทั้งหมด' : 'Clear Filters'}
                </button>
            </div>
        `;
    } else {
        container.innerHTML = showing.map(renderPackageCard).join('');
    }

    const loadMoreBtn = document.getElementById('loadMoreBtn');
    if (loadMoreBtn) {
        if (displayedPackages >= filtered.length || filtered.length === 0) {
            loadMoreBtn.style.display = 'none';
        } else {
            loadMoreBtn.style.display = 'block';
            loadMoreBtn.textContent = currentLanguage === 'th' ? 'ดูเพิ่มเติม' : 'Load More';
        }
    }
}

function renderPackageCard(p) {
    const title = currentLanguage === 'th' && p.titleTh ? p.titleTh : p.title;
    const canAfford = walletData.totalPoints >= p.price;
    const t = translations[currentLanguage];
    const btnText = canAfford ? t.btn_book : t.btn_not_enough;

    return `
        <div onclick="window.location.href='details.html?id=${p.id}'" class="glass-card rounded-2xl overflow-hidden group cursor-pointer hover:-translate-y-2 transition-all duration-300 border border-white/10 hover:border-purple-primary/50 relative">
            <div class="relative h-48 overflow-hidden">
                <img src="${p.image}" alt="${title}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500">
                <div class="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-60"></div>
                ${canAfford ? '' : '<div class="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs text-white/60"><i class="fas fa-lock mr-1"></i>Locked</div>'}
            </div>
            
            <div class="p-5">
                <div class="flex justify-between items-start mb-2">
                    <span class="text-xs font-medium text-purple-primary tracking-wider uppercase">${currentLanguage === 'th' && p.categoryTh ? p.categoryTh : p.category}</span>
                    <div class="flex items-center gap-1 text-yellow-400 text-xs">
                        <i class="fas fa-star"></i>
                        <span>${p.rating}</span>
                    </div>
                </div>
                
                <h3 class="font-semibold text-lg mb-1 group-hover:text-purple-primary transition-colors line-clamp-2">${title}</h3>
                <p class="text-white/50 text-sm mb-4 line-clamp-1">${currentLanguage === 'th' && p.subtitleTh ? p.subtitleTh : p.subtitle}</p>
                
                <div class="flex items-center justify-between mt-auto">
                    <div class="flex items-center gap-2">
                        <img src="images/points_icon_v2.png?v=999" alt="Points" class="w-6 h-6 object-contain">
                        <span class="font-bold text-lg">${p.price}</span>
                        <span class="text-xs text-white/50">RDS</span>
                    </div>
                    
                    <button onclick="event.stopPropagation(); bookPackage(${p.id})" class="px-4 py-2 rounded-xl ${canAfford ? 'border border-purple-primary/50 text-purple-primary hover:bg-purple-primary hover:text-white' : 'bg-white/10 text-white/40 cursor-not-allowed'} transition-all duration-300 text-sm font-medium" ${!canAfford ? 'disabled' : ''}>
                        ${btnText}
                    </button>
                </div>
            </div>
        </div>
    `;
}

function renderFooter() {
    const t = translations[currentLanguage];
    const footerGrid = document.getElementById('footerGrid');
    if (!footerGrid) return;

    let html = `
        <div class="col-span-2">
            <a href="#" class="flex items-center gap-3 mb-4">
                <img src="images/logo_v4.png" alt="Flips id" class="h-16 w-auto hover:opacity-80 transition-opacity duration-300">
            </a>
            <p class="text-white/50 text-sm mb-4 max-w-xs" data-i18n="footer_about">${t.footer_about}</p>
            <div class="flex gap-2">
                ${mockData.socialLinks.map(l => `<a href="${l.url}" class="w-9 h-9 rounded-lg bg-white/5 hover:bg-purple-primary/20 border border-white/10 hover:border-purple-primary flex items-center justify-center text-white/60 hover:text-purple-primary transition-all duration-300"><i class="fab ${l.icon} text-sm"></i></a>`).join('')}
            </div>
        </div>
    `;

    html += mockData.footerSections.map(s => `
        <div>
            <h4 class="font-semibold mb-4 text-white">${currentLanguage === 'th' ? s.titleTh : s.title}</h4>
            <ul class="space-y-2">
                ${s.links.map(l => {
        return `<li><a href="#" class="text-white/50 hover:text-purple-primary transition-colors text-sm">${l}</a></li>`;
    }).join('')}
            </ul>
        </div>
    `).join('');

    footerGrid.innerHTML = html;
}

// ============================================
// ACTION HANDLERS
// ============================================

function setFilter(filterId) {
    currentFilter = filterId;
    displayedPackages = 8;
    renderFilterTabs();
    renderPackages();
}

function sortPackages() { renderPackages(); }

function searchPackages() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    if (!query) { renderPackages(); return; }
    const container = document.getElementById('packagesGrid');
    const filtered = mockData.packages.filter(p =>
        p.title.toLowerCase().includes(query) ||
        p.subtitle.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query)
    );
    container.innerHTML = filtered.map(renderPackageCard).join('');
    document.getElementById('packageCount').textContent = filtered.length;
}

function loadMore() {
    displayedPackages += 4;
    renderPackages();
}

function bookPackage(packageId) {
    // This function for Quick Book from Index
    window.location.href = `details.html?id=${packageId}`;
}

// ============================================
// INIT
// ============================================

// ============================================
// GLOBAL VARIABLES
// ============================================
// pendingShippingPackage is declared at the top of the file

// ============================================
// MODAL & UI FUNCTIONS
// ============================================

// Function openWallet removed (present in utils.js)
// Function openMyVouchers removed (present in utils.js)
// Function openProfile removed (present in utils.js)

function init() {
    initWalletData();
    renderHero();
    renderFilterTabs();
    renderPackages();
    renderStats(); // Added
    renderFooter();

    updateContentLanguage();

    // Initial Render for empty states or specialized lists
    // renderVouchers(); // load on open
}

// ============================================
// RENDER FUNCTIONS (Additional)
// ============================================

function renderStats() {
    const statsGrid = document.getElementById('statsGrid');
    if (statsGrid && mockData.stats) {
        statsGrid.innerHTML = mockData.stats.map(stat =>
            `<div class="text-center"><div class="text-4xl md:text-5xl font-bold gradient-text mb-2">${stat.value}</div><p class="text-white/60">${stat.label}</p></div>`
        ).join('');
    }
}

// Function renderProfile removed (present in utils.js)
// Function renderVouchers removed (present in utils.js)

// ============================================
// BOOKING & SHIPPING
// ============================================

function bookPackage(packageId) {
    const pkg = mockData.packages.find(p => p.id === packageId);
    if (!pkg) return;

    if (walletData.totalPoints < pkg.price) {
        showToast('Insufficient points!', 'error');
        return;
    }

    if (pkg.category === 'Goods' || pkg.isPhysical) {
        pendingShippingPackage = pkg;
        document.getElementById('shippingProductImage').src = pkg.image;
        document.getElementById('shippingProductName').textContent = pkg.title;
        document.getElementById('shippingProductPrice').textContent = pkg.price + ' RDS';
        openModal('shippingModal');
    } else {
        completeBooking(pkg);
    }
}

function completeBooking(pkg) {
    const voucherCode = 'CLT-' + Date.now().toString(36).toUpperCase();
    const voucher = { ...pkg, code: voucherCode, bookedAt: new Date().toISOString(), used: false };

    walletData.totalPoints -= pkg.price;
    walletData.transactions.unshift({ type: 'spend', amount: -pkg.price, description: pkg.title, date: new Date().toISOString().split('T')[0] });

    userVouchers.push(voucher);
    localStorage.setItem('userVouchers', JSON.stringify(userVouchers));
    localStorage.setItem('walletData', JSON.stringify(walletData));

    updatePointsDisplay();
    renderPackages();
    document.getElementById('bookingMessage').textContent = `Success! Used ${pkg.price} RDS.`;
    openModal('bookingModal');
}

function submitShipping(e) {
    e.preventDefault();
    if (!pendingShippingPackage) return;
    const pkg = pendingShippingPackage;

    const shippingInfo = {
        firstName: document.getElementById('shipFirstName').value,
        lastName: document.getElementById('shipLastName').value,
        phone: document.getElementById('shipPhone').value,
        address: document.getElementById('shipAddress').value,
        notes: document.getElementById('shipNotes')?.value || ''
    };

    walletData.totalPoints -= pkg.price;
    walletData.transactions.unshift({ type: 'spend', amount: -pkg.price, description: pkg.title + ' (Shipped)', date: new Date().toISOString().split('T')[0] });

    const orderId = 'ORD-' + Math.floor(Math.random() * 1000000);
    const order = { ...pkg, orderId, shippingInfo, isShipped: true, orderedAt: new Date().toISOString(), status: 'processing' };
    userVouchers.push(order);
    localStorage.setItem('userVouchers', JSON.stringify(userVouchers));
    localStorage.setItem('walletData', JSON.stringify(walletData));

    updatePointsDisplay();
    renderPackages();
    closeModal('shippingModal');

    // Populate success modal
    const orderIdEl = document.getElementById('shipOrderId');
    if (orderIdEl) orderIdEl.textContent = orderId;

    const orderItemEl = document.getElementById('shipOrderItem');
    if (orderItemEl) orderItemEl.textContent = pkg.title;

    const orderDateEl = document.getElementById('shipOrderDate');
    if (orderDateEl) orderDateEl.textContent = new Date().toLocaleDateString();

    const pointsUsedEl = document.getElementById('shipPointsUsed');
    if (pointsUsedEl) pointsUsedEl.textContent = pkg.price.toLocaleString() + ' RDS';

    const expectedDate = new Date();
    expectedDate.setDate(expectedDate.getDate() + 10);
    const expectedDateEl = document.getElementById('shipExpectedDate');
    if (expectedDateEl) expectedDateEl.textContent = expectedDate.toLocaleDateString();

    const shipToNameEl = document.getElementById('shipToName');
    if (shipToNameEl) shipToNameEl.textContent = shippingInfo.firstName + ' ' + shippingInfo.lastName;

    const shipToAddressEl = document.getElementById('shipToAddress');
    if (shipToAddressEl) shipToAddressEl.textContent = shippingInfo.address;

    const shipToPhoneEl = document.getElementById('shipToPhone');
    if (shipToPhoneEl) shipToPhoneEl.textContent = shippingInfo.phone;

    openModal('shippingSuccessModal');
    pendingShippingPackage = null;
}

function viewOrderDetails() {
    closeModal('shippingSuccessModal');
    openProfile();
    switchProfileTab('orders');
}

// Function showQRCode removed (present in utils.js as showVoucherQR)
// Function switchProfileTab removed (present in utils.js)
// Function openSupport removed (present in utils.js)
// Function submitSupport removed (present in utils.js)

function subscribeNewsletter(e) {
    e.preventDefault();
    showToast('Subscribed!', 'success');
}

// ============================================
// DOCUMENT READY
// ============================================

document.addEventListener('DOMContentLoaded', init);
