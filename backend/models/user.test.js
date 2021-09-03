"use strict";
const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError
} = require("../ExpressError");
const db = require("../db");
const User = require("./user");
const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll
} = require("../routes/_testCommon");
const { findAll } = require("./user");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/** authenticate */
describe("authenticate", () => {
  test("works", async () => {
    const user = await User.authenticate("test1Admin", "password1");
    expect(user).toEqual({
      username : "test1Admin",
      firstName : "testFirstName",
      lastName : "testLastName",
      email : "test1Admin@test.com",
      isAdmin : true
    })
  });

  test("unauth if no such user", async () => {
    try {
      await User.authenticate("I DONT EXIST", "LMAOOOO");
      fail();
    } catch(e) {
      expect(e instanceof UnauthorizedError).toBeTruthy();
    }
  });

  test("unauth if wrong password", async () => {
    try {
      await User.authenticate("test1Admin", "wrongPassword");
      fail();
    } catch(e) {
      expect(e instanceof UnauthorizedError).toBeTruthy();
    }
  });
});

/** register */
describe("register", () => {
  const newUser = {
    username : "new",
    email : "new@test.com",
    firstName : "first",
    lastName : "last",
    isAdmin : false
  };

  test("works", async () => {
    const user = await User.register({ ...newUser, password : "password" });
    expect(user).toEqual(newUser);
    const found = await db.query(`SELECT * FROM users WHERE username = 'new'`);
    expect(found.rows.length).toEqual(1);
    expect(found.rows[0].is_admin).toEqual(false);
    expect(found.rows[0].password.startsWith("$2b$")).toEqual(true);
  });

  test("works: adds admin", async () => {
    const user = await User.register({ ...newUser, password : "password", isAdmin : true });
    expect(user).toEqual({ ...newUser, isAdmin : true });
    const found = await db.query(`SELECT * FROM users WHERE username = 'new'`);
    expect(found.rows.length).toEqual(1);
    expect(found.rows[0].is_admin).toEqual(true);
    expect(found.rows[0].password.startsWith("$2b$")).toEqual(true);
  });

  test("bad request with dup data", async () => {
    try {
      await User.register({ ...newUser, password : "password" });
      await User.register({ ...newUser, password : "password" });
      fail();
    } 
    catch(e) {
      expect(e instanceof BadRequestError).toBeTruthy();
    }
  });
});

/** findAll */
describe("findAll", () => {
  test("works", async () => {
    const users = await User.findAll();
    expect(users).toEqual([
      {
        username : "test1Admin",
        email : "test1Admin@test.com",
        firstName : "testFirstName",
        lastName : "testLastName",
        isAdmin : true
      },
      {
        username : "test2",
        email : "test2@test.com",
        firstName : "test2FN",
        lastName : "test2LN",
        isAdmin : false
      },
      {
        username : "test3",
        email : "test3@test.com",
        firstName : "test3FN",
        lastName : "test3LN",
        isAdmin : false
      },
    ])
  });
});

