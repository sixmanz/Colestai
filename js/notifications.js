
// ============================================
// NOTIFICATION SYSTEM
// ============================================

// Mock Data
const notificationsData = [
    {
        id: 1,
        type: 'points_in',
        title: 'Points Received',
        titleTh: 'ได้รับคะแนน',
        desc: 'You received 5,000 RDS from "Welcome Bonus".',
        descTh: 'คุณได้รับ 5,000 RDS จาก "โบนัสต้อนรับ"',
        date: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
        read: false
    },
    {
        id: 2,
        type: 'news',
        title: 'New Privilege Added',
        titleTh: 'สิทธิพิเศษใหม่',
        desc: 'Check out the new "Luxury Spa" package available now.',
        descTh: 'พบกับแพ็คเกจ "ลักซ์ชัวรี่ สปา" ใหม่ล่าสุดได้แล้ววันนี้',
        date: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
        read: false
    },
    {
        id: 3,
        type: 'points_out',
        title: 'Redemption Successful',
        titleTh: 'แลกของรางวัลสำเร็จ',
        desc: 'You redeemed "Movie Ticket" for 500 RDS.',
        descTh: 'คุณแลก "บัตรชมภาพยนตร์" ด้วยคะแนน 500 RDS',
        date: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
        read: true
    }
];

// Override toggleLanguage to update notifications
// effectively wrapping the global function
(function () {
    // Capture the existing global toggleLanguage from utils.js
    const originalToggleLanguage = window.toggleLanguage;

    // Define the new wrapper
    window.toggleLanguage = function () {
        // 1. Run the original logic (updates global state, localStorage, other UI)
        if (originalToggleLanguage) {
            originalToggleLanguage();
        } else {
            // Fallback if original is missing (should not happen if utils.js loaded)
            window.currentLanguage = window.currentLanguage === 'en' ? 'th' : 'en';
            localStorage.setItem('language', window.currentLanguage);
            if (typeof updateContentLanguage === 'function') updateContentLanguage();
        }

        // 2. Re-render Notifications with new language state
        renderNotifications();
        updateNotificationCount();
    };
})();

document.addEventListener('DOMContentLoaded', () => {
    initNotifications();
    updateNotificationCount();
});

function initNotifications() {
    // Render initial list
    renderNotifications();
}

function toggleNotifications() {
    const modal = document.getElementById('notificationModal');
    if (!modal) return;

    if (modal.classList.contains('hidden')) {
        modal.classList.remove('hidden');
        renderNotifications(); // Re-render to ensure fresh time/lang
    } else {
        modal.classList.add('hidden');
        markAllAsRead(); // Optional: Mark all as read on close? Or keep manual?
        // Let's keep manual read or simple "click to read" logic if complex.
        // For simple UI, let's mark all shown as read when opened? 
        // Or better, just leave them as is for now.
    }
}

function renderNotifications() {
    const container = document.getElementById('notificationList');
    if (!container) return;

    // Explicitly use window.currentLanguage to ensure we get the updated global state
    const isTh = window.currentLanguage === 'th';

    if (notificationsData.length === 0) {
        container.innerHTML = `
            <div class="text-center py-8 text-slate-400">
                <i class="fas fa-bell-slash text-2xl mb-2"></i>
                <p>${isTh ? 'ไม่มีการแจ้งเตือน' : 'No notifications'}</p>
            </div>
        `;
        return;
    }

    // Sort by date desc
    const sorted = [...notificationsData].sort((a, b) => new Date(b.date) - new Date(a.date));

    container.innerHTML = sorted.map(item => {
        const title = isTh ? item.titleTh : item.title;
        const desc = isTh ? item.descTh : item.desc;
        const timeStr = getTimeAgo(item.date, isTh);

        // Icon based on type
        let iconHtml = '';
        if (item.type === 'points_in') iconHtml = '<div class="w-8 h-8 rounded-full bg-green-500/20 text-green-600 flex items-center justify-center"><i class="fas fa-arrow-down"></i></div>';
        else if (item.type === 'points_out') iconHtml = '<div class="w-8 h-8 rounded-full bg-red-500/20 text-red-500 flex items-center justify-center"><i class="fas fa-arrow-up"></i></div>';
        else iconHtml = '<div class="w-8 h-8 rounded-full bg-blue-500/20 text-blue-600 flex items-center justify-center"><i class="fas fa-newspaper"></i></div>';

        return `
            <div class="flex gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer ${item.read ? 'opacity-60' : 'bg-blue-50 border border-blue-200'}">
                <div class="shrink-0 pt-1">
                    ${iconHtml}
                </div>
                <div class="flex-grow">
                    <div class="flex justify-between items-start">
                        <h4 class="font-bold text-sm text-slate-800">${title}</h4>
                        <span class="text-xs text-slate-400 whitespace-nowrap ml-2">${timeStr}</span>
                    </div>
                    <p class="text-xs text-slate-600 mt-1">${desc}</p>
                </div>
                ${!item.read ? '<div class="w-2 h-2 rounded-full bg-blue-500 shrink-0 mt-2"></div>' : ''}
            </div>
        `;
    }).join('');
}

function updateNotificationCount() {
    const count = notificationsData.filter(i => !i.read).length;
    const badges = document.querySelectorAll('.notif-badge');

    badges.forEach(badge => {
        if (count > 0) {
            badge.textContent = count > 9 ? '9+' : count;
            badge.classList.remove('hidden');
        } else {
            badge.classList.add('hidden');
        }
    });
}

function markAllAsRead() {
    notificationsData.forEach(i => i.read = true);
    updateNotificationCount();
    renderNotifications();
}


function getTimeAgo(dateStr, isTh) {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return isTh ? 'เมื่อสักครู่' : 'Just now';
    if (diffMins < 60) return isTh ? `${diffMins} นาทีที่แล้ว` : `${diffMins}m ago`;
    if (diffHours < 24) return isTh ? `${diffHours} ชม. ที่แล้ว` : `${diffHours}h ago`;
    return isTh ? `${diffDays} วันที่แล้ว` : `${diffDays}d ago`;
}
