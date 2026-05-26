const Database = require("better-sqlite3");
const path = require("path");

const db = new Database(path.join(__dirname, "order_system.db"));

// Enable foreign keys
db.pragma("foreign_keys = ON");

// Initialize database schema
const initializeDb = () => {
  // Users table
  db.prepare(
    `
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT CHECK(role IN ('admin', 'customer')) DEFAULT 'customer'
    )
  `,
  ).run();

  // Menu items table
  db.prepare(
    `
    CREATE TABLE IF NOT EXISTS menu_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      price REAL NOT NULL,
      image_url TEXT
    )
  `,
  ).run();

  // Orders table
  db.prepare(
    `
    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      total_price REAL NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id)
    )
  `,
  ).run();

  // Order items table
  db.prepare(
    `
    CREATE TABLE IF NOT EXISTS order_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id INTEGER NOT NULL,
      menu_item_id INTEGER NOT NULL,
      quantity INTEGER NOT NULL,
      price_at_time REAL NOT NULL,
      FOREIGN KEY (order_id) REFERENCES orders (id),
      FOREIGN KEY (menu_item_id) REFERENCES menu_items (id)
    )
  `,
  ).run();

  console.log("Database initialized successfully.");
};

module.exports = { db, initializeDb };
