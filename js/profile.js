
// ============================================
// PROFILE PAGE LOGIC
// ============================================

document.addEventListener('DOMContentLoaded', initProfilePage);

function initProfilePage() {
    // 1. Init Data
    initWalletData(); // From utils.js

    // 2. Calculate & Render Stats
    renderWalletStats();

    // 3. Render Rewards
    renderRewards();

    // 4. Set Initial Tab
    switchTab('digital');

    // 5. Update Language (Static text)
    updateContentLanguage();

    // 6. Header Points
    updatePointsDisplay();
}

// ============================================
// STATS CALCULATIONS
// ============================================
function renderWalletStats() {
    // Balance
    const balance = walletData.totalPoints || 0;

    // Calculate Earned & Spent from transactions
    // Note: This relies on transaction history. For the demo, we might need to fallback if empty.
    let totalEarned = 0;
    let totalSpent = 0;

    if (walletData.transactions) {
        walletData.transactions.forEach(t => {
            const amount = parseInt(t.amount);
            if (amount > 0) totalEarned += amount;
            if (amount < 0) totalSpent += Math.abs(amount);
        });
    }

    // Validating against 'default' logical minimums for the demo
    // If totalEarned < balance, it means we started with points not in history. 
    // Let's assume initial points count as earned.
    if (totalEarned < balance) totalEarned = balance + totalSpent;

    // Render
    animateValue('statBalance', 0, balance, 1500);
    animateValue('statEarned', 0, totalEarned, 2000);
    animateValue('statSpent', 0, totalSpent, 2000);

    // Count Redeemed Items
    const redeemedCount = userVouchers.length;
    animateValue('statRedeemedCount', 0, redeemedCount, 1000);
}

// Simple counter animation
function animateValue(id, start, end, duration) {
    const obj = document.getElementById(id);
    if (!obj) return;

    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        obj.textContent = Math.floor(progress * (end - start) + start).toLocaleString();
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}


// ============================================
// REWARDS RENDERING
// ============================================
function renderRewards() {
    const digitalContainer = document.getElementById('content-digital');
    const physicalContainer = document.getElementById('content-physical');

    if (!digitalContainer || !physicalContainer) return;

    // Filter
    const digitalItems = userVouchers.filter(v => !v.isPhysical);
    const physicalItems = userVouchers.filter(v => v.isPhysical);

    // --- Render Digital (Grid) ---
    if (digitalItems.length === 0) {
        // Handled by tab switch logic showing empty state
        digitalContainer.innerHTML = '';
    } else {
        digitalContainer.innerHTML = digitalItems.map(item => createDigitalCard(item)).join('');
    }

    // --- Render Physical (List with Tracking) ---
    if (physicalItems.length === 0) {
        // Handled by tab logic
        physicalContainer.innerHTML = '';
    } else {
        physicalContainer.innerHTML = physicalItems.map(item => createPhysicalRow(item)).join('');
    }
}

function createDigitalCard(item) {
    // Handle bilingual title
    const title = currentLanguage === 'th' && item.titleTh ? item.titleTh : item.title;
    const categoryLabel = currentLanguage === 'th' && item.categoryLabelTh ? item.categoryLabelTh : item.categoryLabel;

    // Find category for icon/color
    const category = privilegeCategories.find(c => c.id === item.category) || privilegeCategories[0];

    return `
        <div class="glass-card rounded-2xl overflow-hidden group hover:border-primary/50 transition-all cursor-pointer flex flex-col"
             onclick="openQRModal('${item.code}', '${title.replace(/'/g, "\\'")}', '${item.bookedAt}')">
            <div class="h-40 relative overflow-hidden">
                <img src="${item.image || '../images/privilege_default.jpg'}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
                <div class="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                
                <div class="absolute top-3 left-3 px-2 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-medium text-white">
                    ${categoryLabel}
                </div>
            </div>
            <div class="p-5 flex-grow flex flex-col">
                <h4 class="font-bold text-lg mb-1 leading-tight group-hover:text-blue-primary transition-colors">${title}</h4>
                <p class="text-white/40 text-xs mb-4">Code: ${item.code}</p>
                
                <div class="mt-auto">
                    <button class="w-full py-2 rounded-lg bg-white/5 group-hover:bg-blue-primary/20 text-white/70 group-hover:text-white text-sm font-medium transition-colors flex items-center justify-center gap-2">
                        <i class="fas fa-qrcode"></i>
                        <span data-i18n="btn_view_qr">${currentLanguage === 'th' ? 'ดู QR Code' : 'View QR Code'}</span>
                    </button>
                </div>
            </div>
        </div>
    `;
}

function createPhysicalRow(item) {
    const title = currentLanguage === 'th' && item.titleTh ? item.titleTh : item.title;
    const date = new Date(item.bookedAt).toLocaleDateString(currentLanguage === 'th' ? 'th-TH' : 'en-US');

    // Mock Tracking Status based on time derived from hash of code or random
    // For demo: Always 'Shipped' or 'Processing'
    const status = 'shipped'; // Mock
    const statusLabel = currentLanguage === 'th' ? 'อยู่ระหว่างจัดส่ง' : 'Shipped';

    return `
        <div class="glass-card rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all">
            <div class="flex flex-col md:flex-row gap-6">
                <!-- Image -->
                <div class="w-full md:w-32 h-32 rounded-xl overflow-hidden flex-shrink-0 bg-white/5">
                    <img src="${item.image || '../images/privilege_default.jpg'}" class="w-full h-full object-cover">
                </div>
                
                <!-- Info -->
                <div class="flex-grow">
                    <div class="flex flex-wrap justify-between items-start mb-2">
                        <div>
                            <h4 class="font-bold text-xl mb-1">${title}</h4>
                            <p class="text-white/50 text-sm">Order ID: #${item.code}</p>
                        </div>
                        <span class="px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-xs font-medium border border-blue-500/20">
                            ${statusLabel}
                        </span>
                    </div>
                    
                    <p class="text-white/60 text-sm mb-6">${currentLanguage === 'th' ? 'สั่งเมื่อ' : 'Ordered on'}: ${date}</p>
                    
                    <!-- Tracking Stepper -->
                    <div class="relative">
                        <div class="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-white/10 rounded-full"></div>
                        <div class="absolute left-0 top-1/2 -translate-y-1/2 w-2/3 h-1 bg-primary rounded-full"></div>
                        
                        <div class="relative flex justify-between text-xs font-medium">
                            <div class="flex flex-col items-center gap-2">
                                <div class="w-4 h-4 rounded-full bg-blue-primary ring-4 ring-black"></div>
                                <span class="text-blue-primary">Order Placed</span>
                            </div>
                            <div class="flex flex-col items-center gap-2">
                                <div class="w-4 h-4 rounded-full bg-blue-primary ring-4 ring-black"></div>
                                <span class="text-blue-primary">${statusLabel}</span>
                            </div>
                            <div class="flex flex-col items-center gap-2 opacity-50">
                                <div class="w-4 h-4 rounded-full bg-white/20 ring-4 ring-black"></div>
                                <span>Delivered</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// ============================================
// UI LOGIC
// ============================================

function switchTab(tabName) {
    const contentDigital = document.getElementById('content-digital');
    const contentPhysical = document.getElementById('content-physical');
    const tabDigital = document.getElementById('tab-digital');
    const tabPhysical = document.getElementById('tab-physical');
    const emptyState = document.getElementById('empty-state');

    // Reset classes
    tabDigital.className = 'tab-btn px-6 py-4 text-white/50 font-medium border-b-2 border-transparent hover:text-white transition-colors flex items-center gap-2';
    tabPhysical.className = 'tab-btn px-6 py-4 text-white/50 font-medium border-b-2 border-transparent hover:text-white transition-colors flex items-center gap-2';

    contentDigital.classList.add('hidden');
    contentPhysical.classList.add('hidden');
    emptyState.classList.add('hidden');

    // Active Tab Logic
    if (tabName === 'digital') {
        tabDigital.className = 'tab-btn px-6 py-4 text-primary font-medium border-b-2 border-primary flex items-center gap-2';

        const hasItems = userVouchers.some(v => !v.isPhysical);
        if (hasItems) {
            contentDigital.classList.remove('hidden');
        } else {
            emptyState.classList.remove('hidden');
        }
    } else {
        tabPhysical.className = 'tab-btn px-6 py-4 text-primary font-medium border-b-2 border-primary flex items-center gap-2';

        const hasItems = userVouchers.some(v => v.isPhysical);
        if (hasItems) {
            contentPhysical.classList.remove('hidden');
        } else {
            emptyState.classList.remove('hidden');
        }
    }
}

function openQRModal(code, name, dateStr) {
    const modal = document.getElementById('qrModal');
    const qrContainer = document.getElementById('qrcode');

    document.getElementById('qrVoucherName').textContent = name;
    document.getElementById('qrVoucherCode').textContent = code;

    const date = new Date(dateStr).toLocaleDateString(currentLanguage === 'th' ? 'th-TH' : 'en-US');
    document.getElementById('qrRedeemedDate').textContent = `${currentLanguage === 'th' ? 'แลกเมื่อ' : 'Redeemed on'} ${date}`;

    // Clear previous QR
    qrContainer.innerHTML = '';

    // Generate new QR
    new QRCode(qrContainer, {
        text: code,
        width: 180,
        height: 180,
        colorDark: '#000000',
        colorLight: '#ffffff',
        correctLevel: QRCode.CorrectLevel.H
    });

    openModal('qrModal');
}

// Override utils toggleLanguage to reload stats/render
const originalToggleLanguage = toggleLanguage;
toggleLanguage = function () {
    originalToggleLanguage();
    renderRewards(); // Re-render to update titles
}
