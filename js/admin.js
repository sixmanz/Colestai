/**
 * ADMIN.JS - Professional Admin Dashboard
 * Enhanced with modern features and minimal design
 */

// ============================================
// STATE MANAGEMENT
// ============================================

let allPrivileges = [];
let allOrders = [];
let isEditing = false;
let editId = null;
let currentFilter = 'all';
let currentSort = 'newest';

// ============================================
// LANGUAGE TOGGLE
// ============================================

window.toggleAdminLanguage = function () {
    try {
        let current = (window.currentLanguage || 'en').toLowerCase();
        window.currentLanguage = current === 'en' ? 'th' : 'en';
        localStorage.setItem('language', window.currentLanguage);

        const button = document.getElementById('currentLang');
        if (button) button.textContent = window.currentLanguage.toUpperCase();

        if (typeof translations === 'undefined') return;

        const t = translations[window.currentLanguage];
        if (!t) return;

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

        renderStats();
        renderPrivilegesTable();
        renderOrdersTable();

        showToast(window.currentLanguage === 'en' ? 'Language: English' : 'ภาษา: ไทย', 'info');
    } catch (e) {
        console.error('Error toggling language:', e);
    }
}

// ============================================
// TOAST NOTIFICATIONS
// ============================================

function showToast(message, type = 'info') {
    // Remove existing toast
    const existing = document.getElementById('adminToast');
    if (existing) existing.remove();

    const colors = {
        success: 'bg-green-500',
        error: 'bg-red-500',
        warning: 'bg-amber-500',
        info: 'bg-blue-500'
    };

    const icons = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        warning: 'fa-exclamation-triangle',
        info: 'fa-info-circle'
    };

    const toast = document.createElement('div');
    toast.id = 'adminToast';
    toast.className = `fixed bottom-6 right-6 ${colors[type]} text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-fade-in z-50`;
    toast.innerHTML = `
        <i class="fas ${icons[type]}"></i>
        <span class="text-sm font-medium">${message}</span>
    `;

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('opacity-0', 'transition-opacity');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    window.currentLanguage = (localStorage.getItem('language') || 'en').toLowerCase();

    const button = document.getElementById('currentLang');
    if (button) button.textContent = window.currentLanguage.toUpperCase();

    initAdmin();
    applyCurrentLanguage();
});

function applyCurrentLanguage() {
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
}

function initAdmin() {
    loadData();
    switchTab('dashboard');
    renderStats();
    renderPrivilegesTable();
    renderOrdersTable();
}

function loadData() {
    // Load Privileges
    const custom = JSON.parse(localStorage.getItem('customPrivileges') || '[]');
    const deleted = JSON.parse(localStorage.getItem('deletedPrivileges') || '[]');
    const staticData = (typeof privilegePackages !== 'undefined') ? privilegePackages : [];
    const staticFiltered = staticData.filter(p => !deleted.includes(p.id));
    allPrivileges = [...staticFiltered, ...custom];

    // Load Orders
    try {
        allOrders = JSON.parse(localStorage.getItem('userVouchers') || '[]');
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

    // Stats
    const totalEl = document.getElementById('statTotalPrivileges');
    if (totalEl) totalEl.textContent = allPrivileges.length;

    const redemptionEl = document.getElementById('statTotalRedemptions');
    if (redemptionEl) redemptionEl.textContent = allOrders.length;

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
            activityContainer.innerHTML = '<p class="text-slate-400 text-sm">No recent activity.</p>';
        } else {
            activityContainer.innerHTML = recent.map(o => {
                const date = new Date(o.orderedAt || o.bookedAt).toLocaleDateString();
                const title = (lang === 'th' && o.titleTh) ? o.titleTh : (o.title || 'Unknown Item');
                const statusStyle = getStatusStyle(o.status);

                return `
                    <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                        <div class="flex items-center gap-3">
                            <div class="w-8 h-8 rounded-lg ${o.isPhysical ? 'bg-blue-50' : 'bg-green-50'} flex items-center justify-center">
                                <i class="fas ${o.isPhysical ? 'fa-truck text-blue-500' : 'fa-qrcode text-green-500'} text-sm"></i>
                            </div>
                            <div>
                                <p class="font-medium text-sm text-slate-700">${title}</p>
                                <p class="text-xs text-slate-400">${o.code} • ${date}</p>
                            </div>
                        </div>
                        <span class="px-2 py-1 rounded-full text-xs ${statusStyle}">${o.status || 'completed'}</span>
                    </div>
                `;
            }).join('');
        }
    }
}

function getStatusStyle(status) {
    const styles = {
        processing: 'bg-amber-50 text-amber-600 border border-amber-200',
        shipped: 'bg-blue-50 text-blue-600 border border-blue-200',
        delivered: 'bg-green-50 text-green-600 border border-green-200',
        confirmed: 'bg-green-50 text-green-600 border border-green-200'
    };
    return styles[status] || 'bg-gray-50 text-gray-600 border border-gray-200';
}

function getStatusColor(status) {
    if (status === 'processing') return 'amber';
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
    const tbody = document.getElementById('adminPrivilegesTable');
    if (!tbody) return;

    // Apply filter
    let filtered = items;
    if (currentFilter !== 'all') {
        filtered = items.filter(p => p.category === currentFilter);
    }

    // Apply sort
    if (currentSort === 'newest') {
        filtered.sort((a, b) => b.id - a.id);
    } else if (currentSort === 'price-high') {
        filtered.sort((a, b) => b.price - a.price);
    } else if (currentSort === 'price-low') {
        filtered.sort((a, b) => a.price - b.price);
    } else if (currentSort === 'name') {
        filtered.sort((a, b) => a.title.localeCompare(b.title));
    }

    if (filtered.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="p-8 text-center text-slate-400">No privileges found.</td></tr>';
        return;
    }

    tbody.innerHTML = filtered.map(p => {
        const title = (lang === 'th' && p.titleTh) ? p.titleTh : p.title;
        return `
        <tr class="hover:bg-gray-50 transition-colors">
            <td class="px-4 py-3 text-slate-400 font-mono text-xs">#${p.id}</td>
            <td class="px-4 py-3">
                <div class="flex items-center gap-3">
                    <img src="${p.image}" class="w-10 h-10 rounded-lg object-cover bg-gray-100" onerror="this.src='../images/logo_v4.png'">
                    <div>
                        <div class="font-medium text-slate-700">${title}</div>
                        <div class="text-xs text-slate-400">${p.subtitle || ''}</div>
                    </div>
                </div>
            </td>
            <td class="px-4 py-3">
                <span class="px-2 py-1 rounded-full bg-gray-100 text-slate-600 text-xs">${p.category}</span>
            </td>
            <td class="px-4 py-3 font-semibold text-blue-600">${p.price.toLocaleString()}</td>
            <td class="px-4 py-3">
                ${p.isPhysical
                ? '<span class="text-blue-500 text-xs"><i class="fas fa-box mr-1"></i>Physical</span>'
                : '<span class="text-green-500 text-xs"><i class="fas fa-wifi mr-1"></i>Digital</span>'}
            </td>
            <td class="px-4 py-3 text-right">
                <div class="flex justify-end gap-1">
                    <button onclick="editPrivilege(${p.id})" class="p-2 hover:bg-blue-50 rounded-lg text-slate-400 hover:text-blue-500 transition-colors" title="Edit">
                        <i class="fas fa-edit text-sm"></i>
                    </button>
                    <button onclick="duplicatePrivilege(${p.id})" class="p-2 hover:bg-gray-100 rounded-lg text-slate-400 hover:text-slate-600 transition-colors" title="Duplicate">
                        <i class="fas fa-copy text-sm"></i>
                    </button>
                    <button onclick="confirmDelete(${p.id})" class="p-2 hover:bg-red-50 rounded-lg text-slate-400 hover:text-red-500 transition-colors" title="Delete">
                        <i class="fas fa-trash text-sm"></i>
                    </button>
                </div>
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

function filterByCategory(category) {
    currentFilter = category;
    renderPrivilegesTable();

    // Update filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('bg-blue-primary', 'text-white');
        btn.classList.add('bg-gray-100', 'text-slate-600');
    });
    const activeBtn = document.querySelector(`[data-filter="${category}"]`);
    if (activeBtn) {
        activeBtn.classList.remove('bg-gray-100', 'text-slate-600');
        activeBtn.classList.add('bg-blue-primary', 'text-white');
    }
}

function sortPrivileges(sortType) {
    currentSort = sortType;
    renderPrivilegesTable();
}

function duplicatePrivilege(id) {
    const privilege = allPrivileges.find(p => p.id === id);
    if (!privilege) return;

    const newPrivilege = {
        ...privilege,
        id: Date.now(),
        title: privilege.title + ' (Copy)',
        titleTh: (privilege.titleTh || privilege.title) + ' (สำเนา)'
    };

    let custom = JSON.parse(localStorage.getItem('customPrivileges') || '[]');
    custom.push(newPrivilege);
    localStorage.setItem('customPrivileges', JSON.stringify(custom));

    loadData();
    renderPrivilegesTable();
    showToast('Privilege duplicated successfully', 'success');
}

// ============================================
// ORDERS VIEW
// ============================================

function renderOrdersTable() {
    const lang = (window.currentLanguage || 'en').toLowerCase();
    const tbody = document.getElementById('adminOrdersTable');
    if (!tbody) return;

    if (allOrders.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="p-8 text-center text-slate-400">No orders found.</td></tr>';
        return;
    }

    tbody.innerHTML = allOrders.map((o, index) => {
        const isEditable = o.isPhysical && o.status !== 'delivered';
        const date = new Date(o.orderedAt || o.bookedAt).toLocaleDateString();
        const title = (lang === 'th' && o.titleTh) ? o.titleTh : (o.title || 'Unknown Item');
        const statusStyle = getStatusStyle(o.status);

        return `
        <tr class="hover:bg-gray-50 transition-colors">
            <td class="px-4 py-3">
                <div class="font-mono text-xs text-slate-600">${o.code}</div>
            </td>
            <td class="px-4 py-3">
                <div class="font-medium text-slate-700">${title}</div>
                <div class="text-xs text-slate-400">${o.price.toLocaleString()} RDS</div>
            </td>
            <td class="px-4 py-3">
                <div class="text-sm text-slate-600">${o.shippingInfo ? (o.shippingInfo.firstName + ' ' + o.shippingInfo.lastName) : 'Digital'}</div>
                ${o.shippingInfo ? `<div class="text-xs text-slate-400"><i class="fas fa-map-marker-alt mr-1"></i>${o.shippingInfo.address.substring(0, 25)}...</div>` : ''}
            </td>
            <td class="px-4 py-3 text-xs text-slate-500">${date}</td>
            <td class="px-4 py-3">
                <span class="px-2 py-1 rounded-full text-xs ${statusStyle}">${o.status || 'Completed'}</span>
            </td>
            <td class="px-4 py-3 text-right">
                ${isEditable ? `
                    <select onchange="updateOrderStatus('${o.code}', this.value)" 
                        class="bg-gray-50 border border-gray-200 rounded-lg text-xs px-2 py-1.5 outline-none focus:border-blue-400 text-slate-600">
                        <option value="processing" ${o.status === 'processing' ? 'selected' : ''}>Processing</option>
                        <option value="shipped" ${o.status === 'shipped' ? 'selected' : ''}>Shipped</option>
                        <option value="delivered" ${o.status === 'delivered' ? 'selected' : ''}>Delivered</option>
                    </select>
                ` : '<span class="text-slate-300 text-xs">-</span>'}
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
        showToast(`Order status updated to: ${newStatus}`, 'success');
    }
}

// ============================================
// CRUD OPERATIONS
// ============================================

function openEditModal(privilege = null) {
    const modal = document.getElementById('editModal');
    modal.classList.remove('hidden');

    const title = document.getElementById('editModalTitle');

    if (privilege) {
        isEditing = true;
        editId = privilege.id;
        if (title) title.textContent = 'Edit Privilege';
        document.getElementById('editTitle').value = privilege.title;
        document.getElementById('editTitleTh').value = privilege.titleTh || privilege.title;
        document.getElementById('editCategory').value = privilege.category;
        document.getElementById('editPrice').value = privilege.price;
        document.getElementById('editImage').value = privilege.image;
        document.getElementById('editIsPhysical').checked = privilege.isPhysical;
    } else {
        isEditing = false;
        editId = null;
        if (title) title.textContent = 'Add New Privilege';
        document.querySelector('#editModal form').reset();
    }
}

function closeEditModal() {
    document.getElementById('editModal').classList.add('hidden');
}

function editPrivilege(id) {
    const privilege = allPrivileges.find(p => p.id === id);
    if (privilege) openEditModal(privilege);
}

function confirmDelete(id) {
    const modal = document.getElementById('deleteModal');
    if (modal) {
        modal.classList.remove('hidden');
        window.pendingDeleteId = id;
    } else {
        // Fallback to confirm dialog
        if (confirm('Are you sure you want to delete this privilege?')) {
            deletePrivilege(id);
        }
    }
}

function closeDeleteModal() {
    const modal = document.getElementById('deleteModal');
    if (modal) modal.classList.add('hidden');
    window.pendingDeleteId = null;
}

function confirmDeleteAction() {
    if (window.pendingDeleteId) {
        deletePrivilege(window.pendingDeleteId);
        closeDeleteModal();
    }
}

function deletePrivilege(id) {
    const deleted = JSON.parse(localStorage.getItem('deletedPrivileges') || '[]');
    deleted.push(id);
    localStorage.setItem('deletedPrivileges', JSON.stringify(deleted));

    let custom = JSON.parse(localStorage.getItem('customPrivileges') || '[]');
    custom = custom.filter(p => p.id !== id);
    localStorage.setItem('customPrivileges', JSON.stringify(custom));

    loadData();
    renderPrivilegesTable();
    renderStats();
    showToast('Privilege deleted successfully', 'success');
}

function savePrivilege(e) {
    e.preventDefault();

    const newPrivilege = {
        id: isEditing ? editId : Date.now(),
        title: document.getElementById('editTitle').value,
        titleTh: document.getElementById('editTitleTh').value,
        category: document.getElementById('editCategory').value,
        price: parseInt(document.getElementById('editPrice').value),
        image: document.getElementById('editImage').value || '../images/logo_v4.png',
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
        showToast('Privilege updated successfully', 'success');
    } else {
        custom.push(newPrivilege);
        showToast('New privilege added successfully', 'success');
    }

    localStorage.setItem('customPrivileges', JSON.stringify(custom));
    closeEditModal();
    loadData();
    renderPrivilegesTable();
    renderStats();
}

// ============================================
// EXPORT / IMPORT DATA
// ============================================

function exportData() {
    const data = {
        privileges: allPrivileges,
        orders: allOrders,
        customPrivileges: JSON.parse(localStorage.getItem('customPrivileges') || '[]'),
        deletedPrivileges: JSON.parse(localStorage.getItem('deletedPrivileges') || '[]'),
        exportedAt: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `flips-admin-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showToast('Data exported successfully', 'success');
}

function importData() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const data = JSON.parse(event.target.result);

                if (data.customPrivileges) {
                    localStorage.setItem('customPrivileges', JSON.stringify(data.customPrivileges));
                }
                if (data.deletedPrivileges) {
                    localStorage.setItem('deletedPrivileges', JSON.stringify(data.deletedPrivileges));
                }

                loadData();
                renderPrivilegesTable();
                renderStats();
                showToast('Data imported successfully', 'success');
            } catch (err) {
                showToast('Error importing data: Invalid file format', 'error');
            }
        };
        reader.readAsText(file);
    };
    input.click();
}

function resetAllData() {
    if (confirm('Are you sure you want to reset all data? This cannot be undone.')) {
        localStorage.removeItem('customPrivileges');
        localStorage.removeItem('deletedPrivileges');
        loadData();
        renderPrivilegesTable();
        renderStats();
        showToast('All data has been reset', 'warning');
    }
}

// ============================================
// UI NAVIGATION
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
        const lang = (window.currentLanguage || 'en').toLowerCase();
        if (typeof translations !== 'undefined' && translations[lang] && translations[lang][keys[tabId]]) {
            titleEl.textContent = translations[lang][keys[tabId]];
        }
    }
}

// Add fadeIn animation
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
    }
    .animate-fade-in {
        animation: fadeIn 0.3s ease-out;
    }
`;
document.head.appendChild(style);
