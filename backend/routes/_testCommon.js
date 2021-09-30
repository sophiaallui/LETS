"use strict";

const bcrypt = require("bcryptjs");
const db = require("../db");
const { BCRYPT_WORK_FACTOR } = require("../config");
const User = require("../models/user");
const { createToken } = require("../helpers/tokens");


async function commonBeforeAll() {
  await db.query("DELETE FROM users_friends")
  await db.query("DELETE FROM posts_comments_comments")
  await db.query("DELETE FROM posts_comments");
  await db.query("DELETE FROM posts");
  await db.query("DELETE FROM messages");
  await db.query("DELETE FROM users_friends");
  await db.query("DELETE FROM image_files");
  await db.query("DELETE FROM messages");
  await db.query("DELETE FROM users");
 
  
  await db.query(
    `INSERT INTO users (username, email, password, first_name, last_name, is_admin)
    VALUES ('test1Admin', 'test1Admin@test.com', $1, 'testFirstName', 'testLastName', true),
           ('test2', 'test2@test.com', $2, 'test2FN', 'test2LN', false),
           ('test3', 'test3@test.com', $3, 'test3FN', 'test3LN', false)
    RETURNING username`,
    [
      await bcrypt.hash("password1", BCRYPT_WORK_FACTOR),
      await bcrypt.hash("password2", BCRYPT_WORK_FACTOR),
      await bcrypt.hash("password3", BCRYPT_WORK_FACTOR),
    ]
  );
  
  await User.register({
    username : "test11",
    email : "test11@test.com",
    password : "testpassword11",
    firstName : "test11F",
    lastName : "test11L",
    isAdmin : true
  });
  await User.register({
    username : "test22",
    email : "test22@test.com",
    password : "testpassword22",
    firstName : "test22F",
    lastName : "test22L",
    isAdmin : false
  });
  await User.register({
    username : "test33",
    email : "test33@test.com",
    password : "testpassword33",
    firstName : "test33F",
    lastName : "test33L",
    isAdmin : false
  });
  
  // SETUP Measurements for testing
  await db.query(
    `INSERT INTO users_measurements
    ( id, 
      created_by, 
      height_in_inches, 
      weight_in_pounds, 
      arms_in_inches, 
      legs_in_inches, 
      waist_in_inches)
    VALUES
    (1, 'test22', 68.0, 150.0, 15.0, 27.0, 30.0),
    (2, 'test22', 69.0, 151.0, 16.0, 28.0, 31.0)`
  )
  
  // SETUP Messages for testing.
  await db.query(
    `INSERT INTO messages
      (id, sent_by, sent_to, text) 
      VALUES
      (1, 'test11', 'test22', 'admin sending non-admin message'),
      (2, 'test22', 'test33', 'regular user sending message'),
      (3, 'test33', 'test22', 'testMsg'),
      (4, 'test22', 'test33', 'something')`
  );

  
  // SETUP Posts and Comments and Post Comments Comments for testing
  await db.query(
    `INSERT INTO posts 
    (id, posted_by, content) 
    VALUES
    (1, 'test22', 'testContent1'),
    (2, 'test33', 'testContent2')`
  );

  await db.query(
    `INSERT INTO posts_comments
    (id, post_id, posted_by, content) 
    VALUES
    (1, 1, 'test33', 'this post sucks'),
    (2, 2, 'test22', 'yours suck too'),
    (3, 2, 'test22', 'testingComment')`
  );
  
  // SETUP users_friends for testing
  await db.query(
    `INSERT INTO users_friends 
    (user_from, user_to, confirmed)
      VALUES
        ('test11', 'test22', 0),
        ('test11', 'test33', 1),
        ('test33', 'test22', 0),
        ('test11', 'test3', 1)`
  );

  // SETUP goals for testing
  const dueDate = new Date(2021, 10, 17, 3, 24, 0);
  const dueDate2 = new Date(2022, 10, 17, 3, 24, 0);
  await db.query(
    `INSERT INTO goals
      (id, created_by, content, due_date, is_complete) VALUES
      (1, 'test11', 'testing content', $1, 'FALSE'),
      (2, 'test11', 'testing content2', $2, 'FALSE')`, 
    [dueDate, dueDate2]
  );

  //  SETUP calendar_event for testing

  await db.query(
    `INSERT INTO calendar_event
      (id, posted_by, event_title, start_date, end_date, radios)
        VALUES  
      (1, 'test11', 'test11s title', '2021/10/31', '2021/11/1', 'bg-info'),
      (2, 'test22', 'test22s title', '2021/10/31', '2021/11/1', 'bg-danger')
    `
  )
}

async function commonBeforeEach() {
  await db.query("BEGIN")
}

async function commonAfterEach() {
  await db.query("ROLLBACK")
}

async function commonAfterAll() {
  await db.end();
}


const adminToken = createToken({ username : "test11", isAdmin : true });
const test2Token = createToken({ username : "test22", isAdmin : false });
const test3Token = createToken({ username : "test33", isAdmin : false });
module.exports = {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  adminToken,
  test2Token,
  test3Token
}