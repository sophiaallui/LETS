"use strict";
const request = require("supertest");
const app = require("../app");
const db = require("../db");
const User = require("../models/user");
const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  adminToken,
  test2Token,
  test3Token
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/** POST /users */
describe("POST /users", () => {
  test("works for admins: create non-admin", async () => {
    const res = await request(app).post("/users").send({
      username: "new",
      firstName: "newFirstName",
      lastName: "newLastName",
      password: "newpassword",
      email: "new@email.com",
      isAdmin: false
    })
      .set("authorization", `Bearer ${adminToken}`);
    expect(res.statusCode).toEqual(201);
    expect(res.body).toEqual({
      user: {
        username: "new",
        firstName: "newFirstName",
        lastName: "newLastName",
        email: "new@email.com",
        isAdmin: false
      },
      token: expect.any(String)
    })
  });

  test("works for admins: create admin", async () => {
    const res = await request(app).post("/users").send({
      username: "admin1",
      firstName: "admin1F",
      lastName: "admin1L",
      password: "admin1password",
      email: "admin@admin.com",
      isAdmin: true
    })
      .set("authorization", `Bearer ${adminToken}`);
    expect(res.statusCode).toEqual(201);
    expect(res.body).toEqual({
      user: {
        username: "admin1",
        firstName: "admin1F",
        lastName: "admin1L",
        email: "admin@admin.com",
        isAdmin: true
      },
      token: expect.any(String)
    })
  });

  test("unauth for users", async () => {
    const res = await request(app).post("/users").send({
      username: "u-new",
      firstName: "First-new",
      lastName: "Last-newL",
      password: "password-new",
      email: "new@email.com",
      isAdmin: true,
    }).set("authorization", `Bearer ${test2Token}`);
    expect(res.statusCode).toEqual(401);
  });

  test("unauth for anons", async () => {
    const res = await request(app).post("/users").send({
      username: "u-new",
      firstName: "First-new",
      lastName: "Last-newL",
      password: "password-new",
      email: "new@email.com",
      isAdmin: true,
    });
    expect(res.statusCode).toEqual(401);
  });

  test("bad request if missing data", async () => {
    const res = await request(app).post("/users").send({
      username: "newUsername"
    }).set("authorization", `Bearer ${adminToken}`);
    expect(res.statusCode).toEqual(400);
  });

  test("bad request if invalid data", async () => {
    const res = await request(app).post("/users").send({
      username: "u-new",
      firstName: "First-new",
      lastName: "Last-newL",
      password: "password-new",
      email: "not-an-email",
      isAdmin: true,
    })
      .set("authorization", `Bearer ${adminToken}`);
    expect(res.statusCode).toEqual(400);
  });
});

/**GET /users */
describe("GET /users", () => {
  test("works for admins", async () => {
    const res = await request(app).get("/users").set("authorization", `Bearer ${adminToken}`)
    expect(res.body).toEqual({
      users: [
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
      ]
    });
  });

  test("unauth for non-admin users", async () => {
    const res = await request(app).get("/users").set("authorization", `Bearer ${test2Token}`);
    expect(res.statusCode).toEqual(401);
  });

  test("unauth for anons", async () => {
    const res = await request(app).get("/users");
    expect(res.statusCode).toEqual(401);
  });

  test("fails: test next() handler", async () => {
    // there's no normal failure event which will cause this route to fail ---
    // thus making it hard to test that the error-handler works with it. This should cause an error.
    await db.query("DROP TABLE users CASCADE");
    const res = await request(app).get("/users").set("authorization", `Bearer ${adminToken}`);
    expect(res.statusCode).toEqual(500);
  })
});

/** GET users/:username */
describe("GET users/:username", () => {
  test("works for admin", async () => {
    const res = await request(app).get(`/users/test2`).set("authorization", `Bearer ${adminToken}`);
    expect(res.body).toEqual({
      user: {
        username: 'test2',
        email: 'test2@test.com',
        firstName: 'test2FN',
        lastName: 'test2LN',
        isAdmin: false
      }
    });
  });

  test("works for the same user", async () => {
    const res = await request(app).get(`/users/test22`).set("authorization", `Bearer ${test2Token}`);
    expect(res.body).toEqual({
      user: {
        username: 'test22',
        email: 'test22@test.com',
        firstName: 'test22F',
        lastName: 'test22L',
        isAdmin: false
      }
    })
  });

  test("unauth for other users", async () => {
    const res = await request(app).get(`/users/test22`).set("authorization", `Bearer ${test3Token}`);
    expect(res.statusCode).toEqual(401)
  });

  test("unauth for anon", async () => {
    const res = await request(app).get("/users/test22");
    expect(res.statusCode).toEqual(401)
  });

  test("not found if user not found", async () => {
    const res = await request(app).get("/users/AOSDFIUHASOIDFH").set("authorization", `Bearer ${adminToken}`);
    expect(res.statusCode).toEqual(404)
  });
});

/** PATCH /users/:username */
describe("PATCH users/:username", () => {
  test("works for admin", async () => {
    const res = await request(app).patch('/users/test22').send({
      firstName: "new"
    })
      .set("authorization", `Bearer ${adminToken}`);
    expect(res.body).toEqual({
      user: {
        username: "test22",
        email: "test22@test.com",
        firstName: "new",
        lastName: "test22L",
        isAdmin: false
      }
    })
  });

  test("works for same user", async () => {
    const res = await request(app).patch("/users/test22").send({
      email: "newEmail@email.com"
    }).set("authorization", test2Token);
    expect(res.body).toEqual({
      user: {
        username: 'test22',
        email: 'newEmail@email.com',
        firstName: 'test22F',
        lastName: 'test22L',
        isAdmin: false
      }
    })
  });

  test("unauth if not same user", async () => {
    const res = await request(app).patch("/users/test33").send({
      firstName: "newFirstName"
    })
      .set("authorization", `Bearer ${test2Token}`);
    expect(res.statusCode).toEqual(401);
  });

  test("unauth for anon", async () => {
    const res = await request(app).patch("/users/test33");
    expect(res.statusCode).toEqual(401);
  });

  test("not found if not such user", async () => {
    const res = await request(app).patch('/users/asldjkfhaslidfha').send({
      firstName: "new"
    })
      .set("authorization", `Bearer ${adminToken}`);
    expect(res.statusCode).toEqual(404)
  });

  test("bad request if invalid data", async () => {
    const res = await request(app).patch('/users/test22').send({
      firstName: Infinity,
      lastName: function () {
        return
      }
    })
      .set("authorization", `Bearer ${adminToken}`);
    expect(res.statusCode).toEqual(400)
  });

  test("works: can set new password", async () => {
    const res = await request(app).patch('/users/test22').send({
      password: "newPassword"
    })
      .set("authorization", `Bearer ${adminToken}`);
    expect(res.body).toEqual({
      user: {
        username: 'test22',
        email: 'test22@test.com',
        firstName: 'test22F',
        lastName: 'test22L',
        isAdmin: false
      }
    });

    const successful = await User.authenticate('test22', 'newPassword');
    expect(successful).toBeTruthy();
  })
});

/** DELTE /users/:username */
describe("DELETE /users/:username", function () {
  test("works for admin", async function () {
    const resp = await request(app)
        .delete(`/users/test22`)
        .set("authorization", `Bearer ${adminToken}`);
    expect(resp.body).toEqual({ deleted : "test22" });
  });

  test("works for same user", async function () {
    const resp = await request(app)
        .delete(`/users/test22`)
        .set("authorization", `Bearer ${test2Token}`);
    expect(resp.body).toEqual({ deleted : "test22" });
  });

  test("unauth if not same user", async function () {
    const resp = await request(app)
        .delete(`/users/test22`)
        .set("authorization", `Bearer ${test3Token}`);
    expect(resp.statusCode).toEqual(401);
  });

  test("unauth for anon", async function () {
    const resp = await request(app)
        .delete(`/users/test33`);
    expect(resp.statusCode).toEqual(401);
  });

  test("not found if user missing", async function () {
    const resp = await request(app)
        .delete(`/users/nope`)
        .set("authorization", `Bearer ${adminToken}`);
    expect(resp.statusCode).toEqual(404);
  });
});