
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

// Helper function to normalize image paths
function normalizeImagePath(path) {
    if (!path) return '../images/privilege_mystery.png';

    // If path doesn't start with '../', fix it
    if (path.startsWith('images/')) {
        return '../' + path;
    }
    if (!path.startsWith('../') && !path.startsWith('http')) {
        return '../images/' + path.split('/').pop();
    }
    return path;
}

function createDigitalCard(item) {
    // Handle bilingual title
    const title = currentLanguage === 'th' && item.titleTh ? item.titleTh : item.title;
    const categoryLabel = currentLanguage === 'th' && item.categoryLabelTh ? item.categoryLabelTh : item.categoryLabel;

    // Find category for icon/color
    const category = privilegeCategories.find(c => c.id === item.category) || privilegeCategories[0];

    // Normalize image path
    const imagePath = normalizeImagePath(item.image);

    // Format dates
    const bookedDate = new Date(item.bookedAt);
    const dateStr = bookedDate.toLocaleDateString(currentLanguage === 'th' ? 'th-TH' : 'en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
    const timeStr = bookedDate.toLocaleTimeString(currentLanguage === 'th' ? 'th-TH' : 'en-US', {
        hour: '2-digit',
        minute: '2-digit'
    });

    // Usage status
    const isUsed = item.used || false;
    const statusBadge = isUsed
        ? `<span class="px-2 py-1 rounded-full bg-gray-100 text-gray-500 text-xs font-medium"><i class="fas fa-check-circle mr-1"></i>ใช้งานแล้ว</span>`
        : `<span class="px-2 py-1 rounded-full bg-green-100 text-green-600 text-xs font-medium"><i class="fas fa-clock mr-1"></i>พร้อมใช้งาน</span>`;

    // Price display
    const priceDisplay = item.price ? item.price.toLocaleString() + ' Flips' : '-';

    return `
        <div class="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-blue-200 hover:shadow-lg transition-all cursor-pointer flex flex-col group"
             onclick="openQRModal('${item.code}', '${title.replace(/'/g, "\\'")}', '${item.bookedAt}', ${JSON.stringify(item).replace(/"/g, '&quot;')})">
            
            <!-- Image Section -->
            <div class="h-36 relative overflow-hidden">
                <img src="${imagePath}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" onerror="this.src='../images/privilege_mystery.png'">
                <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                
                <!-- Category Badge -->
                <div class="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-sm text-xs font-medium text-slate-700 flex items-center gap-1.5">
                    <i class="${category?.icon || 'fas fa-gift'} text-blue-primary text-xs"></i>
                    ${categoryLabel || 'สิทธิพิเศษ'}
                </div>

                <!-- Status Badge -->
                <div class="absolute top-3 right-3">
                    ${statusBadge}
                </div>
            </div>
            
            <!-- Content Section -->
            <div class="p-5 flex-grow flex flex-col">
                <h4 class="font-bold text-lg mb-2 leading-tight text-slate-800 group-hover:text-blue-primary transition-colors line-clamp-2">${title}</h4>
                
                <!-- Details Grid -->
                <div class="grid grid-cols-2 gap-3 mb-4 text-sm">
                    <div class="bg-gray-50 rounded-lg p-2.5">
                        <p class="text-slate-400 text-xs mb-0.5">ใช้ไป</p>
                        <p class="font-semibold text-slate-700">${priceDisplay}</p>
                    </div>
                    <div class="bg-gray-50 rounded-lg p-2.5">
                        <p class="text-slate-400 text-xs mb-0.5">รหัสวอเชอร์</p>
                        <p class="font-mono text-xs font-semibold text-blue-primary">${item.code}</p>
                    </div>
                </div>

                <!-- Redemption Date -->
                <div class="flex items-center gap-2 text-sm text-slate-500 mb-4">
                    <i class="fas fa-calendar-alt text-blue-primary"></i>
                    <span>แลกเมื่อ ${dateStr} เวลา ${timeStr}</span>
                </div>
                
                <!-- QR Button -->
                <div class="mt-auto">
                    <button class="w-full py-3 rounded-xl bg-gradient-to-r from-blue-primary to-secondary text-white text-sm font-semibold transition-all flex items-center justify-center gap-2 hover:shadow-lg hover:scale-[1.02]">
                        <i class="fas fa-qrcode"></i>
                        <span>${currentLanguage === 'th' ? 'แสดง QR Code' : 'Show QR Code'}</span>
                    </button>
                </div>
            </div>
        </div>
    `;
}

function createPhysicalRow(item) {
    const title = currentLanguage === 'th' && item.titleTh ? item.titleTh : item.title;
    const orderDate = new Date(item.bookedAt);
    const orderDateStr = orderDate.toLocaleDateString(currentLanguage === 'th' ? 'th-TH' : 'en-US', {
        year: 'numeric', month: 'short', day: 'numeric'
    });
    const orderTimeStr = orderDate.toLocaleTimeString(currentLanguage === 'th' ? 'th-TH' : 'en-US', {
        hour: '2-digit', minute: '2-digit'
    });

    // Mock shipping data based on order date
    const daysSinceOrder = Math.floor((Date.now() - orderDate.getTime()) / (1000 * 60 * 60 * 24));

    // Determine status based on days since order
    let status, statusLabel, statusColor, statusBg, progress;
    let shippedDate = null;
    let deliveredDate = null;
    let trackingNumber = 'TH' + Math.random().toString(36).substr(2, 12).toUpperCase();
    let courier = 'Kerry Express';
    let currentLocation = '';

    if (daysSinceOrder >= 5) {
        status = 'delivered';
        statusLabel = 'จัดส่งสำเร็จ';
        statusColor = 'text-green-600';
        statusBg = 'bg-green-100';
        progress = 100;
        shippedDate = new Date(orderDate.getTime() + 2 * 24 * 60 * 60 * 1000);
        deliveredDate = new Date(orderDate.getTime() + 5 * 24 * 60 * 60 * 1000);
        currentLocation = 'ส่งถึงผู้รับเรียบร้อย';
    } else if (daysSinceOrder >= 2) {
        status = 'shipped';
        statusLabel = 'กำลังจัดส่ง';
        statusColor = 'text-blue-600';
        statusBg = 'bg-blue-100';
        progress = 66;
        shippedDate = new Date(orderDate.getTime() + 2 * 24 * 60 * 60 * 1000);
        currentLocation = 'ศูนย์กระจายสินค้า กรุงเทพฯ';
    } else if (daysSinceOrder >= 1) {
        status = 'processing';
        statusLabel = 'กำลังเตรียมจัดส่ง';
        statusColor = 'text-amber-600';
        statusBg = 'bg-amber-100';
        progress = 33;
        currentLocation = 'คลังสินค้า FLIPS';
    } else {
        status = 'confirmed';
        statusLabel = 'ยืนยันออเดอร์แล้ว';
        statusColor = 'text-slate-600';
        statusBg = 'bg-slate-100';
        progress = 10;
        currentLocation = 'รอดำเนินการ';
    }

    const shippedDateStr = shippedDate ? shippedDate.toLocaleDateString('th-TH', { day: 'numeric', month: 'short' }) : '-';
    const deliveredDateStr = deliveredDate ? deliveredDate.toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' }) : 'กำลังจัดส่ง';

    // Price display
    const priceDisplay = item.price ? item.price.toLocaleString() + ' Flips' : '-';

    // Normalize image path
    const imagePath = normalizeImagePath(item.image);

    return `
        <div class="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all">
            <!-- Header -->
            <div class="p-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                <div class="flex flex-wrap justify-between items-center gap-3">
                    <div>
                        <p class="text-xs text-slate-400 mb-1">หมายเลขคำสั่งซื้อ</p>
                        <p class="font-mono font-bold text-slate-800">#${item.code}</p>
                    </div>
                    <span class="px-3 py-1.5 rounded-full ${statusBg} ${statusColor} text-sm font-semibold flex items-center gap-1.5">
                        <i class="fas ${status === 'delivered' ? 'fa-check-circle' : status === 'shipped' ? 'fa-truck' : 'fa-clock'}"></i>
                        ${statusLabel}
                    </span>
                </div>
            </div>

            <!-- Main Content -->
            <div class="p-5">
                <div class="flex flex-col md:flex-row gap-5">
                    <!-- Image -->
                    <div class="w-full md:w-28 h-28 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
                        <img src="${imagePath}" class="w-full h-full object-cover" onerror="this.src='../images/privilege_mystery.png'">
                    </div>
                    
                    <!-- Product Info -->
                    <div class="flex-grow">
                        <h4 class="font-bold text-lg text-slate-800 mb-2">${title}</h4>
                        
                        <!-- Info Grid -->
                        <div class="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm mb-4">
                            <div>
                                <p class="text-slate-400 text-xs mb-0.5">ใช้ไป</p>
                                <p class="font-semibold text-slate-700">${priceDisplay}</p>
                            </div>
                            <div>
                                <p class="text-slate-400 text-xs mb-0.5">สั่งซื้อเมื่อ</p>
                                <p class="font-semibold text-slate-700">${orderDateStr}</p>
                            </div>
                            <div>
                                <p class="text-slate-400 text-xs mb-0.5">จัดส่งโดย</p>
                                <p class="font-semibold text-slate-700">${courier}</p>
                            </div>
                            <div>
                                <p class="text-slate-400 text-xs mb-0.5">เลขพัสดุ</p>
                                <p class="font-mono text-xs font-semibold text-blue-primary">${trackingNumber}</p>
                            </div>
                        </div>

                        <!-- Current Location -->
                        <div class="flex items-center gap-2 text-sm bg-blue-50 rounded-lg px-3 py-2 mb-4">
                            <i class="fas fa-map-marker-alt text-blue-primary"></i>
                            <span class="text-slate-600">สถานะล่าสุด: <strong class="text-slate-800">${currentLocation}</strong></span>
                        </div>
                    </div>
                </div>

                <!-- Tracking Timeline -->
                <div class="mt-5 pt-5 border-t border-gray-100">
                    <p class="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
                        <i class="fas fa-route text-blue-primary"></i>
                        ติดตามสถานะการจัดส่ง
                    </p>
                    
                    <!-- Progress Bar -->
                    <div class="relative mb-6">
                        <div class="h-2 bg-gray-100 rounded-full">
                            <div class="h-2 bg-gradient-to-r from-blue-primary to-secondary rounded-full transition-all duration-500" style="width: ${progress}%"></div>
                        </div>
                    </div>

                    <!-- Timeline Steps -->
                    <div class="flex justify-between text-center">
                        <!-- Step 1: Order Confirmed -->
                        <div class="flex flex-col items-center w-1/4">
                            <div class="w-10 h-10 rounded-full ${progress >= 10 ? 'bg-blue-primary' : 'bg-gray-200'} flex items-center justify-center mb-2">
                                <i class="fas fa-check text-white text-sm"></i>
                            </div>
                            <p class="text-xs font-medium ${progress >= 10 ? 'text-slate-800' : 'text-slate-400'}">ยืนยันแล้ว</p>
                            <p class="text-[10px] text-slate-400 mt-0.5">${orderDateStr}</p>
                        </div>
                        
                        <!-- Step 2: Processing -->
                        <div class="flex flex-col items-center w-1/4">
                            <div class="w-10 h-10 rounded-full ${progress >= 33 ? 'bg-blue-primary' : 'bg-gray-200'} flex items-center justify-center mb-2">
                                <i class="fas fa-box ${progress >= 33 ? 'text-white' : 'text-gray-400'} text-sm"></i>
                            </div>
                            <p class="text-xs font-medium ${progress >= 33 ? 'text-slate-800' : 'text-slate-400'}">เตรียมจัดส่ง</p>
                            <p class="text-[10px] text-slate-400 mt-0.5">${progress >= 33 ? 'ดำเนินการแล้ว' : 'รอดำเนินการ'}</p>
                        </div>
                        
                        <!-- Step 3: Shipped -->
                        <div class="flex flex-col items-center w-1/4">
                            <div class="w-10 h-10 rounded-full ${progress >= 66 ? 'bg-blue-primary' : 'bg-gray-200'} flex items-center justify-center mb-2">
                                <i class="fas fa-truck ${progress >= 66 ? 'text-white' : 'text-gray-400'} text-sm"></i>
                            </div>
                            <p class="text-xs font-medium ${progress >= 66 ? 'text-slate-800' : 'text-slate-400'}">กำลังจัดส่ง</p>
                            <p class="text-[10px] text-slate-400 mt-0.5">${shippedDateStr}</p>
                        </div>
                        
                        <!-- Step 4: Delivered -->
                        <div class="flex flex-col items-center w-1/4">
                            <div class="w-10 h-10 rounded-full ${progress >= 100 ? 'bg-green-500' : 'bg-gray-200'} flex items-center justify-center mb-2">
                                <i class="fas fa-home ${progress >= 100 ? 'text-white' : 'text-gray-400'} text-sm"></i>
                            </div>
                            <p class="text-xs font-medium ${progress >= 100 ? 'text-green-600' : 'text-slate-400'}">จัดส่งสำเร็จ</p>
                            <p class="text-[10px] text-slate-400 mt-0.5">${deliveredDateStr}</p>
                        </div>
                    </div>
                </div>

                <!-- Address Section (for delivered/shipped items) -->
                ${status === 'shipped' || status === 'delivered' ? `
                <div class="mt-5 pt-5 border-t border-gray-100">
                    <p class="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                        <i class="fas fa-map-pin text-blue-primary"></i>
                        ที่อยู่จัดส่ง
                    </p>
                    <div class="bg-gray-50 rounded-xl p-4 text-sm text-slate-600">
                        <p class="font-medium text-slate-800 mb-1">คุณ FLIPS ID User</p>
                        <p>123/45 ถนนสุขุมวิท แขวงคลองตัน</p>
                        <p>เขตคลองเตย กรุงเทพมหานคร 10110</p>
                        <p class="mt-2 text-slate-500"><i class="fas fa-phone text-xs mr-1"></i> 081-234-5678</p>
                    </div>
                </div>
                ` : ''}
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
