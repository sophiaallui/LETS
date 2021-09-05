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

/* GET /messages **/
describe("GET /messages", () => {
  test("works for admin:", async () => {
    const res = await request(app)
      .get("/messages")
      .set("authorization", `Bearer ${adminToken}`);
    expect(res.body).toEqual({
      messages: [
        {
          id: expect.any(Number),
          sent_by: "test11",
          sent_to: "test22",
          text: "admin sending non-admin message",
          created_at: expect.any(String),
        },
        {
          id: expect.any(Number),
          sent_by: "test22",
          sent_to: "test33",
          text: "regular user sending message",
          created_at: expect.any(String),
        },
        {
          created_at: expect.any(String),
          id: expect.any(Number),
          sent_by: "test33",
          sent_to: "test22",
          text: "testMsg",
        },
      ],
    });
  });
  test("anauth for non-admin", async () => {
    const res = await request(app)
      .get("/messages")
      .set("authorization", `Bearer ${test2Token}`);
    expect(res.statusCode).toEqual(401);
  });
  test("anauth for anon", async () => {
    const res = await request(app).get("/messages");
    expect(res.statusCode).toEqual(401);
  });
});

/** POST /messages/:username/to/:toUsername */
describe("POST /messages/:username/to/:username", () => {
  test("works for admin", async () => {
    const res = await request(app)
      .post("/messages/test1Admin/to/test22")
      .send({
        text: "sending from admin",
      })
      .set("authorization", `Bearer ${adminToken}`);
    expect(res.body).toEqual({
      message: {
        id: expect.any(Number),
        sentBy: "test1Admin",
        sentTo: "test22",
        text: "sending from admin",
        createdAt: expect.any(String),
      },
    });
  });
  test("works for :username same as logged in user", async () => {
    const res = await request(app)
      .post("/messages/test22/to/test33")
      .send({
        text: "LMAO xD",
      })
      .set("authorization", `Bearer ${test2Token}`);
    expect(res.body).toEqual({
      message: {
        id: expect.any(Number),
        sentBy: "test22",
        sentTo: "test33",
        text: "LMAO xD",
        createdAt: expect.any(String),
      },
    });
  });
  test("unauth for invalid users", async () => {
    const res = await request(app)
      .post("/messages/test33/to/test22")
      .send({
        text: "LMAO xD",
      })
      .set("authorization", `Bearer ${test2Token}`);
    expect(res.statusCode).toEqual(401);
  });
  test("unauth for anons", async () => {
    const res = await request(app).post("/messages/test22/to/test33");
    expect(res.statusCode).toEqual(401);
  });
  test("bad request error for invalid inputs", async () => {
    const res = await request(app)
      .post("/messages/test1Admin/to/test22")
      .send({
        text: Infinity,
      })
      .set("authorization", `Bearer ${adminToken}`);
    expect(res.statusCode).toBe(400);
  });
});

/** DELETE /messages/:username/delete/:messageId */
describe("Delete /messages/:username/delete/:messageId", () => {
  test("works for admin", async () => {
    const msgResults = await db.query(`INSERT INTO messages 
      (sent_by, sent_to, text) 
      VALUES 
      ('test22', 'test33', 'someMsg')
      RETURNING *`);
    const message = msgResults.rows[0];
    const res = await request(app)
      .delete(`/messages/test22/delete/${message.id}`)
      .set("authorization", `Bearer ${adminToken}`);
    expect(res.body).toEqual({ deletedMessage: String(message.id) });
  });

  test("works for correct users", async () => {
    const msgResults = await db.query(`INSERT INTO messages 
    (sent_by, sent_to, text) 
    VALUES 
    ('test22', 'test33', 'someMsg')
    RETURNING *`);
    const message = msgResults.rows[0];
    const res = await request(app)
      .delete(`/messages/test22/delete/${message.id}`)
      .set("authorization", `Bearer ${test2Token}`);
    expect(res.body).toEqual({ deletedMessage: String(message.id) });
  });

  test("unauth for non-correct users", async () => {
    const res = await request(app)
      .delete("/messages/test22/delete/3")
      .set("authorization", `Bearer ${test3Token}`);
    expect(res.statusCode).toEqual(401);
  });

  test("unauth for anons", async () => {
    const res = await request(app).delete("/messages/test22/delete/3");
    expect(res.statusCode).toEqual(401)
  })
});
