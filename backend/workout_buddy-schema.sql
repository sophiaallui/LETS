CREATE TABLE users (
  username VARCHAR(25) PRIMARY KEY UNIQUE,
  email TEXT NOT NULL CHECK (position('@' IN email) > 1),
  password TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  profile_image TEXT DEFAULT NULL,
  cover_picture TEXT DEFAULT NULL,
  is_admin BOOLEAN NOT NULL DEFAULT FALSE
);


CREATE TABLE rooms (
  id SERIAL PRIMARY KEY,
  name VARCHAR(34),
  created_by VARCHAR(25) REFERENCES users(username) ON DELETE CASCADE
);

CREATE TABLE participants (
  id SERIAL PRIMARY KEY,
  username VARCHAR(25) REFERENCES users(username) ON DELETE CASCADE,
  room_id INT REFERENCES rooms(id) ON DELETE CASCADE
);

CREATE TABLE messages (
  id SERIAL PRIMARY KEY,
  sent_by VARCHAR(25) REFERENCES users(username) ON DELETE CASCADE,
  text TEXT NOT NULL,
  room_id INT REFERENCES rooms(id) ON DELETE CASCADE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);


CREATE TABLE goals (
  id SERIAL PRIMARY KEY,
  created_by VARCHAR(25) REFERENCES users(username) ON DELETE CASCADE,
  content TEXT NOT NULL,
  due_date TIMESTAMP NOT NULL,
  is_complete BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE calendar_event (
  id SERIAL PRIMARY KEY,
  posted_by VARCHAR(25) REFERENCES users(username) ON DELETE CASCADE,
  event_title TEXT NOT NULL,
  event_description TEXT,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  radios TEXT NOT NULL
);

CREATE TABLE posts (
  id SERIAL PRIMARY KEY,
  posted_by VARCHAR(25) REFERENCES users(username) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  image TEXT DEFAULT NULL 
);

CREATE TABLE posts_comments (
  id SERIAL PRIMARY KEY,
  post_id INT REFERENCES posts(id) ON DELETE CASCADE,
  posted_by VARCHAR(25) REFERENCES users(username) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE likes (
  id SERIAL PRIMARY KEY,
  post_id INT REFERENCES posts(id) ON DELETE CASCADE DEFAULT NULL,
  comment_id INT REFERENCES posts_comments(id) ON DELETE CASCADE DEFAULT NULL,
  username VARCHAR(25) REFERENCES users(username) ON DELETE CASCADE
);

CREATE TABLE posts_comments_comments (
  id SERIAL PRIMARY KEY,
  post_id INT REFERENCES posts (id) ON DELETE CASCADE,
  post_comments_id INT REFERENCES posts_comments (id) ON DELETE CASCADE,
  posted_by VARCHAR(25) REFERENCES users(username) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);



CREATE TABLE users_measurements (
  id SERIAL PRIMARY KEY,
  created_by VARCHAR(25) REFERENCES users (username)
    ON DELETE CASCADE,
  height_in_inches FLOAT CHECK (height_in_inches >= 0.0)
    DEFAULT 0.0,
  weight_in_pounds FLOAT CHECK(weight_in_pounds >= 0.0)
    DEFAULT 0.0,
  arms_in_inches FLOAT CHECK(arms_in_inches >= 0.0)
    DEFAULT 0.0,
  legs_in_inches FLOAT CHECK(legs_in_inches >= 0.0)
    DEFAULT 0.0,
  waist_in_inches FLOAT CHECK(waist_in_inches >= 0.0)
    DEFAULT 0.0,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);


CREATE TABLE users_friends (
  user_from  VARCHAR(25) REFERENCES users ON DELETE CASCADE,
  user_to VARCHAR(25) REFERENCES users ON DELETE CASCADE,
  request_time TIMESTAMP NOT NULL DEFAULT NOW(),
  confirmed INT NOT NULL DEFAULT 0,
  PRIMARY KEY (user_from, user_to)
);

CREATE TABLE image_files (
  id SERIAL PRIMARY KEY,
  post_id INT REFERENCES posts (id) ON DELETE CASCADE,
  username VARCHAR(25) REFERENCES users (username) ON DELETE CASCADE,
  filename TEXT NOT NULL,
  filepath TEXT NOT NULL,
  mimetype TEXT NOT NULL,
  size BIGINT NOT NULL
);