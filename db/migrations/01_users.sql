DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS interests CASCADE;
DROP TABLE IF EXISTS maps CASCADE;
DROP TABLE IF EXISTS markers CASCADE;
DROP TABLE IF EXISTS favourites CASCADE;

CREATE TABLE users (
  id SERIAL PRIMARY KEY NOT NULL,
  name VARCHAR(255) DEFAULT NULL,
  email VARCHAR(255) NOT NULL,
  password VARCHAR(255) DEFAULT NULL
);

CREATE TABLE interests (
  id SERIAL PRIMARY KEY NOT NULL,
<<<<<<< HEAD:migrations/1_users.sql
  name VARCHAR(255) NOT NULL,
);

CREATE TABLE markers (
  id SERIAL PRIMARY KEY NOT NULL,
  map_id INTEGER REFRENCES maps(id),
  x_coordinate DECIMAL(8, 6) NOT NULL,
  y_coordinate DECIMAL(8, 6) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMP
=======
  name VARCHAR(255) NOT NULL
>>>>>>> origin:db/migrations/01_users.sql
);

CREATE TABLE maps (
  id SERIAL PRIMARY KEY NOT NULL,
  owner_id INTEGER REFERENCES users(id) NOT NULL,
  interest_id INTEGER REFERENCES interests(id) NOT NULL,
  name VARCHAR(32) DEFAULT 'My Map',
  created_at TIMESTAMP,
  last_edited TIMESTAMP
);

CREATE TABLE markers (
  id SERIAL PRIMARY KEY NOT NULL,
  map_id INTEGER REFERENCES maps(id) NOT NULL,
  x_coordinate DECIMAL(5, 3) NOT NULL,
  y_coordinate DECIMAL(5, 3) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT DEFAULT NULL,
  created_at TIMESTAMP
);

CREATE TABLE favourites (
  id SERIAL PRIMARY KEY NOT NULL,
  user_id INTEGER REFERENCES users(id),
  map_id INTEGER REFERENCES maps(id),
  created_at TIMESTAMP
);

