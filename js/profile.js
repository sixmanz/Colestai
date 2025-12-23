
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
    tabDigital.className = 'tab-btn px-6 py-4 text-slate-500 font-medium border-b-2 border-transparent hover:text-primary transition-colors flex items-center gap-2';
    tabPhysical.className = 'tab-btn px-6 py-4 text-slate-500 font-medium border-b-2 border-transparent hover:text-primary transition-colors flex items-center gap-2';

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

// ============================================
// HELP & SUPPORT
// ============================================

function openHelpModal(type) {
    const content = {
        faq: {
            title: currentLanguage === 'th' ? 'คำถามที่พบบ่อย' : 'Frequently Asked Questions',
            icon: 'fa-question-circle',
            color: '#3b82f6',
            items: [
                {
                    q: currentLanguage === 'th' ? 'Flips Coins คืออะไร?' : 'What are Flips Coins?',
                    a: currentLanguage === 'th' ? 'Flips Coins คือคะแนนสะสมที่ใช้แลกสิทธิพิเศษต่างๆ จากการลงทุนในโปรเจค' : 'Flips Coins are reward points earned from your investments that can be redeemed for exclusive privileges.'
                },
                {
                    q: currentLanguage === 'th' ? 'Token หนังและเกมส์ต่างกันอย่างไร?' : 'What is the difference between Movie and FULL SENSE Tokens?',
                    a: currentLanguage === 'th' ? 'Token หนังใช้แลกสิทธิพิเศษในหมวดภาพยนตร์ ส่วน FULL SENSE Token ใช้แลกสิทธิพิเศษในหมวด FULL SENSE' : 'Movie Tokens are used for film-related privileges, while FULL SENSE Tokens are for FULL SENSE privileges.'
                },
                {
                    q: currentLanguage === 'th' ? 'คะแนนหมดอายุเมื่อไหร่?' : 'When do points expire?',
                    a: currentLanguage === 'th' ? 'คะแนนจะหมดอายุตามที่ระบุในกระเป๋าเงินของคุณ โดยทั่วไปจะมีอายุ 1 ปี' : 'Points expire as shown in your wallet. Typically, points are valid for 1 year.'
                }
            ]
        },
        contact: {
            title: currentLanguage === 'th' ? 'ติดต่อฝ่ายสนับสนุน' : 'Contact Support',
            icon: 'fa-headset',
            color: '#22c55e',
            items: [
                { label: 'Email', value: 'support@flipsid.com', icon: 'fa-envelope' },
                { label: 'Phone', value: '02-xxx-xxxx', icon: 'fa-phone' },
                { label: 'LINE', value: '@flipsid', icon: 'fab fa-line' },
                { label: currentLanguage === 'th' ? 'เวลาทำการ' : 'Hours', value: currentLanguage === 'th' ? 'จันทร์-ศุกร์ 9:00-18:00' : 'Mon-Fri 9:00-18:00', icon: 'fa-clock' }
            ]
        },
        terms: {
            title: currentLanguage === 'th' ? 'ข้อกำหนดและความเป็นส่วนตัว' : 'Terms & Privacy',
            icon: 'fa-file-contract',
            color: '#a855f7',
            items: [
                { title: currentLanguage === 'th' ? 'ข้อกำหนดการใช้งาน' : 'Terms of Service', desc: currentLanguage === 'th' ? 'เงื่อนไขการใช้บริการแอปพลิเคชัน' : 'Conditions for using the application' },
                { title: currentLanguage === 'th' ? 'นโยบายความเป็นส่วนตัว' : 'Privacy Policy', desc: currentLanguage === 'th' ? 'การเก็บรักษาและใช้ข้อมูลส่วนบุคคล' : 'How we collect and use personal data' },
                { title: currentLanguage === 'th' ? 'นโยบายคุกกี้' : 'Cookie Policy', desc: currentLanguage === 'th' ? 'การใช้งานคุกกี้บนเว็บไซต์' : 'How we use cookies on our website' }
            ]
        }
    };

    const data = content[type];
    if (!data) return;

    let bodyContent = '';

    if (type === 'faq') {
        bodyContent = data.items.map((item, i) => `
            <div class="border-b border-gray-100 pb-4 mb-4 last:border-0 last:pb-0 last:mb-0">
                <h4 class="font-bold text-slate-900 mb-2 flex items-start gap-2">
                    <span class="text-primary">${i + 1}.</span>
                    ${item.q}
                </h4>
                <p class="text-slate-600 text-sm pl-5">${item.a}</p>
            </div>
        `).join('');
    } else if (type === 'contact') {
        bodyContent = data.items.map(item => `
            <div class="flex items-center gap-4 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                <div class="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
                    <i class="${item.icon.includes('fab') ? item.icon : 'fas ' + item.icon} text-green-500"></i>
                </div>
                <div>
                    <p class="text-sm text-slate-500">${item.label}</p>
                    <p class="font-bold text-slate-900">${item.value}</p>
                </div>
            </div>
        `).join('');
    } else if (type === 'terms') {
        bodyContent = data.items.map(item => `
            <a href="#" class="block p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                <h4 class="font-bold text-slate-900 mb-1">${item.title}</h4>
                <p class="text-sm text-slate-500">${item.desc}</p>
            </a>
        `).join('');
    }

    // Create dynamic modal
    const existingModal = document.getElementById('helpModal');
    if (existingModal) existingModal.remove();

    const modal = document.createElement('div');
    modal.id = 'helpModal';
    modal.className = 'fixed inset-0 z-[100]';
    modal.innerHTML = `
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" onclick="closeHelpModal()"></div>
        <div class="absolute inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div class="p-6 border-b border-gray-100 flex items-center justify-between" style="background: linear-gradient(135deg, ${data.color}10, ${data.color}05)">
                <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-xl flex items-center justify-center" style="background: ${data.color}20">
                        <i class="fas ${data.icon} text-lg" style="color: ${data.color}"></i>
                    </div>
                    <h3 class="font-bold text-lg text-slate-900">${data.title}</h3>
                </div>
                <button onclick="closeHelpModal()" class="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">
                    <i class="fas fa-times text-gray-500"></i>
                </button>
            </div>
            <div class="flex-1 overflow-y-auto p-6 space-y-3">
                ${bodyContent}
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
}

function closeHelpModal() {
    const modal = document.getElementById('helpModal');
    if (modal) {
        modal.remove();
        document.body.style.overflow = '';
    }
}

function logout() {
    if (confirm(currentLanguage === 'th' ? 'คุณต้องการออกจากระบบหรือไม่?' : 'Are you sure you want to logout?')) {
        // Clear user data
        localStorage.removeItem('walletData');
        localStorage.removeItem('userVouchers');

        showToast(currentLanguage === 'th' ? 'ออกจากระบบสำเร็จ' : 'Logged out successfully', 'success');

        // Redirect to home after a short delay
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);
    }
}
