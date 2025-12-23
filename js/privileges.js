// ============================================
// PRIVILEGES PAGE JAVASCRIPT
// ============================================

let currentPrivilegeFilter = 'all';
let currentMainCategory = 'movie'; // 'movie' or 'game'
let displayedPrivileges = 12;

// ============================================
// INITIALIZATION
// ============================================

function initPrivilegesPage() {
    initWalletData();
    updateMainCategoryTabs();
    renderPrivilegeCategories();
    renderPrivilegeFilters();
    renderPrivilegeCards();
    updatePrivilegeStats();
    updatePointsDisplay();
    updateContentLanguage();
}

// ============================================
// MAIN CATEGORY SWITCHING
// ============================================

function switchMainCategory(category) {
    currentMainCategory = category;
    currentPrivilegeFilter = 'all'; // Reset filter when switching main category
    displayedPrivileges = 12; // Reset pagination

    updateMainCategoryTabs();
    renderPrivilegeCategories();
    renderPrivilegeCards();
}

function updateMainCategoryTabs() {
    const movieTab = document.getElementById('movieTab');
    const gameTab = document.getElementById('gameTab');
    const movieCount = document.getElementById('movieCount');
    const gameCount = document.getElementById('gameCount');

    if (!movieTab || !gameTab) return;

    // Get counts for each main category
    const packages = typeof getActivePackages === 'function' ? getActivePackages() : privilegePackages;
    const moviePackages = packages.filter(p => {
        const mainCat = getMainCategoryFromCategory(p.category);
        return mainCat === 'movie';
    });
    const gamePackages = packages.filter(p => {
        const mainCat = getMainCategoryFromCategory(p.category);
        return mainCat === 'game';
    });

    // Update counts
    if (movieCount) movieCount.textContent = moviePackages.length;
    if (gameCount) gameCount.textContent = gamePackages.length;

    // Update styles using class manipulation for underline tabs
    if (currentMainCategory === 'movie') {
        movieTab.className = 'main-category-tab flex items-center gap-2 pb-3 font-semibold text-base transition-all duration-300 border-b-2 border-orange-500 text-slate-900 active';
        movieTab.querySelector('i').className = 'fas fa-film text-orange-500';
        if (movieCount) movieCount.className = 'px-2 py-0.5 rounded-full bg-orange-100 text-orange-600 text-xs font-bold';

        gameTab.className = 'main-category-tab flex items-center gap-2 pb-3 font-semibold text-base transition-all duration-300 border-b-2 border-transparent text-slate-400 hover:text-slate-600';
        gameTab.querySelector('i').className = 'fas fa-gamepad';
        if (gameCount) gameCount.className = 'px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 text-xs font-bold';
    } else {
        gameTab.className = 'main-category-tab flex items-center gap-2 pb-3 font-semibold text-base transition-all duration-300 border-b-2 border-purple-500 text-slate-900 active';
        gameTab.querySelector('i').className = 'fas fa-gamepad text-purple-500';
        if (gameCount) gameCount.className = 'px-2 py-0.5 rounded-full bg-purple-100 text-purple-600 text-xs font-bold';

        movieTab.className = 'main-category-tab flex items-center gap-2 pb-3 font-semibold text-base transition-all duration-300 border-b-2 border-transparent text-slate-400 hover:text-slate-600';
        movieTab.querySelector('i').className = 'fas fa-film';
        if (movieCount) movieCount.className = 'px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 text-xs font-bold';
    }
}

// ============================================
// RENDER FUNCTIONS
// ============================================

// Count items per category using dynamic data
function getCategoryCounts() {
    const counts = {};
    const packages = getActivePackages();

    // Initialize
    privilegeCategories.forEach(cat => counts[cat.id] = 0);

    // Count only packages in current main category
    packages.forEach(p => {
        const pMainCat = getMainCategoryFromCategory(p.category);
        if (currentMainCategory === 'movie' && pMainCat === 'movie') {
            if (counts[p.category] !== undefined) {
                counts[p.category]++;
            }
        } else if (currentMainCategory === 'game' && pMainCat === 'game') {
            if (counts[p.category] !== undefined) {
                counts[p.category]++;
            }
        }
    });

    // Count 'all' for current main category
    counts['all'] = packages.filter(p => {
        const pMainCat = getMainCategoryFromCategory(p.category);
        return pMainCat === currentMainCategory;
    }).length;

    return counts;
}


function renderPrivilegeCategories() {
    const container = document.getElementById('categoriesGrid');
    if (!container) return;

    const counts = getCategoryCounts();

    // Filter categories by current main category
    const filteredCategories = privilegeCategories.filter(cat =>
        cat.mainCategory === 'all' || cat.mainCategory === currentMainCategory
    );

    // Render category buttons dynamically
    container.innerHTML = filteredCategories.map(cat => {
        const isActive = currentPrivilegeFilter === cat.id;
        const label = currentLanguage === 'th' ? cat.labelTh : cat.label;
        const count = counts[cat.id] || 0;

        return `
            <button onclick="filterPrivileges('${cat.id}')"
                class="px-6 py-2 rounded-full border transition-all duration-300 whitespace-nowrap flex items-center gap-2 hover:scale-105"
                style="${isActive
                ? 'background:#003366; color:white; border-color:#003366;'
                : 'background:white; color:#334155; border-color:#e2e8f0;'}">
                <i class="fas ${cat.icon}"></i>
                ${label}
                <span class="px-2 py-0.5 rounded-full text-xs ${isActive ? 'bg-white/20' : 'bg-gray-100'}">${count}</span>
            </button>
        `;
    }).join('');
}


function renderPrivilegeFilters() {
    const container = document.getElementById('privilegeFilters');
    if (!container) return;

    const counts = getCategoryCounts();

    container.innerHTML = privilegeCategories.map(cat => `
        <button 
            onclick="filterPrivileges('${cat.id}')"
            class="privilege-filter-btn px-5 py-2.5 rounded-full border transition-all duration-300 whitespace-nowrap flex items-center gap-2"
            style="${currentPrivilegeFilter === cat.id
            ? 'background:#003366; color:white; border-color:#003366;'
            : 'background:white; color:#334155; border-color:#e2e8f0;'}"
        >
            <i class="fas ${cat.icon}"></i>
            <span>${currentLanguage === 'th' ? cat.labelTh : cat.label}</span>
            <span class="px-2 py-0.5 rounded-full text-xs" style="${currentPrivilegeFilter === cat.id ? 'background:rgba(255,255,255,0.2);' : 'background:#f1f5f9;'}">${counts[cat.id]}</span>
        </button>
    `).join('');
}

function renderPrivilegeCards() {
    const container = document.getElementById('privilegesGrid');
    if (!container) return;

    // Show Skeleton if explicitly requested or on first load (detected by empty content?)
    // For a smoother UX, we'll assume this function is called when we want to refresh data
    showSkeleton('privilegesGrid', 8, '350px');

    // Simulate network delay for professional feel (remove this in production if real API is fast)
    setTimeout(() => {
        executeRenderPrivilegeCards(container);
    }, 600);
}

function executeRenderPrivilegeCards(container) {

    let filtered = getActivePackages();

    // First filter by main category (movie or game)
    filtered = filtered.filter(p => {
        const pMainCat = getMainCategoryFromCategory(p.category);
        return pMainCat === currentMainCategory;
    });

    // Then filter by sub-category
    if (currentPrivilegeFilter !== 'all') {
        filtered = filtered.filter(p => p.category === currentPrivilegeFilter);
    }

    // Sort by Price: High to Low
    filtered.sort((a, b) => b.price - a.price);

    const showing = filtered.slice(0, displayedPrivileges);
    const t = translations[currentLanguage] || translations['en'];

    if (filtered.length === 0) {
        container.innerHTML = `
            <div class="col-span-full text-center py-16">
                <div class="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i class="fas fa-search text-3xl text-white/30"></i>
                </div>
                <h3 class="text-xl font-medium mb-2">${t.no_privileges_found || (currentLanguage === 'th' ? 'ไม่พบสิทธิพิเศษ' : 'No privileges found')}</h3>
                <p class="text-white/50">${t.try_different_category || (currentLanguage === 'th' ? 'ลองเลือกหมวดหมู่อื่น' : 'Try selecting a different category')}</p>
                <button onclick="filterPrivileges('all')" class="mt-4 text-blue-primary hover:text-white transition-colors">
                    ${t.view_all || (currentLanguage === 'th' ? 'ดูทั้งหมด' : 'View All')}
                </button>
            </div>
        `;
    } else {
        container.innerHTML = showing.map(renderPrivilegeCard).join('');

        // Re-initialize effects for new elements
        if (window.initTiltEffect) window.initTiltEffect();

        // Manually trigger reveal for smoother UX without waiting for scroll
        setTimeout(() => {
            const newCards = container.querySelectorAll('.reveal');
            newCards.forEach((card, index) => {
                setTimeout(() => card.classList.add('active'), index * 50);
            });
        }, 50);
    }

    // Update count display
    const countEl = document.getElementById('privilegeCount');
    if (countEl) {
        countEl.textContent = filtered.length;
    }

    // Load more button
    const loadMoreBtn = document.getElementById('loadMorePrivilegesBtn');
    if (loadMoreBtn) {
        if (displayedPrivileges >= filtered.length || filtered.length === 0) {
            loadMoreBtn.style.display = 'none';
        } else {
            loadMoreBtn.style.display = 'block';
        }
    }
}

function renderPrivilegeCard(p) {
    const title = currentLanguage === 'th' && p.titleTh ? p.titleTh : p.title;
    const subtitle = currentLanguage === 'th' && p.subtitleTh ? p.subtitleTh : p.subtitle;
    const categoryLabel = currentLanguage === 'th' && p.categoryLabelTh ? p.categoryLabelTh : p.categoryLabel;
    const category = privilegeCategories.find(c => c.id === p.category);
    const t = translations[currentLanguage] || translations['en'];

    // Check payment mode and calculate affordability
    const payMode = typeof getPaymentMode === 'function' ? getPaymentMode() : 'points';
    const isMovie = p.type === 'movie';
    const tokenCost = p.tokenPrice || Math.ceil(p.price / 500);

    let canAfford;
    if (payMode === 'points') {
        canAfford = walletData.totalPoints >= p.price;
    } else {
        const currentTokens = isMovie ? walletData.movieTokens : walletData.gameTokens;
        canAfford = currentTokens >= tokenCost;
    }

    const tierBadge = p.tier === 'gold'
        ? '<span class="absolute top-3 left-3 px-2 py-1 rounded-full bg-yellow-500/20 text-yellow-400 text-xs font-medium backdrop-blur-md border border-yellow-500/30"><i class="fas fa-crown mr-1"></i>Gold</span>'
        : p.tier === 'silver'
            ? '<span class="absolute top-3 left-3 px-2 py-1 rounded-full bg-gray-400/20 text-gray-300 text-xs font-medium backdrop-blur-md border border-gray-400/30"><i class="fas fa-gem mr-1"></i>Silver</span>'
            : '';

    // Price display based on payment mode
    const priceDisplay = payMode === 'points'
        ? `<img src="../images/flips_token.png" alt="Flips" class="w-6 h-6 object-contain drop-shadow-sm">
           <span class="font-extrabold text-xl font-display text-slate-800">${p.price.toLocaleString()}</span>
           <span class="text-xs text-slate-400 font-bold">Flips</span>`
        : `<i class="fas fa-ticket-alt text-lg ${isMovie ? 'text-orange-500' : 'text-purple-500'}"></i>
           <span class="font-extrabold text-xl font-display text-slate-800">${tokenCost}</span>
           <span class="text-xs text-slate-400 font-bold">Token</span>`;

    return `
        <div onclick="window.location.href='privilege-detail.html?id=${p.id}'" 
             class="privilege-card glass-card-premium tilt-card reveal rounded-2xl overflow-visible group cursor-pointer relative h-full flex flex-col">
            <div class="tilt-content h-full flex flex-col transform-style-3d">
                <div class="relative h-48 overflow-hidden rounded-t-2xl flex-shrink-0">
                    <img src="${p.image}" alt="${title}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                    <div class="absolute inset-0 bg-primary items-center justify-center" style="display: none;">
                        <i class="fas ${category ? category.icon : 'fa-gift'} text-6xl text-white/30"></i>
                    </div>
                    <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80"></div>
                    ${tierBadge}
                    ${!canAfford ? `<div class="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs text-white/60 border border-white/10"><i class="fas fa-lock mr-1"></i>${t.status_locked || 'Locked'}</div>` : ''}
                    ${p.isPhysical ? `<div class="absolute bottom-3 left-3 bg-blue-500/80 backdrop-blur-md px-2 py-1 rounded-full text-xs text-white border border-blue-400/30"><i class="fas fa-truck mr-1"></i>${t.status_physical || 'Physical'}</div>` : ''}
                </div>
                
                <div class="p-5 flex flex-col flex-grow">
                    <div class="flex justify-between items-start mb-2">
                        <span class="text-xs font-bold text-secondary tracking-widest uppercase">${categoryLabel}</span>
                    </div>
                    
                    <h3 class="font-bold text-lg mb-1 group-hover:text-secondary-dark transition-colors line-clamp-2 leading-tight">${title}</h3>
                    <p class="text-slate-500 text-sm mb-4 line-clamp-1">${subtitle}</p>
                    
                    <div class="flex items-center justify-between mt-auto pt-4 border-t border-slate-100">
                        <div class="flex items-center gap-2">
                            ${priceDisplay}
                        </div>
                        
                        <button onclick="event.stopPropagation(); redeemPrivilegeWithMode ? redeemPrivilegeWithMode(${p.id}) : redeemPrivilege(${p.id})" 
                                class="btn-shine px-4 py-2 rounded-xl ${canAfford
            ? 'bg-gradient-to-r from-primary to-primary-light text-white shadow-lg hover:shadow-secondary/50 hover:scale-105'
            : 'bg-gray-100 text-gray-400 cursor-not-allowed'} transition-all duration-300 text-sm font-bold tracking-wide" 
                                ${!canAfford ? 'disabled' : ''}>
                            ${canAfford
            ? (t.btn_redeem || (currentLanguage === 'th' ? 'แลก' : 'Redeem'))
            : (t.btn_not_enough || (currentLanguage === 'th' ? 'ไม่พอ' : 'Not enough'))}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function updatePrivilegeStats() {
    const totalEl = document.getElementById('totalPrivileges');
    const redeemedEl = document.getElementById('redeemedPrivileges');
    const availableEl = document.getElementById('availablePrivileges');

    if (totalEl) totalEl.textContent = getActivePackages().length;

    // Get redeemed privileges from localStorage
    const redeemed = userVouchers.filter(v => v.category && privilegeCategories.some(c => c.id === v.category)).length;
    if (redeemedEl) redeemedEl.textContent = redeemed;

    // Calculate affordable privileges
    const affordable = getActivePackages().filter(p => walletData.totalPoints >= p.price).length;
    if (availableEl) availableEl.textContent = affordable;
}

// ============================================
// FILTER & SEARCH
// ============================================

function filterPrivileges(categoryId) {
    currentPrivilegeFilter = categoryId;
    displayedPrivileges = 12;
    renderPrivilegeCategories(); // Update the category pills
    renderPrivilegeFilters();
    renderPrivilegeCards();

    // Scroll to privileges section
    const privilegesSection = document.getElementById('privilegesSection');
    if (privilegesSection) {
        privilegesSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

function searchPrivileges() {
    const query = document.getElementById('privilegeSearchInput')?.value.toLowerCase() || '';
    if (!query) {
        renderPrivilegeCards();
        return;
    }

    const container = document.getElementById('privilegesGrid');
    if (!container) return;

    const packages = getActivePackages();
    const filtered = packages.filter(p =>
        p.title.toLowerCase().includes(query) ||
        p.titleTh.toLowerCase().includes(query) ||
        p.subtitle.toLowerCase().includes(query) ||
        p.categoryLabel.toLowerCase().includes(query) ||
        p.categoryLabelTh.toLowerCase().includes(query)
    );

    container.innerHTML = filtered.map(renderPrivilegeCard).join('');

    const countEl = document.getElementById('privilegeCount');
    if (countEl) countEl.textContent = filtered.length;
}

function loadMorePrivileges() {
    displayedPrivileges = 9999;
    renderPrivilegeCards();
    // Hide button after showing all
    const loadMoreBtn = document.getElementById('loadMorePrivilegesBtn');
    if (loadMoreBtn) loadMoreBtn.style.display = 'none';
}

// ============================================
// PRIVILEGE DETAIL MODAL
// ============================================

function openPrivilegeDetail(privilegeId) {
    const privilege = privilegePackages.find(p => p.id === privilegeId);
    if (!privilege) return;

    const modal = document.getElementById('privilegeDetailModal');
    if (!modal) return;

    const title = currentLanguage === 'th' && privilege.titleTh ? privilege.titleTh : privilege.title;
    const subtitle = currentLanguage === 'th' && privilege.subtitleTh ? privilege.subtitleTh : privilege.subtitle;
    const description = currentLanguage === 'th' && privilege.descriptionTh ? privilege.descriptionTh : privilege.description;
    const conditions = currentLanguage === 'th' && privilege.conditionsTh ? privilege.conditionsTh : privilege.conditions;
    const categoryLabel = currentLanguage === 'th' && privilege.categoryLabelTh ? privilege.categoryLabelTh : privilege.categoryLabel;
    const category = privilegeCategories.find(c => c.id === privilege.category);
    const canAfford = walletData.totalPoints >= privilege.price;

    document.getElementById('detailTitle').textContent = title;
    document.getElementById('detailSubtitle').textContent = subtitle;
    document.getElementById('detailCategory').textContent = categoryLabel;
    document.getElementById('detailDescription').textContent = description;
    document.getElementById('detailPrice').textContent = privilege.price.toLocaleString();
    // Ratings removed

    // Category icon
    const iconContainer = document.getElementById('detailCategoryIcon');
    if (iconContainer && category) {
        iconContainer.className = `w-16 h-16 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center`;
        iconContainer.innerHTML = `<i class="fas ${category.icon} text-2xl text-white"></i>`;
    }

    // Conditions list
    const conditionsList = document.getElementById('detailConditions');
    if (conditionsList && conditions) {
        conditionsList.innerHTML = conditions.map(c => `
            <li class="flex items-start gap-2">
                <i class="fas fa-check-circle text-green-400 mt-1 flex-shrink-0"></i>
                <span>${c}</span>
            </li>
        `).join('');
    }

    // Redeem button
    const redeemBtn = document.getElementById('detailRedeemBtn');
    if (redeemBtn) {
        redeemBtn.className = `w-full py-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all ${canAfford ? 'btn-gradient hover:scale-105' : 'bg-white/10 text-white/40 cursor-not-allowed'}`;
        redeemBtn.disabled = !canAfford;
        redeemBtn.innerHTML = canAfford
            ? `<i class="fas fa-gift"></i> ${currentLanguage === 'th' ? 'แลกสิทธิพิเศษนี้' : 'Redeem This Privilege'}`
            : `<i class="fas fa-lock"></i> ${currentLanguage === 'th' ? 'คะแนนไม่เพียงพอ' : 'Insufficient Points'}`;
        redeemBtn.onclick = () => redeemPrivilege(privilege.id);
    }

    // Event date if applicable
    const eventDateSection = document.getElementById('detailEventDate');
    if (eventDateSection) {
        if (privilege.eventDate) {
            eventDateSection.style.display = 'block';
            document.getElementById('detailEventDateValue').textContent = new Date(privilege.eventDate).toLocaleDateString(currentLanguage === 'th' ? 'th-TH' : 'en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
        } else {
            eventDateSection.style.display = 'none';
        }
    }

    // Venue if applicable
    const venueSection = document.getElementById('detailVenue');
    if (venueSection) {
        if (privilege.venue) {
            venueSection.style.display = 'block';
            document.getElementById('detailVenueValue').textContent = privilege.venue;
        } else {
            venueSection.style.display = 'none';
        }
    }
    openModal('privilegeDetailModal');
}

// ============================================
// DATA HELPER
// ============================================

function getActivePackages() {
    // Merge static data with Admin edits (localStorage)
    const custom = JSON.parse(localStorage.getItem('customPrivileges') || '[]');
    const deleted = JSON.parse(localStorage.getItem('deletedPrivileges') || '[]');

    // Safety check if privilegePackages is not loaded
    const staticData = (typeof privilegePackages !== 'undefined') ? privilegePackages : [];

    const staticFiltered = staticData.filter(p => !deleted.includes(p.id));
    return [...staticFiltered, ...custom];
}

// ============================================
// REDEMPTION
// ============================================

function redeemPrivilege(privilegeId) {
    const privilege = privilegePackages.find(p => p.id === privilegeId);
    if (!privilege) return;

    if (walletData.totalPoints < privilege.price) {
        showToast(currentLanguage === 'th' ? 'คะแนนไม่เพียงพอ!' : 'Insufficient points!', 'error');
        return;
    }

    if (privilege.isPhysical) {
        // Show shipping modal for physical items
        window.pendingShippingPackage = privilege;
        document.getElementById('shippingProductImage').src = privilege.image || '';
        document.getElementById('shippingProductName').textContent = currentLanguage === 'th' ? privilege.titleTh : privilege.title;
        document.getElementById('shippingProductPrice').textContent = privilege.price.toLocaleString() + ' Flips';
        closeModal('privilegeDetailModal');
        openModal('shippingModal');
    } else {
        completePrivilegeRedemption(privilege);
    }
}

function completePrivilegeRedemption(privilege) {
    const voucherCode = 'PVL-' + Date.now().toString(36).toUpperCase();
    const title = currentLanguage === 'th' ? privilege.titleTh : privilege.title;

    // Create voucher
    const voucher = {
        ...privilege,
        code: voucherCode,
        bookedAt: new Date().toISOString(),
        used: false,
        type: 'privilege'
    };

    // Deduct points
    walletData.totalPoints -= privilege.price;
    walletData.transactions.unshift({
        type: 'spend',
        amount: -privilege.price,
        description: title,
        date: new Date().toISOString().split('T')[0]
    });

    // Save voucher
    userVouchers.push(voucher);
    localStorage.setItem('userVouchers', JSON.stringify(userVouchers));
    localStorage.setItem('walletData', JSON.stringify(walletData));

    // Update UI
    updatePointsDisplay();
    updatePrivilegeStats();
    renderPrivilegeCards();

    // Close detail modal if open
    closeModal('privilegeDetailModal');

    // Show success
    showRedemptionSuccess(privilege, voucherCode);
}

function showRedemptionSuccess(privilege, voucherCode) {
    const title = currentLanguage === 'th' ? privilege.titleTh : privilege.title;

    document.getElementById('bookingMessage').textContent = currentLanguage === 'th'
        ? `สำเร็จ! ใช้ ${privilege.price.toLocaleString()} Flips สำหรับ "${title}"`
        : `Success! Used ${privilege.price.toLocaleString()} Flips for "${title}"`;

    // Store current voucher code for QR generation
    window.currentVoucherCode = voucherCode;
    window.currentVoucherName = title;

    openModal('bookingModal');
}

// Override showQRCode for privilege vouchers
function showPrivilegeQRCode() {
    if (!window.currentVoucherCode) return;

    const qrContainer = document.getElementById('qrcode');
    qrContainer.innerHTML = '';

    new QRCode(qrContainer, {
        text: window.currentVoucherCode,
        width: 180,
        height: 180,
        colorDark: '#000000',
        colorLight: '#ffffff'
    });

    document.getElementById('qrVoucherName').textContent = window.currentVoucherName;
    document.getElementById('qrVoucherCode').textContent = window.currentVoucherCode;

    closeModal('bookingModal');
    openModal('qrModal');
}

// ============================================
// DOCUMENT READY
// ============================================

document.addEventListener('DOMContentLoaded', initPrivilegesPage);
