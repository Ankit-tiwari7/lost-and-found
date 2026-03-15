// ============================================================
//  report-found.js - Handles the Report Found Item form
// ============================================================

document.addEventListener('DOMContentLoaded', () => {

    const form = document.getElementById('found-form');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();   // Stop normal HTML form submission

        // Read form values
        const payload = {
            item_name:  form.item_name.value.trim(),
            location:   form.location.value.trim(),
            date_found: form.date_found.value
        };

        // Disable button to prevent double-submit
        const btn = form.querySelector('button[type="submit"]');
        btn.disabled    = true;
        btn.textContent = 'Submitting…';

        try {
            await FoundAPI.add(payload);
            showAlert('form-alert', '✅ Found item reported successfully! It is now visible on the home page.', 'success');
            form.reset();   // Clear the form
        } catch (err) {
            showAlert('form-alert', `❌ Error: ${err.message}`, 'error');
        } finally {
            btn.disabled    = false;
            btn.textContent = 'Submit Report';
        }
    });
});
