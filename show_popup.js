
document.addEventListener('DOMContentLoaded', () => {
    const dialog = document.querySelector('#welcome-popup');

    // Munkamenetenként csak egyszer ugrik fel (opcionális, törölhető ha mindig szeretnéd)
    if (!sessionStorage.getItem('posterShown')) {
        customElements.whenDefined('sl-dialog').then(() => {
            dialog.show();
            sessionStorage.setItem('posterShown', 'true');
        });
    }
});