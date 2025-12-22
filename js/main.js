
document.addEventListener('DOMContentLoaded', () => {


    // Debug checks
    if (typeof privilegePackages === 'undefined') {
        console.error('CRITICAL: privilegePackages undefined! privileges-data.js failed?');
        showToast('Error: Data failed to load', 'error');
    } else {

    }

    if (typeof walletData === 'undefined') {
        console.error('CRITICAL: walletData undefined! utils.js failed?');
    } else {

    }

    // Ensure stats update
    if (typeof updatePrivilegeStats === 'function') {
        updatePrivilegeStats();
    }
});
