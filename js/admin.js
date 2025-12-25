/**
 * ADMIN.JS - Professional Admin Dashboard
 * Hub-Based Architecture with Context Switching
 */

// ============================================
// STATE MANAGEMENT
// ============================================

let currentBrand = null; // 'colestai', 'ctrlg', 'tbf'
let allPrivileges = [];
let allOrders = [];
let isEditing = false;
let editId = null;
let currentFilter = 'all';
let currentSort = 'newest';

// Theme Configurations
const BRAND_THEMES = {
    colestai: {
        name: 'FLIPS ID',
        icon: 'fa-crown',
        color: 'text-blue-600',
        bg: 'bg-blue-50',
        border: 'hover:border-blue-200',
        btn: 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg shadow-blue-200',
        shadow: 'shadow-blue-100',
        categories: ['goods', 'travel', 'hospitality', 'meet-greet']
    },
    ctrlg: {
        name: 'CTRL G',
        icon: 'fa-gamepad',
        color: 'text-purple-600',
        bg: 'bg-purple-50',
        border: 'hover:border-purple-200',
        btn: 'bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white shadow-lg shadow-purple-200',
        shadow: 'shadow-purple-100',
        categories: ['game-items', 'goods', 'meet-greet']
    },
    tbf: {
        name: 'The Blue Frontier',
        icon: 'fa-ship',
        color: 'text-cyan-600',
        bg: 'bg-cyan-50',
        border: 'hover:border-cyan-200',
        btn: 'bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-700 hover:to-cyan-800 text-white shadow-lg shadow-cyan-200',
        shadow: 'shadow-cyan-100',
        categories: ['travel', 'goods', 'hospitality']
    }
};

// ============================================
// HUB & BRAND SWITCHING
// ============================================

function initAdmin() {
    // Check if brand is already selected in session
    const savedBrand = sessionStorage.getItem('adminBrand');
    if (savedBrand && BRAND_THEMES[savedBrand]) {
        selectBrand(savedBrand);
    } else {
        showHub();
    }
    loadData();
    applyCurrentLanguage();
}

function showHub() {
    const hub = document.getElementById('admin-hub');
    const main = document.getElementById('admin-main');

    if (hub) hub.classList.remove('opacity-0', 'pointer-events-none', 'scale-95');
    if (main) main.classList.add('opacity-0', 'pointer-events-none', 'scale-95');
    document.body.style.overflow = 'hidden';
}

function selectBrand(brand) {
    if (!BRAND_THEMES[brand]) return;

    currentBrand = brand;
    sessionStorage.setItem('adminBrand', brand);

    // Update UI Theme
    applyBrandTheme(brand);

    // Initial Filter Setup
    currentFilter = 'all';

    // Transition
    const hub = document.getElementById('admin-hub');
    const main = document.getElementById('admin-main');

    if (hub) hub.classList.add('opacity-0', 'pointer-events-none', 'scale-95');
    if (main) main.classList.remove('opacity-0', 'pointer-events-none', 'scale-95');

    // Render Data
    switchTab('dashboard');
    renderStats();
    renderPrivilegesTable();
    renderOrdersTable();

    // Update Dropdown Filters relevant to brand
    updateFilterOptions(brand);
}

function returnToHub() {
    sessionStorage.removeItem('adminBrand');
    currentBrand = null;
    showHub();
    // Reset filters
    const select = document.querySelector('select[onchange="filterByCategory(this.value)"]');
    if (select) select.value = 'all';
}

function applyBrandTheme(brand) {
    const theme = BRAND_THEMES[brand];

    // Update Header
    const nameEl = document.getElementById('brandName');
    if (nameEl) nameEl.textContent = theme.name;

    const iconContainer = document.getElementById('brandIcon');
    if (iconContainer) {
        iconContainer.className = `w-10 h-10 rounded-xl flex items-center justify-center ${theme.bg} ${theme.shadow} shadow-sm transition-all`;
        iconContainer.innerHTML = `<i class="fas ${theme.icon} text-xl ${theme.color}"></i>`;
    }

    // Update Buttons (Add New)
    const addNewBtn = document.getElementById('addNewBtn');
    if (addNewBtn) {
        addNewBtn.className = `px-5 py-2.5 rounded-xl text-white text-sm font-bold transition-all shadow-lg hover:-translate-y-0.5 flex items-center gap-2 ${theme.btn} ${theme.shadow}`;
    }

    // Update Modal Save Button
    const saveBtn = document.getElementById('saveBtn');
    if (saveBtn) {
        saveBtn.className = `py-3 rounded-xl text-white font-bold text-sm shadow-lg transition-all hover:-translate-y-0.5 ${theme.btn} ${theme.shadow}`;
    }
}

function updateFilterOptions(brand) {
    // Optional: Filter dropdown options based on brand
    // For now, keeping all active
}


// ============================================
// DATA LOADING & FILTERING
// ============================================

function loadData() {
    // Load Privileges
    const custom = JSON.parse(localStorage.getItem('customPrivileges') || '[]');
    const deleted = JSON.parse(localStorage.getItem('deletedPrivileges') || '[]');
    const staticData = (typeof privilegePackages !== 'undefined') ? privilegePackages : [];

    // Combine and Filter active
    const combined = [...staticData, ...custom].filter(p => !deleted.includes(p.id));
    allPrivileges = combined;

    // Load Orders
    try {
        allOrders = JSON.parse(localStorage.getItem('userVouchers') || '[]');
        if (Array.isArray(allOrders)) {
            allOrders.sort((a, b) => new Date(b.bookedAt || b.orderedAt) - new Date(a.bookedAt || a.orderedAt));
        } else {
            allOrders = [];
        }
    } catch (e) {
        allOrders = [];
    }
}

function getBrandData() {
    if (!currentBrand) return { privileges: [], orders: [] };

    const privileges = allPrivileges.filter(p => {
        const cat = (p.category || '').toLowerCase();

        if (currentBrand === 'colestai') {
            return !cat.includes('game');
        } else if (currentBrand === 'ctrlg') {
            return cat.includes('game') || p.title.toLowerCase().includes('game') || p.title.toLowerCase().includes('esport');
        } else if (currentBrand === 'tbf') {
            return cat === 'travel' || cat === 'hospitality' || p.title.toLowerCase().includes('ocean');
        }
        return true;
    });

    const orders = allOrders.filter(o => {
        // Simple filter: if title matches any privilege in our brand list
        return privileges.some(p => p.title === o.title || p.titleTh === o.title);
    });

    // Fallback: If no orders match perfectly, show all for demonstration if needed, 
    // but better to show none or just matching ones. Let's return matching ones.
    return { privileges, orders };
}


// ============================================
// DASHBOARD VIEW
// ============================================

function renderStats() {
    const { privileges, orders } = getBrandData();

    // Stats
    const totalEl = document.getElementById('statTotalPrivileges');
    if (totalEl) totalEl.textContent = privileges.length;

    const redemptionEl = document.getElementById('statTotalRedemptions');
    if (redemptionEl) redemptionEl.textContent = orders.length;

    const pending = orders.filter(o => o.isPhysical && o.status !== 'delivered');
    const pendingEl = document.getElementById('statPendingOrders');
    if (pendingEl) pendingEl.textContent = pending.length;

    const badge = document.getElementById('pendingCount');
    if (badge) badge.textContent = pending.length;

    // Recent Activity
    const activityContainer = document.getElementById('recentActivityList');
    if (activityContainer) {
        const recent = orders.slice(0, 5);
        if (recent.length === 0) {
            activityContainer.innerHTML = '<p class="text-slate-400 text-sm italic py-2">No recent activity on this workspace.</p>';
        } else {
            activityContainer.innerHTML = recent.map(o => {
                const date = new Date(o.orderedAt || o.bookedAt).toLocaleDateString();
                const title = (window.currentLanguage === 'th' && o.titleTh) ? o.titleTh : (o.title || 'Unknown Item');
                const statusStyle = getStatusStyle(o.status);

                return `
                    <div class="flex items-center justify-between p-3 bg-white rounded-xl border border-gray-100 hover:border-gray-200 transition-colors">
                        <div class="flex items-center gap-3">
                            <div class="w-10 h-10 rounded-xl ${o.isPhysical ? 'bg-blue-50 text-blue-600' : 'bg-green-50 text-green-600'} flex items-center justify-center">
                                <i class="fas ${o.isPhysical ? 'fa-truck' : 'fa-qrcode'} text-lg"></i>
                            </div>
                            <div>
                                <p class="font-bold text-sm text-slate-700">${title}</p>
                                <p class="text-xs text-slate-400 font-medium">${o.code} • ${date}</p>
                            </div>
                        </div>
                        <span class="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${statusStyle}">${o.status || 'completed'}</span>
                    </div>
                `;
            }).join('');
        }
    }
}

function getStatusStyle(status) {
    const styles = {
        processing: 'bg-amber-50 text-amber-600 border border-amber-100',
        shipped: 'bg-blue-50 text-blue-600 border border-blue-100',
        delivered: 'bg-green-50 text-green-600 border border-green-100',
        confirmed: 'bg-green-50 text-green-600 border border-green-100'
    };
    return styles[status] || 'bg-gray-50 text-gray-600 border border-gray-100';
}


// ============================================
// PRIVILEGES VIEW
// ============================================

function renderPrivilegesTable() {
    const { privileges } = getBrandData();
    let filtered = [...privileges];

    if (currentFilter !== 'all') {
        filtered = filtered.filter(p => p.category === currentFilter);
    }

    // Sort
    if (currentSort === 'newest') filtered.sort((a, b) => b.id - a.id);
    else if (currentSort === 'price-high') filtered.sort((a, b) => b.price - a.price);
    else if (currentSort === 'price-low') filtered.sort((a, b) => a.price - b.price);
    else if (currentSort === 'name') filtered.sort((a, b) => a.title.localeCompare(b.title));

    const tbody = document.getElementById('adminPrivilegesTable');
    if (!tbody) return;

    if (filtered.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="p-8 text-center text-slate-400 italic">No items found in this category.</td></tr>';
        return;
    }

    const lang = (window.currentLanguage || 'en').toLowerCase();

    tbody.innerHTML = filtered.map(p => {
        const title = (lang === 'th' && p.titleTh) ? p.titleTh : p.title;
        return `
        <tr class="hover:bg-slate-50/50 transition-colors group">
            <td class="px-6 py-4">
                <div class="flex items-center gap-4">
                    <img src="${p.image}" class="w-12 h-12 rounded-xl object-cover bg-gray-100 shadow-sm" onerror="this.src='../images/logo_new.png'">
                    <div>
                        <div class="font-bold text-slate-700 text-sm group-hover:text-blue-600 transition-colors">${title}</div>
                        <div class="text-xs text-slate-400 font-mono">#${p.id}</div>
                    </div>
                </div>
            </td>
            <td class="px-6 py-4">
                <span class="px-3 py-1 rounded-full bg-white border border-gray-200 text-slate-600 text-xs font-semibold shadow-sm">${p.category}</span>
            </td>
            <td class="px-6 py-4 font-bold text-slate-700">${p.price.toLocaleString()}</td>
            <td class="px-6 py-4">
                ${p.isPhysical
                ? '<span class="text-blue-500 text-xs font-bold flex items-center gap-1"><i class="fas fa-box"></i> Physical</span>'
                : '<span class="text-green-500 text-xs font-bold flex items-center gap-1"><i class="fas fa-wifi"></i> Digital</span>'}
            </td>
            <td class="px-6 py-4 text-right">
                <div class="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onclick="editPrivilege(${p.id})" class="p-2 bg-white hover:bg-blue-50 rounded-lg text-slate-400 hover:text-blue-600 border border-gray-200 hover:border-blue-200 transition-all shadow-sm" title="Edit">
                        <i class="fas fa-pen text-xs"></i>
                    </button>
                    <button onclick="duplicatePrivilege(${p.id})" class="p-2 bg-white hover:bg-gray-50 rounded-lg text-slate-400 hover:text-slate-600 border border-gray-200 transition-all shadow-sm" title="Duplicate">
                        <i class="fas fa-copy text-xs"></i>
                    </button>
                    <button onclick="confirmDelete(${p.id})" class="p-2 bg-white hover:bg-red-50 rounded-lg text-slate-400 hover:text-red-500 border border-gray-200 hover:border-red-200 transition-all shadow-sm" title="Delete">
                        <i class="fas fa-trash text-xs"></i>
                    </button>
                </div>
            </td>
        </tr>
    `}).join('');
}

function searchAdminPrivileges(query) {
    const { privileges } = getBrandData();
    const lower = query.toLowerCase();

    const filtered = privileges.filter(p =>
        p.title.toLowerCase().includes(lower) ||
        (p.titleTh && p.titleTh.toLowerCase().includes(lower)) ||
        String(p.id).includes(lower) ||
        p.category.toLowerCase().includes(lower)
    );

    // Quick render override for search
    renderTableWithData(filtered);
}

function renderTableWithData(items) {
    const tbody = document.getElementById('adminPrivilegesTable');
    if (!tbody) return;

    if (items.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="p-8 text-center text-slate-400">No matching items found.</td></tr>';
        return;
    }

    const lang = (window.currentLanguage || 'en').toLowerCase();
    tbody.innerHTML = items.map(p => {
        const title = (lang === 'th' && p.titleTh) ? p.titleTh : p.title;
        return `
        <tr class="hover:bg-slate-50/50 transition-colors group">
            <td class="px-6 py-4">
                <div class="flex items-center gap-4">
                    <img src="${p.image}" class="w-12 h-12 rounded-xl object-cover bg-gray-100 shadow-sm" onerror="this.src='../images/logo_new.png'">
                    <div>
                        <div class="font-bold text-slate-700 text-sm group-hover:text-blue-600 transition-colors">${title}</div>
                        <div class="text-xs text-slate-400 font-mono">#${p.id}</div>
                    </div>
                </div>
            </td>
            <!-- Reduced cols for search view simplicity if needed, but keeping same for consistency -->
            <td class="px-6 py-4">
                <span class="px-3 py-1 rounded-full bg-white border border-gray-200 text-slate-600 text-xs font-semibold shadow-sm">${p.category}</span>
            </td>
            <td class="px-6 py-4 font-bold text-slate-700">${p.price.toLocaleString()}</td>
            <td class="px-6 py-4">
                 ${p.isPhysical ? 'Physical' : 'Digital'}
            </td>
            <td class="px-6 py-4 text-right">
                <button onclick="editPrivilege(${p.id})" class="text-blue-600 font-bold text-xs hover:underline">Edit</button>
            </td>
        </tr>
    `}).join('');
}

// ============================================
// ORDERS VIEW
// ============================================

function renderOrdersTable() {
    const { orders } = getBrandData();
    const tbody = document.getElementById('adminOrdersTable');
    if (!tbody) return;

    if (orders.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="p-8 text-center text-slate-400">No orders found.</td></tr>';
        return;
    }

    const lang = (window.currentLanguage || 'en').toLowerCase();

    tbody.innerHTML = orders.map((o, index) => {
        const isEditable = o.isPhysical && o.status !== 'delivered';
        const date = new Date(o.orderedAt || o.bookedAt).toLocaleDateString();
        const title = (lang === 'th' && o.titleTh) ? o.titleTh : (o.title || 'Unknown Item');
        const statusStyle = getStatusStyle(o.status);

        return `
        <tr class="hover:bg-slate-50/50 transition-colors">
            <td class="px-6 py-4">
                <span class="font-mono text-xs font-semibold bg-gray-100 px-2 py-1 rounded text-slate-600">${o.code}</span>
            </td>
            <td class="px-6 py-4">
                <div class="font-bold text-slate-700 text-sm">${title}</div>
            </td>
            <td class="px-6 py-4">
                <div class="text-sm font-medium text-slate-700">${o.shippingInfo ? (o.shippingInfo.firstName) : 'Digital User'}</div>
            </td>
            <td class="px-6 py-4">
                <span class="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${statusStyle}">${o.status || 'Completed'}</span>
            </td>
            <td class="px-6 py-4 text-right">
                ${isEditable ? `
                    <select onchange="updateOrderStatus('${o.code}', this.value)" 
                        class="bg-white border border-gray-200 rounded-lg text-xs px-2 py-1.5 outline-none focus:border-blue-400 text-slate-600 font-medium shadow-sm">
                        <option value="processing" ${o.status === 'processing' ? 'selected' : ''}>Processing</option>
                        <option value="shipped" ${o.status === 'shipped' ? 'selected' : ''}>Shipped</option>
                        <option value="delivered" ${o.status === 'delivered' ? 'selected' : ''}>Delivered</option>
                    </select>
                ` : '<span class="text-slate-300 text-xs">-</span>'}
            </td>
        </tr>
    `}).join('');
}


// ============================================
// CRUD & HELPERS
// ============================================

function openEditModal(privilege = null) {
    const modal = document.getElementById('editModal');
    if (modal) modal.classList.remove('hidden');

    const titleIdx = document.getElementById('editModalTitle');

    if (privilege) {
        isEditing = true;
        editId = privilege.id;
        if (titleIdx) titleIdx.textContent = 'Edit Privilege';
        const t = document.getElementById('editTitle'); if (t) t.value = privilege.title;
        const tt = document.getElementById('editTitleTh'); if (tt) tt.value = privilege.titleTh || privilege.title;
        const c = document.getElementById('editCategory'); if (c) c.value = privilege.category;
        const p = document.getElementById('editPrice'); if (p) p.value = privilege.price;
        const i = document.getElementById('editImage'); if (i) i.value = privilege.image;
        const ip = document.getElementById('editIsPhysical'); if (ip) ip.checked = privilege.isPhysical;
    } else {
        isEditing = false;
        editId = null;
        if (titleIdx) titleIdx.textContent = 'Add New Privilege';
        const form = document.querySelector('#editModal form');
        if (form) form.reset();
    }
}

function closeEditModal() {
    const modal = document.getElementById('editModal');
    if (modal) modal.classList.add('hidden');
}

function editPrivilege(id) {
    const p = allPrivileges.find(i => i.id === id);
    if (p) openEditModal(p);
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

function confirmDelete(id) {
    const modal = document.getElementById('deleteModal');
    if (modal) {
        modal.classList.remove('hidden');
        window.pendingDeleteId = id;
    } else {
        if (confirm('Delete this item?')) deletePrivilege(id);
    }
}

function closeDeleteModal() {
    const modal = document.getElementById('deleteModal');
    if (modal) modal.classList.add('hidden');
}

function confirmDeleteAction() {
    if (window.pendingDeleteId) {
        deletePrivilege(window.pendingDeleteId);
        closeDeleteModal();
    }
}

function savePrivilege(e) {
    e.preventDefault();

    const newPrivilege = {
        id: isEditing ? editId : Date.now(),
        title: document.getElementById('editTitle').value,
        titleTh: document.getElementById('editTitleTh').value,
        category: document.getElementById('editCategory').value,
        price: parseInt(document.getElementById('editPrice').value),
        image: document.getElementById('editImage').value || '../images/logo_new.png',
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
        showToast('Item updated', 'success');
    } else {
        custom.push(newPrivilege);
        showToast('New item added', 'success');
    }

    localStorage.setItem('customPrivileges', JSON.stringify(custom));
    closeEditModal();
    loadData();
    renderPrivilegesTable();
    renderStats();
}

// Navigation
function switchTab(tabId) {
    document.querySelectorAll('[id^="view-"]').forEach(el => el.classList.add('hidden'));
    document.querySelectorAll('.sidebar-link').forEach(el => el.classList.remove('active', 'bg-slate-50', 'text-slate-800'));

    const view = document.getElementById(`view-${tabId}`);
    if (view) view.classList.remove('hidden');

    const activeBtn = document.getElementById(`nav-${tabId}`);
    if (activeBtn) activeBtn.classList.add('active', 'bg-slate-50', 'text-slate-800');

    const titles = {
        'dashboard': 'Overview',
        'privileges': 'Privilege Management',
        'orders': 'Order Management'
    };
    const pt = document.getElementById('pageTitle');
    if (pt) pt.textContent = titles[tabId];
}

// Filters & Sorts
function filterByCategory(cat) {
    currentFilter = cat;
    renderPrivilegesTable();
}

function sortPrivileges(sort) {
    currentSort = sort;
    renderPrivilegesTable();
}

// Utils
function showToast(message, type = 'info') {
    const existing = document.getElementById('adminToast');
    if (existing) existing.remove();

    const colors = { success: 'bg-green-500', error: 'bg-red-500', warning: 'bg-amber-500', info: 'bg-blue-500' };
    const icons = { success: 'fa-check-circle', error: 'fa-exclamation-circle', warning: 'fa-exclamation-triangle', info: 'fa-info-circle' };

    const toast = document.createElement('div');
    toast.id = 'adminToast';
    toast.className = `fixed bottom-6 right-6 ${colors[type] || colors.info} text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-fade-in z-[100]`;
    toast.innerHTML = `<i class="fas ${icons[type] || icons.info}"></i><span class="text-sm font-medium">${message}</span>`;

    document.body.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function updateOrderStatus(code, status) {
    const idx = allOrders.findIndex(o => o.code === code);
    if (idx !== -1) {
        allOrders[idx].status = status;
        localStorage.setItem('userVouchers', JSON.stringify(allOrders));
        renderOrdersTable();
        renderStats();
        showToast(`Status updated to ${status}`, 'success');
    }
}

// Language
window.toggleAdminLanguage = function () {
    window.currentLanguage = window.currentLanguage === 'en' ? 'th' : 'en';
    localStorage.setItem('language', window.currentLanguage);
    const btn = document.getElementById('currentLang');
    if (btn) btn.textContent = window.currentLanguage.toUpperCase();
    applyCurrentLanguage();
    renderStats();
    renderPrivilegesTable();
    renderOrdersTable();
}

function applyCurrentLanguage() {
    // Basic implementation for demo
}

// Standard Init
document.addEventListener('DOMContentLoaded', initAdmin);
