// ============================================
// GAME TOKENS PAGE LOGIC
// ============================================

document.addEventListener('DOMContentLoaded', initGameTokensPage);

function initGameTokensPage() {
    // 1. Init Data
    initWalletData();

    // 2. Render Token List
    renderGameTokens();

    // 3. Update Language
    updateContentLanguage();

    // 4. Header Points
    updatePointsDisplay();
}

function renderGameTokens() {
    const listContainer = document.getElementById('gameTokenList');
    const totalEl = document.getElementById('totalGameTokens');
    const countEl = document.getElementById('gameCount');

    if (!listContainer) return;

    const tokenDetails = walletData.gameTokenDetails || [];
    const totalTokens = walletData.gameTokens || 0;

    // Update summary
    if (totalEl) totalEl.textContent = totalTokens.toLocaleString();
    if (countEl) countEl.textContent = tokenDetails.length;

    // Render list
    if (tokenDetails.length === 0) {
        listContainer.innerHTML = `
            <div class="p-12 text-center">
                <div class="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 border border-orange-100 shadow-sm">
                    <img src="../images/full_sense_token.png" class="w-10 h-10 object-contain brightness-0 opacity-50">
                </div>
                <p class="text-gray-500">${currentLanguage === 'th' ? 'ยังไม่มี FULL SENSE Token' : 'No FULL SENSE tokens yet'}</p>
            </div>
        `;
        return;
    }

    listContainer.innerHTML = tokenDetails.map((item, index) => {
        const title = currentLanguage === 'th' ? item.titleTh : item.title;
        const source = currentLanguage === 'th' ? item.sourceTh : item.source;
        const date = new Date(item.earnedDate).toLocaleDateString(currentLanguage === 'th' ? 'th-TH' : 'en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });

        return `
            <div onclick="openTokenItemModal(${index}, 'game')" class="p-6 flex items-center gap-4 hover:bg-gray-50 transition-colors cursor-pointer group">
                <div class="w-16 h-16 rounded-xl overflow-hidden shadow-md flex-shrink-0">
                    <img src="${item.image}" alt="${title}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" onerror="this.src='../images/privilege_mystery.png'">
                </div>
                <div class="flex-1 min-w-0">
                    <h4 class="font-bold text-slate-900 mb-1 group-hover:text-primary transition-colors">${title}</h4>
                    <div class="flex items-center gap-4 text-sm text-slate-500">
                        <span class="flex items-center gap-1">
                            <i class="fas fa-calendar-alt text-xs"></i>
                            ${date}
                        </span>
                        <span class="flex items-center gap-1">
                            <i class="fas fa-tag text-xs"></i>
                            ${source}
                        </span>
                    </div>
                </div>
                <div class="flex items-center gap-2 flex-shrink-0">
                    <div class="px-4 py-2 rounded-full font-bold text-white flex items-center gap-2" style="background: linear-gradient(135deg, #f97316, #000000);">
                        <img src="../images/full_sense_token.png" class="w-4 h-4 object-contain brightness-0 invert">
                        ${item.tokens}
                    </div>
                    <i class="fas fa-chevron-right text-gray-300 group-hover:text-primary transition-colors"></i>
                </div>
            </div>
        `;
    }).join('');
}

function openTokenItemModal(index, type) {
    const modal = document.getElementById('tokenItemModal');
    if (!modal) return;

    const tokenDetails = type === 'movie' ? walletData.movieTokenDetails : walletData.gameTokenDetails;
    const item = tokenDetails[index];
    if (!item) return;

    const title = currentLanguage === 'th' ? item.titleTh : item.title;
    const source = currentLanguage === 'th' ? item.sourceTh : item.source;
    const description = currentLanguage === 'th' ? item.descriptionTh : item.description;
    const date = new Date(item.earnedDate).toLocaleDateString(currentLanguage === 'th' ? 'th-TH' : 'en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    document.getElementById('modalItemImage').src = item.image;
    document.getElementById('modalItemTitle').textContent = title;
    document.getElementById('modalItemTokens').textContent = item.tokens;
    document.getElementById('modalItemDate').textContent = date;
    document.getElementById('modalItemSource').textContent = source;
    document.getElementById('modalItemDescription').textContent = description;

    // Update Modal Badge Style
    const badge = document.querySelector('#tokenItemModal .rounded-full.font-bold');
    if (badge) {
        badge.style.background = 'linear-gradient(135deg, #f97316, #000000)';
        const icon = badge.querySelector('i');
        if (icon) {
            // Replace i with img if possible, or just hide i and append img if not already there
            // Easiest is to set innerHTML
            badge.innerHTML = `<img src="../images/full_sense_token.png" class="w-4 h-4 object-contain brightness-0 invert mr-1"> <span id="modalItemTokens">${item.tokens}</span> Token`;
        }
    }

    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function closeTokenItemModal() {
    const modal = document.getElementById('tokenItemModal');
    if (modal) {
        modal.classList.add('hidden');
        document.body.style.overflow = '';
    }
}

// Override utils toggleLanguage to re-render
const originalToggleLanguageGameTokens = toggleLanguage;
toggleLanguage = function () {
    originalToggleLanguageGameTokens();
    renderGameTokens();
}
