CREATE TABLE users (
  username VARCHAR(25) PRIMARY KEY UNIQUE,
  email TEXT NOT NULL
    CHECK (position('@' IN email) > 1) UNIQUE,
  password TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  is_admin BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE users_friends (
  user_being_followed_id VARCHAR(25) REFERENCES users ON DELETE CASCADE,
  user_following_id VARCHAR(25) REFERENCES users ON DELETE CASCADE
);

CREATE TABLE messages (
  id SERIAL PRIMARY KEY,
  sent_by VARCHAR(25) NOT NULL REFERENCES users (username) ON DELETE CASCADE,
  sent_to VARCHAR(25) NOT NULL REFERENCES users (username) ON DELETE CASCADE,
  text TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

