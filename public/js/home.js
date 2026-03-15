// ============================================================
//  home.js - Loads and renders items on the Home page
// ============================================================

document.addEventListener('DOMContentLoaded', async () => {

    const lostGrid   = document.getElementById('lost-grid');
    const foundGrid  = document.getElementById('found-grid');
    const lostBadge  = document.getElementById('lost-badge');
    const foundBadge = document.getElementById('found-badge');
    const statLost   = document.getElementById('stat-lost');
    const statFound  = document.getElementById('stat-found');

    // ---------- Helper: show loading placeholder ----------
    function setLoading(grid) {
        grid.innerHTML = '<div class="loading">Loading…</div>';
    }

    // ---------- Fetch and render Lost items ----------
    async function loadLost() {
        setLoading(lostGrid);
        try {
            const items = await LostAPI.getAll();

            // Update stats
            lostBadge.textContent  = items.length;
            statLost.textContent   = items.length;

            if (items.length === 0) {
                lostGrid.innerHTML = `
                    <div class="empty-state">
                        <div class="icon">🔍</div>
                        No lost items reported yet.
                    </div>`;
                return;
            }

            // Build cards
            lostGrid.innerHTML = items.map(buildLostCard).join('');

        } catch (err) {
            lostGrid.innerHTML = `<div class="empty-state">⚠️ Could not load lost items.<br>${err.message}</div>`;
        }
    }

    // ---------- Fetch and render Found items ----------
    async function loadFound() {
        setLoading(foundGrid);
        try {
            const items = await FoundAPI.getAll();

            // Update stats
            foundBadge.textContent = items.length;
            statFound.textContent  = items.length;

            if (items.length === 0) {
                foundGrid.innerHTML = `
                    <div class="empty-state">
                        <div class="icon">📦</div>
                        No found items reported yet.
                    </div>`;
                return;
            }

            // Build cards
            foundGrid.innerHTML = items.map(buildFoundCard).join('');

        } catch (err) {
            foundGrid.innerHTML = `<div class="empty-state">⚠️ Could not load found items.<br>${err.message}</div>`;
        }
    }

    // Load both lists in parallel
    await Promise.all([loadLost(), loadFound()]);
});
