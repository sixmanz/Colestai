// ============================================
// PRIVILEGES PAGE JAVASCRIPT
// ============================================

let currentPrivilegeFilter = 'all';
let currentMainCategory = 'flipsid'; // 'flipsid', 'colestai', 'ctrlg', 'tbf'
let displayedPrivileges = 12;

// ============================================
// INITIALIZATION
// ============================================

function initPrivilegesPage() {
    initWalletData();
    updateMainCategoryTabs();
    updateCoinBalanceDisplay();
    updateHeaderCoinDisplay(); // Ensure header shows correct coin type on load
    renderPrivilegeCategories();
    renderPrivilegeFilters();
    renderPrivilegeCards();
    updatePrivilegeStats();
    updatePointsDisplay();
    updateContentLanguage();
}

// ============================================
// MAIN CATEGORY SWITCHING (4 TABS)
// ============================================

function switchMainCategory(category) {
    currentMainCategory = category;
    currentPrivilegeFilter = 'all'; // Reset filter when switching main category
    displayedPrivileges = 12; // Reset pagination

    updateMainCategoryTabs();
    updateCoinBalanceDisplay();
    updateHeaderCoinDisplay(); // Update header coin balance
    renderPrivilegeCategories();
    renderPrivilegeCards();
}

// Update header coin balance based on current category
function updateHeaderCoinDisplay() {
    const headerPoints = document.getElementById('headerPoints');
    const headerWalletLink = headerPoints?.closest('a');

    if (!headerPoints) return;

    const coinInfo = typeof getCoinBalanceByCategory === 'function'
        ? getCoinBalanceByCategory(currentMainCategory)
        : { balance: walletData.totalPoints, name: 'Flips' };

    // Update header balance
    if (currentMainCategory === 'ctrlg') {
        // For CTRL G, show total of all team coins
        const totalTeamCoins = Object.values(walletData.teamCoins || {}).reduce((a, b) => a + b, 0);
        headerPoints.textContent = totalTeamCoins.toLocaleString();

        // Update the label next to the balance
        const headerLabel = headerPoints.nextElementSibling;
        if (headerLabel) headerLabel.textContent = 'Team';
    } else if (currentMainCategory === 'tbf') {
        headerPoints.textContent = (walletData.tbfCoins || 0).toLocaleString();
        const headerLabel = headerPoints.nextElementSibling;
        if (headerLabel) headerLabel.textContent = 'TBF';
    } else {
        // FLIPS ID and Colestai use Flips coins
        headerPoints.textContent = walletData.totalPoints.toLocaleString();
        const headerLabel = headerPoints.nextElementSibling;
        if (headerLabel) headerLabel.textContent = 'Flips';
    }
}

function updateMainCategoryTabs() {
    // Get both desktop and mobile tab containers
    const desktopContainer = document.getElementById('mainCategoryTabs');
    const mobileContainer = document.getElementById('mainCategoryTabsMobile');

    const categoryStyles = {
        'flipsid': { active: 'bg-blue-primary text-white shadow-md', inactive: 'text-slate-500 hover:text-blue-600 hover:bg-blue-50' },
        'colestai': { active: 'bg-amber-500 text-white shadow-md', inactive: 'text-slate-500 hover:text-amber-600 hover:bg-amber-50' },
        'ctrlg': { active: 'bg-purple-500 text-white shadow-md', inactive: 'text-slate-500 hover:text-purple-600 hover:bg-purple-50' },
        'tbf': { active: 'bg-cyan-500 text-white shadow-md', inactive: 'text-slate-500 hover:text-cyan-600 hover:bg-cyan-50' }
    };

    // Update tabs in both containers
    [desktopContainer, mobileContainer].forEach(container => {
        if (!container) return;
        const tabs = container.querySelectorAll('.main-tab');
        const isMobile = container.id === 'mainCategoryTabsMobile';

        tabs.forEach(tab => {
            const category = tab.dataset.category;
            const styles = categoryStyles[category];
            if (!styles) return;

            // Use appropriate base classes for desktop vs mobile
            const baseClasses = isMobile
                ? 'main-tab flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300 whitespace-nowrap'
                : 'main-tab flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300';

            if (category === currentMainCategory) {
                tab.className = `${baseClasses} ${styles.active} active`;
            } else {
                tab.className = `${baseClasses} ${styles.inactive}`;
            }
        });
    });
}

// Update coin balance display based on current category
function updateCoinBalanceDisplay() {
    const flipsCard = document.getElementById('flipsBalanceCard');
    const teamCoinsDisplay = document.getElementById('teamCoinsDisplay');
    const mainCoinBalance = document.getElementById('mainCoinBalance');
    const mainCoinName = document.getElementById('mainCoinName');

    if (!flipsCard || !teamCoinsDisplay) return;

    // Get coin info based on category
    const coinInfo = typeof getCoinBalanceByCategory === 'function'
        ? getCoinBalanceByCategory(currentMainCategory)
        : { balance: walletData.totalPoints, name: 'Flips' };

    if (currentMainCategory === 'ctrlg') {
        // Show team coins for CTRL G
        flipsCard.classList.add('hidden');
        teamCoinsDisplay.classList.remove('hidden');

        // Render team coins
        if (typeof gameTeams !== 'undefined') {
            teamCoinsDisplay.innerHTML = gameTeams.map(team => {
                const balance = walletData.teamCoins ? (walletData.teamCoins[team.id] || 0) : 0;
                const gradientColors = {
                    'phoenix': 'from-red-50 to-orange-50 border-red-100',
                    'shadow': 'from-gray-50 to-slate-100 border-gray-200',
                    'thunder': 'from-yellow-50 to-amber-50 border-yellow-100',
                    'dragon': 'from-green-50 to-emerald-50 border-green-100'
                };
                const textColors = {
                    'phoenix': 'text-red-600',
                    'shadow': 'text-gray-600',
                    'thunder': 'text-yellow-600',
                    'dragon': 'text-green-600'
                };
                return `
                    <div class="bg-gradient-to-r ${gradientColors[team.id] || 'from-gray-50 to-gray-100 border-gray-100'} rounded-xl p-3 border">
                        <div class="flex items-center gap-2">
                            <div class="w-8 h-8 rounded-lg bg-gradient-to-br ${team.color} flex items-center justify-center">
                                <i class="fas ${team.icon} text-white text-xs"></i>
                            </div>
                            <div class="flex-1 min-w-0">
                                <p class="text-slate-600 text-[10px] truncate">${team.nameTh || team.name}</p>
                                <div class="flex items-baseline gap-1">
                                    <span class="text-lg font-bold text-slate-900">${balance.toLocaleString()}</span>
                                    <span class="${textColors[team.id] || 'text-gray-500'} font-medium text-[10px]">Coins</span>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            }).join('');
        }
    } else {
        // Show single coin type for other categories
        flipsCard.classList.remove('hidden');
        teamCoinsDisplay.classList.add('hidden');

        if (mainCoinBalance) mainCoinBalance.textContent = coinInfo.balance.toLocaleString();
        if (mainCoinName) {
            mainCoinName.textContent = currentMainCategory === 'tbf' ? 'TBF' : 'Flips';
        }

        // Update card style based on category
        const cardStyles = {
            'flipsid': 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-100',
            'colestai': 'bg-gradient-to-r from-amber-50 to-orange-50 border-amber-100',
            'tbf': 'bg-gradient-to-r from-cyan-50 to-blue-50 border-cyan-100'
        };
        flipsCard.className = `${cardStyles[currentMainCategory] || cardStyles.flipsid} rounded-xl p-4 border`;
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

    // For FLIPS ID show all, for others filter by mainCategory
    packages.forEach(p => {
        const pMainCat = getMainCategoryFromCategory(p.category);

        if (currentMainCategory === 'flipsid') {
            // Show all packages in all category count
            if (counts[p.category] !== undefined) {
                counts[p.category]++;
            }
        } else if (pMainCat === currentMainCategory) {
            if (counts[p.category] !== undefined) {
                counts[p.category]++;
            }
        }
    });

    // Count 'all' for current main category
    if (currentMainCategory === 'flipsid') {
        counts['all'] = packages.length;
    } else {
        counts['all'] = packages.filter(p => {
            const pMainCat = getMainCategoryFromCategory(p.category);
            return pMainCat === currentMainCategory;
        }).length;
    }

    return counts;
}


function renderPrivilegeCategories() {
    const container = document.getElementById('categoriesGrid');
    if (!container) return;

    const counts = getCategoryCounts();

    // Filter categories by current main category (or show all for flipsid)
    const filteredCategories = privilegeCategories.filter(cat => {
        if (cat.mainCategory === 'all') return true;
        if (currentMainCategory === 'flipsid') return true; // Show all for FLIPS ID
        return cat.mainCategory === currentMainCategory;
    });

    // Render category buttons dynamically with cleaner minimal design
    container.innerHTML = filteredCategories.map(cat => {
        const isActive = currentPrivilegeFilter === cat.id;
        const label = currentLanguage === 'th' ? cat.labelTh : cat.label;
        const count = counts[cat.id] || 0;

        return `
            <button onclick="filterPrivileges('${cat.id}')"
                class="category-filter-btn flex-shrink-0 px-4 py-2 rounded-full border transition-all duration-300 whitespace-nowrap text-sm font-medium"
                style="${isActive
                ? 'background: linear-gradient(135deg, #003366, #004488); color: white; border-color: transparent; box-shadow: 0 4px 12px rgba(0,51,102,0.25);'
                : 'background: white; color: #475569; border-color: #e2e8f0;'}">
                ${label}
                <span class="ml-1.5 px-1.5 py-0.5 rounded-full text-xs ${isActive ? 'bg-white/25 text-white' : 'bg-gray-100 text-gray-500'}">${count}</span>
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

    // Filter by main category
    if (currentMainCategory !== 'flipsid') {
        filtered = filtered.filter(p => {
            const pMainCat = getMainCategoryFromCategory(p.category);
            return pMainCat === currentMainCategory;
        });
    }

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

    // Price display based on payment mode and category
    const pMainCat = typeof getMainCategoryFromCategory === 'function' ? getMainCategoryFromCategory(p.category) : 'flipsid';

    // Get correct coin info for this privilege's category
    let coinIcon, coinName;
    if (pMainCat === 'ctrlg') {
        coinIcon = '../images/team_coin.png';
        coinName = 'Team';
    } else if (pMainCat === 'tbf') {
        coinIcon = '../images/tbf_coin.png';
        coinName = 'TBF';
    } else {
        coinIcon = '../images/flips_token.png';
        coinName = 'Flips';
    }

    const priceDisplay = payMode === 'points'
        ? `<img src="${coinIcon}" alt="${coinName}" class="w-6 h-6 object-contain drop-shadow-sm" onerror="this.src='../images/flips_token.png'">
           <span class="font-extrabold text-xl font-display text-slate-800">${p.price.toLocaleString()}</span>
           <span class="text-xs text-slate-400 font-bold">${coinName}</span>`
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
                    
                        <div class="flex items-center gap-2">
                            ${priceDisplay}
                        </div>
                        
                        <button onclick="event.stopPropagation(); typeof redeemPrivilegeWithMode === 'function' ? redeemPrivilegeWithMode(${p.id}) : redeemPrivilege(${p.id})" 
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
    const description = currentLanguage === 'th' && privilege.descriptionTh ? privilege.descriptionTh : privilege.description;
    const conditions = currentLanguage === 'th' && privilege.conditionsTh ? privilege.conditionsTh : privilege.conditions;
    const categoryLabel = currentLanguage === 'th' && privilege.categoryLabelTh ? privilege.categoryLabelTh : privilege.categoryLabel;
    const category = privilegeCategories.find(c => c.id === privilege.category);
    const canAfford = walletData.totalPoints >= privilege.price;

    // 1. Hero Image
    document.getElementById('detailImage').src = privilege.image;

    // 2. Badge & Title
    document.getElementById('detailCategoryBadge').textContent = categoryLabel;
    document.getElementById('detailTitle').textContent = title;

    // 3. Venue & Date
    const venueSection = document.getElementById('detailVenue');
    if (privilege.venue) {
        venueSection.style.display = 'flex';
        document.getElementById('detailVenueValue').textContent = privilege.venue;
    } else {
        venueSection.style.display = 'none';
    }

    const dateSection = document.getElementById('detailEventDate');
    if (privilege.eventDate) {
        dateSection.style.display = 'flex';
        document.getElementById('detailEventDateValue').textContent = new Date(privilege.eventDate).toLocaleDateString(currentLanguage === 'th' ? 'th-TH' : 'en-US', { day: 'numeric', month: 'short', year: 'numeric' });
    } else {
        dateSection.style.display = 'none';
    }

    // 4. Description
    document.getElementById('detailDescription').textContent = description;

    // 5. Conditions
    const conditionsList = document.getElementById('detailConditions');
    if (conditionsList && conditions) {
        conditionsList.innerHTML = conditions.map(c => `
            <li class="flex items-start gap-2">
                <i class="fas fa-check text-green-500 mt-1 flex-shrink-0 text-xs"></i>
                <span>${c}</span>
            </li>
        `).join('');
    }

    // 6. Price Section
    document.getElementById('detailPrice').textContent = privilege.price.toLocaleString();

    // Icon
    const iconContainer = document.getElementById('detailCoinIcon');
    if (category) {
        // Simple color mapping or default blue
        iconContainer.className = `w-10 h-10 rounded-full flex items-center justify-center text-white text-lg shadow-sm bg-gradient-to-br ${category.color || 'from-blue-500 to-blue-700'}`;
        iconContainer.innerHTML = `<i class="fas ${category.icon}"></i>`;
    }

    // 7. Redeem Button State
    const redeemBtn = document.getElementById('detailRedeemBtn');
    if (redeemBtn) {
        if (canAfford) {
            redeemBtn.className = "w-full py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white cursor-pointer";
            redeemBtn.disabled = false;
            redeemBtn.innerHTML = `<i class="fas fa-gift"></i> ${currentLanguage === 'th' ? 'แลกของรางวัล' : 'Redeem Reward'}`;
            // IMPORTANT: Passes logic to the first step of redemption flow
            redeemBtn.onclick = () => redeemPrivilege(privilege.id);
        } else {
            redeemBtn.className = "w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 bg-slate-200 text-slate-400 cursor-not-allowed";
            redeemBtn.disabled = true;
            redeemBtn.innerHTML = `<i class="fas fa-lock"></i> ${currentLanguage === 'th' ? 'คะแนนไม่เพียงพอ' : 'Insufficient Points'}`;
            redeemBtn.onclick = null;
        }
    }

    openModal('privilegeDetailModal');
}

// ============================================
// DATA HELPER
// ============================================

function getActivePackages() {
    const custom = JSON.parse(localStorage.getItem('customPrivileges') || '[]');
    const deleted = JSON.parse(localStorage.getItem('deletedPrivileges') || '[]');
    const staticData = (typeof privilegePackages !== 'undefined') ? privilegePackages : [];
    const staticFiltered = staticData.filter(p => !deleted.includes(p.id));
    return [...staticFiltered, ...custom];
}

// ============================================
// REDEMPTION FLOW
// ============================================

// Step 1: Check Type & Balance -> Show Confirmation or Shipping
function redeemPrivilege(privilegeId) {
    const privilege = privilegePackages.find(p => p.id === privilegeId);
    if (!privilege) return;

    if (walletData.totalPoints < privilege.price) {
        showToast(currentLanguage === 'th' ? 'คะแนนไม่เพียงพอ!' : 'Insufficient points!', 'error');
        return;
    }

    // Close Detail Modal first
    closeModal('privilegeDetailModal');

    if (privilege.isPhysical) {
        // Show shipping modal for physical items
        window.pendingShippingPackage = privilege;
        document.getElementById('shippingProductImage').src = privilege.image || '';
        document.getElementById('shippingProductName').textContent = currentLanguage === 'th' ? privilege.titleTh : privilege.title;
        document.getElementById('shippingProductPrice').textContent = privilege.price.toLocaleString() + ' Flips';
        openModal('shippingModal');
    } else {
        // Show Standard Confirmation Modal for Digital items
        showConfirmationModal(privilege);
    }
}

// Step 1.5: Show Confirmation Modal
function showConfirmationModal(privilege) {
    const title = currentLanguage === 'th' ? privilege.titleTh : privilege.title;

    document.getElementById('confirmImage').src = privilege.image;
    document.getElementById('confirmTitle').textContent = title;
    document.getElementById('confirmPrice').textContent = privilege.price.toLocaleString();

    // Calculate balance after
    const balanceAfter = walletData.totalPoints - privilege.price;
    document.getElementById('confirmBalanceAfter').textContent = balanceAfter.toLocaleString() + ' Coins';

    // Set confirm action
    const confirmBtn = document.getElementById('confirmBtn');
    confirmBtn.onclick = () => {
        closeModal('confirmRedeemModal');
        completePrivilegeRedemption(privilege);
    };

    openModal('confirmRedeemModal');
}

// Step 2: Execute Transaction
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

    // Show success
    showRedemptionSuccess(privilege, voucherCode);
}

// Step 3: Show Success & Confetti
function showRedemptionSuccess(privilege, voucherCode) {
    const title = currentLanguage === 'th' ? privilege.titleTh : privilege.title;

    document.getElementById('bookingMessage').textContent = currentLanguage === 'th'
        ? `สำเร็จ! คุณได้รับ "${title}" แล้ว`
        : `Success! You have received "${title}".`;

    // Store for QR
    window.currentVoucherCode = voucherCode;
    window.currentVoucherName = title;

    // For DIGITAL items: Show QR button, Hide shipping info
    document.getElementById('successQrBtn').classList.remove('hidden');
    document.getElementById('successShippingInfo').classList.add('hidden');

    openModal('bookingModal');

    // TRIGGER CONFETTI
    if (typeof confetti === 'function') {
        // Fire cannon from left
        confetti({
            origin: { x: 0.2, y: 0.6 },
            angle: 60,
            spread: 55,
            particleCount: 80,
            colors: ['#3b82f6', '#8b5cf6', '#10b981']
        });
        // Fire cannon from right
        setTimeout(() => {
            confetti({
                origin: { x: 0.8, y: 0.6 },
                angle: 120,
                spread: 55,
                particleCount: 80,
                colors: ['#3b82f6', '#8b5cf6', '#10b981']
            });
        }, 200);
    }
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
