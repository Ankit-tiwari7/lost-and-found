// ============================================================
//  report-lost.js - Handles the Report Lost Item form
// ============================================================

document.addEventListener('DOMContentLoaded', () => {

    const form = document.getElementById('lost-form');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();   // Stop normal HTML form submission

        // Read form values
        const payload = {
            item_name:   form.item_name.value.trim(),
            description: form.description.value.trim(),
            location:    form.location.value.trim(),
            date_lost:   form.date_lost.value
        };

        // Disable button to prevent double-submit
        const btn = form.querySelector('button[type="submit"]');
        btn.disabled    = true;
        btn.textContent = 'Submitting…';

        try {
            await LostAPI.add(payload);
            showAlert('form-alert', '✅ Lost item reported successfully! It is now visible on the home page.', 'success');
            form.reset();   // Clear the form
        } catch (err) {
            showAlert('form-alert', `❌ Error: ${err.message}`, 'error');
        } finally {
            btn.disabled    = false;
            btn.textContent = 'Submit Report';
        }
    });
});
