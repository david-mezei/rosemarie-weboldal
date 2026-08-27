const form = document.querySelector('#booking-form');
const modal = document.querySelector('#success-modal');
const closeModal = () => { modal.hidden = true; };
document.querySelectorAll('[data-close-modal]').forEach((button) => button.addEventListener('click', closeModal));
form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const submitButton = form.querySelector('button[type="submit"]');
    const originalLabel = submitButton.textContent;
    submitButton.disabled = true;
    submitButton.textContent = 'Küldés…';
    try {
        const response = await fetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } });
        const result = await response.json();
        if (!response.ok || !result.success) throw new Error(result.message || 'Sikertelen küldés');
        form.reset();
        modal.hidden = false;
        modal.querySelector('[data-close-modal]:not(.success-modal__backdrop)').focus();
    } catch (error) {
        alert('Az üzenet küldése most nem sikerült. Kérlek, próbáld újra később.');
    } finally {
        submitButton.disabled = false;
        submitButton.textContent = originalLabel;
    }
});
document.addEventListener('keydown', (event) => { if (event.key === 'Escape' && !modal.hidden) closeModal(); });