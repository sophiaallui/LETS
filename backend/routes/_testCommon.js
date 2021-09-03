const bcrypt = require("bcrypt");
const db = require("../db");
const { BCRYPT_WORK_FACTOR } = require("../config");

async function commonBeforeAll() {
  await db.query("DELETE FROM messages");
  await db.query("DELETE FROM users_friends");
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

module.exports = {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll
}