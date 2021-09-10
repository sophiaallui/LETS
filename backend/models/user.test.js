"use strict";
const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} = require("../ExpressError");
const db = require("../db");
const User = require("./user");
const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
} = require("../routes/_testCommon");


beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/** authenticate */
describe("authenticate", () => {
  test("works", async () => {
    const user = await User.authenticate("test1Admin", "password1");
    expect(user).toEqual({
      username: "test1Admin",
      firstName: "testFirstName",
      lastName: "testLastName",
      email: "test1Admin@test.com",
      isAdmin: true,
    });
  });

  test("unauth if no such user", async () => {
    try {
      await User.authenticate("I DONT EXIST", "LMAOOOO");
      fail();
    } catch (e) {
      expect(e instanceof UnauthorizedError).toBeTruthy();
    }
  });

  test("unauth if wrong password", async () => {
    try {
      await User.authenticate("test1Admin", "wrongPassword");
      fail();
    } catch (e) {
      expect(e instanceof UnauthorizedError).toBeTruthy();
    }
  });
});

/** register */
describe("register", () => {
  const newUser = {
    username: "new",
    email: "new@test.com",
    firstName: "first",
    lastName: "last",
    isAdmin: false,
  };

  test("works", async () => {
    const user = await User.register({ ...newUser, password: "password" });
    expect(user).toEqual(newUser);
    const found = await db.query(`SELECT * FROM users WHERE username = 'new'`);
    expect(found.rows.length).toEqual(1);
    expect(found.rows[0].is_admin).toEqual(false);
    expect(found.rows[0].password.startsWith("$2b$")).toEqual(true);
  });

  test("works: adds admin", async () => {
    const user = await User.register({
      ...newUser,
      password: "password",
      isAdmin: true,
    });
    expect(user).toEqual({ ...newUser, isAdmin: true });
    const found = await db.query(`SELECT * FROM users WHERE username = 'new'`);
    expect(found.rows.length).toEqual(1);
    expect(found.rows[0].is_admin).toEqual(true);
    expect(found.rows[0].password.startsWith("$2b$")).toEqual(true);
  });

  test("bad request with dup data", async () => {
    try {
      await User.register({ ...newUser, password: "password" });
      await User.register({ ...newUser, password: "password" });
      fail();
    } catch (e) {
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
        username: 'test11',
        email: 'test11@test.com',
        firstName: 'test11F',
        lastName: 'test11L',
        isAdmin: true
      },
      {
        username: 'test1Admin',
        email: 'test1Admin@test.com',
        firstName: 'testFirstName',
        lastName: 'testLastName',
        isAdmin: true
      },
      {
        username: 'test2',
        email: 'test2@test.com',
        firstName: 'test2FN',
        lastName: 'test2LN',
        isAdmin: false
      },
      {
        username: 'test22',
        email: 'test22@test.com',
        firstName: 'test22F',
        lastName: 'test22L',
        isAdmin: false
      },
      {
        username: 'test3',
        email: 'test3@test.com',
        firstName: 'test3FN',
        lastName: 'test3LN',
        isAdmin: false
      },
      {
        username: 'test33',
        email: 'test33@test.com',
        firstName: 'test33F',
        lastName: 'test33L',
        isAdmin: false
      }
    ]);
  });
});

/**  get */
describe("get", () => {
  test("works", async () => {
    const user = await User.get("test2");
    expect(user).toEqual({
      username: "test2",
      email: "test2@test.com",
      firstName: "test2FN",
      lastName: "test2LN",
      isAdmin: false,
    });
  });

  test("not found if no such user", async () => {
    try {
      await User.get("I DON'T EXIST LMAOOO");
      fail();
    } catch (e) {
      expect(e instanceof NotFoundError).toBeTruthy();
    }
  });
});

/** update */
describe("update", () => {
  const updateData = {
    firstName: "newF",
    lastName: "newF",
    email: "new@new.com",
    isAdmin: true,
  };

  test("works", async () => {
    const updatedUser = await User.update("test2", updateData);
    expect(updatedUser).toEqual({
      username: "test2",
      firstName: "newF",
      lastName: "newF",
      email: "new@new.com",
      isAdmin: true,
    });
  });

  test("works : set password", async () => {
    const updatedUser = await User.update("test3", { password: "newPassword" });
    expect(updatedUser).toEqual({
      username: "test3",
      firstName: "test3FN",
      lastName: "test3LN",
      email: "test3@test.com",
      isAdmin: false,
    });
    const found = await db.query(
      `SELECT * FROM users WHERE username = 'test3'`
    );
    expect(found.rows.length).toEqual(1);
    expect(found.rows[0].password.startsWith("$2b$")).toEqual(true);
  });

  test("not found if no such user", async () => {
    try {
      await User.update("NOPEEE", { firstName: "test" });
      fail();
    } catch (e) {
      expect(e instanceof NotFoundError).toBeTruthy();
    }
  });

  test("bad request if no data", async () => {
    expect.assertions(1);
    try {
      await User.update("test2", {});
    } catch (e) {
      expect(e instanceof BadRequestError).toBeTruthy();
    }
  });
});

/** remove */
describe("remove", () => {
  test("works", async () => {
    await User.remove("test2");
    const res = await db.query(`SELECT * FROM users WHERE username = 'test2'`);
    expect(res.rows.length).toEqual(0);
  });

  test("not found if no such user", async () => {
    try {
      await User.remove('ASLDKFHASDLK');
      fail();
    } catch(e) {
      expect(e instanceof NotFoundError).toBeTruthy();
    }
  });
});


/** User Measurements Tests  */
describe("postMeasurements", () => {
  const measurementsData = {
    createdBy : 'test22',
    heightInInches : 68.5,
    weightInPounds : 151.5,
    armsInInches : 99.0,
  }
  test("works", async () => {
    const res = await User.postMeasurements("test22", measurementsData);
    expect(res).toEqual({ 
      id: expect.any(Number),
      createdBy: 'test22',
      heightInInches: 68.5,
      weightInPounds: 151.5,
      armsInInches: 99,
      legsInInches: 0,
      createdAt: expect.any(Date)
    })
  });
  test("Not found error if username does not exist", async () => {
    try {
      await User.postMeasurements("I DONT EXIST", measurementsData);
      fail();
    } catch(e) {
      expect(e instanceof NotFoundError).toBeTruthy();
    }
  });
});

describe("getMeasurements")
