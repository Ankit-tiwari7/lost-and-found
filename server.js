const express  = require('express');
const mysql    = require('mysql2');
const cors     = require('cors');
const path     = require('path');
const multer   = require('multer');
const session  = require('express-session');
const bcrypt   = require('bcryptjs');
const fs       = require('fs');

const app  = express();
const PORT = 3000;

// Create uploads folder if it doesn't exist
const uploadsDir = path.join(__dirname, 'public', 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

// Multer config for image uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadsDir),
    filename:    (req, file, cb) => {
        const unique = Date.now() + '-' + Math.round(Math.random() * 1e6);
        cb(null, unique + path.extname(file.originalname));
    }
});
const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const allowed = /jpeg|jpg|png|webp|gif/;
        const ok = allowed.test(path.extname(file.originalname).toLowerCase()) && allowed.test(file.mimetype);
        ok ? cb(null, true) : cb(new Error('Only image files are allowed'));
    }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: 'lostfound_secret_key',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 }
}));

// MySQL
const db = mysql.createConnection({
    host:     'localhost',
    user:     'root',     // ← your MySQL username
    password: 'ankit',         // ← your MySQL password
    database: 'lost_and_found_db'
});

db.connect((err) => {
    if (err) { console.error('❌ DB connection failed:', err.message); process.exit(1); }
    console.log('✅ Connected to MySQL database: lost_and_found_db');
});

// Admin middleware
function requireAdmin(req, res, next) {
    if (req.session && req.session.isAdmin) return next();
    res.status(401).json({ error: 'Unauthorized. Please login.' });
}

// ============================================================
//  Serve Pages (MUST be before API routes)
// ============================================================
app.get('/',             (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));
app.get('/report-lost',  (req, res) => res.sendFile(path.join(__dirname, 'public', 'pages', 'report-lost.html')));
app.get('/report-found', (req, res) => res.sendFile(path.join(__dirname, 'public', 'pages', 'report-found.html')));
app.get('/claims',       (req, res) => res.sendFile(path.join(__dirname, 'public', 'pages', 'claims.html')));
app.get('/login',        (req, res) => res.sendFile(path.join(__dirname, 'public', 'pages', 'login.html')));

// ============================================================
//  Admin Auth
// ============================================================
app.post('/admin/login', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: 'Username and password required' });
    db.query('SELECT * FROM admins WHERE username = ?', [username], async (err, results) => {
        if (err || results.length === 0) return res.status(401).json({ error: 'Invalid username or password' });
        const match = await bcrypt.compare(password, results[0].password);
        if (!match) return res.status(401).json({ error: 'Invalid username or password' });
        req.session.isAdmin = true;
        req.session.adminName = results[0].username;
        res.json({ message: 'Login successful' });
    });
});

app.post('/admin/logout', (req, res) => {
    req.session.destroy(() => res.json({ message: 'Logged out' }));
});

app.get('/admin/check', (req, res) => {
    res.json({ isAdmin: !!(req.session && req.session.isAdmin) });
});

// ============================================================
//  Lost Items
// ============================================================
app.get('/lost', (req, res) => {
    db.query('SELECT * FROM lost_items ORDER BY id DESC', (err, results) => {
        if (err) return res.status(500).json({ error: 'Failed to fetch lost items' });
        res.json(results);
    });
});

app.post('/lost', upload.single('image'), (req, res) => {
    const { item_name, description, location, date_lost } = req.body;
    if (!item_name || !location || !date_lost)
        return res.status(400).json({ error: 'item_name, location, and date_lost are required' });
    const image = req.file ? '/uploads/' + req.file.filename : null;
    db.query(
        'INSERT INTO lost_items (item_name, description, location, date_lost, image) VALUES (?, ?, ?, ?, ?)',
        [item_name, description, location, date_lost, image],
        (err, result) => {
            if (err) return res.status(500).json({ error: 'Failed to add lost item' });
            res.status(201).json({ message: 'Lost item reported successfully', id: result.insertId });
        }
    );
});

app.delete('/lost/:id', requireAdmin, (req, res) => {
    db.query('SELECT image FROM lost_items WHERE id = ?', [req.params.id], (err, results) => {
        if (err || results.length === 0) return res.status(404).json({ error: 'Item not found' });
        const image = results[0].image;
        db.query('DELETE FROM lost_items WHERE id = ?', [req.params.id], (err2) => {
            if (err2) return res.status(500).json({ error: 'Failed to delete item' });
            if (image) { const fp = path.join(__dirname, 'public', image); if (fs.existsSync(fp)) fs.unlinkSync(fp); }
            res.json({ message: 'Lost item deleted' });
        });
    });
});

// ============================================================
//  Found Items
// ============================================================
app.get('/found', (req, res) => {
    db.query('SELECT * FROM found_items ORDER BY id DESC', (err, results) => {
        if (err) return res.status(500).json({ error: 'Failed to fetch found items' });
        res.json(results);
    });
});

app.post('/found', upload.single('image'), (req, res) => {
    const { item_name, location, date_found } = req.body;
    if (!item_name || !location || !date_found)
        return res.status(400).json({ error: 'item_name, location, and date_found are required' });
    const image = req.file ? '/uploads/' + req.file.filename : null;
    db.query(
        'INSERT INTO found_items (item_name, location, date_found, image) VALUES (?, ?, ?, ?)',
        [item_name, location, date_found, image],
        (err, result) => {
            if (err) return res.status(500).json({ error: 'Failed to add found item' });
            res.status(201).json({ message: 'Found item reported successfully', id: result.insertId });
        }
    );
});

app.delete('/found/:id', requireAdmin, (req, res) => {
    db.query('SELECT image FROM found_items WHERE id = ?', [req.params.id], (err, results) => {
        if (err || results.length === 0) return res.status(404).json({ error: 'Item not found' });
        const image = results[0].image;
        db.query('DELETE FROM found_items WHERE id = ?', [req.params.id], (err2) => {
            if (err2) return res.status(500).json({ error: 'Failed to delete item' });
            if (image) { const fp = path.join(__dirname, 'public', image); if (fs.existsSync(fp)) fs.unlinkSync(fp); }
            res.json({ message: 'Found item deleted' });
        });
    });
});

// ============================================================
//  Claims
// ============================================================
app.post('/claim', (req, res) => {
    const { item_type, item_id, claimant_name, claimant_contact, proof_description } = req.body;
    if (!item_type || !item_id || !claimant_name || !claimant_contact || !proof_description)
        return res.status(400).json({ error: 'All fields are required' });
    db.query(
        'INSERT INTO claims (item_type, item_id, claimant_name, claimant_contact, proof_description) VALUES (?, ?, ?, ?, ?)',
        [item_type, item_id, claimant_name, claimant_contact, proof_description],
        (err, result) => {
            if (err) return res.status(500).json({ error: 'Failed to submit claim' });
            res.status(201).json({ message: 'Claim submitted successfully', id: result.insertId });
        }
    );
});

app.get('/claims/all', (req, res) => {
    const sql = `
        SELECT c.id, c.item_type, c.item_id,
               c.claimant_name, c.claimant_contact, c.proof_description,
               c.status, c.claimed_at,
               COALESCE(l.item_name, f.item_name) AS item_name,
               COALESCE(l.location,  f.location)  AS location
        FROM claims c
        LEFT JOIN lost_items  l ON c.item_type = 'lost'  AND c.item_id = l.id
        LEFT JOIN found_items f ON c.item_type = 'found' AND c.item_id = f.id
        ORDER BY c.id DESC`;
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: 'Failed to fetch claims' });
        res.json(results);
    });
});

app.patch('/claims/:id/status', requireAdmin, (req, res) => {
    const { status } = req.body;
    if (!['pending', 'approved', 'rejected'].includes(status))
        return res.status(400).json({ error: 'Invalid status' });
    db.query('UPDATE claims SET status = ? WHERE id = ?', [status, req.params.id], (err, result) => {
        if (err) return res.status(500).json({ error: 'Failed to update claim' });
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Claim not found' });
        res.json({ message: `Claim marked as ${status}` });
    });
});

app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));