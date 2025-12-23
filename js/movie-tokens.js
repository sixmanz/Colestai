// ============================================
// MOVIE TOKENS PAGE LOGIC
// ============================================

document.addEventListener('DOMContentLoaded', initMovieTokensPage);

function initMovieTokensPage() {
    // 1. Init Data
    initWalletData();

    // 2. Render Token List
    renderMovieTokens();

    // 3. Update Language
    updateContentLanguage();

    // 4. Header Points
    updatePointsDisplay();
}

function renderMovieTokens() {
    const listContainer = document.getElementById('movieTokenList');
    const totalEl = document.getElementById('totalMovieTokens');
    const countEl = document.getElementById('movieCount');

    if (!listContainer) return;

    const tokenDetails = walletData.movieTokenDetails || [];
    const totalTokens = walletData.movieTokens || 0;

    // Update summary
    if (totalEl) totalEl.textContent = totalTokens.toLocaleString();
    if (countEl) countEl.textContent = tokenDetails.length;

    // Render list
    if (tokenDetails.length === 0) {
        listContainer.innerHTML = `
            <div class="p-12 text-center">
                <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i class="fas fa-film text-2xl text-gray-300"></i>
                </div>
                <p class="text-gray-500">${currentLanguage === 'th' ? 'ยังไม่มี Token หนัง' : 'No movie tokens yet'}</p>
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
            <div onclick="openTokenItemModal(${index}, 'movie')" class="p-6 flex items-center gap-4 hover:bg-gray-50 transition-colors cursor-pointer group">
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
                    <div class="px-4 py-2 rounded-full font-bold text-white" style="background: linear-gradient(135deg, #ef4444, #f97316);">
                        <i class="fas fa-ticket-alt mr-1"></i>
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
const originalToggleLanguageMovieTokens = toggleLanguage;
toggleLanguage = function () {
    originalToggleLanguageMovieTokens();
    renderMovieTokens();
}
