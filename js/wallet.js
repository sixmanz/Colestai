
// ============================================
// WALLET PAGE LOGIC
// ============================================

document.addEventListener('DOMContentLoaded', initWalletPage);

function initWalletPage() {
    // 1. Init Data
    initWalletData(); // From utils.js

    // 2. Render Page Content
    renderWalletPage();

    // 3. Update Language
    updateContentLanguage();
}

function renderWalletPage() {
    // Render Points Hero
    const totalPoints = walletData.totalPoints || 0;

    // Animate Points
    const heroPointsEl = document.getElementById('walletTotalPointsHero');
    if (heroPointsEl) {
        heroPointsEl.textContent = totalPoints.toLocaleString();
    }

    // Also update header points
    updatePointsDisplay();

    // Render Transactions
    renderFullTransactions();
}


function renderFullTransactions() {
    const listContainer = document.getElementById('transactionsListFull');
    const emptyState = document.getElementById('emptyTransactions');

    if (!listContainer) return;

    const transactions = walletData.transactions || [];

    if (transactions.length === 0) {
        listContainer.innerHTML = '';
        emptyState.classList.remove('hidden');
        return;
    }

    emptyState.classList.add('hidden');

    // Sort by date desc
    const sorted = [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date));

    listContainer.innerHTML = sorted.map(t => {
        const isPositive = parseInt(t.amount) > 0;
        const colorClass = isPositive ? 'text-green-400' : 'text-red-400';
        const iconClass = isPositive ? 'fa-arrow-down text-green-500' : 'fa-arrow-up text-red-500';
        const bgClass = isPositive ? 'bg-green-500/10' : 'bg-red-500/10';

        // Date formatting based on current Language
        const dateObj = new Date(t.date);
        const dateStr = dateObj.toLocaleDateString(currentLanguage === 'th' ? 'th-TH' : 'en-US', {
            year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
        });

        // Description translation lookup or fallback
        // Just use the description as is for now, or map common ones
        let desc = t.description;
        if (t.type === 'welcome' && currentLanguage === 'th') desc = 'โบนัสต้อนรับ';
        if (t.type === 'redeem' && currentLanguage === 'th') desc = 'แลกของรางวัล';

        return `
            <div class="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                <div class="flex items-center gap-4">
                    <div class="w-10 h-10 rounded-full ${bgClass} flex items-center justify-center shrink-0">
                        <i class="fas ${iconClass}"></i>
                    </div>
                    <div>
                        <p class="font-bold text-white mb-1">${desc}</p>
                        <p class="text-xs text-white/50">${dateStr}</p>
                    </div>
                </div>
                <div class="text-right">
                    <p class="font-bold text-lg ${colorClass}">
                        ${isPositive ? '+' : ''}${parseInt(t.amount).toLocaleString()}
                    </p>
                    <p class="text-xs text-white/30">RDS</p>
                </div>
            </div>
        `;
    }).join('');
}


// Override utils toggleLanguage to re-render
const originalToggleLanguageWallet = toggleLanguage;
toggleLanguage = function () {
    originalToggleLanguageWallet();
    renderWalletPage();
}
