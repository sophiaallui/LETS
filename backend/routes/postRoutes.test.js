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

// GET /posts/
describe("/GET /posts", () => {
  test("works for any signed-in user", async () => {
    const res = await request(app)
      .get("/posts")
      .set("authorization", `Bearer ${test2Token}`);
    expect(res.body).toEqual({
      posts: [
        {
          comments: [
            {
              comments: [],
              content: "this post sucks",
              created_at: expect.any(String),
              id: 1,
              post_id: 1,
              posted_by: "test33",
            },
          ],
          content: "testContent1",
          createdAt: expect.any(String),
          id: 1,
          postedBy: "test22",
        },
        {
          comments: [
            {
              comments: [],
              content: "yours suck too",
              created_at: expect.any(String),
              id: 2,
              post_id: 2,
              posted_by: "test22",
            },
            {
              comments: [],
              content: "testingComment",
              created_at: expect.any(String),
              id: 3,
              post_id: 2,
              posted_by: "test22",
            },
          ],
          content: "testContent2",
          createdAt: expect.any(String),
          id: 2,
          postedBy: "test33",
        },
      ],
    });
  });

  test("unauth for anons", async () => {
    const res = await request(app).get("/posts");
    expect(res.statusCode).toEqual(401);
  });
});

// GET /posts/:postId
describe("/GET /posts/:postId", () => {
  test("works for admin", async () => {
    const res = await request(app)
      .get("/posts/1")
      .set("authorization", `Bearer ${adminToken}`);
    expect(res.body).toEqual({
      post: {
        id: 1,
        postedBy: "test22",
        content: "testContent1",
        createdAt: expect.any(String),
        comments: [
          {
            comments: [],
            content: "this post sucks",
            createdAt: expect.any(String),
            id: 1,
            postId: 1,
            postedBy: "test33",
          },
        ],
      },
    });
  });

  test("works for signed-in users", async () => {
    const res = await request(app)
      .get("/posts/1")
      .set("authorization", `Bearer ${adminToken}`);
    expect(res.body).toEqual({
      post: {
        id: 1,
        postedBy: "test22",
        content: "testContent1",
        createdAt: expect.any(String),
        comments: [
          {
            comments: [],
            content: "this post sucks",
            createdAt: expect.any(String),
            id: 1,
            postId: 1,
            postedBy: "test33",
          },
        ],
      },
    });
  });

  test("unauthorized for anons", async () => {
    const res = await request(app).get("/posts/1");
    expect(res.statusCode).toEqual(401);
  });
});

// POST /posts/:username
describe("POST /posts/:username", () => {
  test("works for admin", async () => {
    const res = await request(app)
      .post("/posts/test22")
      .send({
        content: "newPostLMAO",
      })
      .set("authorization", `Bearer ${adminToken}`);
    expect(res.body).toEqual({
      post: {
        id: expect.any(Number),
        postedBy: "test22",
        content: "newPostLMAO",
        createdAt: expect.any(String),
      },
    });
  });

  test("works for same-as-:username", async () => {
    const res = await request(app)
      .post("/posts/test22")
      .send({
        content: "newPostLMAO",
      })
      .set("authorization", `Bearer ${test2Token}`);
    expect(res.body).toEqual({
      post: {
        id: expect.any(Number),
        postedBy: "test22",
        content: "newPostLMAO",
        createdAt: expect.any(String),
      },
    });
  });

  test("unauth for invalid users", async () => {
    const res = await request(app)
      .post("/posts/test11")
      .send({
        content: "newPostLMAO",
      })
      .set("authorization", `Bearer ${test2Token}`);
    expect(res.statusCode).toEqual(401);
  });

  test("unauth for anons", async () => {
    const res = await request(app).post("/posts/test11").send({
      content: "newPostLMAO",
    });
    expect(res.statusCode).toEqual(401);
  });
});

// PATCH /posts/:username/:postId
describe("PATCH /posts/:username/:postId", () => {
  test("works for admin", async () => {
    const res = await request(app)
      .patch("/posts/test22/1")
      .send({
        content: "should update to this",
      })
      .set("authorization", `Bearer ${adminToken}`);
    expect(res.body).toEqual({
      post: {
        id: 1,
        postedBy: "test22",
        content: "should update to this",
        createdAt: expect.any(String),
      },
    });
  });

  test("works for same-as-:username", async () => {
    const res = await request(app)
      .patch("/posts/test22/1")
      .send({
        content: "should update to this",
      })
      .set("authorization", `Bearer ${test2Token}`);
    expect(res.body).toEqual({
      post: {
        id: 1,
        postedBy: "test22",
        content: "should update to this",
        createdAt: expect.any(String),
      },
    });
  });

  test("unauth for invalid users", async () => {
    const res = await request(app)
      .patch("/posts/test22/1")
      .send({
        content: "should update to this",
      })
      .set("authorization", `Bearer ${test3Token}`);
    expect(res.statusCode).toEqual(401);
  });

  test("unauth for anons", async () => {
    const res = await request(app).patch("/posts/test22/1").send({
      content: "should update to this",
    });
    expect(res.statusCode).toEqual(401);
  });
});

// DELETE /posts/:username/:postId
describe("DELETE /posts/:username/:postId", () => {
  test("works for admin", async () => {
    const res = await request(app)
      .delete("/posts/test33/2")
      .set("authorization", `Bearer ${adminToken}`);
    expect(res.body).toEqual({ deleted: "2" });
    const doubleCheck = await db.query(`SELECT id FROM posts WHERE id = 2`);
    expect(doubleCheck.rows.length).toEqual(0);
  });

  test("works for same-as-:username that owns the post", async () => {
    const res = await request(app)
      .delete("/posts/test33/2")
      .set("authorization", `Bearer ${test3Token}`);
    expect(res.body).toEqual({ deleted: "2" });
    const doubleCheck = await db.query(`SELECT id FROM posts WHERE id = 2`);
    expect(doubleCheck.rows.length).toEqual(0);
  });

  test("unauth for invalid user", async () => {
    const res = await request(app)
    .delete("/posts/test33/2")
    .set("authorization", `Bearer ${test2Token}`);
    expect(res.statusCode).toEqual(401)
  });

  test("unauth for anons", async () => {
    const res = await request(app)
    .delete("/posts/test33/2")
    expect(res.statusCode).toEqual(401)
  });
});


