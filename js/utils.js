let currentLanguage = 'en';
let walletData = { ...defaultWalletData };
let userVouchers = [];

function toggleLanguage() {
    currentLanguage = currentLanguage === 'en' ? 'th' : 'en';
    const langSpan = document.getElementById('currentLang');
    if (langSpan) langSpan.textContent = currentLanguage.toUpperCase();

    updateContentLanguage();

    // Trigger re-render depending on the page
    if (typeof renderFilterTabs === 'function') renderFilterTabs();
    if (typeof renderPackages === 'function') renderPackages();
    if (typeof renderPackage === 'function') renderPackage(); // For details page
    if (typeof renderRelated === 'function') renderRelated(); // For details page

    showToast(currentLanguage === 'en' ? 'Language changed to English' : 'เปลี่ยนภาษาเป็นไทย', 'success');
}

function updateContentLanguage() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[currentLanguage][key]) {
            if (el.tagName === 'INPUT' && el.getAttribute('placeholder')) {
                el.placeholder = translations[currentLanguage][key];
            } else {
                el.textContent = translations[currentLanguage][key];
            }
        }
    });

    // Update modal elements if they exist
    const reviewCount = document.getElementById('reviewCount');
    if (reviewCount) {
        // This is handled in render functions usually, but static text updates here
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

function openModal(id) {
    const modal = document.getElementById(id);
    if (modal) modal.classList.remove('hidden');
}

function closeModal(id) {
    const modal = document.getElementById(id);
    if (modal) modal.classList.add('hidden');
}

function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString(currentLanguage === 'th' ? 'th-TH' : 'en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function initWalletData() {
    const savedWallet = localStorage.getItem('walletData');
    if (savedWallet) {
        const parsed = JSON.parse(savedWallet);
        // Migration logic
        if (parsed.totalPoints < 50000) {
            parsed.totalPoints = 50000;
            localStorage.setItem('walletData', JSON.stringify(parsed));
        }
        Object.assign(walletData, parsed);
    } else {
        localStorage.setItem('walletData', JSON.stringify(walletData));
    }
    userVouchers = JSON.parse(localStorage.getItem('userVouchers') || '[]');
}

function updatePointsDisplay() {
    const expiringSoon = walletData.pointsBatches
        .filter(b => b.status === 'expiring_soon')
        .reduce((sum, b) => sum + b.amount, 0);

    const headerPoints = document.getElementById('headerPoints');
    if (headerPoints) headerPoints.textContent = walletData.totalPoints.toLocaleString();

    // For wallet modals
    const userBalance = document.getElementById('userBalance'); // In details page
    if (userBalance) userBalance.textContent = walletData.totalPoints.toLocaleString();

    const walletTotalPoints = document.getElementById('walletTotalPoints');
    if (walletTotalPoints) walletTotalPoints.textContent = walletData.totalPoints.toLocaleString();

    const expiringPoints = document.getElementById('expiringPoints');
    if (expiringPoints) expiringPoints.textContent = expiringSoon.toLocaleString() + ' RDS';
}

function renderWallet() {
    const t = translations[currentLanguage];
    const totalEl = document.getElementById('walletTotalPoints');
    if (totalEl) totalEl.textContent = walletData.totalPoints.toLocaleString();

    const breakdownHtml = walletData.pointsBatches.map(batch => {
        const expiryDate = new Date(batch.expiryDate);
        const today = new Date();
        const daysUntilExpiry = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));
        const isExpiringSoon = daysUntilExpiry <= 30 && daysUntilExpiry > 0;

        return `
            <div class="glass-card rounded-xl p-4">
                <div class="flex items-center justify-between mb-2">
                    <span class="font-semibold">${batch.amount.toLocaleString()} RDS</span>
                    <span class="px-2 py-1 rounded-full text-xs ${isExpiringSoon ? 'bg-yellow-500/20 text-yellow-400' : 'bg-green-500/20 text-green-400'}">
                        ${isExpiringSoon ? (currentLanguage === 'th' ? t.hero_expiring : 'Expiring Soon') : (currentLanguage === 'th' ? t.status_active : 'Active')}
                    </span>
                </div>
                <p class="text-white/50 text-sm">${batch.source}</p>
                <div class="flex items-center justify-between mt-2 text-xs text-white/40">
                    <span>${t.nav_home === 'หน้าหลัก' ? 'ได้รับเมื่อ' : 'Earned'}: ${formatDate(batch.earnedDate)}</span>
                    <span class="${isExpiringSoon ? 'text-yellow-400' : ''}">${t.nav_home === 'หน้าหลัก' ? 'หมดอายุ' : 'Expires'}: ${formatDate(batch.expiryDate)}</span>
                </div>
            </div>
        `;
    }).join('');

    const pointsBreakdown = document.getElementById('pointsBreakdown');
    if (pointsBreakdown) pointsBreakdown.innerHTML = breakdownHtml;

    const expiringSoon = walletData.pointsBatches.filter(b => b.status === 'expiring_soon');
    const expiringAmount = expiringSoon.reduce((sum, b) => sum + b.amount, 0);

    const expiryWarning = document.getElementById('expiryWarning');
    if (expiryWarning) {
        expiryWarning.textContent = currentLanguage === 'th'
            ? `${expiringAmount.toLocaleString()} คะแนนกำลังจะหมดอายุใน 30 วัน`
            : `${expiringAmount.toLocaleString()} points expiring in the next 30 days`;
    }

    const transactionsHtml = walletData.transactions.map(t => `
        <div class="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
            <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-full ${t.type === 'earn' ? 'bg-green-500/20' : 'bg-red-500/20'} flex items-center justify-center">
                    <i class="fas ${t.type === 'earn' ? 'fa-arrow-down text-green-400' : 'fa-arrow-up text-red-400'} text-sm"></i>
                </div>
                <div>
                    <p class="text-sm">${t.description}</p>
                    <p class="text-xs text-white/40">${formatDate(t.date)}</p>
                </div>
            </div>
            <span class="font-semibold ${t.amount > 0 ? 'text-green-400' : 'text-red-400'}">
                ${t.amount > 0 ? '+' : ''}${t.amount.toLocaleString()} RDS
            </span>
        </div>
    `).join('');

    const transactionsList = document.getElementById('transactionsList');
    if (transactionsList) transactionsList.innerHTML = transactionsHtml;
}

function renderVouchers() {
    const container = document.getElementById('vouchersList');
    const t = translations[currentLanguage];

    if (userVouchers.length === 0) {
        container.innerHTML = `<p class="text-white/50 text-center py-8">${t.no_vouchers}</p>`;
    } else {
        container.innerHTML = userVouchers.map(v => {
            if (v.isShipped) {
                // Shipped product logic
                const orderDate = new Date(v.orderedAt);
                const deliveryDate = new Date(orderDate);
                deliveryDate.setDate(deliveryDate.getDate() + 10);
                const today = new Date();
                const daysLeft = Math.max(0, Math.ceil((deliveryDate - today) / (1000 * 60 * 60 * 24)));

                const statusColors = {
                    'processing': 'bg-blue-500/20 text-blue-400',
                    'packed': 'bg-yellow-500/20 text-yellow-400',
                    'shipped': 'bg-purple-500/20 text-purple-400',
                    'delivered': 'bg-green-500/20 text-green-400'
                };
                const statusColor = statusColors[v.status] || statusColors['processing'];

                return `
                    <div class="glass-card rounded-xl p-4">
                        <div class="flex items-center gap-4 mb-3">
                            <img src="${v.image}" alt="${v.title}" class="w-20 h-16 object-cover rounded-lg">
                            <div class="flex-1">
                                <h4 class="font-medium">${v.title}</h4>
                                <p class="text-white/50 text-sm">Order: ${v.orderId}</p>
                                <span class="inline-flex items-center gap-1 px-2 py-1 rounded-full ${statusColor} text-xs mt-1">
                                    <i class="fas fa-truck"></i> ${v.status.charAt(0).toUpperCase() + v.status.slice(1)}
                                </span>
                            </div>
                        </div>
                        <div class="bg-white/5 rounded-lg p-3 mb-3">
                            <div class="grid grid-cols-2 gap-3 text-sm">
                                <div>
                                    <p class="text-white/50">${t.order_date}</p>
                                    <p class="font-medium">${formatDate(orderDate)}</p>
                                </div>
                                <div>
                                    <p class="text-white/50">${t.expected_delivery}</p>
                                    <p class="font-medium text-green-400">${formatDate(deliveryDate)}</p>
                                </div>
                            </div>
                            <div class="mt-2 pt-2 border-t border-white/10 text-center">
                                <span class="${daysLeft > 0 ? 'text-purple-primary' : 'text-green-400'} font-medium">
                                    ${daysLeft > 0 ? (currentLanguage === 'th' ? `${daysLeft} วันก่อนส่งถึง` : `${daysLeft} days until delivery`) : (currentLanguage === 'th' ? 'ถึงเร็วๆ นี้' : 'Arriving soon!')}
                                </span>
                            </div>
                        </div>
                        <div class="border-t border-white/10 pt-3">
                            <p class="text-white/50 text-sm mb-1"><i class="fas fa-map-marker-alt mr-2"></i>${t.shipping_to}</p>
                            <p class="text-sm">${v.shippingInfo.firstName} ${v.shippingInfo.lastName}</p>
                        </div>
                    </div>
                `;
            } else {
                // Digital voucher logic
                return `
                    <div class="glass-card rounded-xl p-4 flex items-center gap-4">
                        <img src="${v.image}" alt="${v.title}" class="w-20 h-16 object-cover rounded-lg">
                        <div class="flex-1">
                            <h4 class="font-medium">${v.title}</h4>
                            <p class="text-white/50 text-sm">${t.code}: ${v.code}</p>
                            <p class="text-xs ${v.used ? 'text-white/30' : 'text-green-400'}">${v.used ? t.status_used : t.status_active}</p>
                        </div>
                        <button onclick='showVoucherQR(${JSON.stringify(v).replace(/'/g, "\\'")})' class="px-4 py-2 rounded-lg border border-purple-primary text-purple-primary hover:bg-purple-primary hover:text-white transition-all text-sm">
                            <i class="fas fa-qrcode mr-1"></i>QR
                        </button>
                    </div>
                `;
            }
        }).join('');
    }
}

function openWallet() {
    renderWallet();
    openModal('walletModal');
}

function openMyVouchers() {
    renderVouchers();
    openModal('vouchersModal');
}

function renderProfile() {
    // Update balance display
    const balanceEl = document.getElementById('profileBalance');
    if (balanceEl) balanceEl.textContent = walletData.totalPoints.toLocaleString() + ' RDS';

    const vouchersEl = document.getElementById('profileVouchers');
    if (vouchersEl) vouchersEl.textContent = userVouchers.length;

    // Calculate totals
    const earnedTransactions = walletData.transactions.filter(t => t.type === 'earn');
    const spentTransactions = walletData.transactions.filter(t => t.type === 'spend');
    const shippedOrders = userVouchers.filter(v => v.isShipped);

    const totalEarnedAmount = earnedTransactions.reduce((sum, t) => sum + t.amount, 0);
    const totalSpentAmount = Math.abs(spentTransactions.reduce((sum, t) => sum + t.amount, 0));

    const totalOrdersEl = document.getElementById('totalOrders');
    if (totalOrdersEl) totalOrdersEl.textContent = shippedOrders.length;

    const totalEarnedEl = document.getElementById('totalEarned');
    if (totalEarnedEl) totalEarnedEl.textContent = totalEarnedAmount.toLocaleString();

    const totalSpentEl = document.getElementById('totalSpent');
    if (totalSpentEl) totalSpentEl.textContent = totalSpentAmount.toLocaleString();

    const totalTransEl = document.getElementById('totalTransactions');
    if (totalTransEl) totalTransEl.textContent = walletData.transactions.length;

    // Render orders history with tracking
    const ordersHistoryEl = document.getElementById('ordersHistory');
    if (ordersHistoryEl) {
        const ordersHtml = shippedOrders.length ? shippedOrders.map(order => {
            const orderDate = new Date(order.orderedAt);
            const packingDate = new Date(orderDate);
            packingDate.setDate(packingDate.getDate() + 2);
            const shippedDate = new Date(orderDate);
            shippedDate.setDate(shippedDate.getDate() + 4);
            const deliveryDate = new Date(orderDate);
            deliveryDate.setDate(deliveryDate.getDate() + 10);
            const today = new Date();

            const formatDateShort = (date) => date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

            // Determine current status based on dates
            let currentStep = 1;
            if (today >= packingDate) currentStep = 2;
            if (today >= shippedDate) currentStep = 3;
            if (today >= deliveryDate) currentStep = 4;

            const steps = [
                { icon: 'fa-check', label: 'Ordered', date: formatDateShort(orderDate), active: currentStep >= 1, current: currentStep === 1 },
                { icon: 'fa-box', label: 'Packing', date: formatDateShort(packingDate), active: currentStep >= 2, current: currentStep === 2 },
                { icon: 'fa-shipping-fast', label: 'Shipped', date: formatDateShort(shippedDate), active: currentStep >= 3, current: currentStep === 3 },
                { icon: 'fa-home', label: 'Delivered', date: formatDateShort(deliveryDate), active: currentStep >= 4, current: currentStep === 4 }
            ];

            return `
                <div class="glass-card rounded-xl p-4 mb-4">
                    <div class="flex items-center gap-4 mb-4">
                        <img src="${order.image}" alt="${order.title}" class="w-16 h-16 object-cover rounded-lg">
                        <div class="flex-1">
                            <h4 class="font-medium">${order.title}</h4>
                            <p class="text-purple-primary text-sm font-mono">${order.orderId}</p>
                        </div>
                        <div class="text-right">
                            <p class="text-sm text-white/50">${order.price} RDS</p>
                        </div>
                    </div>
                    
                    <div class="bg-white/5 rounded-lg p-4 mb-4">
                        <div class="flex items-center justify-between mb-2 gap-2">
                            ${steps.map((step, idx) => `
                                <div class="flex flex-col items-center ${idx < steps.length - 1 ? 'flex-1' : ''}">
                                    <div class="w-8 h-8 rounded-full ${step.active ? (step.current ? 'btn-gradient' : 'bg-green-500') : 'bg-white/10 border border-white/30'} flex items-center justify-center mb-1">
                                        <i class="fas ${step.icon} text-xs ${step.active ? '' : 'text-white/50'}"></i>
                                    </div>
                                    <p class="text-[10px] sm:text-xs ${step.active ? 'text-white' : 'text-white/40'} text-center">${step.label}</p>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    
                    <div class="flex items-center justify-between p-3 bg-purple-primary/10 rounded-lg mb-3">
                        <div>
                            <p class="text-sm text-white/70">Status</p>
                            <p class="font-semibold text-purple-primary">${steps[currentStep - 1].label}</p>
                        </div>
                        <div class="text-right">
                            <p class="text-sm text-white/70">ETA</p>
                            <p class="font-semibold text-green-400">${formatDateShort(deliveryDate)}</p>
                        </div>
                    </div>
                </div>
            `;
        }).join('') : '<p class="text-white/50 text-center py-8">No orders yet.</p>';
        ordersHistoryEl.innerHTML = ordersHtml;
    }

    // Render earned history
    const earnedHistoryEl = document.getElementById('earnedHistory');
    if (earnedHistoryEl) {
        const earnedHtml = earnedTransactions.length ? earnedTransactions.map(t => `
            <div class="glass-card rounded-xl p-4 flex items-center gap-4 mb-2">
                <div class="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
                    <i class="fas fa-arrow-down text-green-400 text-xl"></i>
                </div>
                <div class="flex-1">
                    <h4 class="font-medium">${t.description}</h4>
                    <p class="text-white/50 text-sm">${t.date}</p>
                </div>
                <div class="text-right">
                    <p class="text-xl font-bold text-green-400">+${t.amount.toLocaleString()}</p>
                    <p class="text-white/50 text-sm">RDS</p>
                </div>
            </div>
        `).join('') : '<p class="text-white/50 text-center py-8">No earned points history</p>';
        earnedHistoryEl.innerHTML = earnedHtml;
    }

    // Render spent history
    const spentHistoryEl = document.getElementById('spentHistory');
    if (spentHistoryEl) {
        const spentHtml = spentTransactions.length ? spentTransactions.map(t => `
            <div class="glass-card rounded-xl p-4 flex items-center gap-4 mb-2">
                <div class="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center">
                    <i class="fas fa-arrow-up text-red-400 text-xl"></i>
                </div>
                <div class="flex-1">
                    <h4 class="font-medium">${t.description}</h4>
                    <p class="text-white/50 text-sm">${t.date}</p>
                </div>
                <div class="text-right">
                    <p class="text-xl font-bold text-red-400">${t.amount.toLocaleString()}</p>
                    <p class="text-white/50 text-sm">RDS</p>
                </div>
            </div>
        `).join('') : '<p class="text-white/50 text-center py-8">No spent points history</p>';
        spentHistoryEl.innerHTML = spentHtml;
    }
}

function openProfile() {
    renderProfile();
    openModal('profileModal');
}

function switchProfileTab(tab) {
    document.querySelectorAll('.profile-tab').forEach(btn => {
        const isActive = btn.dataset.tab === tab;
        btn.className = `profile-tab flex-1 py-3 rounded-xl font-medium ${isActive ? 'btn-gradient' : 'bg-white/5 border border-white/10 text-white/70'}`;
    });
    document.querySelectorAll('.profile-tab-content').forEach(content => content.classList.add('hidden'));
    document.getElementById(`profile-tab-${tab}`).classList.remove('hidden');
}

function toggleMobileMenu() {
    const menu = document.getElementById('mobileMenu');
    if (menu) menu.classList.toggle('hidden');
}

function showVoucherQR(voucher) {
    closeModal('vouchersModal');
    generateQR(voucher);
}

function generateQR(voucher) {
    const container = document.getElementById('qrcode');
    if (!container) return;

    document.getElementById('qrVoucherName').textContent = voucher.title;
    document.getElementById('qrVoucherCode').textContent = 'Code: ' + voucher.code;

    container.innerHTML = '';
    // Check if QRCode library is loaded
    if (typeof QRCode !== 'undefined') {
        new QRCode(container, {
            text: JSON.stringify({ code: voucher.code, package: voucher.title, date: voucher.date, quantity: voucher.quantity }),
            width: 200,
            height: 200,
            colorDark: '#000000',
            colorLight: '#ffffff',
            correctLevel: QRCode.CorrectLevel.H
        });
    } else {
        container.textContent = 'QR Library not loaded';
    }

    openModal('qrModal');
}

function downloadQR() {
    const canvas = document.querySelector('#qrcode canvas');
    if (canvas) {
        const link = document.createElement('a');
        link.download = 'FLIPS-ID-voucher-qr.png';
        link.href = canvas.toDataURL();
        link.click();
        showToast('QR Code downloaded!', 'success');
    }
}

function openSupport() {
    openModal('supportModal');
}

function submitSupport(e) {
    e.preventDefault();
    closeModal('supportModal');
    showToast('Message sent! We will contact you shortly.', 'success');
}

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
    // Default to Wyndham Phuket for demo
    window.open('https://maps.google.com/?q=Wyndham+Grand+Phuket+Kalim+Bay', '_blank');
}
