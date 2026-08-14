const Database = require("better-sqlite3");
const path = require("path");

const db = new Database(path.join(__dirname, "luk_academy.db"));
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

db.exec(`
CREATE TABLE IF NOT EXISTS admins (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  key TEXT UNIQUE NOT NULL,
  name_fr TEXT NOT NULL,
  name_en TEXT NOT NULL,
  description_fr TEXT,
  description_en TEXT,
  sort_order INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS statuses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  key TEXT UNIQUE NOT NULL,
  label_fr TEXT NOT NULL,
  label_en TEXT NOT NULL,
  show_return_notice INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS levels (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  key TEXT UNIQUE NOT NULL,
  label_fr TEXT NOT NULL,
  label_en TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS cars (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  brand TEXT,
  model TEXT,
  category_key TEXT NOT NULL,
  level_key TEXT NOT NULL,
  status_key TEXT NOT NULL,
  description_fr TEXT,
  description_en TEXT,
  main_photo TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (category_key) REFERENCES categories(key),
  FOREIGN KEY (level_key) REFERENCES levels(key),
  FOREIGN KEY (status_key) REFERENCES statuses(key)
);

CREATE TABLE IF NOT EXISTS car_photos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  car_id INTEGER NOT NULL,
  url TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  FOREIGN KEY (car_id) REFERENCES cars(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS instructors (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  country_fr TEXT NOT NULL,
  country_en TEXT NOT NULL,
  flag_emoji TEXT,
  specialty_fr TEXT NOT NULL,
  specialty_en TEXT NOT NULL,
  photo TEXT,
  sort_order INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS trainings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name_fr TEXT NOT NULL,
  name_en TEXT NOT NULL,
  description_fr TEXT,
  description_en TEXT,
  level_key TEXT,
  category_key TEXT,
  instructor_id INTEGER,
  sort_order INTEGER DEFAULT 0,
  FOREIGN KEY (instructor_id) REFERENCES instructors(id)
);

CREATE TABLE IF NOT EXISTS events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title_fr TEXT NOT NULL,
  title_en TEXT NOT NULL,
  description_fr TEXT,
  description_en TEXT,
  date TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS applications (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  pseudo TEXT NOT NULL,
  full_name TEXT,
  country TEXT NOT NULL,
  age INTEGER NOT NULL,
  desired_category TEXT,
  driving_level TEXT,
  race_experience TEXT,
  motivation TEXT,
  discord_id TEXT,
  photo TEXT,
  status TEXT DEFAULT 'nouvelle',
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS site_texts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  text_key TEXT UNIQUE NOT NULL,
  value_fr TEXT,
  value_en TEXT
);
`);

module.exports = db;
