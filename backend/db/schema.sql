DROP TABLE IF EXISTS reservation_items;

DROP TABLE IF EXISTS reservations;

DROP TABLE IF EXISTS users;

DROP TABLE IF EXISTS books;

CREATE TABLE users (
  id serial PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL
);

CREATE TABLE books (
  id serial PRIMARY KEY,
  title TEXT UNIQUE NOT NULL,
  author TEXT NOT NULL,
  description TEXT,
  cover_image TEXT
);

CREATE TABLE reservations (
  id serial PRIMARY KEY,
  check_in DATE,
  check_out DATE NOT NULL,
  user_id INTEGER NOT NULL REFERENCES users (id) ON DELETE CASCADE
);

CREATE TABLE reservation_items (
  id serial PRIMARY KEY,
  reservation_id INTEGER NOT NULL REFERENCES reservations (id) ON DELETE CASCADE,
  book_id INTEGER UNIQUE NOT NULL REFERENCES books (id) ON DELETE CASCADE
);
