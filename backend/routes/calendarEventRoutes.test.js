"use strict";
const request = require("supertest");
const app = require("../app");
const db = require("../db");
const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  adminToken,
  test2Token,
  test3Token,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

describe("GET /calendar-events/[username]", function() {
  test("works for admin", async () => {

    const res = await request(app)
      .get("/calendar-events/test11")
      .set("authorization", `Bearer ${adminToken}`);
    console.log(res.body)
  });

  test("works for same as :username", async () => {
    const res = await request(app).get("/calendar-events/test22").set("authorization", `Bearer ${test2Token}`);
    console.log(res.body)
  })

  test("Unauth for invalid users", async () => {
    const res = await request(app).get("/calendar-events/test22").set("authorization", `Bearer ${test3Token}`);
    expect(res.statusCode).toBe(401)
  });

  test("Unauth for anons", async () => {
    const res = await request(app).get("/calendar-events/test22")
    expect(res.statusCode).toBe(401)
  })
});

describe("GET /calendar-events/id/[id]", () => {
  test("works for admin:", async () => {
    const res = await request(app).get("/calendar-events/id/1").set("authorization", `Bearer ${adminToken}`);
    console.log(res.body)
  });
  test("works for signedIn users", async () => {
    const res1 = await request(app).get("/calendar-events/id/1").set("authorization", `Bearer ${test2Token}`);
    const res2 = await request(app).get("/calendar-events/id/1").set("authorization", `Bearer ${test3Token}`);
    expect(res1.statusCode).toBe(200);
    expect(res2.statusCode).toBe(200);
  });
  test("Unauth for anon", async () => {
    const res = await request(app).get("/calendar-events/id/1");
    expect(res.statusCode).toBe(401)
  });
});

describe("POST /calendar-events/[username]", () => {
  test("works for admin:", async () => {
    const data = {
      eventTitle : "some title",
      eventDescription : "test desc",
      startDate : "9/30/2021",
      endDate : "10/1/2021",
      radios : "bg-info"
    };
    const res = await request(app).post("/calendar-events/test22").send(data)
    .set("authorization", `Bearer ${adminToken}`);
    console.log(res.body)
  })
})
