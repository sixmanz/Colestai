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

    const modalImage = document.getElementById('modalRewardImage');
    const modalTitle = document.getElementById('modalRewardTitle');
    const modalCost = document.getElementById('modalRewardCost');
    const modalWarning = document.getElementById('modalWarningText');

    if (modalImage) modalImage.src = privilege.image;
    if (modalTitle) modalTitle.textContent = privilege.titleTh || privilege.title;

    if (currentPaymentMode === 'points') {
        if (modalCost) modalCost.textContent = `ใช้ ${privilege.price.toLocaleString()} Flips Coins`;
        if (modalWarning) modalWarning.textContent = 'Flips Coins จะถูกหักจากยอดคงเหลือทันที';
    } else {
        const isMovie = privilege.type === 'movie';
        const tokenCost = privilege.tokenPrice || Math.ceil(privilege.price / 500);
        const tokenType = isMovie ? 'Movie Token' : 'FULL SENSE Token';
        if (modalCost) modalCost.textContent = `ใช้ ${tokenCost} ${tokenType}`;
        if (modalWarning) modalWarning.textContent = `${tokenType} จะถูกหักจากยอดคงเหลือทันที`;
    }

    document.getElementById('redeemModal').classList.remove('hidden');
}

function closeRedeemModal() {
    document.getElementById('redeemModal').classList.add('hidden');
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
    const redeemed = JSON.parse(localStorage.getItem('redeemedRewards') || '[]');
    redeemed.push({
        ...privilege,
        paymentMode: currentPaymentMode,
        redeemedAt: new Date().toISOString()
    });
    localStorage.setItem('redeemedRewards', JSON.stringify(redeemed));

    closeRedeemModal();
    renderMainBalances();

    // Re-render privileges
    if (typeof renderPrivilegeCards === 'function') {
        renderPrivilegeCards();
    }

    // Show success modal
    const successModal = document.getElementById('rewardSuccessModal');
    if (successModal) successModal.classList.remove('hidden');
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
