"use strict";
const request = require("supertest");
const app = require("../app");
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

describe("GET /friends/[username]", () => {
  test("works for logged in users", async () => {
    const res1 = await request(app).get("/friends/test11").set("authorization", `Bearer ${adminToken}`);
    const res2 = await request(app).get("/friends/test33").set("authorization", `Bearer ${test2Token}`);
    expect(res1.body).toEqual({
      friends: [
        {
          user_from: 'test11',
          user_to: 'test3',
          request_time: expect.any(String),
          confirmed: 1
        },
        {
          user_from: 'test11',
          user_to: 'test33',
          request_time: expect.any(String),
          confirmed: 1
        }
      ]
    });

    expect(res2.body).toEqual({
      friends: [
        {
          user_from: 'test11',
          user_to: 'test33',
          request_time: expect.any(String),
          confirmed: 1
        }
      ]
    })
  });
  test("Unauth for anons", async () => {
    const res = await request(app).get("/friends/test11");
    expect(res.statusCode).toEqual(401)
  });
});

describe("GET /friends/[username]/pending", () => {
  test("works for admin", async () => {
    const res = await request(app).get("/friends/test22/pending").set("authorization", `Bearer ${adminToken}`)
    expect(res.body).toEqual({
      requests: [
        {
          user_from: 'test11',
          user_to: 'test22',
          request_time: expect.any(String),
          confirmed: 0
        },
        {
          user_from: 'test33',
          user_to: 'test22',
          request_time: expect.any(String),
          confirmed: 0
        }
      ]
    })
  });

  test("works for same-as:username", async () => {
    const res = await request(app).get("/friends/test22/pending").set("authorization", `Bearer ${test2Token}`)
    expect(res.body).toEqual({
      requests: [
        {
          user_from: 'test11',
          user_to: 'test22',
          request_time: expect.any(String),
          confirmed: 0
        },
        {
          user_from: 'test33',
          user_to: 'test22',
          request_time: expect.any(String),
          confirmed: 0
        }
      ]
    })
  });

  test("Unauth for invalid users", async () => {
    const res = await request(app).get("/friends/test22/pending").set("authorization", `Bearer ${test3Token}`);
    expect(res.statusCode).toEqual(401)
  });

  test("Unauth for anons", async () => {
    const res = await request(app).get("/friends/test22/pending");
    expect(res.statusCode).toEqual(401)
  });
});


describe("POST /friends/[username]/to/[username2]", () => {
  test("works for admin AND if username2 already sent a request, just accept it", async () => {
    const res = await request(app).post("/friends/test22/to/test33").set("authorization", `Bearer ${adminToken}`);
    expect(res.body).toEqual({
      friendRequest: {
        userFrom: "test33",
        userTo: "test22",
        requestTime: expect.any(String),
        confirmed: 1
      }
    });
  })

  test("works for same-as:username AND if username2 already sent a request, just accept it", async () => {
    const res = await request(app).post("/friends/test22/to/test33").set("authorization", `Bearer ${test2Token}`);
    expect(res.body).toEqual({
      friendRequest: {
        userFrom: "test33",
        userTo: "test22",
        requestTime: expect.any(String),
        confirmed: 1
      }
    });
  });

  test("works for admin: fresh new request)", async () => {
    const res = await request(app).post("/friends/test22/to/test3").set("authorization", `Bearer ${adminToken}`);
    expect(res.body).toEqual({
      friendRequest: {
        userFrom: "test22",
        userTo: "test3",
        requestTime: expect.any(String),
        confirmed: 0
      }
    });
  });

  test("works for same-as:username", async () => {
    const res = await request(app).post("/friends/test22/to/test3").set("authorization", `Bearer ${test2Token}`);
    expect(res.body).toEqual({
      friendRequest: {
        userFrom: "test22",
        userTo: "test3",
        requestTime: expect.any(String),
        confirmed: 0
      }
    })
  });

  test("NotfoundError if :username does not exist", async () => {
    const res = await request(app)
      .post("/friends/I DONT EXIST/to/test33")
      .set("authorization", `Bearer ${adminToken}`);
    expect(res.statusCode).toEqual(404)
  });

  test("NotFoundError if :username2 does not exist", async () => {
    const res = await request(app)
      .post("/friends/test11/to/I DONT EXIST LMAOOOOOOooo")
      .set("authorization", `Bearer ${adminToken}`);
    expect(res.statusCode).toEqual(404);
  });
});

describe("PUT /friends/[username]/from/[username2] (Confirming friend req from username2)", () => {
  test("works for admin", async () => {
    const res = await request(app)
    .put("/friends/test22/from/test33")
    .set("authorization", `Bearer ${adminToken}`)
    expect(res.body).toEqual({
      friendRequest : {
        userFrom : "test33",
        userTo : "test22",
        requestTime : expect.any(String),
        confirmed : 1
      }
    })
  });
  test("works for same-as:username", async () => {
    const res = await request(app)
    .put("/friends/test22/from/test33")
    .set("authorization", `Bearer ${test2Token}`)
    expect(res.body).toEqual({
      friendRequest : {
        userFrom : "test33",
        userTo : "test22",
        requestTime : expect.any(String),
        confirmed : 1
      }
    })
  });
  test("Unauth for invalid users", async () => {
    const res = await request(app)
    .put("/friends/test22/from/test33")
    .set("authorization", `Bearer ${test3Token}`)
    expect(res.statusCode).toEqual(401)
  });
  test("Unauth for anons", async () => {
    const res = await request(app)
    .put("/friends/test22/from/test33");
    expect(res.statusCode).toEqual(401)
  });

});