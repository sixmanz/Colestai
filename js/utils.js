/**
 * UTILS.JS
 * Core utility functions and global manipulations
 */

// ============================================
// GLOBAL STATE
// ============================================
window.currentLanguage = localStorage.getItem('language') || 'en';

let walletData = {
    totalPoints: 0,
    transactions: [],
    pointsBatches: []
};

let userVouchers = [];

// defaultWalletData is defined in data.js
// If not, we define a fallback here safely or assume data.js loaded it.
if (typeof defaultWalletData === 'undefined') {
    // This blocks const redeclaration if we used let/var, but since data.js uses const, we strictly cannot redeclare it.
    // relying on data.js being loaded.
    console.warn('data.js not loaded? defaultWalletData missing');
}


// ============================================
// LANGUAGE HANDLING
// ============================================

function toggleLanguage() {
    window.currentLanguage = window.currentLanguage === 'en' ? 'th' : 'en';
    localStorage.setItem('language', window.currentLanguage);

    const langBtn = document.getElementById('currentLang');
    if (langBtn) langBtn.textContent = window.currentLanguage.toUpperCase();

    updateContentLanguage();
    updatePlaceholders();

    // Trigger Re-renders if on specific pages
    if (typeof renderPrivilegeCards === 'function') renderPrivilegeCards();
    if (typeof renderPrivilegeCategories === 'function') renderPrivilegeCategories();
    if (typeof renderProfile === 'function') renderProfile();
    if (typeof renderWallet === 'function') renderWallet();
    if (typeof renderRewards === 'function') renderRewards();
    if (typeof updatePointsDisplay === 'function') updatePointsDisplay();

    showToast(window.currentLanguage === 'en' ? 'Language changed to English' : 'เปลี่ยนภาษาเป็นไทย', 'success');
}

function updateContentLanguage() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (typeof translations !== 'undefined' && translations[window.currentLanguage][key]) {
            if (el.tagName === 'INPUT' && el.getAttribute('placeholder')) {
                el.placeholder = translations[window.currentLanguage][key];
            } else {
                el.textContent = translations[window.currentLanguage][key];
            }
        }
    });
}

function updatePlaceholders() {
    const inputs = document.querySelectorAll('input[data-i18n], textarea[data-i18n]');
    inputs.forEach(input => {
        const key = input.getAttribute('data-i18n');
        if (typeof translations !== 'undefined' && translations[window.currentLanguage][key]) {
            input.placeholder = translations[window.currentLanguage][key];
        }
    });
}

function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString(window.currentLanguage === 'th' ? 'th-TH' : 'en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

// ============================================
// WALLET LOGIC (Legacy Modal Support)
// ============================================

function initWalletData() {
    try {
        const savedWallet = localStorage.getItem('walletData');
        if (savedWallet) {
            const parsed = JSON.parse(savedWallet);
            // Ensure robust data structure
            if (!parsed.transactions) parsed.transactions = defaultWalletData.transactions;
            if (!parsed.pointsBatches) parsed.pointsBatches = defaultWalletData.pointsBatches;
            if (parsed.totalPoints === undefined) parsed.totalPoints = defaultWalletData.totalPoints;
            if (parsed.movieTokens === undefined) parsed.movieTokens = defaultWalletData.movieTokens;
            if (parsed.gameTokens === undefined) parsed.gameTokens = defaultWalletData.gameTokens;

            // Always use default Token details to ensure latest data structure
            parsed.movieTokenDetails = defaultWalletData.movieTokenDetails;
            parsed.gameTokenDetails = defaultWalletData.gameTokenDetails;

            walletData = parsed;
            // Save updated structure back to localStorage
            localStorage.setItem('walletData', JSON.stringify(walletData));
        } else {
            throw new Error('No saved wallet');
        }
    } catch (e) {
        console.warn('Wallet data init failed or empty, resetting to default:', e);
        walletData = JSON.parse(JSON.stringify(defaultWalletData));
        localStorage.setItem('walletData', JSON.stringify(walletData));
    }

    try {
        userVouchers = JSON.parse(localStorage.getItem('userVouchers') || '[]');
    } catch (e) {
        userVouchers = [];
        localStorage.setItem('userVouchers', '[]');
    }

    updatePointsDisplay();
}

function updatePointsDisplay() {
    const headerPoints = document.getElementById('headerPoints');
    if (headerPoints) headerPoints.textContent = walletData.totalPoints.toLocaleString();

    const walletTotalFn = document.getElementById('walletTotalPoints');
    if (walletTotalFn) walletTotalFn.textContent = walletData.totalPoints.toLocaleString();

    const userBalance = document.getElementById('userBalance');
    if (userBalance) userBalance.textContent = walletData.totalPoints.toLocaleString();
}

function openWallet() {
    renderWallet();
    openModal('walletModal');
}

function renderWallet() {
    document.getElementById('walletTotalPoints').textContent = walletData.totalPoints.toLocaleString();

    const breakdownContainer = document.getElementById('pointsBreakdown');
    if (breakdownContainer) {
        breakdownContainer.innerHTML = walletData.pointsBatches.map(batch => {
            const isExpiring = batch.status === 'expiring_soon';
            const expiryDate = new Date(batch.expiryDate).toLocaleDateString(window.currentLanguage === 'th' ? 'th-TH' : 'en-US');

            return `
                <div class="bg-white/5 rounded-xl p-3 flex justify-between items-center border ${isExpiring ? 'border-yellow-500/30' : 'border-white/5'}">
                    <div>
                        <p class="font-bold">${batch.amount.toLocaleString()} RDS</p>
                        <p class="text-xs text-white/50">${batch.source}</p>
                    </div>
                    <div class="text-right">
                        <p class="text-xs ${isExpiring ? 'text-yellow-400' : 'text-white/50'}">
                            ${window.currentLanguage === 'en' ? 'Expires' : 'หมดอายุ'}: ${expiryDate}
                        </p>
                    </div>
                </div>
            `;
        }).join('');
    }
}

// ============================================
// PROFILE LOGIC (Legacy Modal Support)
// ============================================

function openProfile() {
    renderProfile();
    openModal('profileModal');
}

function renderProfile() {
    document.getElementById('profileBalance').textContent = walletData.totalPoints.toLocaleString() + ' RDS';
    document.getElementById('profileVouchers').textContent = userVouchers.length;

    const container = document.getElementById('redeemedPrivilegesList');
    if (container) {
        if (userVouchers.length === 0) {
            container.innerHTML = `
                <div class="text-center py-8 text-white/50">
                    <i class="fas fa-gift text-3xl mb-3 block"></i>
                    <p data-i18n="no_privileges">${window.currentLanguage === 'en' ? 'No privileges redeemed yet' : 'ยังไม่มีสิทธิพิเศษที่แลก'}</p>
                </div>
            `;
        } else {
            container.innerHTML = userVouchers.map(v => {
                const title = window.currentLanguage === 'th' && v.titleTh ? v.titleTh : v.title;
                return `
                    <div class="glass-card rounded-xl p-4 flex items-center gap-4">
                        <div class="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                            <i class="fas fa-gift text-xl"></i>
                        </div>
                        <div class="flex-1 min-w-0">
                            <h4 class="font-semibold truncate">${title}</h4>
                            <p class="text-white/50 text-xs">ref: ${v.code}</p>
                        </div>
                    </div>
                `;
            }).join('');
        }
    }
}

// ============================================
// UI HELPERS
// ============================================

function openModal(id) {
    const modal = document.getElementById(id);
    if (modal) {
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(id) {
    const modal = document.getElementById(id);
    if (modal) {
        modal.classList.add('hidden');
        document.body.style.overflow = '';
    }
}

function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    if (!toast) return;

    const icons = { success: 'fa-check-circle text-green-400', error: 'fa-times-circle text-red-400', warning: 'fa-exclamation-circle text-yellow-400', info: 'fa-info-circle text-blue-400' };
    const iconEl = document.getElementById('toastIcon');
    const msgEl = document.getElementById('toastMessage');

    if (iconEl) iconEl.className = `fas ${icons[type]} text-xl`;
    if (msgEl) msgEl.textContent = message;

    toast.classList.remove('hidden');
    setTimeout(() => toast.classList.add('hidden'), 3000);
}

function toggleMobileMenu() {
    const menu = document.getElementById('mobileMenu');
    if (menu) menu.classList.toggle('hidden');
}

// ============================================
// SOCIAL CONSTANTS & FUNCTIONS
// ============================================

function shareToFacebook() {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank');
}

function shareToTwitter() {
    window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(document.title)}`, '_blank');
}

function shareToLine() {
    window.open(`https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(window.location.href)}`, '_blank');
}

function copyLink() {
    navigator.clipboard.writeText(window.location.href);
    showToast('Link copied to clipboard!', 'success');
}

function openMap() {
    window.open('https://maps.google.com/?q=Wyndham+Grand+Phuket+Kalim+Bay', '_blank');
}

function openSupport() {
    // Check if support modal exists or just alert
    const supportModal = document.getElementById('supportModal');
    if (supportModal) openModal('supportModal');
    else alert('Support feature coming soon');
}

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    // 1. Set Button Text
    const langBtn = document.getElementById('currentLang');
    if (langBtn) langBtn.textContent = window.currentLanguage.toUpperCase();

    // 2. Apply Translations
    updateContentLanguage();
    updatePlaceholders();

    // 3. Init Wallet Data
    initWalletData();
});

// ============================================
// UX ENHANCEMENTS - Skeleton & Feedback
// ============================================

function showSkeleton(containerId, count = 3, height = '200px') {
    const container = document.getElementById(containerId);
    if (!container) return;

    // Save original content check? No, we assume this is called before render.
    let skeletons = '';
    for (let i = 0; i < count; i++) {
        skeletons += `
            <div class="skeleton-loading rounded-xl mb-4" style="height: ${height};"></div>
        `;
    }
    container.innerHTML = skeletons;
}

function hideSkeleton(containerId) {
    // Just clear it, actual render will overwrite
    // Or do nothing if render overwrites innerHTML
}

// Add active state to buttons on touch
document.addEventListener('touchstart', function (e) {
    if (e.target.closest('button') || e.target.closest('a')) {
        e.target.closest('button, a').classList.add('active-touch');
    }
}, { passive: true });

document.addEventListener('touchend', function (e) {
    if (e.target.closest('button') || e.target.closest('a')) {
        setTimeout(() => {
            e.target.closest('button, a').classList.remove('active-touch');
        }, 150);
    }
});
