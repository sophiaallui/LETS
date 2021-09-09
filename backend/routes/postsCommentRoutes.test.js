"use strict";
const request = require("supertest");
const app = require("../app");
const db = require("../db");
const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  test3Token,
  adminToken,
  test2Token,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/** postsCommentsRoutes */
// GET /comments/[postId]
describe("GET /comments/:postId", () => {
  test("works for logged in", async () => {
    const res = await request(app)
      .get("/comments/2")
      .set("authorization", `Bearer ${test3Token}`);
    expect(res.body).toEqual({
      comments: [
        {
          id: 2,
          postId: 2,
          postedBy: "test22",
          content: "yours suck too",
          createdAt: expect.any(String),
        },
        {
          id: 3,
          postId: 2,
          postedBy: "test22",
          content: "testingComment",
          createdAt: expect.any(String),
        },
      ],
    });
  });

  test("unauth for anon", async () => {
    const res = await request(app).get("/comments/2");
    expect(res.statusCode).toEqual(401);
  });
});

// GET /comments/
describe("GET /comments", () => {
  test("works for logged in users", async () => {
    const res = await request(app)
      .get("/comments")
      .set("authorization", `Bearer ${test3Token}`);
    expect(res.body).toEqual({
      comments: [
        {
          id: 1,
          postId: 1,
          postedBy: "test33",
          content: "this post sucks",
          createdAt: expect.any(String),
        },
        {
          id: 2,
          postId: 2,
          postedBy: "test22",
          content: "yours suck too",
          createdAt: expect.any(String),
        },
        {
          id: 3,
          postId: 2,
          postedBy: "test22",
          content: "testingComment",
          createdAt: expect.any(String),
        },
      ],
    });
  });

  test("unauth for anon", async () => {
    const res = await request(app).get("/comments");
    expect(res.statusCode).toEqual(401);
  });
});

// POST /comments/:postId/:username
describe("POST /comments/:postId/:username", () => {
  test("works for admin", async () => {
    const res = await request(app)
      .post("/comments/2/test22")
      .send({
        content: "commenting on post id 2",
      })
      .set("authorization", `Bearer ${adminToken}`);
    expect(res.body).toEqual({
      comment: {
        id: expect.any(Number),
        postId: 2,
        postedBy: "test22",
        content: "commenting on post id 2",
        createdAt: expect.any(String),
      },
    });
  });

  test("uanuth for invalid user", async () => {
    const res = await request(app)
      .post("/comments/2/test22")
      .send({
        content: "commenting on post id 2",
      })
      .set("authorization", `Bearer ${test3Token}`);
    expect(res.statusCode).toEqual(401);
  });

  test("unauth for anon", async () => {
    const res = await request(app)
      .post("/comments/2/test22")
      .send({
        content: "commenting on post id 2",
      });
      expect(res.statusCode).toBe(401)
  });

  test("bad request error for invalid inputs", async () => {
    const res = await request(app).post("/comments/2/test11").send({
      content : Infinity
    })
    .set("authorization", `Bearer ${adminToken}`);
    expect(res.statusCode).toEqual(400)
  });
});

// DELETE /comments/:postId/:username/:commentId
describe("DELETE /comments/[postId]/[username]/[commentId]", () => {
  test("works for admin", async () => {
    const res = await request(app).delete('/comments/2/test22/2').set("authorization", `Bearer ${adminToken}`);
    expect(res.body).toEqual({ deleted : "2" });
    const res2 = await db.query(`SELECT * FROM posts_comments WHERE  id = 2`);
    expect(res2.rows.length).toEqual(0)
  });

  test("works for valid users", async () => {
    const res = await request(app).delete('/comments/2/test22/2').set("authorization", `Bearer ${test2Token}`);
    expect(res.body).toEqual({ deleted : "2" });
    const res2 = await db.query(`SELECT * FROM posts_comments WHERE  id = 2`);
    expect(res2.rows.length).toEqual(0)
  });

  test("unauth for invalid users", async () => {
    const res = await request(app).delete('/comments/2/test22/2').set("authorization", `Bearer ${test3Token}`);
    expect(res.statusCode).toEqual(401);
  });

  test("unauth for anon", async () => {
    const res = await request(app).delete('/comments/2/test22/2');
    expect(res.statusCode).toEqual(401)
  });
});




