CREATE TABLE users (
  username VARCHAR(25) PRIMARY KEY UNIQUE,
  email TEXT NOT NULL
    CHECK (position('@' IN email) > 1) UNIQUE,
  password TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  is_admin BOOLEAN NOT NULL DEFAULT FALSE
);

  -- If you want to see all friends that are pending test1's acceptance, you'd search for:
  -- any records from the friends table where user_from = 'test1'
  -- AND confirmed = 0 ... which means it hasn't been accepted yet.


-- If you want to see all friends a user had requested but which haven't been accepted you'd look for:

--   any records from the friends table where user_to = the user you're looking for
--   AND confirmed = 0 ... which means it hasn't been accepted yet.

CREATE TABLE users_friends (
  user_from PRIMARY KEY VARCHAR(25) REFERENCES users ON DELETE CASCADE,
  user_to PRIMARY KEY VARCHAR(25) REFERENCES users ON DELETE CASCADE,
  request_time TIMESTAMP,
  confirmed INT NOT NULL DEFAULT 0,
);

CREATE TABLE posts (
  post_id SERIAL PRIMARY KEY,
  posted_by VARCHAR(25) NOT NULL REFERENCES users (username) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
);

CREATE TABLE posts_comments (
  comment_id SERIAL PRIMARY KEY,
  post_id INT REFERENCES posts (post_id) ON DELETE CASCADE,
  posted_by VARCHAR(25) NOT NULL REFERENCES users (username) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE posts_comments_comments (
  comments_comment_id SERIAL PRIMARY KEY,
  
  post_id INT REFERENCES posts(post_id) ON DELETE CASCADE,
  post_comments_id INT REFERENCES posts_comments(comment_id) ON DELETE CASCADE,
  posted_by VARCHAR(25) REFERENCES users(username) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP,
)

CREATE TABLE messages (
  id SERIAL PRIMARY KEY,
  sent_by VARCHAR(25) NOT NULL REFERENCES users (username) ON DELETE CASCADE,
  sent_to VARCHAR(25) NOT NULL REFERENCES users (username) ON DELETE CASCADE,
  text TEXT NOT NULL,
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
