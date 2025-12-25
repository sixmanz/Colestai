// ============================================
// INDEX PAGE SPECIFIC JAVASCRIPT
// ============================================

/**
 * Handle shipping form submission for physical privileges
 * Note: pendingShippingPackage is set by js/privileges.js as window.pendingShippingPackage
 */
function submitPrivilegeShipping(e) {
    e.preventDefault();

    if (!window.pendingShippingPackage) {
        showToast('ไม่พบข้อมูลสินค้า กรุณาลองใหม่อีกครั้ง', 'error');
        return;
    }

    const privilege = window.pendingShippingPackage;
    const title = currentLanguage === 'th' ? privilege.titleTh : privilege.title;

    // Calculate estimated delivery
    const orderDate = new Date();
    const estimatedDelivery = new Date(orderDate);
    estimatedDelivery.setDate(estimatedDelivery.getDate() + 10);

    const shippingInfo = {
        firstName: document.getElementById('shipFirstName').value,
        lastName: document.getElementById('shipLastName').value,
        phone: document.getElementById('shipPhone').value,
        address: document.getElementById('shipAddress').value,
        notes: document.getElementById('shipNotes')?.value || ''
    };

    const voucherCode = 'PVL-' + Date.now().toString(36).toUpperCase();

    // Deduct points
    walletData.totalPoints -= privilege.price;
    walletData.transactions.unshift({
        type: 'spend',
        amount: -privilege.price,
        description: title + ' (จัดส่ง)',
        date: new Date().toISOString().split('T')[0]
    });

    // Create order
    const order = {
        ...privilege,
        code: voucherCode,
        shippingInfo,
        isShipped: true,
        orderedAt: new Date().toISOString(),
        status: 'processing',
        type: 'privilege',
        estimatedDelivery: estimatedDelivery.toISOString()
    };

    userVouchers.push(order);
    localStorage.setItem('userVouchers', JSON.stringify(userVouchers));
    localStorage.setItem('walletData', JSON.stringify(walletData));

    updatePointsDisplay();
    updatePrivilegeStats();
    renderPrivilegeCards();
    closeModal('shippingModal');

    // Show success - HIDE QR button, SHOW shipping info for physical items
    document.getElementById('successQrBtn').classList.add('hidden');
    document.getElementById('successShippingInfo').classList.remove('hidden');

    document.getElementById('bookingMessage').textContent = currentLanguage === 'th'
        ? `สำเร็จ! ใช้ ${privilege.price.toLocaleString()} Flips สำหรับ "${title}"`
        : `Success! Used ${privilege.price.toLocaleString()} Flips for "${title}"`;

    window.currentVoucherCode = voucherCode;
    window.currentVoucherName = title;

    openModal('bookingModal');

    // Trigger confetti for celebration
    if (typeof confetti === 'function') {
        confetti({
            origin: { x: 0.2, y: 0.6 },
            angle: 60,
            spread: 55,
            particleCount: 80,
            colors: ['#3b82f6', '#8b5cf6', '#10b981']
        });
        setTimeout(() => {
            confetti({
                origin: { x: 0.8, y: 0.6 },
                angle: 120,
                spread: 55,
                particleCount: 80,
                colors: ['#3b82f6', '#8b5cf6', '#10b981']
            });
        }, 200);
    }

    window.pendingShippingPackage = null;
}

/**
 * Open profile modal with redeemed privileges and shipping info
 */
function openProfile() {
    document.getElementById('profileBalance').textContent = walletData.totalPoints.toLocaleString() + ' Flips';
    document.getElementById('profileVouchers').textContent = userVouchers.length;

    // Render redeemed privileges
    const container = document.getElementById('redeemedPrivilegesList');
    if (userVouchers.length === 0) {
        container.innerHTML = `
            <div class="text-center py-8 text-white/50">
                <i class="fas fa-gift text-3xl mb-3 block"></i>
                <p>ยังไม่มีสิทธิพิเศษที่แลก</p>
            </div>
        `;
    } else {
        container.innerHTML = userVouchers.map(v => {
            const title = currentLanguage === 'th' && v.titleTh ? v.titleTh : v.title;
            const category = privilegeCategories.find(c => c.id === v.category);

            let statusBadge = '';
            let shippingInfo = '';

            if (v.isShipped) {
                const estDate = v.estimatedDelivery
                    ? new Date(v.estimatedDelivery).toLocaleDateString('th-TH', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                    })
                    : 'รอการจัดส่ง';

                if (v.status === 'processing') {
                    statusBadge = '<span class="px-2 py-1 rounded-full bg-yellow-500/20 text-yellow-400 text-xs">กำลังดำเนินการ</span>';
                } else if (v.status === 'shipped') {
                    statusBadge = '<span class="px-2 py-1 rounded-full bg-blue-500/20 text-blue-400 text-xs">กำลังจัดส่ง</span>';
                } else if (v.status === 'delivered') {
                    statusBadge = '<span class="px-2 py-1 rounded-full bg-green-500/20 text-green-400 text-xs">จัดส่งแล้ว</span>';
                }

                shippingInfo = `
                    <div class="mt-3 pt-3 border-t border-white/10">
                        <div class="flex items-center gap-2 text-sm text-white/60 mb-1">
                            <i class="fas fa-truck text-blue-400"></i>
                            <span>คาดว่าจะได้รับ: ${estDate}</span>
                        </div>
                        <div class="flex items-center gap-2 text-sm text-white/60">
                            <i class="fas fa-map-marker-alt text-blue-primary"></i>
                            <span class="truncate">${v.shippingInfo?.address || 'รอยืนยันที่อยู่'}</span>
                        </div>
                    </div>
                `;
            } else {
                statusBadge = '<span class="px-2 py-1 rounded-full bg-green-500/20 text-green-400 text-xs">พร้อมใช้งาน</span>';
            }

            return `
                <div class="glass-card rounded-xl p-4">
                    <div class="flex items-start gap-4">
                        <div class="w-14 h-14 rounded-lg bg-gradient-to-br ${category ? category.color : 'from-primary to-secondary'} flex items-center justify-center flex-shrink-0">
                            <i class="fas ${category ? category.icon : 'fa-gift'} text-xl text-white"></i>
                        </div>
                        <div class="flex-1 min-w-0">
                            <div class="flex items-center justify-between gap-2 mb-1">
                                <h4 class="font-semibold truncate">${title}</h4>
                                ${statusBadge}
                            </div>
                            <p class="text-white/50 text-sm">${v.price.toLocaleString()} Flips</p>
                            <p class="text-white/40 text-xs mt-1">รหัส: ${v.code}</p>
                            ${shippingInfo}
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    openModal('profileModal');
}
