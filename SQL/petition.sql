DROP TABLE IF EXISTS users CASCADE;
CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    first VARCHAR(255) NOT NULL,
    last VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

DROP TABLE IF EXISTS petition CASCADE;

CREATE TABLE petition(
    id SERIAL primary key,
    signature VARCHAR NOT NULL CHECK (signature != ''),
    user_id INTEGER NOT NULL REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

DROP TABLE IF EXISTS user_profiles CASCADE;
CREATE TABLE user_profiles(
    id SERIAL PRIMARY KEY,
    age INT,
    city VARCHAR(100),
    url VARCHAR(300),
    user_id INT REFERENCES users(id) NOT NULL UNIQUE
);
