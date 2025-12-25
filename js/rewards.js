/**
 * REWARDS.JS - Payment Mode Toggle & Balance Display
 * Integrated with privileges section
 */

// ============================================
// STATE VARIABLES
// ============================================
var currentPaymentMode = 'points'; // 'points' or 'token'
var rewardsWalletData = null;

// ============================================
// INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    loadRewardsWalletData();
    renderMainBalances();
});

function loadRewardsWalletData() {
    try {
        const saved = localStorage.getItem('walletData');
        rewardsWalletData = saved ? JSON.parse(saved) : { ...defaultWalletData };
    } catch (e) {
        rewardsWalletData = { ...defaultWalletData };
    }
}

function saveRewardsWalletData() {
    localStorage.setItem('walletData', JSON.stringify(rewardsWalletData));
}

// ============================================
// BALANCE RENDERING
// ============================================
function renderMainBalances() {
    // Points balance
    const pointsEl = document.getElementById('mainPointsBalance');
    if (pointsEl) pointsEl.textContent = (rewardsWalletData.totalPoints || 0).toLocaleString();

    // Token balances
    const movieEl = document.getElementById('mainMovieToken');
    const gameEl = document.getElementById('mainGameToken');
    if (movieEl) movieEl.textContent = rewardsWalletData.movieTokens || 0;
    if (gameEl) gameEl.textContent = rewardsWalletData.gameTokens || 0;
}

// ============================================
// PAYMENT MODE TOGGLE
// ============================================
function switchPaymentMode(mode) {
    currentPaymentMode = mode;

    const pointsBtn = document.getElementById('payModePoints');
    const tokenBtn = document.getElementById('payModeToken');
    const pointsCard = document.getElementById('pointsBalanceCard');
    const tokenCards = document.getElementById('tokenBalanceCards');

    if (mode === 'points') {
        // Update buttons
        pointsBtn.classList.add('bg-blue-primary', 'text-white');
        pointsBtn.classList.remove('text-slate-500', 'hover:text-slate-700');
        tokenBtn.classList.remove('bg-blue-primary', 'text-white');
        tokenBtn.classList.add('text-slate-500', 'hover:text-slate-700');

        // Show/hide balance cards
        if (pointsCard) pointsCard.classList.remove('hidden');
        if (tokenCards) tokenCards.classList.add('hidden');
    } else {
        // Update buttons
        tokenBtn.classList.add('bg-blue-primary', 'text-white');
        tokenBtn.classList.remove('text-slate-500', 'hover:text-slate-700');
        pointsBtn.classList.remove('bg-blue-primary', 'text-white');
        pointsBtn.classList.add('text-slate-500', 'hover:text-slate-700');

        // Show/hide balance cards
        if (pointsCard) pointsCard.classList.add('hidden');
        if (tokenCards) tokenCards.classList.remove('hidden');
    }

    // Re-render privileges with new payment mode
    if (typeof renderPrivilegeCards === 'function') {
        renderPrivilegeCards();
    }
}

// ============================================
// GET CURRENT PAYMENT MODE
// ============================================
function getPaymentMode() {
    return currentPaymentMode;
}

// ============================================
// REDEEM WITH CURRENT MODE
// ============================================
function redeemPrivilegeWithMode(privilegeId) {
    const privilege = privilegePackages.find(p => p.id === privilegeId);
    if (!privilege) return;

    // Store selected privilege info
    window.selectedRedeemPrivilege = privilege;

    // Use standardized Confirm Modal
    // 1. Image & Title
    const imgEl = document.getElementById('confirmImage');
    const titleEl = document.getElementById('confirmTitle');
    if (imgEl) imgEl.src = privilege.image;
    if (titleEl) titleEl.textContent = (typeof currentLanguage !== 'undefined' && currentLanguage === 'th') ? (privilege.titleTh || privilege.title) : privilege.title;

    // 2. Price & Balance Calculation
    const priceEl = document.getElementById('confirmPrice');
    const coinNameEl = document.getElementById('confirmCoinName');
    const balanceAfterEl = document.getElementById('confirmBalanceAfter');

    if (currentPaymentMode === 'points') {
        // POINTS MODE
        if (priceEl) priceEl.textContent = privilege.price.toLocaleString();
        if (coinNameEl) coinNameEl.textContent = 'Flips';

        const balanceAfter = (rewardsWalletData.totalPoints || 0) - privilege.price;
        if (balanceAfterEl) balanceAfterEl.textContent = balanceAfter.toLocaleString() + ' Flips';

    } else {
        // TOKEN MODE
        const isMovie = privilege.type === 'movie';
        const tokenCost = privilege.tokenPrice || Math.ceil(privilege.price / 500);
        const tokenType = isMovie ? 'Movie Token' : 'Game Token';

        if (priceEl) priceEl.textContent = tokenCost.toLocaleString();
        if (coinNameEl) coinNameEl.textContent = tokenType;

        const currentTokens = isMovie ? (rewardsWalletData.movieTokens || 0) : (rewardsWalletData.gameTokens || 0);
        const balanceAfter = currentTokens - tokenCost;
        if (balanceAfterEl) balanceAfterEl.textContent = balanceAfter.toLocaleString() + ' ' + tokenType;
    }

    // 3. Setup Confirm Button
    const confirmBtn = document.getElementById('confirmBtn');
    if (confirmBtn) {
        confirmBtn.onclick = confirmRedeem;
    }

    // Show Modal
    if (typeof openModal === 'function') {
        openModal('confirmRedeemModal');
    } else {
        document.getElementById('confirmRedeemModal').classList.remove('hidden');
    }
}

function closeRedeemModal() {
    if (typeof closeModal === 'function') {
        closeModal('confirmRedeemModal');
    } else {
        document.getElementById('confirmRedeemModal').classList.add('hidden');
    }
    window.selectedRedeemPrivilege = null;
}

function confirmRedeem() {
    const privilege = window.selectedRedeemPrivilege;
    if (!privilege) return;

    if (currentPaymentMode === 'points') {
        // Redeem with Points
        if (rewardsWalletData.totalPoints < privilege.price) {
            alert('Flips Coins ไม่เพียงพอ');
            closeRedeemModal();
            return;
        }

        rewardsWalletData.totalPoints -= privilege.price;

    } else {
        // Redeem with Token
        const isMovie = privilege.type === 'movie';
        const tokenCost = privilege.tokenPrice || Math.ceil(privilege.price / 500);
        const currentTokens = isMovie ? rewardsWalletData.movieTokens : rewardsWalletData.gameTokens;

        if (currentTokens < tokenCost) {
            alert('Token ไม่เพียงพอ');
            closeRedeemModal();
            return;
        }

        if (isMovie) {
            rewardsWalletData.movieTokens -= tokenCost;
        } else {
            rewardsWalletData.gameTokens -= tokenCost;
        }
    }

    // Save and update
    saveRewardsWalletData();

    // Sync with global walletData used by privileges.js
    if (typeof walletData !== 'undefined') {
        walletData = JSON.parse(JSON.stringify(rewardsWalletData));
    } else if (typeof initWalletData === 'function') {
        initWalletData();
    }

    // Add to redeemed list
    const voucherCode = 'PVL-' + Date.now().toString(36).toUpperCase();
    const title = (typeof currentLanguage !== 'undefined' && currentLanguage === 'th') ? (privilege.titleTh || privilege.title) : privilege.title;

    // Create detailed voucher object compatible with other files
    const newVoucher = {
        ...privilege,
        code: voucherCode,
        paymentMode: currentPaymentMode,
        redeemedAt: new Date().toISOString(),
        bookedAt: new Date().toISOString(), // Standardize
        used: false,
        type: 'privilege',
        title: privilege.title,
        titleTh: privilege.titleTh
    };

    // Update global userVouchers if available
    if (typeof userVouchers !== 'undefined') {
        userVouchers.push(newVoucher);
        localStorage.setItem('userVouchers', JSON.stringify(userVouchers));
    }

    const redeemed = JSON.parse(localStorage.getItem('redeemedRewards') || '[]');
    redeemed.push(newVoucher);
    localStorage.setItem('redeemedRewards', JSON.stringify(redeemed));

    closeRedeemModal();
    renderMainBalances();

    // Re-render privileges
    if (typeof renderPrivilegeCards === 'function') {
        renderPrivilegeCards();
    }
    if (typeof updatePointsDisplay === 'function') {
        updatePointsDisplay();
    }

    // Show SUCCESS using Standard Booking Modal
    const msgEl = document.getElementById('bookingMessage');
    if (msgEl) {
        if (currentPaymentMode === 'points') {
            msgEl.textContent = `สำเร็จ! ใช้ ${privilege.price.toLocaleString()} Flips สำหรับ "${title}"`;
        } else {
            msgEl.textContent = `สำเร็จ! แลกรับ "${title}" ด้วย Token แล้ว`;
        }
    }

    // Setup Success Modal Buttons (Digital vs Physical)
    if (privilege.isPhysical) {
        // Physical: Hide QR, Show Shipping Message
        document.getElementById('successQrBtn').classList.add('hidden');
        document.getElementById('successShippingInfo').classList.remove('hidden');
    } else {
        // Digital: Show QR, Hide Shipping Message
        document.getElementById('successQrBtn').classList.remove('hidden');
        document.getElementById('successShippingInfo').classList.add('hidden');

        // Setup QR Logic
        window.currentVoucherCode = voucherCode;
        window.currentVoucherName = title;
    }

    if (typeof openModal === 'function') {
        openModal('bookingModal');
    } else {
        document.getElementById('bookingModal').classList.remove('hidden');
    }

    // Confetti!
    if (typeof confetti === 'function') {
        confetti({
            origin: { x: 0.5, y: 0.6 }
        });
    }
}

function closeRewardSuccessModal() {
    const modal = document.getElementById('rewardSuccessModal');
    if (modal) modal.classList.add('hidden');
}

// ============================================
// HELPER: Get token cost for a privilege
// ============================================
function getTokenCost(privilege) {
    return privilege.tokenPrice || Math.ceil(privilege.price / 500);
}

// ============================================
// HELPER: Check if user can afford
// ============================================
function canAffordPrivilege(privilege) {
    if (currentPaymentMode === 'points') {
        return rewardsWalletData.totalPoints >= privilege.price;
    } else {
        const isMovie = privilege.type === 'movie';
        const tokenCost = getTokenCost(privilege);
        const currentTokens = isMovie ? rewardsWalletData.movieTokens : rewardsWalletData.gameTokens;
        return currentTokens >= tokenCost;
    }
}
