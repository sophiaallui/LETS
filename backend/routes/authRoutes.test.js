"use strict";
const request = require("supertest");
const app = require("../app");
const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/** POST /auth/token */
describe("POST /auth/token", () => {
  test("works", async () => {
    const res = await request(app)
      .post("/auth/token")
      .send({
        username: "test1Admin",
        password: "password1"
      });
    expect(res.body).toEqual({
      "token": expect.any(String)
    })
  });

  test("unauth with non-existent user", async () => {
    const res = await request(app).post("/auth/token").send({
      username: "I DONT EXIST LMAOOO",
      password: "password1"
    });
    expect(res.statusCode).toBe(401)
  });

  test("unauth with wrong password", async () => {
    const res = await request(app).post("/auth/token").send({
      username: "test1Admin",
      password: "password2"
    });
    expect(res.statusCode).toBe(401)
  });

  test("bad request with missing data", async () => {
    const res = await request(app).post("/auth/token").send({
      username: "test1Admin"
    });
    expect(res.statusCode).toEqual(400)
  });

  test("bad request with invalid data", async () => {
    const res = await request(app).post("/auth/token").send({
      username: Infinity,
      password: "above issa Infinity wth"
    });
    expect(res.statusCode).toEqual(400);
  })
});

describe("POST /auth/register", () => {
  test("works for anon", async () => {
    const res = await request(app).post("/auth/register").send({
      username: "new",
      email: "new@new.com",
      password: "password",
      firstName: "first",
      lastName: "last"
    });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toEqual({ token: expect.any(String) })
  });

  test("bad request with missing field", async () => {
    const res = await request(app).post("/auth/register").send({
      username: "new"
    });
    expect(res.statusCode).toEqual(400);
  });

  test("bad request with invalid data", async () => {
    const res = await request(app).post("/auth/register").send({
      username: "new",
      firstName: "first",
      lastName: "last",
      password: "password",
      email: "not-an-email"
    });
    expect(res.statusCode).toEqual(400);
  })
})