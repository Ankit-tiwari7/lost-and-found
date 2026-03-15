-- ============================================================
--  Lost and Found Management System - Database Setup
--  Run this file in MySQL before starting the server
-- ============================================================

-- Step 1: Create the database
CREATE DATABASE IF NOT EXISTS lost_and_found_db;

-- Step 2: Select the database
USE lost_and_found_db;

-- Step 3: Create the lost_items table
CREATE TABLE IF NOT EXISTS lost_items (
    id          INT AUTO_INCREMENT PRIMARY KEY,   -- Unique ID for each record
    item_name   VARCHAR(100) NOT NULL,            -- Name of the lost item
    description TEXT,                             -- Detailed description
    location    VARCHAR(150) NOT NULL,            -- Where it was lost
    date_lost   DATE NOT NULL                     -- Date it was lost
);

-- Step 4: Create the found_items table
CREATE TABLE IF NOT EXISTS found_items (
    id          INT AUTO_INCREMENT PRIMARY KEY,   -- Unique ID for each record
    item_name   VARCHAR(100) NOT NULL,            -- Name of the found item
    location    VARCHAR(150) NOT NULL,            -- Where it was found
    date_found  DATE NOT NULL                     -- Date it was found
);

-- Step 5: Insert sample data for testing
INSERT INTO lost_items (item_name, description, location, date_lost) VALUES
('Blue Backpack',  'Navy blue Nike backpack with a red keychain',  'Library 2nd Floor',  '2025-03-10'),
('Student ID Card','ID card belonging to CSE Department student',  'Canteen',            '2025-03-11'),
('Water Bottle',   'Grey stainless steel bottle with stickers',    'Sports Ground',      '2025-03-12');

INSERT INTO found_items (item_name, location, date_found) VALUES
('Black Umbrella',  'Main Gate',          '2025-03-10'),
('Calculator',      'Exam Hall - Room 4', '2025-03-11'),
('Wristwatch',      'Parking Lot',        '2025-03-13');

-- Verify data
SELECT * FROM lost_items;
SELECT * FROM found_items;
