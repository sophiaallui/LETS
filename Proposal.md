# Proposal
1. Workout buddy app
    * Users can update how often they go hit the gym to make them gainz.
    * Users can also keep track of their friends' progress for accountability.
    * 

# DB Schema 
## Users Table
  - Since all social media platforms are going to require some basic user information, I've just got started with the users first.
  - We can always add additional columns that we think might be neccessary as we go.
  - For now it'll look something like this:
    
    create table users (\
      id SERIAL PRIMARY KEY,\
      email varchar(254) NOT NULL UNIQUE,\
      username TEXT NOT NULL UNIQUE,\
      password TEXT NOT NULL,\
      firstName TEXT NOT NULL,\
      lastName TEXT NOT NULL,\
      isAdmin BOOLEAN default false\
    )

## Friends Table
  - Mapping of which users' friends
  
    create table users_friends (\
        user_being_followed_id INT PRIMARY KEY REFERENCES users ON DELETE CASCADE\
        user_following_id INT PRIMARY KEY REFERENCES users ON DELETE CASCADE\
    )

## Messages Table
  - A table to store messages you get from others' when you're slacking off at the gym lol

    create table messages (\
      id SERIAL PRIMARY KEY,\
      from TEXT NOT NULL REFERENCES users (username) ON DELETE CASCADE,\
      to TEXT NOT NULL REFERENCES users (username) ON DELETE CASCADE,\
      text TEXT NOT NULL,\
      created_at TIMESTAMP NOT NULL DEFAULT NOW()\
    )
