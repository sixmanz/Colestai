
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
    // Get all wallet data
    const totalPoints = walletData.totalPoints || 0;
    const tbfCoins = walletData.tbfCoins || 0;
    const teamCoins = walletData.teamCoins || { phoenix: 0, shadow: 0, thunder: 0, dragon: 0 };
    const movieTokens = walletData.movieTokens || 0;
    const gameTokens = walletData.gameTokens || 0;
    const movieTokenDetails = walletData.movieTokenDetails || [];
    const gameTokenDetails = walletData.gameTokenDetails || [];
    const pointsBatches = walletData.pointsBatches || [];

    // Calculate totals
    const totalTeamCoins = (teamCoins.phoenix || 0) + (teamCoins.shadow || 0) + (teamCoins.thunder || 0) + (teamCoins.dragon || 0);
    const totalAllCoins = totalPoints + tbfCoins + totalTeamCoins;
    const totalAllTokens = movieTokens + gameTokens;

    // Calculate expiring coins
    let expiringCoins = 0;
    pointsBatches.forEach(batch => {
        if (batch.status === 'expiring_soon') {
            expiringCoins += batch.amount;
        }
    });

    // Calculate earned this month (assuming transactions have dates)
    let earnedThisMonth = 0;
    const now = new Date();
    const thisMonth = now.getMonth();
    const thisYear = now.getFullYear();
    (walletData.transactions || []).forEach(t => {
        const tDate = new Date(t.date);
        if (tDate.getMonth() === thisMonth && tDate.getFullYear() === thisYear && parseInt(t.amount) > 0) {
            earnedThisMonth += parseInt(t.amount);
        }
    });

    // === Update Overview Stats ===
    const totalAllCoinsEl = document.getElementById('totalAllCoins');
    if (totalAllCoinsEl) totalAllCoinsEl.textContent = totalAllCoins.toLocaleString();

    const totalAllTokensEl = document.getElementById('totalAllTokens');
    if (totalAllTokensEl) totalAllTokensEl.textContent = totalAllTokens.toLocaleString();

    const expiringCoinsEl = document.getElementById('expiringCoins');
    if (expiringCoinsEl) expiringCoinsEl.textContent = expiringCoins.toLocaleString();

    const recentSpendingEl = document.getElementById('recentSpending');
    if (recentSpendingEl) {
        // Calculate recent spending (last 30 days)
        let recentSpending = 0;
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        (walletData.transactions || []).forEach(t => {
            const tDate = new Date(t.date);
            if (tDate >= thirtyDaysAgo && parseInt(t.amount) < 0) {
                recentSpending += Math.abs(parseInt(t.amount));
            }
        });
        recentSpendingEl.textContent = recentSpending.toLocaleString();
    }

    // === Flips Coins Main Balance ===
    const heroPointsEl = document.getElementById('walletTotalPointsHero');
    if (heroPointsEl) heroPointsEl.textContent = totalPoints.toLocaleString();

    const expiringFlipsEl = document.getElementById('expiringFlips');
    if (expiringFlipsEl) expiringFlipsEl.textContent = expiringCoins.toLocaleString() + ' Flips';

    const earnedThisMonthEl = document.getElementById('earnedThisMonth');
    if (earnedThisMonthEl) earnedThisMonthEl.textContent = '+' + earnedThisMonth.toLocaleString() + ' Flips';

    // === TBF Coins ===
    const tbfCoinsBalanceEl = document.getElementById('tbfCoinsBalance');
    if (tbfCoinsBalanceEl) tbfCoinsBalanceEl.textContent = tbfCoins.toLocaleString();

    // === Team Coins ===
    const phoenixEl = document.getElementById('phoenixCoins');
    if (phoenixEl) phoenixEl.textContent = (teamCoins.phoenix || 0).toLocaleString();

    const shadowEl = document.getElementById('shadowCoins');
    if (shadowEl) shadowEl.textContent = (teamCoins.shadow || 0).toLocaleString();

    const thunderEl = document.getElementById('thunderCoins');
    if (thunderEl) thunderEl.textContent = (teamCoins.thunder || 0).toLocaleString();

    const dragonEl = document.getElementById('dragonCoins');
    if (dragonEl) dragonEl.textContent = (teamCoins.dragon || 0).toLocaleString();

    // === Token Balances ===
    const movieTokenEl = document.getElementById('movieTokenBalance');
    if (movieTokenEl) movieTokenEl.textContent = movieTokens.toLocaleString();

    const gameTokenEl = document.getElementById('gameTokenBalance');
    if (gameTokenEl) gameTokenEl.textContent = gameTokens.toLocaleString();

    // Token item counts
    const movieItemCountEl = document.getElementById('movieItemCount');
    if (movieItemCountEl) movieItemCountEl.textContent = movieTokenDetails.length;

    const gameItemCountEl = document.getElementById('gameItemCount');
    if (gameItemCountEl) gameItemCountEl.textContent = gameTokenDetails.length;

    // === Render Summary Table ===
    renderCoinsSummaryTable(totalPoints, tbfCoins, teamCoins, movieTokens, gameTokens, expiringCoins);

    // Also update header points
    updatePointsDisplay();

    // Render Transactions
    renderFullTransactions();
}

function renderCoinsSummaryTable(totalPoints, tbfCoins, teamCoins, movieTokens, gameTokens, expiringCoins) {
    const table = document.getElementById('coinsSummaryTable');
    if (!table) return;

    const rows = [
        { name: 'Flips Coins', category: 'FLIPS ID', amount: totalPoints, unit: 'Flips', status: expiringCoins > 0 ? `${expiringCoins.toLocaleString()} หมดอายุเร็วๆ นี้` : 'ปกติ', statusClass: expiringCoins > 0 ? 'text-amber-500' : 'text-green-500' },
        { name: 'TBF Coins', category: 'TBF', amount: tbfCoins, unit: 'TBF', status: 'ปกติ', statusClass: 'text-green-500' },
        { name: 'Phoenix Team Coins', category: 'CTRL G', amount: teamCoins.phoenix || 0, unit: 'Coins', status: 'ปกติ', statusClass: 'text-green-500' },
        { name: 'Shadow Team Coins', category: 'CTRL G', amount: teamCoins.shadow || 0, unit: 'Coins', status: 'ปกติ', statusClass: 'text-green-500' },
        { name: 'Thunder Team Coins', category: 'CTRL G', amount: teamCoins.thunder || 0, unit: 'Coins', status: 'ปกติ', statusClass: 'text-green-500' },
        { name: 'Dragon Team Coins', category: 'CTRL G', amount: teamCoins.dragon || 0, unit: 'Coins', status: 'ปกติ', statusClass: 'text-green-500' },
        { name: 'Movie Token', category: 'Colestai', amount: movieTokens, unit: 'Token', status: 'ปกติ', statusClass: 'text-green-500' },
        { name: 'FULL SENSE Token', category: 'CTRL G', amount: gameTokens, unit: 'Token', status: 'ปกติ', statusClass: 'text-green-500' },
    ];

    table.innerHTML = rows.map(row => `
        <tr class="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
            <td class="py-3 px-4">
                <span class="font-medium text-slate-700">${row.name}</span>
            </td>
            <td class="py-3 px-4 text-center">
                <span class="inline-block px-2 py-0.5 text-xs rounded-full bg-blue-50 text-blue-600">${row.category}</span>
            </td>
            <td class="py-3 px-4 text-right">
                <span class="font-bold text-slate-900">${row.amount.toLocaleString()}</span>
                <span class="text-xs text-slate-400 ml-1">${row.unit}</span>
            </td>
            <td class="py-3 px-4 text-right">
                <span class="text-xs font-medium ${row.statusClass}">${row.status}</span>
            </td>
        </tr>
    `).join('');
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
        const colorClass = isPositive ? 'text-primary' : 'text-slate-700';
        const iconClass = isPositive ? 'fa-arrow-down text-primary' : 'fa-arrow-up text-slate-600';
        const bgClass = isPositive ? 'bg-primary/10' : 'bg-slate-100';

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
            <div class="flex items-center justify-between p-4 rounded-xl bg-white border border-gray-100 hover:bg-gray-50 transition-colors shadow-sm">
                <div class="flex items-center gap-4">
                    <div class="w-10 h-10 rounded-full ${bgClass} flex items-center justify-center shrink-0">
                        <i class="fas ${iconClass}"></i>
                    </div>
                    <div>
                        <p class="font-bold text-slate-900 mb-1">${desc}</p>
                        <p class="text-xs text-slate-500">${dateStr}</p>
                    </div>
                </div>
                <div class="text-right">
                    <p class="font-bold text-lg ${colorClass}">
                        ${isPositive ? '+' : ''}${parseInt(t.amount).toLocaleString()}
                    </p>
                    <p class="text-xs text-slate-400">Flips</p>
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

// ============================================
// TOKEN DETAIL MODAL
// ============================================

function openTokenDetail(type) {
    const modal = document.getElementById('tokenDetailModal');
    const header = document.getElementById('tokenModalHeader');
    const title = document.getElementById('tokenModalTitle');
    const iconContainer = document.getElementById('tokenModalIconContainer');

    if (!modal || !header || !list) return;

    let tokenDetails = [];
    let totalTokens = 0;

    if (type === 'movie') {
        header.style.background = 'linear-gradient(135deg, #ef4444, #f97316)';
        title.textContent = currentLanguage === 'th' ? 'Movie Token' : 'Movie Token';

        // Restore Icon
        if (iconContainer) {
            iconContainer.innerHTML = '<i id="tokenModalIcon" class="fas fa-film text-2xl"></i>';
        } else if (icon) {
            icon.className = 'fas fa-film text-2xl';
        }

        tokenDetails = walletData.movieTokenDetails || [];
        totalTokens = walletData.movieTokens || 0;
    } else {
        // FULL SENSE Branding
        header.style.background = 'linear-gradient(135deg, #f97316, #000000)';
        title.textContent = 'FULL SENSE Token';

        // Use Image
        if (iconContainer) {
            iconContainer.innerHTML = '<img src="../images/full_sense_token.png" class="w-full h-full object-contain">';
        }

        tokenDetails = walletData.gameTokenDetails || [];
        totalTokens = walletData.gameTokens || 0;
    }

    total.textContent = totalTokens.toLocaleString();

    // Render token list
    if (tokenDetails.length === 0) {
        list.innerHTML = `
            <div class="text-center py-8">
                <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i class="fas ${type === 'movie' ? 'fa-film' : 'fa-gamepad'} text-2xl text-gray-300"></i>
                </div>
                <p class="text-gray-500">${currentLanguage === 'th' ? 'ยังไม่มี Token' : 'No tokens yet'}</p>
            </div>
        `;
    } else {
        list.innerHTML = tokenDetails.map(item => {
            const itemTitle = currentLanguage === 'th' ? item.titleTh : item.title;
            const bgColor = type === 'movie' ? 'from-orange-500 to-red-500' : 'from-orange-500 to-slate-900';

            return `
                <div class="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors">
                    <div class="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 shadow-md">
                        <img src="${item.image}" alt="${itemTitle}" class="w-full h-full object-cover" onerror="this.src='../images/privilege_mystery.png'">
                    </div>
                    <div class="flex-1 min-w-0">
                        <h4 class="font-bold text-gray-900 truncate">${itemTitle}</h4>
                        <p class="text-sm text-gray-500">${type === 'movie' ? (currentLanguage === 'th' ? 'ภาพยนตร์' : 'Movie') : 'FULL SENSE'}</p>
                    </div>
                    <div class="text-right flex-shrink-0">
                        <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r ${bgColor} text-white">
                            ${type === 'movie' ? '<i class="fas fa-ticket-alt text-xs"></i>' : '<img src="../images/full_sense_token.png" class="w-3 h-3 object-contain brightness-0 invert">'}
                            <span class="font-bold">${item.tokens}</span>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    // Show modal
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function closeTokenModal() {
    const modal = document.getElementById('tokenDetailModal');
    if (modal) {
        modal.classList.add('hidden');
        document.body.style.overflow = '';
    }
}
