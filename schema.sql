-- CREATE TABLES

--psql bookstore < schema.sql

DROP TABLE IF EXISTS books;
CREATE TABLE books
(
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  image_url VARCHAR(255) NOT NULL
);

DROP TABLE IF EXISTS genres;
CREATE TABLE genres
(
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL
);

DROP TABLE IF EXISTS book_genres;
CREATE TABLE book_genres
(
  book_id INTEGER NOT NULL,
  genre_id INTEGER NOT NULL
);

DROP TABLE IF EXISTS authors;
CREATE TABLE authors
(
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  bio TEXT NOT NULL,
  image_url VARCHAR(255) NOT NULL
);

DROP TABLE IF EXISTS book_authors;
CREATE TABLE book_authors
(
  book_id INTEGER NOT NULL,
  author_id INTEGER NOT NULL
);

DROP TABLE IF EXISTS book_favorites;
CREATE TABLE book_favorites
(
  book_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL
);

DROP TABLE IF EXISTS users;
CREATE TABLE users
(
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL, -- is there an email option?
  password VARCHAR(255) NOT NULL,
  bio TEXT NOT NULL,
  image_url VARCHAR(255) NOT NULL
);


INSERT INTO
  genres (name, description)
VALUES
  ('Young Adult', 'Desc'),
  ('Sci Fi', 'Desc'),
  ('Romance', 'Desc'),
  ('Comedy', 'Desc'),
  ('Fantasy', 'Desc'),
  ('Space', 'Desc'),
  ('Aliens', 'Desc'),
  ('Strong Female Lead', 'Desc'),
  ('Dystopia', 'Desc'),
  ('Female Author', 'Desc'),
  ('Classic', 'Desc');
