# Proposal
1. Social Media App for something (we can discuss what the main gig for this one is together :) )

# DB Schema 
## Users Table
  - Since all social media platforms are going to require some basic user information, I've just got started with the users first.
  - We can always add additional columns that we think might be neccessary as we go.
  - For now it'll look something like this:
  `create table users (
    id SERIAL PRIMARY KEY,
    email varchar(254) NOT NULL UNIQUE,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    firstName TEXT NOT NULL,
    lastName TEXT NOT NULL,,
    isAdmin BOOLEAN default false
  )`

