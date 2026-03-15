# 🔍 Lost and Found Management System
### DBMS Mini Project — Node.js + Express.js + MySQL

---

## 📁 Project Folder Structure
```
lost-and-found/
│
├── server.js              ← Backend entry point
├── package.json           ← Node dependencies
├── database.sql           ← SQL: creates DB, tables, sample data
│
└── public/                ← Frontend (served by Express)
    ├── index.html         ← Home page
    ├── css/
    │   └── style.css      ← All styles (dark theme)
    ├── js/
    │   └── api.js         ← Shared fetch helpers
    └── pages/
        ├── report-lost.html   ← Report a lost item
        ├── report-found.html  ← Report a found item
        ├── claims.html        ← View & manage all claims
        └── login.html         ← Admin login
```

---

## ✨ Features

- 📋 Report lost and found items with photo upload
- 🔍 Search items by name or location
- 🏷️ **"This is mine!"** claim system — submit ownership proof
- ✅ Admin claims page — Approve / Reject with status filters
- 🗑️ Delete items (admin only)
- 🔐 Admin login with bcrypt password hashing
- 🌙 Dark UI with animated page transitions

---

## 🗄️ Database Schema
```sql
lost_items  (id, item_name, description, location, date_lost, image)
found_items (id, item_name, location, date_found, image)
claims      (id, item_type, item_id, claimant_name, claimant_contact,
             proof_description, status, claimed_at)
admins      (id, username, password)
```

---

## 🔗 API Endpoints

| Method | Route                  | Description                  | Auth |
|--------|------------------------|------------------------------|------|
| GET    | /lost                  | Fetch all lost items         | —    |
| POST   | /lost                  | Add a lost item + image      | —    |
| DELETE | /lost/:id              | Delete a lost item           | Admin|
| GET    | /found                 | Fetch all found items        | —    |
| POST   | /found                 | Add a found item + image     | —    |
| DELETE | /found/:id             | Delete a found item          | Admin|
| POST   | /claim                 | Submit a claim               | —    |
| GET    | /claims/all            | Fetch all claims (joined)    | —    |
| PATCH  | /claims/:id/status     | Approve or reject a claim    | Admin|
| POST   | /admin/login           | Admin login                  | —    |
| POST   | /admin/logout          | Admin logout                 | —    |
| GET    | /admin/check           | Check if logged in           | —    |

---

## 🚀 Setup (4 Steps)

### Step 1 — Database
Open MySQL Workbench → File → Open SQL Script → select `database.sql` → Run (⚡)

### Step 2 — Admin Password
Create a file called `generate-hash.js` and run it to generate a bcrypt hash:
```js
const bcrypt = require('bcryptjs');
const hash = bcrypt.hashSync('admin123', 10);
console.log(hash);
```
```bash
node generate-hash.js
```

Then run this in MySQL Workbench (paste your hash):
```sql
USE lost_and_found_db;
DELETE FROM admins WHERE id > 0;
INSERT INTO admins (username, password) VALUES ('admin', 'YOUR_HASH_HERE');
```

### Step 3 — Install packages
```bash
npm install
```

### Step 4 — Start the server
```bash
npm run dev
```

Open → **http://localhost:3000**

---

## 🌐 Pages

| URL             | Page                              |
|-----------------|-----------------------------------|
| /               | Home — view lost & found items    |
| /report-lost    | Report a lost item (with photo)   |
| /report-found   | Report a found item (with photo)  |
| /claims         | View & manage all claim requests  |
| /login          | Admin login                       |

---

## 🔐 Admin Login

Default credentials:
- **Username:** `admin`
- **Password:** `admin123`

Admin can:
- Delete lost and found items
- Approve or reject claims

---

## 🛠 Tech Stack

| Layer    | Technology                        |
|----------|-----------------------------------|
| Frontend | HTML, CSS, JavaScript (Vanilla)   |
| Backend  | Node.js, Express.js               |
| Database | MySQL                             |
| Auth     | express-session + bcryptjs        |
| Upload   | multer                            |
| Dev tool | nodemon                           |

---

*DBMS Mini Project — Lost and Found Management System*