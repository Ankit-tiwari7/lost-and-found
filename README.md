# 🔍 Lost and Found Management System
### DBMS Mini Project — Node.js + Express.js + MySQL

---

## 📁 Project Folder Structure

```
lost-and-found/
│
├── server.js              ← Backend entry point (Node.js + Express)
├── package.json           ← Node dependencies
├── database.sql           ← SQL to create DB and tables
│
└── public/                ← Frontend (served by Express)
    ├── index.html         ← Home page
    ├── css/
    │   └── style.css      ← All styles
    ├── js/
    │   ├── api.js         ← Fetch API helper functions
    │   ├── home.js        ← Home page logic
    │   ├── report-lost.js ← Lost form logic
    │   └── report-found.js← Found form logic
    └── pages/
        ├── report-lost.html  ← Report Lost page
        └── report-found.html ← Report Found page
```

---

## ⚙️ Prerequisites

Make sure you have the following installed:
- [Node.js](https://nodejs.org/) (v16 or newer)
- [MySQL](https://www.mysql.com/) (v8 or newer)

---

## 🚀 Setup Instructions (Step-by-Step)

### Step 1: Set up the Database

1. Open **MySQL Workbench** or the MySQL command line.
2. Run the contents of `database.sql`:

```sql
source /path/to/lost-and-found/database.sql
```

Or copy-paste the SQL file content directly into your MySQL client.

This will:
- Create database `lost_and_found_db`
- Create tables `lost_items` and `found_items`
- Insert 3 sample rows in each table for testing

---

### Step 2: Configure Database Credentials

Open `server.js` and update lines 20–21:

```js
const db = mysql.createConnection({
    host:     'localhost',
    user:     'root',      // ← Your MySQL username
    password: '',          // ← Your MySQL password
    database: 'lost_and_found_db'
});
```

---

### Step 3: Install Node.js Dependencies

Open a terminal in the `lost-and-found/` folder:

```bash
npm install
```

This installs: `express`, `mysql2`, `cors`

---

### Step 4: Start the Server

```bash
node server.js
```

You should see:
```
✅ Connected to MySQL database: lost_and_found_db
🚀 Server running at http://localhost:3000
```

---

### Step 5: Open the Website

Open your browser and go to:

```
http://localhost:3000
```

---

## 🌐 Pages

| URL              | Page                |
|------------------|---------------------|
| `/`              | Home (view all items) |
| `/report-lost`   | Report a Lost Item  |
| `/report-found`  | Report a Found Item |

---

## 🔗 API Endpoints

| Method | Route    | Description          |
|--------|----------|----------------------|
| GET    | /lost    | Fetch all lost items |
| POST   | /lost    | Add a lost item      |
| GET    | /found   | Fetch all found items|
| POST   | /found   | Add a found item     |

### Example POST /lost body:
```json
{
  "item_name": "Blue Backpack",
  "description": "Nike backpack with red keychain",
  "location": "Library 2nd Floor",
  "date_lost": "2025-03-10"
}
```

### Example POST /found body:
```json
{
  "item_name": "Black Umbrella",
  "location": "Main Gate",
  "date_found": "2025-03-10"
}
```

---

## 🗄️ Database Schema

```sql
lost_items (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    item_name   VARCHAR(100) NOT NULL,
    description TEXT,
    location    VARCHAR(150) NOT NULL,
    date_lost   DATE NOT NULL
);

found_items (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    item_name   VARCHAR(100) NOT NULL,
    location    VARCHAR(150) NOT NULL,
    date_found  DATE NOT NULL
);
```

---

## 🛠 Tech Stack

| Layer    | Technology          |
|----------|---------------------|
| Frontend | HTML, CSS, JavaScript (Vanilla) |
| Backend  | Node.js, Express.js |
| Database | MySQL               |
| Driver   | mysql2 (npm)        |

---

*DBMS Mini Project — Lost and Found Management System*
