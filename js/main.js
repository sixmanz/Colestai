console.log('Main.js loading...');
document.addEventListener('DOMContentLoaded', () => {
    console.log('Main DOM Ready');

    // Debug checks
    if (typeof privilegePackages === 'undefined') {
        console.error('CRITICAL: privilegePackages undefined! privileges-data.js failed?');
        showToast('Error: Data failed to load', 'error');
    } else {
        console.log('Packages loaded:', privilegePackages.length);
    }

    if (typeof walletData === 'undefined') {
        console.error('CRITICAL: walletData undefined! utils.js failed?');
    } else {
        console.log('Wallet loaded:', walletData);
    }

    // Ensure stats update
    if (typeof updatePrivilegeStats === 'function') {
        updatePrivilegeStats();
    }
});
