/**
 * ADMIN.JS
 * Logic for the Admin Dashboard
 */

// Explicitly handle Admin Language Toggle to ensure it works independent of utils.js quirks
window.toggleAdminLanguage = function () {
    try {
        console.log('Toggling Admin language...');
        // 1. Normalize and Toggle State
        let current = (window.currentLanguage || 'en').toLowerCase();
        window.currentLanguage = current === 'en' ? 'th' : 'en';
        localStorage.setItem('language', window.currentLanguage);

        console.log('New language:', window.currentLanguage);

        // 2. Update Button Text
        const button = document.getElementById('currentLang');
        if (button) button.textContent = window.currentLanguage.toUpperCase();

        // 3. Update Static Content
        // Ensure translations object is available
        if (typeof translations === 'undefined') {
            console.error('Translations object not found!');
            return;
        }

        const t = translations[window.currentLanguage];
        if (!t) {
            console.error('Translation keys not found for:', window.currentLanguage);
            return;
        }

        // Apply translations to all data-i18n elements
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            if (t[key]) {
                if (element.tagName === 'INPUT' && element.getAttribute('placeholder')) {
                    element.placeholder = t[key];
                } else {
                    element.textContent = t[key];
                }
            }
        });

        // 4. Force Re-render of Dynamic Admin Components
        console.log('Re-rendering Admin Dashboard components...');
        renderStats();
        renderPrivilegesTable();
        renderOrdersTable();
        renderEditModalLabels();

        // 5. Toast
        if (typeof showToast === 'function') {
            showToast(window.currentLanguage === 'en' ? 'Language changed to English' : 'เปลี่ยนภาษาเป็นไทย', 'success');
        }
    } catch (e) {
        console.error('Error toggling language:', e);
        alert('Error changing language. Please refresh the page.');
    }
}

let allPrivileges = [];
let allOrders = [];

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    // Ensure currentLanguage is set properties
    window.currentLanguage = (localStorage.getItem('language') || 'en').toLowerCase();

    // Update Button Initial State
    const button = document.getElementById('currentLang');
    if (button) button.textContent = window.currentLanguage.toUpperCase();

    initAdmin();

    // Initial Translation Apply to sync with current state
    const applyCurrentLanguage = () => {
        const lang = window.currentLanguage;
        if (typeof translations !== 'undefined' && translations[lang]) {
            const t = translations[lang];
            document.querySelectorAll('[data-i18n]').forEach(element => {
                const key = element.getAttribute('data-i18n');
                if (t[key]) {
                    if (element.tagName === 'INPUT' && element.getAttribute('placeholder')) {
                        element.placeholder = t[key];
                    } else {
                        element.textContent = t[key];
                    }
                }
            });
        }
    };
    applyCurrentLanguage();

    renderStats();
    renderPrivilegesTable();
    renderOrdersTable();
});

function initAdmin() {
    loadData();
    // Default tab
    switchTab('dashboard');
}

function loadData() {
    // 1. Load Privileges (Merges Static + Custom - Deleted)
    const custom = JSON.parse(localStorage.getItem('customPrivileges') || '[]');
    const deleted = JSON.parse(localStorage.getItem('deletedPrivileges') || '[]');

    // Ensure static data exists
    const staticData = (typeof privilegePackages !== 'undefined') ? privilegePackages : [];

    const staticFiltered = staticData.filter(p => !deleted.includes(p.id));
    allPrivileges = [...staticFiltered, ...custom];

    // 2. Load Orders (Simulated from current user's localStorage for demo)
    try {
        allOrders = JSON.parse(localStorage.getItem('userVouchers') || '[]');
        // Sort by date desc
        allOrders.sort((a, b) => new Date(b.bookedAt || b.orderedAt) - new Date(a.bookedAt || a.orderedAt));
    } catch (e) {
        allOrders = [];
    }
}

// ============================================
// DASHBOARD VIEW
// ============================================

function renderStats() {
    const lang = (window.currentLanguage || 'en').toLowerCase();

    // Total Privileges
    const totalEl = document.getElementById('statTotalPrivileges');
    if (totalEl) totalEl.textContent = allPrivileges.length;

    // Total Redemptions
    const redemptionEl = document.getElementById('statTotalRedemptions');
    if (redemptionEl) redemptionEl.textContent = allOrders.length;

    // Pending Orders (Physical items not delivered)
    const pending = allOrders.filter(o => o.isPhysical && o.status !== 'delivered');
    const pendingEl = document.getElementById('statPendingOrders');
    if (pendingEl) pendingEl.textContent = pending.length;

    const badge = document.getElementById('pendingCount');
    if (badge) badge.textContent = pending.length;

    // Recent Activity
    const activityContainer = document.getElementById('recentActivityList');
    if (activityContainer) {
        const recent = allOrders.slice(0, 5);
        if (recent.length === 0) {
            activityContainer.innerHTML = '<p class="text-white/30 text-sm">No recent activity.</p>';
        } else {
            activityContainer.innerHTML = recent.map(o => {
                const date = new Date(o.orderedAt || o.bookedAt).toLocaleDateString();
                const title = (lang === 'th' && o.titleTh) ? o.titleTh : (o.title || 'Unknown Item');
                const statusColor = getStatusColor(o.status);

                return `
                    <div class="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                        <div class="flex items-center gap-3">
                            <div class="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                                <i class="fas ${o.isPhysical ? 'fa-truck' : 'fa-qrcode'} text-white/70"></i>
                            </div>
                            <div>
                                <p class="font-medium text-sm text-white">${title}</p>
                                <p class="text-xs text-white/40">${o.code} • ${date}</p>
                            </div>
                        </div>
                        <span class="px-2 py-1 rounded-full text-xs bg-${statusColor}-500/20 text-${statusColor}-400 border border-${statusColor}-500/30">
                            ${o.status || 'completed'}
                        </span>
                    </div>
                `;
            }).join('');
        }
    }
}

function getStatusColor(status) {
    if (status === 'processing') return 'yellow';
    if (status === 'shipped') return 'blue';
    if (status === 'delivered') return 'green';
    if (status === 'confirmed') return 'green';
    return 'gray';
}

// ============================================
// PRIVILEGES VIEW
// ============================================

function renderPrivilegesTable(items = allPrivileges) {
    const lang = (window.currentLanguage || 'en').toLowerCase();
    const t = (typeof translations !== 'undefined') ? translations[lang] : {};

    const tbody = document.getElementById('adminPrivilegesTable');
    if (!tbody) return;

    if (items.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="p-8 text-center text-white/30">No privileges found.</td></tr>';
        return;
    }

    tbody.innerHTML = items.map(p => {
        const title = (lang === 'th' && p.titleTh) ? p.titleTh : p.title;
        return `
        <tr class="hover:bg-white/5 transition-colors group">
            <td class="p-6 text-white/50 font-mono text-xs">#${p.id}</td>
            <td class="p-6">
                <div class="flex items-center gap-3">
                    <img src="${p.image}" class="w-10 h-10 rounded-lg object-cover bg-white/10" onerror="this.src='images/logo_v4.png'">
                    <div>
                        <div class="font-medium">${title}</div>
                        <div class="text-xs text-white/40">${p.subtitle || ''}</div>
                    </div>
                </div>
            </td>
            <td class="p-6">
                <span class="px-2 py-1 rounded-full bg-white/10 text-xs border border-white/10">
                    ${p.category}
                </span>
            </td>
            <td class="p-6 font-medium text-purple-400">
                ${p.price.toLocaleString()}
            </td>
            <td class="p-6">
                ${p.isPhysical
                ? `<span class="text-blue-400 text-xs"><i class="fas fa-box"></i> ${t.label_is_physical || 'Physical'}</span>`
                : '<span class="text-green-400 text-xs"><i class="fas fa-wifi"></i> Digital</span>'}
            </td>
            <td class="p-6 text-right">
                <button onclick="editPrivilege(${p.id})" class="p-2 hover:bg-white/10 rounded-lg text-white/70 hover:text-white transition-colors">
                    <i class="fas fa-edit"></i>
                </button>
                <button onclick="deletePrivilege(${p.id})" class="p-2 hover:bg-red-500/20 rounded-lg text-red-400 hover:text-red-300 transition-colors">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `}).join('');
}

function searchAdminPrivileges(query) {
    const lower = query.toLowerCase();
    const filtered = allPrivileges.filter(p =>
        p.title.toLowerCase().includes(lower) ||
        (p.titleTh && p.titleTh.toLowerCase().includes(lower)) ||
        String(p.id).includes(lower) ||
        p.category.toLowerCase().includes(lower)
    );
    renderPrivilegesTable(filtered);
}

// ============================================
// ORDERS VIEW
// ============================================

function renderOrdersTable() {
    const lang = (window.currentLanguage || 'en').toLowerCase();
    const tbody = document.getElementById('adminOrdersTable');
    if (!tbody) return;

    if (allOrders.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="p-8 text-center text-white/30">No orders found.</td></tr>';
        return;
    }

    tbody.innerHTML = allOrders.map((o, index) => {
        const isEditable = o.isPhysical && o.status !== 'delivered';
        const date = new Date(o.orderedAt || o.bookedAt).toLocaleDateString() + ' ' + new Date(o.orderedAt || o.bookedAt).toLocaleTimeString();
        const title = (lang === 'th' && o.titleTh) ? o.titleTh : (o.title || 'Unknown Item');

        // Shipping details tooltip or summary
        const shippingDetails = o.shippingInfo
            ? `<div class="text-xs text-white/40 mt-1"><i class="fas fa-map-marker-alt mr-1"></i>${o.shippingInfo.address.substring(0, 20)}...</div>`
            : '';

        return `
        <tr class="hover:bg-white/5 transition-colors">
            <td class="p-6">
                <div class="font-mono text-xs text-white/70">${o.code}</div>
                <div class="text-[10px] text-white/30">ID: ${index}</div>
            </td>
            <td class="p-6">
                <div class="font-medium">${title}</div>
                <div class="text-xs text-white/40">${o.price.toLocaleString()} RDS</div>
            </td>
            <td class="p-6">
                <div class="text-sm">${o.shippingInfo ? (o.shippingInfo.firstName + ' ' + o.shippingInfo.lastName) : 'Digital User'}</div>
                ${shippingDetails}
            </td>
            <td class="p-6 text-xs text-white/60">
                ${date}
            </td>
            <td class="p-6">
                <span class="px-2 py-1 rounded-full text-xs border bg-${getStatusColor(o.status)}-500/10 border-${getStatusColor(o.status)}-500/30 text-${getStatusColor(o.status)}-400">
                    ${o.status || 'Completed'}
                </span>
            </td>
            <td class="p-6 text-right">
                ${isEditable ? `
                    <select onchange="updateOrderStatus('${o.code}', this.value)" class="bg-dark-bg border border-white/20 rounded-lg text-xs px-2 py-1 outline-none focus:border-purple-primary text-white">
                        <option value="processing" ${o.status === 'processing' ? 'selected' : ''}>Processing</option>
                        <option value="shipped" ${o.status === 'shipped' ? 'selected' : ''}>Shipped</option>
                        <option value="delivered" ${o.status === 'delivered' ? 'selected' : ''}>Delivered</option>
                    </select>
                ` : '<span class="text-white/20 text-xs">-</span>'}
            </td>
        </tr>
    `}).join('');
}

function updateOrderStatus(code, newStatus) {
    const index = allOrders.findIndex(o => o.code === code);
    if (index !== -1) {
        allOrders[index].status = newStatus;
        localStorage.setItem('userVouchers', JSON.stringify(allOrders));
        renderOrdersTable();
        renderStats();
    }
}


// ============================================
// CRUD LOGIC
// ============================================

let isEditing = false;
let editId = null;

function renderEditModalLabels() {
    const lang = (window.currentLanguage || 'en').toLowerCase();
    const t = (typeof translations !== 'undefined') ? translations[lang] : {};

    const title = document.getElementById('editModalTitle');
    if (title) {
        title.textContent = isEditing ? (t.modal_edit_title) : (t.modal_add_title);
    }
}

function openEditModal(privilege = null) {
    const modal = document.getElementById('editModal');
    modal.classList.remove('hidden');

    // Trigger label update
    renderEditModalLabels();

    if (privilege) {
        isEditing = true;
        editId = privilege.id;
        document.getElementById('editTitle').value = privilege.title;
        document.getElementById('editTitleTh').value = privilege.titleTh || privilege.title;
        document.getElementById('editCategory').value = privilege.category;
        document.getElementById('editPrice').value = privilege.price;
        document.getElementById('editImage').value = privilege.image;
        document.getElementById('editIsPhysical').checked = privilege.isPhysical;
    } else {
        isEditing = false;
        editId = null;
        document.querySelector('form').reset();
    }
}

function closeEditModal() {
    document.getElementById('editModal').classList.add('hidden');
}

function editPrivilege(id) {
    const privilege = allPrivileges.find(p => p.id === id);
    if (privilege) openEditModal(privilege);
}

function deletePrivilege(id) {
    if (!confirm('Are you sure you want to delete this privilege?')) return;

    const deleted = JSON.parse(localStorage.getItem('deletedPrivileges') || '[]');
    deleted.push(id);
    localStorage.setItem('deletedPrivileges', JSON.stringify(deleted));

    let custom = JSON.parse(localStorage.getItem('customPrivileges') || '[]');
    custom = custom.filter(p => p.id !== id);
    localStorage.setItem('customPrivileges', JSON.stringify(custom));

    initAdmin();
}

function savePrivilege(e) {
    e.preventDefault();

    const newPrivilege = {
        id: isEditing ? editId : Date.now(),
        title: document.getElementById('editTitle').value,
        titleTh: document.getElementById('editTitleTh').value,
        category: document.getElementById('editCategory').value,
        price: parseInt(document.getElementById('editPrice').value),
        image: document.getElementById('editImage').value || 'images/logo_v4.png',
        isPhysical: document.getElementById('editIsPhysical').checked,
        subtitle: 'New Item',
        rating: 5.0,
        reviews: 0
    };

    let custom = JSON.parse(localStorage.getItem('customPrivileges') || '[]');

    if (isEditing) {
        const existingCustomIndex = custom.findIndex(p => p.id === editId);
        if (existingCustomIndex !== -1) {
            custom[existingCustomIndex] = newPrivilege;
        } else {
            const deleted = JSON.parse(localStorage.getItem('deletedPrivileges') || '[]');
            if (!deleted.includes(editId)) {
                deleted.push(editId);
                localStorage.setItem('deletedPrivileges', JSON.stringify(deleted));
            }
            custom.push(newPrivilege);
        }
    } else {
        custom.push(newPrivilege);
    }

    localStorage.setItem('customPrivileges', JSON.stringify(custom));
    closeEditModal();
    initAdmin();
}


// ============================================
// UI LOGIC
// ============================================

function switchTab(tabId) {
    document.querySelectorAll('[id^="view-"]').forEach(el => el.classList.add('hidden'));
    document.querySelectorAll('.sidebar-link').forEach(el => el.classList.remove('active'));

    document.getElementById(`view-${tabId}`).classList.remove('hidden');
    document.getElementById(`nav-${tabId}`).classList.add('active');

    const keys = {
        'dashboard': 'admin_overview',
        'privileges': 'admin_privileges',
        'orders': 'admin_orders'
    };

    const titleEl = document.getElementById('pageTitle');
    if (titleEl && keys[tabId]) {
        titleEl.setAttribute('data-i18n', keys[tabId]);

        // Immediate Translate update for this element
        const lang = (window.currentLanguage || 'en').toLowerCase();
        if (typeof translations !== 'undefined' && translations[lang] && translations[lang][keys[tabId]]) {
            titleEl.textContent = translations[lang][keys[tabId]];
        }
    }
}
